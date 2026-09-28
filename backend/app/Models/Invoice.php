<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'tenant_id',
        'transaction_id',
        'invoice_number',
        'tax_invoice_number',
        'type',
        'date',
        'counterparty_name',
        'counterparty_npwp',
        'dpp',
        'ppn_rate',
        'ppn_amount',
        'total',
        'status',
        'period',
        'created_by',
    ];

    protected $casts = [
        'dpp' => 'decimal:2',
        'ppn_rate' => 'decimal:2',
        'ppn_amount' => 'decimal:2',
        'total' => 'decimal:2',
        'date' => 'date',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
