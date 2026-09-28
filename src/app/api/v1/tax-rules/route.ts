import { NextResponse } from "next/server";
import { TaxRuleService } from "@/lib/tax-engine";

export async function GET() {
  const rules = TaxRuleService.getRules();
  return NextResponse.json({
    success: true,
    data: rules,
    meta: {
      total: rules.length,
      version: "2026.1-PROD",
    },
  });
}

export async function POST(request: Request) {
  try {
    const userRole = request.headers.get("x-user-role") || "OPERATOR";
    if (userRole !== "SUPER ADMIN") {
      return NextResponse.json(
        { success: false, message: "Hanya SUPER ADMIN yang berwenang mengubah konfigurasi tarif dan aturan perpajakan." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, ratePercentage, effectiveTo } = body;

    if (!id || ratePercentage === undefined) {
      return NextResponse.json(
        { success: false, message: "Parameter id dan ratePercentage wajib disertakan." },
        { status: 400 }
      );
    }

    TaxRuleService.updateRule(id, {
      ratePercentage: Number(ratePercentage),
      effectiveTo,
    });

    return NextResponse.json({
      success: true,
      message: `Aturan pajak ${id} berhasil diperbarui ke tarif ${ratePercentage}%.`,
      data: TaxRuleService.getRules().find((r) => r.id === id),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
