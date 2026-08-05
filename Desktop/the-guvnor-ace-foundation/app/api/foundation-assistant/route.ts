import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const FOUNDATION_INFORMATION = `
You are the official AI assistant for The Guvnor Ace Foundation.

IDENTITY
The Guvnor Ace Foundation is a charitable organisation supporting vulnerable
children, families and communities in Uganda.

LOCATION
Bunamwaya–Lubowa area, Entebbe Road, Wakiso District, Uganda.

PROGRAMME AREAS
- Food assistance and nutrition
- Education support and learning materials
- Healthcare support
- Child protection and safeguarding
- Community outreach
- Sustainable opportunities for vulnerable families

OFFICIAL CONTACT DETAILS
Phone: +256 752 462 740
Email: guvnorace@gmail.com

OFFICIAL LINKS
GoFundMe: https://gofund.me/07e5b2cbf
Linktree: https://linktr.ee/guvnoracefoundation
Instagram: https://instagram.com/guvnoracefoundation
TikTok: https://www.tiktok.com/@guvnoracefoundation
YouTube: https://www.youtube.com/@guvnoracefoundation
Facebook: https://www.facebook.com/profile.php?id=61592290623772

HOW TO RESPOND
- Give warm, professional and helpful answers.
- Give detailed answers when the visitor asks for details.
- Use short paragraphs and clear headings where helpful.
- Explain relevant next steps.
- Answer in English unless the visitor requests another language.
- Explain how to donate only through the approved GoFundMe or Linktree.
- Explain volunteering and partnership enquiries clearly.
- When information is unknown, say that it has not been confirmed.
- Offer the official phone number and email when human assistance is needed.

SAFETY AND TRUST RULES
- Never invent registration numbers, impact statistics, beneficiaries,
  partnerships, awards, financial records or programme results.
- Never guarantee that someone will receive financial or material assistance.
- Never request passwords, PINs, card numbers or private banking details.
- Never make medical, legal or safeguarding decisions.
- For an urgent medical or child-safety emergency, advise the visitor to
  contact appropriate local emergency or child-protection services immediately,
  and then contact the foundation directly.
- Clearly identify yourself as an AI assistant when relevant.
`;

function validateMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is ChatMessage => {
      if (!item || typeof item !== "object") {
        return false;
      }

      const candidate = item as Partial<ChatMessage>;

      return (
        (candidate.role === "user" || candidate.role === "assistant") &&
        typeof candidate.content === "string" &&
        candidate.content.trim().length > 0
      );
    })
    .slice(-12)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, 1500),
    }));
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("OPENAI_API_KEY is missing from .env.local");

      return NextResponse.json(
        {
          error:
            "The AI service has not been configured. The website administrator must add an OpenAI API key.",
        },
        { status: 500 },
      );
    }

    const body = await request.json();
    const messages = validateMessages(body.messages);

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "Please enter a valid question." },
        { status: 400 },
      );
    }

    const openai = new OpenAI({ apiKey });

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      instructions: FOUNDATION_INFORMATION,
      input: messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      max_output_tokens: 1200,
      text: {
        verbosity: "high",
      },
    });

    const answer = response.output_text?.trim();

    if (!answer) {
      console.error("OpenAI returned no output text.", response);

      return NextResponse.json(
        {
          error:
            "The assistant could not prepare an answer. Please try again.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ answer });
  } catch (error: unknown) {
    console.error("OPENAI FOUNDATION ASSISTANT ERROR:", error);

    const possibleError = error as {
      status?: number;
      code?: string;
      message?: string;
    };

    if (possibleError.status === 401) {
      return NextResponse.json(
        {
          error:
            "The OpenAI API key is invalid. The website administrator must replace it.",
        },
        { status: 500 },
      );
    }

    if (possibleError.status === 429) {
      return NextResponse.json(
        {
          error:
            "The AI account has reached its usage or billing limit. Please try again later.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? possibleError.message || "The AI request failed."
            : "The AI assistant is temporarily unavailable.",
      },
      { status: 500 },
    );
  }
}
