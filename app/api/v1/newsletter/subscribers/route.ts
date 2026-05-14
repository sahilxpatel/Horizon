import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json, requireAdmin } from "@/lib/api";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;

  try {
    const subscribers = await prisma.newsletter.findMany({
      where: { status: "subscribed" }
    });

    return json({ success: true, count: subscribers.length, data: subscribers });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Failed to fetch subscribers" }, 500);
  }
}
