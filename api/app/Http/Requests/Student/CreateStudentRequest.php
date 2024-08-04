<?php

namespace App\Http\Requests\Student;

use App\Http\Requests\BaseFormRequest;


class CreateStudentRequest extends BaseFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => "required|string|min:4|max:255",
            "status" => "required|string|min:4|max:255",
            "image" => "nullable|image|mimes:png,jpg,jpeg,svg,gif|max:2048",
        ];
    }
}
