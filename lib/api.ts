import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "./auth";

export const json = (data: unknown, status = 200) => {
  return NextResponse.json(data, { status });
};

export const badRequest = (message: string) => {
  return json({ success: false, message }, 400);
};

export const unauthorized = (message = "You are not authorized") => {
  return json({ success: false, message }, 401);
};

export const forbidden = (message = "You are not authorized") => {
  return json({ success: false, message }, 403);
};

export const notFound = (message = "Not found") => {
  return json({ success: false, message }, 404);
};

export const getAuthUser = (req: NextRequest) => {
  const token = getTokenFromRequest(req);
  return verifyToken(token);
};

export const requireAuth = (req: NextRequest) => {
  const user = getAuthUser(req);
  if (!user) {
    return { error: unauthorized() };
  }
  return { user };
};

export const requireAdmin = (req: NextRequest) => {
  const result = requireAuth(req);
  if ("error" in result) {
    return result;
  }
  if (result.user.role !== "admin") {
    return { error: forbidden() };
  }
  return result;
};

export const requireUserOrAdmin = (req: NextRequest, userId?: string | null) => {
  const result = requireAuth(req);
  if ("error" in result) {
    return result;
  }
  if (!userId || result.user.role === "admin" || result.user.id === userId) {
    return result;
  }
  return { error: forbidden("You are not authenticated") };
};
