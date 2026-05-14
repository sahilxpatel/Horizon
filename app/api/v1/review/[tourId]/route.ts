import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, json, requireAuth } from "@/lib/api";

export async function POST(req: NextRequest, { params }: { params: { tourId: string } }) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const username = String(body?.username || "").trim();
  const reviewText = String(body?.reviewText || "").trim();
  const rating = Number(body?.rating ?? 0);

  if (!username || !reviewText) {
    return badRequest("Review text and username are required");
  }

  if (Number.isNaN(rating) || rating < 1 || rating > 5) {
    return badRequest("Rating must be between 1 and 5");
  }

  try {
    const tour = await prisma.tour.findUnique({ where: { id: params.tourId } });
    if (!tour) {
      return json({ success: false, message: "Tour not found" }, 404);
    }

    const savedReview = await prisma.review.create({
      data: {
        tourId: params.tourId,
        username,
        reviewText,
        rating
      }
    });

    return json({
      success: true,
      message: "Review Submitted",
      data: savedReview
    });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Failed to Submit" }, 500);
  }
}
