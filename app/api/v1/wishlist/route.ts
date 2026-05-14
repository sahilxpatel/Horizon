export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, json, requireAuth } from "@/lib/api";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: auth.user.id },
      include: {
        items: {
          include: {
            tour: {
              include: { reviews: true }
            }
          }
        }
      }
    });

    if (!wishlist) {
      return json({
        success: true,
        message: "Wishlist is empty",
        data: { tours: [] }
      });
    }

    const tours = wishlist.items.map((item) => item.tour);

    return json({
      success: true,
      message: "Wishlist retrieved successfully",
      data: { id: wishlist.id, userId: wishlist.userId, tours }
    });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Failed to retrieve wishlist" }, 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const tourId = body?.tourId ? String(body.tourId) : "";

  if (!tourId) {
    return badRequest("Tour ID is required");
  }

  try {
    const wishlist = await prisma.wishlist.upsert({
      where: { userId: auth.user.id },
      update: {},
      create: { userId: auth.user.id }
    });

    const exists = await prisma.wishlistItem.findUnique({
      where: { wishlistId_tourId: { wishlistId: wishlist.id, tourId } }
    });

    if (exists) {
      return json({ success: false, message: "Tour already in wishlist" }, 400);
    }

    await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        tourId
      }
    });

    return json({ success: true, message: "Tour added to wishlist" });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Failed to add to wishlist" }, 500);
  }
}

