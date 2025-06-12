<?php

namespace App\Providers;

use App\ActionContracts\Auth\ResetPasswordActionInterface;
use App\ActionContracts\Predictions\PredictionActionInterface;
use App\ActionContracts\Sales\CreateSaleActionInterface;
use App\ActionContracts\Sales\EditSaleActionInterface;
use App\ActionContracts\Settings\ChangePasswordActionInterface;
use App\ActionContracts\Users\CreateUserActionInterface;
use App\ActionContracts\Users\EditUserActionInterface;
use App\Actions\Auth\ResetPasswordAction;
use App\Actions\Predictions\PredictionAction;
use App\Actions\Sales\CreateSaleAction;
use App\Actions\Sales\EditSaleAction;
use App\Actions\Settings\ChangePasswordAction;
use App\Actions\Users\CreateUserAction;
use App\Actions\Users\EditUserAction;
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
        $this->app->bind(EditUserActionInterface::class, EditUserAction::class);
        $this->app->bind(CreateSaleActionInterface::class, CreateSaleAction::class);
        $this->app->bind(EditSaleActionInterface::class, EditSaleAction::class);
        $this->app->bind(PredictionActionInterface::class, PredictionAction::class);
    }
}
