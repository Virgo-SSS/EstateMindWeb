<?php

namespace App\Http\Controllers\Auth;

use App\ActionContracts\Auth\ResetPasswordActionInterface;
use App\DataTransferObjects\Auth\ResetPasswordDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ResetPasswordRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;
use Inertia\Response;

class ResetPasswordController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Auth/ResetPassword', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]);
    }

    public function resetPassword(ResetPasswordRequest $request, ResetPasswordActionInterface $action): RedirectResponse
    {
        $status = $action->handle(
            ResetPasswordDTO::fromArray($request->only('email', 'password', 'token'))
        );

        return $status === Password::PasswordReset
            ? redirect()->route('login')->with('status', __($status))
            : back()->withErrors(['email' => [__($status)]]);
    }
}
