import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json } from "@/lib/api";
import { toNumber } from "@/lib/parse";

export async function GET(req: NextRequest, { params }: { params: { category: string } }) {
  const page = toNumber(req.nextUrl.searchParams.get("page")) ?? 0;
  const limit = toNumber(req.nextUrl.searchParams.get("limit")) ?? 8;

  try {
    const where = params.category === "all" ? {} : { category: params.category as any };

    const [tours, totalCount] = await Promise.all([
      prisma.tour.findMany({
        where,
        include: { reviews: true },
        skip: page * limit,
        take: limit
      }),
      prisma.tour.count({ where })
    ]);

    return json({
      success: true,
      message: "Successful",
      count: tours.length,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      data: tours
    });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Failed to fetch tours by category" }, 500);
  }
}
