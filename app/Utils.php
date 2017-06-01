<?php

namespace App;

use App\Models\DB;

class Utils
{

    /**
     * @param $token
     */
    public static function storeToken($token)
    {
        $db = new DB;

        $accessToken = $token->getToken();
        $refreshToken = $token->getRefreshToken();
        $expires = $token->getExpires();

        $db->insertToken($accessToken, $refreshToken, $expires);
    }

    /**
     * @param KangarooRewards\OAuth2\Client\Provider\Kangaroo $provider
     * @return mixed
     */
    public static function retrieveToken($provider)
    {
        $db = new DB;
        $dbToken = $db->getToken();

        if (!$dbToken) {
            throw new \Exception("Not token found", 1);
        }

        $token = new \League\OAuth2\Client\Token\AccessToken([
            'access_token' => $dbToken['access_token'],
            'refresh_token' => $dbToken['refresh_token'],
            'expires' => $dbToken['expires'],
        ]);
        
        //Check if token expired
        if ($token->hasExpired()) {
            $newAccessToken = $provider->getAccessToken('refresh_token', [
                'refresh_token' => $token->getRefreshToken(),
            ]);

            self::storeToken($newAccessToken);

            $token = $newAccessToken;
        }

        return $token;
    }
}
