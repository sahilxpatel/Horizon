export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, json } from "@/lib/api";
import { toNumber } from "@/lib/parse";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const q = params.get("q");
  if (!q) return badRequest("Missing q param");

  const page = toNumber(params.get("page")) ?? 0;
  const limit = toNumber(params.get("limit")) ?? 8;

  const where = {
    OR: [
      { title: { contains: q, mode: "insensitive" as const } },
      { desc: { contains: q, mode: "insensitive" as const } },
      { city: { contains: q, mode: "insensitive" as const } },
      { address: { contains: q, mode: "insensitive" as const } }
    ]
  };

  const [results, total] = await Promise.all([
    prisma.tour.findMany({
      where,
      skip: page * limit,
      take: limit,
      include: { reviews: true }
    }),
    prisma.tour.count({ where })
  ]);

  return json({
    success: true,
    data: results,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  });
}

