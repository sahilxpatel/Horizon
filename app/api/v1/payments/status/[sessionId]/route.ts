import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, json } from "@/lib/api";

export async function GET(_req: NextRequest, { params }: { params: { sessionId: string } }) {
  if (!params.sessionId) {
    return badRequest("Session id is required");
  }

  try {
    const booking = await prisma.booking.findFirst({
      where: { checkoutSessionId: params.sessionId },
      include: { tour: { select: { title: true, price: true, photo: true } } }
    });

    if (!booking) {
      return json({ success: false, message: "Booking not found" }, 404);
    }

    return json({ success: true, booking });
  } catch (error) {
    console.error("Failed to fetch session status", error);
    return json({ success: false, message: "Unable to fetch payment status" }, 500);
  }
}
