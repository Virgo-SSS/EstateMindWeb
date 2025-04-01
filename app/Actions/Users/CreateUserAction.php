<?php

namespace App\Actions\Users;

use App\ActionContracts\Users\CreateUserActionInterface;
use App\DataTransferObjects\Users\CreateUserDTO;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;

class CreateUserAction implements CreateUserActionInterface
{
    public function handle(CreateUserDTO $data): void
    {
        User::query()->create([
            'name' => $data->name,
            'email' => $data->email,
            'password' => Hash::make($data->password),
            'role' => $data->role,
        ]);

        Cache::forget('users');
    }
}
