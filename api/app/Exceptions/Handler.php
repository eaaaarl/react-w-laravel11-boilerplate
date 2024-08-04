<?php

namespace App\Exceptions;

use Illuminate\Database\Eloquent\ModelNotFoundException;


class Handler extends \Illuminate\Foundation\Exceptions\Handler
{
    public function render(
        $request,
        \Throwable $e
    ) {
        if ($e instanceof ModelNotFoundException) {
            return response()->json(
                [
                    'data' => [],
                    'message' => 'The identifier you are querying does not exist.',
                    'success' => false
                ],
                404
            );
        }

        return parent::render($request, $e);
    }
}
