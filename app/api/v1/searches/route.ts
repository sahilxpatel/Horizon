export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, json, requireAuth } from "@/lib/api";

const MAX_SAVED = Number(process.env.SAVED_SEARCH_LIMIT || 10);

const sanitizeParams = (params: Record<string, unknown>) => {
  const cleaned: Record<string, string> = {};
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    cleaned[key] = String(value);
  });
  return cleaned;
};

const buildFallbackLabel = (params: Record<string, string>) => {
  const keyword = params.keyword ? params.keyword : "Any experience";
  const city = params.city ? `in ${params.city}` : "";
  const featured = params.featured === "true" ? "Featured" : "";
  const minRating = params.minRating ? `${params.minRating}+ stars` : "";
  const parts = [keyword, city, featured, minRating].filter(Boolean);
  return parts.join(" · ") || "Saved search";
};

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    const searches = await prisma.savedSearch.findMany({
      where: { userId: auth.user.id },
      orderBy: { createdAt: "desc" }
    });

    return json({ success: true, data: searches });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Failed to fetch saved searches" }, 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    const body = await req.json();
    const rawParams = body?.params && typeof body.params === "object" ? body.params : {};
    const params = sanitizeParams(rawParams);
    const label = String(body?.label || "").trim();
    const resolvedLabel = label || buildFallbackLabel(params);

    if (resolvedLabel.length > 80) {
      return badRequest("Label is too long");
    }

    const existingCount = await prisma.savedSearch.count({ where: { userId: auth.user.id } });
    const overflow = existingCount - MAX_SAVED + 1;

    if (overflow > 0) {
      const oldest = await prisma.savedSearch.findMany({
        where: { userId: auth.user.id },
        orderBy: { createdAt: "asc" },
        take: overflow,
        select: { id: true }
      });

      await prisma.savedSearch.deleteMany({
        where: { id: { in: oldest.map((item) => item.id) } }
      });
    }

    const saved = await prisma.savedSearch.create({
      data: {
        userId: auth.user.id,
        label: resolvedLabel,
        params
      }
    });

    return json({ success: true, data: saved });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Failed to save search" }, 500);
  }
}

export async function DELETE(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await prisma.savedSearch.deleteMany({ where: { userId: auth.user.id } });
    return json({ success: true, message: "Saved searches cleared" });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Failed to clear saved searches" }, 500);
  }
}

