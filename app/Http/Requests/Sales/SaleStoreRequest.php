<?php

namespace App\Http\Requests\Sales;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

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
            'sales.*.project' => ['required', 'numeric'],
            'sales.*.date' => ['required', 'date', 'date_format:Y-m'],
            'sales.*.quantity' => ['required', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'sales.*.project.required' => 'The sales project field is required.',
            'sales.*.project.numeric' => 'The sales project field must be a number.',
            'sales.*.date.date' => 'The sales date field must be a valid date.',
            'sales.*.date.required' => 'The sales date field is required.',
            'sales.*.date.date_format' => 'The sales date field must match the format Y-m.',
            'sales.*.quantity.numeric' => 'The sales quantity field must be a number.',
            'sales.*.quantity.required' => 'The sales quantity field is required.',
            'sales.*.quantity.min' => 'The sales quantity field must be at least 0.',
        ];
    }
}
