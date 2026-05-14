import { prisma } from "@/lib/prisma";
import { json } from "@/lib/api";

export async function GET() {
  try {
    const tourCount = await prisma.tour.count();
    return json({ success: true, data: tourCount });
  } catch (error) {
    return json({ success: false, message: "failed to fetch" }, 500);
  }
}
