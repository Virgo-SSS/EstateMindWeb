<?php

namespace App\Http\Requests\Sales;

use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class SaleStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'sales' => ['required', 'array'],
            'sales.*.project' => ['required', 'string'],
            'sales.*.date' => ['required', 'date_format:Y-m', 'date'],
            'sales.*.quantity' => ['required', 'numeric', 'min:0'],
        ];
    }
}
