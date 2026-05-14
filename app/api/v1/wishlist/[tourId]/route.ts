import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json, requireAuth } from "@/lib/api";

export async function DELETE(req: NextRequest, { params }: { params: { tourId: string } }) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: auth.user.id }
    });

    if (!wishlist) {
      return json({ success: false, message: "Wishlist not found" }, 404);
    }

    await prisma.wishlistItem.deleteMany({
      where: { wishlistId: wishlist.id, tourId: params.tourId }
    });

    return json({ success: true, message: "Tour removed from wishlist" });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Failed to remove from wishlist" }, 500);
  }
}
