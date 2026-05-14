import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, json, requireAuth } from "@/lib/api";
import { stripeClient, getFrontendBaseUrl } from "@/lib/stripe";
import { toNumber } from "@/lib/parse";
import { isValidDate } from "@/lib/validation";

const CURRENCY = (process.env.STRIPE_CURRENCY || "inr").toLowerCase();
const SERVICE_FEE = Number(process.env.STRIPE_SERVICE_FEE || 200);

const formatAmountForStripe = (amount: number) => Math.round(amount * 100);

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    const body = await req.json();
    const tourId = String(body?.tourId || "");
    const guestSize = toNumber(body?.guestSize) ?? 1;
    const bookAt = body?.bookAt ? new Date(body.bookAt) : null;
    const fullName = String(body?.fullName || "").trim();
    const phone = String(body?.phone || "").trim();
    const notes = body?.notes ? String(body.notes).trim() : null;

    if (!tourId || !guestSize || !bookAt || !fullName || !phone) {
      return badRequest("Missing booking information");
    }

    if (Number.isNaN(bookAt.getTime())) {
      return badRequest("Invalid booking date");
    }

    if (!isValidDate(bookAt)) {
      return badRequest("Booking date must be in the future");
    }

    const [tour, user] = await Promise.all([
      prisma.tour.findUnique({ where: { id: tourId } }),
      prisma.user.findUnique({ where: { id: auth.user.id } })
    ]);

    if (!tour) {
      return json({ success: false, message: "Tour not found" }, 404);
    }

    if (!user) {
      return json({ success: false, message: "User not found" }, 404);
    }

    const sanitizedGuestSize = Math.max(1, guestSize);
    const price = Number(tour.price) || 0;
    const subtotal = price * sanitizedGuestSize;
    const totalAmount = subtotal + SERVICE_FEE;

    const origin = getFrontendBaseUrl();

    const bookingMetadata = {
      userId: user.id,
      userEmail: user.email,
      tour: tour.id,
      tourName: tour.title,
      fullName,
      guestSize: sanitizedGuestSize,
      phone,
      bookAt: bookAt.toISOString(),
      notes
    };

    const session = await stripeClient.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      allow_promotion_codes: true,
      success_url: `${origin}/payment/status?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/tours/${tourId}?payment=cancelled`,
      currency: CURRENCY,
      payment_intent_data: {
        metadata: {
          ...bookingMetadata
        }
      },
      line_items: [
        {
          price_data: {
            currency: CURRENCY,
            unit_amount: formatAmountForStripe(price),
            product_data: {
              name: tour.title,
              description: tour.desc?.slice(0, 200) || "Tour booking",
              images: tour.photo ? [tour.photo] : undefined
            }
          },
          quantity: sanitizedGuestSize
        },
        {
          price_data: {
            currency: CURRENCY,
            unit_amount: formatAmountForStripe(SERVICE_FEE),
            product_data: {
              name: "Service fee",
              description: "Platform service charges"
            }
          },
          quantity: 1
        }
      ],
      metadata: {
        booking: JSON.stringify(bookingMetadata)
      }
    });

    await prisma.booking.upsert({
      where: { checkoutSessionId: session.id },
      update: {
        userId: user.id,
        userEmail: user.email,
        tourId: tour.id,
        tourName: tour.title,
        fullName,
        guestSize: sanitizedGuestSize,
        phone,
        bookAt,
        hasPaid: false,
        paymentStatus: "pending",
        amount: Math.round(totalAmount),
        currency: CURRENCY,
        checkoutSessionId: session.id,
        notes: notes || undefined
      },
      create: {
        userId: user.id,
        userEmail: user.email,
        tourId: tour.id,
        tourName: tour.title,
        fullName,
        guestSize: sanitizedGuestSize,
        phone,
        bookAt,
        hasPaid: false,
        paymentStatus: "pending",
        amount: Math.round(totalAmount),
        currency: CURRENCY,
        checkoutSessionId: session.id,
        notes: notes || undefined
      }
    });

    return json({
      success: true,
      url: session.url,
      sessionId: session.id
    });
  } catch (error) {
    console.error("Stripe checkout session error", error);
    return json({ success: false, message: "Unable to create checkout session" }, 500);
  }
}
