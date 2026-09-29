import { NextResponse } from "next/server";
import { INITIAL_PRACTICUM_SUBMISSIONS } from "@/lib/store";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Daftar pengumpulan tugas praktikum siswa",
    data: INITIAL_PRACTICUM_SUBMISSIONS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { assignmentId, studentName = "Siswa Praktikum", notes = "" } = body;

    if (!assignmentId) {
      return NextResponse.json({ success: false, message: "Assignment ID wajib disertakan." }, { status: 400 });
    }

    const newSubmission = {
      id: "sub-" + Date.now(),
      assignmentId,
      studentId: body.studentId || "usr-student-demo",
      studentName,
      submissionDate: new Date().toISOString().split("T")[0],
      status: "SUBMITTED",
      notes,
      submittedRecordsCount: body.submittedRecordsCount || 1,
    };

    INITIAL_PRACTICUM_SUBMISSIONS.unshift(newSubmission as any);

    return NextResponse.json({
      success: true,
      message: "Jawaban tugas praktikum berhasil dikirimkan",
      data: newSubmission,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
