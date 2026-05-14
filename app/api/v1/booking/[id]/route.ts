import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json, notFound, requireAuth } from "@/lib/api";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { tour: { select: { title: true, price: true, photo: true } } }
    });

    if (!booking) {
      return notFound("not found");
    }

    const isOwner = booking.userId === auth.user.id;
    const isAdmin = auth.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return json({ success: false, message: "Forbidden" }, 403);
    }

    return json({ success: true, message: "successful", data: booking });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "internal server error" }, 500);
  }
}
