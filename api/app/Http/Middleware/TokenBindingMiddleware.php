<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class TokenBindingMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'data' => [],
                'message' => '[Token binding error] User not authenticated.',
                'success' => false
            ], 401); // Unauthorized if user is not authenticated
        }

        $tokenBindingId = $this->generateBindingIdFromUser($user);
        $currentBindingId = $this->generateBindingIdFromRequest($request);


        if ($tokenBindingId !== $currentBindingId) {
            return response()->json([
                'data' => [],
                'message' => '[Token binding error] You do not have access to this resource.',
                'success' => false
            ], 403);
        }

        return $next($request);
    }

    protected function generateBindingIdFromUser($user)
    {
        // Ensure consistent format by using '-' as separator
        return $user->ip . '-' . $user->user_agent;
    }

    protected function generateBindingIdFromRequest(Request $request)
    {
        return $request->ip() . '-' . $request->header('User-Agent');
    }
}
