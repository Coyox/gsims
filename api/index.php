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

$app->get('/administrators', 'getAdministrators');
$app->get('/administrators/:id', 'getAdministratorsById');

$app->get('/schools', 'getSchools');
$app->get('/schools/:id', 'getschoolById');
$app->get('/departments', 'getDepartments');
$app->get('/departments/:id', 'getDepartmentById');
$app->get('/courses', 'getCourses');
$app->get('/courses/:id', 'getCourseById');
$app->get('/courses/:id/teachers', 'getCourseTeachers');
$app->get('/sections', 'getSections');
$app->get('/sections/:id/enrolled', 'getStudentsEnrolled');
$app->get('/sections/:id/teachers', 'getSectionTeachers');

$app->get('/search/:usertype', 'findUsersByName');
$app->get('/search/student', 'findStudents');
$app->get('/seasrch/sections', 'findSections');

$app->post('/login', 'validateCredentials');

$app->run();


function validateCredentials() {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $credentials = json_decode($body);
    $sql = "select * from login where username=:username and password=:password";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("username", $credentials->username);
        $stmt->bindParam("password", $credentials->password);
        $stmt->execute();
        $user = $stmt->fetchObject();
        $db = null;
        echo json_encode($user);
    } catch(PDOException $e) {
        echo $e->getMessage();
    }
}

#================================================================================================================#
# Schools, Departments, Courses, Sections
#================================================================================================================#
function getSchools() {
    $sql = "SELECT schoolid, location, postalCode, yearOpened, status from school order by location asc" ;
    echo json_encode(perform_query($sql, 'GETALL'));
}

function getSchoolById($id) {
    $sql = "SELECT location, postalCode, yearOpened, status from school where schoolid=:id";
    $bindparam = ["id"=>$id];
    echo json_encode(perform_query($sql,'GET',$bindparam));
}

function getDepartments($schoolid)
    $schoolyear = $_GET['schoolyearid'];
    $sql = "SELECT deptid, deptName, status from department where schoolid=:schoolid and schoolyearid=:schoolyear order by deptName asc";
    $bindparam = ["schoolid"=>$schoolid,"schoolyear"=>$schoolyear];
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
}
function getDepartmentById($id) {
    $sql = "SELECT deptName, schoolyearid, status from department where deptid=:id";
    $bindparam = ["id"=>$id];
    echo json_encode(perform_query($sql,'GET',$bindparam));
}

function getCourses($deptid){
    $schoolyear = $_GET['schoolyearid'];
    $sql = "SELECT courseid, courseName, description, prereqs, status from course where deptid=:deptid and schoolyearid=:schoolyear order by deptName asc";
    $bindparam = ["deptid"=>$deptid,"schoolyear"=>$schoolyear];
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
}

function getCourseById($id){
    $sql = "SELECT courseName, schoolyearid, description, prereqs, status from course where courseid=:id";
    $bindparam = ["id"=>$id];
    echo json_encode(perform_query($sql,'GET',$bindparam));
}


function getSections(){
    $schoolyear = $_GET['schoolyearid'];
    if (!isset($schoolyear)) {
        echo "find queries require schoolyear";
        return;
    }

    $courseid = $_GET['courseid'];
    $schoolid = $_GET['schoolid'];
    if (isset($schoolid)) {
        return getSectionsBySchool($schoolyear, $schoolid);
    }
    if (isset($courseid)) {
        return getSectionsByCourse($schoolyear, $courseid);
    }
}

function getSectionsBySchool($schoolyear, $schoolid){
    $sql = "SELECT s.sectionid, s.courseid, s.sectionCode, s.teacherid, s.day, s.time, s.roomCapacity, s.roomLocation, s.classSize, s.status
            from section s,
            (select courseid from course c1,
                (select deptid from department where schoolid=:schoolid and schoolyearid=:schoolyear) d
                where d.deptid = c1.deptid and c1.schoolyearid=:schoolyear) c
            where s.courseid = c.courseid and s.schoolyearid=:schoolyear orderby s.sectionCode asc";

    $bindparam = ["schoolid"=>$schoolid,"schoolyear"=>$schoolyear];
    echo json_encode(perform_query($sql,'GETALL',$bindparam))
}

