import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { clientAddress, consumeRateLimit } from "@/lib/security/rateLimit";
import { getSiteEditorSettings, type SiteEditorSettings } from "@/lib/cms/siteEditor";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 24_000;
const MAX_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 1200;
const RATE_LIMIT_REQUESTS = 8;
const RATE_LIMIT_WINDOW_MS = 60_000;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const foundationInformation = (settings: SiteEditorSettings) => `
You are the official AI assistant for The Guvnor Ace Foundation.

IDENTITY
The Guvnor Ace Foundation is a charitable organisation supporting vulnerable
children, families and communities in Uganda.

LOCATION
${settings.contact.location}

PROGRAMME AREAS
- Food assistance and nutrition
- Education support and learning materials
- Healthcare support
- Child protection and safeguarding
- Community outreach
- Sustainable opportunities for vulnerable families

OFFICIAL CONTACT DETAILS
Phone: ${settings.contact.phoneDisplay}
Email: ${settings.contact.email}

OFFICIAL LINKS
PayPal: ${settings.donations.paypal}
GoFundMe: ${settings.donations.goFundMe}
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
- Explain how to donate only through the approved PayPal, GoFundMe or Airtel Money options.
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

function jsonResponse(
  body: Record<string, string>,
  status = 200,
  extraHeaders: Record<string, string> = {},
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });
}

function isCrossSiteRequest(request: NextRequest) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") return true;

  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).host !== request.nextUrl.host;
  } catch {
    return true;
  }
}

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
        (candidate.role === "user" ||
          candidate.role === "assistant") &&
        typeof candidate.content === "string" &&
        candidate.content.trim().length > 0 &&
        candidate.content.length <= MAX_MESSAGE_LENGTH
      );
    })
    .slice(-MAX_MESSAGES)
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }));
}

export async function POST(request: NextRequest) {
  try {
    if (isCrossSiteRequest(request)) {
      return jsonResponse({ error: "Cross-site requests are not accepted." }, 403);
    }

    const allowed = await consumeRateLimit({
      scope: "foundation-assistant",
      subject: clientAddress(request.headers),
      limit: RATE_LIMIT_REQUESTS,
      windowSeconds: RATE_LIMIT_WINDOW_MS / 1000,
    });

    if (!allowed) {
      return jsonResponse(
        { error: "Too many requests. Please wait a minute and try again." },
        429,
        { "Retry-After": "60" },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error(
        "Foundation Assistant configuration error: API key missing",
      );

      return jsonResponse(
        {
          error:
            "The Foundation Assistant is temporarily unavailable.",
        },
        503,
      );
    }

    const contentType = request.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return jsonResponse(
        { error: "Only JSON requests are accepted." },
        415,
      );
    }

    const contentLength = Number(
      request.headers.get("content-length") || "0",
    );

    if (
      Number.isFinite(contentLength) &&
      contentLength > MAX_BODY_BYTES
    ) {
      return jsonResponse(
        { error: "Request is too large." },
        413,
      );
    }

    const rawBody = await request.text();

    if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
      return jsonResponse(
        { error: "Request is too large." },
        413,
      );
    }

    let body: unknown;

    try {
      body = JSON.parse(rawBody);
    } catch {
      return jsonResponse(
        { error: "Invalid JSON request." },
        400,
      );
    }

    if (
      !body ||
      typeof body !== "object" ||
      !("messages" in body)
    ) {
      return jsonResponse(
        { error: "Please enter a valid question." },
        400,
      );
    }

    const messages = validateMessages(
      (body as { messages?: unknown }).messages,
    );

    if (messages.length === 0) {
      return jsonResponse(
        { error: "Please enter a valid question." },
        400,
      );
    }

    const openai = new OpenAI({
      apiKey,
      timeout: 20_000,
      maxRetries: 1,
    });

    const settings = await getSiteEditorSettings();
    const response = await openai.responses.create({
      model: "gpt-5-mini",
      instructions: foundationInformation(settings),
      input: messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      max_output_tokens: 900,
      text: {
        verbosity: "medium",
      },
    });

    const answer = response.output_text?.trim();

    if (!answer) {
      console.error(
        "Foundation Assistant returned empty output",
      );

      return jsonResponse(
        {
          error:
            "The assistant could not prepare an answer. Please try again.",
        },
        502,
      );
    }

    return jsonResponse({ answer });
  } catch (error: unknown) {
    const apiError = error as {
      code?: string;
      status?: number;
    };

    console.error("Foundation Assistant request failed", {
      code: apiError.code,
      status: apiError.status,
    });

    if (
      apiError.code === "insufficient_quota" ||
      apiError.code === "credit_balance_exhausted" ||
      apiError.status === 429
    ) {
      return jsonResponse(
        {
          error:
            "Our Foundation Assistant is temporarily unavailable. Please use the contact details published on our Contact page.",
        },
        503,
      );
    }

    return jsonResponse(
      {
        error:
          "The Foundation Assistant is temporarily unavailable. Please try again later.",
      },
      500,
    );
  }
}
