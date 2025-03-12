<?php

namespace App\ActionContracts\Settings;

interface ChangePasswordActionInterface
{
    public function handle(string $password): void;
}
