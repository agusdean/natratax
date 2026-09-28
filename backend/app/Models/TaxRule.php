<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaxRule extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'code',
        'tax_type',
        'name',
        'rate_percentage',
        'effective_from',
        'effective_to',
        'description',
        'version',
        'is_active',
    ];

    protected $casts = [
        'rate_percentage' => 'float',
        'is_active' => 'boolean',
        'effective_from' => 'date',
        'effective_to' => 'date',
    ];
}
