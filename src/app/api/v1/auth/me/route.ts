import { NextResponse } from "next/server";
import { DEMO_USERS } from "@/lib/store";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Token otentikasi tidak disediakan (Unauthorized)" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    // Extract base64 email or fallback to first user
    let user = DEMO_USERS[0];
    if (token.startsWith("natratax_jwt_")) {
      const emailBase64 = token.replace("natratax_jwt_", "");
      try {
        const email = Buffer.from(emailBase64, "base64").toString("utf-8");
        const found = DEMO_USERS.find((u) => u.email === email);
        if (found) user = found;
      } catch {
        // fallback
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        user,
        permissions: [
          "transactions.view",
          "invoices.view",
          "bupot.view",
          "spt.view",
          "payments.view",
          user.role === "OPERATOR" ? "transactions.create" : "transactions.approve",
        ],
        tenant: {
          id: "00000000-0000-0000-0000-000000000001",
          name: "SMK BINA PUTRA JAKARTA",
          npwp: user.taxId,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Gagal memverifikasi sesi", error: error.message },
      { status: 500 }
    );
  }
}
