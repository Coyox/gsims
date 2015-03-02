<?php
require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/students', 'getStudents');
$app->get('/teachers', 'getTeachers');
$app->get('/students/:id', 'getStudentById');
$app->post('/students', 'createStudent');
$app->put('/students/:id', 'updateStudent');
$app->delete('/students/:id', 'deleteStudent');

$app->run();


/* 
 * Returns a list of students
 */
function getStudents() {
    $sql = "select s.id, s.firstName, s.lastName from student s";
    echo json_encode(perform_query($sql, 'GETALL'));
}

/* 
 * Returns a list of students
 */
function getTeachers() {
    $sql = "select t.id, t.firstName, t.lastName from teacher t";
    echo json_encode(perform_query($sql, 'GETALL'));
}
/* 
 * Returns a single student record
 */
function getStudentById($id) {
    $sql = "select s.id, s.firstName, s.lastName, s.email from student s where s.id=:id";
    $bindparam = ["id"=>$id];
    echo json_encode(perform_query($sql,'GET',$bindparam)
}

/* 
 * Updates a student record
 */
function updateStudent($id) {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $student = json_decode($body);
    $sql = "update student set firstName=:firstName, lastName=:lastName, email=:email, id=:id WHERE id=:id";
    $bindparams = [
        "firstName"=>$student->firstName,
        "lastName", $student->lastName,
        "email", $student->email,
        "id", $student->id,
    ];
    perform_query($sql,'',$bindparams);
}

/* 
 * Creates a student record
 */
function createStudent() {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $student = json_decode($body);
    $sql = "insert into student (id, firstName, lastName, email) values (:id, :firstName, :lastName, :email)";
    $bindparams = [
        "firstName"=>$student->firstName,
        "lastName", $student->lastName,
        "email", $student->email,
        "id", $student->id,
    ];
    perform_query($sql,'',$bindparams);
}

/* 
 * Updates a student record
 */
function deleteStudent($id) {
    $sql = "delete from student where id=:id";
    $bindparam = ["id"=>$id];
    perform_query($sql,'',$bindparam)
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
        else {
            $result = null;
        }
        $db = null;
        echo "success";

    } catch(PDOException $e) {
        echo $e->getMessage();
    }
    return $result;
}