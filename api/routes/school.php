<?php
require_once '../helpers/general.php';

class School {
    public function __construct($app) {
        $this->app = $app;
    }

    public function createRoutes() {
        $this->app->get('/schoolyears', array($this, 'getSchoolYears'));
        $this->app->get('/schoolyears', array($this, 'getSchoolYears'));
        $this->app->get('/schoolyears/active', array($this, 'getActiveSchoolYear'));
        $this->app->post('/schoolyears', array($this, 'createSchoolYear'));
        $this->app->put('/schoolyears/active/:id', array($this, 'updateActiveSchoolYear'));
        $this->app->put('/schoolyears/reg/:id', array($this, 'updateOpenRegistration'));
        $this->app->delete('/schoolyears/:id', array($this, 'deleteSchoolYear'));

        $this->app->get('/schools', array($this, 'getSchools'));
        $this->app->get('/schools/:id', array($this, 'getSchoolById'));
        $this->app->get('/schools/:id/students', array($this, 'getStudentsBySchool'));
        $this->app->get('/schools/:id/teachers', array($this, 'getTeachersBySchool'));
        $this->app->get('/schools/:id/administrators', array($this, 'getAdministratorsBySchool'));
        $this->app->get('/schools/:id/departments', array($this, 'getDepartments'));
        $this->app->get('/schools/:id/departments/count', array($this, 'getDepartmentCount'));
        $this->app->post('/schools', array($this, 'createSchool'));
        $this->app->put('/schools/:id', array($this, 'updateSchool'));
        $this->app->delete('/schools/:id', array($this, 'deleteSchool'));

        $this->app->get('/departments/:id', array($this, 'getDepartmentById'));
        $this->app->get('/departments/:id/courses', array($this, 'getCourses'));
        $this->app->get('/departments/:id/courses/count', array($this, 'getCourseCount'));
        $this->app->post('/departments', array($this, 'createDepartment'));
        $this->app->put('/departments/:id', array($this, 'updateDepartment'));
        $this->app->delete('/departments/:id', array($this, 'deleteDepartment'));

        $this->app->get('/courses/:id', array($this, 'getCourseById'));
        $this->app->get('/courses/:id/prereqs', array($this, 'getCoursePrereqs');
        $this->app->get('/courses/:id/waitlist', array($this, 'getWaitlistedStudents'));
        $this->app->get('/courses/:id/teachers', array($this, 'getCourseTeachers'));
        $this->app->post('/courses/:id/prereqs', array($this, 'addCoursePrereqs'));
        $this->app->post('/courses/:id/teachers/:tid', array($this, 'assignCourseTeacher'));
        $this->app->post('/courses/:id', array($this, 'waitlistStudent'));
        $this->app->post('/courses', array($this, 'createCourse'));
        $this->app->put('/courses/:id', array($this, 'updateCourse'));
        $this->app->delete('/courses/:id/prereqs/:preq', array($this, 'deleteCoursePrereq'));
        $this->app->delete('/courses/:id', array($this, 'deleteCourse'));
        $this->app->delete('/courses/:id/teachers/:tid', array($this, 'unassignCourseTeacher'));

        $this->app->get('/sections', array($this, 'getSections'));
        $this->app->get('/sections/count', array($this, 'getSectionCount'));
        $this->app->get('/sections/:id', array($this, 'getSectionById'));
        $this->app->get('/sections/:id/students/:userid', array($this, 'getStudentGradeForSection'));
        $this->app->get('/sections/:id/students', array($this, 'getStudentsEnrolled'));
        $this->app->get('/sections/:id/count', array($this, 'getStudentCount'));
        $this->app->get('/sections/:id/teachers', array($this, 'getSectionTeachers'));
        $this->app->get('/sections/:id/attendance', array($this, 'getSectionAttendance'));
        $this->app->get('/sections/:id/dates', array($this, 'getSectionDates'));
        $this->app->post('/sections/:id/teachers/:tid', array($this, 'assignSectionTeacher'));
        $this->app->post('/sections', array($this, 'createSection'));
        $this->app->post('/sections/students/:id/:sid', array($this, 'enrollStudent'));
        $this->app->post('/sections/:id/attendance', array($this, 'inputAttendance'));
        $this->app->put('/sections/:id', array($this, 'updateSection'));
        $this->app->delete('/sections/students/:id/:sid', array($this, 'dropStudent'));
        $this->app->delete('/sections/:id', array($this, 'deleteSection'));
        $this->app->delete('/sections/:id/teachers/:tid', array($this, 'unassignSectionTeacher'));

        $this->app->get('/documents', array($this, 'getDocuments'));
        $this->app->get('/documents/:id', array($this, 'getDocumentById'));
        $this->app->post('/documents', array($this, 'createDocument'));
        $this->app->get('/documents/:id/marks', array($this, 'getMarks'));
        $this->app->post('/documents/:id/marks', array($this, 'handleMarks'));
        $this->app->put('/documents/:id', array($this, 'updateDocument'));
        $this->app->delete('/documents/:id', array($this, 'deleteDocument'));
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
        $queries = array();
        $combinedbindparams = array();
        $resp = array();

        $request = \Slim\Slim::getInstance()->request();
        $body = $request->getBody();
        $schoolyear = json_decode($body);

        $sql = "SELECT schoolyearid from schoolyear where schoolyearid=:schoolyearid";
        $schoolyearid = generateUniqueID($sql, "schoolyearid");

        $sql = "INSERT into schoolyear (schoolyearid, schoolyear, status, openForReg)
        values (:schoolyearid, :schoolyear, :status, :openForReg)";
        $bindparams = array("schoolyearid"=>$schoolyearid, "schoolyear"=>$schoolyear->schoolyear, "status"=>$schoolyear->status, "openForReg"=>$schoolyear->openForReg);
        array_push($queries, $sql);
        array_push($combinedbindparams, $bindparams);

        if ($schoolyear->data->duplicate == 1){
            $current_schoolyear = $schoolyear->data->currentSchoolYear;

        // create a row for each department
            $sql = "SELECT count(*) from department where schoolyearid=:activeschoolyear";
            $rowcount = (int) perform_query($sql, 'GETCOL', array("activeschoolyear"=>$current_schoolyear));

            $idsql = "SELECT deptid from department where deptid=:deptid";
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
                array_push($queries, $sql);
                array_push($combinedbindparams, $bindparams);
            }

        //create row for each course
            $bindparams = array(
                "schoolyearid" => $schoolyearid,
                "activeschoolyear" => $current_schoolyear,
                "status" => $schoolyear->status
                );
            $sql = "SELECT count(*) from course where schoolyearid=:activeschoolyear";
            $rowcount = (int) perform_query($sql, 'GETCOL', array("activeschoolyear"=>$current_schoolyear));
            $idsql = "SELECT courseid from course where courseid=:courseid";

            $sql = "INSERT into course (courseid, courseName, description, deptid, schoolyearid, status)
            SELECT :courseid, courseName, description, deptid, :schoolyearid, :status FROM course where schoolyearid=:activeschoolyear
            AND (courseName not in (SELECT courseName from course where schoolyearid=:schoolyearid)) LIMIT 1";

            for ($i=0 ; $i<$rowcount; $i++){
                $id = generateUniqueID($idsql, "courseid");
                $bindparams["courseid"] = $id;
                array_push($queries, $sql);
                array_push($combinedbindparams, $bindparams);
            }

        //create row for each section
            $bindparams = array(
                "schoolyearid" => $schoolyearid,
                "activeschoolyear" => $current_schoolyear,
                "status" => $schoolyear->status
                );
            $sql = "SELECT count(*) from section where schoolyearid=:activeschoolyear";
            $rowcount = (int) perform_query($sql, 'GETCOL', array("activeschoolyear"=>$current_schoolyear));
            $idsql = "SELECT sectionid from section where sectionid=:sectionid";

            $sql = "INSERT into section (sectionid, courseid, sectionCode, day, startTime, endTime, roomCapacity, roomLocation, classSize, schoolyearid, status)
            SELECT :sectionid, courseid, sectionCode, day, startTime, endTime, roomCapacity, roomLocation, classSize, :schoolyearid, :status FROM section where schoolyearid=:activeschoolyear
            AND (sectionCode not in (SELECT sectionCode from section where schoolyearid=:schoolyearid)) LIMIT 1";

            for ($i=0 ; $i<$rowcount; $i++){
                $id = generateUniqueID($idsql, "sectionid");
                $bindparams["sectionid"] = $id;
                array_push($queries, $sql);
                array_push($combinedbindparams, $bindparams);
            }
        }
        echo json_encode(perform_transaction($queries, $combinedbindparams));
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
    function getStudentsBySchool($id){
        $sql = "SELECT userid, firstName, lastName, dateOfBirth, gender, streetAddr1, streetAddr2, city,
        province, country, postalCode, phoneNumber, emailAddr, allergies, prevSchools, parentFirstName, parentLastName,
        parentPhoneNumber, parentEmailAddr, emergencyContactFirstName, emergencyContactLastName, emergencyContactRelation,
        emergencyContactPhoneNumber, schoolid, paid, status
        from student where schoolid=:schoolid";
        echo json_encode(perform_query($sql, 'GETALL', array("schoolid"=>$id)));
    }
    function getTeachersBySchool($id){
        $sql = $sql = "SELECT userid, schoolid, firstName, lastName, emailAddr, status, usertype from teacher where usertype='T' and schoolid=:schoolid" ;
        echo json_encode(perform_query($sql, 'GETALL', array("schoolid"=>$id)));
    }
    function getAdministratorsBySchool($id){
        $sql = $sql = "SELECT userid, schoolid, firstName, lastName, emailAddr, status, usertype from teacher where usertype='A' and schoolid=:schoolid" ;
        echo json_encode(perform_query($sql, 'GETALL', array("schoolid"=>$id)));
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
        FROM teacher t1, teachingCourse t2
        where t2.courseid = :id
        and t2.userid = t1.userid";
        echo json_encode(perform_query($sql, 'GETALL', array("id"=>$id)));
    }
    function getCoursePrereqs($id){
        $sql = "SELECT c.courseid, c.courseName, c.description from prereqs p, course c
        where p.courseid=:id and p.prereq=c.courseid";
        echo json_encode(perform_query($sql, 'GETALL', array("id"=>$id)));
    }
    function assignCourseTeacher($id, $tid){
     $sql = "INSERT into teachingCourse (userid, courseid) values (:tid, :id)";
     echo json_encode(perform_query($sql,'POST',array("tid"=>$tid, "id"=>$id)));
 }
 function unassignCourseTeacher($id, $tid){
    $sql = "DELETE from teachingCourse where userid=:tid and courseid=:id";
    echo json_encode(perform_query($sql,'',array("tid"=>$tid, "id"=>$id)));
}
function waitlistStudent($id){
    $studentid = $_POST["userid"];
    $sql = "INSERT into waitlisted (userid, waitlistid) values (:userid, :id)";
    $bindparams = array("userid"=>$studentid, "id"=>$id);
    echo json_encode(perform_query($sql,'POST',array("userid"=>$studentid, "id"=>$id)));
}
function getWaitlistedStudents($id){
    $sql = "SELECT s.userid, s.firstName, s.lastName from waitlisted w, student s where w.waitlistid=:waitlistid and w.userid=s.userid";
    echo json_encode(perform_query($sql,'GETALL',array("waitlistid"=>$id)));
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

    $resp = perform_query($sql,'POST',$bindparams);
    if ($resp["status"] == "success"){
        $resp["courseid"] = $courseid;
    }
    echo json_encode($resp);
}

function addCoursePrereqs($id){
    $prereqs = json_decode($_POST["prereqs"]);
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
    $sql = "SELECT s.sectionid, s.courseid, d1.deptName, c1.courseName, s.sectionCode, s.day, s.startTime, s.endTime, s.roomCapacity, s.roomLocation, s.classSize, s.status
    from section s, course c1, department d1
    where s.courseid in (select c.courseid from course c
        where c.deptid in (select d.deptid from department d where d.schoolid=:schoolid and d.schoolyearid=:schoolyear)
        and c.schoolyearid=:schoolyear)
and s.schoolyearid=:schoolyear
and s.courseid = c1.courseid
and c1.deptid = d1.deptid
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
function getStudentCount($id, $flag=0){
    $sql = "SELECT studentCount
    FROM (SELECT sectionid, count(userid) as studentCount from enrollment group by sectionid) s
    where s.sectionid = :id";
    $count = perform_query($sql, 'GETCOL', array("id"=>$id));
    if ($flag == 1) {
        return $count;
    }
    echo json_encode($count);
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
    where t1.userid in (SELECT t2.userid from teachingSection t2 where t2.sectionid=:id)";
    echo json_encode(perform_query($sql, 'GETALL', array("id"=>$id)));
}
function dropStudent($id, $sid){
    $sql = "DELETE from enrollment where sectionid=:id and userid=:sid";
    echo json_encode(perform_query($sql,'', array("id"=>$id, "sid"=>$sid)));
}
function enrollStudent($id, $sid){
    $status = $_POST['status'];
    $schoolyearid = $_POST['schoolyearid'];
    $courseid = $_POST['courseid'];

    $queries = array();
    $bindparams = array();

    $sql = "INSERT into enrollment (userid, sectionid, schoolyearid, status)
    values (:userid, :sectionid, :schoolyearid, :status )";
    array_push($bindparams, array(
        "userid" => $sid,
        "sectionid" => $id,
        "schoolyearid" => $schoolyearid,
        "status" => "active",
        ));
    array_push($queries, $sql);

    if (isset($courseid)){
        array_push($queries, "DELETE from waitlisted where userid=:userid and waitlistid=:courseid");
        array_push($bindparams, array("userid"=>$sid, "courseid"=>$courseid));
    }
    echo json_encode(perform_transaction($queries,$bindparams));
}
function assignSectionTeacher($id, $tid){
    $sql = "INSERT into teachingSection values (:tid, :id)";
    echo json_encode(perform_query($sql,'POST',array("tid"=>$tid, "id"=>$id)));
}
function unassignSectionTeacher($id, $tid){
    $sql = "DELETE from teachingSection where userid=:tid and sectionid=:id";
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

    $resp = perform_query($sql,'POST',$bindparams);
    if ($resp["status"] == "success"){
        $resp["sectionid"] = $sectionid;
    }
    echo json_encode($resp);

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
        "schoolyearid" => $course->schoolyearid,
        "status" => $course->status
        );
    echo json_encode(perform_query($sql,'',$bindparams));
}

/*
To input/update attendance records
@param:
  route param: section id
  request param:
    - date
    - schoolid
    - schoolyearid
    - status
    - list of userids(users who are present)
@return: json encoded status array
*/
function inputAttendance($id){
    $date = $_POST["date"];
    $schoolyearid = $_POST["schoolyearid"];
    $schoolid = $_POST["schoolid"];
    $status = $_POST["status"];

    $userids = json_decode($_POST["userids"]);
    $bindparams = array();
    $queries = array();

    $params = array("classdate"=>$date, "sectionid"=>$id);

    // 1. Clear attendance records for section @ date first
    array_push($queries, "DELETE from attendance where sectionid=:sectionid and `date`=:classdate");
    array_push($bindparams, $params);

    // 2. Insert new attendance records
    $params = $params + array("schoolid" => $schoolid, "schoolyearid" => $schoolyearid, "status" => $status);
    $sql = "INSERT INTO attendance (`date`, `userid`, `sectionid`, `schoolyearid`, `schoolid`, `status`) values ";
    foreach (array_values($userids) as $i => $userid) {
        $sql.= "(:classdate, :userid".$i.", :sectionid, :schoolyearid, :schoolid, :status),";
        $params["userid".$i] = $userid;
    }
    $sql = rtrim($sql, ",");
    array_push($queries, $sql);
    array_push($bindparams, $params);

    $resp = perform_transaction($queries, $bindparams);
    if ($resp["status"]=="success"){
        $resp["userids"] = $userids;
    }
    echo json_encode($resp);
}

function getSectionAttendance($id){
    $classdate = $_GET["date"];
    $sql = "SELECT temp.userid, temp.firstName, temp.lastName, temp.T as usertype  from
    ((SELECT t.userid, t.firstName, t.lastName, 'T'
        from attendance a, teacher t
        where a.sectionid=:sectionid and a.date=:classdate and a.userid=t.userid)
UNION
(SELECT s.userid, s.firstName, s.lastName, 'S'
    from attendance a, student s
    where a.sectionid=:sectionid and a.date=:classdate and a.userid=s.userid)) temp";
echo json_encode(perform_query($sql, 'GETALL', array("sectionid"=>$id, "classdate"=>$classdate)));
}
function getSectionDates($id){
    $sql = "SELECT distinct `date` from attendance where sectionid=:id order by `date` asc";
    echo json_encode(perform_query($sql, 'GETALL', array("id"=>$id)));
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
    $sql = "SELECT coalesce(sum(fullmark),0) from document where sectionid=:sectionid and fullmark is not null and status='active'";
    $bindparams = array("sectionid"=>$sectionid);
    $totalmarks =  (int) perform_query($sql,'GETCOL',$bindparams);
    $sql = "SELECT count(docid) from document where sectionid=:sectionid and fullmark is not null and status='active'";
    $section_hasmark = (int) perform_query($sql,'GETCOL',$bindparams);
    if ($totalmarks==0 || $section_hasmark == 0) {
        return -1;
    }
    $sql = "SELECT coalesce(sum(mark),0) from marks
    where docid in
    (SELECT docid from document where sectionid=:sectionid and fullmark is not null and status='active')
    and userid=:userid";
    $bindparams["userid"]=$userid;
    $attainedmarks = (int) perform_query($sql,'GETCOL',$bindparams);
    return round(($attainedmarks/$totalmarks)*100,1);
}


#================================================================================================================#
# Documents
#================================================================================================================#
function getDocuments(){
    $schoolyear = $_GET['schoolyearid'];
    $sectionid = $_GET['sectionid'];
    $courseid = $_GET['courseid'];
    $status = $_GET['status'];
    if (!isset($status)){ $status = "active"; }

    if (isset($schoolyearid)) {
        return getDocumentsBySchoolYear($schoolyearid, $status);
    }
    if (isset($sectionid)) {
        return getDocumentsBySection($sectionid, $status);
    }
    if (isset($courseid)) {
        return getDocumentsByCourse($courseid, $status);
    }
    $sql = "SELECT * from document order by lastAccessed desc";
    echo json_encode(perform_query($sql, 'GETALL'));
}

function getDocumentById($id){
    $sql = "SELECT * from document where docid=:id";
    echo json_encode(perform_query($sql,'GET', array("id"=>$id)));
}

function getDocumentsBySchoolYear($schoolyearid, $status){
 $sql = "SELECT * from document where schoolyearid=:schoolyearid and status=:status order by lastAccessed desc";
 echo json_encode(perform_query($sql,'GETALL', array("schoolyearid"=>$schoolyearid, "status"=>$status)));
}

function getDocumentsBySection($sectionid, $status){
    $sql = "SELECT * from document where sectionid=:sectionid and status=:status order by lastAccessed desc";
    echo json_encode(perform_query($sql,'GETALL', array("sectionid"=>$sectionid, "status"=>$status)));
}

function getDocumentsByCourse($courseid, $status){
    $sql = "SELECT * from document where sectionid in (SELECT s.sectionid from section where s.courseid=:courseid)
    and status=:status order by lastAccessed desc";
    echo json_encode(perform_query($sql,'GETALL', array("courseid"=>$courseid, "status"=>$status)));
}

/*
 * Update a document record
 * @param:
 *   route param: docid
 *   request param:
 *    - all document model attributes
 * @return: json encoded status array
*/
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

/*
 * Create a document record
 * @param:
 *   route param: -
 *   request param:
 *    - all document model attributes except for docid
 * @return: json encoded status array
*/
function createDocument(){
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $doc = json_decode($body);

    $sql = "SELECT docid from document where docid=:docid";
    $docid = generateUniqueID($sql, "docid");

    $sql = "INSERT into document (docid, docName, description, link, sectionid, userid, fullmark, schoolyearid, status)
    values (:docid, :docName, :description, :link, :sectionid, :userid, :fullmark, :schoolyearid, :status)";

    $bindparams = array(
        "docid" => $docid,
        "docName" => $doc->docName,
        "description" => $doc->description,
        "link" => $doc->link,
        "sectionid" => $doc->sectionid,
        "userid" => $doc->userid,
        "fullmark" => $doc->fullmark,
        "schoolyearid" => $doc->schoolyearid,
        "status" => $doc->status
        );

    $resp = perform_query($sql,'POST',$bindparams);
    if ($resp["status"] == "success"){
        $resp["docid"] = $docid;
    }
    echo json_encode($resp);
}

/*
 * Delete a document record
 * @param:
 *   route param: section id
 *   request param:
 *    - purge(1 = hard delete, 0 = set inactive)
 * @return: json encoded status array
*/
function deleteDocument($id) {
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $option = json_decode($body);
    $bindparams = array();
    $params = array("id"=>$id);
    $queries = array();
    if ($option->purge == 1) {
        array_push($queries, "DELETE from document where docid=:id");
        array_push($bindparams, $params);
    }
    else {
        array_push($queries, "UPDATE document set status='inactive' where docid=:id");
        array_push($queries, "UPDATE marks set status='inactive' where docid=:id");
        array_push($bindparams, $params);
        array_push($bindparams, $params);
    }
    echo json_encode(perform_transaction($queries, $bindparams));
}

/*
 * Get marks for a particular document for a given schoolyear
 * @param:
 *  route param: docid
 *  request param:
 *    - schoolyearid
 * @return: json encoded array of (userid, mark)
*/
function getMarks($id) {
    $schoolyearid = $_GET["schoolyearid"];
    $sql = "SELECT `userid`, `mark` from marks where docid=:docid and schoolyearid=:schoolyearid";
    echo json_encode(perform_query($sql, 'GETALL', array("docid"=>$id, "schoolyearid"=>$schoolyearid)));
}

/*
 * Input or update marks for a document record
 * @param:
 *  route param: docid
 *   request param:
 *     - op: POST - input marks, PUT - update marks
 * @return: json encoded status array
*/
function handleMarks($id){
    $schoolyearid = $_POST["schoolyearid"];
    $students = json_decode($_POST["students"]);
    $op = $_POST["op"];

    if ($op == "POST"){ //inputMarks
        $bindparams = array(
            "docid" => $id,
            "schoolyearid" => $schoolyearid,
            "status" => 'active'
            );

        $sql = "INSERT INTO marks(docid, userid, mark, schoolyearid, status) values ";
        foreach (array_values($students) as $i => $student) {
            $sql.= "(:docid, :userid".$i.", :mark".$i.", :schoolyearid, :status),";
            $bindparams["userid".$i] = $student->userid;
            $bindparams["mark".$i] = $student->mark;
        }
        $sql = rtrim($sql, ",");
        echo json_encode(perform_query($sql,'POST',$bindparams));
    }
    else { // update marks
        $queries = array();
        $bindparams = array();
        foreach (array_values($students) as $i => $student){
            $bindparams[$i] = array("docid" => $id, "userid".$i=>$student->userid, "mark".$i=>$student->mark);
            $sql = "UPDATE marks set mark=:mark".$i." where userid=:userid".$i." and docid=:docid";
            array_push($queries, $sql);
        }
        echo json_encode(perform_transaction($queries, $bindparams));
    }
}
}