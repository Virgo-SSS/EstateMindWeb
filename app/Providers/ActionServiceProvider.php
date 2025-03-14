<?php

namespace App\Providers;

use App\ActionContracts\Auth\ResetPasswordActionInterface;
use App\ActionContracts\Settings\ChangePasswordActionInterface;
use App\ActionContracts\Users\CreateUserActionInterface;
use App\Actions\Auth\ResetPasswordAction;
use App\Actions\Settings\ChangePasswordAction;
use App\Actions\Users\CreateUserAction;
use Illuminate\Support\ServiceProvider;

class ActionServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->app->bind(ChangePasswordActionInterface::class, ChangePasswordAction::class);
        $this->app->bind(ResetPasswordActionInterface::class, ResetPasswordAction::class);
        $this->app->bind(CreateUserActionInterface::class, CreateUserAction::class);
    }
}
