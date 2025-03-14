<?php

namespace App\ActionContracts\Users;

use App\DataTransferObjects\Users\CreateUserDTO;

interface CreateUserActionInterface
{
    public function handle(CreateUserDTO $data): void;
}
