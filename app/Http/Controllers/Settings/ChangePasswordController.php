<?php

namespace App\Http\Controllers\Settings;

use App\ActionContracts\Settings\ChangePasswordActionInterface;
use App\Http\Controllers\Auth\Hash;
use App\Http\Controllers\Auth\Password;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ChangePasswordRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ChangePasswordController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Settings/Password');
    }

    public function update(ChangePasswordRequest $request, ChangePasswordActionInterface $action): RedirectResponse
    {
        $action->handle($request->validated('password'));

        return redirect()->route('settings.password')->with('success', 'Password updated successfully.');
    }
}
