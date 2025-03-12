<?php

namespace App\Actions\Auth;

use App\ActionContracts\Auth\LoginActionInterface;
use App\DataTransferObjects\Auth\LoginDTO;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginAction implements LoginActionInterface
{
    /**
     * @throws ValidationException
     */
    public function handle(LoginDTO $data): void
    {
        $this->ensureIsNotRateLimited($data);

        if (! Auth::attempt(['email' => $data->email, 'password' => $data->password], $data->remember)) {
            RateLimiter::hit($this->throttleKey($data));

            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey($data));
    }

    /**
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(LoginDTO $data): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey($data), 5)) {
            return;
        }

        event(new Lockout(request()));

        $seconds = RateLimiter::availableIn($this->throttleKey($data));

        throw ValidationException::withMessages([
            'email' => __('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    public function throttleKey(LoginDTO $data): string
    {
        return Str::transliterate(Str::lower($data->email) . '|'. getIp());
    }
}
