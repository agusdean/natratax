import { NextResponse } from "next/server";
import { INITIAL_TRANSACTIONS } from "@/lib/store";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const transaction = INITIAL_TRANSACTIONS.find((t) => t.id === params.id || t.trxNumber === params.id);
  if (!transaction) {
    return NextResponse.json(
      { success: false, message: `Transaksi dengan id/nomor ${params.id} tidak ditemukan.` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: transaction,
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const transaction = INITIAL_TRANSACTIONS.find((t) => t.id === params.id);
  if (!transaction) {
    return NextResponse.json(
      { success: false, message: "Transaksi tidak ditemukan." },
      { status: 404 }
    );
  }

  if (transaction.status === "PAID" || transaction.status === "APPROVED") {
    return NextResponse.json(
      { success: false, message: `Transaksi berstatus ${transaction.status} tidak dapat dihapus.` },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Transaksi ${params.id} berhasil dibatalkan.`,
  });
}
