<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link rel="canonical" href="http://test.dev/pwa/">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $this->title ?: htmlspecialchars($this->title)?></title>
    <?php //$this->getLayoutStyles()?>
    <script> <?php $config = require ROOT . '/config/app.php'; ?>
        var config = <?php echo json_encode($config) ?>
    </script>
    <link rel="stylesheet" type="text/css" href="/themes/<?= $config['theme'] ?>/assets/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="/themes/<?= $config['theme'] ?>/assets/css/pushy.css">
    <link rel="stylesheet" type="text/css" href="/themes/<?= $config['theme'] ?>/assets/css/app.css?v=<?= $config['version'] ?>">
    <link rel="stylesheet" type="text/css" href="/themes/<?= $config['theme'] ?>/assets/css/font-awesome.min.css">

    <!-- TODO add manifest here -->
    <!-- <link rel="manifest" href="manifest.json"> -->
    <!-- Add to home screen for Safari on iOS -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-title" content="Weather PWA">
    <meta name="msapplication-TileColor" content="#2F3BA2">
</head>

<body data-page-uri=<?= $this->pageUri; ?> class="body-bkg-image">
    <!-- Pushy Menu -->
    <nav class="pushy pushy-left">
        <div class="pushy-content pt-2" id="drawer">
            <img class="rounded-circle mx-auto d-block js-drawer__showUserProfile" id="drawerUserPhoto" style="width: 75px;"
                src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2275%22%20height%3D%2275%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2075%2075%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15c2c765ee0%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15c2c765ee0%22%3E%3Crect%20width%3D%2275%22%20height%3D%2275%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2220%22%20y%3D%2242%22%3E75x75%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E">

            <p class="lead mb-0 text-center js-drawer__showUserProfile" id="drawerUserName"></p>

            <div class="dropdown-divider"></div>

            <!-- <div class="list-group">
                <a href="" class="list-group-item">
                    <i class="fa fa-envelope-o fa-2x fa-fw" aria-hidden="true"></i>
                    <span id="drawerUserEmail"></span>
                </a>
                <a href="" class="list-group-item">
                    <i class="fa fa-mobile fa-2x fa-fw" aria-hidden="true"></i>
                    <span id="drawerUserPhone"></span>
                </a>
            </div> -->

            <ul>
                <li class="pushy-link js-drawer__changePinItem">
                    <a href="#">
                        <i class="fa fa-key fa-fw" aria-hidden="true"></i> Change PIN
                    </a>
                </li>
                <li class="pushy-link js-drawer__userEmailItem" data-status-code="" data-email-value="">
                    <a href="#">
                        <i class="fa fa-envelope-o fa-fw" aria-hidden="true"></i>
                        <span id="drawerUserEmail"></span>
                    </a>
                </li>
                <li class="pushy-link js-drawer__userPhoneItem" data-status-code="" data-phone-value="">
                    <a href="#">
                        <i class="fa fa-mobile fa-fw" aria-hidden="true"></i>
                        <span id="drawerUserPhone"></span>
                    </a>
                </li>
                <li class="pushy-link"><a href="#" id="logout">Log Out</a></li>
            </ul>
        </div>
    </nav>

    <!-- Site Overlay -->
    <div class="site-overlay"></div>

    <div class="message__container--fixed" id="message__container">
        <div class="c-message message__success" style="display: none"></div>
        <div class="c-message message__error" style="display: none"></div>
        <div class="c-message message__info" style="display: none"></div>
    </div>
    
    <div class="main"><!-- id="container" for off canvas menu -->
        <nav class="navbar navbar-toggleable-md fixed-top avbar-inverse bg-inverse pl-0">
            <button class="menu-btn" type="button">
                <i class="fa fa-bars" aria-hidden="true"></i>
            </button> &nbsp;

            <div class="navbar-top w-100"> <!-- collapse navbar-collapse -->
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active" id="menu_home"><a class="nav-link" href="/home">My Memberships</a></li>
                    <li class="nav-item" id="menu_coupons"><a class="nav-link" href="/coupons">Coupons</a></li>
                    <!-- <li class="nav-item" id="menu_rewards"><a class="nav-link" href="/rewards">Rewards</a></li> -->
                </ul>
                <form class="my-3" style="position: absolute; right: 0; top: 0px;">
                    <div class="dropdown">
                        <a class="dropdown-toggle p-3" href="#" id="navbar_user_profile" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fa fa-ellipsis-v" aria-hidden="true" style="font-size: 1.5rem; color: #fff;"></i>
                            <!-- <img src="/themes/wilsons/assets/images/icons/ic_more_vert_white_24px.svg"> -->
                        </a>
                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbar_user_profile">
                            <a class="dropdown-item" href="#" id="menu_transactions_list">Transactions</a>
                            <!-- <a class="dropdown-item" href="#" id="menu_add_accounts">Add Accounts</a> -->
                            <a class="dropdown-item" href="#" id="menu_contact_us">Contact Us</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="#" id="logout">Log Out</a>
                        </div>
                    </div>
                </form>
            </div>
        </nav>
        <!-- <button class="menu-btn">&#9776; Menu</button> -->
        <?= $content?>
    </div>

    <div class="loader">
        <svg viewBox="0 0 32 32" width="32" height="32">
            <circle id="spinner" cx="16" cy="16" r="14" fill="none"></circle>
        </svg>
    </div>

    <div class="modal fade" id="detailViewModal" tabindex="-1" role="dialog" aria-labelledby="detailViewLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg detail-view" role="document">
            <div class="modal-content">
                <div class="modal-header justify-content-start">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span>&leftarrow; </span>
                    </button>
                    <h5 class="modal-title pl-3" id="detailViewLabel"></h5>
                    <button type="button" class="close p-3" data-dismiss="modal" style="position: absolute; right: 10px;">
                        <span>&times; </span>
                    </button>
                </div>
                <div class="modal-body" style="overflow: auto;"></div>
            </div>
        </div>
    </div>

    <?php
        require_once __DIR__ . '/../templates/userProfile.tpl';
        require_once __DIR__ . '/../templates/businesses.tpl';
        require_once __DIR__ . '/../templates/rewards.tpl';
        require_once __DIR__ . '/../templates/coupons.tpl';
        require_once __DIR__ . '/../templates/couponDetail.tpl';
        require_once __DIR__ . '/../templates/businessDetail.tpl';
        require_once __DIR__ . '/../templates/changePin.tpl';
        require_once __DIR__ . '/../templates/addChangeEmail.tpl';
        require_once __DIR__ . '/../templates/addChangePhone.tpl';
    ?>
    
    <link rel="stylesheet" type="text/css" href="/themes/<?= $config['theme'] ?>/assets/css/bootstrap-datetimepicker-4.17.47.min.css">
    <link rel="stylesheet" type="text/css" href="/themes/<?= $config['theme'] ?>/assets/intl-tel-input/build/css/intlTelInput.css">
    <link rel="stylesheet" type="text/css" href="/themes/<?= $config['theme'] ?>/assets/css/perfect-scrollbar.min.css">

    <script src="/themes/<?= $config['theme'] ?>/assets/js/jquery-3.2.1.min.js"></script>
    <script src="/themes/<?= $config['theme'] ?>/assets/js/perfect-scrollbar.min.js"></script>

    <!-- <script src="https://code.jquery.com/jquery-3.1.1.slim.min.js" integrity="sha384-A7FZj7v+d/sdmMqp/nOQwliLvUsJfDHW+k9Omg/a/EheAdgtzNs3hpfag6Ed950n" crossorigin="anonymous"></script> -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
    <script src="/themes/<?= $config['theme'] ?>/assets/js/bootstrap.min.js"></script>
    <script src="/js/axios.min.js"></script>
    <script src="/js/kangaroo-api.js"></script>

    <script src="/themes/<?= $config['theme'] ?>/assets/js/handlebars-v4.0.5.js"></script>
    <script src="/themes/<?= $config['theme'] ?>/assets/js/handlebars-intl.min.js"></script>
    <script src="/themes/<?= $config['theme'] ?>/assets/js/pushy.min.js"></script>
    <script src="/themes/<?= $config['theme'] ?>/assets/js/app.js?v=<?= $config['version'] ?>"></script>
    <script src="/themes/<?= $config['theme'] ?>/assets/js/moment-2.18.1.min.js"></script>
    <script src="/themes/<?= $config['theme'] ?>/assets/js/bootstrap-datetimepicker-4.17.47.min.js"></script>
    <script src="/themes/<?= $config['theme'] ?>/assets/intl-tel-input/build/js/intlTelInput.js"></script>
    <script src="/themes/<?= $config['theme'] ?>/assets/intl-tel-input/lib/libphonenumber/build/utils.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=<?= $config['googlePlacesKey'] ?>" async defer></script>

    <?php //$this->getLayoutScripts()?>
</body>
</html>
