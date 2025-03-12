<?php

namespace App\Http\Controllers\Auth;

use App\ActionContracts\Auth\LoginActionInterface;
use App\DataTransferObjects\Auth\LoginDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    public function index(): Response
    {
        return Inertia::render("Auth/Login");
    }

    public function login(LoginRequest $request, LoginActionInterface $action): RedirectResponse
    {
        try {
            $action->handle(LoginDTO::fromArray($request->validated()));
            $request->session()->regenerate();
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors());
        }

        return redirect()->intended(route("dashboard"));
    }
}
