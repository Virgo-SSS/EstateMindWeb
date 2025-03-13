<?php

namespace App\DataTransferObjects\Auth;

class ResetPasswordDTO
{
    public function __construct(
        public string $email,
        public string $password,
        public string $password_confirmation,
        public string $token
    ) {
    }

    public static function fromArray(array $array): self
    {
        return new self(
            email: $array['email'],
            password: $array['password'],
            password_confirmation: $array['password_confirmation'],
            token: $array['token']
        );
    }

    public function toArray(): array
    {
        return [
            'email' => $this->email,
            'password' => $this->password,
            'password_confirmation' => $this->password_confirmation,
            'token' => $this->token
        ];
    }
}
