export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json } from "@/lib/api";
import { computeReviewStats } from "@/lib/rating";
import { toBoolean, toNumber } from "@/lib/parse";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const city = params.get("city") || "";
  const keyword = params.get("keyword") || "";
  const minPrice = toNumber(params.get("minPrice"));
  const maxPrice = toNumber(params.get("maxPrice"));
  const minGroupSize = toNumber(params.get("minGroupSize"));
  const maxGroupSize = toNumber(params.get("maxGroupSize"));
  const minDistance = toNumber(params.get("minDistance"));
  const maxDistance = toNumber(params.get("maxDistance"));
  const featured = toBoolean(params.get("featured"));
  const minRating = toNumber(params.get("minRating"));
  const category = params.get("category") || "";
  const minDuration = toNumber(params.get("minDuration"));
  const maxDuration = toNumber(params.get("maxDuration"));
  const sortBy = params.get("sortBy") || "";
  const order = params.get("order") === "asc" ? 1 : -1;
  const page = toNumber(params.get("page")) ?? 0;
  const limit = toNumber(params.get("limit"));

  const where: Record<string, unknown> = {};

  if (city) {
    where.city = { contains: city, mode: "insensitive" };
  }

  if (keyword) {
    const contains = { contains: keyword, mode: "insensitive" };
    where.OR = [
      { title: contains },
      { desc: contains },
      { address: contains },
      { city: contains }
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {
      ...(minPrice !== undefined ? { gte: minPrice } : {}),
      ...(maxPrice !== undefined ? { lte: maxPrice } : {})
    };
  }

  if (minGroupSize !== undefined || maxGroupSize !== undefined) {
    where.maxGroupSize = {
      ...(minGroupSize !== undefined ? { gte: minGroupSize } : {}),
      ...(maxGroupSize !== undefined ? { lte: maxGroupSize } : {})
    };
  }

  if (minDistance !== undefined || maxDistance !== undefined) {
    where.distance = {
      ...(minDistance !== undefined ? { gte: minDistance } : {}),
      ...(maxDistance !== undefined ? { lte: maxDistance } : {})
    };
  }

  if (featured !== undefined) {
    where.featured = featured;
  }

  if (category && category.toLowerCase() !== "all") {
    where.category = category;
  }

  if (minDuration !== undefined || maxDuration !== undefined) {
    where.duration = {
      ...(minDuration !== undefined ? { gte: minDuration } : {}),
      ...(maxDuration !== undefined ? { lte: maxDuration } : {})
    };
  }

  try {
    const tours = await prisma.tour.findMany({
      where,
      include: { reviews: true }
    });

    const toursWithRatings = tours
      .map((tour) => {
        const { totalRating, avgRating } = computeReviewStats(tour.reviews);
        return { ...tour, totalRating, avgRating };
      })
      .filter((tour) => {
        if (minRating !== undefined) {
          return tour.avgRating >= minRating;
        }
        return true;
      });

    let sortedTours = [...toursWithRatings];
    if (sortBy) {
      sortedTours.sort((a, b) => {
        const valueA = (a as any)[sortBy] ?? 0;
        const valueB = (b as any)[sortBy] ?? 0;
        if (valueA < valueB) return -1 * order;
        if (valueA > valueB) return 1 * order;
        return 0;
      });
    }

    const resolvedLimit = limit ?? sortedTours.length;
    const startIndex = page * resolvedLimit;
    const paginatedTours = sortedTours.slice(startIndex, startIndex + resolvedLimit);

    return json({
      success: true,
      count: paginatedTours.length,
      total: sortedTours.length,
      data: paginatedTours
    });
  } catch (error: any) {
    console.error("Advanced search error:", error);
    return json({ 
      success: false, 
      message: "Failed to fetch tours",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    }, 500);
  }
}
