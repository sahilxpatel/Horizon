export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json, requireAdmin, badRequest } from "@/lib/api";
import { slugify } from "@/lib/slugify";
import { toNumber } from "@/lib/parse";

const sortable = new Set(["price", "createdAt", "updatedAt", "distance", "maxGroupSize", "duration"]);
const selectable = new Set([
  "id",
  "title",
  "slug",
  "city",
  "price",
  "featured",
  "category",
  "distance",
  "maxGroupSize",
  "duration",
  "difficulty",
  "createdAt",
  "photo"
]);

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const page = toNumber(params.get("page")) ?? 0;
  const limit = toNumber(params.get("limit")) ?? 8;
  const sort = (params.get("sort") || "").split(",").filter(Boolean);
  const fields = (params.get("fields") || "").split(",").filter(Boolean);

  const orderBy = sort
    .map((item) => {
      const dir = item.startsWith("-") ? "desc" : "asc";
      const key = item.replace(/^-/, "");
      if (!sortable.has(key)) return null;
      return { [key]: dir } as const;
    })
    .filter((item): item is Exclude<typeof item, null> => item !== null);

  const resolvedOrderBy = orderBy.length ? (orderBy as any) : [{ createdAt: "desc" as const }];

  const select = fields.length
    ? fields.reduce<Record<string, boolean>>((acc, field) => {
        if (selectable.has(field)) acc[field] = true;
        return acc;
      }, {})
    : null;

  const total = await prisma.tour.count();

  const tours = await prisma.tour.findMany({
    skip: page * limit,
    take: limit,
    orderBy: resolvedOrderBy,
    ...(select
      ? { select: { ...select, reviews: true } }
      : { include: { reviews: true } })
  } as any);

  return json({
    success: true,
    count: tours.length,
    message: "Successfull",
    data: tours,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  });
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const title = String(body?.title || "").trim();
  const city = String(body?.city || "").trim();
  const address = String(body?.address || "").trim();
  const photo = String(body?.photo || "").trim();
  const desc = String(body?.desc || "").trim();
  const distance = toNumber(body?.distance) ?? 0;
  const price = toNumber(body?.price) ?? 0;
  const maxGroupSize = toNumber(body?.maxGroupSize) ?? 1;

  if (!title || !city || !address || !photo || !desc) {
    return badRequest("Missing required tour fields");
  }

  const baseSlug = slugify(title);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.tour.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  try {
    const created = await prisma.tour.create({
      data: {
        title,
        slug,
        city,
        address,
        distance,
        photo,
        desc,
        price,
        maxGroupSize,
        category: body?.category || undefined,
        duration: toNumber(body?.duration) ?? 1,
        difficulty: body?.difficulty || undefined,
        itinerary: body?.itinerary || undefined,
        inclusions: body?.inclusions || undefined,
        exclusions: body?.exclusions || undefined,
        featured: Boolean(body?.featured)
      }
    });

    return json({ success: true, message: "Successfully created", data: created });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Failed to create. Try Again" }, 500);
  }
}



