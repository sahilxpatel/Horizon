export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json, requireAdmin } from "@/lib/api";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;

  try {
    const users = await prisma.user.findMany();
    const sanitized = users.map(({ password, ...rest }) => rest);
    return json({ success: true, message: "Successfull", data: sanitized });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "not-found" }, 404);
  }
}

