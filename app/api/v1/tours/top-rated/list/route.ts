import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json } from "@/lib/api";
import { computeReviewStats } from "@/lib/rating";
import { toNumber } from "@/lib/parse";

export async function GET(req: NextRequest) {
  const limit = toNumber(req.nextUrl.searchParams.get("limit")) ?? 5;

  try {
    const tours = await prisma.tour.findMany({ include: { reviews: true } });
    const withRatings = tours
      .map((tour) => {
        const { avgRating, totalRating } = computeReviewStats(tour.reviews);
        return { ...tour, avgRating, totalRating };
      })
      .sort((a, b) => b.avgRating - a.avgRating || b.totalRating - a.totalRating)
      .slice(0, limit);

    return json({ success: true, message: "Successful", count: withRatings.length, data: withRatings });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Failed to fetch top rated tours" }, 500);
  }
}
