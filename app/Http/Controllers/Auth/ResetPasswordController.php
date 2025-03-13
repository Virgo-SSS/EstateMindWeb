<?php

namespace App\Http\Controllers\Auth;

use App\ActionContracts\Auth\ResetPasswordActionInterface;
use App\DataTransferObjects\Auth\ResetPasswordDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ResetPasswordRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;
use Inertia\Response;

class ResetPasswordController extends Controller
{
    public function index(string $token): Response
    {
        return Inertia::render('Auth/ResetPassword', ['token' => $token]);
    }

    public function resetPassword(ResetPasswordRequest $request, ResetPasswordActionInterface $action): RedirectResponse
    {
        $status = $action->handle(
            ResetPasswordDTO::fromArray($request->only('email', 'password', 'password_confirmation', 'token'))
        );

        return $status === Password::PasswordReset
            ? redirect()->route('login')->with('status', __($status))
            : back()->withErrors(['email' => [__($status)]]);
    }
}
