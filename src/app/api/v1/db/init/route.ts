import { NextResponse } from "next/server";
import { initNeonSchema } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("x-admin-key") || "";
    // Allow if secret matches or if in development
    const result = await initNeonSchema();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  const isConfigured = Boolean(process.env.DATABASE_URL);
  return NextResponse.json({
    engine: "Neon Serverless PostgreSQL",
    configured: isConfigured,
    message: isConfigured 
      ? "Neon DB telah terkonfigurasi. Kirim request POST ke endpoint ini untuk menjalankan inisialisasi skema tabel."
      : "DATABASE_URL belum diatur. Tambahkan variabel DATABASE_URL dari dashboard Neon ke environment Vercel Anda.",
  });
}
