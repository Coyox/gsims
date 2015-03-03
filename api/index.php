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

$app->get('/search/:usertype', 'findUsersByName');
$app->get('/search/student', 'findStudents');

$app->run();


#================================================================================================================#
# Students
#================================================================================================================#
function getStudents() {
    $sql = "SELECT * from student order by firstName asc ";
    echo json_encode(perform_query($sql, 'GETALL'));
}

function getStudentById($id) {
    $sql = "SELECT * from student where userid=:id";
    $bindparam = ["id"=>$id];
    echo json_encode(perform_query($sql,'GET',$bindparam));
}

function updateStudent($id) {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $student = json_decode($body);
    $sql = "UPDATE student set firstName=:firstName, lastName=:lastName, email=:email, id=:id WHERE id=:id";
    $bindparams = [
        "firstName"=>$student->firstName,
        "lastName" => $student->lastName,
        "email" => $student->email,
        "id" => $student->id,
    ];
    perform_query($sql,'',$bindparams);
}

function createStudent() {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $student = json_decode($body);
    $sql = "INSERT into student (userid, firstName, lastName, emailAddr) values (:userid, :firstName, :lastName, :emailAddr)";
    $bindparams = [
        "firstName" => $student->firstName,
        "lastName" => $student->lastName,
        "email" => $student->emailAddr,
        "userid" => $student->userid,
    ];
    echo json_encode(perform_query($sql,'POST',$bindparams));
}
 
function deleteStudent($id) {
    $sql = "DELETE from student where id=:id";
    $bindparam = ["id"=>$id];
    perform_query($sql,'',$bindparam);
}


function findStudents(){
    $firstname = $_GET['firstName'];
    $lastname = $_GET['lastName'];
    $dob = $_GET['dateOfBirth'];
    $gender = $_GET['gender'];

    $bindparam = array();
    $clause = '';
    if (!(isset($firstname)||isset($lastname))){
        echo 'must provide either first ane last name';
    }
    if (isset($firstname)) {
        $clause."firstName like :firstname";
        $firstname = "%".$firstname."%";
        $bindparam["firstname"] = $firstname;
        if (isset($lastname)){
            $clause."and lastName like :lastname";
            $lastname = "%".$lastname."%";
            $bindparam["lastName"] = $lastname;
        }
    }
    
    if (isset($lastname)){
        $clause."lastName like :lastname";
        $lastname = "%".$lastname."%";
        $bindparam["lastName"] = $lastname;
    }


    if (isset($dob)){
        $clause." and dateOfBirth=:dob";
        $bindparam["dob"] = $dob;
    }
    if (isset($gender)){
        $clause." and gender=:gender";
        $bindparam["gender"] = $gender;
    }

    $sql = "SELECT * from student where $clause and order by firstName asc";
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
}


#================================================================================================================#
# Teachers
#================================================================================================================#
function getTeachers() {
    $sql = "SELECT * from teacher order by firstName asc" ;
    echo json_encode(perform_query($sql, 'GETALL'));
}

function getTeacherById($id) {
    $sql = "SELECT * from teacher where userid=:id";
    $bindparam = ["id"=>$id];
    echo json_encode(perform_query($sql,'GET',$bindparam));
}

#================================================================================================================#
# General find
#================================================================================================================#
function getUsers($type){
    if ($type == "teacher"){
        return getTeachers();
    }
    else if ($type == "student"){
        return getStudents();
    }
    #TODO
}

function findUsersByName($usertype){
    if (isset($_GET['firstName']) && isset($_GET['lastName'])) {
        return findUsersByFullName($_GET['userType'],$_GET['firstName'], $_GET['lastName']);
    }
    else if (isset($_GET['firstName'])){
        return findUsersByFirstName($_GET['userType'],$_GET['firstName']);
    }  
    else if (isset($_GET['lastName'])) {
        return findUsers($_GET['userType'],$_GET['lastName']);
    }
    else {
        return getUsers($_GET['userType']);
    } 
}

function findUsersByFirstName($type, $query) {
    $sql = "SELECT * from $type where firstName like :query order by firstName asc";
    $query = "%".$query."%";
    $bindparam = ["query"=>$query];
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
}


function findUsersByLastName($type, $query) {
    $sql = "SELECT * from $type where lastName like :query ORDER BY lastName asc";
    $query = "%".$query."%";
    $bindparam = ["query"=>$query];
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
}


function findUsersByFullName($type, $query1, $query2) {
    $sql = "SELECT * from $type where firstName like :query1 and lastName like :query2 order by firstName asc";
    $query1 = "%".$query1."%";
    $query2 = "%".$query2."%";
    $bindparam = [
        "query1" => $query1,
        "query2" => $query2,
        ];
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
}


#================================================================================================================#
# Helpers
#================================================================================================================#
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

/*
* wrapper to perform sql queries
*/
function perform_query($sql, $querytype, $bindparams=array()) {
    try {
        $db = getConnection();
        $stmt = $db->query($sql);

        if (array_filter($bindparams)){
            foreach ($bindparams as $key=>$value) {
                $stmt->bindParam($key, $value);
            }
            $stmt->execute();
        }
        if ($querytype == 'GET') {
            $result = $stmt->$fetchObject();
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
        return $result;

    } catch(PDOException $e) {
        echo $e->getMessage();
    }
}