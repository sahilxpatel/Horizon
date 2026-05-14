import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { badRequest, json } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!email || !password) {
      return badRequest("Email and password are required");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return json({ success: false, message: "User not found" }, 404);
    }

    const checkCorrectPassword = await bcrypt.compare(password, user.password);
    if (!checkCorrectPassword) {
      return json({ success: false, message: "Incorrect email or password" }, 401);
    }

    const secret = process.env.JWT_SECRET_KEY || "";
    if (!secret) {
      return json({ success: false, message: "JWT secret not configured" }, 500);
    }

    const token = jwt.sign({ id: user.id, role: user.role }, secret, {
      expiresIn: "15d"
    });

    const { password: _password, ...rest } = user;

    const res = NextResponse.json({
      token,
      data: rest,
      role: user.role
    });

    res.cookies.set("accessToken", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 15
    });

    return res;
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Failed to login" }, 500);
  }
}
