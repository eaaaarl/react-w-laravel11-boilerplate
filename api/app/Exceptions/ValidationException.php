<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Validation\Validator;

class ValidationException extends Exception
{
    protected $validator;
    public function render()
    {
        $errors = $this->validator->errors()->toArray();
        $key = array_key_first($errors);
        $message = $errors[$key][0];
        return response()->json(
            [
                "data" => [],
                "message" => $message,
                "errors" => $errors,
                "success" => false,
            ],
            422
        );
    }
    public function __construct(Validator $validator)
    {
        parent::__construct();
        $this->validator = $validator;
    }
}
