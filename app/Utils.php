<?php

namespace App;

use App\Models\DB;

class Utils
{
    /**
     * @param $token
     * @param $id - user id
     */
    public static function storeToken($token, $id)
    {
        $db = new DB;

        $accessToken = $token->getToken();
        $refreshToken = $token->getRefreshToken();
        $expires = $token->getExpires();

        $db->insertToken($id, $accessToken, $refreshToken, $expires);
    }

    /**
     * @param KangarooRewards\OAuth2\Client\Provider\Kangaroo $provider
     * @return mixed
     */
    public static function retrieveToken($id, $provider)
    {
        $db = new DB;
        $dbToken = $db->getToken($id);

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

            self::storeToken($newAccessToken, $id);

            $token = $newAccessToken;
        }

        return $token;
    }


    /**
     * @param $token
     * @param $id - user id
     */
    public static function saveUserToken($id, $token)
    {
        $db = new DB;

        $db->saveUserToken($id, $token);
    }

    /**
     * @param string $id
     * @return mixed
     */
    public static function findUserToken($id)
    {
        $db = new DB;
        $dbToken = $db->getUserToken($id);

        if (!$dbToken) {
            throw new \Exception("Not token found", 1);
        }
    }
}
