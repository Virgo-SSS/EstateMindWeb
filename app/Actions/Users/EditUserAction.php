<?php

namespace App\Actions\Users;

use App\ActionContracts\Users\EditUserActionInterface;
use App\DataTransferObjects\Users\EditUserDTO;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;

class EditUserAction implements EditUserActionInterface
{
    public function handle(User $user, EditUserDTO $data): void
    {
        $newData = [
            'name' => $data->name,
            'email' => $data->email,
            'role' => $data->role,
        ];

        if ($data->password) {
            $newData['password'] = Hash::make($data->password);
        }

        $user->update($newData);

        Cache::forget('users');
    }
}
