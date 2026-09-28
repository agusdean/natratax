# NatraTax — School Tax & Financial Administration System

> **Platform Administrasi Pajak & Rekonsiliasi Finansial Internal Sekolah**  
> Khusus Satuan Pendidikan: **SMK BINA PUTRA JAKARTA**  
> Versi: **1.0 (Enterprise Production Build)**

---

## ⚠️ PENTING: DISCLAIMER KEPATUHAN & HUKUM
**NatraTax adalah SISTEM ADMINISTRASI INTERNAL SEKOLAH/YAYASAN.**  
- NatraTax **BUKAN** portal resmi Direktorat Jenderal Pajak (DJP) / Coretax dan **TIDAK** menggantikan saluran resmi DJP.
- Seluruh aturan perhitungan pajak di dalam sistem ini dikonfigurasi secara mandiri (*Tax Rule Engine*) berdasarkan ketentuan instansi pemerintah (pemungut dana BOS) dan **wajib diverifikasi oleh Bendahara Sekolah** sebelum pelaporan resmi.
- Sistem **TIDAK** menggunakan integrasi tidak resmi (*unofficial scrapers/hacks*). Integrasi resmi pemerintah hanya diaktifkan apabila API resmi pemerintah telah dibuka untuk publik.

---

## 1. Ikhtisar Produk (Product Overview)
**NatraTax** dirancang khusus untuk memecahkan kompleksitas administrasi perpajakan pada jenjang Sekolah Menengah Kejuruan (SMK) dan Yayasan Pendidikan, mencakup:
1. **Pengelolaan Belanja Dana BOS & SIPLah**: Otomasi perhitungan PPN 11% dan PPh 22 atas pengadaan sarana/prasarana laboratorium dan buku.
2. **Honorarium Guru Tidak Tetap (GTT) & Tenaga Ahli**: Perhitungan PPh 21 tarif efektif berkesinambungan/tidak, termasuk uji kompetensi kejuruan (UKK).
3. **e-Faktur**: Pengelolaan faktur pajak keluaran (teaching factory/jasa sekolah) dan faktur pajak masukan dari rekanan.
4. **e-Bupot**: Penerbitan Bukti Pemotongan Pajak Unifikasi (BP 21, BPPU 22/23, Final Pasal 4 Ayat 2).
5. **Konsep SPT**: Penyusunan SPT Masa Unifikasi, PPh 21/26, PPN 1107 PUT, dan SPT Tahunan Yayasan.
6. **Billing & Setoran**: Pelacakan kode billing kas negara dan validasi Nomor Transaksi Penerimaan Negara (NTPN).
7. **Buku Besar Pajak**: Sinkronisasi jurnal akuntansi umum dengan akun utang pajak terutang.
8. **NatraTax AI Assistant**: Asisten pintar berbasis data analitik deterministik dengan izin *read-only*.

---

## 2. Arsitektur & Teknologi

### Frontend
- **Framework**: Next.js 14+ (App Router, Server & Client Components)
- **Language**: TypeScript 5.6+ (Strict Mode)
- **Styling**: Tailwind CSS + Central Design Tokens
- **Icons**: Lucide React
- **Command Palette**: `Ctrl + K` / `Cmd + K` Keyboard Navigation
- **State Management**: Reactive React Context Provider with LocalStorage persistence

### Backend API & Database
- **Framework**: Laravel 11.x REST API (`/api/v1/...`)
- **Language**: PHP 8.3+
- **Database**: PostgreSQL (Multi-Tenant Ready with UUID primary keys)
- **Cache / Queue**: Redis
- **Security**: Laravel Sanctum + Granular RBAC
- **Audit Trail**: Immutable append-only audit trail logging

---

## 3. Akun Pengguna Demo & Peran (Role-Based Access)

Aplikasi dilengkapi dengan fitur **Impersonate / Switch Role** interaktif di pojok kanan atas:

