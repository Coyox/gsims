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
$app->get('/teachers/:id', 'getTeacherById');
$app->get('/administrators', 'getAdministrators');
$app->get('/administrators/:id', 'getAdministratorById');
$app->get('/search/:usertype', 'findUsersByName');

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
    $bindparams = array(
        "firstName" => $student->firstName,
        "lastName" => $student->lastName,
        "email" => $student->emailAddr,
        "id" => $student->userid,
    );
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
    $sql = "SELECT userid, schoolid, firstName, lastName, emailAddr, status from teacher where usertype='T' order by firstName asc" ;
    echo json_encode(perform_query($sql, 'GETALL'));
}
function getTeacherById($id) {
    $sql = "SELECT userid, schoolid, firstName, lastName, emailAddr, status from teacher where usertype='T' and userid=:id";
    echo json_encode(perform_query($sql,'GET', array("userid"=>$id)));
}
#================================================================================================================#
# Administrators
#================================================================================================================#
function getAdministrators() {
    $sql = "SELECT userid, schoolid, firstName, lastName, emailAddr, status from teacher where usertype='A' order by firstName asc" ;
    echo json_encode(perform_query($sql, 'GETALL'));
}
function getAdministratorById($id) {
    $sql = "SELECT userid, schoolid, firstName, lastName, emailAddr, status from teacher where usertype='A' and userid=:id";
    echo json_encode(perform_query($sql,'GET', array("userid"=>$id)));
}

#================================================================================================================#
# Users
#================================================================================================================#
function getUsers($type){
    if ($type == "T"){
        return getTeachers();
    }
    else if ($type == "S"){
        return getStudents();
    }
    else if ($type == "A"){
        return getAdministrators();
    }
}

function findUsersByFirstName($type, $firstname) {
    $firstname = "%".$firstname."%";
    $bindparam = array("firstname"=>$firstname);
    if ($type=="S") {
        $sql = "SELECT * from student where firstName like :firstname order by firstName asc";
    }
    else if ($type=="A"|$type=="T"){
        $sql = "SELECT * from teacher where usertype=:type and firstName like :firstname order by firstName asc";
        $bindparam["type"]=$type;
    }
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
}

function findUsersByLastName($type, $lastname) {
    $lastname = "%".$lastname."%";
    $bindparam = array("lastname"=>$lastname);
    if ($type=="S") {
        $sql = "SELECT * from student where lastName like :lastname order by lastName asc";
    }
    else if ($type=="A"|$type=="T"){
        $sql = "SELECT * from teacher where usertype=:type and lastName like :lastname order by lastName asc";
        $bindparam["type"]=$type;
    }
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
}

function findUsersByFullName($type, $firstname, $lastname) {
    $firstname = "%".$firstname."%";
    $lastname = "%".$lastname."%";
    $bindparam = array(
        "firstname" => $firstname,
        "lastname" => $lastname
    );
    if ($type=="S") {
        $sql = "SELECT * from student where firstName like :firstname and lastName like :lastname order by firstName asc";
    }
    else if ($type=="A"|$type=="T"){
        $sql = "SELECT * from teacher where usertype=:type and firstName like :firstname and lastName like :lastname order by firstName asc";
        $bindparam["type"]=$type;
    }
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
}


/*
 usertype has to be either 'S', 'A' or 'T' for student, admin and teacher
*/

function findUsersByName($usertype){
    $firstname = $_GET['firstName'];
    $lastname = $_GET['lastName'];

    if (isset($firstname) && isset($lastname)) {
        return findUsersByFullName($usertype,$firstname,$lastname);
    }
    else if (isset($firstname)){
        return findUsersByFirstName($usertype,$firstname);
    }
    else if (isset($lastname)) {
        return findUsersByLastName($usertype,$lastname);
    }
    else {
        return getUsers($usertype);
    }
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