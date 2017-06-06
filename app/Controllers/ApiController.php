<?php

namespace App\Controllers;

use App\Utils;
use Wallaby\Base\Controller;
use KangarooRewards\OAuth2\Client\Provider\Kangaroo as KangarooProvider;

class ApiController extends Controller
{
    protected $client;

    protected $provider;
    
    protected $requestHeaders = [
        'Accept' => 'application/vnd.kangaroorewards.api.v1+json;',
        'Content-Type' => 'application/json',
    ];

    protected $config = [];

    /**
     *
     *
     * @return void
     */
    public function __construct()
    {
        $this->config = $GLOBALS['config'];

        $this->client = new \GuzzleHttp\Client([
            'base_uri' => $this->config['api']['baseUrl'],
        ]);

        $this->provider = new KangarooProvider([
            'clientId' => $this->config['api']['client_id'],
            'clientSecret' => $this->config['api']['client_secret'],
            'redirectUri' => $this->config['api']['callback'],
            'urlAuthorize' => $this->config['api']['baseUrl'] . '/oauth/authorize',
            'urlAccessToken' => $this->config['api']['baseUrl'] . '/oauth/token',
            'urlResourceOwnerDetails' => $this->config['api']['baseUrl'] . '/me',
        ]);

        $this->requestHeaders = array_merge($this->requestHeaders, [
            'X-Application-Key' => $this->config['headers']['X-Application-Key'],
        ]);
    }

    public function actionSetUserToken()
    {
        $token = Utils::saveUserToken($_POST['user_id'], $_POST['token']);

        $this->response(json_encode([
            'user_id' => $_POST['user_id'],
            'token' => $token,
        ]));
    }

    public function actionGetUserToken()
    {
        $token = Utils::findUserToken($_GET['user_id']);

        $this->response(json_encode([
            'user_id' => $_GET['user_id'],
            'token' => stripslashes($token),
        ]));
    }

    public function actionLogin()
    {
        try {
            // Try to get an access token (using the authorization code grant)
            $token = $this->provider->getAccessToken('password',[
                'username' => $_POST['username'],
                'password' => $_POST['password'],
                'application_key' => $this->config['headers']['X-Application-Key'],
                'scope' => $this->config['api']['scope'],
            ]);

            $response = $this->client->get('users/me', [
                'headers' => array_merge($this->requestHeaders, [
                    'Authorization' => 'Bearer ' . $token->getToken(),
                ]),
            ]);

            $user = json_decode($response->getBody());
            
            Utils::storeToken($token, $user->data->id);

            $this->response(json_encode([
                'access_token' => $token->getToken(),
                'refresh_token' => $token->getRefreshToken(),
                'expires' => $token->getExpires(),
                'token_type' => 'Bearer',
            ]));

        } catch (\Exception $e) {
            $this->response(json_encode(['message' => $e->getMessage()]), $e->getCode());
        }
    }

    public function actionAddPosAccount()
    {
        try {
            $token = Utils::retrieveToken($this->provider);

            $response = $this->client->patch('users/111', [
                'headers' => array_merge($this->requestHeaders, [
                    'Authorization' => 'Bearer ' . $token->getToken(),
                ]),
                'json' => [
                    'intent' => 'pos_accounts',
                    'pos_accounts' => [[
                        'pos_id' => $_POST['pos_id'],
                        'account_id' => $_POST['account_id'],
                        'postal_code' => $_POST['postal_code'],
                    ]]
                ],
            ]);

            $this->response($response->getBody());

        } catch (\Exception $e) {
            if ($e->hasResponse()) {
                $this->response($e->getResponse()->getBody(), $e->getCode());
            }
            echo '<pre>'; print_r($e); die;
            // echo '<pre>'; print_r($e->getMessage()); die;
        }
    }

    private function response($body = '', $status = 200, $contentType = 'application/json')
    {
        $status_header = 'HTTP/1.1 ' . $status . ' ' . self::_getStatusCodeMessage($status);

        // set the status
        header($status_header);

        // set the content type
        header('Content-type: ' . $contentType);

        echo $body;

        exit(0);
    }

    private static function _getStatusCodeMessage($status)
    {
        $codes = array(
            100 => 'Continue',
            101 => 'Switching Protocols',
            200 => 'OK',
            201 => 'Created',
            202 => 'Accepted',
            203 => 'Non-Authoritative Information',
            204 => 'No Content',
            205 => 'Reset Content',
            206 => 'Partial Content',
            300 => 'Multiple Choices',
            301 => 'Moved Permanently',
            302 => 'Found',
            303 => 'See Other',
            304 => 'Not Modified',
            305 => 'Use Proxy',
            306 => 'User Authentication Required',
            307 => 'Temporary Redirect',
            400 => 'Bad Request',
            401 => 'Unauthorized',
            402 => 'Payment Required',
            403 => 'Forbidden',
            404 => 'Not Found',
            405 => 'Method Not Allowed',
            406 => 'Not Acceptable',
            407 => 'Proxy Authentication Required',
            408 => 'Request Timeout',
            409 => 'Conflict',
            410 => 'Gone',
            411 => 'Length Required',
            412 => 'Precondition Failed',
            413 => 'Request Entity Too Large',
            414 => 'Request-URI Too Long',
            415 => 'Unsupported Media Type',
            416 => 'Requested Range Not Satisfiable',
            417 => 'Expectation Failed',
            500 => 'Internal Server Error',
            501 => 'Not Implemented',
            502 => 'Bad Gateway',
            503 => 'Service Unavailable',
            504 => 'Gateway Timeout',
            505 => 'HTTP Version Not Supported',
        );

        return (isset($codes[$status])) ? $codes[$status] : '';
    }
}
