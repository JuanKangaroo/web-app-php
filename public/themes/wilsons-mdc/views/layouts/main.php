<!DOCTYPE html>
<html class="mdc-typography">
<head>
    <title><?= $this->title ?: htmlspecialchars($this->title)?></title>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-title" content="<?= $this->title ?: htmlspecialchars($this->title)?>">

    <link rel="stylesheet" href="/themes/wilsons-mdc/node_modules/material-components-web/dist/material-components-web.css">
    <link rel="stylesheet" type="text/css" href="/themes/wilsons-mdc/assets/css/app.css">
</head>
<body>
    <script> <?php $config = require ROOT . '/config/app.php'; ?>
        var config = <?php echo json_encode($config) ?>
    </script>

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
    
    <script src="/themes/wilsons-mdc/assets/js/jquery-3.2.1.min.js"></script>
    <script src="/js/axios.min.js"></script>
    <script src="/js/kangaroo-api.js"></script>
    <script src="/themes/wilsons-mdc/assets/js/handlebars-v4.0.5.js"></script>
    <script src="/themes/wilsons-mdc/assets/js/app.js"></script>
    <script src="/themes/wilsons-mdc/node_modules/material-components-web/dist/material-components-web.js"></script>
    <script>mdc.autoInit()</script>
</body>
</html>