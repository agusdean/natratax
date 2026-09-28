import { NextResponse } from "next/server";
import { INITIAL_TRANSACTIONS } from "@/lib/store";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userRole = request.headers.get("x-user-role") || "BENDAHARA";
    const userName = request.headers.get("x-user-name") || "Approver";

    const authorizedRoles = ["SUPER ADMIN", "KEPALA SEKOLAH", "BENDAHARA", "VERIFIKATOR"];
    if (!authorizedRoles.includes(userRole)) {
      return NextResponse.json(
        { success: false, message: `Peran ${userRole} tidak memiliki otorisasi untuk menyetujui transaksi (403 Forbidden).` },
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

    if (transaction.status === "CANCELLED" || transaction.status === "PAID") {
      return NextResponse.json(
        { success: false, message: `Transaksi berstatus ${transaction.status} tidak dapat disetujui secara langsung.` },
        { status: 422 }
      );
    }

    // Segregation of duty / self-approval prevention
    if (transaction.createdBy === userName && userRole !== "SUPER ADMIN" && userRole !== "KEPALA SEKOLAH") {
      return NextResponse.json(
        { success: false, message: "Pelanggaran Segregation of Duties: Pembuat transaksi dilarang menyetujui transaksi sendiri." },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Transaksi ${transaction.trxNumber} berhasil disetujui oleh ${userName} (${userRole}).`,
      data: {
        ...transaction,
        status: "APPROVED",
        approvedBy: userName,
        approvedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
