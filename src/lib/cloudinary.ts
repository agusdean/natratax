import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  bytes: number;
}

/**
 * Upload dokumen perpajakan, faktur, atau bukti setor ke Cloudinary
 * Mendukung PDF, gambar faktur (PNG/JPG), dan file berkas SPJ sekolah
 */
export async function uploadToCloudinary(
  fileBase64OrUrl: string,
  folder: string = "natratax/documents",
  customFilename?: string
): Promise<UploadResult> {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
    // Fallback URL jika kredensial Cloudinary belum diisi pengguna
    console.warn("[Cloudinary] Kredensial belum lengkap. Menggunakan mock secure asset.");
    return {
      url: `https://res.cloudinary.com/demo/image/upload/sample.jpg`,
      secureUrl: `https://res.cloudinary.com/demo/image/upload/sample.jpg`,
      publicId: `natratax_mock_${Date.now()}`,
      format: "pdf",
      bytes: 102400,
    };
  }

  try {
    const uploadOptions: any = {
      folder,
      resource_type: "auto",
    };

    if (customFilename) {
      uploadOptions.public_id = customFilename;
    }

    const response = await cloudinary.uploader.upload(fileBase64OrUrl, uploadOptions);

    return {
      url: response.url,
      secureUrl: response.secure_url,
      publicId: response.public_id,
      format: response.format,
      bytes: response.bytes,
    };
  } catch (error: any) {
    console.error("[Cloudinary Upload Error]:", error);
    throw new Error(`Gagal mengunggah dokumen ke Cloudinary: ${error.message}`);
  }
}

/**
 * Hapus dokumen dari Cloudinary jika faktur atau berkas dibatalkan
 */
export async function deleteFromCloudinary(publicId: string) {
  if (!process.env.CLOUDINARY_CLOUD_NAME) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error: any) {
    console.warn("[Cloudinary Destroy Error]:", error);
  }
}

export default cloudinary;
