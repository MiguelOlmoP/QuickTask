<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'fecha',
        'prioridad',
        'texto',
        'user_id'
    ];
}
