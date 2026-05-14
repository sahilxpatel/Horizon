import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json, notFound, requireAdmin } from "@/lib/api";
import { slugify } from "@/lib/slugify";
import { toNumber } from "@/lib/parse";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const tour = await prisma.tour.findUnique({
    where: { id: params.id },
    include: { reviews: true }
  });

  if (!tour) {
    return notFound("not found");
  }

  return json({ success: true, message: "Successfully found", data: tour });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const updates: Record<string, unknown> = { ...body };

  if (typeof body?.title === "string" && body.title.trim()) {
    const baseSlug = slugify(body.title.trim());
    let slug = baseSlug;
    let suffix = 1;
    while (await prisma.tour.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
    updates.slug = slug;
  }

  if (body?.distance !== undefined) updates.distance = toNumber(body.distance) ?? 0;
  if (body?.price !== undefined) updates.price = toNumber(body.price) ?? 0;
  if (body?.maxGroupSize !== undefined) updates.maxGroupSize = toNumber(body.maxGroupSize) ?? 1;
  if (body?.duration !== undefined) updates.duration = toNumber(body.duration) ?? 1;

  try {
    const updatedTour = await prisma.tour.update({
      where: { id: params.id },
      data: updates
    });

    return json({ success: true, message: "Successfully updated", data: updatedTour });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Failed to update" }, 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;

  try {
    await prisma.tour.delete({ where: { id: params.id } });
    return json({ success: true, message: "Successfully deleted" });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Failed to delete" }, 500);
  }
}
