import { prisma } from "@/lib/prisma";
import { json } from "@/lib/api";

export async function GET() {
  try {
    const categories = await prisma.tour.findMany({
      select: { category: true },
      distinct: ["category"]
    });

    return json({
      success: true,
      message: "Successful",
      data: categories.map((item) => item.category)
    });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Failed to fetch categories" }, 500);
  }
}
