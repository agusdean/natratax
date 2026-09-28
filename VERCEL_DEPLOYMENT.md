# NatraTax — Vercel, Neon DB & Cloudinary Production Setup Guide

**Aplikasi**: NatraTax — School Tax & Financial Administration System  
**Organisasi**: SMK BINA PUTRA JAKARTA  
**Stack Produksi**: Next.js 14 App Router + Neon Serverless PostgreSQL + Cloudinary Storage + Vercel Serverless Hosting  

---

## 1. Persiapan Database: Neon Serverless PostgreSQL

1. Buka [Neon Console](https://console.neon.tech) dan buat proyek baru:
   - **Project Name**: `natratax-db`
   - **Region**: Pilih yang terdekat (misal `Singapore (ap-southeast-1)` atau `US East`).
2. Setelah database dibuat, salin **Connection String** (Pooled connection):
   ```
   postgresql://neondb_owner:YourPassword@ep-xyz-123456.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
3. Tambahkan ke konfigurasi Environment Variables Vercel sebagai `DATABASE_URL`.
4. Setelah aplikasi dideploy ke Vercel, lakukan inisialisasi skema tabel otomatis dengan mengakses endpoint:
   - **POST** `https://[domain-anda].vercel.app/api/v1/db/init`  
   Endpoint ini akan otomatis membuat tabel-tabel utama: `tenants`, `transactions`, `invoices`, `withholding_slips`, `payments`, `audit_logs`.

---

## 2. Persiapan Media Storage: Cloudinary (Faktur, SPJ, Bukti Bayar NTPN)

1. Buka [Cloudinary Dashboard](https://cloudinary.com/console) (Daftar akun gratis jika belum ada).
2. Dari menu **Dashboard**, salin 3 kredensial utama:
   - **Cloud Name**: (contoh: `natratax-smk`)
   - **API Key**: (contoh: `123456789012345`)
   - **API Secret**: (contoh: `abcde12345-YourSecretKey`)
3. Tambahkan ketiga nilai tersebut ke Environment Variables Vercel:
   ```env
   CLOUDINARY_CLOUD_NAME=natratax-smk
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=abcde12345-YourSecretKey
   ```
4. Seluruh upload berkas digital pada menu e-Faktur, e-Bupot, SPJ BOS, dan bukti setor bank akan otomatis dialirkan dan disimpan secara aman dan dioptimasi di Cloudinary melalui API `/api/v1/upload`.

---

## 3. Checklist Lengkap Environment Variables untuk Vercel

Tambahkan variabel berikut pada menu **Project Settings -> Environment Variables** di Vercel:

| Nama Variabel | Jenis | Contoh / Nilai Rekomendasi | Keterangan |
|---|---|---|---|
| `NEXT_PUBLIC_APP_NAME` | Public | `NatraTax` | Nama sistem di UI & title |
| `NEXT_PUBLIC_SITE_URL` | Public | `https://natratax.vercel.app` | URL domain produksi Anda |
| `NEXT_PUBLIC_API_URL` | Public | `/api/v1` | Base URL API serverless |
| `NEXT_PUBLIC_DEFAULT_NPWP` | Public | `9988770000010609` | NPWP instansi SMK Bina Putra |
| `DATABASE_URL` | **Secret** | `postgresql://neondb_owner:...@ep-...neon.tech/neondb?sslmode=require` | Connection string Neon DB |
| `CLOUDINARY_CLOUD_NAME` | **Secret** | `your_cloud_name` | Cloudinary Cloud Name |
| `CLOUDINARY_API_KEY` | **Secret** | `your_api_key` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | **Secret** | `your_api_secret` | Cloudinary API Secret |
| `JWT_SECRET` | **Secret** | `9f8e7d6c5b4a3120...` | Token signing secret |

---

## 4. Langkah Menghosting / Deploy ke Vercel

### Metode A: Via GitHub (Sangat Direkomendasikan — 1 Klik & Otomatis)
1. Buat repositori baru di akun GitHub Anda (misal nama: `natratax`).
2. Jalankan perintah ini di terminal lokal Anda (`d:\SMK Projek\NatraTax`):
   ```bash
   git remote add origin https://github.com/USERNAME/natratax.git
   git branch -M main
   git push -u origin main
   ```
3. Buka peramban ke **[vercel.com/new](https://vercel.com/new)**.
4. Pilih repositori **`natratax`** dan klik **Import**.
5. Buka bagian **Environment Variables**, lalu masukkan nilai dari checklist pada Bagian 3 di atas.
6. Klik tombol **Deploy**. Vercel akan otomatis mengompilasi dan mengaktifkan URL produksi Anda dalam 1-2 menit!

### Metode B: Via Terminal CLI
1. Jalankan login Vercel di terminal Anda:
   ```bash
   vercel login
   ```
   *(Pilih login via Browser atau Email)*
2. Hubungkan proyek:
   ```bash
   vercel link
   ```
3. Deploy langsung ke Production:
   ```bash
   vercel --prod
   ```
