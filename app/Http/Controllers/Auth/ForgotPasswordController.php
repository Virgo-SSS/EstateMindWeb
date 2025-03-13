<?php

namespace App\Http\Controllers\Auth;

use App\ActionContracts\Auth\ResetPasswordActionInterface;
use App\DataTransferObjects\Auth\ResetPasswordDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;
use Inertia\Response;

class ForgotPasswordController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    public function sendResetLinkEmail(ForgotPasswordRequest $request): RedirectResponse
    {
        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::ResetLinkSent
            ? redirect()->route('password.request')->with(['status' => __($status)])
            : redirect()->route('password.request')->withErrors(['email' => __($status)]);
    }
}
