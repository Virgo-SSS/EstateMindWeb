<?php

namespace App\DataTransferObjects\Auth;

class LoginDTO
{
    public function __construct(
        public string $email,
        public string $password,
        public bool $remember
    ){}

    public static function fromArray(array $data): self
    {
        return new self(
            email: $data['email'],
            password: $data['password'],
            remember: $data['remember'] ?? false
        );
    }
}
