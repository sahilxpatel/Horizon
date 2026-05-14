import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json, requireUserOrAdmin } from "@/lib/api";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const auth = requireUserOrAdmin(req, params.userId);
  if ("error" in auth) return auth.error;

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: params.userId },
      orderBy: { createdAt: "desc" }
    });

    return json({ success: true, data: bookings });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Failed to fetch bookings" }, 500);
  }
}
