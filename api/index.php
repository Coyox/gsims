<?php
require 'Slim/Slim.php';
require_once 'crossdomain.php';
require_once 'routes/user.php';
require_once 'routes/school.php';
require_once 'routes/function.php';


\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$school = new School($app);
$user = new User($app);
$function = new Functionality($app);

$school->createRoutes();
$user->createRoutes();
$function->createRoutes();

$app->run();

