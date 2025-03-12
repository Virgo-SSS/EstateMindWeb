<?php

namespace App\Providers;

use App\ActionContracts\Auth\LoginActionInterface;
use App\ActionContracts\Settings\ChangePasswordActionInterface;
use App\Actions\Auth\LoginAction;
use App\Actions\Settings\ChangePasswordAction;
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
    }
}
