<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\AuthService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(
        LoginRequest $request,
        AuthService $service
    ) {
        try {
            $payload = $request->all();
            $payload['ip'] = $request->ip() ?? null;
            $payload['user_agent'] = $request->header('User-Agent') ?? null;
            $data = $service->login($payload);
            return response()->json([
                'data' => $data,
                'message' => 'Api request Done.',
                'success' => true
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'data' => [],
                'message' => $e->getMessage(),
                'success' => false
            ], 400);
        }

    }
    public function register(
        RegisterRequest $request,
        AuthService $service
    ) {
        try {
            $payload = $request->all();
            $payload['ip'] = $request->ip() ?? null;
            $payload['user_agent'] = $request->header('User-Agent') ?? null;
            $data = $service->register($payload);
            return response()->json([
                'data' => $data,
                'message' => 'Api request Done.',
                'success' => true
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'data' => [],
                'message' => $e->getMessage(),
                'success' => false
            ], 400);
        }
    }
    public function refresh(
        Request $request,
        AuthService $service
    ) {
        try {
            $payload = $request->all();
            $payload['ip'] = $request->ip() ?? null;
            $payload['user_agent'] = $request->header('User-Agent') ?? null;
            $data = $service->refresh($payload);
            return response()->json([
                'data' => $data,
                'message' => 'Api request Done.',
                'success' => true
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'data' => [],
                'message' => $e->getMessage(),
                'success' => false
            ], 400);
        }
    }
    public function logout(AuthService $service)
    {
        try {
            $data = $service->logout();
            return response()->json([
                'data' => $data,
                'message' => 'Api request Done.',
                'success' => true
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'data' => [],
                'message' => $e->getMessage(),
                'success' => false
            ], 400);
        }
    }
}
