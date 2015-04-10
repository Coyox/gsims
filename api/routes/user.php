<?php
require_once '../helpers/general.php';
require_once '../helpers/email.php';

class User {
    public function __construct($app) {
        $this->app = $app;
    }
    public function createRoutes() {
        $this->app->get('/students', array($this,'getStudents'));
        $this->app->get('/students/:id', array($this,'getStudentById'));
        $this->app->get('/students/:id/sections', array($this,'getEnrolledSections'));
        $this->app->get('/students/:id/prevSections', array($this,'getPrevEnrolledSections'));
        $this->app->get('/students/:id/avgGrade', array($this,'getAvgGrade'));
        $this->app->get('/students/:id/attendance', array($this,'getStudentAttendance'));
        $this->app->post('/students', array($this,'createStudent'));
        $this->app->post('/students/:id/sections', array($this,'enrollStudentInSections'));
        $this->app->post('/students/:id/waitlists', array($this,'enrollStudentInWaitlists'));
        $this->app->post('/students/pending', array($this,'handlePendingStudents'));
        $this->app->post('/students/pendingTest', array($this,'handlePendingTestStudents'));
        $this->app->put('/students/:id', array($this,'updateStudent'));
        $this->app->delete('/students/:id', array($this,'deleteStudent'));

        $this->app->get('/teachers', array($this,'getTeachers'));
        $this->app->get('/teachers/:id', array($this,'getTeacherById'));
        $this->app->get('/teachers/:id/sections', array($this,'getTeachingSections'));
        $this->app->get('/teachers/:id/competency', array($this,'getCourseCompetencies'));
        $this->app->get('/teachers/:id/attendance', array($this,'getTeacherAttendance'));
        $this->app->post('/teachers/:id/competency', array($this,'updateCourseCompetencies'));
        $this->app->post('/teachers', array($this,'createTeacher'));
        $this->app->put('/teachers/:id', array($this,'updateTeacher'));
        $this->app->delete('/teachers/:id', array($this,'deleteTeacher'));

        $this->app->get('/administrators', array($this,'getAdministrators'));
        $this->app->get('/administrators/:id', array($this,'getAdministratorById'));
        $this->app->post('/administrators', array($this,'createAdministrator'));
        $this->app->delete('/administrators/:id', array($this,'deleteTeacher'));

        $this->app->get('/superusers', array($this,'getSuperusers'));
        $this->app->get('/superusers/:id', array($this,'getSuperuserById'));
        $this->app->post('/superusers', array($this,'createSuperuser'));
        $this->app->put('/superusers/:id', array($this,'updateSuperuser'));
        $this->app->delete('/superusers/:id', array($this,'deleteSuperuser'));

        $this->app->get('/users/:id/:usertype', array($this,'getUserById'));
        $this->app->get('/users/:emailAddr', array($this,'getUserByEmailAddr'));
    }

#================================================================================================================#
# Constants
#================================================================================================================#
define("pwchars","bcdefghijkmnpqrstvwxyzABCDEFGHIJKLMNPQRSTVWXYZ23456789@#$%^&*()+=");
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
 * Get enrolled sections
 * @param:
 *  - student id
 *  - flag: 1 - return array, 0 - echo json
 *  - status: "active" by default
@return: json encoded status array
*/
function getEnrolledSections($id, $flag=0, $status="active"){
    if (isset($_GET['status'])){
        $status = $_GET['status'];
    }
    $bindparams = array("id"=>$id, "status"=>$status);
    $sql = "SELECT s.sectionid, s.courseid, c.courseName, s.sectionCode, s.day, s.startTime, s.endTime, s.roomCapacity, s.roomLocation, s.classSize, s.schoolyearid, s.status
    FROM section s, course c
    WHERE s.sectionid in (SELECT e.sectionid from enrollment e where e.userid=:id and e.status=:status)
    and s.courseid = c.courseid";
    if ($flag==1){
        return perform_query($sql,'GETASSO',$bindparams);
    }
    echo json_encode(perform_query($sql, 'GETALL', $bindparams));
}

/*
 * Get a list of previously enrolled sections for a student
 * @param:
 *   route param: studentid
 *   request param: schoolyearid
 * @return: json encoded array
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
 * @param:
 *  route param: studentid
 *  request param: all student model attributes
 * @return: json encoded status array
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
 * Also sends an email with the student login information to the provided student email address
 * @param:
 *  request param: (optional) a list of 'students' for mass creating student records
 */
function createStudent() {
    if (isset($_POST['students'])){
        return massCreateStudents(json_decode($_POST['students']));
    }

    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $student = json_decode($body);

    $resp = array();
    $queries = array();
    $bindparams = array();

    list($logincreds, $loginsql, $loginbindparam) = createLogin($student->firstName, $student->lastName,'S');
    list($userid, $username, $password) = $logincreds;
    array_push($queries, $loginsql);
    $bindparams[0] = $loginbindparam;

    $sql = "INSERT into student (userid, firstName, lastName, dateOfBirth, gender, streetAddr1, streetAddr2, city,
        province, country, postalCode, phoneNumber, emailAddr, allergies, prevSchools, parentFirstName, parentLastName,
        parentPhoneNumber, parentEmailAddr, emergencyContactFirstName, emergencyContactLastName, emergencyContactRelation,
        emergencyContactPhoneNumber, schoolid, paid, status) values (:userid, :firstName, :lastName, :dateOfBirth, :gender, :streetAddr1, :streetAddr2, :city,
        :province, :country, :postalCode, :phoneNumber, :emailAddr, :allergies, :prevSchools, :parentFirstName, :parentLastName,
        :parentPhoneNumber, :parentEmailAddr, :emergencyContactFirstName, :emergencyContactLastName, :emergencyContactRelation,
        :emergencyContactPhoneNumber, :schoolid, :paid, :status)";

array_push($queries, $sql);
$bindparams[1] = array(
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

$transaction_result = perform_transaction($queries, $bindparams);
if ($transaction_result["status"] == "success"){
    $resp["userid"] = $userid;
    $transaction_result = $resp + $transaction_result;
    if ($student->status != "pending"){
        emailLogin($student->emailAddr, $username, $password, $student->firstName, $student->lastName);
    }
}
echo json_encode($transaction_result);
}

/*
 Mass create student records with generated login info
 Will send out email if transaction is successful
*/
 function massCreateStudents($students) {
    $resp = array();
    $queries = array();
    $bindparams = array();

    list($userids, $emailparams, $loginsql, $loginbindparams) = massCreateLogins($students, 'S');
    array_push($queries, $loginsql);
    $bindparams[0] = $loginbindparams;

    $sql = "INSERT into student (userid, firstName, lastName, dateOfBirth, gender, streetAddr1, streetAddr2, city,
        province, country, postalCode, phoneNumber, emailAddr, allergies, prevSchools, parentFirstName, parentLastName,
        parentPhoneNumber, parentEmailAddr, emergencyContactFirstName, emergencyContactLastName, emergencyContactRelation,
        emergencyContactPhoneNumber, schoolid, paid, status) values ";

$insertbindparams = array();
foreach (array_values($students) as $i => $student) {
    $sql.= "(:userid".$i.", :firstName".$i.", :lastName".$i.", :dateOfBirth".$i.", :gender".$i.", :streetAddr1".$i.", :streetAddr2".$i.", :city".$i.",
        :province".$i.", :country".$i.", :postalCode".$i.", :phoneNumber".$i.", :emailAddr".$i.", :allergies".$i.", :prevSchools".$i.", :parentFirstName".$i.", :parentLastName".$i.",
        :parentPhoneNumber".$i.", :parentEmailAddr".$i.", :emergencyContactFirstName".$i.", :emergencyContactLastName".$i.", :emergencyContactRelation".$i.",
        :emergencyContactPhoneNumber".$i.", :schoolid".$i.", :paid".$i.", :status".$i."),";

$insertbindparams["userid".$i] = $userids[$i];
$insertbindparams["firstName".$i] = $student->firstName;
$insertbindparams["lastName".$i] = $student->lastName;
$insertbindparams["dateOfBirth".$i] = $student->dateOfBirth;
$insertbindparams["gender".$i] = $student->gender;
$insertbindparams["streetAddr1".$i] = $student->streetAddr1;
$insertbindparams["streetAddr2".$i] = $student->streetAddr2;
$insertbindparams["city".$i] = $student->city;
$insertbindparams["province".$i] = $student->province;
$insertbindparams["country".$i] = $student->country;
$insertbindparams["postalCode".$i] = $student->postalCode;
$insertbindparams["phoneNumber".$i] = $student->phoneNumber;
$insertbindparams["emailAddr".$i] = $student->emailAddr;
$insertbindparams["allergies".$i] = $student->allergies;
$insertbindparams["prevSchools".$i] = $student->prevSchools;
$insertbindparams["parentFirstName".$i] = $student->parentFirstName;
$insertbindparams["parentLastName".$i] = $student->parentLastName;
$insertbindparams["parentPhoneNumber".$i] = $student->parentPhoneNumber;
$insertbindparams["parentEmailAddr".$i] = $student->parentEmailAddr;
$insertbindparams["parentEmailAddr".$i] = $student->parentEmailAddr;
$insertbindparams["emergencyContactFirstName".$i] = $student->emergencyContactFirstName;
$insertbindparams["emergencyContactLastName".$i] = $student->emergencyContactLastName;
$insertbindparams["emergencyContactRelation".$i] = $student->emergencyContactRelation;
$insertbindparams["emergencyContactPhoneNumber".$i] = $student->emergencyContactPhoneNumber;
$insertbindparams["schoolid".$i] = $student->schoolid;
$insertbindparams["paid".$i] = $student->paid;
$insertbindparams["status".$i] = $student->status;
}
$bindparams[1] = $insertbindparams;
$sql = rtrim($sql, ",");
array_push($queries, $sql);