| Peran (Role) | Nama Pengguna | NPWP / ID | Akses Utama |
|---|---|---|---|
| **BENDAHARA** (Default) | DUWI HERU SANTOSO, S.AK | `998866000010609` | Pengelolaan penuh transaksi, faktur, bupot, billing, dan jurnal. |
| **KEPALA SEKOLAH** | DR. H. SURYADI, M.PD | `998866000010001` | Persetujuan transaksi (*Approval*), verifikasi SPT, monitoring eksekutif. |
| **ADMIN PAJAK** | SITI NURHALIZA, A.MD | `998866000010002` | Input faktur masukan/keluaran, draft bupot, dan rekam billing. |
| **VERIFIKATOR (SPI)** | AGUS TRIYANTO, S.E | `998866000010003` | Audit internal, verifikasi kepatuhan transaksi belanja BOS. |
| **OPERATOR BOS** | RINA WIDIAWATI | `998866000010004` | Input draf transaksi belanja harian dan berkas pendukung. |
| **AUDITOR** | HIDAYAT EFFENDI, CA | `998866000010005` | Akses baca-saja (*Read-Only*) untuk pemeriksaan laporan keuangan. |
| **SUPER ADMIN** | SYSADMIN NATRATAX | `998866000010999` | Manajemen sistem, aturan pajak, dan pengelolaan hak akses. |

> **Kredensial Default Login Pengembangan:**  
> ID Pengguna / Email: `admin@natratax.local` atau `998866000010609`  
> Kata Sandi: `Admin123!`

---

## 4. Cara Menjalankan Aplikasi

### Opsi A: Menjalankan Langsung via Node.js (Frontend & Mock API)
```bash
# 1. Masuk ke direktori
cd "d:/SMK Projek/NatraTax"

# 2. Instal dependensi
npm install

# 3. Jalankan server pengembangan
npm run dev

# 4. Buka di browser
http://localhost:3000
```

### Opsi B: Menjalankan Menggunakan Docker Compose (Full Stack)
```bash
# Menjalankan seluruh container (Nginx, Frontend Next.js, Backend Laravel, Postgres, Redis)
docker compose up -d

# Memeriksa log
docker compose logs -f
```

### Menjalankan Pengujian (Unit Tests)
```bash
npm run test
# atau
node --test tests/tax-engine.test.mjs
```

---

## 5. Struktur Modul & Navigasi

Sesuai tata letak desain reference (`PrakTax`):
- **Top Header**: Logo NatraTax, Versi 1.0, Disclaimer Badge, Search bar (`Ctrl+K`), Flag ID, Theme toggle, Notifikasi, Akun Profil & Impersonate, Tombol Home.
- **Secondary Navbar**: 
  - `Portal Saya` -> `/dashboard`
  - `e-Faktur` -> `/invoices`, `/invoices/outgoing`, `/invoices/incoming`
  - `e-Bupot` -> `/bupot` (BP 21, BPPU, BPNR, Final 4-2)
  - `SPT` -> `/spt` (Konsep SPT, Menunggu Pembayaran, Dilaporkan)
  - `Pembayaran` -> `/payments` (Kode Billing & Verifikasi NTPN)
  - `Buku Besar` -> `/ledger` (Jurnal Transaksi & Pajak)
  - `Layanan WP` -> `/layanan`
  - `Manajemen` -> `/management/users`, `/management/tax-rules`, `/management/vendors`, `/management/audit-logs`
- **Left Context-Aware Sidebar**: Kartu Identitas Ungu `SMK BINA PUTRA JAKARTA` + Submenu dinamis sesuai menu aktif.
- **Floating Assistive AI**: Widget interaktif *NatraTax AI Assistant* untuk tanya-jawab kepatuhan pajak sekolah.

---

## 6. Lisensi & Hak Cipta
Hak Cipta © 2026 NatraTax. Dikembangkan khusus untuk **SMK BINA PUTRA JAKARTA**.  
Sistem Administrasi Internal Pendidikan.
