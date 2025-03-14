<?php

namespace App\Http\Controllers\Users;

use App\ActionContracts\Users\CreateUserActionInterface;
use App\DataTransferObjects\Users\CreateUserDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Users\UserStoreRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Users/Users', [
            'users' => User::all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Users/CreateUser');
    }

    public function store(UserStoreRequest $request, CreateUserActionInterface $action): RedirectResponse
    {
        $action->handle(
            CreateUserDTO::fromArray($request->validated())
        );

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }
}
