import { NextResponse } from "next/server";
import { INITIAL_PAYMENTS } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let list = [...INITIAL_PAYMENTS];
  if (status) {
    list = list.filter((p) => p.status === status);
  }

  const totalPaid = list
    .filter((p) => p.status === "PAID" || p.status === "VERIFIED")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalUnpaid = list
    .filter((p) => p.status === "PENDING" || p.status === "LATE")
    .reduce((sum, p) => sum + p.amount, 0);

  return NextResponse.json({
    success: true,
    data: list,
    meta: {
      total: list.length,
      totalPaid,
      totalUnpaid,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { taxType, period, amount, referenceNote } = body;

    const numAmount = Number(amount) || 0;
    if (numAmount <= 0) {
      return NextResponse.json(
        { success: false, message: "Nominal pembayaran tagihan pajak harus lebih besar dari Rp 0." },
        { status: 400 }
      );
    }

    const newPayment = {
      id: "pay-" + Date.now(),
      billingCode: `82910${Math.floor(100000000 + Math.random() * 900000000)}`,
      taxType: taxType || "PPN",
      period: period || "September-2026",
      amount: numAmount,
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
      status: "PENDING" as const,
      referenceNote: referenceNote || "Pembuatan Kode Billing Mandiri",
    };

    INITIAL_PAYMENTS.unshift(newPayment as any);

    return NextResponse.json({
      success: true,
      message: `Kode Billing ${newPayment.billingCode} berhasil dibuat. Silakan setor ke Bank Persepsi/Pos.`,
      data: newPayment,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
