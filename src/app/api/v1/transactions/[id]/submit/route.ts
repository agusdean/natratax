import { NextResponse } from "next/server";
import { INITIAL_TRANSACTIONS } from "@/lib/store";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const transaction = INITIAL_TRANSACTIONS.find((t) => t.id === params.id || t.trxNumber === params.id);
  if (!transaction) {
    return NextResponse.json(
      { success: false, message: `Transaksi ${params.id} tidak ditemukan.` },
      { status: 404 }
    );
  }

  if (transaction.status !== "DRAFT" && transaction.status !== "REVISION_REQUIRED") {
    return NextResponse.json(
      { success: false, message: `Hanya transaksi DRAFT atau REVISION_REQUIRED yang dapat diajukan verifikasi. Status saat ini: ${transaction.status}` },
      { status: 422 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Transaksi ${transaction.trxNumber} berhasil diajukan untuk verifikasi bendahara/kepala sekolah.`,
    data: {
      ...transaction,
      status: "UNDER_REVIEW",
    },
  });
}
