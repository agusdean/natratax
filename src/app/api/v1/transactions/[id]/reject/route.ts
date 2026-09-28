import { NextResponse } from "next/server";
import { INITIAL_TRANSACTIONS } from "@/lib/store";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json().catch(() => ({}));
    const reason = body.reason || "Dokumen pendukung atau klasifikasi belum memenuhi syarat";
    const userRole = request.headers.get("x-user-role") || "BENDAHARA";
    const userName = request.headers.get("x-user-name") || "Approver";

    const authorizedRoles = ["SUPER ADMIN", "KEPALA SEKOLAH", "BENDAHARA", "VERIFIKATOR"];
    if (!authorizedRoles.includes(userRole)) {
      return NextResponse.json(
        { success: false, message: `Peran ${userRole} tidak memiliki hak untuk menolak atau meminta revisi transaksi.` },
        { status: 403 }
      );
    }

    const transaction = INITIAL_TRANSACTIONS.find((t) => t.id === params.id || t.trxNumber === params.id);
    if (!transaction) {
      return NextResponse.json(
        { success: false, message: `Transaksi ${params.id} tidak ditemukan.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Transaksi ${transaction.trxNumber} dikembalikan untuk revisi. Alasan: ${reason}`,
      data: {
        ...transaction,
        status: "REVISION_REQUIRED",
        rejectionReason: reason,
        rejectedBy: userName,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
