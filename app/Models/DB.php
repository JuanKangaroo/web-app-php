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
 
    public function __construct()
    {
        $this->db = new \SQLite3(__DIR__ . '/../../storage/sqlite.db');

        $this->createTokensTable();
        $this->createUserTokensTable();
    }

    public function getToken($id)
    {
        // $statement = $this->db->query();

        $statement = $this->db->prepare('SELECT * FROM tokens WHERE id=:id ORDER BY expires DESC LIMIT 1;');
        $statement->bindValue(':id', $id);
        $statement->execute();

        $tokens = [];
        while ($row = $statement->fetchArray()) {
            $tokens[] = [
                'access_token' => $row['access_token'],
                'refresh_token' => $row['refresh_token'],
                'expires' => $row['expires'],
            ];
        }
        return $tokens[0];
    }

    public function insertToken($id, $accessToken, $refreshToken, $expires)
    {
        $sql = 'INSERT INTO tokens (id, access_token, refresh_token, expires)
            VALUES (:id, :accessToken, :refreshToken, :expires);';

        $statement = $this->db->prepare($sql);
        $statement->bindValue(':id', $id);
        $statement->bindValue(':accessToken', $accessToken);
        $statement->bindValue(':refreshToken', $refreshToken);
        $statement->bindValue(':expires', $expires);
        $statement->execute();
    }

    /**
     * Creates tokens table
     *
     * @return void
     */
    public function createTokensTable() {
        $query = '
            CREATE TABLE IF NOT EXISTS tokens (
                id varchar(100),
                access_token text,
                refresh_token text,
                expires timestamp
            )';
        $this->db->exec($query) or die('CREATE TABLE failed');
    }

    public function getUserToken($id)
    {
        // $result = $this->db->query('SELECT * FROM user_tokens;');

        // echo '<pre>'; print_r($result->fetchArray()); die;
        
        // $r = $this->insertUserToken($id, $token = 'ddd');
        // echo '<pre>'; print_r($r); die;

        $statement = $this->db->prepare('SELECT * FROM user_tokens;');
        $statement->bindValue(':id', $id, SQLITE3_TEXT);
        $result = $statement->execute();

        echo '<pre>'; print_r($result->fetchArray()); die;
        if (!($statement instanceof Sqlite3Result)) {
            return null;
        }

        while ($row = $statement->fetchArray()) {
            return $row['token'];
        }
        return null;
    }

    public function saveUserToken($id, $token)
    {
        if ($this->getUserToken($id)) {
            $sql = 'UPDATE user_tokens SET token=:token WHERE user_id=:id;';

            $statement = $this->db->prepare($sql);
            $statement->bindValue(':id', $id, SQLITE3_TEXT);
            $statement->bindValue(':token', $token, SQLITE3_TEXT);
            return $result = $statement->execute();
        } else {
            return $this->insertUserToken($id, $token);
        }
    }

    public function insertUserToken($id, $token)
    {
        $sql = 'INSERT INTO user_tokens (user_id, token) VALUES (:id, :token);';

        $statement = $this->db->prepare($sql);
        $statement->bindValue(':id', $id, SQLITE3_TEXT);
        $statement->bindValue(':token', $token, SQLITE3_TEXT);
        $result = $statement->execute();
        return $result;
    }

    /**
     * Creates tokens table
     *
     * @return void
     */
    public function createUserTokensTable() {
        $query = '
            CREATE TABLE IF NOT EXISTS user_tokens (
                user_id varchar(100),
                token text,
                PRIMARY KEY (`user_id`)
            )';
        $this->db->exec($query) or die('CREATE TABLE failed');
    }
}