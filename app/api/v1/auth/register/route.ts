export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { badRequest, json } from "@/lib/api";
import { isValidEmail } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = String(body?.username || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");
    const photo = body?.photo ? String(body.photo) : null;

    if (!username || username.length < 3) {
      return badRequest("Username must be at least 3 characters long");
    }
    if (!email || !isValidEmail(email)) {
      return badRequest("Valid email is required");
    }
    if (!password || password.length < 6) {
      return badRequest("Password must be at least 6 characters long");
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existing) {
      return badRequest("User already exists");
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    await prisma.user.create({
      data: {
        username,
        email,
        password: hash,
        photo: photo || undefined
      }
    });

    return json({ success: true, message: "Successfully created" });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Failed to create. Try again" }, 500);
  }
}

