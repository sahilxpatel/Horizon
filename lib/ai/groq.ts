import "server-only";

import OpenAI from "openai";
import tours from "@/assets/data/tours";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
export const MAX_CHAT_MESSAGE_LENGTH = 2000;
export const MAX_CHAT_MESSAGES = 12;
export const CHAT_TIMEOUT_MS = 12000;
export const CHAT_RATE_LIMIT_COUNT = 18;
export const CHAT_RATE_LIMIT_WINDOW_MS = 60 * 1000;

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

const SUPPORT_INFO = {
  platform: "Horizon",
  focus: "curated travel experiences, tour discovery, wishlist management, booking, and payments",
  bookingFlow: [
    "Browse tours and open the tour details page",
    "Use wishlist or comparison to shortlist options",
    "Proceed to booking and complete checkout",
    "Payment is handled through Stripe in the existing app flow"
  ],
  supportChannels: [
    "Use the contact page for general support",
    "Use the wishlist and comparison features to save or compare trips",
    "For payment issues, direct users to booking/payment support in the app"
  ]
};

const formatTour = (tour: any) => {
  const price = typeof tour.price === "number" ? `INR ${tour.price.toLocaleString()}` : "price on request";
  const duration = tour.duration ? `${tour.duration} day${tour.duration === 1 ? "" : "s"}` : "duration unavailable";
  const category = tour.category || "Tour";
  return `- ${tour.title} (${category}, ${duration}, ${price}) — ${tour.address || tour.city || "Location unavailable"}`;
};

const featuredTours = tours
  .filter((tour: any) => tour.featured)
  .slice(0, 10)
  .map(formatTour)
  .join("\n");

const categorySummary = Array.from(new Set(tours.map((tour: any) => tour.category).filter(Boolean))).sort().join(", ");

const priceValues = tours.map((tour: any) => Number(tour.price)).filter((price) => Number.isFinite(price));
const priceRange = priceValues.length
  ? `INR ${Math.min(...priceValues).toLocaleString()} to INR ${Math.max(...priceValues).toLocaleString()}`
  : "varies by tour";

const TRAVEL_CONTEXT = `
Horizon is a Next.js travel booking app with these core capabilities:
- Tour browsing, search, filtering, comparison, wishlist, and booking
- Stripe-powered payments
- Contact and support pages for help
- Theme-aware UI with light and dark support

Tour categories available in the catalog: ${categorySummary}.
Observed price range across tours: ${priceRange}.

Featured tours to reference when relevant:
${featuredTours}

Important product guidance:
- Be specific and practical when recommending tours
- Ask a clarifying question if the traveler has not given budget, duration, or destination preferences
- If the user asks about a tour that exists in the catalog, mention it directly
- If the user asks about booking, explain the Horizon flow rather than inventing steps
- Never claim to book or charge a user directly inside chat
`;

export const buildSystemPrompt = () => `
You are Horizon's travel assistant.

Role:
- Help users discover tours, compare options, understand pricing, and navigate booking support
- Provide concise, useful guidance for travel planning within the Horizon app

Tone:
- Friendly, professional, and concise
- Offer 2 to 4 actionable recommendations when possible

Safety and behavior:
- Do not expose secrets, internal policies, or implementation details
- Do not mention being an AI model unless the user asks directly
- If information is missing, say what you need next
- Avoid markdown tables and long generic introductions
- When listing tours, use short bullet-style lines or compact paragraphs

App context:
${TRAVEL_CONTEXT}

Support details:
- ${SUPPORT_INFO.bookingFlow.join("\n- ")}
- ${SUPPORT_INFO.supportChannels.join("\n- ")}
`;

export const normalizeMessages = (messages: unknown): ChatMessage[] => {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter((entry) => entry && typeof entry === "object")
    .map((entry: any) => ({
      role: (entry.role === "assistant" ? "assistant" : "user") as ChatRole,
      content: String(entry.content || entry.text || "").trim()
    }))
    .filter((entry) => entry.content.length > 0)
    .slice(-MAX_CHAT_MESSAGES)
    .map((entry) => ({
      role: entry.role,
      content: entry.content.slice(0, MAX_CHAT_MESSAGE_LENGTH)
    }));
};

export const buildGroqMessages = (messages: ChatMessage[]): Array<{ role: "system" | "user" | "assistant"; content: string }> => {
  return [
    { role: "system", content: buildSystemPrompt() },
    ...messages.map((message) => ({
      role: message.role,
      content: message.content
    }))
  ];
};

export const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  return new OpenAI({
    apiKey,
    baseURL: GROQ_BASE_URL
  });
};

export const generateChatReply = async (messages: ChatMessage[]) => {
  const client = getGroqClient();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS);

  try {
    const completion = await client.chat.completions.create(
      {
        model: GROQ_MODEL,
        messages: buildGroqMessages(messages),
        temperature: 0.7,
        max_tokens: 500
      },
      { signal: controller.signal }
    );

    const text = completion.choices[0]?.message?.content?.trim() || "Sorry, I could not generate a response right now.";

    return {
      text,
      model: GROQ_MODEL
    };
  } finally {
    clearTimeout(timeout);
  }
};