<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return 'This is the root URL of App.';
});

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;

Route::get('images/{filename}', function ($filename) {
    $path = storage_path('app/public/images/' . $filename);

    if (!file_exists($path)) {
        abort(404);
    }

    $file = Storage::disk('public')->get('images/' . $filename);
    $type = Storage::disk('public')->mimeType('images/' . $filename);

    return Response::make($file, 200)->header("Content-Type", $type);
});