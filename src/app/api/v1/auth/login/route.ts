import { NextResponse } from "next/server";
import { DEMO_USERS } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Development demo credential check
    const user = DEMO_USERS.find(
      (u) => u.taxId === username || u.email === username
    ) || DEMO_USERS[0];

    return NextResponse.json({
      success: true,
      message: "Otentikasi berhasil (Sanctum/Bearer simulated)",
      data: {
        token: "natratax_jwt_" + Buffer.from(user.email).toString("base64"),
        user,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Gagal memproses login", error: error.message },
      { status: 500 }
    );
  }
}
