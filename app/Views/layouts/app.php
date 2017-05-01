<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link rel="canonical" href="http://test.dev/pwa/">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $this->title ?: htmlspecialchars($this->title)?></title>
    <?php //$this->getLayoutStyles()?>
    <link rel="stylesheet" type="text/css" href="/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="/css/app.css">
    <!-- TODO add manifest here -->
    <!-- <link rel="manifest" href="manifest.json"> -->
    <!-- Add to home screen for Safari on iOS -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-title" content="Weather PWA">
    <link rel="apple-touch-icon" href="/images/icons/icon-152x152.png">
    <meta name="msapplication-TileImage" content="/images/icons/icon-144x144.png">
    <meta name="msapplication-TileColor" content="#2F3BA2">
</head>

<body>
    <script> <?php $config = require ROOT . '/config/app.php'; ?>
        var config = <?php echo json_encode($config) ?>
    </script>

    <nav class="navbar navbar-toggleable-md fixed-top navbar-light bg-faded">
        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <a class="navbar-brand" href="/">
            <img src="<?php echo $config['logoPath'] ?>" width="30" height="30" class="d-inline-block align-top" alt="">
            <?php echo $config['appName']; ?>
        </a>

        <div class="collapse navbar-collapse" id="navbarsExampleDefault">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item active">
                    <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                </li>
            </ul>
            <form class="form-inline my-2 my-lg-0">
                <div class=" dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbar_user_profile" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Profile
                    </a>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbar_user_profile">
                        <a class="dropdown-item" href="#">Action</a>
                        <a class="dropdown-item" href="#">Another action</a>
                        <a class="dropdown-item" href="#" id="logout">Log Out</a>
                    </div>
                </div>
            </form>
        </div>
    </nav>

    <div class="message__container--fixed" id="message__container">
        <div class="c-message message__success" style="display: none"></div>
        <div class="c-message message__error" style="display: none"></div>
        <div class="c-message message__info" style="display: none"></div>
    </div>
    
    <div id="app" class="main">
        <?= $content?>
    </div>

    <div class="loader">
        <svg viewBox="0 0 32 32" width="32" height="32">
            <circle id="spinner" cx="16" cy="16" r="14" fill="none"></circle>
        </svg>
    </div>

    <?php require_once '/../templates/userProfile.tpl' ?>
    
    <script src="/js/jquery-3.2.1.min.js"></script>
    <script src="/js/axios.min.js"></script>
    <script src="/js/handlebars-v4.0.5.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
    <script src="/js/bootstrap.min.js"></script>
    <script src="/js/app.js"></script>
    <?php //$this->getLayoutScripts()?>
</body>
</html>
