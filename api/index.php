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
    $sql = "select * from login where username=:username and password=:password";
    // try {
    //     $db = getConnection();
    //     $stmt = $db->prepare($sql);
    //     $stmt->bindParam("username", $_GET['username']);
    //     $stmt->bindParam("password", $_GET['password']);
    //     $stmt->execute();
    //     $user = $stmt->fetchObject();
    //     $db = null;
    //     echo json_encode($user);
    // } catch(PDOException $e) {
    //     echo $e->getMessage();
    // }
    $bindparam = array("username"=> $_GET['username'], "password"=>$_GET['password']);
    echo (perform_query($sql, 'GET', $bindparam));

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
* wrapper to perform sql queries
*/
function perform_query($sql, $querytype, $bindparams=array()) {
    try {
        $db = getConnection();
        if (array_filter($bindparams)){
            $stmt = $db->prepare($sql);
            foreach ($bindparams as $key=>$value) {
                $stmt->bindParam($key, $value);
            }
            $stmt->execute();
        }
        else{
            $stmt = $db->query($sql);
        }
        if ($querytype == 'GET') {
            echo 'GET HERE';
            $result = $stmt->fetchObject();
            echo json_encode($result);
        }
        elseif ($querytype == 'GETALL') {
            $result = $stmt->fetchAll(PDO::FETCH_OBJ);
        }
        elseif ($querytype == 'POST'){
            $result = $db->lastInsertId();
        }
        else {
            $result = null;
        }
        $db = null;
        echo "success";
        return json_encode($result);
    } catch(PDOException $e) {
        echo $e->getMessage();
    }
}


/*
 * TODO: put the credentials in a separate config file
 */
function getConnection() {
    $dbhost = "127.4.196.130";
    $dbname = "testdb";
    $dbuser = "adminpVaqD1a";
    $dbpass = "GpFqpeavU2dT";
    $dbname = "gobind";
    //$dbname = "testdb";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}