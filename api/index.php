<?php
require 'Slim/Slim.php';
require_once 'helpers.php';
require_once 'crossdomain.php';


\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim(array(
    'debug' => true
));
$app->get('/students', 'getStudents');
$app->get('/students/:id', 'getStudentById');
$app->get('/students/:id/sections', 'getEnrolledSections');
$app->get('/students/:id/prevSections', 'getPrevEnrolledSections');
$app->get('/students/:id/tests', 'getEnrolledTests');
$app->get('/students/:id/avgGrade', 'getAvgGrade');
$app->get('/students/tests', 'getAllEnrolledTests');
$app->post('/students', 'createStudent');
$app->post('/students/:id/sections', 'enrollStudentInSections');
$app->post('/students/:id/tests', 'enrollStudentInTests');
$app->post('/students/pending', 'handlePendingStudents');
$app->put('/students/:id/tests', 'updateStudentTestScores');
$app->put('/students/:id', 'updateStudent');
$app->delete('/students/:id', 'deleteStudent');

$app->get('/teachers', 'getTeachers');
$app->get('/teachers/:id', 'getTeacherById');
$app->get('/teachers/:id/sections', 'getTeachingSections');
$app->post('/teachers', 'createTeacher');
$app->post('/teachers/:id', 'addCourseCompetencies');
$app->put('/teachers/:id', 'updateTeacher');
$app->delete('/teachers/:id', 'deleteTeacher');

$app->get('/administrators', 'getAdministrators');
$app->get('/administrators/:id', 'getAdministratorById');
$app->post('/administrators', 'createAdministrator');
$app->delete('/administrators/:id', 'deleteTeacher');

$app->get('/superusers', 'getSuperusers');
$app->get('/superusers/:id', 'getSuperuserById');
$app->post('/superusers', 'createSuperuser');
$app->put('/superusers/:id', 'updateSuperuser');
$app->delete('/superusers/:id', 'deleteSuperuser');

$app->get('/schoolyears', 'getSchoolYears');
$app->get('/schoolyears/active', 'getActiveSchoolYear');
$app->post('/schoolyears', 'createSchoolYear');
$app->put('/schoolyears/active/:id', 'updateActiveSchoolYear');
$app->put('/schoolyears/reg/:id', 'updateOpenRegistration');
$app->delete('/schoolyears/:id', 'deleteSchoolYear');

$app->get('/schools', 'getSchools');
$app->get('/schools/:id', 'getSchoolById');
$app->get('/schools/:id/departments', 'getDepartments');
$app->get('/schools/:id/departments/count', 'getDepartmentCount');
$app->post('/schools', 'createSchool');
$app->put('/schools/:id', 'updateSchool');
$app->delete('/schools/:id', 'deleteSchool');

$app->get('/departments/:id', 'getDepartmentById');
$app->get('/departments/:id/courses', 'getCourses');
$app->get('/departments/:id/courses/count', 'getCourseCount');
$app->post('/departments', 'createDepartment');
$app->put('/departments/:id', 'updateDepartment');
$app->delete('/departments/:id', 'deleteDepartment');

$app->get('/courses/:id', 'getCourseById');
$app->get('/courses/:id/prereqs', 'getCoursePrereqs');
$app->get('/courses/:id/teachers', 'getCourseTeachers');
$app->post('/courses/:id/prereqs', 'addCoursePrereqs');
$app->post('/courses/:id/:tid', 'assignCourseTeacher');
$app->post('/courses/:id', 'waitlistStudent');
$app->post('/courses', 'createCourse');
$app->put('/courses/:id', 'updateCourse');
$app->delete('/courses/:id/prereqs/:preq', 'deleteCoursePrereq');
$app->delete('/courses/:id', 'deleteCourse');
$app->delete('/courses/:id/:tid', 'unassignCourseTeacher');

$app->get('/sections', 'getSections');
$app->get('/sections/count', 'getSectionCount');
$app->get('/sections/:id', 'getSectionById');
$app->get('/sections/:id/students/:userid', 'getStudentGradeForSection');
$app->get('/sections/:id/students', 'getStudentsEnrolled');
$app->get('/sections/:id/students/count', 'getStudentCount');
$app->get('/sections/:id/teachers', 'getSectionTeachers');
$app->get('/sections/:id/avgAttendance', 'getAvgAttendance');
$app->post('/sections/:id/teachers/:tid', 'assignSectionTeacher');
$app->post('/sections', 'createSection');
$app->post('/sections/students/:id/:sid', 'enrollStudent');
$app->post('/sections/:id/attendance', 'inputAttendance');
$app->put('/sections/:id', 'updateSection');
$app->delete('/sections/students/:id/:sid', 'dropStudent');
$app->delete('/sections/:id', 'deleteSection');
$app->delete('/sections/:id/teachers/:tid', 'unassignSectionTeacher');

$app->get('/documents', 'getDocuments');
$app->get('/documents/:id', 'getDocumentById');
$app->post('/documents', 'createDocument');
$app->post('/documents/:id/marks', 'inputMarks');
$app->put('/documents/:id/marks', 'updateMarks');
$app->put('/documents/:id', 'updateDocument');
$app->delete('/documents/:id', 'deleteDocument');

$app->get('/search/users/:usertype', 'findUsers');
$app->get('/search/sections', 'findSections');

$app->get('/login', 'validateCredentials');
$app->put('/login/:id', 'updateLogin');
$app->get('/login/:id', 'getLoginById');

$app->get('/users/:id/:usertype', 'getUserById');
$app->get('/users/:emailAddr', 'getUserByEmailAddr');

$app->get('/count/:usertype', 'getUserCount');

$app->get('/notif/missingInputAttendance', 'getTeachersWithMissingInputAttendance');

$app->post('/purge/attendance', 'purgeAttendance');
$app->post('/purge/waitlist', 'purgeWaitlist');
$app->post('/purge/user', 'purgeUsers');
$app->post('/purge/schoolyear', 'purgeSchoolYears');
$app->post('/purge/school', 'purgeSchools');
$app->post('/purge/department', 'purgeDepartments');
$app->post('/purge/course', 'purgeCourses');
$app->post('/purge/section', 'purgeSections');
$app->post('/purge/document', 'purgeDocuments');
$app->delete('/purge/inactive', 'purgeInactive');

$app->run();


