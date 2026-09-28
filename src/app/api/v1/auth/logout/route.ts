import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Sesi otentikasi berhasil diakhiri (Logged out)",
  });
}
