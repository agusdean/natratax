import { NextResponse } from "next/server";
import { INITIAL_SERVICE_REQUESTS } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");

  let list = [...INITIAL_SERVICE_REQUESTS];
  if (status) {
    list = list.filter((r) => r.status === status);
  }
  if (type) {
    list = list.filter((r) => r.type === type);
  }

  return NextResponse.json({
    success: true,
    data: list,
    meta: {
      total: list.length,
      pendingCount: list.filter((r) => r.status === "MENUNGGU" || r.status === "DALAM_PROSES").length,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, type = "ADMINISTRASI", category = "Layanan Mandiri WP", applicantName, npwp, notes } = body;

    const newRequest = {
      id: "req-" + Date.now(),
      ticketNumber: `REQ-BP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      type,
      title: title || "Permohonan Layanan Baru",
      category,
      applicantName: applicantName || "Duwi Heru Santoso",
      npwp: npwp || "9988770000010609",
      dateSubmitted: new Date().toISOString().split("T")[0],
      status: "MENUNGGU" as const,
      progressPercent: 15,
      currentStep: "Verifikasi Dokumen Permohonan oleh Helpdesk KPP",
      notes: notes || "Menunggu review berkas digital",
      bpeNumber: `BPE-${Math.floor(100000000 + Math.random() * 900000000)}`,
    };

    return NextResponse.json({
      success: true,
      message: `Tiket permohonan layanan ${newRequest.ticketNumber} berhasil didaftarkan dengan BPE: ${newRequest.bpeNumber}.`,
      data: newRequest,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
