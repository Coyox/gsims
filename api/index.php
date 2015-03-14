<?php
require 'Slim/Slim.php';
require_once 'helpers.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/students', 'getStudents');
$app->get('/students/:id', 'getStudentById');
$app->get('/students/:id/sections', 'getEnrolledSections');
$app->get('/students/:id/prevSections', 'getPrevEnrolledSections');

$app->post('/students', 'createStudent');
$app->put('/students/:id', 'updateStudent');
$app->delete('/students/:id', 'deleteStudent');

$app->get('/teachers', 'getTeachers');
$app->get('/teachers/:id', 'getTeacherById');
$app->post('/teachers', 'createTeacher');
$app->put('/teachers/:id', 'updateTeacher');
$app->delete('/teachers/:id', 'deleteTeacher');

$app->get('/administrators', 'getAdministrators');
$app->get('/administrators/:id', 'getAdministratorById');
$app->post('/administrators', 'createAdministrator');
$app->delete('/administrators/:id', 'deleteAdministrator');

$app->get('/superusers', 'getSuperusers');
$app->get('/superusers/:id', 'getSuperuserById');
$app->post('/superusers', 'createSuperuser');
$app->put('/superusers/:id', 'updateSuperuser');
$app->delete('/superusers/:id', 'deleteSuperuser');

$app->get('/schoolyears', 'getSchoolYears');
$app->post('/schoolyears', 'createSchoolYear');

$app->get('/schools', 'getSchools');
$app->get('/schools/:id', 'getSchoolById');
$app->get('/schools/:id/departments', 'getDepartments');

$app->get('/departments/:id', 'getDepartmentById');
$app->get('/departments/:id/courses', 'getCourses');

$app->get('/courses/:id', 'getCourseById');
$app->get('/courses/:id/prereqs', 'getCoursePrereqs');
$app->get('/courses/:id/teachers', 'getCourseTeachers');
$app->post('/courses/:id/:tid', 'assignCourseTeacher');

$app->get('/sections', 'getSections');
$app->get('/sections/:id', 'getSectionById');
$app->get('/sections/:id/students', 'getStudentsEnrolled');
$app->get('/sections/:id/students/count', 'getStudentCount');
$app->delete('/sections/students/:id/:sid', 'dropStudent');
$app->post('/sections/students/:id/:sid', 'enrollStudent');
$app->get('/sections/:id/teachers', 'getSectionTeachers');
$app->post('/sections/:id/teachers/:tid', 'assignSectionTeacher');

$app->get('/search/users/:usertype', 'findUsers');
$app->get('/search/sections', 'findSections');

$app->get('/login', 'validateCredentials');

$app->run();


#================================================================================================================#
# Login
#================================================================================================================#
function validateCredentials() {
    $password = $_GET['password'];
    $sql = "SELECT userid, username, password, usertype, lastLogin from login where username=:username LIMIT 1";
    $bindparam = array("username"=> $_GET['username']);
    $user = perform_query($sql, 'GET', $bindparam);
    // if ( hash_equals($user->password, crypt($password, $user->password)) ) {
    //     echo json_encode($user);
    // }
    echo json_encode($user);
}
#================================================================================================================#
# School Years
#================================================================================================================#
function getSchoolYears(){
    $sql = "SELECT schoolyearid, schoolyear from schoolyear order by schoolyear desc";
    echo json_encode(perform_query($sql,'GETALL'));
}

