export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, json, requireAdmin, requireAuth } from "@/lib/api";
import { toNumber } from "@/lib/parse";
import { isValidDate } from "@/lib/validation";

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
    const hasPaid = Boolean(body?.hasPaid);

    if (!tourId || !fullName || !phone || !bookAt) {
      return badRequest("Missing booking details");
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
    const serviceFee = Number(process.env.STRIPE_SERVICE_FEE || 200);
    const totalAmount = Math.round(price * sanitizedGuestSize + serviceFee);

    const savedBooking = await prisma.booking.create({
      data: {
        userId: user.id,
        userEmail: user.email,
        tourId: tour.id,
        tourName: tour.title,
        fullName,
        guestSize: sanitizedGuestSize,
        phone,
        bookAt,
        hasPaid,
        paymentStatus: hasPaid ? "paid" : "pending",
        amount: totalAmount,
        currency: (process.env.STRIPE_CURRENCY || "inr").toLowerCase(),
        notes: notes || undefined
      }
    });

    return json({ success: true, message: "Your tour is booked", data: savedBooking });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "internal server error" }, 500);
  }
}

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;

  try {
    const books = await prisma.booking.findMany({
      include: { tour: { select: { title: true, price: true, photo: true } } }
    });
    return json({ success: true, message: "successful", data: books });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "internal server error" }, 500);
  }
}