#================================================================================================================#
# Login
#================================================================================================================#
function validateCredentials() {
    $password = $_GET['password'];
    if (isset($password)){
        $sql = "SELECT * from login where username=:username LIMIT 1";
        $bindparam = array("username"=> $_GET['username']);
        $user = perform_query($sql, 'GET', $bindparam);
        // if ( hash_equals($user->password, crypt($password, $user->password)) ) {
        //     echo json_encode($user);
        // }
        $sql = "UPDATE login set lastLogin=CURRENT_TIMESTAMP where username=:username";
        perform_query($sql, '', $bindparam);
        echo json_encode($user);

    }
    else {
        $sql = "SELECT userid, username, usertype, lastLogin from login order by userid asc";
        echo json_encode(perform_query($sql, 'GETALL'));
    }
}

function updateLogin($id) {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $user = json_decode($body);

    $sql = "UPDATE login
    set username=:username, password=:password
    WHERE userid=:userid";

    $hash = generatePasswordHash($user->password);
    $bindparams = array(
        "userid" => $id,
        "username" => $user->username,
        "password" => $hash
    );
    echo json_encode(perform_query($sql,'',$bindparams));
}

function getLoginById($id){
    $sql = "SELECT * from login where userid=:id";
    echo json_encode(perform_query($sql,'GET',array("id"=>$id)));
}

#================================================================================================================#
# School Years
#================================================================================================================#
function getSchoolYears(){
    $sql = "SELECT * from schoolyear order by schoolyear desc";
    echo json_encode(perform_query($sql,'GETALL'));
}

function getActiveSchoolYear(){
    $sql = "SELECT schoolyearid, schoolyear, openForReg from schoolyear where status='active' limit 1 ";
    echo json_encode(perform_query($sql, 'GET'));
}

function createSchoolYear(){
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $schoolyear = json_decode($body);

    $sql = "SELECT schoolyearid from schoolyear where schoolyearid=:schoolyearid";
    $schoolyearid = generateUniqueID($sql, "schoolyearid");

    $sql = "INSERT into schoolyear (schoolyearid, schoolyear, status, openForReg)
            values (:schoolyearid, :schoolyear, :status, :openForReg)";
    $bindparam = array("schoolyearid"=>$schoolyearid, "schoolyear"=>$schoolyear->schoolyear, "status"=>$schoolyear->status, "openForReg"=>$schoolyear->openForReg);
    echo json_encode(perform_query($sql,'POST', $bindparam));

    if ($schoolyear->duplicate == 1){
        $current_schoolyear = $schoolyear->currentSchoolYear;

        // create a row for each department
        $sql = "SELECT count(*) from department where schoolyearid=:activeschoolyear";
        $rowcount = (int) perform_query($sql, 'GETCOL', array("activeschoolyear"=>$current_schoolyear));
        $idsql = "SELECT deptid from dept where deptid=:deptid";

        $sql = "INSERT into department (deptid, schoolid, deptName, schoolyearid, status)
                SELECT :deptid, schoolid, deptName, :schoolyearid, :status FROM department where schoolyearid=:activeschoolyear
                AND (deptName not in (SELECT deptName from department where schoolyearid=:schoolyearid)) LIMIT 1";

        $bindparams = array(
            "schoolyearid" => $schoolyearid,
            "activeschoolyear" => $current_schoolyear,
            "status" => $schoolyear->status
        );
        for ($i=0 ; $i<$rowcount; $i++){
            $id = generateUniqueID($idsql, "deptid");
            $bindparams["deptid"] = $id;
            echo json_encode(perform_query($sql,'POST',$bindparams));
        }

        //create row for each course
        $sql = "SELECT count(*) from course where schoolyearid=:activeschoolyear";
        $rowcount = (int) perform_query($sql, 'GETCOL', array("activeschoolyear"=>$current_schoolyear));
        $idsql = "SELECT courseid from course where courseid=:courseid";

        $sql = "INSERT into course (courseid, courseName, description, deptid, schoolyearid, status)
                SELECT :courseid, courseName, description, deptid, :schoolyearid, :status FROM department where schoolyearid=:activeschoolyear
                AND (courseName not in (SELECT courseName from course where schoolyearid=:schoolyearid)) LIMIT 1";

        for ($i=0 ; $i<$rowcount; $i++){
            $id = generateUniqueID($idsql, "courseid");
            $bindparams["courseid"] = $id;
            echo json_encode(perform_query($sql,'POST',$bindparams));
        }

        //create row for each section
        $sql = "SELECT count(*) from section where schoolyearid=:activeschoolyear";
        $rowcount = (int) perform_query($sql, 'GETCOL', array("activeschoolyear"=>$current_schoolyear));
        $idsql = "SELECT sectionid from section where sectionid=:sectionid";

        $sql = "INSERT into section (sectionid, courseid, sectionCode, day, startTime, endTime, roomCapacity, roomLocation, classSize, schoolyearid, status)
                SELECT :sectionid, courseid, sectionCode, day, startTime, endTime, roomCapacity, roomLocation, classSize, :schoolyearid, :status FROM section where schoolyearid=:activeschoolyear
                AND (sectionCode not in (SELECT sectionCode from section where schoolyearid=:schoolyearid)) LIMIT 1";

        for ($i=0 ; $i<$rowcount; $i++){
            $id = generateUniqueID($idsql, "sectionid");
            $bindparams["sectionid"] = $id;
            echo json_encode(perform_query($sql,'POST',$bindparams));
        }
    }
}

// Updates school year and all other related records
function updateActiveSchoolYear($schoolyearid){
    $tables = array("schoolyear", "department", "course", "section", "document", "attendance", "enrollment", "marks");
    foreach ($tables as $table) {
        $sql = "UPDATE ".$table." set status = case when schoolyearid=:schoolyearid then 'active' else 'inactive' end";
        echo json_encode(perform_query($sql, 'PUT', array("schoolyearid"=>$schoolyearid)));
    }
}

function updateOpenRegistration($schoolyearid){
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $schoolyear = json_decode($body);
    $sql = "UPDATE schoolyear set openForReg=:openForReg where schoolyearid=:schoolyearid";
    echo json_encode(perform_query($sql, 'PUT', array("schoolyearid"=>$schoolyearid, "openForReg"=>$schoolyear->openForReg)));
}

