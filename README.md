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