import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, json } from "@/lib/api";
import { isValidEmail } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = String(body?.email || "").trim().toLowerCase();

  if (!email || !isValidEmail(email)) {
    return badRequest("Email is required");
  }

  try {
    const existing = await prisma.newsletter.findUnique({ where: { email } });

    if (existing) {
      if (existing.status === "subscribed") {
        return json({ success: false, message: "Email already subscribed" }, 400);
      }

      await prisma.newsletter.update({
        where: { email },
        data: { status: "subscribed", subscribedAt: new Date() }
      });

      return json({ success: true, message: "Successfully resubscribed to newsletter" });
    }

    const newSubscription = await prisma.newsletter.create({ data: { email } });

    return json({
      success: true,
      message: "Successfully subscribed to newsletter",
      data: newSubscription
    });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Failed to subscribe. Please try again." }, 500);
  }
}
