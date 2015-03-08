<?php
require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/students', 'getStudents');
$app->get('/students/:id', 'getStudentById');
$app->post('/students', 'createStudent');
$app->put('/students/:id', 'updateStudent');
$app->delete('/students/:id', 'deleteStudent');
$app->get('/teachers', 'getTeachers');
$app->get('/teachers/:id', 'getTeachersById');
$app->get('/login', 'validateCredentials');

$app->run();


function validateCredentials() {
    $sql = "select * from login where username=:username and password=:password";
    $bindparam = array("username"=> $_GET['username'], "password"=>$_GET['password']);
    echo json_encode(perform_query($sql, 'GET', $bindparam));
}

#================================================================================================================#
# Students
#================================================================================================================#
/*
 * Returns a list of students
 */
function getStudents() {
    $sql = "select s.userid, s.firstName, s.lastName from student s";
    echo json_encode(perform_query($sql, 'GETALL'));
}

/*
 * Returns a single student record
 */
function getStudentById($id) {
    $sql = "select s.userid, s.firstName, s.lastName, s.emailAddr from student s where s.userid=:id";
    echo json_encode(perform_query($sql,'GET', array("id"=>$id)));
}

/*
 * Updates a student record
 */
function updateStudent($id) {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $student = json_decode($body);
    $sql = "update student set firstName=:firstName, lastName=:lastName, emailAddr=:emailAddr, userid=:id WHERE userid=:id";
    $bindparams = array(
        "firstName"=>$student->firstName,
        "lastName" => $student->lastName,
        "email" => $student->email,
        "id" => $student->userid,
    );
    echo json_encode(perform_query($sql,'',$bindparams));
}

/*
 * Creates a student record
 */
function createStudent() {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $student = json_decode($body);
    $sql = "insert into student (userid, firstName, lastName, emailAddr) values (:id, :firstName, :lastName, :emailAddr)";
    $bindparams = [
        "firstName" => $student->firstName,
        "lastName" => $student->lastName,
        "email" => $student->emailAddr,
        "id" => $student->userid,
    ];
    echo json_encode(perform_query($sql,'POST',$bindparams));
}

/*
 * Updates a student record
 */
function deleteStudent($id) {
    $sql = "delete from student where userid=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("userid", $id);
        $stmt->execute();
        $db = null;
        echo "success";
    } catch(PDOException $e) {
        echo $e->getMessage();
    }
    echo json_encode(perform_query($sql,'', array("userid"=>$id)));
}


#================================================================================================================#
# Teachers
#================================================================================================================#
function getTeachers() {
    $sql = "SELECT * from teacher where usertype='T' order by firstName asc" ;
    echo json_encode(perform_query($sql, 'GETALL'));
}
function getTeacherById($id) {
    $sql = "SELECT * from teacher where usertype='T' and userid=:id";
    echo json_encode(perform_query($sql,'GET', array("userid"=>$id)));
}

#================================================================================================================#
# Helpers
#================================================================================================================#

/*
* wrapper to perform sql queries
*/
function perform_query($sql, $querytype, $bindparams=array()) {
    try {
        $db = getConnection();
        if (array_filter($bindparams)){
            $stmt = $db->prepare($sql);
            $stmt->execute($bindparams);
        }
        else{
            $stmt = $db->query($sql);
        }
        if ($querytype == 'GET') {
            $result = $stmt->fetchObject();
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
        return $result;
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