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

$app->get('/schools', 'getSchools');
$app->get('/schools/:id', 'getSchoolById');
$app->get('/schools/:id/departments', 'getDepartments');
$app->get('/departments/:id', 'getDepartmentById');
$app->get('/departments/:id/courses', 'getCourses');
$app->get('/courses/:id', 'getCourseById');
$app->get('/courses/:id/teachers', 'getCourseTeachers');
$app->get('/sections', 'getSections');
$app->get('/sections/:id', 'getSectionById');
$app->get('/sections/:id/students', 'getStudentsEnrolled');
$app->get('/sections/:id/students/count', 'getStudentCount');
$app->get('/sections/:id/teachers', 'getSectionTeachers');

$app->get('/search/:usertype', 'findUsersByName');
$app->get('/search/student', 'findStudents');
$app->get('/search/sections', 'findSections');

$app->get('/login', 'validateCredentials');

$app->run();

#================================================================================================================#
# Login
#================================================================================================================#
function validateCredentials() {
    $sql = "select * from login where username=:username and password=:password";
    $bindparam = array("username"=> $_GET['username'], "password"=>$_GET['password']);
    echo json_encode(perform_query($sql, 'GET', $bindparam));
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
    echo json_encode(perform_query($sql,'GET',array("id"=>$id)));
}
function getDepartments($id){
    $schoolyear = $_GET['schoolyearid'];
    if (!isset($schoolyear)) {
        return;
    }
    $sql = "SELECT deptid, deptName, status from department where schoolid=:schoolid and schoolyearid=:schoolyear order by deptName asc";
    $bindparam = array("schoolid"=>$id,"schoolyear"=>$schoolyear);
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
}

