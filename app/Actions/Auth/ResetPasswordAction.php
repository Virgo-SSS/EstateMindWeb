<?php

namespace App\Actions\Auth;

use App\ActionContracts\Auth\ResetPasswordActionInterface;
use App\DataTransferObjects\Auth\ResetPasswordDTO;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Foundation\Auth\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class ResetPasswordAction implements ResetPasswordActionInterface
{
    public function handle(ResetPasswordDTO $data): string
    {
        return Password::reset(
            $data->toArray(),
            function (User $user) use ($data) {
                $user->forceFill([
                    'password' => Hash::make($data->password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );
    }
}
