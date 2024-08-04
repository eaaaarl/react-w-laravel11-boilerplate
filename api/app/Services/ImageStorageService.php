<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Str;

class ImageStorageService
{
    public function store($payload)
    {
        $image = $payload['image'] ?? null;
        if ($image) {
            $fileName = Str::uuid() . '.' . $image->getClientOriginalExtension();
            Storage::disk('public')->putFileAs(
                'images',
                $image,
                $fileName
            );
            return $fileName;
        }
    }
    public function delete($fileName)
    {
        if ($fileName) {
            Storage::disk('public')->delete('images/' . $fileName);
        }
    }
    public function replace($payload, $oldfileName)
    {
        if (isset($payload['image'])) {
            if ($oldfileName) {
                $this->delete($oldfileName);
            }
            return $this->store($payload);
        } else {
            $fileName = $oldfileName;
        }
        return $fileName;
    }
}