function getDepartmentById($id) {
    $sql = "SELECT deptName, schoolyearid, status from department where deptid=:id";
    echo json_encode(perform_query($sql,'GET',array("id"=>$id)));
}
function getCourses($id){
    $schoolyear = $_GET['schoolyearid'];
    $schoolyear = $_GET['schoolyearid'];
    if (!isset($schoolyear)) {
        return;
    }
    $sql = "SELECT courseid, courseName, description, status from course where deptid=:id and schoolyearid=:schoolyear order by deptName asc";
    $bindparam = array("deptid"=>$id,"schoolyear"=>$schoolyear);
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
}
function getCourseById($id){
    $sql = "SELECT courseName, schoolyearid, description, status from course where courseid=:id";
    echo json_encode(perform_query($sql,'GET',array("id"=>$id)));
}
function getSections(){
    $schoolyear = $_GET['schoolyearid'];
    if (!isset($schoolyear)) {
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
    $bindparam = array("schoolid"=>$schoolid,"schoolyear"=>$schoolyear);
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
}
function getSectionsByCourse($schoolyear, $courseid){
    $sql = "SELECT s.sectionid, s.sectionCode, s.day, s.time, s.roomCapacity, s.roomLocation, s.classSize, s.status
     from section s where s.schoolyearid =:schoolyear and s.courseid=:courseid
     order by s.sectionCode asc";
    $bindparam = array("courseid"=>$courseid,"schoolyear"=>$schoolyear);
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
}
function getSectionById($id){
    $sql = "SELECT courseid, sectionCode, day, time, roomCapacity, roomLocation, classSize, status from section where sectionid=:id";
    echo json_encode(perform_query($sql,'GET',array("id"=>$id)));
}
/* Get number of students enrolled for a section */
function getStudentCount($id){
    $sql = "SELECT *
            FROM (SELECT count(userid) from enrollment group by sectionid) s
            where s.sectionid = :id";
    echo json_encode(perform_query($sql, 'GET', array("id"=>$id)));
}
function getStudentsEnrolled($id){
    $sql = "SELECT s.userid, s.firstName, s.lastName, s.dateOfBirth, s.gender, s.streetAddr1, s.streetAddr2, s.city,
    s.province, s.country, s.postalCode, s.phoneNumber, s.emailAddr, s.allergies, s.prevSchools, parentFirstName, s.parentLastName,
    s.parentPhoneNumber, s.parentEmailAddr, s.emergencyContactFirstName, s.emergencyContactLastName, s.emergencyContactRelation,
    s.emergencyContactPhoneNumber, s.schoolid, s.paid, s.status
            FROM student s and (SELECT userid from enrollment where sectionid=:id) e
            where e.userid = s.userid";
    echo json_encode(perform_query($sql, 'GETALL', array("id"=>$id)));
}
function getSectionTeachers($id){
    $sql = "SELECT t1.userid, t1.firstName, t1.lastName, t1.emailAddr, t1.status, t1.usertype
            FROM teacher t1 and teaching t2
            where t2.sectionid = :id
            and t2.teacherid = t1.userid";
    echo json_encode(perform_query($sql, 'GETALL', array("id"=>$id)));
}
function getCourseTeachers($id){
    $sql = "SELECT t1.userid, t1.firstName, t1.lastName, t1.emailAddr, t1.status, t1.usertype
            FROM teacher t1 and teaching t2
            where t2.courseid = :id
            and t2.teacherid = t1.userid";
    echo json_encode(perform_query($sql, 'GETALL', array("id"=>$id)));
}

#================================================================================================================#
# Students
#================================================================================================================#
/*
 * Returns a list of students
 */
function getStudents() {
    $sql = "SELECT userid, firstName, lastName, dateOfBirth, gender, streetAddr1, streetAddr2, city,
    province, country, postalCode, phoneNumber, emailAddr, allergies, prevSchools, parentFirstName, parentLastName,
    parentPhoneNumber, parentEmailAddr, emergencyContactFirstName, emergencyContactLastName, emergencyContactRelation,
    emergencyContactPhoneNumber, schoolid, paid, status
    from student";
    echo json_encode(perform_query($sql, 'GETALL'));
}

/*
 * Returns a single student record
 */
function getStudentById($id) {
    $sql = "SELECT userid, firstName, lastName, dateOfBirth, gender, streetAddr1, streetAddr2, city,
    province, country, postalCode, phoneNumber, emailAddr, allergies, prevSchools, parentFirstName, parentLastName,
    parentPhoneNumber, parentEmailAddr, emergencyContactFirstName, emergencyContactLastName, emergencyContactRelation,
    emergencyContactPhoneNumber, schoolid, paid, status
    from student where userid=:id";
    echo json_encode(perform_query($sql,'GET', array("id"=>$id)));
}

/*
 * Updates a student record
 */
function updateStudent($id) {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $student = json_decode($body);
    $sql = "UPDATE student set firstName=:firstName, lastName=:lastName, emailAddr=:emailAddr, userid=:id WHERE userid=:id";
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
    $sql = "INSERT into student (userid, firstName, lastName, dateOfBirth, gender, streetAddr1, streetAddr2, city,
    province, country, postalCode, phoneNumber, emailAddr, allergies, prevSchools, parentFirstName, parentLastName,
    parentPhoneNumber, parentEmailAddr, emergencyContactFirstName, emergencyContactLastName, emergencyContactRelation,
    emergencyContactPhoneNumber, schoolid, paid, status) values (:userid, :firstName, :lastName, :dateOfBirth, :gender, :streetAddr1, :streetAddr2, :city,
    :province, :country, :postalCode, :phoneNumber, :emailAddr, :allergies, :prevSchools, :parentFirstName, :parentLastName,
    :parentPhoneNumber, :parentEmailAddr, :emergencyContactFirstName, :emergencyContactLastName, :emergencyContactRelation,
    :emergencyContactPhoneNumber, :schoolid, :paid, :status)";
    $bindparams = array(
        "userid" => $student->userid,
        "firstName" => $student->firstName,
        "lastName" => $student->lastName,
        "dateOfBirth" => $student->dateOfBirth,
        "gender" => $student->gender,
        "streetAddr1" => $student->streetAddr1,
        "streetAddr2" => $student->streetAddr2,
        "city" => $student->city,
        "province" => $student->province,
        "country" => $student->country,
        "postalCode" => $student->postalCode,
        "phoneNumber" => $student->phoneNumber,
        "emailAddr" => $student->emailAddr,
        "allergies" => $student->allergies,
        "prevSchools" => $student->prevSchools,
        "parentFirstName" => $student->parentFirstName,
        "parentLastName" => $student->parentLastName,
        "parentPhoneNumber" => $student->parentPhoneNumber,
        "parentEmailAddr" => $student->parentEmailAddr,
        "emergencyContactFirstName" => $student->emergencyContactFirstName,
        "emergencyContactLastName" => $student->emergencyContactLastName,
        "emergencyContactRelation" => $student->emergencyContactRelation,
        "emergencyContactPhoneNumber" => $student->emergencyContactPhoneNumber,
        "schoolid" => $student->schoolid,
        "paid" => $student->paid,
        "status" => $student->status,
    );
    echo json_encode(perform_query($sql,'POST',$bindparams));
}

