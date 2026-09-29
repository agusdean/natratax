import { NextResponse } from "next/server";
import { INITIAL_PRACTICUM_BATCHES } from "@/lib/store";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Daftar kelas praktikum perpajakan SMK",
    data: INITIAL_PRACTICUM_BATCHES,
  });
}
