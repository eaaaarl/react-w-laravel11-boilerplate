<?php

namespace App\Services;

use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    public function register($payload)
    {
        $userService = app()->make(UserService::class);
        $user = $userService->create($payload);

        $accessToken = $user->createToken("access_token")->accessToken;
        return [
            "access_token" => $accessToken,
            'user' => $user
        ];
    }
    public function login($payload)
    {
        if (
            !Auth::attempt([
                'email' => $payload['email'],
                'password' => $payload['password'],
            ])
        ) {
            throw new Exception('Invalid credentials.');
        }
        $user = Auth::user();
        $user->update([
            'user_agent' => $payload['user_agent'] ?? null,
            'ip' => $payload['ip'] ?? null,
        ]);
        $accessToken = $user->createToken('access_token')->accessToken;
        return [
            'access_token' => $accessToken,
            'user' => $user,
        ];
    }
    public function refresh($payload)
    {
        $user = Auth::user();
        $user->update([
            'user_agent' => $payload['user_agent'] ?? null,
            'ip' => $payload['ip'] ?? null,
        ]);
        $accessToken = $user->createToken('access_token')->accessToken;
        return [
            'access_token' => $accessToken,
            'user' => $user,
        ];
    }
    public function logout()
    {
        $user = Auth::user();
        $user->tokens()->delete();

        return [];
    }
}