<?php

namespace App\Models;

use Wallaby\Base\Model;

class User extends Model
{
    /**
     * findAll
     *
     * @return array
     */
    public function findAll()
    {
        $users = $this->pdo->query("SELECT id, username FROM users");
        return $users->fetchAll();
    }

    /**
     * findByPk
     *
     * @param  int
     * @return array
     */
    public function findByPk($id)
    {
        $users = $this->pdo->prepare("SELECT id, username FROM users WHERE id = :id");

        $users->execute([
            'id' => $id,
        ]);

        return $users->fetch();
    }
}
