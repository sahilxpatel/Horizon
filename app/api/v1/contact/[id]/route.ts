import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json, notFound, requireAdmin } from "@/lib/api";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;

  const contact = await prisma.contact.findUnique({ where: { id: params.id } });
  if (!contact) return notFound("Contact not found");
  return json({ success: true, data: contact });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const status = body?.status ? String(body.status) : undefined;

  try {
    const contact = await prisma.contact.update({
      where: { id: params.id },
      data: { status }
    });

    return json({
      success: true,
      message: "Contact status updated successfully",
      data: contact
    });
  } catch (error) {
    return json({ success: false, message: "Failed to update contact status" }, 500);
  }
}