$transaction_result = perform_transaction($queries, $bindparams);
if ($transaction_result["status"] == "success"){
    $resp["userids"] = json_encode($userids);
    $transaction_result = $resp + $transaction_result;
    foreach ($emailparams as $student) {
        if ($student->status != "pending"){
            emailLogin($student["emailAddr"], $student["username"], $student["password"], $student["firstName"], $student["lastName"]);
        }
    }
}
echo json_encode($transaction_result);
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
    $status = $_POST["status"];
    $sectionids = json_decode($_POST["sectionids"]);
    $bindparams = array();
    $queries = array();
    $param = array(
        "userid" => $id,
        "schoolyearid" => $schoolyearid,
        "status" => $status,
        );
    $sql = "INSERT INTO enrollment (userid, sectionid, schoolyearid, status) values ";
    foreach (array_values($sectionids) as $i => $sectionid) {
        $sql.= "(:userid, :sectionid".$i.", :schoolyearid, :status),";
        $param["sectionid".$i] = $sectionid;
    }
    $sql = rtrim($sql, ",");
    array_push($queries, $sql);
    array_push($bindparams, $param);

    if (isset($_POST["courseids"])){
        $courseids = json_decode($_POST["courseids"]);
        $sql = "DELETE from waitlisted where userid=:userid and waitlistid in ";
        list($sqlparens, $param) = parenthesisList($courseids);
        $sql.=$sqlparens;
        array_push($queries, $sql);
        array_push($bindparams, $param);
    }
    echo json_encode(perform_transaction($queries, $bindparams));
}