function getSectionsByCourse($schoolyear, $courseid){
    $sql = " SELECT s.sectionid, s.sectionCode, s.day, s.time, s.roomCapacity, s.roomLocation, s.classSize, s.status
     from section s where s.schoolyearid =:schoolyear and s.courseid=:courseid
     order by s.sectionCode asc";

    $bindparam = ["courseid"=>$courseid,"schoolyear"=>$schoolyear];
    echo json_encode(perform_query($sql,'GETALL',$bindparam))
}

/* Get number of students enrolled for a section */
function getStudentsEnrolled(){
    $sectionid =  $_GET['id'];
    $sql = "SELECT *
            FROM (SELECT count(userid) from enrollment group by sectionid) s
            where s.sectionid = :sectionid";
    $bindparam=["sectionid"=>$sectionid];
    echo json_encode(perform_query($sql, 'GET', $bindparam));
}


function getSectionTeachers(){
    $sectionid =  $_GET['id'];
    $sql = "SELECT t1.userid, t1.firstName, t1.lastName, t1.emailAddr, t1.status, t1.usertype
            FROM teacher t1 and teaching t2
            where t2.sectionid = :sectionid
            and s.teacherid = t.userid";
    $bindparam=["sectionid"=>$sectionid];
    echo json_encode(perform_query($sql, 'GETALL', $bindparam));
}

function getCourseTeachers(){
    $courseid =  $_GET['id'];
    $sql = "SELECT t1.userid, t1.firstName, t1.lastName, t1.emailAddr, t1.status, t1.usertype
            FROM teacher t1 and teaching t2
            where t2.courseid = :courseid
            and s.teacherid = t.userid";
    $bindparam=["courseid"=>$courseid];
    echo json_encode(perform_query($sql, 'GETALL', $bindparam));
}


/* TODO: find by times*/
function findSections(){
    $schoolyear = $_GET['schoolyearid'];
    $schoolid = $_GET['schoolid'];
    if (!(isset($schoolyear) || (isset($schoolid)))) {
        echo "find queries require both schoolyear and schoolid";
        return;
    }
    $deptname = $_GET['deptName'];
    $coursename = $_GET['courseName'];
    $days = $_GET['days'];
    //$times = $_GET['times'];

    if (isset($deptname) && isset($coursename)){
        return findSectionsByDeptCourseDay($schoolyear, $schoolid, $deptname, $coursename, $days);
    }
    if (isset($deptname)) {
        return findSectionsByDept($schoolyear, $schoolid, $deptname, $days);
    }
    if (isset($coursename)) {
        return findSectionsByCourse($schoolyear, $schoolid, $coursename, $days);
    }
    if (isset($days)){
        return findSectionsByDay($schoolyear, $schoolid, $days);
    }
    return getSectionsBySchool($schoolyear, $schoolid);
}


function findSectionsByDeptCourseDay($schoolyear, $schoolid, $deptname, $coursename, $days=null){
    $deptname = "%".$deptname."%";
    $coursename = "%".$coursename."%";

    $sql = "SELECT s.sectionid, s.courseid, s.sectionCode, s.teacherid, s.day, s.time, s.roomCapacity, s.roomLocation, s.classSize, s.status
            from section s,
            (SELECT c.courseid from course c,
                (SELECT deptid from department where deptName like :deptname and schoolyearid=:schoolyear and schoolid=:schoolid
                    ) d
                where c.coursName like :coursename and c.deptid = d.deptid and c.schoolyearid=:schoolyear
                ) temp
            where s.courseid = temp.courseid
            and s.schoolyearid=:schoolyear";
    $bindparam = ["schoolyear"->$schoolyear, "schoolid"=>$schoolid, "deptname"=>$deptname, "coursename"=>$coursename];
    if (isset($days)){
        $days = constructDayClause($days);
        $sql.= " and :days"
        $bindparam["days"=>$days];
    }
    $sql.= " order by s.sectionCode asc";
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
}

