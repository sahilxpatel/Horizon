import { json } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tours = await prisma.tour.findMany({
      where: { featured: true },
      take: 8,
      include: { reviews: true }
    });

    return json({ success: true, message: "Successfull", data: tours });
  } catch (error: any) {
    console.error("Prisma error in getFeaturedTours:", error);
    return json({ success: false, message: "not-found", error: error.message }, 404);
  }
}
