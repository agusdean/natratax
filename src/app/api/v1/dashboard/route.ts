import { NextResponse } from "next/server";
import { INITIAL_INVOICES, INITIAL_BUPOT, INITIAL_PAYMENTS, INITIAL_TRANSACTIONS } from "@/lib/store";

export async function GET() {
  const totalKeluaran = INITIAL_INVOICES
    .filter((i) => i.type === "KELUARAN")
    .reduce((sum, i) => sum + i.ppnAmount, 0);

  const totalMasukan = INITIAL_INVOICES
    .filter((i) => i.type === "MASUKAN")
    .reduce((sum, i) => sum + i.ppnAmount, 0);

  const totalBupotDipotong = INITIAL_BUPOT.reduce((sum, b) => sum + b.taxWithheld, 0);

  const totalPembayaran = INITIAL_PAYMENTS
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  return NextResponse.json({
    success: true,
    data: {
      tenant: "SMK BINA PUTRA JAKARTA",
      period: "September-2026",
      summary: {
        totalKeluaran,
        totalMasukan,
        totalBupotDipotong,
        totalPembayaran,
        totalTransactions: INITIAL_TRANSACTIONS.length,
        incompleteDocumentsCount: INITIAL_TRANSACTIONS.filter((t) => t.status === "DRAFT").length,
      },
    },
  });
}
