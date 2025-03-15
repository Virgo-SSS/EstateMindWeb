<?php

namespace App\ActionContracts\Users;

use App\DataTransferObjects\Users\CreateUserDTO;
use App\DataTransferObjects\Users\EditUserDTO;
use App\Models\User;

interface EditUserActionInterface
{
    public function handle(User $user, EditUserDTO $data): void;
}