function createSchoolYear(){
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $schoolyear = json_decode($body);

    // 6 digit schoolyearid
    $sql = "SELECT schoolyearid from schoolyear where schoolyearid=:schoolyearid";
    $bindparam = array("schoolyearid"=>$schoolyearid);
    $schoolyearid = generateUniqueID($sql, $bindparam, 6);

    $sql = "INSERT into schoolyear (schoolyearid, schoolyear)
            values (:schoolyearid, :schoolyear)";

    $bindparam["schoolyear"] = $schoolyear->schoolyear;
    echo json_encode(perform_query($sql,'POST',$bindparam));
}
#================================================================================================================#
# Schools
#================================================================================================================#
function getSchools() {
    $sql = "SELECT schoolid, location, postalCode, yearOpened, status from school order by location asc" ;
    echo json_encode(perform_query($sql, 'GETALL'));
}
function getSchoolById($id) {
    $sql = "SELECT location, postalCode, yearOpened, status from school where schoolid=:id";
    echo json_encode(perform_query($sql,'GET',array("id"=>$id)));
}
/* Get all departments for a school */
function getDepartments($id){
    $schoolyear = $_GET['schoolyearid'];
    if (!isset($schoolyear)) { return; }
    $sql = "SELECT deptid, deptName, status from department where schoolid=:schoolid and schoolyearid=:schoolyear order by deptName asc";
    $bindparam = array("schoolid"=>$id,"schoolyear"=>$schoolyear);
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
}
#================================================================================================================#
# Departments
#================================================================================================================#
function getDepartmentById($id) {
    $sql = "SELECT deptName, schoolyearid, status from department where deptid=:id";
    echo json_encode(perform_query($sql,'GET',array("id"=>$id)));
}
/* Get all courses for a department */
function getCourses($id){
    $schoolyear = $_GET['schoolyearid'];
    if (!isset($schoolyear)) { return; }
    $sql = "SELECT courseid, courseName, description, status from course where deptid=:id and schoolyearid=:schoolyear order by courseName asc";
    $bindparam = array("id"=>$id,"schoolyear"=>$schoolyear);
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
}
#================================================================================================================#
# Courses
#================================================================================================================#
function getCourseById($id){
    $sql = "SELECT courseName, schoolyearid, description, status from course where courseid=:id";
    echo json_encode(perform_query($sql,'GET',array("id"=>$id)));
}
function getCourseTeachers($id){
    $sql = "SELECT t1.userid, t1.firstName, t1.lastName, t1.emailAddr, t1.status, t1.usertype
            FROM teacher t1, teaching t2
            where t2.courseid = :id
            and t2.userid = t1.userid";
    echo json_encode(perform_query($sql, 'GETALL', array("id"=>$id)));
}
function getCoursePrereqs($id){
    $sql = "SELECT courseid, prereq from prereqs where courseid=:id";
    echo json_encode(perform_query($sql, 'GETALL', array("id"=>$id)));
}
function assignCourseTeacher($id, $tid){
     $sql = "INSERT into teaching (userid, courseid) values (:tid, :id)";
     $bindparams = array("tid"=>$tid, "id"=>$id);
     echo json_encode(perform_query($sql,'POST',$bindparams));
}
#================================================================================================================#
# Sections
#================================================================================================================#
function getSections(){
    $schoolyear = $_GET['schoolyearid'];
    if (!isset($schoolyear)) { return; }
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
    $sql = "SELECT s.sectionid, s.courseid, c1.courseName, s.sectionCode, s.day, s.startTime, s.endTime, s.roomCapacity, s.roomLocation, s.classSize, s.status
            from section s, course c1
            where s.courseid in (select c.courseid from course c
                where c.deptid in (select d.deptid from department d where d.schoolid=:schoolid and d.schoolyearid=:schoolyear)
                and c.schoolyearid=:schoolyear)
            and s.schoolyearid=:schoolyear
            and s.courseid = c1.courseid
            order by s.sectionCode asc";
    $bindparam = array("schoolid"=>$schoolid,"schoolyear"=>$schoolyear);
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
}
function getSectionsByCourse($schoolyear, $courseid){
    $sql = "SELECT s.sectionid, s.sectionCode, s.day, s.startTime, s.endTime, s.roomCapacity, s.roomLocation, s.classSize, s.status
     from section s where s.schoolyearid =:schoolyear and s.courseid=:courseid
     order by s.sectionCode asc";
    $bindparam = array("courseid"=>$courseid,"schoolyear"=>$schoolyear);
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
}
function getSectionById($id){
    $sql = "SELECT s.courseid, s.sectionCode, c.courseName, s.day, s.startTime, s.endTime, s.roomCapacity, s.roomLocation, s.classSize, s.status
            from section s, course c
            where s.sectionid=:id and s.courseid=c.courseid";
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
    s.province, s.country, s.postalCode, s.phoneNumber, s.emailAddr, s.allergies, s.prevSchools, s.parentFirstName, s.parentLastName,
    s.parentPhoneNumber, s.parentEmailAddr, s.emergencyContactFirstName, s.emergencyContactLastName, s.emergencyContactRelation,
    s.emergencyContactPhoneNumber, s.schoolid, s.paid, s.status
            FROM student s WHERE s.userid in (SELECT e.userid from enrollment e where e.sectionid=:id)";
    echo json_encode(perform_query($sql, 'GETALL', array("id"=>$id)));
}
function getSectionTeachers($id){
    $sql = "SELECT t1.userid, t1.firstName, t1.lastName, t1.emailAddr, t1.status, t1.usertype
            FROM teacher t1
            where t1.userid in (SELECT t2.userid from teaching t2 where t2.sectionid=:id)";
    echo json_encode(perform_query($sql, 'GETALL', array("id"=>$id)));
}
function dropStudent($id, $sid){
    $sql = "DELETE from enrollment where sectionid=:id, userid=:sid";
    echo json_encode(perform_query($sql,'', array("id"=>$id, "sid"=>$sid)));
}
function enrollStudent($id, $sid){
    $schoolyearid = $_POST['schoolyearid'];
    if (!issert($schoolyearid)) { return ; }
    $sql = "INSERT into student (userid, sectionid, schoolyearid, status)
            values (:userid, :sectionid, :schoolyearid, :status )";
    $bindparams = array(
        "userid" => $sid,
        "userid" => $id,
        "schoolyearid" => $schoolyearid,
        "status" => "active",
    );
    echo json_encode(perform_query($sql,'POST',$bindparams));
}
function assignSectionTeacher($id, $tid){
    $sql = "INSERT into teaching
            SELECT :tid, courseid , :id
            FROM section
            WHERE sectionid=id";
    $bindparams = array("tid"=>$tid, "id"=>$id);
    echo json_encode(perform_query($sql,'POST',$bindparams));
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

function getEnrolledSections($id){
    $sql = "SELECT s.sectionid, s.courseid, c.courseName, s.sectionCode, s.day, s.startTime, s.endTime, s.roomCapacity, s.roomLocation, s.classSize, s.schoolyearid, s.status
    FROM section s, course c
    WHERE s.sectionid in (SELECT e.sectionid from enrollment e where e.userid=:id)
    and s.courseid = c.courseid";
    echo json_encode(perform_query($sql, 'GETALL', array("id"=>$id)));
}

/*
 * provide schoolyear string instead of schoolyearid
 */
function getPrevEnrolledSections($id){
    $schoolyearid = $_GET['schoolyearid'];
    $sql = "SELECT s.sectionid, s.courseid, c.courseName, s.sectionCode, s.day, s.startTime, s.endTime, s.roomCapacity, s.roomLocation, s.classSize, s.schoolyearid, s.status
            FROM section s, course c
            WHERE s.sectionid
                IN (SELECT e.sectionid FROM enrollment e
                    WHERE e.userid=:id
                    AND e.schoolyearid IN
                   (SELECT sy.schoolyearid from schoolyear sy
                    WHERE substr(sy.schoolyear,1,4) <= (SELECT substr(sy2.schoolyear,1,4) from schoolyear sy2 where sy2.schoolyearid=:schoolyearid)
                    AND sy.schoolyearid <> :schoolyearid
                 ))
            AND s.courseid = c.courseid";
    echo json_encode(perform_query($sql, 'GETALL', array("id"=>$id, "schoolyearid"=>$schoolyearid)));
}


/*
 * Updates a student record
 */
function updateStudent($id) {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $student = json_decode($body);

    $sql = "UPDATE student
    set
    firstName=:firstName, lastName=:lastName, dateOfBirth=:dateOfBirth, gender=:gender, streetAddr1=:streetAddr1, streetAddr2=:streetAddr2, city=:city,
    province=:province, country=:country, postalCode=:postalCode, phoneNumber=:phoneNumber, emailAddr=:emailAddr, allergies=:allergies, prevSchools=:prevSchools, parentFirstName=:parentFirstName, parentLastName=:parentLastName,
    parentPhoneNumber=:parentPhoneNumber, parentEmailAddr=:parentEmailAddr, emergencyContactFirstName=:emergencyContactFirstName, emergencyContactLastName=:emergencyContactLastName, emergencyContactRelation=:emergencyContactRelation,
    emergencyContactPhoneNumber=:emergencyContactPhoneNumber, schoolid=:schoolid, paid=:paid, status=:status
    WHERE userid=:userid";

    $bindparams = array(
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
    echo json_encode(perform_query($sql,'',$bindparams));
}

/*
 * Creates a student record
 */
function createStudent() {
    $userid = createNewUser($firstname, $lastname, $usertype);

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

    $userid = createNewUser($student->firstName, $student->$lastName, 'S');
    $bindparams = array(
        "userid" => $userid,
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
 * mark student as inactive
 */
function deleteStudent($id) {
    //$sql = "DELETE from student where userid=:id";
    $sql = "UPDATE student set status='inactive' where userid=:id";
    echo json_encode(perform_query($sql,'', array("id"=>$id)));
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
    echo json_encode(perform_query($sql,'GET', array("id"=>$id)));
}

function createTeacher() {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $teacher = json_decode($body);
    $sql = "INSERT into teacher (userid, schoolid, firstName, lastName, emailAddr, status, usertype)
                         values (:userid, :schoolid, :firstName, :lastName, :emailAddr, :status, :usertype)";

    $userid = createNewUser($teacher->firstName, $teacher->$lastName, 'T');
    $bindparams = array(
        "userid" => $userid,
        "schoolid" => $teacher->schoolid,
        "firstName" => $teacher->firstName,
        "lastName" => $teacher->lastName,
        "emailAddr" => $teacher->emailAddr,
        "status" => $teacher->status,
        "usertype" => 'T'
    );
    echo json_encode(perform_query($sql,'POST',$bindparams));

}

/*
 Update teacher/administrator record
*/
function updateTeacher($id) {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $teacher = json_decode($body);

    $sql = "UPDATE teacher
    set schoolid=:schoolid, firstName=:firstName, lastName=:lastName, emailAddr=:emailAddr, status=:status, usertype=:usertype
    WHERE userid=:userid";

    $bindparams = array(
        "schoolid" => $teacher->schoolid,
        "firstName" => $teacher->firstName,
        "lastName" => $teacher->lastName,
        "emailAddr" => $teacher->emailAddr,
        "status" => $teacher->status,
        "usertype" => $teacher->usertype
    );
    echo json_encode(perform_query($sql,'',$bindparams));
}
/*
 * mark teacher as inactive
 */
function deleteTeacher($id) {
    $sql = "UPDATE teacher set status='inactive' where userid=:id";
    echo json_encode(perform_query($sql,'', array("id"=>$id)));
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
    echo json_encode(perform_query($sql,'GET', array("id"=>$id)));
}
function createAdministrator() {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $admin = json_decode($body);
    $sql = "INSERT into teacher (userid, schoolid, firstName, lastName, emailAddr, status, usertype)
                         values (:userid, :schoolid, :firstName, :lastName, :emailAddr, :status, :usertype)";
    $userid = createNewUser($admin->firstName, $admin->$lastName, 'A');

    $bindparams = array(
        "userid" => $userid,
        "schoolid" => $admin->schoolid,
        "firstName" => $admin->firstName,
        "lastName" => $admin->lastName,
        "emailAddr" => $admin->emailAddr,
        "status" => $admin->status,
        "usertype" => 'A'
    );
    echo json_encode(perform_query($sql,'POST',$bindparams));
}
function deleteAdministrator($id) {
    $sql = "UPDATE teacher set status='inactive' where userid=:id";
    echo json_encode(perform_query($sql,'', array("id"=>$id)));
}
#================================================================================================================#
# Superusers
#================================================================================================================#
function getSuperusers() {
    $sql = "SELECT userid, firstName, lastName, emailAddr, status from superuser order by firstName asc" ;
    echo json_encode(perform_query($sql, 'GETALL'));
}
function getSuperuserById($id) {
    $sql = "SELECT userid, firstName, lastName, emailAddr, status from superuser where userid=:id";
    echo json_encode(perform_query($sql,'GET', array("id"=>$id)));
}
function createSuperuser() {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $superuser = json_decode($body);
    $sql = "INSERT into superuser (userid, firstName, lastName, emailAddr, status)
                         values (:userid, :firstName, :lastName, :emailAddr, :status)";
    $userid = createNewUser($superuser->firstName, $superuser->$lastName, 'SU');

    $bindparams = array(
        "userid" => $userid,
        "firstName" => $superuser->firstName,
        "lastName" => $superuser->lastName,
        "emailAddr" => $superuser->emailAddr,
        "status" => $superuser->status,
    );
    echo json_encode(perform_query($sql,'POST',$bindparams));
}

function updateSuperuser($id) {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $superuser = json_decode($body);

    $sql = "UPDATE superuser
    set firstName=:firstName, lastName=:lastName, emailAddr=:emailAddr, status=:status
    WHERE userid=:userid";

    $bindparams = array(
        "firstName" => $superuser->firstName,
        "lastName" => $superuser->lastName,
        "emailAddr" => $superuser->emailAddr,
        "status" => $superuser->status,
    );
    echo json_encode(perform_query($sql,'',$bindparams));
}
function deleteSuperuser($id) {
    $sql = "UPDATE superuser set status='inactive' where userid=:id";
    echo json_encode(perform_query($sql,'', array("id"=>$id)));
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
/*
 usertype has to be either 'S', 'A' or 'T' for student, admin and teacher
*/
function findUsers($usertype){
    $param = array();
    $firstname = $_GET['firstName'];
    $lastname = $_GET['lastName'];
    if (isset($firstname)) {
        $param['firstName'] = $_GET['firstName'];
    }
    if (isset($lastname)) {
        $param['lastName'] = $_GET['lastName'];
    }

    if ($usertype=='S'){
        $year = $_GET['year'];
        $loweryear = $_GET['lowerYear'];
        $upperyear = $_GET['upperYear'];
        $gender = $_GET['gender'];
        $paid = $_GET['paid'];
        $city = $_GET['city'];
        $province = $_GET['province'];
        $country = $_GET['country'];
        $status = $_GET['status'];
        if (isset($firstname)||isset($lastname)||isset($year)||isset($loweryear)||isset($gender)||isset($paid)||isset($city)||isset($province)||isset($country)){
            if (isset($year)){
                $yearop = constant($_GET['yearop']);
                $param['year'] = $yearop."'".$year;
            }
            if (isset($loweryear)){ $param['year'] = " ".$_GET['yearop']." '".$loweryear."' and '".$upperyear; }
            if (isset($gender)){ $param['gender'] = $gender; }
            if (isset($paid)){ $param['paid'] = $paid; }
            if (isset($city)){ $param['city'] = $city; }
            if (isset($province)){ $param['province'] = $province; }
            if (isset($country)){ $param['country'] = $country; }
            if (isset($status)){ $param['status'] = $country; }

            $clause = buildWhereClause($param);
            $sql = "SELECT userid, firstName, lastName, dateOfBirth, gender, streetAddr1, streetAddr2, city,
    province, country, postalCode, phoneNumber, emailAddr, allergies, prevSchools, parentFirstName, parentLastName,
    parentPhoneNumber, parentEmailAddr, emergencyContactFirstName, emergencyContactLastName, emergencyContactRelation,
    emergencyContactPhoneNumber, schoolid, paid, status from student ".$clause." order by firstName asc";
            echo json_encode(perform_query($sql,'GETALL'));
        }
        else{
            return getUsers($usertype);
        }
    }
    else if ($usertype=="A"|$usertype=="T"){
        if (array_key_exists('firstName', $param) || array_key_exists('lastName', $param)) {
            $clause = buildWhereClause($param);
            $sql = "SELECT userid, schoolid, firstName, lastName, emailAddr, status from teacher ".$clause." order by firstName asc";
            echo json_encode(perform_query($sql,'GETALL'));
        }
        else{
            return getUsers($usertype);
        }

    }
}


function findSections(){
    //Non-filter options
    $schoolyear = $_GET['schoolyearid'];
    $schoolid = $_GET['schoolid'];
    if (!isset($schoolyear) || (!isset($schoolid))) { return; }


    //Find options
    $deptname = $_GET['deptName'];
    $coursename = $_GET['courseName'];
    $day = $_GET['day'];
    $startTime = $_GET['startTime'];
    $endTime = $_GET['endTime'];


    if(isset($deptname)||isset($coursename)||isset($day)||isset($startTime)||isset($endTime)){
        $params = array();
        $deptclause = " where d.schoolyearid=:schoolyear and d.schoolid=:schoolid";
        $courseclause = " and c.schoolyearid=:schoolyear";
        if (isset($deptname)){ $deptclause.= " and d.deptName like '%".$deptname."%'"; }
        if (isset($coursename)){ $courseclause.= " and c.courseName like '%".$coursename."%'"; }

        $bindparam = array("schoolyear"=>$schoolyear, "schoolid"=>$schoolid);

        $sql = "SELECT s.sectionid, s.courseid, c1.courseName, s.sectionCode, s.day, s.startTime, s.endTime, s.roomCapacity, s.roomLocation, s.classSize, s.status
            from section s, course c1
            where s.courseid in (select c.courseid from course c
                where c.deptid in (select d.deptid from department d".$deptclause.")".$courseclause.") and s.schoolyearid=:schoolyear and s.courseid=c1.courseid";
        if (isset($day)){
            $sql.= buildDayClause($day);
        }

        if (isset($startTime)){ " and ".$startTime."<= s.startTime and ".$endTime." >= s.endTime"; }
        $sql.= " order by s.sectionCode asc";
        echo json_encode(perform_query($sql,'GETALL',$bindparam));
    }
    else {
        return getSectionsBySchool($schoolyear, $schoolid);
    }
}

/*
 Create new user in login table with generated login creds
*/
function createNewUser($firstname, $lastname, $usertype){
    $sql = "INSERT into login (userid, username, password, usertype)
            VALUES (:userid, :username, :password, :usertype)";
    $userid="";
    $username="";
    $password="";
    list($userid, $username, $password) = generateLogin($firstname, $lastname);

    $password = generatePasswordHash($password);

    $bindparams=array("userid" => $userid,
                      "username"=> $username,
                      "password"=> $password,
                      "usertype" => $usertype);
    echo json_encode(perform_query($sql,'POST',$bindparams));
    return $userid;
}
