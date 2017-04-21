<?php
    return [
        'baseAction' => 'login',
        'baseController' => 'site',
        'errorHandler' => 'site/error',
        'routes' => '^(?<controller>[a-z-]+)?/?(?<action>[a-z-]+)?/?(?<parameter>[a-z0-9/-]+)?$',
    ];