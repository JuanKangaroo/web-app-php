<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link rel="canonical" href="http://test.dev/pwa/">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $this->title ?: htmlspecialchars($this->title)?></title>
    <?php //$this->getLayoutStyles()?>
    <link rel="stylesheet" type="text/css" href="/themes/wilsons/assets/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="/themes/wilsons/assets/css/app.css">
    <!-- TODO add manifest here -->
    <!-- <link rel="manifest" href="manifest.json"> -->
    <!-- Add to home screen for Safari on iOS -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-title" content="<?= $this->title ?: htmlspecialchars($this->title)?>">
    <meta name="msapplication-TileColor" content="#2F3BA2">
</head>

<body data-page-uri=<?= $this->pageUri; ?> >
    <script> <?php $config = require ROOT . '/config/app.php'; ?>
        var config = <?php echo json_encode($config) ?>
    </script>

    <nav class="navbar navbar-toggleable-md fixed-top navbar-light bg-faded">
        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <a class="navbar-brand" href="/">
            <img src="<?php echo $config['logoPath'] ?>" height="40" class="d-inline-block align-top" alt="">
            <?php //echo config('appName'); ?>
        </a>

        <div class="collapse navbar-collapse" id="navbarDefault">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item active">
                    <a class="nav-link" href="#">Locations</a>
                </li>
                <li class="nav-item active">
                    <a class="nav-link" href="#">Contact Us</a>
                </li>
            </ul>
            <form class="form-inline my-2 my-lg-0">
                <a href="/site/login" class="btn btn-outline-primary"> Log In</a>
                &nbsp; 
                <a href="/site/register" class="btn btn-primary"> Register</a>
            </form>
        </div>
    </nav>
    
    <!-- <header class="header">
        <h1 class="header__title">
            <a href="/"><?php //echo config('appName'); ?></a>
        </h1>
    </header> -->

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

    <script src="/themes/wilsons/assets/js/jquery-3.2.1.min.js"></script>
    <!-- <script src="https://code.jquery.com/jquery-3.1.1.slim.min.js" integrity="sha384-A7FZj7v+d/sdmMqp/nOQwliLvUsJfDHW+k9Omg/a/EheAdgtzNs3hpfag6Ed950n" crossorigin="anonymous"></script> -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
    <script src="/themes/wilsons/assets/js/bootstrap.min.js"></script>
    <script src="/js/axios.min.js"></script>
    <script src="/js/kangaroo-api.js"></script>
    <script src="/themes/wilsons/assets/js/app.js?v=<?= $config['version'] ?>"></script>

    <?php //$this->getLayoutScripts()?>
</body>
</html>
