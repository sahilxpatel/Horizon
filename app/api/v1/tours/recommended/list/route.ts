export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, json } from "@/lib/api";
import { toNumber } from "@/lib/parse";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const tourId = params.get("tourId");
  const limit = toNumber(params.get("limit")) ?? 5;

  if (!tourId) {
    return badRequest("tourId required");
  }

  try {
    const base = await prisma.tour.findUnique({ where: { id: tourId } });
    if (!base) {
      return json({ success: false, message: "Base tour not found" }, 404);
    }

    const priceBounds = {
      gte: Math.round(base.price * 0.7),
      lte: Math.round(base.price * 1.3)
    };

    const recs = await prisma.tour.findMany({
      where: {
        id: { not: base.id },
        category: base.category,
        price: priceBounds
      },
      take: limit,
      include: { reviews: true }
    });

    return json({
      success: true,
      data: recs,
      base: { id: base.id, price: base.price, category: base.category }
    });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Recommendation lookup failed" }, 500);
  }
}

