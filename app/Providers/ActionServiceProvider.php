<?php

namespace App\Providers;

use App\ActionContracts\Auth\LoginActionInterface;
use App\Actions\Auth\LoginAction;
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
        $this->app->bind(LoginActionInterface::class, LoginAction::class);
    }
}
