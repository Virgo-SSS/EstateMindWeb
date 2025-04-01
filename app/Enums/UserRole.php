<?php

namespace App\Enums;

enum UserRole: int
{
    case SUPER_ADMIN = 1;
    case ADMIN = 2;

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function instance(int $value): self
    {
        return match ($value) {
            self::SUPER_ADMIN->value => self::SUPER_ADMIN,
            self::ADMIN->value => self::ADMIN,
        };
    }
}
