<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\CreateStudentRequest;
use App\Http\Requests\Student\ListStudentRequest;
use App\Http\Requests\Student\UpdateStudentRequest;
use App\Models\Student;
use App\Services\ImageStorageService;
use App\Services\StudentService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

class StudentController extends Controller
{
    public function index(
        ListStudentRequest $request,
        StudentService $service
    ) {
        try {
            $payload = $request->all();
            $data = $service->list($payload);
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
    public function create(
        CreateStudentRequest $request
    ) {
        try {
            $payload = $request->all();

            $ImageStorageService = new ImageStorageService();
            $fileName = $ImageStorageService->store($payload);
            $data = Student::create([
                'name' => $payload['name'],
                'status' => $payload['status'],
                'image' => $fileName
            ]);

            return response()->json([
                'data' => $data,
                'message' => 'Api request Done.',
                'success' => true
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'data' => [],
                'message' => $e->getMessage(),
                'success' => false
            ], 422);
        }

    }
    public function getStudent($id)
    {
        $data = Student::where('id', $id)->first();

        if (!$data) {
            return response()->json([
                'data' => [],
                'message' => 'No Student Found.',
                'success' => false
            ], 400);
        }

        return response()->json([
            'data' => $data,
            'message' => 'Api request Done.',
            'success' => true
        ], 200);
    }
    public function update(
        UpdateStudentRequest $request,
        $id
    ) {
        try {
            $payload = $request->all();
            $ImageStorageService = new ImageStorageService();
            $data = Student::where('id', $id)->first();

            if (!$data) {
                return response()->json([
                    'data' => [],
                    'message' => 'No Student Found.',
                    'success' => false
                ], 404);
            }

            $fileName = $ImageStorageService->replace($payload, $data->image);

            $data->update([
                'name' => $payload['name'],
                'status' => $payload['status'],
                'image' => $fileName
            ]);

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
            ], 422);
        }
    }
    public function delete(
        Request $request,
        StudentService $service,
        $id
    ) {
        try {
            $payload = $request->all();
            $payload['id'] = $id;
            $data = $service->delete($payload);
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
            ], 404);
        }

    }
}
