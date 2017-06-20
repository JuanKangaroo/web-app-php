# Web App

A web app using Kangaroo Rewards API

## Install

- Clone:  `git clone https://github.com/kangaroorewards/web-app-php.git folder/`
- Create new virtual server
- the `storage` folder must have write permisions for webserver user
- `cd folder` and run `composer install`
- Rename `app.example` to `app.php` in config folder and make changes to fit the needs for your environment

Optional for server side authentication add to composer.json

```
"kangaroorewards/oauth2-kangaroo-rewards": "~1.0",
"guzzlehttp/guzzle": "^6.0",
"fpdo/fluentpdo": "1.1.*"
```

### Nginx virtual server

```
server {
    listen 80;

    server_name  example.com;

    root   /var/www/example.com/public;

    location / {
        try_files $uri $uri/ /index.php$is_args$args;
    }

    location ~ \.php$ {
        try_files $uri /index.php =404;
        fastcgi_pass unix:/var/run/php5-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # prevent nginx from serving dotfiles (.htaccess, .svn, .git, etc.)
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```