function findSectionsByDept($schoolyear, $schoolid, $deptname, $days=null){
    $deptname = "%".$deptname."%";
    $sql = "SELECT s.sectionid, s.courseid, s.sectionCode, s.teacherid, s.day, s.time, s.roomCapacity, s.roomLocation, s.classSize, s.status
            from section s,
            (SELECT c.courseid from course c,
                (SELECT deptid from department where deptName like :deptname and schoolyearid=:schoolyear and schoolid=:schoolid
                    ) d
                where c.deptid = d.deptid and c.schoolyearid=:schoolyear
                ) temp
            where s.courseid = temp.courseid
            and s.schoolyearid=:schoolyear
            order by s.sectionCode asc";
    $bindparam = ["schoolyear"->$schoolyear, "schoolid"=>$schoolid, "deptname"=>$deptname];
    if (isset($days)){
        $days = constructDayClause($days);
        $sql.= " and :days"
        $bindparam["days"=>$days];
    }
    $sql.= " order by s.sectionCode asc";
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
}

function findSectionsByCourse($schoolyear, $schoolid, $coursename, $days=null){
    $coursename = "%".$coursename."%";
    $days = constructDayClause($days);

    $sql = "SELECT s.sectionid, s.courseid, s.sectionCode, s.teacherid, s.day, s.time, s.roomCapacity, s.roomLocation, s.classSize, s.status
            from section s,
            (SELECT c.courseid from course c, department d
                where c.courseName like :coursename
                and c.schoolyearid=:schoolyear
                and c.deptid = d.deptid
                and d.schoolid = :schoolid
            ) temp
            where s.schoolyearid=:schoolyear and s.courseid = temp.courseid";
    $bindparam = ["schoolyear"=>$schoolyear, "schoolid"=>$schoolid, "coursename"=>$coursename, "days"=>$days];
    if (isset($days)){
        $days = constructDayClause($days);
        $sql.= " and :days"
        $bindparam["days"=>$days];
    }
    $sql.= " order by s.sectionCode asc";
    echo json_encode(perform_query($sql,'GETALL',$bindparam))
}


function findSectionsByDay($schoolyear, $schoolid, $days){
    $days = constructDayClause($days);

    $sql = "SELECT s.sectionid, s.courseid, s.sectionCode, s.teacherid, s.day, s.time, s.roomCapacity, s.roomLocation, s.classSize, s.status
            from section s,
            (select courseid from course c1,
                (select deptid from department where schoolid=:schoolid and schoolyearid=:schoolyear) d
                where d.deptid = c1.deptid and c1.schoolyearid=:schoolyear) c
            where s.courseid = c.courseid and s.schoolyearid=:schoolyear and :days orderby s.sectionCode asc";

    $bindparam = ["schoolyear"=>$schoolyear, "schoolid"=>$schoolid, "days"=>$days];
    echo json_encode(perform_query($sql,'GETALL',$bindparam))
}

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

/*
TODO
different type of
    $missingassignments = $_GET['missingAssignments']; //missing an x number of assignments
    $failingclasses = $_GET['failingClasses'] //failing x number of classes
    $avgGradeLo = $_GET['avgGradeLo']; //whose average is between X and Y and
    $avgGradeLo = $_GET['avgGradeHigh'];
    $paidStatus = $_GET['paidStatus']; //who have paid or not paid.
    //take json from one query? and combine it?
*/
// function findStudentsWithMissingAssignments($number){
//     $sql =
//     "SELECT * from student s,
//     (select userid from
//         (select userid, sectionid, coalesce(numberOfAssignmentsDone,0) from
//              (select userid, sectionid from enrollment order by userid)
//              left outer join
//              (select userid, sectionid, count(sectionid) as numberOfAssignmentsDone
//              from marks m and documentd
//              where m.assignmentid = d.assignmentid group by sectionid)
//              on userid = userid and sectionid = section id) tableA,

