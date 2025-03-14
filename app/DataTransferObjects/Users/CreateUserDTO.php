<?php

namespace App\DataTransferObjects\Users;

class CreateUserDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
        public bool $is_super_admin,
    )
    {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            email: $data['email'],
            password: $data['password'],
            is_super_admin: $data['is_super_admin'],
        );
    }
}
