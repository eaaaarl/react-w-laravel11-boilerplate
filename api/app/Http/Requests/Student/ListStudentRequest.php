<?php

namespace App\Http\Requests\Student;

use App\Http\Requests\BaseFormRequest;


class ListStudentRequest extends BaseFormRequest
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
            "page" => "nullable|integer",
            "per_page" => "nullable|integer",
            "search" => "nullable|string",
        ];
    }
}
