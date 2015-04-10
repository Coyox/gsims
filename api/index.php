<?php
require 'Slim/Slim.php';
require_once 'crossdomain.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

require_once 'routes/user.php';
require_once 'routes/school.php';
require_once 'routes/function.php';

$app->run();

