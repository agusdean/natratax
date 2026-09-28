import { NextResponse } from "next/server";
import { INITIAL_BUPOT } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // BP21, BPPU, BPNR, etc.

  let list = [...INITIAL_BUPOT];
  if (type) {
    list = list.filter((b) => b.bupotType === type || b.taxType === type);
  }

  const totalGross = list.reduce((sum, b) => sum + b.grossAmount, 0);
  const totalWithheld = list.reduce((sum, b) => sum + b.taxWithheld, 0);

  return NextResponse.json({
    success: true,
    data: list,
    meta: {
      total: list.length,
      totalGross,
      totalWithheld,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      bupotType = "BP21", 
      taxType = "PPH21", 
      taxObjectCode = "21-100-01", 
      objectDescription = "Honorarium Guru Tidak Tetap",
      beneficiaryName, 
      beneficiaryNpwpNik, 
      grossAmount = 0, 
      effectiveRate = 5,
      periodMonth = 9,
      periodYear = 2026
    } = body;

    const numGross = Number(grossAmount) || 0;
    const numRate = Number(effectiveRate) || 5;
    // PPh 21 honorer: DPP = 50%
    const dpp = taxType === "PPH21" ? Math.round(numGross * 0.5) : numGross;
    const taxWithheld = Math.round((dpp * numRate) / 100);

    const newBupot = {
      id: "bupot-" + Date.now(),
      bupotNumber: `BP-${taxType}-2026-09-${Math.floor(1000 + Math.random() * 9000)}`,
      bupotType,
      taxType,
      taxObjectCode,
      objectDescription,
      beneficiaryName: beneficiaryName || "Penerima Penghasilan",
      beneficiaryNpwpNik: beneficiaryNpwpNik || "3171000000000001",
      grossAmount: numGross,
      effectiveRate: numRate,
      taxWithheld,
      periodMonth: Number(periodMonth),
      periodYear: Number(periodYear),
      status: "TERBIT",
      dateCreated: new Date().toISOString().split("T")[0],
      createdBy: "API User",
    };

    return NextResponse.json({
      success: true,
      message: `Bukti Potong ${newBupot.bupotNumber} berhasil dibuat.`,
      data: newBupot,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
