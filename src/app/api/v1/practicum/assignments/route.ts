import { NextResponse } from "next/server";
import { INITIAL_PRACTICUM_ASSIGNMENTS } from "@/lib/store";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Daftar tugas praktikum perpajakan",
    data: INITIAL_PRACTICUM_ASSIGNMENTS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, dueDate, maxScore = 100, instructions } = body;

    if (!title) {
      return NextResponse.json({ success: false, message: "Judul tugas wajib diisi." }, { status: 400 });
    }

    const newAssignment = {
      id: "asg-" + Date.now(),
      batchId: body.batchId || "batch-akl-2026",
      title,
      description: description || "",
      dueDate: dueDate || "2026-10-31",
      maxScore: Number(maxScore),
      instructions: instructions || "Selesaikan transaksi dan terbitkan SPT di mode sandbox.",
      status: "OPEN",
      createdAt: new Date().toISOString().split("T")[0],
    };

    INITIAL_PRACTICUM_ASSIGNMENTS.unshift(newAssignment as any);

    return NextResponse.json({
      success: true,
      message: "Tugas praktikum baru berhasil diterbitkan",
      data: newAssignment,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
