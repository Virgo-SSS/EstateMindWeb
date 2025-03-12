<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Settings\ChangePasswordController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'index'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'login'])->name('login.attempt');
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::post('/logout', [AuthenticatedSessionController::class, 'logout'])->name('logout');

    Route::get('/settings/password', [ChangePasswordController::class, 'index'])->name('settings.password');
    Route::post('/settings/password', [ChangePasswordController::class, 'update'])->name('settings.password.update');
});