function deleteSchoolYear($id) {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $option = json_decode($body);
    $bindparams = array("id"=>$id);
    $sql = ($option->purge == 1)? "DELETE from schoolyear where schoolyearid=:id" : "UPDATE schoolyear set status='inactive' where schoolyearid=:id";
    echo json_encode(perform_query($sql,'', $bindparams));
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
    $sql = "SELECT deptid, deptName, status from department where schoolid=:schoolid and schoolyearid=:schoolyear order by deptName asc";
    echo json_encode(perform_query($sql,'GETALL', array("schoolid"=>$id,"schoolyear"=>$schoolyear)));
}

function getDepartmentCount($id){
    $schoolyear = $_GET['schoolyearid'];
    $sql = "SELECT count(*) from department where schoolid=:schoolid and schoolyearid=:schoolyear";
    echo json_encode(perform_query($sql,'GETCOL', array("schoolid"=>$id,"schoolyear"=>$schoolyear)));
}

function createSchool(){
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $school = json_decode($body);

    $sql = "SELECT schoolid from school where schoolid=:schoolid";
    $schoolid = generateUniqueID($sql, "schoolid");

    $sql = "INSERT into school (schoolid, location, postalCode, yearOpened, status)
            values (:schoolid, :location, :postalCode, :yearOpened, :status)";

    $bindparams = array(
        "schoolid" => $schoolid,
        "location" => $school->location,
        "postalCode" => $school->postalCode,
        "yearOpened" => $school->yearOpened,
        "status" => $school->status
    );
    echo json_encode(perform_query($sql,'POST',$bindparams));
}
function updateSchool($id) {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $school = json_decode($body);

    $sql = "UPDATE school
    set location=:location, postalCode=:postalCode, yearOpened=:yearOpened, status=:status
    WHERE schoolid=:schoolid";

    $bindparams = array(
        "schoolid" => $id,
        "location" => $school->location,
        "postalCode" => $school->postalCode,
        "yearOpened" => $school->yearOpened,
        "status" => $school->status
    );
    echo json_encode(perform_query($sql,'',$bindparams));
}

function deleteSchool($id) {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $option = json_decode($body);
    $bindparams = array("id"=>$id);
    $sql = ($option->purge == 1)? "DELETE from school where schoolid=:id" : "UPDATE school set status='inactive' where schoolid=:id";
    echo json_encode(perform_query($sql,'', $bindparams));
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
    $sql = "SELECT courseid, courseName, description, status from course where deptid=:id and schoolyearid=:schoolyear order by courseName asc";
    echo json_encode(perform_query($sql,'GETALL', array("id"=>$id,"schoolyear"=>$schoolyear)));
}

function getCourseCount($id){
    $schoolyear = $_GET['schoolyearid'];
    $sql = "SELECT count(*) from course where deptid=:id and schoolyearid=:schoolyear";
    echo json_encode(perform_query($sql,'GETCOL', array("id"=>$id,"schoolyear"=>$schoolyear)));
}

function createDepartment(){
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dept = json_decode($body);

    $sql = "SELECT deptid from department where deptid=:deptid";
    $deptid = generateUniqueID($sql, "deptid");

    $sql = "INSERT into department (deptid, schoolid, deptName, schoolyearid, status)
            values (:deptid, :schoolid, :deptName, :schoolyearid, :status)";

    $bindparams = array(
        "deptid" => $deptid,
        "schoolid" => $dept->schoolid,
        "deptName" => $dept->deptName,
        "schoolyearid" => $dept->schoolyearid,
        "status" => $dept->status
    );
    echo json_encode(perform_query($sql,'POST',$bindparams));
}
function updateDepartment($id) {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $dept = json_decode($body);

    $sql = "UPDATE department
    set schoolid=:schoolid, deptName=:deptName, schoolyearid=:schoolyearid, status=:status
    WHERE deptid=:deptid";

    $bindparams = array(
        "deptid" => $id,
        "schoolid" => $dept->schoolid,
        "deptName" => $dept->deptName,
        "schoolyearid" => $dept->schoolyearid,
        "status" => $dept->status
    );
    echo json_encode(perform_query($sql,'',$bindparams));
}
function deleteDepartment($id) {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $option = json_decode($body);
    $bindparams = array("id"=>$id);
    $sql = ($option->purge == 1)? "DELETE from department where deptid=:id" : "UPDATE department set status='inactive' where deptid=:id";
    echo json_encode(perform_query($sql,'', $bindparams));
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
     echo json_encode(perform_query($sql,'POST',array("tid"=>$tid, "id"=>$id)));
}
function unassignCourseTeacher($id, $tid){
    $sql = "DELETE from teaching where userid=:tid and courseid=:id";
    echo json_encode(perform_query($sql,'',array("tid"=>$tid, "id"=>$id)));
}
function waitlistStudent($id){
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $student = json_decode($body);
    $sql = "INSERT into waitlisted (userid, waitlistid) values (:userid, :id)";
    $bindparams = array("userid"=>$student->userid, "id"=>$id);
    echo json_encode(perform_query($sql,'POST',$bindparams));
}
function createCourse(){
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $course = json_decode($body);

    $sql = "SELECT courseid from course where courseid=:courseid";
    $courseid = generateUniqueID($sql, "courseid");

    $sql = "INSERT into course (courseid, courseName, description, deptid, schoolyearid, status)
            values (:courseid, :courseName, :description, :deptid, :schoolyearid, :status)";

    $bindparams = array(
        "courseid" => $courseid,
        "courseName" => $course->courseName,
        "description" => $course->description,
        "deptid" => $course->deptid,
        "schoolyearid" => $course->schoolyearid,
        "status" => $course->status
    );
    echo json_encode(perform_query($sql,'POST',$bindparams));
}

function addCoursePrereqs($id){
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $prereqs = json_decode($body, true);
    $bindparams = array("courseid"=>$id);
    $sql = "INSERT into prereqs (courseid, prereq) values ";

    foreach (array_values($prereqs) as $i => $prereq) {
        $sql.= "(:courseid, :prereq".$i.")";
        $bindparams["prereq".$i] = $prereq;
    }
    $sql = rtrim($sql, ",");
    echo json_encode(perform_query($sql, 'POST', $bindparams));
}

