import { json, notFound } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const tour = await prisma.tour.findUnique({
    where: { slug: params.slug },
    include: { reviews: true }
  });

  if (!tour) return notFound("Not found");

  return json({ success: true, data: tour });
}
