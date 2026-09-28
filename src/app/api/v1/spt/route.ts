import { NextResponse } from "next/server";
import { INITIAL_SPT } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const period = searchParams.get("period");

  let list = [...INITIAL_SPT];
  if (status) {
    list = list.filter((s) => s.status === status);
  }
  if (period) {
    list = list.filter((s) => s.taxPeriod.toLowerCase().includes(period.toLowerCase()));
  }

  return NextResponse.json({
    success: true,
    data: list,
    meta: {
      total: list.length,
      unpaidCount: list.filter((s) => s.status === "MENUNGGU_PEMBAYARAN").length,
      reportedCount: list.filter((s) => s.status === "DILAPORKAN").length,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { taxType, periodMonth = 9, periodYear = 2026, totalDpp = 0, totalTax = 0 } = body;

    const newSpt = {
      id: "spt-" + Date.now(),
      taxType: taxType || "SPT Masa Unifikasi",
      sptCategory: "MASA" as const,
      taxPeriod: `September ${periodYear}`,
      periodMonth: Number(periodMonth),
      periodYear: Number(periodYear),
      totalDpp: Number(totalDpp) || 0,
      totalTax: Number(totalTax) || 0,
      status: "KONSEP" as const,
      createdDate: new Date().toISOString().split("T")[0],
      createdBy: "API User",
      billingCode: `92837482${Math.floor(10000000 + Math.random() * 90000000)}`,
    };

    return NextResponse.json({
      success: true,
      message: `Konsep SPT Masa ${newSpt.taxType} berhasil dibuat.`,
      data: newSpt,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
