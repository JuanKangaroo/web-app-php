<?php
namespace App\Models;
 
/**
 * SQLite connnection
 */
class DB {
    
    /**
     * Sql Lite
     * @var type 
     */
    private $db;
    private $fpdo;
 
    public function __construct()
    {
        $pdo = new \PDO( 'sqlite:' . __DIR__ . '/../../storage/sqlite.db');
        $this->fpdo = new \FluentPDO($pdo);
    }

    // public function getToken($id)
    // {
    //     // $statement = $this->db->query();
    //     $statement = $this->db->prepare('SELECT * FROM tokens WHERE id=:id ORDER BY expires DESC LIMIT 1;');
    //     $statement->bindValue(':id', $id);
    //     $statement->execute();

    //     $tokens = [];
    //     while ($row = $statement->fetchArray()) {
    //         $tokens[] = [
    //             'access_token' => $row['access_token'],
    //             'refresh_token' => $row['refresh_token'],
    //             'expires' => $row['expires'],
    //         ];
    //     }
    //     return $tokens[0];
    // }

    // public function insertToken($id, $accessToken, $refreshToken, $expires)
    // {
    //     $sql = 'INSERT INTO tokens (id, access_token, refresh_token, expires)
    //         VALUES (:id, :accessToken, :refreshToken, :expires);';

    //     $statement = $this->db->prepare($sql);
    //     $statement->bindValue(':id', $id);
    //     $statement->bindValue(':accessToken', $accessToken);
    //     $statement->bindValue(':refreshToken', $refreshToken);
    //     $statement->bindValue(':expires', $expires);
    //     $statement->execute();
    // }

    // /**
    //  * Creates tokens table
    //  *
    //  * @return void
    //  */
    // public function createTokensTable() {
    //     $query = '
    //         CREATE TABLE IF NOT EXISTS tokens (
    //             id varchar(100),
    //             access_token text,
    //             refresh_token text,
    //             expires timestamp
    //         )';
    //     $this->db->exec($query) or die('CREATE TABLE failed');
    // }

    public function getUserToken($id)
    {
        $query = $this->fpdo->from('user_tokens')->where('id', $id);

        return $query->fetch('token');
    }

    public function saveUserToken($id, $token)
    {
        if ($this->getUserToken($id)) {
            $query = $this->fpdo->update('user_tokens')->set(['token' => $token])->where('id', $id);
            $query->execute();
        } else {
            return $this->insertUserToken($id, $token);
        }
    }

    public function insertUserToken($id, $token)
    {
        $query = $this->fpdo->insertInto('user_tokens')->values([
            'id' => $id,
            'token' => $token,
        ]);    
        if (!$query->execute()) {
            throw new Exception("Token could not be saved", 1);
        }
    }

    /**
     * Creates tokens table
     *
     * @return void
     */
    public function createUserTokensTable() {
        $this->db = new \SQLite3(__DIR__ . '/../../storage/sqlite.db');

        $query = '
            CREATE TABLE IF NOT EXISTS user_tokens (
                id varchar(100),
                token text,
                PRIMARY KEY (`id`)
            )';
        $this->db->exec($query) or die('CREATE TABLE failed');
    }
}