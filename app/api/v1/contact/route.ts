import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, json, requireAdmin } from "@/lib/api";
import { isValidEmail } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim();
  const phone = body?.phone ? String(body.phone).trim() : null;
  const subject = String(body?.subject || "").trim();
  const message = String(body?.message || "").trim();

  if (!name || !email || !subject || !message) {
    return badRequest("Please fill in all required fields");
  }
  if (!isValidEmail(email)) {
    return badRequest("Please provide a valid email address");
  }

  try {
    const newContact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || undefined,
        subject,
        message
      }
    });

    return json({
      success: true,
      message: "Thank you for contacting us! We'll get back to you soon.",
      data: newContact
    });
  } catch (error) {
    console.error(error);
    return json({
      success: false,
      message: "Failed to submit contact form. Please try again."
    }, 500);
  }
}

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;

  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" }
    });
    return json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    console.error(error);
    return json({ success: false, message: "Failed to fetch contacts" }, 500);
  }
}
