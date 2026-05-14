import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export type AuthPayload = {
  id: string;
  role?: string;
};

export const getTokenFromRequest = (req: NextRequest) => {
  const authHeader = req.headers.get("authorization") || "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  const cookieStore = cookies();
  return cookieStore.get("accessToken")?.value || null;
};

export const verifyToken = (token: string | null) => {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY || "") as AuthPayload;
  } catch {
    return null;
  }
};
