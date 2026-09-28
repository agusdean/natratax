import { neon, neonConfig } from "@neondatabase/serverless";

// Enable connection caching in serverless environments
neonConfig.fetchConnectionCache = true;

const connectionString = process.env.DATABASE_URL;

/**
 * Neon DB SQL client instance
 * Returns neon client if DATABASE_URL is configured, or null for fallback mode
 */
export const sql = connectionString ? neon(connectionString) : null;

export async function query<T = any>(queryString: string, params: any[] = []): Promise<T[]> {
  if (!sql) {
    console.warn("[NeonDB] DATABASE_URL tidak dikonfigurasi. Menggunakan in-memory state.");
    return [];
  }
  try {
    const result = await (sql as any)(queryString, params);
    return result as T[];
  } catch (error: any) {
    console.error("[NeonDB Query Error]:", error);
    throw error;
  }
}

/**
 * Inisialisasi Skema Tabel di Neon PostgreSQL
 * Menjamin tabel-tabel utama tersedia otomatis pada deployment pertama
 */
export async function initNeonSchema() {
  if (!sql) return { success: false, message: "DATABASE_URL belum diatur" };

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS tenants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50) UNIQUE NOT NULL,
        tax_id VARCHAR(30),
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id VARCHAR(100) DEFAULT '00000000-0000-0000-0000-000000000001',
        trx_number VARCHAR(100) UNIQUE NOT NULL,
        date DATE NOT NULL,
        type VARCHAR(50) NOT NULL,
        category_name VARCHAR(255) NOT NULL,
        vendor_name VARCHAR(255) NOT NULL,
        vendor_npwp VARCHAR(50),
        description TEXT,
        gross_amount NUMERIC(15, 2) NOT NULL,
        tax_type VARCHAR(20) NOT NULL,
        tax_base NUMERIC(15, 2) NOT NULL,
        tax_rate NUMERIC(5, 2) NOT NULL,
        tax_amount NUMERIC(15, 2) NOT NULL,
        net_amount NUMERIC(15, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'DRAFT',
        created_by VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS invoices (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id VARCHAR(100) DEFAULT '00000000-0000-0000-0000-000000000001',
        invoice_number VARCHAR(100) NOT NULL,
        tax_invoice_number VARCHAR(100) NOT NULL,
        type VARCHAR(20) NOT NULL,
        date DATE NOT NULL,
        counterparty_name VARCHAR(255) NOT NULL,
        counterparty_npwp VARCHAR(50) NOT NULL,
        dpp NUMERIC(15, 2) NOT NULL,
        ppn_rate NUMERIC(5, 2) DEFAULT 11.0,
        ppn_amount NUMERIC(15, 2) NOT NULL,
        total NUMERIC(15, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'TERBIT',
        period VARCHAR(20) NOT NULL,
        document_url TEXT,
        created_by VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS withholding_slips (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id VARCHAR(100) DEFAULT '00000000-0000-0000-0000-000000000001',
        bupot_number VARCHAR(100) UNIQUE NOT NULL,
        bupot_type VARCHAR(20) NOT NULL,
        tax_type VARCHAR(20) NOT NULL,
        tax_object_code VARCHAR(50) NOT NULL,
        object_description TEXT,
        beneficiary_name VARCHAR(255) NOT NULL,
        beneficiary_npwp_nik VARCHAR(50) NOT NULL,
        gross_amount NUMERIC(15, 2) NOT NULL,
        effective_rate NUMERIC(5, 2) NOT NULL,
        tax_withheld NUMERIC(15, 2) NOT NULL,
        period_month INT NOT NULL,
        period_year INT NOT NULL,
        status VARCHAR(50) DEFAULT 'TERBIT',
        document_url TEXT,
        created_by VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS payments (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id VARCHAR(100) DEFAULT '00000000-0000-0000-0000-000000000001',
        billing_code VARCHAR(100) UNIQUE NOT NULL,
        tax_type VARCHAR(50) NOT NULL,
        period VARCHAR(50) NOT NULL,
        amount NUMERIC(15, 2) NOT NULL,
        due_date DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'PENDING',
        payment_date DATE,
        payment_channel VARCHAR(100),
        ntpn VARCHAR(50),
        proof_document_url TEXT,
        reference_note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id VARCHAR(100),
        user_name VARCHAR(100) NOT NULL,
        user_role VARCHAR(50) NOT NULL,
        action VARCHAR(50) NOT NULL,
        module VARCHAR(50) NOT NULL,
        record_identifier VARCHAR(100),
        details TEXT,
        ip_address VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return { success: true, message: "Skema database Neon PostgreSQL berhasil diinisialisasi." };
  } catch (error: any) {
    console.error("[NeonDB Init Error]:", error);
    return { success: false, error: error.message };
  }
}
