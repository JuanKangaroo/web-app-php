<?php
    return [
        'baseAction' => 'index',
        'baseController' => 'site',
        'errorHandler' => 'site/error',
        // 'routes' => '^(?<controller>[a-z-]+)?/?(?<action>[a-z-]+)?/?(?<parameter>[a-z0-9/-]+)?$',
        'routes' => '^(?<controller>[a-z-]+)?/?(?<action>[a-z-]+)?/?(?<parameter>[a-z0-9/-]+)?/?(?<query>\?[a-z+&\$_.-][a-z0-9;:@&%=+\/\$_.-]*)?$',
    ];