//             (select sectionid, count(docid) as numberOfAssignments
//             from document
//             where fullmark is not null
//             group by sectionid) tableB

//         where tableA.sectionid = tableB.sectionid and (numberOfAssignments-numberOfAssignmentsDone) >= :number) temp
//     where s.userid = temp.userid)";

//     $bindparam = ["number"=>$number];
//     echo json_encode(perform_query($sql,'GETALL',$bindparam));
// }


/* General find */
function findStudents(){

    $firstname = $_GET['firstName'];
    $lastname = $_GET['lastName'];
    $day = $_GET['day'];
    $month = $_GET['month'];
    $year = $_GET['year'];
    $gender = $_GET['gender'];
    $paid = $_GET['paid'];

    $bindparam = array();
    $clause = '';
    if (!(isset($firstname)||isset($lastname))){
        echo 'must provide either first ane last name';
        return;
    }
    if (isset($firstname)) {
        $clause.="firstName like \"%".$firstname."%\"";
        if (isset($lastname)){
            $clause.="and lastName like \"%".$lastname."%\"";
        }
    }
    if (isset($lastname)){
        $clause.="lastName like \"%".$lastname."%\"";
    }
    if (isset($day)){
        $clause.=" and day(dateOfBirth)=".$day;
    }
    if (isset($month)){
        $clause.=" and month(dateOfBirth)=".$month;
    }
    if (isset($year)){
        $clause.=" and year(dateOfBirth)=".$year;
    }
    if (isset($gender)){
        $clause.=" and gender=".$gender;;
    }
     if (isset($paid)){
        $clause.=" and paid=".$paid;
    }

    $sql = "SELECT * from student where :clause and order by firstName asc";
    $bindparam = ["clause"=>$clause]
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
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
    $bindparam = ["id"=>$id];
    echo json_encode(perform_query($sql,'GET',$bindparam));
}
#================================================================================================================#
# Administrators
#================================================================================================================#
function getAdministrators() {
    $sql = "SELECT * from teacher where usertype='A' order by firstName asc" ;
    echo json_encode(perform_query($sql, 'GETALL'));
}

function getAdministratorById($id) {
    $sql = "SELECT * from teacher where usertype='A' where userid=:id";
    $bindparam = ["id"=>$id];
    echo json_encode(perform_query($sql,'GET',$bindparam));
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
    $query = "%".$query."%";
    $bindparam = ["query"=>$query];
    if ($type=="S") {
        $sql = "SELECT * from student where firstName like :query order by firstName asc";
    }
    else if ($type=="A"|$type=="T"){
        $sql = "SELECT * from teacher where usertype=:type and firstName like :query order by firstName asc";
        $bindparam["type"]=>$type;
    }
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
}

function findUsersByLastName($type, $query) {
    $query = "%".$query."%";
    $bindparam = ["query"=>$query];
    if ($type=="S") {
        $sql = "SELECT * from student where lastName like :query order by lastName asc";

    }
    else if ($type=="A"|$type=="T"){
        $sql = "SELECT * from teacher where usertype=:type and lastName like :query order by lastName asc";
        $bindparam["type"]=>$type;
    }
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
}

function findUsersByFullName($type, $query1, $query2) {
    $query1 = "%".$query1."%";
    $query2 = "%".$query2."%";
    $bindparam = [
        "query1" => $query1,
        "query2" => $query2,
    ];
    if ($type=="S") {
        $sql = "SELECT * from student where firstName like :query1 and lastName like :query2 order by firstName asc";
    }
    else if ($type=="A"|$type=="T"){
        $sql = "SELECT * from teacher where usertype=:type and firstName like :query1 and lastName like :query2 order by firstName asc";
        $bindparam["type"]=>$type;
    }
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

function constructDayClause($days){
    $clause= " FIELD(`day`, \"";
    $days = explode(',', $days);
    foreach($days as $day) {
        $clause.= $day.",";
    }
    $clause = rtrim($clause, ",");
    $clause.= "\")";

    return $clause;
}

//TODO wrapper to check mandatory GET variables
