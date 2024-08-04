<?php

namespace App\Services;

use App\Models\Student;
use Exception;

class StudentService
{
    public function list($payload)
    {
        $page = $payload['page'] ?? 1;
        $per_page = $payload['per_page'] ?? 5;
        $search = $payload['search'] ?? null;

        $query = Student::query();
        if ($search) {
            $query->where('name', 'like', '%' . $search . '%');
        }

        return $query->paginate($per_page, ['*'], 'page', $page);
    }
    public function delete($payload)
    {
        $ImageStorageService = new ImageStorageService();
        $student = Student::where("id", $payload['id'])->first();

        if (empty($student)) {
            throw new Exception('No Data Found.');
        }

        if ($student->image) {
            $ImageStorageService->delete($student->image);
        }

        $student->delete();
        return $student;
    }
}