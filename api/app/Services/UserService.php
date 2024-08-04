<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;

class UserService
{
    public function create($payload)
    {
        $user = User::create([
            "name" => $payload["name"],
            "email" => $payload["email"],
            "password" => bcrypt($payload["password"]),
            "email_verified_at" => Carbon::now()->format("Y-m-d H:i:s"),
            'ip' => $payload['ip'] ?? null,
            'user_agent' => $payload['user_agent'] ?? null
        ]);

        return $user;
    }
}