<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SptRecord extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'tenant_id',
        'tax_type',
        'spt_category',
        'tax_period',
        'period_month',
        'period_year',
        'total_dpp',
        'total_tax',
        'status',
        'billing_code',
        'ntpn',
        'created_by',
    ];

    protected $casts = [
        'total_dpp' => 'decimal:2',
        'total_tax' => 'decimal:2',
        'period_month' => 'integer',
        'period_year' => 'integer',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