function enrollStudentInWaitlists($id){
    $courseids = json_decode($_POST["courseids"]);
    $bindparams = array("userid" => $id);
    $sql = "INSERT INTO waitlisted (userid, waitlistid) values ";
    foreach (array_values($courseids) as $i => $courseid) {
        $sql.= "(:userid, :waitlistid".$i."),";
        $bindparams["waitlistid".$i] = $courseid;
    }
    $sql = rtrim($sql, ",");
    echo json_encode(perform_query($sql,'POST',$bindparams));
}

/*
  Handing pending students who are either denied, approved, or signed up for tests
  Send out emails if status of student was previously pending
*/
  function handlePendingStudents(){
    $queries = array();
    $bindparams = array();
    $purgeList = array();
    $activeList = array();
    $sqlparens = "";
    $params = array();
    $students = json_decode($_POST['students']);

    foreach ($students as $student){
        if ($student->status == "denied"){
            array_push($purgeList, $student->userid);
        }
        else {
            $param = array("userid"=>$student->userid);
            if ($student->approvedList){
                $sql = "UPDATE enrollment set status='active' where userid=:userid and sectionid in ";
                list($sqlparens, $params) = parenthesisList($student->approvedList);
                $sql.=$sqlparens;
                $params += $param;
                array_push($bindparams, $params);
                array_push($queries, $sql);
                if ($student->status == "pending"){
                    array_push($activeList, $student->userid);
                }
            }
            if ($student->deniedList && $student->status == "pending"){
                $sql = "DELETE from enrollment where userid=:userid and sectionid in ";
                list($sqlparens, $params) = parenthesisList($student->deniedList);
                $sql.=$sqlparens;
                $params += $param;
                array_push($bindparams, $params);
                array_push($queries, $sql);
                array_push($activeList, $student->userid);
            }
            if ($student->testList){
                $params = $param;
                $sql = "UPDATE enrollment set status='pending-test' where userid=:userid and sectionid in ";
                list($sqlparens, $params) = parenthesisList($student->testList);
                $sql.=$sqlparens;
                $params += $param;
                array_push($bindparams, $params);
                array_push($queries, $sql);
                array_push($activeList, $student->userid);
            }
        }
    }
    if ($purgeList){
        $sql = "DELETE from login where userid in ";
        list($sqlparens, $params) = parenthesisList($purgeList);
        $sql.=$sqlparens;
        array_push($bindparams, $params);
        array_push($queries, $sql);
    }
    if ($activeList){
        $sql = "UPDATE student set status='active' where userid in ";
        list($sqlparens, $params) = parenthesisList($activeList);
        $sql.=$sqlparens;
        array_push($bindparams, $params);
        array_push($queries, $sql);
    }
    $transaction_result = perform_transaction($queries, $bindparams);

    /*************************************************************************/
    /* Send email with login creds to approved users */

    if ($transaction_result["status"] == "success" && $activeList){
        $sql = "SELECT userid, firstName, lastName, emailAddr from student where userid in ";
        $sql.=$sqlparens;
        $students = perform_query($sql,"GETASSO", $params);
        $emailparams = array();
        $queries = array();
        $bindparams = array();

        foreach($students as $user){
            // new creds
            $username = generateUsername($user["userid"], $user["firstName"], $user["lastName"]);
            $password = generatePassword();
            $passwordhash = generatePasswordHash($password);
            array_push($emailparams, array("emailAddr"=>$user["emailAddr"], "username"=>$username, "password"=>$password, "firstName"=>$user["firstName"], "lastName"=>$user["lastName"]));
            $sql = "UPDATE login set password=:password where userid=:userid";
            array_push($queries, $sql);
            array_push($bindparams, array("userid"=>$user["userid"], "password"=>$passwordhash));
        }
        $transaction_result = perform_transaction($queries, $bindparams);
        if ($transaction_result["status"] == "success"){
            massEmailLogin($emailparams);
        }
    }

    /*************************************************************************/


    echo json_encode($transaction_result);

}

