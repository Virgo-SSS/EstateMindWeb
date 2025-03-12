<?php

namespace App\ActionContracts\Auth;

use App\DataTransferObjects\Auth\LoginDTO;

interface LoginActionInterface
{
    public function handle(LoginDTO $data): void;
}
