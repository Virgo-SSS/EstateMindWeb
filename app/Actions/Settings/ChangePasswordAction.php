<?php

namespace App\Actions\Settings;

use App\ActionContracts\Settings\ChangePasswordActionInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ChangePasswordAction implements ChangePasswordActionInterface
{
    public function handle(string $password): void
    {
        Auth::user()->update([
            'password' => Hash::make($password),
        ]);
    }
}
