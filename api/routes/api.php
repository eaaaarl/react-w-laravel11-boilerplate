<?php

use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\StudentController;
use Illuminate\Support\Facades\Route;

Route::prefix("auth")->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::middleware(['auth:api', 'token_binding'])->get('/refresh', [
        AuthController::class,
        'refresh'
    ]);
    Route::middleware(['auth:api'])->get('/logout', [
        AuthController::class,
        'logout',
    ]);
});

Route::prefix('students')->group(function () {
    Route::post('/', [StudentController::class, 'create']);
    Route::get('/', [StudentController::class, 'index']);

    Route::get('/{id}', [StudentController::class, 'getStudent']);
    Route::put('/{id}', [StudentController::class, 'update']);
    Route::delete('/{id}', [StudentController::class, 'delete']);
});