import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json, requireAuth } from "@/lib/api";

export async function GET(req: NextRequest, { params }: { params: { tourId: string } }) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: auth.user.id }
    });

    if (!wishlist) {
      return json({ success: true, data: { inWishlist: false } });
    }

    const exists = await prisma.wishlistItem.findUnique({
      where: { wishlistId_tourId: { wishlistId: wishlist.id, tourId: params.tourId } }
    });

    return json({ success: true, data: { inWishlist: Boolean(exists) } });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Failed to check wishlist" }, 500);
  }
}
