<?php

if (! function_exists('getIp')) {
    function getIp(): ?string
    {
        if(config('app.env') === 'testing') {
            return '127.0.0.1';
        }

        $ip = $_SERVER['REMOTE_ADDR'];
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        }

        return $ip;
    }
}
