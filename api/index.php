<?php
require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/students', 'getStudents');
$app->get('/students/:id', 'getStudentById');
$app->put('/students/:id', 'updateStudent');

$app->run();

/* 
 * Returns a list of students
 */
function getStudents() {
    $sql = "select s.id, s.firstName, s.lastName from student s";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $students = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($students);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

/* 
 * Returns a single student record
 */
function getStudentById($id) {
    $sql = "select s.id, s.firstName, s.lastName, s.email from student s where s.id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $student = $stmt->fetchObject();
        $db = null;
        echo json_encode($student);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

/* 
 * Updates a student record
 */
function updateStudent($id) {
    $request = Slim::getInstance()->request();
    echo $request;
    // $body = $request->getBody();
    // $student = json_decode($body);
    // $sql = "update student set firstName=:firstName, lastName=:lastName, email=:email, id=:id WHERE id=:id";
    // try {
    //     $db = getConnection();
    //     $stmt = $db->prepare($sql);  
    //     $stmt->bindParam("firstName", $student->firstName);
    //     $stmt->bindParam("lastName", $student->lastName);
    //     $stmt->bindParam("email", $student->email);
    //     $stmt->bindParam("id", $student->id);
    //     $stmt->execute();
    //     $db = null;
    //     echo json_encode($student); 
    // } catch(PDOException $e) {
    //     echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    // }
}

/* 
 * TODO: put the credentials in a separate config file
 */
function getConnection() {
    $dbhost = "127.4.196.130";
    $dbuser = "adminpVaqD1a";
    $dbpass = "GpFqpeavU2dT";
    $dbname = "gobind";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);  
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}