<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'tenant_id',
        'trx_number',
        'date',
        'type',
        'category_name',
        'vendor_name',
        'vendor_npwp',
        'description',
        'gross_amount',
        'tax_type',
        'tax_base',
        'tax_rate',
        'tax_amount',
        'net_amount',
        'status',
        'created_by',
    ];

    protected $casts = [
        'gross_amount' => 'decimal:2',
        'tax_base' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'net_amount' => 'decimal:2',
        'date' => 'date',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }
}
