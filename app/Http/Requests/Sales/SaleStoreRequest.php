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
            'project_id' => ['required', 'int', 'exists:projects,id',
                Rule::unique('sales', 'project_id')->where(function (Builder $query) {
                    return $query->where('date', $this->date . '-01');
                }),
            ],
            'date' => ['required', 'date:Y-m'],
            'quantity' => ['required', 'int', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'project_id.unique' => 'The project has already been registered for this month, choose another month or project.',
        ];
    }
}
