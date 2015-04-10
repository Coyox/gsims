<?php
require_once __DIR__.'/api/index.php';
class indexTest extends PHPUnit_Framework_TestCase{

// THE SETUP() FUNCTION CLEARS AND INSERTS ALL DATA INTO TABLES BEFORE EVERY TEST
// THE SQL FILE HAS BEEN SAVED AS AN $SQL SCRIPT IN THE SETUP() FUNCTION


//get db connection
private $conn = null;
public function getConnection() {
    if ($this->conn === null) {
        try {
            $pdo = new PDO('mysql:host=localhost;dbname=test', 'root', '');
            $this->conn = $this->createDefaultDBConnection($pdo, 'test');
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }
    return $this->conn;
}


// done before every test function (refreshes new db)
public function setUp() {
    $conn = $this->getConnection();
    $pdo = $conn->getConnection();

    $sql = "INSERT INTO schoolyear (`schoolyearid`, `schoolyear`, `status`, `openForReg`)
VALUES(123456, "2013-2014", "inactive", 0),
(122334, "2014-2015", "inactive", 0),
(122335, "2015S", "inactive", 0),
(233464, "2015-2016", "active", 1),
(876390, "2016-2017", "inactive", 1)
;

INSERT INTO school (`schoolid`, `location`, `postalCode`, `yearOpened`, `status`, `lastAccessed`)
VALUES(863941, "Surrey", "v7s3j5", "2005", "active", CURRENT_TIMESTAMP),
(868731, "Toronto", "b7l1kc", "2015", "active", CURRENT_TIMESTAMP),
(783941, "London", "v8d3s4", "2015", "active", CURRENT_TIMESTAMP),
(872341, "Calgary", "v7d9d7", "2016", "active", CURRENT_TIMESTAMP)
;

INSERT INTO `department`(`deptid`, `schoolid`, `deptName`, `schoolyearid`, `status`, `lastAccessed`)
VALUES (544434, 863941, "Gurmukhi", 876390, "active", CURRENT_TIMESTAMP),
(544431, 863941, "Little Khalsa Club", 876390, "active", CURRENT_TIMESTAMP),
(544432, 863941, "Tantee Saaj", 876390, "active", CURRENT_TIMESTAMP),
(544433, 863941, "Santhiya", 876390, "active", CURRENT_TIMESTAMP),
(544435, 863941, "Waga", 876390, "active", CURRENT_TIMESTAMP),
(544436, 863941, "Tabla", 876390, "active", CURRENT_TIMESTAMP),
(544437, 863941, "Gatka", 876390, "active", CURRENT_TIMESTAMP),
(544438, 863941, "Sikh History", 876390, "active", CURRENT_TIMESTAMP),
(544439, 863941, "Extra Help", 876390, "active", CURRENT_TIMESTAMP),
(544440, 863941, "Dastar", 876390, "active", CURRENT_TIMESTAMP),
(544441, 863941, "Girls Activity", 876390, "active", CURRENT_TIMESTAMP),
(544442, 863941, "SSGS Pothi", 876390, "active", CURRENT_TIMESTAMP);

INSERT INTO `department`(`deptid`, `schoolid`, `deptName`, `schoolyearid`, `status`, `lastAccessed`)
VALUES (544534, 863941, "Gurmukhi", 233464, "active", CURRENT_TIMESTAMP),
(544531, 863941, "Little Khalsa Club", 233464, "active", CURRENT_TIMESTAMP),
(544532, 863941, "Tantee Saaj", 233464, "active", CURRENT_TIMESTAMP),
(544533, 863941, "Santhiya", 233464, "active", CURRENT_TIMESTAMP),
(544535, 863941, "Waga", 233464, "active", CURRENT_TIMESTAMP),
(544536, 863941, "Tabla", 233464, "active", CURRENT_TIMESTAMP),
(544537, 863941, "Gatka", 233464, "active", CURRENT_TIMESTAMP),
(544538, 863941, "Sikh History", 233464, "active", CURRENT_TIMESTAMP),
(544539, 863941, "Extra Help", 233464, "active", CURRENT_TIMESTAMP),
(544540, 863941, "Dastar", 233464, "active", CURRENT_TIMESTAMP),
(544541, 863941, "Girls Activity", 233464, "active", CURRENT_TIMESTAMP),
(544542, 863941, "SSGS Pothi", 233464, "active", CURRENT_TIMESTAMP);

INSERT INTO `department`(`deptid`, `schoolid`, `deptName`, `schoolyearid`, `status`, `lastAccessed`)
VALUES (544634, 863941, "Gurmukhi", 122334, "active", CURRENT_TIMESTAMP),
(544631, 863941, "Little Khalsa Club", 122334, "active", CURRENT_TIMESTAMP),
(544637, 863941, "Gatka", 122334, "active", CURRENT_TIMESTAMP),
(544638, 863941, "Sikh History", 122334, "active", CURRENT_TIMESTAMP)
;

INSERT INTO `department`(`deptid`, `schoolid`, `deptName`, `schoolyearid`, `status`, `lastAccessed`)
VALUES (544734, 863941, "Gurmukhi", 123456, "active", CURRENT_TIMESTAMP),
(544731, 863941, "Little Khalsa Club", 123456, "active", CURRENT_TIMESTAMP),
(544737, 863941, "Gatka", 123456, "active", CURRENT_TIMESTAMP),
(544738, 863941, "Sikh History", 123456, "active", CURRENT_TIMESTAMP)
;

INSERT INTO `department`(`deptid`, `schoolid`, `deptName`, `schoolyearid`, `status`, `lastAccessed`)
VALUES (644534, 868731, "Gurmukhi", 233464, "active", CURRENT_TIMESTAMP),
(644531, 868731, "Little Khalsa Club", 233464, "active", CURRENT_TIMESTAMP),
(644532, 868731, "Tantee Saaj", 233464, "active", CURRENT_TIMESTAMP),
(644533, 868731, "Santhiya", 233464, "active", CURRENT_TIMESTAMP),
(644535, 868731, "Waga", 233464, "active", CURRENT_TIMESTAMP),
(644536, 868731, "Tabla", 233464, "active", CURRENT_TIMESTAMP),
(644537, 868731, "Gatka", 233464, "active", CURRENT_TIMESTAMP),
(644538, 868731, "Sikh History", 233464, "active", CURRENT_TIMESTAMP),
(644539, 868731, "Extra Help", 233464, "active", CURRENT_TIMESTAMP),
(644540, 868731, "Dastar", 233464, "active", CURRENT_TIMESTAMP),
(644541, 868731, "Girls Activity", 233464, "active", CURRENT_TIMESTAMP),
(644542, 868731, "SSGS Pothi", 233464, "active", CURRENT_TIMESTAMP);

INSERT INTO `department`(`deptid`, `schoolid`, `deptName`, `schoolyearid`, `status`, `lastAccessed`)
VALUES (644564, 868731, "Gurmukhi", 876390, "active", CURRENT_TIMESTAMP),
(644561, 868731, "Little Khalsa Club", 876390, "active", CURRENT_TIMESTAMP),
(644562, 868731, "Tantee Saaj", 876390, "active", CURRENT_TIMESTAMP),
(644563, 868731, "Santhiya", 876390, "active", CURRENT_TIMESTAMP),
(644565, 868731, "Waga", 876390, "active", CURRENT_TIMESTAMP),
(644566, 868731, "Tabla", 876390, "active", CURRENT_TIMESTAMP),
(644567, 868731, "Gatka", 876390, "active", CURRENT_TIMESTAMP),
(644568, 868731, "Sikh History", 876390, "active", CURRENT_TIMESTAMP),
(644569, 868731, "Extra Help", 876390, "active", CURRENT_TIMESTAMP),
(644570, 868731, "Dastar", 876390, "active", CURRENT_TIMESTAMP),
(644571, 868731, "Girls Activity", 876390, "active", CURRENT_TIMESTAMP),
(644572, 868731, "SSGS Pothi", 876390, "active", CURRENT_TIMESTAMP);

INSERT INTO `department`(`deptid`, `schoolid`, `deptName`, `schoolyearid`, `status`, `lastAccessed`)
VALUES (744534, 783941, "Gurmukhi", 233464, "active", CURRENT_TIMESTAMP),
(744531, 783941, "Little Khalsa Club", 233464, "active", CURRENT_TIMESTAMP),
(744532, 783941, "Tantee Saaj", 233464, "active", CURRENT_TIMESTAMP),
(744533, 783941, "Santhiya", 233464, "active", CURRENT_TIMESTAMP),
(744535, 783941, "Waga", 233464, "active", CURRENT_TIMESTAMP),
(744536, 783941, "Tabla", 233464, "active", CURRENT_TIMESTAMP),
(744537, 783941, "Gatka", 233464, "active", CURRENT_TIMESTAMP),
(744538, 783941, "Sikh History", 233464, "active", CURRENT_TIMESTAMP),
(744539, 783941, "Extra Help", 233464, "active", CURRENT_TIMESTAMP),
(744540, 783941, "Dastar", 233464, "active", CURRENT_TIMESTAMP),
(744541, 783941, "Girls Activity", 233464, "active", CURRENT_TIMESTAMP),
(744542, 783941, "SSGS Pothi", 233464, "active", CURRENT_TIMESTAMP);

INSERT INTO `department`(`deptid`, `schoolid`, `deptName`, `schoolyearid`, `status`, `lastAccessed`)
VALUES (744554, 783941, "Gurmukhi", 876390, "active", CURRENT_TIMESTAMP),
(744551, 783941, "Little Khalsa Club", 876390, "active", CURRENT_TIMESTAMP),
(744552, 783941, "Tantee Saaj", 876390, "active", CURRENT_TIMESTAMP),
(744553, 783941, "Santhiya", 876390, "active", CURRENT_TIMESTAMP),
(744555, 783941, "Waga", 876390, "active", CURRENT_TIMESTAMP),
(744556, 783941, "Tabla", 876390, "active", CURRENT_TIMESTAMP),
(744557, 783941, "Gatka", 876390, "active", CURRENT_TIMESTAMP),
(744558, 783941, "Sikh History", 876390, "active", CURRENT_TIMESTAMP),
(744559, 783941, "Extra Help", 876390, "active", CURRENT_TIMESTAMP),
(744560, 783941, "Dastar", 876390, "active", CURRENT_TIMESTAMP),
(744561, 783941, "Girls Activity", 876390, "active", CURRENT_TIMESTAMP),
(744562, 783941, "SSGS Pothi", 876390, "active", CURRENT_TIMESTAMP);

INSERT INTO `department`(`deptid`, `schoolid`, `deptName`, `schoolyearid`, `status`, `lastAccessed`)
VALUES (844534, 872341, "Gurmukhi", 876390, "active", CURRENT_TIMESTAMP),
(844531, 872341, "Little Khalsa Club", 876390, "active", CURRENT_TIMESTAMP),
(844532, 872341, "Tantee Saaj", 876390, "active", CURRENT_TIMESTAMP),
(844533, 872341, "Santhiya", 876390, "active", CURRENT_TIMESTAMP),
(844535, 872341, "Waga", 876390, "active", CURRENT_TIMESTAMP),
(844536, 872341, "Tabla", 876390, "active", CURRENT_TIMESTAMP),
(844537, 872341, "Gatka", 876390, "active", CURRENT_TIMESTAMP),
(844538, 872341, "Sikh History", 876390, "active", CURRENT_TIMESTAMP),
(844539, 872341, "Extra Help", 876390, "active", CURRENT_TIMESTAMP),
(844540, 872341, "Dastar", 876390, "active", CURRENT_TIMESTAMP),
(844541, 872341, "Girls Activity", 876390, "active", CURRENT_TIMESTAMP),
(844542, 872341, "SSGS Pothi", 876390, "active", CURRENT_TIMESTAMP);

INSERT INTO `course`(`courseid`, `courseName`, `description`, `deptid`, `schoolyearid`, `status`, `lastAccessed`)
VALUES
(422220, "Little Khalsa Club Level 1", "Khalsa club, 1st level", 544531, 233464, "active", CURRENT_TIMESTAMP),
(422221, "Little Khalsa Club Level 2", "Khalsa club 2nd level", 544531, 233464, "active", CURRENT_TIMESTAMP),
(422222, "Gurmukhi Beg", "Gurmukhi for complete beginners", 544534, 233464, "active", CURRENT_TIMESTAMP),
(422223, "Gurmukhi Beg Adult", "Gurmukhi for beginner adults 18+", 544534, 233464, "active", CURRENT_TIMESTAMP),
(422224, "Gurmukhi Intermediate", "Gurmukhi after completion of beginner class", 544534, 233464, "active", CURRENT_TIMESTAMP),
(422225, "Tantee Saaj Advance", "Advanced Tantee Saaj", 544532, 233464, "active", CURRENT_TIMESTAMP),
(422226, "Nitnem Santhiya Introduction Girls", "Beginner Nitnem Santhiya for girls", 544533, 233464, "active", CURRENT_TIMESTAMP),
(422227, "Nitnem Santhiya Introduction Boys", "Beginner Nitnam Santhiya for boys", 544533, 233464, "active", CURRENT_TIMESTAMP),
(422228, "Gurmukhi Intermediate Adult", "Gurmukhi after completion of beginner class, 18+", 544534, 233464, "active", CURRENT_TIMESTAMP),
(422229, "SSGS Pothi 1 Boys", "", 544542, 233464, "active", CURRENT_TIMESTAMP),
(422230, "SSGS Pothi 1 Girls", "", 544542, 233464, "active", CURRENT_TIMESTAMP),
(422240, "Waja Level 3/4 Boys", "", 544535, 233464, "active", CURRENT_TIMESTAMP),
(422250, "Waja Level 5 Girls", "", 544535, 233464, "active", CURRENT_TIMESTAMP),
(422260, "Tabla Level 1/2 Girls", "", 544536, 233464, "active", CURRENT_TIMESTAMP),
(422270, "Gatka Level 1", "", 544537, 233464, "active", CURRENT_TIMESTAMP),
(422280, "Little  Khalsa Club Level 3", "Khalsa club, 3rd level", 544531, 233464, "active", CURRENT_TIMESTAMP),
(422290, "Gurmukhi Advanced", "Gurmukhi after completion of intermediate class", 544534, 233464, "active", CURRENT_TIMESTAMP),
(422020, "Tabla Level 3 Boys", "", 544536, 233464, "active", CURRENT_TIMESTAMP),
(422120, "Waja Level 4 Girls", "", 544535, 233464, "active", CURRENT_TIMESTAMP),
(423220, "Waja Level 1/2 Boys", "", 544535, 233464, "active", CURRENT_TIMESTAMP),
(422320, "Gatka Level 3 Boys", "", 544537, 233464, "active", CURRENT_TIMESTAMP),
(422420, "Sikh History Girls 7-10", "", 544538, 233464, "active", CURRENT_TIMESTAMP),
(422520, "Sikh History Boys 7-10", "", 544538, 233464, "active", CURRENT_TIMESTAMP),
(422620, "Sikh History Girls 11-13", "", 544538, 233464, "active", CURRENT_TIMESTAMP),
(422720, "Sikh History Girls 14-17", "", 544538, 233464, "active", CURRENT_TIMESTAMP),
(422820, "Sikh History Boys 11-15", "", 544538, 233464, "active", CURRENT_TIMESTAMP),
(422920, "Sikh History Boys 16+", "", 544538, 233464, "active", CURRENT_TIMESTAMP),
(420220, "Sikh History Girls 18+", "", 544538, 233464, "active", CURRENT_TIMESTAMP),
(421220, "Extra Help Gurmukhi", "If extra help is needed", 544539, 233464, "active", CURRENT_TIMESTAMP),
(424220, "Waja Level 1/2 Girls", "", 544535, 233464, "active", CURRENT_TIMESTAMP),
(423227, "Tabla Level 3 Girls", "", 544536, 233464, "active", CURRENT_TIMESTAMP),
(424228, "Gatka Level 2 Boys", "", 544537, 233464, "active", CURRENT_TIMESTAMP),
(425220, "Waja Level 4/5 Boys", "", 544535, 233464, "active", CURRENT_TIMESTAMP),
(426220, "Tabla Level 1/2 Boys", "", 544536, 233464, "active", CURRENT_TIMESTAMP),
(427220, "Tantee Saaj Boys", "", 544532, 233464, "active", CURRENT_TIMESTAMP),
(428220, "Waja Level 3 Girls", "", 544535, 233464, "active", CURRENT_TIMESTAMP),
(429220, "Waja 18+ Girls", "", 544535, 233464, "active", CURRENT_TIMESTAMP),
(402220, "Dastar Class", "", 544540, 233464, "active", CURRENT_TIMESTAMP),
(412220, "Girls Activity Class 12-16", "Various activities for girls", 544541, 233464, "active", CURRENT_TIMESTAMP);

INSERT INTO `course`(`courseid`, `courseName`, `description`, `deptid`, `schoolyearid`, `status`, `lastAccessed`)
VALUES
(522220, "Little Khalsa Club Level 1", "Khalsa club, 1st level", 544431, 876390, "active", CURRENT_TIMESTAMP),
(522221, "Little Khalsa Club Level 2", "Khalsa club 2nd level", 544431, 876390, "active", CURRENT_TIMESTAMP),
(522280, "Little  Khalsa Club Level 3", "Khalsa club, 3rd level", 544441, 876390, "active", CURRENT_TIMESTAMP),
(522420, "Sikh History Girls 7-10", "", 544438, 876390, "active", CURRENT_TIMESTAMP),
(522520, "Sikh History Boys 7-10", "", 544438, 876390, "active", CURRENT_TIMESTAMP),
(522620, "Sikh History Girls 11-13", "", 544438, 876390, "active", CURRENT_TIMESTAMP),
(522720, "Sikh History Girls 14-17", "", 544438, 876390, "active", CURRENT_TIMESTAMP),
(522820, "Sikh History Boys 11-15", "", 544438, 876390, "active", CURRENT_TIMESTAMP),
(522920, "Sikh History Boys 16+", "", 544438, 876390, "active", CURRENT_TIMESTAMP),
(520220, "Sikh History Girls 18+", "", 544438, 876390, "active", CURRENT_TIMESTAMP),
(512220, "Girls Activity Class 12-16", "Various activities for girls", 544441, 876390, "active", CURRENT_TIMESTAMP);

INSERT INTO `section`(`sectionid`, `courseid`, `sectionCode`, `day`, `startTime`, `endTime`, `roomCapacity`, `roomLocation`, `classSize`, `schoolyearid`, `status`, `lastAccessed`)
VALUES
(500000, 422220, "1B", ("SAT, SUN"), "17:15:00", "18:15:00", "50", "#3", "43", 233464, "active", CURRENT_TIMESTAMP),
(500001, 422221, "2B", ("SAT, SUN"), "17:15:00", "18:15:00", "50", "#2", "43", 233464, "active", CURRENT_TIMESTAMP),
(500002, 422222, "GB1", ("SAT, SUN"), "17:15:00", "18:15:00", "50", "#1", "43", 233464, "active", CURRENT_TIMESTAMP),
(500003, 422223, "GBA1", ("SAT, SUN"), "17:15:00", "18:15:00", "50", "#6", "43", 233464, "active", CURRENT_TIMESTAMP),
(500004, 422224, "GM1", ("SAT, SUN"), "17:15:00", "18:15:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500005, 422225, "TSA1", ("SAT, SUN"), "17:15:00", "18:15:00", "50", "#10", "43", 233464, "active", CURRENT_TIMESTAMP),
(500006, 422226, "ISG1", ("SAT, SUN"), "17:15:00", "18:15:00", "50", "#12", "43", 233464, "active", CURRENT_TIMESTAMP),
(500007, 422227, "ISB1", ("SAT, SUN"), "17:15:00", "18:15:00", "50", "#7", "43", 233464, "active", CURRENT_TIMESTAMP),
(500008, 422228, "GA1", ("SAT, SUN"), "17:15:00", "18:15:00", "50", "#4", "43", 233464, "active", CURRENT_TIMESTAMP),
(500009, 422229, "SPB1", ("SAT, SUN"), "17:15:00", "18:15:00", "50", "#8", "43", 233464, "active", CURRENT_TIMESTAMP),
(500010, 422230, "SPG1", ("SAT, SUN"), "17:15:00", "18:15:00", "50", "#11", "43", 233464, "active", CURRENT_TIMESTAMP),

(500011, 422220, "1A", ("MON, THU"), "18:15:00", "19:15:00", "50", "#1", "43", 233464, "active", CURRENT_TIMESTAMP),
(500012, 422221, "2A", ("MON, THU"), "18:15:00", "19:15:00", "50", "#6", "43", 233464, "active", CURRENT_TIMESTAMP),
(500013, 422228, "GA2", ("MON, THU"), "18:15:00", "19:15:00", "50", "#7", "43", 233464, "active", CURRENT_TIMESTAMP),
(500014, 422227, "ISB2", ("MON, THU"), "18:15:00", "19:15:00", "50", "#12", "43", 233464, "active", CURRENT_TIMESTAMP),
(500015, 422226, "ISG2", ("MON, THU"), "18:15:00", "19:15:00", "50", "#9", "43", 233464, "active", CURRENT_TIMESTAMP),
(500016, 422240, "WB4", ("MON, THU"), "18:15:00", "19:15:00", "50", "#10", "43", 233464, "active", CURRENT_TIMESTAMP),
(500017, 422250, "WG5", ("MON, THU"), "18:15:00", "19:15:00", "50", "#11", "43", 233464, "active", CURRENT_TIMESTAMP),
(500018, 422260, "TG12", ("MON, THU"), "18:15:00", "19:15:00", "50", "GYM", "43", 233464, "active", CURRENT_TIMESTAMP),
(500019, 422270, "GK1", ("MON, THU"), "18:15:00", "19:15:00", "50", "#2/3", "43", 233464, "active", CURRENT_TIMESTAMP),

(500020, 422220, "1C", ("TUE, FRI"), "18:15:00", "19:15:00", "50", "#3", "43", 233464, "active", CURRENT_TIMESTAMP),
(500021, 422280, "3A", ("TUE, FRI"), "18:15:00", "19:15:00", "50", "#3", "43", 233464, "active", CURRENT_TIMESTAMP),
(500022, 422222, "GB3", ("TUE, FRI"), "18:15:00", "19:15:00", "50", "#3", "43", 233464, "active", CURRENT_TIMESTAMP),
(500023, 422223, "GBA3", ("TUE, FRI"), "18:15:00", "19:15:00", "50", "#3", "43", 233464, "active", CURRENT_TIMESTAMP),
(500024, 422224, "GI3", ("TUE, FRI"), "18:15:00", "19:15:00", "50", "#3", "43", 233464, "active", CURRENT_TIMESTAMP),
(500025, 422290, "GA3", ("TUE, FRI"), "18:15:00", "19:15:00", "50", "#3", "43", 233464, "active", CURRENT_TIMESTAMP),
(500026, 422020, "TB3", ("TUE, FRI"), "18:15:00", "19:15:00", "50", "#3", "43", 233464, "active", CURRENT_TIMESTAMP),
(500027, 423220, "WB2", ("TUE, FRI"), "18:15:00", "19:15:00", "50", "#3", "43", 233464, "active", CURRENT_TIMESTAMP),
(500028, 422120, "WG2", ("TUE, FRI"), "18:15:00", "19:15:00", "50", "#3", "43", 233464, "active", CURRENT_TIMESTAMP),
(500029, 427220, "TSIB", ("TUE, FRI"), "18:15:00", "19:15:00", "50", "#3", "43", 233464, "active", CURRENT_TIMESTAMP),

(500030, 422224, "GI4", ("WED, SAT"), "18:15:00", "19:15:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500031, 422228, "GA4", ("WED, SAT"), "18:15:00", "19:15:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500032, 422020, "TB2", ("WED, SAT"), "18:15:00", "19:15:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500033, 422120, "WG4", ("WED, SAT"), "18:15:00", "19:15:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500034, 423220, "WB3", ("WED, SAT"), "18:15:00", "19:15:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500035, 422229, "SPB2", ("WED, SAT"), "18:15:00", "19:15:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500036, 422230, "SPG2", ("WED, SAT"), "18:15:00", "19:15:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500037, 422230, "SPG3", ("WED, SAT"), "18:15:00", "19:15:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500038, 422320, "GK3", ("WED, SAT"), "18:15:00", "19:15:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),

(500039, 422420, "SHG7", ("SUN"), "18:15:00", "19:15:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500040, 422520, "SHB7", ("SUN"), "18:15:00", "19:15:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500041, 422620, "SHG11", ("SUN"), "18:15:00", "19:15:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500042, 422720, "SHG14", ("SUN"), "18:15:00", "19:15:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500043, 422820, "SHB11", ("SUN"), "18:15:00", "19:15:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500044, 422920, "SHB16", ("SUN"), "18:15:00", "19:15:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500045, 422320, "SHB18", ("SUN"), "18:15:00", "19:15:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500046, 420220, "EHG1", ("SUN"), "18:15:00", "19:15:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),

(500047, 424220, "WG1", ("MON, THU"), "19:30:00", "20:30:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500048, 423227, "TG3", ("MON, THU"), "19:30:00", "20:30:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500049, 424228, "GK2", ("MON, THU"), "19:30:00", "20:30:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500050, 422224, "GI2", ("MON, THU"), "19:30:00", "20:30:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500051, 425220, "WB5", ("MON, THU"), "19:30:00", "20:30:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),

(500052, 426220, "TB1", ("TUE, FRI"), "19:30:00", "20:30:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500053, 427220, "TSB", ("TUE, FRI"), "19:30:00", "20:30:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500054, 428220, "WG3", ("TUE, FRI"), "19:30:00", "20:30:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500055, 429220, "WG18", ("TUE, FRI"), "19:30:00", "20:30:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500056, 402220, "DC1", ("TUE, FRI"), "19:30:00", "20:30:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500057, 412220, "GA12", ("TUE, FRI"), "19:30:00", "20:30:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500058, 420220, "EHG2", ("TUE, FRI"), "19:30:00", "20:30:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),

(500059, 424220, "WB1", ("WED, SAT"), "19:30:00", "20:30:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500060, 427220, "TSBG", ("WED, SAT"), "19:30:00", "20:30:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP),
(500061, 420220, "EHG3", ("WED, SAT"), "19:30:00", "20:30:00", "50", "#5", "43", 233464, "active", CURRENT_TIMESTAMP);

INSERT INTO `prereqs`(`courseid`, `prereq`)
VALUES
-- little khalsa --
(422221, 422220),
(422280, 422221),
-- gurmukhi --
(422224, 422222),
(422228, 422223),
(422290, 422228),
-- tantee saj --
(422225, 427220),
-- waga girls--
(422250, 422120),
(422120, 428220),
(428220, 424220),
-- waja boys--
(425220, 422240),
(422240, 423220),
-- Tabla --
(423227, 422260),
(422020, 426220),
-- Gatka --
(422320, 424228),
(424228, 422270);

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('1234567', 'kseager34567', ' $2a$10$w87uze5Z0GpUyeD7lgtceuT/fArvkkr.w8R3OBF1S.F36IzAmCLsy', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(1234567, "Kyle", "Seager", "1980-09-24", "M", "123 4th St", "", "Surrey",
    "BC", "Canada", "V6T1W9", "1234567890", "KYLE@test.com", "", "", "Dustin", "Ackley",
    "0987654321", "dustin@test.com", "Bob", "Seager", "brother",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('1234568', 'rcano34568', '$2a$10$UZFtfifsqQiA3kV7iVsSq.jkLkH2TLG8kKq6BQsEtvn7FhPwTl/zm', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(1234568, "Robinson", "Cano", "1982-05-13", "M", "888 4th St", "", "Richmond",
    "BC", "Canada", "V6T1W9", "1234567890", "robinson@test.com", "", "", "Felix", "Hernandez",
    "0987654321", "felix@test.com", "Nelson", "Cruz", "uncle",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('1234569', 'arodriguez34569', '$2a$10$pJaq4xWfC6siLVQCIm2kqujUT8UiQmXijNWnzhDOoLghx/o0l8P02', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(1234569, "Alex", "Rodriguez", "1973-02-17", "F", "123 10th Ave", "", "Burnaby",
    "BC", "Canada", "V6T1W9", "1234567890", "arod@test.com", "", "", "Derek", "Jeter",
    "0987654321", "derek@test.com", "Bio", "Genisis", "brother",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('1234571', 'kkardashian34571', '$2a$10$vK6hnyKcml.SogSlaOgTx./daJUiTnyxaSVrRITsodYC6dqPZEJkW', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(1234571, "Kim", "Kardashian", "1980-09-24", "F", "1234 Rodeo Dr", "", "Beverly Hills",
    "BC", "Canada", "90210", "1234567890", "kim@test.com", "", "", "Kanye", "West",
    "0987654321", "kanye@test.com", "Kourtney", "Kardashian", "sister",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('1234572', 'kwest34572', '$2a$10$uFruLLNFELbNZbjQM0EBhu5WtkhwFauEhhh2Vvd8hVUg.6z4zYbG6', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(1234572, "Kanye", "West", "1980-03-12", "M", "1234 Rodeo Dr", "", "Beverly Hills",
    "BC", "Canada", "90210", "1234567890", "kanye@test.com", "", "", "Jay", "Z",
    "0987654321", "jayz@test.com", "Kim", "Kardashian", "wifey",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('1234573', 'rsherman34573', '$2a$10$WnCpxGDFp4TvpS1LEJ8sUO9kiw3VCCk3TCf6QctM43mbS7/XJeJei', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(1234573, "Richard", "Sherman", "1987-03-11", "M", "43134 5th Ave", "", "Vancouver",
    "BC", "Canada", "V6T1W9", "1234567890", "richard@test.com", "", "", "Kam", "Chancellor",
    "0987654321", "kam@test.com", "Earl", "Thomas", "bro",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('1234574', 'rwilson34574', '$2a$10$n5NAL4spONWlCPEMobt4W.7OXaxiH58LsQTiR4uKZkPDB4poW67vG', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(1234574, "Russell", "Wilson", "1980-03-12", "M", "1234 Rodeo Dr", "", "Delta",
    "BC", "Canada", "V6T1W9", "1234567890", "russell@test.com", "", "", "Marshawn", "Lynch",
    "0987654321", "marshawn@test.com", "pete", "carroll", "coach",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('1234575', 'bdylan34575', '$2a$10$65aZx1OM1i4Yy/Dp7y8fE.NpquKBTYW5qxefGkRuVlftS7FpaLYli', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(1234575, "Bob", "Dylan", "1980-03-12", "F", "1234 Seahawks Way", "", "Vancouver",
    "BC", "Canada", "V6T1W9", "1234567890", "marshawn@test.com", "", "", "Pete", "Carroll",
    "0987654321", "pete@test.com", "Richard", "Sherman", "teammate",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('1234576', 'ethomas34576', '$2a$10$/q5R.xuhTS7qwUudmOIYjeMrGx1E36zJ9/mHasuP9NDoqKu8TCmrG', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(1234576, "Earl", "Thomas", "1980-03-12", "M", "1234 Rodeo Dr", "", "Vancouver",
    "BC", "Canada", "V6T1W9", "1234567890", "earl@test.com", "", "", "Nina", "Dobrev",
    "0987654321", "nina@test.com", "Kam", "Chancellor", "bro",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('2234573', 'rastley34573', '$2a$10$ShUEvMxnbJ.o3D/QOn02Ku2D14tmUpoywGipK87kb4S5fWRHcaVpK', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(2234573, "Rick", "Astley", "1987-03-11", "M", "43134 5th Ave", "", "Vancouver",
    "BC", "Canada", "V6T1W9", "1234567890", "richard@test.com", "", "", "Kam", "Chancellor",
    "0987654321", "kam@test.com", "Earl", "Thomas", "bro",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('2234574', 'aketchum34574', '$2a$10$RCkjlPm4g7lEQeQ4tnDr2..PBFNAZwn4hwr5d7LfievTEaNSSfuxW', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(2234574, "Ash", "Ketchum", "1980-03-12", "M", "1234 Rodeo Dr", "", "Delta",
    "BC", "Canada", "V6T1W9", "1234567890", "russell@test.com", "", "", "Marshawn", "Lynch",
    "0987654321", "marshawn@test.com", "pete", "carroll", "coach",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('2234575', 'rpieces34575', '$2a$10$J6/gn3P9HsU4kk0GcqJ6fuXEip6ruc6aAAip4qdI1aa/nxRwosG8a', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(2234575, "Reese", "Pieces", "1980-03-12", "F", "1234 Seahawks Way", "", "Vancouver",
    "BC", "Canada", "V6T1W9", "1234567890", "marshawn@test.com", "", "", "Pete", "Carroll",
    "0987654321", "pete@test.com", "Richard", "Sherman", "teammate",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('2234576', 'narmstrong34576', '$2a$10$TkFf6r2252Cay7wJwSdIeu1wGx5VCFYCHc..lAX3Z4Xbvotc/Rz5e', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(2234576, "Neil", "Armstrong", "1980-03-12", "M", "1234 Rodeo Dr", "", "Vancouver",
    "BC", "Canada", "V6T1W9", "1234567890", "earl@test.com", "", "", "Nina", "Dobrev",
    "0987654321", "nina@test.com", "Kam", "Chancellor", "bro",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('3234567', 'kmcfee34567', ' $2a$10$w87uze5Z0GpUyeD7lgtceuT/fArvkkr.w8R3OBF1S.F36IzAmCLsy', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(3234567, "Kari", "McFee", "1980-09-24", "F", "123 4th St", "", "Surrey",
    "BC", "Canada", "V6T1W9", "1234567890", "KYLE@test.com", "", "", "Dustin", "Ackley",
    "0987654321", "dustin@test.com", "Bob", "Seager", "brother",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('3234568', 'afocken34568', '$2a$10$UZFtfifsqQiA3kV7iVsSq.jkLkH2TLG8kKq6BQsEtvn7FhPwTl/zm', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(3234568, "Alex", "Focken", "1982-05-13", "F", "888 4th St", "", "Richmond",
    "BC", "Canada", "V6T1W9", "1234567890", "robinson@test.com", "", "", "Felix", "Hernandez",
    "0987654321", "felix@test.com", "Nelson", "Cruz", "uncle",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('3234569', 'sseit34569', '$2a$10$pJaq4xWfC6siLVQCIm2kqujUT8UiQmXijNWnzhDOoLghx/o0l8P02', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(3234569, "Shanifer", "Seit", "1973-02-17", "F", "123 10th Ave", "", "Burnaby",
    "BC", "Canada", "V6T1W9", "1234567890", "arod@test.com", "", "", "Derek", "Jeter",
    "0987654321", "derek@test.com", "Bio", "Genisis", "brother",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('3234571', 'jearljones34571', '$2a$10$vK6hnyKcml.SogSlaOgTx./daJUiTnyxaSVrRITsodYC6dqPZEJkW', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(3234571, "James", "Earljones", "1980-09-24", "F", "1234 Rodeo Dr", "", "Beverly Hills",
    "BC", "Canada", "90210", "1234567890", "kim@test.com", "", "", "Kanye", "West",
    "0987654321", "kanye@test.com", "Kourtney", "Kardashian", "sister",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('3234572', 'oprime34572', '$2a$10$uFruLLNFELbNZbjQM0EBhu5WtkhwFauEhhh2Vvd8hVUg.6z4zYbG6', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(3234572, "Optimus", "Prime", "1980-03-12", "M", "1234 Rodeo Dr", "", "Beverly Hills",
    "BC", "Canada", "90210", "1234567890", "kanye@test.com", "", "", "Jay", "Z",
    "0987654321", "jayz@test.com", "Kim", "Kardashian", "wifey",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('3234573', 'fLim34573', '$2a$10$WnCpxGDFp4TvpS1LEJ8sUO9kiw3VCCk3TCf6QctM43mbS7/XJeJei', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(3234573, "Francis", "Lim", "1987-03-11", "M", "43134 5th Ave", "", "Vancouver",
    "BC", "Canada", "V6T1W9", "1234567890", "richard@test.com", "", "", "Kam", "Chancellor",
    "0987654321", "kam@test.com", "Earl", "Thomas", "bro",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('3234574', 'efudd34574', '$2a$10$n5NAL4spONWlCPEMobt4W.7OXaxiH58LsQTiR4uKZkPDB4poW67vG', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(3234574, "Elmer", "Fudd", "1980-03-12", "M", "1234 Rodeo Dr", "", "Delta",
    "BC", "Canada", "V6T1W9", "1234567890", "russell@test.com", "", "", "Marshawn", "Lynch",
    "0987654321", "marshawn@test.com", "pete", "carroll", "coach",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('3234575', 'ktut34575', '$2a$10$65aZx1OM1i4Yy/Dp7y8fE.NpquKBTYW5qxefGkRuVlftS7FpaLYli', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(3234575, "King", "Tut", "1980-03-12", "F", "1234 Seahawks Way", "", "Vancouver",
    "BC", "Canada", "V6T1W9", "1234567890", "marshawn@test.com", "", "", "Pete", "Carroll",
    "0987654321", "pete@test.com", "Richard", "Sherman", "teammate",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('3234576', 'jsimpson34576', '$2a$10$/q5R.xuhTS7qwUudmOIYjeMrGx1E36zJ9/mHasuP9NDoqKu8TCmrG', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(3234576, "Jessica", "Simpson", "1980-03-12", "M", "1234 Rodeo Dr", "", "Vancouver",
    "BC", "Canada", "V6T1W9", "1234567890", "earl@test.com", "", "", "Nina", "Dobrev",
    "0987654321", "nina@test.com", "Kam", "Chancellor", "bro",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('5534576', 'poak34576', '$2a$10$oZDJ1JTdZVzRzgV16.Xc1.P7iThnuGO0IiaD7YTF5EbQF4uTIRsu2', 'SU', CURRENT_TIMESTAMP);
INSERT INTO superuser (`userid`, `firstName`, `lastName`, `emailAddr`, `status`)
VALUES(5534576, "Professor", "Oak", "test@gmail.com", "active");

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('5534577', 'nuzumaki34577', '$2a$10$Ifd29dKM7d3Zzj0aOOv4x.wIPlOuCBT8D0Kc6OjSvXY7Ypfw0AM42', 'T', CURRENT_TIMESTAMP);
INSERT INTO teacher (`userid`, `schoolid`, `firstName`, `lastName`, `emailAddr`, `status`, `usertype`)
VALUES(5534577, 863941, "Naruto", "Uzumaki", "test@gmail.com", "active", "T");

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('5512345', 'ssnape12345', '$2a$10$dF/rkKbzGpioaZ1Dglo/duiO.Dt0RLMov0b9FzAk7glbr0tjbDPWu', 'SU', CURRENT_TIMESTAMP);
INSERT INTO superuser (`userid`, `firstName`, `lastName`, `emailAddr`, `status`)
VALUES(5512345, "Severus", "Snape", "test@gmail.com", "active");

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('5534579', 'njones34579', '$2a$10$D090Xal7xI/tdAdPdeLfeuAAf5H78G/iBZoIT5WIVGlFy6hhd.Cgi', 'T', CURRENT_TIMESTAMP);
INSERT INTO teacher (`userid`, `schoolid`, `firstName`, `lastName`, `emailAddr`, `status`, `usertype`)
VALUES(5534579, 863941, "Nebraska", "Jones", "test@gmail.com", "active", "T");

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('5534580', 'adumbledore34580', '$2a$10$QcTDQywZ7geqiUBVWfiAJerxKOXnO0RjeLLiTF8HX.pDEj.AZk54C', 'T', CURRENT_TIMESTAMP);
INSERT INTO teacher (`userid`, `schoolid`, `firstName`, `lastName`, `emailAddr`, `status`, `usertype`)
VALUES(5534580, 863941, "Albus", "Dumbledore", "test@gmail.com", "active", "T");

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('5534581', 'tcruise34581', '$2a$10$5su1OtTnzVv9EiAnrVkI2.ZrQqZ6JI2hl0mX7Pchd1IIrJf1fUsZ6', 'T', CURRENT_TIMESTAMP);
INSERT INTO teacher (`userid`, `schoolid`, `firstName`, `lastName`, `emailAddr`, `status`, `usertype`)
VALUES(5534581, 863941, "Tom", "Cruise", "test@gmail.com", "active", "T");

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('5534582', 'ymoto34582', '$2a$10$fetLW9De7G0DgtMDp1chNu2tIz8KsybJqToiEloO.frMUfye8p/kq', 'T', CURRENT_TIMESTAMP);
INSERT INTO teacher (`userid`, `schoolid`, `firstName`, `lastName`, `emailAddr`, `status`, `usertype`)
VALUES(5534582, 863941, "Yugi", "Moto", "test@gmail.com", "active", "A");

INSERT INTO teacherCourseCompetency (`userid`, `deptid`, `level`, `status`, `lastAccessed`)
VALUES
(5534577, 544431, 3, "active", CURRENT_TIMESTAMP),
(5534577, 544433, 2, "active", CURRENT_TIMESTAMP),
(5534580, 544435, 1, "active", CURRENT_TIMESTAMP),
(5534582, 544436, 1, "active", CURRENT_TIMESTAMP),
(5534580, 544436, 3, "active", CURRENT_TIMESTAMP),
(5534580, 544437, 2, "active", CURRENT_TIMESTAMP),
(5534577, 544439, 2, "active", CURRENT_TIMESTAMP),
(5534577, 544438, 1, "active", CURRENT_TIMESTAMP),
(5534581, 544439, 1, "active", CURRENT_TIMESTAMP),
(5534581, 544432, 2, "active", CURRENT_TIMESTAMP),
(5534581, 544440, 3, "active", CURRENT_TIMESTAMP),
(5534580, 544432, 2, "active", CURRENT_TIMESTAMP),
(5534577, 544441, 3, "active", CURRENT_TIMESTAMP),
(5534582, 544441, 3, "active", CURRENT_TIMESTAMP),
(5534577, 544432, 1, "active", CURRENT_TIMESTAMP),
(5534582, 544442, 2, "active", CURRENT_TIMESTAMP),
(5534577, 544442, 3, "active", CURRENT_TIMESTAMP),
(5534582, 544432, 1, "active", CURRENT_TIMESTAMP);

INSERT INTO teachingSection (`userid`, `sectionid`)
VALUES
(5534577, 500000),
(5534579, 500001),
(5534582, 500002),
(5534580, 500003),
(5534577, 500004),
(5534580, 500005),
(5534577, 500006),
(5534581, 500007),
(5534579, 500008),
(5534582, 500009),
(5534577, 500010),
(5534580, 500011),
(5534579, 500012),
(5534580, 500013),
(5534577, 500014),
(5534581, 500015),
(5534582, 500016),
(5534577, 500017),
(5534581, 500018),
(5534579, 500019),
(5534577, 500020),
(5534582, 500021),
(5534580, 500022),
(5534579, 500023),
(5534577, 500024),
(5534582, 500025),
(5534579, 500026),
(5534577, 500027),
(5534581, 500028),
(5534579, 500029),
(5534577, 500030),
(5534581, 500031),
(5534577, 500032),
(5534580, 500033),
(5534579, 500034),
(5534579, 500035),
(5534582, 500036),
(5534577, 500037),
(5534582, 500038),
(5534580, 500039),
(5534581, 500040),
(5534580, 500041),
(5534582, 500042),
(5534581, 500043),
(5534580, 500044),
(5534577, 500045),
(5534579, 500046),
(5534582, 500047),
(5534580, 500048),
(5534577, 500049),
(5534580, 500050),
(5534577, 500051),
(5534581, 500052),
(5534579, 500053),
(5534582, 500054),
(5534577, 500055),
(5534580, 500056),
(5534579, 500057),
(5534580, 500058),
(5534577, 500059),
(5534581, 500060),
(5534582, 500061);

INSERT INTO teachingCourse (`userid`, `courseid`)
VALUES
(5534577, 422220),
(5534579, 422220),
(5534582, 422221),
(5534580, 422222),
(5534577, 422223),
(5534580, 422224),
(5534577, 422224),
(5534581, 422225),
(5534579, 422226),
(5534582, 422226),
(5534577, 422227),
(5534580, 422228),
(5534579, 422228),
(5534580, 422229),
(5534577, 422230),
(5534581, 422230),
(5534582, 422240),
(5534577, 422250),
(5534581, 422250),
(5534579, 422260),
(5534577, 422270),
(5534582, 422280),
(5534580, 422290),
(5534579, 422020),
(5534577, 422120),
(5534582, 423220),
(5534579, 422320),
(5534577, 422420),
(5534581, 422520),
(5534579, 422620),
(5534577, 422720),
(5534581, 422820),
(5534577, 422920),
(5534580, 420220),
(5534579, 421220),
(5534579, 424220),
(5534582, 423227),
(5534577, 424228),
(5534582, 425220),
(5534580, 426220),
(5534581, 427220),
(5534580, 428220),
(5534582, 429220),
(5534581, 402220),
(5534580, 412220);

INSERT INTO document (`docid`, `docName`, `description`, `link`, `sectionid`, `userid`, `fullmark`, `schoolyearid`, `status`, `lastAccessed`)
VALUES
(111111, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500000, 5534581, 10, "233464", "active", CURRENT_TIMESTAMP),
(211111, "Assignment2","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500000, 5534577, 10, "233464", "active", CURRENT_TIMESTAMP),
(111112, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500001, 5534581, 10, "233464", "active", CURRENT_TIMESTAMP),
(211112, "Assignment2","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500001, 5534581, 10, "233464", "active", CURRENT_TIMESTAMP),
(111113, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500002, 5534577, 10, "233464", "active", CURRENT_TIMESTAMP),
(111114, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500003, 5534579, 10, "233464", "active", CURRENT_TIMESTAMP),
(111115, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500004, 5534577, 10, "233464", "active", CURRENT_TIMESTAMP),
(211115, "Assignment2","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500004, 5534580, 10, "233464", "active", CURRENT_TIMESTAMP),
(111116, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500005, 5534580, 10, "233464", "active", CURRENT_TIMESTAMP),
(211116, "Assignment2","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500005, 5534579, 10, "233464", "active", CURRENT_TIMESTAMP),
(111117, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500006, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(211117, "Assignment2","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500006, 5534581, 10, "233464", "active", CURRENT_TIMESTAMP),
(111118, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500007, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(211118, "Assignment2","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500007, 5534577, 10, "233464", "active", CURRENT_TIMESTAMP),
(111119, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500008, 5534579, 10, "233464", "active", CURRENT_TIMESTAMP),
(211119, "Assignment2","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500008, 5534580, 10, "233464", "active", CURRENT_TIMESTAMP),
(111120, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500009, 5534577, 10, "233464", "active", CURRENT_TIMESTAMP),
(211120, "Assignment2","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500009, 5534579, 10, "233464", "active", CURRENT_TIMESTAMP),
(111121, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500009, 5534577, 10, "233464", "active", CURRENT_TIMESTAMP),
(211121, "Assignment2","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500009, 5534581, 10, "233464", "active", CURRENT_TIMESTAMP),
(111122, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500011, 5534577, 10, "233464", "active", CURRENT_TIMESTAMP),
(211122, "Assignment2","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500011, 5534579, 10, "233464", "active", CURRENT_TIMESTAMP),
(111123, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500012, 5534581, 10, "233464", "active", CURRENT_TIMESTAMP),
(111124, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500013, 5534577, 10, "233464", "active", CURRENT_TIMESTAMP),
(211124, "Assignment2","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500013, 5534580, 10, "233464", "active", CURRENT_TIMESTAMP),
(111125, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500014, 5534577, 10, "233464", "active", CURRENT_TIMESTAMP),
(211126, "Assignment2","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500015, 5534579, 10, "233464", "active", CURRENT_TIMESTAMP),
(111126, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500015, 5534580, 10, "233464", "active", CURRENT_TIMESTAMP),
(111127, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500016, 5534580, 10, "233464", "active", CURRENT_TIMESTAMP),
(111128, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500017, 5534581, 10, "233464", "active", CURRENT_TIMESTAMP),
(211128, "Assignment2","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500017, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(111129, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500018, 5534577, 10, "233464", "active", CURRENT_TIMESTAMP),
(111130, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500019, 5534580, 10, "233464", "active", CURRENT_TIMESTAMP),
(211130, "Assignment2","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500019, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(111131, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500020, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(111132, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500021, 5534580, 10, "233464", "active", CURRENT_TIMESTAMP),
(111133, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500022, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(111134, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500023, 5534580, 10, "233464", "active", CURRENT_TIMESTAMP),
(111135, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500024, 5534580, 10, "233464", "active", CURRENT_TIMESTAMP),
(111136, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500025, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(211136, "Assignment2","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500025, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(111137, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500026, 5534581, 10, "233464", "active", CURRENT_TIMESTAMP),
(111138, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500027, 5534581, 10, "233464", "active", CURRENT_TIMESTAMP),
(211138, "Assignment2","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500027, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(111139, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500028, 5534579, 10, "233464", "active", CURRENT_TIMESTAMP),
(111140, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500029, 5534581, 10, "233464", "active", CURRENT_TIMESTAMP),
(211140, "Assignment2","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500029, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(111141, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500030, 5534581, 10, "233464", "active", CURRENT_TIMESTAMP),
(111142, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500031, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(211142, "Assignment2","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500031, 5534579, 10, "233464", "active", CURRENT_TIMESTAMP),
(111143, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500032, 5534581, 10, "233464", "active", CURRENT_TIMESTAMP),
(111144, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500033, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(111145, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500034, 5534579, 10, "233464", "active", CURRENT_TIMESTAMP),
(111146, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500035, 5534581, 10, "233464", "active", CURRENT_TIMESTAMP),
(111147, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500036, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(111148, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500037, 5534581, 10, "233464", "active", CURRENT_TIMESTAMP),
(111150, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500038, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(111151, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500039, 5534577, 10, "233464", "active", CURRENT_TIMESTAMP),
(211151, "Assignment2","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500039, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(111152, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500040, 5534581, 10, "233464", "active", CURRENT_TIMESTAMP),
(111153, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500041, 5534579, 10, "233464", "active", CURRENT_TIMESTAMP),
(211153, "Assignment2","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500041, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(111154, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500042, 5534577, 10, "233464", "active", CURRENT_TIMESTAMP),
(211154, "Assignment2","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500042, 5534581, 10, "233464", "active", CURRENT_TIMESTAMP),
(111155, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500043, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(111156, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500044, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(111157, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500045, 5534581, 10, "233464", "active", CURRENT_TIMESTAMP),
(111158, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500046, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(211158, "Assignment2","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500046, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(111159, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500047, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(111160, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500049, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(211160, "Assignment2","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500049, 5534577, 10, "233464", "active", CURRENT_TIMESTAMP),
(111161, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500050, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(111162, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500051, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(211162, "Assignment2","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500051, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(111163, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500052, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(111164, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500053, 5534577, 10, "233464", "active", CURRENT_TIMESTAMP),
(211164, "Assignment2","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500053, 5534579, 10, "233464", "active", CURRENT_TIMESTAMP),
(111165, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500054, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(111166, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500055, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(111167, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500056, 5534577, 10, "233464", "active", CURRENT_TIMESTAMP),
(111168, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500057, 5534579, 10, "233464", "active", CURRENT_TIMESTAMP),
(111169, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500058, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(111170, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500059, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP),
(111171, "Assignment1","","http://en.wikipedia.org/wiki/Dragon_Ball_Z", 500061, 5534582, 10, "233464", "active", CURRENT_TIMESTAMP);

INSERT INTO enrollment (`userid`, `sectionid`, `schoolyearid`, `status`, `lastAccessed`)
VALUES
(1234567, 500000, 233464, "inactive", CURRENT_TIMESTAMP),
(1234568, 500000, 233464, "active", CURRENT_TIMESTAMP),
(1234569, 500000, 233464, "active", CURRENT_TIMESTAMP),
(1234571, 500000, 233464, "pending", CURRENT_TIMESTAMP),
(3234575, 500000, 233464, "active", CURRENT_TIMESTAMP),
(1234572, 500001, 233464, "inactive", CURRENT_TIMESTAMP),
(1234573, 500001, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234574, 500001, 233464, "active", CURRENT_TIMESTAMP),
(1234575, 500001, 233464, "inactive", CURRENT_TIMESTAMP),
(1234576, 500001, 233464, "pending", CURRENT_TIMESTAMP),
(2234573, 500001, 233464, "active", CURRENT_TIMESTAMP),
(1234567, 500002, 233464, "pending", CURRENT_TIMESTAMP),
(1234568, 500002, 233464, "active", CURRENT_TIMESTAMP),
(1234569, 500002, 233464, "inactive", CURRENT_TIMESTAMP),
(1234571, 500002, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234567, 500003, 233464, "active", CURRENT_TIMESTAMP),
(1234568, 500003, 233464, "pending", CURRENT_TIMESTAMP),
(1234569, 500003, 233464, "inactive", CURRENT_TIMESTAMP),
(1234571, 500003, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234567, 500004, 233464, "active", CURRENT_TIMESTAMP),
(1234568, 500004, 233464, "pending", CURRENT_TIMESTAMP),
(1234569, 500004, 233464, "inactive", CURRENT_TIMESTAMP),
(1234571, 500004, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234572, 500005, 233464, "active", CURRENT_TIMESTAMP),
(1234573, 500005, 233464, "inactive", CURRENT_TIMESTAMP),
(1234574, 500005, 233464, "active", CURRENT_TIMESTAMP),
(1234575, 500005, 233464, "pending", CURRENT_TIMESTAMP),
(1234576, 500005, 233464, "active", CURRENT_TIMESTAMP),
(2234573, 500005, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234567, 500006, 233464, "pending", CURRENT_TIMESTAMP),
(1234568, 500006, 233464, "inactive", CURRENT_TIMESTAMP),
(1234569, 500006, 233464, "active", CURRENT_TIMESTAMP),
(1234571, 500006, 233464, "active", CURRENT_TIMESTAMP),
(1234572, 500007, 233464, "active", CURRENT_TIMESTAMP),
(1234573, 500007, 233464, "inactive", CURRENT_TIMESTAMP),
(1234574, 500007, 233464, "active", CURRENT_TIMESTAMP),
(1234575, 500007, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234576, 500007, 233464, "pending", CURRENT_TIMESTAMP),
(2234573, 500007, 233464, "active", CURRENT_TIMESTAMP),
(1234572, 500008, 233464, "active", CURRENT_TIMESTAMP),
(1234573, 500008, 233464, "inactive", CURRENT_TIMESTAMP),
(1234574, 500008, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234575, 500008, 233464, "pending", CURRENT_TIMESTAMP),
(1234576, 500008, 233464, "active", CURRENT_TIMESTAMP),
(2234573, 500008, 233464, "active", CURRENT_TIMESTAMP),
(1234572, 500009, 233464, "pending", CURRENT_TIMESTAMP),
(1234573, 500009, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234574, 500009, 233464, "active", CURRENT_TIMESTAMP),
(1234575, 500009, 233464, "inactive", CURRENT_TIMESTAMP),
(1234576, 500009, 233464, "active", CURRENT_TIMESTAMP),
(2234573, 500009, 233464, "active", CURRENT_TIMESTAMP),
(1234567, 500010, 233464, "pending", CURRENT_TIMESTAMP),
(1234568, 500010, 233464, "active", CURRENT_TIMESTAMP),
(1234569, 500010, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234571, 500010, 233464, "inactive", CURRENT_TIMESTAMP),
(1234567, 500011, 233464, "active", CURRENT_TIMESTAMP),
(1234568, 500011, 233464, "pending", CURRENT_TIMESTAMP),
(1234569, 500011, 233464, "active", CURRENT_TIMESTAMP),
(1234571, 500011, 233464, "inactive", CURRENT_TIMESTAMP),
(1234567, 500012, 233464, "active", CURRENT_TIMESTAMP),
(1234572, 500012, 233464, "inactive", CURRENT_TIMESTAMP),
(1234572, 500013, 233464, "inactive", CURRENT_TIMESTAMP),
(1234573, 500013, 233464, "pending", CURRENT_TIMESTAMP),
(1234574, 500013, 233464, "active", CURRENT_TIMESTAMP),
(1234572, 500014, 233464, "active", CURRENT_TIMESTAMP),
(1234573, 500014, 233464, "inactive", CURRENT_TIMESTAMP),
(1234574, 500014, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234572, 500015, 233464, "active", CURRENT_TIMESTAMP),
(1234573, 500015, 233464, "pending", CURRENT_TIMESTAMP),
(1234574, 500015, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234572, 500016, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234573, 500016, 233464, "inactive", CURRENT_TIMESTAMP),
(1234574, 500016, 233464, "active", CURRENT_TIMESTAMP),
(1234575, 500016, 233464, "pending", CURRENT_TIMESTAMP),
(1234576, 500016, 233464, "active", CURRENT_TIMESTAMP),
(2234573, 500016, 233464, "active", CURRENT_TIMESTAMP),
(1234567, 500017, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234572, 500017, 233464, "active", CURRENT_TIMESTAMP),
(1234572, 500018, 233464, "pending", CURRENT_TIMESTAMP),
(1234573, 500018, 233464, "active", CURRENT_TIMESTAMP),
(1234574, 500018, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234572, 500019, 233464, "active", CURRENT_TIMESTAMP),
(1234573, 500019, 233464, "pending", CURRENT_TIMESTAMP),
(1234574, 500019, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234572, 500020, 233464, "inactive", CURRENT_TIMESTAMP),
(1234573, 500020, 233464, "active", CURRENT_TIMESTAMP),
(1234574, 500020, 233464, "pending", CURRENT_TIMESTAMP),
(1234575, 500020, 233464, "active", CURRENT_TIMESTAMP),
(1234576, 500020, 233464, "active", CURRENT_TIMESTAMP),
(2234573, 500020, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234572, 500021, 233464, "active", CURRENT_TIMESTAMP),
(1234573, 500021, 233464, "pending", CURRENT_TIMESTAMP),
(1234574, 500021, 233464, "active", CURRENT_TIMESTAMP),
(1234575, 500021, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234576, 500021, 233464, "active", CURRENT_TIMESTAMP),
(2234573, 500021, 233464, "inactive", CURRENT_TIMESTAMP),
(1234572, 500022, 233464, "active", CURRENT_TIMESTAMP),
(1234573, 500022, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234574, 500022, 233464, "active", CURRENT_TIMESTAMP),
(1234567, 500023, 233464, "pending", CURRENT_TIMESTAMP),
(1234572, 500023, 233464, "active", CURRENT_TIMESTAMP),
(1234567, 500024, 233464, "active", CURRENT_TIMESTAMP),
(1234572, 500024, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234572, 500025, 233464, "active", CURRENT_TIMESTAMP),
(1234573, 500025, 233464, "pending", CURRENT_TIMESTAMP),
(1234574, 500025, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234572, 500026, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234573, 500026, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234574, 500026, 233464, "active", CURRENT_TIMESTAMP),
(1234572, 500027, 233464, "inactive", CURRENT_TIMESTAMP),
(1234573, 500027, 233464, "active", CURRENT_TIMESTAMP),
(1234574, 500027, 233464, "pending", CURRENT_TIMESTAMP),
(1234575, 500027, 233464, "active", CURRENT_TIMESTAMP),
(1234576, 500027, 233464, "pending-test", CURRENT_TIMESTAMP),
(2234573, 500027, 233464, "active", CURRENT_TIMESTAMP),
(1234572, 500028, 233464, "active", CURRENT_TIMESTAMP),
(1234573, 500028, 233464, "pending", CURRENT_TIMESTAMP),
(1234574, 500028, 233464, "active", CURRENT_TIMESTAMP),
(1234575, 500028, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234576, 500028, 233464, "active", CURRENT_TIMESTAMP),
(2234573, 500028, 233464, "inactive", CURRENT_TIMESTAMP),
(1234572, 500029, 233464, "active", CURRENT_TIMESTAMP),
(1234573, 500029, 233464, "pending", CURRENT_TIMESTAMP),
(1234574, 500029, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234572, 500030, 233464, "active", CURRENT_TIMESTAMP),
(1234573, 500030, 233464, "pending", CURRENT_TIMESTAMP),
(1234574, 500030, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234572, 500031, 233464, "pending", CURRENT_TIMESTAMP),
(1234573, 500031, 233464, "active", CURRENT_TIMESTAMP),
(1234574, 500031, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234567, 500032, 233464, "active", CURRENT_TIMESTAMP),
(1234572, 500032, 233464, "pending", CURRENT_TIMESTAMP),
(1234567, 500033, 233464, "active", CURRENT_TIMESTAMP),
(1234572, 500033, 233464, "active", CURRENT_TIMESTAMP),
(1234572, 500034, 233464, "inactive", CURRENT_TIMESTAMP),
(1234573, 500034, 233464, "active", CURRENT_TIMESTAMP),
(1234574, 500034, 233464, "active", CURRENT_TIMESTAMP),
(1234575, 500034, 233464, "pending", CURRENT_TIMESTAMP),
(1234576, 500034, 233464, "active", CURRENT_TIMESTAMP),
(2234573, 500034, 233464, "active", CURRENT_TIMESTAMP),
(1234572, 500035, 233464, "active", CURRENT_TIMESTAMP),
(1234573, 500035, 233464, "inactive", CURRENT_TIMESTAMP),
(1234574, 500035, 233464, "active", CURRENT_TIMESTAMP),
(1234575, 500035, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234576, 500035, 233464, "pending", CURRENT_TIMESTAMP),
(2234573, 500035, 233464, "active", CURRENT_TIMESTAMP),
(1234572, 500036, 233464, "pending", CURRENT_TIMESTAMP),
(1234573, 500036, 233464, "active", CURRENT_TIMESTAMP),
(1234574, 500036, 233464, "pending", CURRENT_TIMESTAMP),
(1234567, 500037, 233464, "pending", CURRENT_TIMESTAMP),
(1234572, 500037, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234572, 500038, 233464, "inactive", CURRENT_TIMESTAMP),
(1234573, 500038, 233464, "active", CURRENT_TIMESTAMP),
(1234574, 500038, 233464, "pending", CURRENT_TIMESTAMP),
(1234575, 500038, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234576, 500038, 233464, "pending", CURRENT_TIMESTAMP),
(2234573, 500038, 233464, "inactive", CURRENT_TIMESTAMP),
(1234572, 500039, 233464, "active", CURRENT_TIMESTAMP),
(1234573, 500039, 233464, "pending", CURRENT_TIMESTAMP),
(1234574, 500039, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234572, 500040, 233464, "active", CURRENT_TIMESTAMP),
(1234573, 500040, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234574, 500040, 233464, "pending", CURRENT_TIMESTAMP),
(1234572, 500041, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234573, 500041, 233464, "active", CURRENT_TIMESTAMP),
(1234574, 500041, 233464, "pending", CURRENT_TIMESTAMP),
(1234572, 500042, 233464, "inactive", CURRENT_TIMESTAMP),
(1234573, 500042, 233464, "active", CURRENT_TIMESTAMP),
(1234574, 500042, 233464, "active", CURRENT_TIMESTAMP),
(1234575, 500042, 233464, "pending", CURRENT_TIMESTAMP),
(1234576, 500042, 233464, "active", CURRENT_TIMESTAMP),
(2234573, 500042, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234572, 500043, 233464, "inactive", CURRENT_TIMESTAMP),
(1234573, 500043, 233464, "pending", CURRENT_TIMESTAMP),
(1234574, 500043, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234575, 500043, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234576, 500043, 233464, "active", CURRENT_TIMESTAMP),
(2234573, 500043, 233464, "active", CURRENT_TIMESTAMP),
(1234572, 500044, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234573, 500044, 233464, "active", CURRENT_TIMESTAMP),
(1234574, 500044, 233464, "pending", CURRENT_TIMESTAMP),
(1234572, 500045, 233464, "active", CURRENT_TIMESTAMP),
(1234573, 500045, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234574, 500045, 233464, "pending", CURRENT_TIMESTAMP),
(1234567, 500046, 233464, "active", CURRENT_TIMESTAMP),
(1234572, 500046, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234567, 500047, 233464, "active", CURRENT_TIMESTAMP),
(1234572, 500047, 233464, "pending", CURRENT_TIMESTAMP),
(1234572, 500048, 233464, "active", CURRENT_TIMESTAMP),
(1234573, 500048, 233464, "inactive", CURRENT_TIMESTAMP),
(1234574, 500048, 233464, "active", CURRENT_TIMESTAMP),
(1234572, 500049, 233464, "pending", CURRENT_TIMESTAMP),
(1234573, 500049, 233464, "inactive", CURRENT_TIMESTAMP),
(1234574, 500049, 233464, "active", CURRENT_TIMESTAMP),
(1234572, 500050, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234573, 500050, 233464, "inactive", CURRENT_TIMESTAMP),
(1234574, 500050, 233464, "active", CURRENT_TIMESTAMP),
(1234575, 500050, 233464, "active", CURRENT_TIMESTAMP),
(1234576, 500050, 233464, "pending", CURRENT_TIMESTAMP),
(2234577, 500050, 233464, "active", CURRENT_TIMESTAMP),
(1234567, 500051, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234572, 500051, 233464, "active", CURRENT_TIMESTAMP),
(1234567, 500052, 233464, "active", CURRENT_TIMESTAMP),
(1234572, 500052, 233464, "pending", CURRENT_TIMESTAMP),
(1234572, 500053, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234573, 500053, 233464, "inactive", CURRENT_TIMESTAMP),
(1234574, 500053, 233464, "pending", CURRENT_TIMESTAMP),
(1234572, 500054, 233464, "active", CURRENT_TIMESTAMP),
(1234573, 500054, 233464, "active", CURRENT_TIMESTAMP),
(1234574, 500054, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234575, 500054, 233464, "pending", CURRENT_TIMESTAMP),
(1234576, 500054, 233464, "pending", CURRENT_TIMESTAMP),
(2234573, 500054, 233464, "active", CURRENT_TIMESTAMP),
(1234572, 500055, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234573, 500055, 233464, "active", CURRENT_TIMESTAMP),
(1234574, 500055, 233464, "inactive", CURRENT_TIMESTAMP),
(1234567, 500056, 233464, "active", CURRENT_TIMESTAMP),
(1234572, 500056, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234572, 500057, 233464, "inactive", CURRENT_TIMESTAMP),
(1234573, 500057, 233464, "active", CURRENT_TIMESTAMP),
(1234574, 500057, 233464, "active", CURRENT_TIMESTAMP),
(1234572, 500058, 233464, "inactive", CURRENT_TIMESTAMP),
(1234573, 500058, 233464, "pending-test", CURRENT_TIMESTAMP),
(1234574, 500058, 233464, "active", CURRENT_TIMESTAMP),
(1234567, 500059, 233464, "pending", CURRENT_TIMESTAMP),
(1234572, 500059, 233464, "active", CURRENT_TIMESTAMP),
(1234572, 500060, 233464, "inactive", CURRENT_TIMESTAMP),
(1234573, 500060, 233464, "inactive", CURRENT_TIMESTAMP),
(1234574, 500060, 233464, "inactive", CURRENT_TIMESTAMP),
(1234567, 500061, 233464, "inactive", CURRENT_TIMESTAMP),
(1234572, 500061, 233464, "active", CURRENT_TIMESTAMP);

INSERT INTO waitlisted (`userid`, `waitlistid`)
VALUES
(2234574,422220),
(2234574,422229),
(2234574,422280),
(2234575,422220),
(2234575,422221),
(2234576,422280),
(3234567,422220),
(3234567,422221),
(3234567,422280),
(3234568,422220),
(3234568,422221),
(3234568,422280),
(3234569,422220),
(3234569,422221),
(3234569,422280),
(3234571,422220),
(3234571,422221),
(3234571,422280),
(3234572,422220),
(3234572,422221),
(3234572,422280),
(3234573,422220),
(3234573,422221),
(3234573,422280),
(3234574,422220),
(3234574,422221),
(3234574,422280),
(3234575,422220),
(3234575,422221),
(3234575,422280),
(3234576,422220),
(3234576,422221),
(3234576,422280);

INSERT INTO attendance(`date`, `userid`, `sectionid`,`schoolyearid`, `schoolid`, `status`, `lastAccessed`)
VALUES
("2015-03-07", 1234572, 500001, 233464, 863941, "active", CURRENT_TIMESTAMP),
("2015-03-07", 1234573, 500001, 233464, 863941, "active", CURRENT_TIMESTAMP),
("2015-03-07", 1234574, 500001, 233464, 863941, "active", CURRENT_TIMESTAMP),
("2015-03-07", 1234575, 500001, 233464, 863941, "active", CURRENT_TIMESTAMP),
("2015-03-07", 2234573, 500001, 233464, 863941, "active", CURRENT_TIMESTAMP),

("2015-03-14", 1234572, 500001, 233464, 863941, "active", CURRENT_TIMESTAMP),
("2015-03-14", 1234573, 500001, 233464, 863941, "active", CURRENT_TIMESTAMP),
("2015-03-14", 1234575, 500001, 233464, 863941, "active", CURRENT_TIMESTAMP),
("2015-03-14", 2234573, 500001, 233464, 863941, "active", CURRENT_TIMESTAMP),

("2015-03-21", 1234572, 500001, 233464, 863941, "active", CURRENT_TIMESTAMP),
("2015-03-21", 1234573, 500001, 233464, 863941, "active", CURRENT_TIMESTAMP),
("2015-03-21", 1234574, 500001, 233464, 863941, "active", CURRENT_TIMESTAMP),
("2015-03-21", 1234575, 500001, 233464, 863941, "active", CURRENT_TIMESTAMP),
("2015-03-21", 2234573, 500001, 233464, 863941, "active", CURRENT_TIMESTAMP),

("2015-03-28", 1234572, 500001, 233464, 863941, "active", CURRENT_TIMESTAMP),
("2015-03-28", 1234574, 500001, 233464, 863941, "active", CURRENT_TIMESTAMP),
("2015-03-28", 1234575, 500001, 233464, 863941, "active", CURRENT_TIMESTAMP),
("2015-03-28", 2234573, 500001, 233464, 863941, "active", CURRENT_TIMESTAMP),

("2015-03-02", 1234567, 500012, 233464, 863941, "active", CURRENT_TIMESTAMP),
("2015-03-02", 1234572, 500012, 233464, 863941, "active", CURRENT_TIMESTAMP),

("2015-03-06", 1234567, 500012, 233464, 863941, "active", CURRENT_TIMESTAMP),

("2015-03-09", 1234567, 500012, 233464, 863941, "active", CURRENT_TIMESTAMP),
("2015-03-09", 1234572, 500012, 233464, 863941, "active", CURRENT_TIMESTAMP),

("2015-03-13", 1234567, 500012, 233464, 863941, "active", CURRENT_TIMESTAMP),
("2015-03-13", 1234572, 500012, 233464, 863941, "active", CURRENT_TIMESTAMP),

("2015-03-16", 1234567, 500012, 233464, 863941, "active", CURRENT_TIMESTAMP),
("2015-03-16", 1234572, 500012, 233464, 863941, "active", CURRENT_TIMESTAMP),

("2015-03-20", 1234572, 500012, 233464, 863941, "active", CURRENT_TIMESTAMP),

("2015-03-23", 1234567, 500012, 233464, 863941, "active", CURRENT_TIMESTAMP),
("2015-03-23", 1234572, 500012, 233464, 863941, "active", CURRENT_TIMESTAMP),

("2015-03-27", 1234572, 500012, 233464, 863941, "active", CURRENT_TIMESTAMP),

("2015-03-30", 1234567, 500012, 233464, 863941, "active", CURRENT_TIMESTAMP),
("2015-03-30", 1234572, 500012, 233464, 863941, "active", CURRENT_TIMESTAMP);

INSERT INTO marks (`docid`, `userid`, `mark`,`schoolyearid`, `status`, `lastAccessed`)
VALUES
(111112, 1234572, 8, 233464, "active", CURRENT_TIMESTAMP),
(111112, 1234573, 9, 233464, "active", CURRENT_TIMESTAMP),
(111112, 1234574, 10, 233464, "active", CURRENT_TIMESTAMP),
(111112, 1234575, 10, 233464, "active", CURRENT_TIMESTAMP),
(111112, 1234576, 2, 233464, "active", CURRENT_TIMESTAMP),
(111112, 2234573, 5, 233464, "active", CURRENT_TIMESTAMP),

(211112, 1234572, 9, 233464, "active", CURRENT_TIMESTAMP),
(211112, 1234573, 10, 233464, "active", CURRENT_TIMESTAMP),
(211112, 1234574, 9, 233464, "active", CURRENT_TIMESTAMP),
(211112, 1234575, 5, 233464, "active", CURRENT_TIMESTAMP),
(211112, 1234576, 4, 233464, "active", CURRENT_TIMESTAMP),
(211112, 2234573, 6, 233464, "active", CURRENT_TIMESTAMP),

(111123, 1234567, 4, 233464, "active", CURRENT_TIMESTAMP),
(111123, 1234572, 6, 233464, "active", CURRENT_TIMESTAMP);

INSERT into apikeys(`keyid`, `name`) values ('C_s6D7OmZEgKBIspAvuBcw', 'mandrill');";


    // set up tables
    $fixtureDataSet = $this->getDataSet($this->fixtures);
    foreach ($fixtureDataSet->getTableNames() as $table) {
        // drop table
        $pdo->exec("DROP TABLE IF EXISTS `$table`;");
        // recreate table
        $meta = $fixtureDataSet->getTableMetaData($table);
        $create = "CREATE TABLE IF NOT EXISTS `$table` ";
        $cols = array();
        foreach ($meta->getColumns() as $col) {
            $cols[] = "`$col` VARCHAR(200)";
        }
        $create .= '('.implode(',', $cols).');';
        $pdo->exec($create);
    }

    parent::setUp();
}

//after every test function. clears db
public function tearDown() {
    $allTables =
    $this->getDataSet($this->fixtures)->getTableNames();
    foreach ($allTables as $table) {
        // drop table
        $conn = $this->getConnection();
        $pdo = $conn->getConnection();
        $pdo->exec("DROP TABLE IF EXISTS `$table`;");
    }

    parent::tearDown();
}



//---------------------------------------------------------------------------------------------------------------------------------------------



// ACTUAL TEST FUNCTIONS BEGIN




public function testSchoolYears(){

	// test get school years
	$this->assertEquals($this->getConnection()->getSchoolYears(), 
		array(
			array("schoolyearid" => 123456, "schoolyear" => "2013-2014", "status" => "inactive", "openForReg" => 0),
			array("schoolyearid" => 122334, "schoolyear" => "2014-2015", "status" => "inactive", "openForReg" => 0),
			array("schoolyearid" => 122335, "schoolyear" => "2015S", "status" => "inactive", "openForReg" => 0),
			array("schoolyearid" => 233464, "schoolyear" => "2015-2016", "status" => "active", "openForReg" => 1),
			array("schoolyearid" => 876390, "schoolyear" => "2016-2017", "status" => "inactive", "openForReg" => 1)));

	// UT04 test get active schoolyear
	$this->assertEquals($this->getConnection()->getActiveSchoolYear(), 
		array("schoolyearid" => 233464, "schoolyear" => "2015-2016", "status" => "active", "openForReg" => 1));

	// UT05 test create schoolyear, test to see if its there now.
	//EDIT: this was manually tested instead.
}


public function testSchools(){

	//test get schools
	$this->assertEquals($this->getConnection()->getSchoolYears(), 
		array(
			array("schoolid" => 863941, "location" => "Surrey", "postalCode" => "v7s3j5", "yearOpened" => "2005", "status" => "active", "lastAccessed" => "1171502725"),
			array("schoolid" => 868731, "location" => "Toronto", "postalCode" => "b7l1kc", "yearOpened" => "2015", "status" => "active", "lastAccessed" => "1171502725"),
			array("schoolid" => 783941, "location" => "London", "postalCode" => "v8d3s4", "yearOpened" => "2015", "status" => "active", "lastAccessed" => "1171502725"),
			array("schoolid" => 872341, "location" => "Calgay", "postalCode" => ""v7d9d7", "yearOpened" => "2016", "status" => "active", "lastAccessed" => "1171502725")));

	// UT07 test get school by id
	$this->assertEquals($this->getConnection()->getSchoolByID(863941), 
		array("schoolid" => 863941, "location" => "Surrey", "postalCode" => "v7s3j5", "yearOpened" => "2005", "status" => "active", "lastAccessed" => "1171502725"));
	
}


public function testDepartments(){

	// test get departments
	$this->assertEquals(sizeof($this->getConnection()->getDepartments()), 92));

	//test get dept by id
	$this->assertEquals($this->getConnection()->getDepartmentByID(544434), 
		array("deptid" => 544434, "schoolid" => 863941, "deptName" => Gurmukhi", "schoolyearid" => 876390, "status" => "active", "lastAccessed" => "1171502725"));
}


public function testCourses(){

	// test get courses
	$this->assertEquals(sizeof($this->getConnection()->getCourses()), 39); 

	// test get course by id
	$this->assertEquals($this->getConnection()->getDepartmentByID(544434), 
		array("deptid" => 544434, "schoolid" => 863941, "deptName" => "Gurmukhi", "schoolyearid" => 876390, "status" => "active", "lastAccessed" => "1171502725"));
}

public function testSections(){

	// test get sections
	$this->assertEquals(sizeof($this->getConnection()->getSections()), 61); 

	// test get sections by school (chose surrey, 2015-2016)
	$this->assertEquals(sizeof($this->getConnection()->getSectionsBySchool(233464, 876390)), 61);
	

	// test get sections by day
	$this->assertEquals(sizeof($this->getConnection()->getSectionsBySchool(863941, $WED)), 12); 

	// test get sections by ID
	$this->assertEquals($this->getConnection()->getSectionsByID(500000), 
		array("sectionid" => "500000", "courseid" => "422220", "sectionCode" => "1B", "day" => "SAT, SUN", "startTime" => "17:15:00", "endTime" => "18:15:00", "roomCapacity" => "50", "roomLocation" => "#3", "classSize" => "43", "schoolyearid" => 233464, "status" => "active", "lastAccessed" => "1171502725")); 

	// test get students Enrolled
	$this->assertEquals(sizeof($this->getConnection()->getStudentsEnrolled(500000)), 4); 

	// test get section teachers
	$this->assertEquals($this->getConnection()->getSectionTeachers(422221), 
		array(
			array("userid" => "5534582", "username" => "ymoto34582", "password" => "'$2a$10$fetLW9De7G0DgtMDp1chNu2tIz8KsybJqToiEloO.frMUfye8p/kq", "usertype" => "T", "lastAccessed" => "1171502725"))); 

	// test assign section teachers
	//EDIT: This was manually tested instead

	// test enroll student
	//EDIT: This was manually tested instead
	
	// test input attendance
	// EDIT: This was manually tested instead

	// Test get average attendance
	$this->assertEquals($this->getConnection()->getAvgAttendance(5000001), "75%"); 

	// test get student grade for section
	$this->assertEquals($this->getConnection()->getStudentGradeForSection(500001, 1234572), "85%"); 
	
}


public function testDocuments(){
	// test get documents
	$this->assertEquals(sizeof($this->getConnection()->getDocuments()), 85); 

	// test get documents by id
	$this->assertEquals($this->getConnection()->getDocumentsByID(111111), 
		array("docid" => 111111, "docName" => "Assignment1", "description" => "", "link" => "http://en.wikipedia.org/wiki/Dragon_Ball_Z", "sectionid" => "500000", "userid" => "5534581", "fullmark" => 10, "schoolyearid" => "233464", "status" => "active", "lastAccessed" => "1171502725"));

	// test get documents by section
	$this->assertEquals($this->getConnection()->getDocumentsBySection(500000), 
		array(
			array("docid" => 111111, "docName" => "Assignment1", "description" => "", "link" => "http://en.wikipedia.org/wiki/Dragon_Ball_Z", "sectionid" => "500000", "userid" => "5534581", "fullmark" => 10, "schoolyearid" => "233464", "status" => "active", "lastAccessed" => "1171502725"),
			array("docid" => 211111, "docName" => "Assignment2", "description" => "", "link" => "http://en.wikipedia.org/wiki/Dragon_Ball_Z", "sectionid" => "500000", "userid" => "5534577", "fullmark" => 10, "schoolyearid" => "233464", "status" => "active", "lastAccessed" => "1171502725")));

	// test get documents by course
	$this->assertEquals($this->getConnection()->getDocumentsByCourse(422220), 
		array(
			array("docid" => 111111, "docName" => "Assignment1", "description" => "", "link" => "http://en.wikipedia.org/wiki/Dragon_Ball_Z", "sectionid" => "500000", "userid" => "5534581", "fullmark" => 10, "schoolyearid" => "233464", "status" => "active", "lastAccessed" => "1171502725"),
			array("docid" => 211111, "docName" => "Assignment2", "description" => "", "link" => "http://en.wikipedia.org/wiki/Dragon_Ball_Z", "sectionid" => "500000", "userid" => "5534577", "fullmark" => 10, "schoolyearid" => "233464", "status" => "active", "lastAccessed" => "1171502725")
			array("docid" => 111122, "docName" => "Assignment1", "description" => "", "link" => "http://en.wikipedia.org/wiki/Dragon_Ball_Z", "sectionid" => "500011", "userid" => "5534577", "fullmark" => 10, "schoolyearid" => "233464", "status" => "active", "lastAccessed" => "1171502725")
			array("docid" => 211122, "docName" => "Assignment2", "description" => "", "link" => "http://en.wikipedia.org/wiki/Dragon_Ball_Z", "sectionid" => "500011", "userid" => "5534579", "fullmark" => 10, "schoolyearid" => "233464", "status" => "active", "lastAccessed" => "1171502725")));

	// test input marks
	// EDIT: This was manually tested instead
}


public function testStudents(){

	// test get students
	$this->assertEquals(sizeof($this->getConnection()->getStudents()), 22));

	//test get students by id
	$this->assertEquals($this->getConnection()->getStudentByID(3234576), 
		array("userid" => 544434, "firstName" => "Jessica", "lastName" => "Simpson", "dateOfBirth" => "1980-03-12", "gender" => "M", "streetAddr1" => "1234 Rodeo Dr", "streetAddr2" => "", "city" => "Vancouver", "province" => "BC", "country" => "Canada", "postalCode" => "V6T1W9", "phoneNumber" => "1234567890", "emailAddr" => "marshawn@test.com", "allergies" => earl@test.com", "allergies" => "", "prevSchools" => "", "parentFirestName" => "Nina", "parentLastName" => "Dobrev", "parentPhoneNumber" => "0987654321", "parentEmailAddr" => "nina@test.com", "emergencyContactFirstName" => "Kam", "emergencyContactLastName" => "Chancellor", "emergencyContactRelation" => "bro", "emergencyContactPhoneNumber" => "0987654321", "schoolid" => 863941, "paid" => "T", "status" => "active", "lastAccessed" => "1171502725"));
	
	// test get enrolled sections
	$this->assertEquals($this->getConnection()->getEnrolledSections(3234575, 1, "active"),
		array(
			array("sectionid" => "500000", "courseid" => "422220", "sectionCode" => "1B", "day" => "SAT, SUN", "startTime" => "17:15:00", "endTime" => "18:15:00", "roomCapacity" => "50", "roomLocation" => "#3", "classSize" => "43", "schoolyearid" => 233464, "status" => "active", "lastAccessed" => "1171502725"))); 

	// test create student
	// EDIT: This was manually tested instead

}



public function testTeachers(){

	// test get teachers
	$this->assertEquals(sizeof($this->getConnection()->getTeachers()), 4));

	//test get teachers by id
	$this->assertEquals($this->getConnection()->getTeachersByID(5534577), 
		array("userid" => 5534577, "schoolid" => 863941, "firstName" => "Naruto", "lastName" => "Uzumaki", "emailAddr" => "test@gmail.com", "status" => "active", "usertype" => "T"));

	// test get course competencies
	$this->assertEquals($this->getConnection()->getcourseCompetencies(5534577), 
		array(
			array("userid" => 5534577, "deptid" => 544431, "level" => 3, "status" => "active", "lastAccessed" => "1171502725"),
			array("userid" => 5534577, "deptid" => 544433, "level" => 2, "status" => "active", "lastAccessed" => "1171502725"),
			array("userid" => 5534577, "deptid" => 544439, "level" => 2, "status" => "active", "lastAccessed" => "1171502725"),
			array("userid" => 5534577, "deptid" => 544438, "level" => 1, "status" => "active", "lastAccessed" => "1171502725"),
			array("userid" => 5534577, "deptid" => 544441, "level" => 3, "status" => "active", "lastAccessed" => "1171502725"),
			array("userid" => 5534577, "deptid" => 544432, "level" => 1, "status" => "active", "lastAccessed" => "1171502725"),
			array("userid" => 5534577, "deptid" => 544442, "level" => 3, "status" => "active", "lastAccessed" => "1171502725")));
}


public function testAdministrators(){

	// test get administrators
	$this->assertEquals(sizeof($this->getConnection()->getAdministrators()), 1));

	//test get teachers by id
	$this->assertEquals($this->getConnection()->getDepartmentByID(5534577), 
		array("userid" => 5534582, "schoolid" => 863941, "firstName" => "Yugi", "lastName" => "Moto", "emailAddr" => "test@gmail.com", "status" => "active", "usertype" => "A"));
}

public function testSuperUsers(){

	// test get superusers
	$this->assertEquals($this->getConnection()->getSuperusers(), 
		array(
			array("userid" => 5534576, "firstName" => "Professor", "lastName" => "Oak", "emailAddr" => "test@gmail.com", "status" => "active"),
			array("userid" => 5512345, "firstName" => "Severus", "lastName" => "Snape", "emailAddr" => "test@gmail.com", "status" => "active")));

	//test get superusers by id
	$this->assertEquals($this->getConnection()->getSuperuserByID(5512345), 
		array("userid" => 5512345, "firstName" => "Severus", "lastName" => "Snape", "emailAddr" => "test@gmail.com", "status" => "active"));
}



public function testUsers(){

	// test get users
	$this->assertEquals(sizeof($this->getConnection()->getUsers(863941, "T")), 4));
	$this->assertEquals(sizeof($this->getConnection()->getUsers(863941, "S")), 22));
	$this->assertEquals(sizeof($this->getConnection()->getUsers(863941, "A")), 1));
	$this->assertEquals(sizeof($this->getConnection()->getUsers(863941, "SU")), 2));
	$this->assertEquals(sizeof($this->getConnection()->getUsers(868731, "T")), 0));

	//test find user
	//EDIT: This was manually tested instead

	// test find students with advanced criteria
	//EDIT: This was manually tested instead
}

public function testPurge(){

	// test purge
	
	
}