/*
 Handle pending-test students who are either denied or approved
*/
 function handlePendingTestStudents(){
    $queries = array();
    $bindparams = array();
    $students = json_decode($_POST['students']);

    foreach ($students as $student){
        $param = array("userid"=>$student->userid);
        if ($student->deniedList){
            $sql = "DELETE from enrollment where userid=:userid and sectionid in ";
            list($sqlparens, $params) = parenthesisList($student->deniedList);
            $sql.=$sqlparens;
            $params += $param;
            array_push($bindparams, $params);
            array_push($queries, $sql);
        }
        if ($student->approvedList){
            $sql = "UPDATE enrollment set status='active' where userid=:userid and sectionid in ";
            list($sqlparens, $params) = parenthesisList($student->approvedList);
            $sql.=$sqlparens;
            $params += $param;
            array_push($bindparams, $params);
            array_push($queries, $sql);
        }
    }
    echo json_encode(perform_transaction($queries, $bindparams));
}

/*
Wrapper for getting a student's average grade
*/
function getAvgGrade($id, $flag=0){
    $totalgrade = 0;
    $sections = getEnrolledSections($id, 1);
    $numsections = count($sections);
    if ($numsections == 0){
        if ($flag==1){
            return -1;
        }
        else {
            echo json_encode(array("avgGrade"=>"N/A"));
            return;
        }
    }
    foreach ($sections as $row){
        $sectiongrade = getStudentSectionGrade($row['sectionid'], $id);
        if ($sectiongrade == -1){
            $numsections -= 1;
        }
        else {
            $totalgrade += $sectiongrade;
        }
    }
    $grade = ($totalgrade/$numsections);

    if ($flag==1){
        return $grade;
    }
    echo json_encode(array("avgGrade"=>$grade."%"));
}