/*
 * Updates a student record
 */
function deleteStudent($id) {
    $sql = "DELETE from student where userid=:id";
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
#================================================================================================================#
# Search
#================================================================================================================#
/* General find for students */
function findStudents(){
    $firstname = $_GET['firstName'];
    $lastname = $_GET['lastName'];
    $day = $_GET['day'];
    $month = $_GET['month'];
    $year = $_GET['year'];
    $gender = $_GET['gender'];
    $paid = $_GET['paid'];
    $clause = '';
    if (!(isset($firstname)||isset($lastname))){
        echo 'must provide either first or last name';
        return;
    }
    if (isset($firstname)) {
        $clause.="firstName like \"%".$firstname."%\"";
        if (isset($lastname)){
            $clause.="and lastName like \"%".$lastname."%\"";
        }
    }
    else
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
            $clause.=" and gender=".$gender;
        }
        if (isset($paid)){
            $clause.=" and paid=".$paid;
        }
    $sql = "SELECT * from student where :clause and order by firstName asc";
    $bindparam = array("clause"=>$clause);
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
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


/* TODO: find by times*/
function findSections(){
    $schoolyear = $_GET['schoolyearid'];
    $schoolid = $_GET['schoolid'];
    if (!(isset($schoolyear) || (isset($schoolid)))) {
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
    $bindparam = array("schoolyear"->$schoolyear, "schoolid"=>$schoolid, "deptname"=>$deptname, "coursename"=>$coursename);
    if (isset($days)){
        $days = constructDayClause($days);
        $sql.= " and :days";
        $bindparam["days"=$days];
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
    $bindparam = array("schoolyear"->$schoolyear, "schoolid"=>$schoolid, "deptname"=>$deptname);
    if (isset($days)){
        $days = constructDayClause($days);
        $sql.= " and :days";
        $bindparam["days"=$days];
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
    $bindparam = array("schoolyear"=>$schoolyear, "schoolid"=>$schoolid, "coursename"=>$coursename, "days"=>$days);
    if (isset($days)){
        $days = constructDayClause($days);
        $sql.= " and :days";
        $bindparam["days"=$days];
    }
    $sql.= " order by s.sectionCode asc";
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
}

function findSectionsByDay($schoolyear, $schoolid, $days){
    $days = constructDayClause($days);
    $sql = "SELECT s.sectionid, s.courseid, s.sectionCode, s.teacherid, s.day, s.time, s.roomCapacity, s.roomLocation, s.classSize, s.status
            from section s,
            (select courseid from course c1,
                (select deptid from department where schoolid=:schoolid and schoolyearid=:schoolyear) d
                where d.deptid = c1.deptid and c1.schoolyearid=:schoolyear) c
            where s.courseid = c.courseid and s.schoolyearid=:schoolyear and :days orderby s.sectionCode asc";
    $bindparam = array("schoolyear"=>$schoolyear, "schoolid"=>$schoolid, "days"=>$days);
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
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