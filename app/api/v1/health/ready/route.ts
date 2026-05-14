export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { json } from "@/lib/api";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return json({
      status: "ready",
      timestamp: new Date().toISOString(),
      database: "connected"
    });
  } catch (error) {
    return json({
      status: "not ready",
      timestamp: new Date().toISOString(),
      error: (error as Error).message
    }, 503);
  }
}

