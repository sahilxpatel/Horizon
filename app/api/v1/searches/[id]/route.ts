import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, json, requireAuth } from "@/lib/api";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  if (!params.id) {
    return badRequest("Search id is required");
  }

  try {
    const removed = await prisma.savedSearch.deleteMany({
      where: { id: params.id, userId: auth.user.id }
    });

    if (removed.count === 0) {
      return json({ success: false, message: "Saved search not found" }, 404);
    }

    return json({ success: true, message: "Saved search removed" });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Failed to remove saved search" }, 500);
  }
}
