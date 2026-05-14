export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripeClient } from "@/lib/stripe";
import { json } from "@/lib/api";

const CURRENCY = (process.env.STRIPE_CURRENCY || "inr").toLowerCase();

type StripeSession = {
  id: string;
  payment_status?: string;
  payment_intent?: string | null;
  amount_total?: number | null;
  currency?: string | null;
  metadata?: Record<string, string> | null;
};

const upsertBookingFromSession = async (session: StripeSession, overrides: Record<string, unknown> = {}) => {
  let bookingPayload: Record<string, unknown> = {};

  if (session.metadata?.booking) {
    try {
      bookingPayload = JSON.parse(session.metadata.booking);
    } catch (error) {
      console.error("Failed to parse booking metadata", error);
    }
  }

  const update = {
    paymentStatus: session.payment_status || overrides.paymentStatus,
    paymentIntentId: session.payment_intent || overrides.paymentIntentId,
    checkoutSessionId: session.id,
    hasPaid: session.payment_status === "paid" || overrides.hasPaid,
    receiptUrl: overrides.receiptUrl || null,
    amount: Math.round((session.amount_total || 0) / 100),
    currency: session.currency || CURRENCY,
    notes: bookingPayload.notes,
    ...overrides
  } as Record<string, unknown>;

  const bookAtRaw = bookingPayload.bookAt ? String(bookingPayload.bookAt) : null;
  const parsedBookAt = bookAtRaw ? new Date(bookAtRaw) : new Date();

  const fallbackData = {
    userId: bookingPayload.userId,
    userEmail: bookingPayload.userEmail,
    tourId: bookingPayload.tour,
    tourName: bookingPayload.tourName,
    fullName: bookingPayload.fullName,
    guestSize: bookingPayload.guestSize ? Number(bookingPayload.guestSize) : 1,
    phone: bookingPayload.phone,
    bookAt: Number.isNaN(parsedBookAt.getTime()) ? new Date() : parsedBookAt,
    hasPaid: session.payment_status === "paid",
    paymentStatus: session.payment_status || "pending",
    paymentIntentId: session.payment_intent,
    checkoutSessionId: session.id,
    amount: Math.round((session.amount_total || 0) / 100),
    currency: session.currency || CURRENCY,
    notes: bookingPayload.notes
  };

  return prisma.booking.upsert({
    where: { checkoutSessionId: session.id },
    update,
    create: { ...fallbackData, ...overrides } as any
  });
};

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (!signature || !webhookSecret) {
      throw new Error("Missing webhook signature or secret");
    }

    const payload = await req.text();
    event = stripeClient.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    return new Response(`Webhook Error: ${(error as Error).message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as StripeSession;
        const paymentIntentId = session.payment_intent as string | null;
        let receiptUrl: string | null = null;

        if (paymentIntentId) {
          try {
            const charges = await stripeClient.charges.list({ payment_intent: paymentIntentId, limit: 1 });
            receiptUrl = charges?.data?.[0]?.receipt_url || null;
          } catch (error) {
            console.error("Failed to retrieve receipt URL from Stripe", error);
          }
        }

        await upsertBookingFromSession(session, {
          hasPaid: true,
          paymentStatus: "paid",
          receiptUrl
        });
        break;
      }
      case "checkout.session.expired": {
        const session = event.data.object as StripeSession;
        await upsertBookingFromSession(session, {
          hasPaid: false,
          paymentStatus: "failed"
        });
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as { metadata?: Record<string, string> };
        const checkoutSessionId = paymentIntent?.metadata?.checkoutSessionId;
        if (checkoutSessionId) {
          await prisma.booking.update({
            where: { checkoutSessionId },
            data: { paymentStatus: "failed", hasPaid: false }
          });
        }
        break;
      }
      default:
        break;
    }

    return json({ received: true });
  } catch (error) {
    console.error("Error handling Stripe webhook", error);
    return new Response(`Webhook handler failed: ${(error as Error).message}`, { status: 500 });
  }
}

