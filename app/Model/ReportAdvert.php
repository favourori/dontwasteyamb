<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class ReportAdvert extends Model
{
    protected $fillable = ['user_id', 'advert_id', 'report'];
}
