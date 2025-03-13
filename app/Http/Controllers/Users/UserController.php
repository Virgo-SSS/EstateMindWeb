<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
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
}
