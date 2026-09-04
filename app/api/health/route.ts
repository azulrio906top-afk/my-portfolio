import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRawUnsafe("SELECT 1");
    return NextResponse.json({ ok: true, service: "portfolio", database: "ok", timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ ok: false, service: "portfolio", database: "error", timestamp: new Date().toISOString() }, { status: 503 });
  }
}
