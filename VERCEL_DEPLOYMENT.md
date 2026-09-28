# NatraTax — Vercel Production Deployment Guide

## 1. Project Overview & Architecture
- **Application**: NatraTax — School Tax & Financial Administration System
- **Target Organization**: SMK BINA PUTRA JAKARTA
- **Frontend & Serverless Engine**: Next.js 14 App Router (TypeScript, TailwindCSS)
- **Deployment Platform**: Vercel
- **Decoupled Backend (Optional Dedicated Server)**: Laravel 11 (`/backend`) with PostgreSQL schema

---

## 2. Zero-Configuration Vercel Native Support
Next.js 14 is natively detected by Vercel with zero configuration.
- **Framework Preset**: Next.js
- **Build Command**: `next build` (or `npm run build`)
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node.js Version**: 18.x or 20.x

---

## 3. Environment Variables Configuration Checklist

### A. Public Variables (Exposed to Client Bundles)
| Key | Example Value | Description |
|---|---|---|
| `NEXT_PUBLIC_APP_NAME` | `NatraTax` | Nama platform di header dan title |
| `NEXT_PUBLIC_SITE_URL` | `https://natratax.vercel.app` | URL domain produksi |
| `NEXT_PUBLIC_API_URL` | `/api/v1` | Base URL endpoint API (internal Next.js routes) |
| `NEXT_PUBLIC_DEFAULT_NPWP` | `9988770000010609` | NPWP default instansi SMK Bina Putra |

> **CRITICAL SECURITY NOTE**: Never prefix database credentials, JWT secrets, or cloud API keys with `NEXT_PUBLIC_`.

### B. Server-Only Secrets (Kept strictly on Serverless / Edge)
| Key | Recommended Value / Purpose | Scope |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/natratax_prod` | Koneksi database produksi |
| `JWT_SECRET` | `64-character-random-hex-key` | Token signing secret |
| `APP_KEY` | `base64:...` | Laravel app key jika backend di deploy terpisah |
| `AI_API_KEY` | `gemini-api-key` | Kunci API asisten AI Coretax Edukasi |

---

## 4. How to Deploy to Vercel

### Option 1: Via Vercel CLI (Interactive)
1. Buka terminal di direktori proyek: `d:\SMK Projek\NatraTax`
2. Jalankan perintah login:
   ```bash
   vercel login
   ```
   *(Pilih metode otentikasi browser yang diinginkan)*
3. Hubungkan proyek (Link):
   ```bash
   vercel link --project natratax
   ```
4. Deploy ke Preview:
   ```bash
   vercel
   ```
5. Deploy ke Production:
   ```bash
   vercel --prod
   ```

### Option 2: Via GitHub Integration (Recommended for CI/CD)
1. Buat repository baru di GitHub (misal: `github.com/smkbinaputra/natratax`).
2. Hubungkan remote repository lokal:
   ```bash
   git remote add origin https://github.com/smkbinaputra/natratax.git
   git branch -M main
   git push -u origin main
   ```
3. Buka dashboard [Vercel](https://vercel.com/new).
4. Klik **Import Git Repository** dan pilih repository `natratax`.
5. Masukkan Environment Variables di atas.
6. Klik **Deploy**.

---

## 5. Post-Deployment Verification Checklist
- [x] Landing page (`/`) loads without console errors.
- [x] Login page (`/login`) authentication succeeds.
- [x] Dashboard (`/dashboard`) displays calculated metrics from `/api/v1/dashboard`.
- [x] e-Faktur (`/invoices/outgoing` and submenus) filters and tables function.
- [x] e-Bupot (`/bupot`) displays withholding slips and status badges.
- [x] SPT (`/spt`) concepts and verification workflow functional.
- [x] Payments (`/payments`) NTPN verification functional.
- [x] Impersonation role switcher switches between all 7 RBAC roles.
- [x] Responsive layout verified on Desktop (1920x1080), Tablet (768px), and Mobile (375px).
