import { NextResponse } from "next/server";
import { INITIAL_SPT } from "@/lib/store";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const spt = INITIAL_SPT.find((s) => s.id === params.id);
  if (!spt) {
    return NextResponse.json(
      { success: false, message: `SPT ${params.id} tidak ditemukan.` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: spt,
  });
}