/*
 Wrapper to get student attendance
*/
 function getStudentAttendance($id){
    $schoolyearid = $_GET["schoolyearid"];
    $month = $_GET["month"];
    if (isset($month)){
        echo json_encode(getAttendanceByMonth($id, $schoolyearid, $month));
    }
    else {
        echo json_encode(getAttendance($id, $schoolyearid));
    }
}
#================================================================================================================#
# Teachers
#================================================================================================================#
function getTeachers() {
    $sql = "SELECT userid, schoolid, firstName, lastName, emailAddr, status from teacher where usertype='T' order by firstName asc" ;
    echo json_encode(perform_query($sql, 'GETALL'));
}
function getTeacherById($id) {
    $sql = "SELECT userid, schoolid, firstName, lastName, emailAddr, status, usertype from teacher where usertype='T' and userid=:id";
    echo json_encode(perform_query($sql,'GET', array("id"=>$id)));
}

/*
 Create teacher record with generated login info
 Will send out email if transaction is successful
*/
 function createTeacher() {
    if (isset($_POST['teachers'])){
        return massCreateTeachers(json_decode($_POST['teachers']), 'T');
    }
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $teacher = json_decode($body);

    $resp = array();
    $queries = array();
    $bindparams = array();

    list($logincreds, $loginsql, $loginbindparam) = createLogin($teacher->firstName, $teacher->lastName,'T');
    list($userid, $username, $password) = $logincreds;
    array_push($queries, $loginsql);
    $bindparams[0] = $loginbindparam;

    $sql = "INSERT into teacher (userid, schoolid, firstName, lastName, emailAddr, status, usertype)
    values (:userid, :schoolid, :firstName, :lastName, :emailAddr, :status, :usertype)";
    array_push($queries, $sql);
    $bindparams[1] = array(
        "userid" => $userid,
        "schoolid" => $teacher->schoolid,
        "firstName" => $teacher->firstName,
        "lastName" => $teacher->lastName,
        "emailAddr" => $teacher->emailAddr,
        "status" => $teacher->status,
        "usertype" => 'T'
        );

    $transaction_result = perform_transaction($queries, $bindparams);
    if ($transaction_result["status"] == "success"){
        $resp["userid"] = $userid;
        $transaction_result = $resp + $transaction_result;
        emailLogin($teacher->emailAddr, $username, $password, $teacher->firstName, $teacher->lastName);
    }
    echo json_encode($transaction_result);
}

