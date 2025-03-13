<?php

namespace App\ActionContracts\Auth;

use App\DataTransferObjects\Auth\ResetPasswordDTO;

interface ResetPasswordActionInterface
{
    public function handle(ResetPasswordDTO $data): string;
}
