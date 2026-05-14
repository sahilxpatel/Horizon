export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json } from "@/lib/api";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = String(body?.email || "").trim().toLowerCase();

  try {
    const subscription = await prisma.newsletter.findUnique({ where: { email } });

    if (!subscription) {
      return json({ success: false, message: "Email not found in our subscription list" }, 404);
    }

    await prisma.newsletter.update({
      where: { email },
      data: { status: "unsubscribed" }
    });

    return json({ success: true, message: "Successfully unsubscribed from newsletter" });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Failed to unsubscribe" }, 500);
  }
}

