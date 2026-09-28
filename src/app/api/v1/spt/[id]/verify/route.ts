import { NextResponse } from "next/server";
import { INITIAL_SPT } from "@/lib/store";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userRole = request.headers.get("x-user-role") || "BENDAHARA";
    const authorizedRoles = ["SUPER ADMIN", "KEPALA SEKOLAH", "BENDAHARA", "VERIFIKATOR"];
    if (!authorizedRoles.includes(userRole)) {
      return NextResponse.json(
        { success: false, message: `Peran ${userRole} tidak memiliki izin memverifikasi SPT.` },
        { status: 403 }
      );
    }

    const spt = INITIAL_SPT.find((s) => s.id === params.id);
    if (!spt) {
      return NextResponse.json(
        { success: false, message: `SPT ${params.id} tidak ditemukan.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `SPT ${spt.taxType} periode ${spt.taxPeriod} berhasil diverifikasi dan siap dilaporkan.`,
      data: {
        ...spt,
        status: "SIAP_PROSES",
        verifiedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
