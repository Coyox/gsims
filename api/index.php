<?php
require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/students', 'getStudents');
$app->get('/students/:id', 'getStudentById');
$app->post('/students', 'createStudent');
$app->put('/students/:id', 'updateStudent');
$app->delete('/students/:id', 'deleteStudent');

$app->get('/login', 'validateCredentials');

$app->run();

function validateCredentials() {
    echo "success";
}

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
        echo $e->getMessage();
    }
}

/* 
 * Returns a single student record
 */
function getStudentById($id) {
    $sql = "select s.id, s.firstName, s.lastName, s.emailAddr from student s where s.id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $student = $stmt->fetchObject();
        $db = null;
        echo json_encode($student);
    } catch(PDOException $e) {
        echo $e->getMessage();
    }
}

/* 
 * Updates a student record
 */
function updateStudent($id) {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $student = json_decode($body);
    $sql = "update student set firstName=:firstName, lastName=:lastName, emailAddr=:emailAddr, id=:id WHERE id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);  
        $stmt->bindParam("firstName", $student->firstName);
        $stmt->bindParam("lastName", $student->lastName);
        $stmt->bindParam("emailAddr", $student->emailAddr);
        $stmt->bindParam("id", $student->id);
        $stmt->execute();
        $db = null;
        echo json_encode($student); 
    } catch(PDOException $e) {
        echo $e->getMessage();
    }
}

/* 
 * Creates a student record
 */
function createStudent() {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $student = json_decode($body);
    $sql = "insert into student (id, firstName, lastName, emailAddr) values (:id, :firstName, :lastName, :emailAddr)";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);  
        $stmt->bindParam("firstName", $student->firstName);
        $stmt->bindParam("lastName", $student->lastName);
        $stmt->bindParam("emailAddr", $student->emailAddr);
        $stmt->bindParam("id", $student->id);
        $stmt->execute();
        $db = null;
        echo json_encode($student); 
    } catch(PDOException $e) {
        echo $e->getMessage();
    }
}

/* 
 * Updates a student record
 */
function deleteStudent($id) {
    $sql = "delete from student where id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);  
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $db = null;
        echo "success";
    } catch(PDOException $e) {
        echo $e->getMessage(); 
    }
}

/* 
 * TODO: put the credentials in a separate config file
 */
function getConnection() {
    $dbhost = "127.4.196.130";
    $dbuser = "adminpVaqD1a";
    $dbpass = "GpFqpeavU2dT";
    $dbname = "testdb";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);  
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}