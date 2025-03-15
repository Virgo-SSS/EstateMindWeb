<?php

namespace App\Http\Controllers\Users;

use App\ActionContracts\Users\CreateUserActionInterface;
use App\ActionContracts\Users\EditUserActionInterface;
use App\DataTransferObjects\Users\CreateUserDTO;
use App\DataTransferObjects\Users\EditUserDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Users\UserStoreRequest;
use App\Http\Requests\Users\UserUpdateRequest;
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

    public function edit(User $user): Response
    {
        return Inertia::render('Users/EditUser', [
            'user' => $user,
        ]);
    }

    public function update(UserUpdateRequest $request, User $user, EditUserActionInterface $action): RedirectResponse
    {
        $action->handle(
            $user,
            EditUserDTO::fromArray($request->validated())
        );

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }
}
