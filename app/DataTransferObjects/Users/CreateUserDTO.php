<?php

namespace App\DataTransferObjects\Users;

use App\Enums\UserRole;

class CreateUserDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
        public UserRole $role,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            email: $data['email'],
            password: $data['password'],
            role: UserRole::instance($data['role']),
        );
    }
}
