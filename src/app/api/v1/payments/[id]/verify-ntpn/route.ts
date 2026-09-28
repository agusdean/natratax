import { NextResponse } from "next/server";
import { INITIAL_PAYMENTS } from "@/lib/store";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { ntpn, paymentChannel = "Bank DKI - CMS BOS" } = body;

    if (!ntpn || ntpn.trim().length < 8) {
      return NextResponse.json(
        { success: false, message: "Nomor Transaksi Penerimaan Negara (NTPN) harus berupa kombinasi alfanumerik valid (minimal 8-16 karakter)." },
        { status: 422 }
      );
    }

    const payment = INITIAL_PAYMENTS.find(
      (p) => p.id === params.id || p.billingCode === params.id
    );

    if (!payment) {
      return NextResponse.json(
        { success: false, message: `Tagihan billing ${params.id} tidak ditemukan.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Konfirmasi setoran kas negara dengan NTPN ${ntpn.toUpperCase()} berhasil diverifikasi.`,
      data: {
        ...payment,
        status: "VERIFIED",
        ntpn: ntpn.toUpperCase().trim(),
        paymentChannel,
        paymentDate: new Date().toISOString().split("T")[0],
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
