<?php

namespace App\Http\Requests\Predictions;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PredictionRequest extends FormRequest
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
            'project' => [Rule::when($this->input('project') > 0, function ($rule) {
                return ['required', 'int', 'exists:projects,id'];
            }, function ($rule) {
                return ['nullable', 'int'];
            })],
            'period' => ['required', 'int', 'min:1', 'max:12']
        ];
    }
}
