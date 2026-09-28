<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Tenants (Multi-Tenant Ready)
        Schema::create('tenants', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('code')->unique();
            $table->string('tax_id', 20)->nullable(); // NPWP
            $table->text('address')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
        });

        // 2. Schools & Units
        Schema::create('schools', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->string('name');
            $table->string('npsn', 20)->unique();
            $table->string('tax_id', 20); // NPWP Sekolah
            $table->string('treasurer_name')->nullable();
            $table->string('principal_name')->nullable();
            $table->string('bank_name')->default('Bank DKI');
            $table->string('bank_account_number')->nullable();
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
        });

        // 3. Tax Rules & Rates
        Schema::create('tax_rules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code')->unique();
            $table->string('tax_type', 20); // PPN, PPH21, PPH22, PPH23, PPH4_2
            $table->string('name');
            $table->decimal('rate_percentage', 5, 2);
            $table->date('effective_from');
            $table->date('effective_to')->nullable();
            $table->text('description')->nullable();
            $table->string('version')->default('2026.1');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 4. Transactions
        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->string('trx_number')->unique();
            $table->date('date');
            $table->string('type'); // PENGADAAN_BOS, HONOR_GURU, etc.
            $table->string('category_name');
            $table->string('vendor_name');
            $table->string('vendor_npwp', 30);
            $table->text('description')->nullable();
            $table->decimal('gross_amount', 15, 2);
            $table->string('tax_type', 20);
            $table->decimal('tax_base', 15, 2);
            $table->decimal('tax_rate', 5, 2);
            $table->decimal('tax_amount', 15, 2);
            $table->decimal('net_amount', 15, 2);
            $table->string('status')->default('DRAFT');
            $table->string('created_by');
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->index(['tenant_id', 'date']);
        });

        // 5. Invoices (e-Faktur)
        Schema::create('invoices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('transaction_id')->nullable();
            $table->string('invoice_number');
            $table->string('tax_invoice_number'); // NSFP
            $table->string('type'); // MASUKAN / KELUARAN
            $table->date('date');
            $table->string('counterparty_name');
            $table->string('counterparty_npwp', 30);
            $table->decimal('dpp', 15, 2);
            $table->decimal('ppn_rate', 5, 2)->default(11.0);
            $table->decimal('ppn_amount', 15, 2);
            $table->decimal('total', 15, 2);
            $table->string('status')->default('TERBIT');
            $table->string('period', 10);
            $table->string('created_by');
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
        });

        // 6. Withholding Slips (e-Bupot)
        Schema::create('withholding_slips', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->string('bupot_number')->unique();
            $table->string('bupot_type'); // BP21, BPPU, BPNR, BP4_2
            $table->string('tax_type');
            $table->string('tax_object_code');
            $table->string('object_description');
            $table->string('beneficiary_name');
            $table->string('beneficiary_npwp_nik', 30);
            $table->decimal('gross_amount', 15, 2);
            $table->decimal('effective_rate', 5, 2);
            $table->decimal('tax_withheld', 15, 2);
            $table->integer('period_month');
            $table->integer('period_year');
            $table->string('status')->default('TERBIT');
            $table->string('created_by');
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
        });

        // 7. SPT Records
        Schema::create('spt_records', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->string('tax_type');
            $table->string('spt_category')->default('MASA');
            $table->string('tax_period');
            $table->integer('period_month');
            $table->integer('period_year');
            $table->decimal('total_dpp', 15, 2);
            $table->decimal('total_tax', 15, 2);
            $table->string('status')->default('KONSEP');
            $table->string('billing_code')->nullable();
            $table->string('ntpn')->nullable();
            $table->string('created_by');
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
        });

        // 8. Payments & Billing
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->string('billing_code')->unique();
            $table->string('tax_type');
            $table->string('period');
            $table->decimal('amount', 15, 2);
            $table->date('due_date');
            $table->string('status')->default('PENDING');
            $table->date('payment_date')->nullable();
            $table->string('payment_channel')->nullable();
            $table->string('ntpn', 30)->nullable();
            $table->text('reference_note')->nullable();
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
        });

        // 9. Immutable Audit Logs
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->nullable();
            $table->string('user_name');
            $table->string('user_role');
            $table->string('action'); // CREATE, UPDATE, APPROVE, LOGIN
            $table->string('module');
            $table->string('record_identifier');
            $table->text('details');
            $table->string('ip_address', 45);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('spt_records');
        Schema::dropIfExists('withholding_slips');
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('tax_rules');
        Schema::dropIfExists('schools');
        Schema::dropIfExists('tenants');
    }
};
