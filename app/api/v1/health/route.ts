import { prisma } from "@/lib/prisma";
import { json } from "@/lib/api";

export async function GET() {
  try {
    const started = process.uptime();
    const mem = process.memoryUsage();
    const tourCount = await prisma.tour.count().catch(() => null);

    return json({
      status: "ok",
      uptimeSeconds: Math.round(started),
      memory: {
        rss: Math.round(mem.rss / 1024 / 1024) + " MB",
        heapUsed: Math.round(mem.heapUsed / 1024 / 1024) + " MB"
      },
      postgresConnected: tourCount !== null,
      tourCount,
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development"
    });
  } catch (error) {
    return json({ status: "error", message: (error as Error).message }, 500);
  }
}