/*
 Mass create teacher records with generated login info
 Will send out email if transaction is successful
*/
 function massCreateTeachers($teachers, $usertype) {
    $resp = array();
    $queries = array();
    $bindparams = array();

    list($userids, $emailparams, $loginsql, $loginbindparams) = massCreateLogins($teachers, $usertype);
    array_push($queries, $loginsql);
    $bindparams[0] = $loginbindparams;

    $sql = "INSERT into teacher (userid, schoolid, firstName, lastName, emailAddr, status, usertype) values ";

    $insertbindparams = array();
    foreach (array_values($teachers) as $i => $teacher) {

        $sql.= "(:userid".$i.", :schoolid".$i.", :firstName".$i.", :lastName".$i.", :emailAddr".$i.", :status".$i.", :usertype".$i."),";
        $insertbindparams["userid".$i] = $userids[$i];
        $insertbindparams["firstName".$i] = $teacher->firstName;
        $insertbindparams["lastName".$i] = $teacher->lastName;
        $insertbindparams["emailAddr".$i] = $teacher->emailAddr;
        $insertbindparams["schoolid".$i] = $teacher->schoolid;
        $insertbindparams["status".$i] = $teacher->paid;
        $insertbindparams["usertype".$i] = $usertype;
    }
    $bindparams[1] = $insertbindparams;
    $sql = rtrim($sql, ",");
    array_push($queries, $sql);

    $transaction_result = perform_transaction($queries, $bindparams);
    if ($transaction_result["status"] == "success"){
        $resp["userids"] = json_encode($userids);
        $transaction_result = $resp + $transaction_result;
        massEmailLogin($emailparams);
    }
    echo json_encode($transaction_result);
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
    $sql = "SELECT c.courseid, c.courseName, c.description, s.sectionid, s.sectionCode, s.day, s.startTime, s.endTime, s.roomCapacity, s.roomLocation, s.classSize, s.schoolyearid
    from teachingSection t, course c, section s
    where t.userid=:id and t.sectionid=s.sectionid and c.courseid=s.courseid";
    echo json_encode(perform_query($sql,'GETALL', array("id"=>$id)));
}

function getCourseCompetencies($id) {
    $sql = "SELECT userid, deptid, level, status from teacherCourseCompetency where userid=:id";
    echo json_encode(perform_query($sql, 'GETALL', array("id"=>$id)));
}


function updateCourseCompetencies($id){
    $queries = array();
    $combinedbindparams = array();

    if (isset($_POST["insertComps"])){
        $list = json_decode($_POST["insertComps"]);
        $bindparams = array("userid" => $id);
        $sql = "INSERT INTO teacherCourseCompetency(userid, deptid, level, status) values ";
        foreach (array_values($list) as $i => $result) {
            $sql.= "(:userid, :deptid".$i.", :level".$i.", 'active'),";
            $bindparams["deptid".$i] = $result->deptid;
            $bindparams["level".$i] = $result->level;
        }
        $sql = rtrim($sql, ",");
        array_push($queries, $sql);
        array_push($combinedbindparams, $bindparams);
    }
    if (isset($_POST["deleteComps"])){
        $list = json_decode($_POST["deleteComps"]);
        $sql = "DELETE from teacherCourseCompetency where userid=:userid and deptid in  ";
        list($sqlparens, $bindparams) = parenthesisList($list);
        $bindparams["userid"]= $id;
        $sql.= $sqlparens;
        array_push($queries, $sql);
        array_push($combinedbindparams, $bindparams);
    }

    if (isset($_POST["updateComps"])){
        $list = json_decode($_POST["updateComps"]);
        foreach (array_values($list) as $i => $result){
            $sql = "UPDATE teacherCourseCompetency set level=:level".$i." where userid=:userid and deptid=:deptid".$i;
            array_push($queries, $sql);
            array_push($combinedbindparams, array("userid" =>$id, "deptid".$i=>$result->deptid, "level".$i=>$result->level));
        }
    }
    echo json_encode(perform_transaction($queries, $combinedbindparams));
}

