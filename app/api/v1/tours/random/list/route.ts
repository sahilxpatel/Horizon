export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json } from "@/lib/api";
import { toNumber } from "@/lib/parse";

export async function GET(req: NextRequest) {
  const limit = toNumber(req.nextUrl.searchParams.get("limit")) ?? 5;

  try {
    const ids = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM "Tour" ORDER BY RANDOM() LIMIT ${limit}
    `;

    const idList = ids.map((row) => row.id);
    const tours = await prisma.tour.findMany({
      where: { id: { in: idList } },
      include: { reviews: true }
    });

    const sorted = idList
      .map((id) => tours.find((tour) => tour.id === id))
      .filter(Boolean);

    return json({ success: true, message: "Successful", count: sorted.length, data: sorted });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Failed to fetch random tours" }, 500);
  }
}