function updateCourse($id) {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $course = json_decode($body);

    $sql = "UPDATE course
    set courseName=:courseName, description=:description, deptid=:deptid, schoolyearid=:schoolyearid, status=:status
    WHERE courseid=:courseid";

    $bindparams = array(
        "courseid" => $id,
        "courseName" => $course->courseName,
        "description" => $course->description,
        "deptid" => $course->deptid,
        "schoolyearid" => $course->schoolyearid,
        "status" => $course->status
    );
    echo json_encode(perform_query($sql,'',$bindparams));
}
function deleteCoursePrereq($id, $preq){
    $sql = "DELETE from prereqs where courseid=:courseid and prereq=:prereq";
    $bindparams = array("courseid"=>$id, "prereq"=>$preq);
    echo json_encode(perform_query($sql, '', $bindparams));
}
function deleteCourse($id) {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $option = json_decode($body);
    $bindparams = array("id"=>$id);
    $sql = ($option->purge == 1)? "DELETE from course where courseid=:id" : "UPDATE course set status='inactive' where courseid=:id";
    echo json_encode(perform_query($sql,'', $bindparams));
}
#================================================================================================================#
# Sections
#================================================================================================================#
function getSections(){
    $schoolyear = $_GET['schoolyearid'];
    $courseid = $_GET['courseid'];
    $schoolid = $_GET['schoolid'];
    $day = $_GET['day'];
    if (isset($schoolid)) {
        return getSectionsBySchool($schoolyear, $schoolid);
    }
    if (isset($courseid)) {
        return getSectionsByCourse($schoolyear, $courseid);
    }
    if (isset($day)){
        return getSectionsByDay($schoolyear, $day);
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
function getSectionsByDay($schoolyear, $day){
    $sql = "SELECT s.sectionid, s.courseid, c.courseName, s.sectionCode, s.day, s.startTime, s.endTime, s.roomCapacity, s.roomLocation, s.classSize, s.status
            from section s, course c
            where s.day=:day and s.courseid=c.courseid order by s.startTime asc";
    $bindparam = array("day"=>$day,"schoolyear"=>$schoolyear);
    echo json_encode(perform_query($sql,'GETALL',$bindparam));
}
function getSectionCount($schoolyear, $schoolid){
    $schoolyear = $_GET['schoolyearid'];
    $schoolid = $_GET['schoolid'];
    $sql = "SELECT count(*)
            from section s
            where s.courseid in (select c.courseid from course c
                where c.deptid in (select d.deptid from department d where d.schoolid=:schoolid and d.schoolyearid=:schoolyear)
                and c.schoolyearid=:schoolyear)
            and s.schoolyearid=:schoolyear";
    $bindparam = array("schoolid"=>$schoolid,"schoolyear"=>$schoolyear);
    echo json_encode(perform_query($sql,'GETCOL',$bindparam));
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
    $sql = "DELETE from enrollment where sectionid=:id and userid=:sid";
    echo json_encode(perform_query($sql,'', array("id"=>$id, "sid"=>$sid)));
}
function enrollStudent($id, $sid){
    $schoolyearid = $_POST['schoolyearid'];
    $sql = "INSERT into enrollment (userid, sectionid, schoolyearid, status)
            values (:userid, :sectionid, :schoolyearid, :status )";
    $bindparams = array(
        "userid" => $sid,
        "sectionid" => $id,
        "schoolyearid" => $schoolyearid,
        "status" => "active",
    );
    echo json_encode(perform_query($sql,'POST',$bindparams));
}
function assignSectionTeacher($id, $tid){
    $sql = "INSERT into teaching values (:tid, (SELECT courseid from section where sectionid=:id), :id)";
    echo json_encode(perform_query($sql,'POST',array("tid"=>$tid, "id"=>$id)));
}
function unassignSectionTeacher($id, $tid){
    $sql = "DELETE from teaching where userid=:tid and sectionid=:id";
    echo json_encode(perform_query($sql,'',array("tid"=>$tid, "id"=>$id)));
}
function createSection(){
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $section = json_decode($body);

    $sql = "SELECT sectionid from section where sectionid=:sectionid";
    $sectionid = generateUniqueID($sql, "sectionid");

    $sql = "INSERT into section (sectionid, courseid, sectionCode, day, startTime, endTime, roomCapacity, roomLocation, classSize, schoolyearid, status)
            values (:sectionid, :courseid, :sectionCode, :day, :startTime, :endTime, :roomCapacity, :roomLocation, :classSize, :schoolyearid, :status)";

    $bindparams = array(
        "sectionid" => $sectionid,
        "courseid" => $section->courseid,
        "sectionCode" => $section->sectionCode,
        "day" => $section->day,
        "startTime" => $section->startTime,
        "endTime" => $section->endTime,
        "roomCapacity" => $section->roomCapacity,
        "roomLocation" => $section->roomLocation,
        "classSize" => $section->classSize,
        "schoolyearid" => $section->schoolyearid,
        "status" => $section->status
    );
    echo json_encode(perform_query($sql,'POST',$bindparams));
}

function updateSection($id) {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $course = json_decode($body);

    $sql = "UPDATE section
    set courseid=:courseid, sectionCode=:sectionCode, day=:day, startTime=:startTime,
    endTime=:endTime, roomCapacity=:roomCapacity, roomLocation=:roomLocation, classSize=:classSize, schoolyearid=:schoolyearid, status=:status
    WHERE sectionid=:sectionid";

    $bindparams = array(
        "sectionid" => $id,
        "courseid" => $course->courseid,
        "sectionCode" => $course->sectionCode,
        "day" => $course->day,
        "startTime" => $course->startTime,
        "endTime" => $course->endTime,
        "roomCapacity" => $course->roomCapacity,
        "roomLocation" => $course->roomLocation,
        "classSize" => $course->classSize,
        "schoolyearid" => $coursecourse->schoolyearid,
        "status" => $course->status
    );
    echo json_encode(perform_query($sql,'',$bindparams));
}

function inputAttendance($id){
    $date = $_POST["date"];
    $schoolyearid = $_POST["schoolyearid"];
    $userids = json_decode($_POST["userids"]);

    $bindparams = array(
        "classdate" => $date,
        "sectionid" => $id,
        "schoolyearid" => $schoolyearid,
        "status" => 'active'
    );

    $sql = "INSERT INTO attendance(`date`, `userid`, `sectionid`, `schoolyearid`, `status`) values ";
    foreach (array_values($userids) as $i => $userid) {
        $sql.= "(:classdate, :userid".$i.", :sectionid, :schoolyearid, :status),";
        $bindparams["userid".$i] = $userid;
    }
    $sql = rtrim($sql, ",");
    echo json_encode(perform_query($sql,'POST',$bindparams));
}

function getAvgAttendance($id){
    $bindparams = array("id"=>$id);
    $sql = "SELECT classSize from section where sectionid=:id";
    $classSize = (int) perform_query($sql, 'GETCOL', $bindparams);

    $sql = "SELECT count(distinct `date`) from attendance";
    $numberofdays = (int) perform_query($sql, 'GETCOL');
    if ($numberofdays != 0){
        $sql = "SELECT `date`, count(userid) as present
            from attendance
            where userid in (SELECT userid from student)
            and sectionid=:id
            group by `date`";

        $totalpresent = 0;
        $results = perform_query($sql, 'GETASSO', $bindparams);
        foreach ($results as $row){
            $totalpresent += (int) $row['present'];
        }

        $avgAttendance = ($totalpresent/($classSize*$numberofdays))*100;
        echo json_encode(array("avgAttendance"=>$avgAttendance."%"));
    }
    else {
        echo json_encode(array("avgAttendance"=>"N/A"));
    }

}
function deleteSection($id) {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $option = json_decode($body);
    $bindparams = array("id"=>$id);
    $sql = ($option->purge == 1)? "DELETE from section where sectionid=:id" : "UPDATE section set status='inactive' where sectionid=:id";
    echo json_encode(perform_query($sql,'', $bindparams));
}
function getStudentGradeForSection($id, $userid){
    $grade = getStudentSectionGrade($id, $userid);
    if ($grade==-1){
        echo json_encode(array("studentGrade"=>"N/A"));
    }
    else {
        echo json_encode(array("studentGrade"=>$grade."%"));
    }
}
/*wrapper for getStudentGradeForSection*/
function getStudentSectionGrade($sectionid, $userid){
    $sql = "SELECT coalesce(sum(fullmark),0) from document where sectionid=:sectiond and fullmark is not null";
    $bindparams = array("sectionid"=>$sectionid);
    $totalmarks =  (int) perform_query($sql,'GETCOL',$bindparams);

    if ($totalmarks==0) {
        return -1;
    }
    $sql = "SELECT coalesce(sum(mark),0) from marks
            where assignmentid in
                (SELECT docid from document where sectionid=:sectionid and fullmark is not null)
            and userid=:userid";
    $bindparams["userid"]=$userid;
    $attainedmarks = (int) perform_query($sql,'GETCOL',$bindparams);
    return ($attainedmarks/$totalmarks)*100;
}


#================================================================================================================#
# Documents
#================================================================================================================#
function getDocuments(){
    $schoolyear = $_GET['schoolyearid'];
    $sectionid = $_GET['sectionid'];
    $courseid = $_GET['courseid'];
    if (isset($schoolyearid)) {
        return getDocumentsBySchoolYear($schoolyearid);
    }
    if (isset($sectionid)) {
        return getDocumentsBySection($sectionid);
    }
    if (isset($courseid)) {
        return getDocumentsByCourse($courseid);
    }
    $sql = "SELECT * from document order by lastAccessed desc";
    echo json_encode(perform_query($sql, 'GETALL'));
}

function getDocumentById($id){
    $sql = "SELECT * from document where docid=:id";
    echo json_encode(perform_query($sql,'GET', array("id"=>$id)));
}

function getDocumentsBySchoolYear($schoolyearid){
     $sql = "SELECT * from document where schoolyearid=:schoolyearid order by lastAccessed desc";
     echo json_encode(perform_query($sql,'GETALL', array("schoolyearid"=>$schoolyearid)));
}

function getDocumentsBySection($sectionid){
    $sql = "SELECT * from document where sectionid=:sectionid order by lastAccessed desc";
    echo json_encode(perform_query($sql,'GETALL', array("sectionid"=>$sectionid)));
}

function getDocumentsByCourse($courseid){
    $sql = "SELECT * from document where sectionid in (SELECT s.sectionid from section where s.courseid=:courseid)
            order by lastAccessed desc";
    echo json_encode(perform_query($sql,'GETALL', array("courseid"=>$courseid)));
}

function updateDocument($id){
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $doc = json_decode($body);

    $sql = "UPDATE document set
    docName=:docName, description=:description, link=:link, sectionid=:sectionid,
    userid=:userid, fullmark=:fullmark, schoolyearid=:schoolyearid, status=:status  WHERE docid=:docid";

    $bindparams = array(
        "docid" => $id,
        "docName" => $doc->docName,
        "description" => $doc->description,
        "link" => $docdoc->link,
        "sectionid" => $doc->sectionid,
        "userid" => $doc->userid,
        "fullmark" => $doc->fullmark,
        "schoolyearid" => $doc->schoolyearid,
        "status" => $doc->status
    );
    echo json_encode(perform_query($sql,'PUT',$bindparams));
}

function createDocument(){
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $doc = json_decode($body);

    $sql = "SELECT docid from document where docid=:docid";
    $docid = generateUniqueID($sql, "docid");

    $sql = "INSERT into section (docid, docName, description, link, sectionid, userid, fullmark, schoolyearid, status)
            values (:docid, :docName, :description, :link, :sectionid, :userid, fullmark, :schoolyearid, :status)";

    $bindparams = array(
        "docid" => $docid,
        "docName" => $doc->docName,
        "description" => $doc->description,
        "link" => $docdoc->link,
        "sectionid" => $doc->sectionid,
        "userid" => $doc->userid,
        "fullmark" => $doc->fullmark,
        "schoolyearid" => $doc->schoolyearid,
        "status" => $doc->status
    );
    echo json_encode(perform_query($sql,'POST',$bindparams));
}

function deleteDocument($id) {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $option = json_decode($body);
    $bindparams = array("id"=>$id);
    $sql = ($option->purge == 1)? "DELETE from document where docid=:id" : "UPDATE document set status='inactive' where docid=:id";
    echo json_encode(perform_query($sql,'', $bindparams));
}

function inputMarks($id){
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $students = json_decode($body);
    $schoolyearid = $_POST["schoolyearid"];

    $bindparams = array(
        "assignmentid" => $id,
        "schoolyearid" => $schoolyearid,
        "status" => 'active'
    );

    $sql = "INSERT INTO marks(assignmentid, userid, mark, schoolyearid, status) values ";
     foreach (array_values($students) as $i => $student) {
        $sql.= "(:assignmentid, :userid".$i.", :mark".$i.", :schoolyearid, :status),";
        $bindparams["userid".$i] = $student->userid;
        $bindparams["mark".$i] = $student->mark;
    }
    $sql = rtrim($sql, ",");
    echo json_encode(perform_query($sql,'POST',$bindparams));
}

function updateMarks($id){
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $results = json_decode($body);
    $queries = array();
    $bindparams = array();
    foreach (array_values($results) as $i => $result){
        $bindparams[$i] = array("assignmentid" => $id, "userid".$i=>$result->userid, "mark".$i=>$result->mark);
        $sql = "UPDATE marks set mark=:mark".$i." where userid=:userid".$i." and assignmentid=:assignmentid";
        array_push($queries, $sql);
    }
    echo json_encode(perform_transaction($sql, $bindparams));
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

// flag=1: return array
// flag=0: echo json
function getEnrolledSections($id, $flag=0){
    $sql = "SELECT s.sectionid, s.courseid, c.courseName, s.sectionCode, s.day, s.startTime, s.endTime, s.roomCapacity, s.roomLocation, s.classSize, s.schoolyearid, s.status
    FROM section s, course c
    WHERE s.sectionid in (SELECT e.sectionid from enrollment e where e.userid=:id)
    and s.courseid = c.courseid";
    if ($flag==1){
        return perform_query($sql,'GETASSO',array("id"=>$id));
    }
    echo json_encode(perform_query($sql, 'GETALL', array("id"=>$id)));
}

function getEnrolledTests($id){
    $sql = "SELECT c.courseid, c.courseName, c.description, c.deptid, d.deptName, c.schoolyearid, c.status, t.mark
    FROM course c, department d, studentCompetencyTest t
    WHERE t.userid = :id and c.courseid = t.courseid and c.deptid = d.deptid";
    echo json_encode(perform_query($sql, 'GETALL', array("id"=>$id)));
}

function getAllEnrolledTests(){
    $sql = "SELECT s.userid, s.firstName, s.lastName, s.status, s.emailAddr, c.courseid, c.courseName, c.description, c.deptid, d.deptName, c.schoolyearid, c.status, t.mark
    FROM course c, department d, studentCompetencyTest t, student s
    WHERE t.userid = s.userid and c.courseid = t.courseid and c.deptid = d.deptid and s.status='pending-test'";
    echo json_encode(perform_query($sql, 'GETALL'));
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
        "userid" => $id,
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

    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $student = json_decode($body);
    echo $student->firstName;
    $userid = createNewUser($student->firstName, $student->$lastName, $student->emailAddr, 'S');

    echo "**********TEST**************";

    $sql = "INSERT into student (userid, firstName, lastName, dateOfBirth, gender, streetAddr1, streetAddr2, city,
    province, country, postalCode, phoneNumber, emailAddr, allergies, prevSchools, parentFirstName, parentLastName,
    parentPhoneNumber, parentEmailAddr, emergencyContactFirstName, emergencyContactLastName, emergencyContactRelation,
    emergencyContactPhoneNumber, schoolid, paid, status) values (:userid, :firstName, :lastName, :dateOfBirth, :gender, :streetAddr1, :streetAddr2, :city,
    :province, :country, :postalCode, :phoneNumber, :emailAddr, :allergies, :prevSchools, :parentFirstName, :parentLastName,
    :parentPhoneNumber, :parentEmailAddr, :emergencyContactFirstName, :emergencyContactLastName, :emergencyContactRelation,
    :emergencyContactPhoneNumber, :schoolid, :paid, :status)";


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
    echo json_encode(array("userid"=>$userid));
}

/*
 * mark student as inactive
 */
function deleteStudent($id) {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $option = json_decode($body);
    if ($option->purge == 1){
        return purgeUsers(array($id));
    }
    $sql = "UPDATE student set status='inactive' where userid=:id";
    echo json_encode(perform_query($sql,'', array("id"=>$id)));
}

function enrollStudentInSections($id){
    $schoolyearid = $_POST["schoolyearid"];
    $sectionids = json_decode($_POST["sectionids"]);

    $bindparams = array(
        "userid" => $id,
        "schoolyearid" => $schoolyearid,
        "status" => "active",
    );
    $sql = "INSERT INTO enrollment(userid, sectionid, schoolyearid, status) values ";
    foreach (array_values($sectionids) as $i => $sectionid) {
        $sql.= "(:userid, :sectionid".$i.", :schoolyearid, :status),";
        $bindparams["sectionid".$i] = $sectionid;
    }
    $sql = rtrim($sql, ",");

    echo json_encode(perform_query($sql,'POST',$bindparams));
}

function enrollStudentInTests($id){
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $courseids = json_decode($_POST["courseids"]);

    $bindparams = array("userid" => $id);
    $sql = "INSERT INTO studentCompetencyTest(userid, courseid) values ";
    foreach (array_values($courseids) as $i => $courseid) {
        $sql.= "(:userid, :courseid".$i."),";
        $bindparams["courseid".$i] = $courseid;
    }
    $sql = rtrim($sql, ",");

    echo json_encode(perform_query($sql,'POST',$bindparams));
}

function updateStudentTestScores($id){
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $results = json_decode($body);
    $queries = array();
    $bindparams = array();
    foreach (array_values($results) as $i => $result){
        $bindparams[$i] = array("userid" => $id, "courseid".$i=>$result->courseid, "mark".$i=>$result->mark);
        $sql = "UPDATE studentCompetencyTest set mark=:mark".$i." where userid=:userid and courseid=:courseid".$i;
        array_push($queries, $sql);
    }
    echo json_encode(perform_transaction($sql, $bindparams));
}

function handlePendingStudents(){
    $queries = array();
    $bindparams = array();
    if (isset($_POST['approvedList'])){
        $ids = json_decode($_POST['approvedList']);
        $sql = "UPDATE student set status='active' where userid in ";
        $ret = parenthesisList($ids);
        $sql.=$ret[0];
        array_push($queries, $sql);
        $bindparams[0] = $ret[1];

        $sql = "DELETE from studentCompetencyTest where userid in ";
        $sql.=$ret[0];
        array_push($queries, $sql);
        $bindparams[1] = $ret[1];
    }
    if (isset($_POST['deniedList'])){
        $ids = json_decode($_POST['deniedList']);
        $sql = "DELETE from login where userid in ";
        $ret = parenthesisList($ids);
        $sql.=$ret[0];
        array_push($queries, $sql);
        $bindparams[2] = $ret[1];
    }
    echo json_encode(perform_transaction($queries, $bindparams));
}

function getAvgGrade($id){
    $totalgrade = 0;
    $sections = getEnrolledSections($id, 1);
    $numsections = count($sections);
    if ($numsections == 0){
        echo json_encode(array("avgGrade"=>"N/A"));
        return;
    }
    foreach ($sections as $row){
        $totalgrade += getStudentSectionGrade((int) $row['sectionid']);
    }
    $grade = ($totalgrade/$numsections)*100;
    echo json_encode(array("avgGrade"=>$grade."%"));
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
    $userid = createNewUser($teacher->firstName, $teacher->lastName, $teacher->emailAddr, 'T');
    $sql = "INSERT into teacher (userid, schoolid, firstName, lastName, emailAddr, status, usertype)
                         values (:userid, :schoolid, :firstName, :lastName, :emailAddr, :status, :usertype)";

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
    echo json_encode(array("userid"=>$userid));
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
        "userid" => $id,
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
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $option = json_decode($body);
    if ($option->purge == 1){
        return purgeUsers(array($id));
    }
    $sql = "UPDATE teacher set status='inactive' where userid=:id";
    echo json_encode(perform_query($sql,'', array("id"=>$id)));
}
/*
* Get the sections the teacher teaches
*/
function getTeachingSections($id){
    $sql = "SELECT courseid, sectionid from teaching where userid=:id";
    echo json_encode(perform_query($sql,'GETALL', array("id"=>$id)));
}


function addCourseCompetencies($id){
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
     $results = json_decode($body);

    $bindparams = array("userid" => $id);
    $sql = "INSERT INTO teacherCourseCompetency(userid, deptid, level, status) values ";
    foreach (array_values($results) as $i => $result) {
        $sql.= "(:userid, :deptid".$i.", :level".$i.", 'active'),";
        $bindparams["deptid".$i] = $result->deptid;
        $bindparams["level".$i] = $result->level;
    }
    $sql = rtrim($sql, ",");
    echo json_encode(perform_query($sql,'POST',$bindparams));
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
    $userid = createNewUser($admin->firstName, $admin->lastName, $admin->emailAddr, 'A');
    $sql = "INSERT into teacher (userid, schoolid, firstName, lastName, emailAddr, status, usertype)
                         values (:userid, :schoolid, :firstName, :lastName, :emailAddr, :status, :usertype)";
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
    echo json_encode(array("userid"=>$userid));
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
    $userid = createNewUser($superuser->firstName, $superuser->lastName, $superuser->emailAddr,'SU');
    $sql = "INSERT into superuser (userid, firstName, lastName, emailAddr, status)
                         values (:userid, :firstName, :lastName, :emailAddr, :status)";
    $bindparams = array(
        "userid" => $userid,
        "firstName" => $superuser->firstName,
        "lastName" => $superuser->lastName,
        "emailAddr" => $superuser->emailAddr,
        "status" => $superuser->status,
    );
    echo json_encode(perform_query($sql,'POST',$bindparams));
    echo json_encode(array("userid"=>$userid));
}

function updateSuperuser($id) {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $superuser = json_decode($body);

    $sql = "UPDATE superuser
    set firstName=:firstName, lastName=:lastName, emailAddr=:emailAddr, status=:status
    WHERE userid=:userid";

    $bindparams = array(
        "userid" => $id,
        "firstName" => $superuser->firstName,
        "lastName" => $superuser->lastName,
        "emailAddr" => $superuser->emailAddr,
        "status" => $superuser->status,
    );
    echo json_encode(perform_query($sql,'',$bindparams));
}
function deleteSuperuser($id) {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $option = json_decode($body);
    if ($option->purge == 1){
        return purgeUsers(array($id));
    }
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
    else if ($type == "SU"){
        return getSuperUsers();
    }
}

function getUserById($id, $usertype){

    if ($usertype == "T"){
        return getTeacherById($id);
    }
    else if ($usertypeusertypeusertype == "S"){
        return getStudentById($id);
    }
    else if ($usertypeusertype == "A"){
        return getAdministratorById($id);
    }
    else if ($usertype == "SU"){
        return getSuperUserById($id);
    }
}

function getUserByEmailAddr($emailAddr){
    $usertypes = array("student", "teacher", "superuser");
    foreach($usertypes as $type){
        $sql = "SELECT userid from ".$type." where emailAddr=:emailAddr";
        $userid = perform_query($sql,'GETCOL', array("emailAddr"=>$emailAddr));
        if ($userid) { break; }
    }
    if($userid){
        $sql = "SELECT userid, username, usertype, lastLogin from login where userid=:userid";
        echo json_encode(perform_query($sql,'GET', array("userid"=>$userid)));
    }
    else {
        echo json_encode($userid);
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
        $dob = $_GET['dateOfBirth'];
        $email = $_GET['emailAddr'];
        if (isset($firstname)||isset($lastname)||isset($status)||isset($year)||isset($loweryear)||isset($dob)||isset($gender)||isset($paid)||isset($email)||isset($city)||isset($province)||isset($country)){
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
            if (isset($status)){ $param['status'] = $status; }
            if (isset($dob)){ $param['dateOfBirth'] = $dob; }
            if (isset($email)){ $param['emailAddr'] = $email; }

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
            $sql = "SELECT userid, schoolid, firstName, lastName, emailAddr, status from teacher ".$clause." and usertype=:usertype order by firstName asc";
            echo json_encode(perform_query($sql,'GETALL', array("usertype"=>$usertype)));
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

function createNewUser($firstname, $lastname, $emailAddr, $usertype){
    $sql = "INSERT into login (userid, username, password, usertype)
            VALUES (:userid, :username, :password, :usertype)";
    $userid="";
    $username="";
    $password="";
    list($userid, $username, $password) = generateLogin($firstname, $lastname);

    $passwordhash = generatePasswordHash($password);

    $bindparams=array("userid" => $userid,
                      "username"=> $username,
                      "password"=> $passwordhash,
                      "usertype" => $usertype);
    echo json_encode(perform_query($sql,'POST',$bindparams));
    //emailLogin($emailAddr, $username, $password, $firstname, $lastname);
    return $userid;
}

function getUserCount($usertype){
    $table=($usertype=='S')? "student" : (($usertype=="A"|$usertype=="T")? "teacher" : "superuser");
    $status = $_GET['status'];
    $sql = "SELECT count(*) from ".$table;
    $bindparams = array();
    if (isset($status)){
        $sql.=" where status=:status";
        $bindparams["status"] = $status;
    }
    if ($usertype=="T"|$usertype=="A"){
        $sql.= (isset($status)? " and ": " where ");
        $sql.= "usertype=:usertype";
        $bindparams["usertype"] = $usertype;
    }
    echo json_encode(perform_query($sql, 'GETCOL', $bindparams));
}

#================================================================================================================#
# Notifications
#================================================================================================================#
//find the teachers who have not inputted attendance in the last X days
function getTeachersWithMissingInputAttendance(){
    $numdays = $_GET['numdays'];
    $today = $_GET['today'];
    $schoolyearid = $_GET['schoolyearid'];
    $sql = "SELECT t.userid, t.firstName, t.lastName, t.emailAddr, a.maxdate, a.sectionid
            from teacher t,
                    (select userid, max(`date`) as maxdate, sectionid from attendance
                        where datediff(:today, `date`) >= :numdays and schoolyearid=:schoolyearid group by userid) a
            where t.userid = a.userid";
    $bindparams = array(
        "today"  => $today,
        "numdays" => $numdays,
        "schoolyearid" => $schoolyearid
    );
    echo json_encode(perform_query($sql,'GETALL', $bindparams));
}

#================================================================================================================#
# Purge
#================================================================================================================#
function purge($ids, $sql){
    $ret = parenthesisList($ids);
    $sql.=$ret[0];
    echo json_encode(perform_query($sql,'',$ret[1]));
}
function purgeAttendance(){
    if (isset($_POST['schoolyearids'])||isset($POST_['userids'])) {
        if (isset($_POST['schoolyearids'])){
            $ids = json_decode($_POST['schoolyearids']);
            $sql = "DELETE from attendance where schoolyearid in ";
        }
        else if (isset($_POST['userids'])){
            $ids = json_decode($_POST['userids']);
            $sql = "DELETE from attendance where userid in ";
        }
        return purge($ids, $sql);
    }
    else {
        $sql = "truncate attendance";
        echo json_encode(perform_query($sql,''));
    }
}
function purgeWaitlist(){
    if (isset($_POST['waitlistids'])){
        $ids = json_decode($_POST['waitlistids']);
        $sql = "DELETE from waitlisted where waitlistid in ";
        return purge($ids, $sql);
    }
    else {
        $sql = "truncate waitlisted";
        echo json_encode(perform_query($sql,''));
    }
}
function purgeUsers($ids=array()){
    if (!array_filter($ids)){
        $ids = json_decode($_POST['userids']);
    }
    $sql = "DELETE from login where userid in ";
    return purge($ids, $sql);
}

function purgeSchools($ids=array()){
    if (!array_filter($ids)){
        $ids = json_decode($_POST['schoolids']);
    }
    $sql = "DELETE from school where schoolid in ";
    return purge($ids, $sql);
}
function purgeSchoolYears($ids=array()){
    if (!array_filter($ids)){
        $ids = json_decode($_POST['schoolyearids']);
    }
    $sql = "DELETE from schoolyear where schoolyearid in ";
    return purge($ids, $sql);
}
function purgeDepartments($ids=array()){
    if (!array_filter($ids)){
        $ids = json_decode($_POST['docids']);
    }
    $sql = "DELETE from department where deptid in ";
    return purge($ids, $sql);
}
function purgeCourses($ids=array()){
    if (!array_filter($ids)){
        $ids = json_decode($_POST['courseids']);
    }
    $sql = "DELETE from course where courseid in ";
    return purge($ids, $sql);
}
function purgeSections($ids=array()){
    if (!array_filter($ids)){
        $ids = json_decode($_POST['sectionids']);
    }
    $sql = "DELETE from section where sectionid in ";
    return purge($ids, $sql);
}
function purgeDocuments($ids=array()){
    if (!array_filter($ids)){
        $ids = json_decode($_POST['docid']);
    }
    $sql = "DELETE from document where docid in ";
    return purge($ids, $sql);
}
function purgeInactive(){
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $option = json_decode($body);
    $queries = array();
    $bindparams = array();
    if ($option->schoolyear == 1){
        $sql = "DELETE from schoolyear where status='inactive'";
        array_push($queries, $sql);
    }
    if ($option->school == 1) {
        $sql = "DELETE from school where status='inactive'";
        array_push($queries, $sql);
    }
    else {
        if ($option->dept == 1) {
            $sql = "DELETE from department where status='inactive'";
            array_push($queries, $sql);
        }
        if ($option->course == 1) {
            $sql = "DELETE from course where status='inactive'";
            array_push($queries, $sql);
        }
        if ($option->section == 1) {
            $sql = "DELETE from document where status='inactive'";
            array_push($queries, $sql);
        }
        if ($option->doc == 1) {
            $sql = "DELETE from document where status='inactive'";
            array_push($queries, $sql);
        }
    }

    if ($option->years != 0){
        foreach($queries as $query){
            $query.= " and timestampdiff(year, lastAccessed, CURRENT_TIMESTAMP) >=".$option->year;
        }
    }

    if ($option->student == 1) {
        $sql = "DELETE from student s , login l where s.status='inactive' and l.userid=s.userid";
        if ($option->years != 0){
            $query.= " and timestampdiff(year, s.lastAccessed, CURRENT_TIMESTAMP) >=".$option->year;
        }
        array_push($queries, $sql);
    }
    if ($option->teacher == 1) {
        $sql = "DELETE from teacher t , login l where t.status='inactive' and t.usertype='T' and l.userid=t.userid";
        if ($option->years != 0){
            $query.= " and timestampdiff(year, t.lastAccessed, CURRENT_TIMESTAMP) >=".$option->year;
        }
        array_push($queries, $sql);
    }
    if ($option->admin == 1) {
        $sql = "DELETE from teacher t , login l where t.status='inactive' and t.usertype='A' and l.userid=t.userid";
        if ($option->years != 0){
            $query.= " and timestampdiff(year, t.lastAccessed, CURRENT_TIMESTAMP) >=".$option->year;
        }
        array_push($queries, $sql);
    }
    echo json_encode(perform_transaction($queries));
}