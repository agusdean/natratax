import { NextResponse } from "next/server";
import { INITIAL_TRANSACTIONS } from "@/lib/store";
import { TaxCalculationService } from "@/lib/tax-engine";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  let list = [...INITIAL_TRANSACTIONS];
  if (type) {
    list = list.filter((t) => t.type === type);
  }

  return NextResponse.json({
    success: true,
    message: "Daftar transaksi keuangan & pajak sekolah",
    data: list,
    meta: {
      total: list.length,
      page: 1,
      tenant: "SMK BINA PUTRA JAKARTA",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { taxType, grossAmount, hasNpwp = true, vendorName, categoryName, description, date } = body;

    // Use deterministic tax engine
    const calculation = TaxCalculationService.calculate({
      taxType: taxType || "PPN",
      grossAmount: Number(grossAmount) || 0,
      hasNpwp,
      transactionDate: date,
    });

    const newTransaction = {
      id: "trx-" + Date.now(),
      trxNumber: `TRX-BP-2026-09-${Math.floor(100 + Math.random() * 900)}`,
      date: date || new Date().toISOString().split("T")[0],
      type: body.type || "PENGADAAN_BOS",
      categoryName: categoryName || "Belanja Barang Sekolah",
      vendorName: vendorName || "Rekanan Sekolah",
      vendorNpwp: hasNpwp ? (body.vendorNpwp || "01.000.000.0-000.000") : "TIDAK BER-NPWP",
      description: description || "Transaksi Belanja",
      grossAmount: Number(grossAmount) || 0,
      taxType: calculation.taxType,
      taxBase: calculation.taxBase,
      taxRate: calculation.effectiveRate,
      taxAmount: calculation.taxAmount,
      netAmount: calculation.netAmount,
      status: "UNDER_REVIEW",
      createdBy: body.createdBy || "API User",
      attachmentsCount: 1,
    };

    INITIAL_TRANSACTIONS.unshift(newTransaction as any);

    return NextResponse.json({
      success: true,
      message: "Transaksi berhasil dicatat dan diajukan verifikasi",
      data: newTransaction,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
