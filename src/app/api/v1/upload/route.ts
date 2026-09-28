import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    // 1. Handle multipart form data (Direct file upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const folder = (formData.get("folder") as string) || "natratax/school_documents";

      if (!file) {
        return NextResponse.json(
          { success: false, message: "File dokumen tidak ditemukan dalam request." },
          { status: 400 }
        );
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, message: "Ukuran berkas melebihi batas maksimal 10 MB." },
          { status: 413 }
        );
      }

      // Convert file buffer to base64 data URI
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mimeType = file.type || "application/pdf";
      const base64Data = `data:${mimeType};base64,${buffer.toString("base64")}`;

      const uploadResult = await uploadToCloudinary(base64Data, folder);

      return NextResponse.json({
        success: true,
        message: "Dokumen berhasil disimpan di Cloudinary.",
        data: {
          originalName: file.name,
          mimeType,
          size: file.size,
          url: uploadResult.secureUrl,
          publicId: uploadResult.publicId,
          format: uploadResult.format,
        },
      });
    }

    // 2. Handle JSON base64 upload
    const body = await request.json();
    const { fileData, folder = "natratax/documents", filename } = body;

    if (!fileData) {
      return NextResponse.json(
        { success: false, message: "Data file (base64) wajib disertakan." },
        { status: 400 }
      );
    }

    const uploadResult = await uploadToCloudinary(fileData, folder, filename);

    return NextResponse.json({
      success: true,
      message: "Dokumen berhasil disimpan ke Cloudinary.",
      data: uploadResult,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mengunggah file ke Cloudinary." },
      { status: 500 }
    );
  }
}
