import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json, notFound, requireUserOrAdmin } from "@/lib/api";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireUserOrAdmin(req, params.id);
  if ("error" in auth) return auth.error;

  try {
    const user = await prisma.user.findUnique({ where: { id: params.id } });
    if (!user) return notFound("not found");
    const { password, ...rest } = user;
    return json({ success: true, message: "Successfully found", data: rest });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "not found" }, 404);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireUserOrAdmin(req, params.id);
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const updates: Record<string, unknown> = {
    username: body?.username,
    email: body?.email,
    phone: body?.phone,
    bio: body?.bio,
    photo: body?.photo
  };

  try {
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updates
    });
    const { password, ...rest } = updatedUser;
    return json({ success: true, message: "Successfully updated", data: rest });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Failed to update" }, 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireUserOrAdmin(req, params.id);
  if ("error" in auth) return auth.error;

  try {
    await prisma.user.delete({ where: { id: params.id } });
    return json({ success: true, message: "Successfully deleted" });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Failed to delete" }, 500);
  }
}
