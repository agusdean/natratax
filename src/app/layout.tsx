import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "NatraTax — Administrasi Pajak Sekolah Lebih Tertata",
  description: "NatraTax adalah platform administrasi pajak dan keuangan sekolah untuk mengelola transaksi, dokumen, pembayaran, pelaporan, rekonsiliasi dan monitoring secara terstruktur.",
  keywords: [
    "administrasi pajak sekolah",
    "sistem pajak sekolah",
    "aplikasi administrasi pajak",
    "manajemen pajak sekolah",
    "administrasi keuangan sekolah",
    "NatraTax",
    "SMK Bina Putra Jakarta"
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
