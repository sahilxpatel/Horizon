export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json } from "@/lib/api";
import { toNumber } from "@/lib/parse";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const city = params.get("city");
  const distance = toNumber(params.get("distance"));
  const maxGroupSize = toNumber(params.get("maxGroupSize"));

  const where: Record<string, unknown> = {};

  if (city) {
    where.city = { contains: city, mode: "insensitive" };
  }

  if (distance !== undefined) {
    where.distance = { gte: distance };
  }

  if (maxGroupSize !== undefined) {
    where.maxGroupSize = { gte: maxGroupSize };
  }

  try {
    const tours = await prisma.tour.findMany({
      where,
      include: { reviews: true }
    });

    return json({
      success: true,
      message: "Successful",
      data: tours
    });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "not found" }, 404);
  }
}

