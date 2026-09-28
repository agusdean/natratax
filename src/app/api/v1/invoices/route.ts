import { NextResponse } from "next/server";
import { INITIAL_INVOICES } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // KELUARAN or MASUKAN
  const period = searchParams.get("period");

  let list = [...INITIAL_INVOICES];
  if (type) {
    list = list.filter((i) => i.type.toUpperCase() === type.toUpperCase());
  }
  if (period) {
    list = list.filter((i) => i.period === period);
  }

  const totalDpp = list.reduce((sum, i) => sum + i.dpp, 0);
  const totalPpn = list.reduce((sum, i) => sum + i.ppnAmount, 0);

  return NextResponse.json({
    success: true,
    data: list,
    meta: {
      total: list.length,
      totalDpp,
      totalPpn,
      period: period || "September 2026",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, dpp, ppnRate = 11, counterpartyName, counterpartyNpwp, date, period } = body;

    const numDpp = Number(dpp) || 0;
    const numPpnRate = Number(ppnRate) || 11;
    const ppnAmount = Math.round((numDpp * numPpnRate) / 100);
    const total = numDpp + ppnAmount;

    const newInvoice = {
      id: "inv-" + Date.now(),
      invoiceNumber: `INV/BP/2026/09/${Math.floor(100 + Math.random() * 900)}`,
      taxInvoiceNumber: `010.000-26.${Math.floor(10000000 + Math.random() * 90000000)}`,
      type: type || "KELUARAN",
      date: date || new Date().toISOString().split("T")[0],
      counterpartyName: counterpartyName || "Rekanan Sekolah",
      counterpartyNpwp: counterpartyNpwp || "01.000.000.0-000.000",
      dpp: numDpp,
      ppnRate: numPpnRate,
      ppnAmount,
      total,
      status: "TERBIT",
      period: period || "09-2026",
      createdBy: "API User",
    };

    return NextResponse.json({
      success: true,
      message: `Faktur Pajak ${newInvoice.taxInvoiceNumber} berhasil diterbitkan.`,
      data: newInvoice,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
