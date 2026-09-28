import { NextResponse } from "next/server";
import { INITIAL_BUPOT } from "@/lib/store";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const bupot = INITIAL_BUPOT.find(
    (b) => b.id === params.id || b.bupotNumber === params.id
  );

  if (!bupot) {
    return NextResponse.json(
      { success: false, message: `Bukti Potong ${params.id} tidak ditemukan.` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: bupot,
  });
}
