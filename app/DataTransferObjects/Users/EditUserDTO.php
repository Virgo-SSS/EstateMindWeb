<?php

namespace App\DataTransferObjects\Users;

class EditUserDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public ?string $password,
        public bool $isSuperAdmin,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            email: $data['email'],
            password: $data['password'] ?? null,
            isSuperAdmin: $data['is_super_admin'],
        );
    }
}
