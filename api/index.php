<?php
require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/students', 'getStudents');

$app->run();

function getStudents() {
    echo "hellO";
    // $sql = "SELECT * FROM STUDENT";

    // try {
    //     $db = getConnection();
    //     $stmt = $db->query($sql);
    //     $students = $stmt->fetchAll(PDO::FETCH_OBJ);
    //     $db = null;
    //     echo json_encode($students);
    // } catch(PDOException $e) {
    //     echo '{"error":{"text":'. $e->getMessage() .'}}';
    // }
}

/* 
 * TODO: put the credentials in a separate config file
 */
function getConnection() {
    $dbhost = "127.8.166.2";
    $dbuser = "adminlPXC8Ak";
    $dbpass = "VjipbM648C6c";
    $dbname = "gobind";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);  
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}