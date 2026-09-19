import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

import { getSiteEditorSettings, type SiteEditorSettings } from "@/lib/cms/siteEditor";
import { chatRequestSchema } from "@/lib/security/chat-request";
import {
  consumeRateLimit,
  getClientAddress,
} from "@/lib/security/rate-limit";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 24_000;

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
Airtel Money: ${settings.donations.airtelNumber} (${settings.donations.airtelAccountName})
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

function jsonResponse(
  body: Record<string, string>,
  status = 200,
  headers: HeadersInit = {},
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
}

async function readLimitedBody(request: NextRequest) {
  if (!request.body) {
    return "";
  }

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let body = "";
  let bytesRead = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    bytesRead += value.byteLength;

    if (bytesRead > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }

    body += decoder.decode(value, { stream: true });
  }

  return body + decoder.decode();
}

export async function POST(request: NextRequest) {
  try {
    if (isCrossSiteRequest(request)) {
      return jsonResponse(
        { error: "Cross-site requests are not accepted." },
        403,
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

    const contentType = request.headers
      .get("content-type")
      ?.split(";", 1)[0]
      ?.trim()
      .toLowerCase();

    if (contentType !== "application/json") {
      return jsonResponse(
        { error: "Only JSON requests are accepted." },
        415,
      );
    }

    const contentLengthHeader = request.headers.get("content-length");
    const contentLength = contentLengthHeader
      ? Number(contentLengthHeader)
      : null;

    if (
      contentLengthHeader &&
      (!Number.isSafeInteger(contentLength) || (contentLength ?? -1) < 0)
    ) {
      return jsonResponse({ error: "Invalid request size." }, 400);
    }

    if (contentLength !== null && contentLength > MAX_BODY_BYTES) {
      return jsonResponse(
        { error: "Request is too large." },
        413,
      );
    }

    const rateLimit = await consumeRateLimit({
      scope: "foundation-assistant",
      identifier: getClientAddress(request.headers),
      limit: 12,
      windowSeconds: 60,
    });

    if (rateLimit.status === "unavailable") {
      return jsonResponse(
        { error: "The Foundation Assistant is temporarily unavailable." },
        503,
      );
    }

    if (rateLimit.status === "limited") {
      const retryAfter = Math.max(
        1,
        Math.ceil((Date.parse(rateLimit.resetAt) - Date.now()) / 1000),
      );

      return jsonResponse(
        { error: "Too many requests. Please try again shortly." },
        429,
        { "Retry-After": String(retryAfter) },
      );
    }

    const rawBody = await readLimitedBody(request);

    if (rawBody === null) {
      return jsonResponse(
        { error: "Request is too large." },
        413,
      );
    }

    if (!rawBody) {
      return jsonResponse(
        { error: "Please enter a valid question." },
        400,
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

    const parsedBody = chatRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return jsonResponse(
        { error: "Please enter a valid question." },
        400,
      );
    }

    const messages = parsedBody.data.messages;

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
    const apiError =
      error && typeof error === "object"
        ? (error as { code?: string; status?: number })
        : {};

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
            "Our Foundation Assistant is temporarily unavailable. Please contact us at guvnorace@gmail.com or +256 752 462 740.",
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