function getTeacherAttendance($id){
    $schoolyearid = $_GET["schoolyearid"];
    $month = $_GET["month"];
    if (isset($month)){
        echo json_encode(getAttendanceByMonth($id, $schoolyearid, $month));
    }
    else {
        echo json_encode(getAttendance($id, $schoolyearid));
    }
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
    if (isset($_POST['administrators'])){
        return massCreateTeachers(json_decode($_POST['administrators']), 'A');
    }
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $teacher = json_decode($body);

    $resp = array();
    $queries = array();
    $bindparams = array();

    list($logincreds, $loginsql, $loginbindparam) = createLogin($teacher->firstName, $teacher->lastName,'A');
    list($userid, $username, $password) = $logincreds;
    array_push($queries, $loginsql);
    $bindparams[0] = $loginbindparam;

    $sql = "INSERT into teacher (userid, schoolid, firstName, lastName, emailAddr, status, usertype)
    values (:userid, :schoolid, :firstName, :lastName, :emailAddr, :status, :usertype)";
    array_push($queries, $sql);
    $bindparams[1] = array(
        "userid" => $userid,
        "schoolid" => $teacher->schoolid,
        "firstName" => $teacher->firstName,
        "lastName" => $teacher->lastName,
        "emailAddr" => $teacher->emailAddr,
        "status" => $teacher->status,
        "usertype" => 'A'
        );

    $transaction_result = perform_transaction($queries, $bindparams);
    if ($transaction_result["status"] == "success"){
        $resp["userid"] = $userid;
        $transaction_result = $resp + $transaction_result;
        emailLogin($teacher->emailAddr, $username, $password, $teacher->firstName, $teacher->lastName);
    }
    echo json_encode($transaction_result);
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
    $teacher = json_decode($body);

    $resp = array();
    $queries = array();
    $bindparams = array();

    list($logincreds, $loginsql, $loginbindparam) = createLogin($superuser->firstName, $superuser->lastName,'T');
    list($userid, $username, $password) = $logincreds;
    array_push($queries, $loginsql);
    $bindparams[0] = $loginbindparam;

    $sql = "INSERT into superuser (userid, firstName, lastName, emailAddr, status)
    values (:userid, :firstName, :lastName, :emailAddr, :status)";
    array_push($queries, $sql);
    $bindparams[1] = array(
        "userid" => $userid,
        "firstName" => $superuser->firstName,
        "lastName" => $superuser->lastName,
        "emailAddr" => $superuser->emailAddr,
        "status" => $superuser->status,
        );

    $transaction_result = perform_transaction($queries, $bindparams);
    if ($transaction_result["status"] == "success"){
        $resp["userid"] = $userid;
        $transaction_result = $resp + $transaction_result;
        emailLogin($superuser->emailAddr, $username, $password, $superuser->firstName, $superuser->lastName);
    }
    echo json_encode($transaction_result);
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
function getUsers($schoolid, $type){
    if ($type == "T"){
        return getTeachersBySchool($schoolid);
    }
    else if ($type == "S"){
        return getStudentsBySchool($schoolid);
    }
    else if ($type == "A"){
        return getAdministratorsBySchool($schoolid);
    }
    else if ($type == "SU"){
        return getSuperUsers();
    }
}

function getUserById($id, $usertype){

    if ($usertype == "T"){
        return getTeacherById($id);
    }
    else if ($usertype == "S"){
        return getStudentById($id);
    }
    else if ($usertype == "A"){
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

function getUserCount($usertype){
    $table=($usertype=='S')? "student" : (($usertype=="A"|$usertype=="T")? "teacher" : "superuser");
    $status = $_GET['status'];
    $schoolid = $_GET['schoolid'];
    $sql = "SELECT count(*) from ".$table;
    $bindparams = array();
    if (isset($status)){
        $sql.=" where status=:status";
        $bindparams["status"] = $status;
    }
    if (isset($schoolid) && $usertype!="SU"){
        $sql.= (isset($status)? " and ": " where ");
        $sql.= "schoolid=:schoolid";
        $bindparams["schoolid"] = $schoolid;
    }
    if ($usertype=="T"|$usertype=="A"){
        $sql.= (isset($status)||isset($schoolid)? " and ": " where ");
        $sql.= "usertype=:usertype";
        $bindparams["usertype"] = $usertype;
    }
    echo json_encode(perform_query($sql, 'GETCOL', $bindparams));
}


function getAttendance($id, $schoolyearid){
    $sql = "SELECT `sectionid`, `date` from attendance where userid=:userid and schoolyearid=:schoolyearid";
    return perform_query($sql, 'GETALL', array("userid"=>$id, "schoolyearid"=>$schoolyearid));
}

function getAttendanceByMonth($id, $schoolyearid, $month){
    $sql = "SELECT `sectionid`, `date` from attendance where userid=:userid and schoolyearid=:schoolyearid and month(`date`)=:month";
    return perform_query($sql, 'GETALL', array("userid"=>$id, "month"=>$month, "schoolyearid"=>$schoolyearid));
}

function createLogin($firstname, $lastname, $usertype){
    $sql = "INSERT into login (userid, username, password, usertype)
    VALUES (:userid, :username, :password, :usertype)";

    list($userid, $username, $password) = generateLogin($firstname, $lastname);
    $passwordhash = generatePasswordHash($password);
    $bindparams=array("userid" => $userid,
      "username"=> $username,
      "password"=> $passwordhash,
      "usertype" => $usertype);

    return array(array($userid, $username, $password), $sql, $bindparams);
}

/*
 * Mass create login credentials
 * @param array(array()) : array of users
 * @return array(array(), string, array());
 */
function massCreateLogins($users, $usertype){
    $loginbindparams = array();
    $userids = array();
    $emailparams = array();
    $sql = "INSERT into login (userid, username, password, usertype) values ";

    foreach (array_values($users) as $i => $user) {
        list($userid, $username, $password) = generateLogin($user->firstName, $user->lastName);
        $passwordhash = generatePasswordHash($password);

        $sql.= "(:userid".$i.", :username".$i.", :password".$i.", :usertype".$i."),";
        $loginbindparams["userid".$i] = $userid;
        $loginbindparams["username".$i] = $username;
        $loginbindparams["password".$i] = $passwordhash;
        $loginbindparams["usertype".$i] = $usertype;
        $userids[$i] = $userid;
        $emailparams[$i] = array("emailAddr"=>$user->emailAddr, "username"=>$username, "password"=>$password, "firstName"=>$user->firstName, "lastName"=>$user->lastName);
        array_push($userids, $userid);
    }
    $sql = rtrim($sql, ",");
    return array($userids, $emailparams, $sql, $loginbindparams);
}


#================================================================================================================#
# Helpers/Wrappers
#================================================================================================================#
function buildWhereClause($fields){
    $clause = "";
    $bindparams = array();
    foreach ($fields as $key=>$value) {
        $clause.= " AND ";
        if(substr($key, -4) === 'Name'){
            $clause.=$key." like '%".$value."%'";
        }
        else {
            $clause.=$key."=:".$key;
            $bindparams[$key] = $value;
        }

    }
    return array($clause, $bindparams);
}

function generateLogin($firstname, $lastname){
    // 6 digit userid
    $sql = "SELECT userid from login where userid=:userid";
    $userid = generateUniqueID($sql, "userid");
    $username = generateUsername($userid, $firstname, $lastname);
    $password = generatePassword();

    return array($userid, $username, $password);
}

// wrapper
function generateUsername($userid, $firstname, $lastname){
    // username = first letter of first name + last name + last 5 digits of userid
    $firstname = strtolower($firstname);
    $lastname = strtolower($lastname);
    return $firstname[0].$lastname.substr($userid, -5);
}
function generatePassword(){
    // password to be hashed
    $password='';
    $chars = pwchars;
    $count = strlen($chars);
    $desired_length = rand(8, 12);
    for($length = 0; $length < $desired_length; $length++) {
     $index = rand(0, $count-1);
     $password .= $chars[$index];
 }
 return $password;
}

function generatePasswordHash($password){
    $cost = 10;
    $salt = strtr(base64_encode(mcrypt_create_iv(16, MCRYPT_DEV_URANDOM)), '+', '.');
    $salt = sprintf("$2a$%02d$", $cost).$salt;
    return crypt($password, $salt);
}
}