export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import {
  CHAT_RATE_LIMIT_COUNT,
  CHAT_RATE_LIMIT_WINDOW_MS,
  generateChatReply,
  normalizeMessages,
  MAX_CHAT_MESSAGE_LENGTH
} from "@/lib/ai/groq";
import { QUICK_SUGGESTIONS } from "@/lib/ai/chat-config";
import { badRequest, json } from "@/lib/api";

type RateEntry = {
  count: number;
  resetAt: number;
};

const globalForChat = globalThis as typeof globalThis & {
  __horizonChatRateLimit?: Map<string, RateEntry>;
};

const rateLimitStore = globalForChat.__horizonChatRateLimit || new Map<string, RateEntry>();

globalForChat.__horizonChatRateLimit = rateLimitStore;

const getClientKey = (req: NextRequest) => {
  const forwardedFor = req.headers.get("x-forwarded-for") || "";
  const ip = forwardedFor.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "anonymous";
  const userAgent = req.headers.get("user-agent") || "unknown";
  return `${ip}:${userAgent.slice(0, 32)}`;
};

const enforceRateLimit = (key: string) => {
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    const next = { count: 1, resetAt: now + CHAT_RATE_LIMIT_WINDOW_MS };
    rateLimitStore.set(key, next);
    return { allowed: true, remaining: CHAT_RATE_LIMIT_COUNT - 1, resetAt: next.resetAt };
  }

  if (current.count >= CHAT_RATE_LIMIT_COUNT) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }

  current.count += 1;
  rateLimitStore.set(key, current);

  return { allowed: true, remaining: CHAT_RATE_LIMIT_COUNT - current.count, resetAt: current.resetAt };
};

export async function POST(req: NextRequest) {
  const rateLimit = enforceRateLimit(getClientKey(req));

  if (!rateLimit.allowed) {
    return json(
      {
        success: false,
        message: "Too many chat requests. Please try again shortly.",
        meta: { retryAfterMs: Math.max(rateLimit.resetAt - Date.now(), 0) }
      },
      429
    );
  }

  try {
    const body = await req.json().catch(() => null);
    const messages = normalizeMessages(body?.messages || body?.conversation);
    const latestMessage = messages[messages.length - 1];

    if (!latestMessage || latestMessage.role !== "user") {
      return badRequest("A user message is required");
    }

    if (latestMessage.content.length > MAX_CHAT_MESSAGE_LENGTH) {
      return badRequest(`Message must be ${MAX_CHAT_MESSAGE_LENGTH} characters or fewer`);
    }

    if (messages.length === 0) {
      return badRequest("At least one message is required");
    }

    const reply = await generateChatReply(messages);

    return json({
      success: true,
      message: "Chat response generated",
      reply: reply.text,
      data: {
        reply: reply.text,
        model: reply.model,
        suggestions: QUICK_SUGGESTIONS,
        rateLimit: {
          remaining: rateLimit.remaining,
          resetAt: rateLimit.resetAt
        }
      }
    });
  } catch (error) {
    const groqError = error as { status?: number; statusText?: string; message?: string };
    const quotaExceeded = groqError?.status === 429 || /quota|rate limit/i.test(groqError?.message || "");
    const authFailure = groqError?.status === 401 || /api key|authentication/i.test(groqError?.message || "");

    console.error("[chat-api]", error);

    if (quotaExceeded) {
      return json(
        {
          success: false,
          message: "Groq quota is exhausted or rate limited right now. The chatbot is wired correctly, but the external AI request cannot complete until capacity is available."
        },
        503
      );
    }

    if (authFailure) {
      return json(
        {
          success: false,
          message: "Groq API authentication failed. Please verify GROQ_API_KEY in your environment variables."
        },
        503
      );
    }

    return json(
      {
        success: false,
        message: "The assistant is temporarily unavailable. Please try again in a moment."
      },
      500
    );
  }
}