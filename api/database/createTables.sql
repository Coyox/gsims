USE gobind;


--
-- Create tables
--

CREATE TABLE IF NOT EXISTS `schoolyear` (
  `schoolyearid` int(11) PRIMARY KEY NOT NULL,
  `schoolyear` char(9) NOT NULL,
  `status` char(8) NOT NULL,
  `openForReg` tinyint(1) NOT NULL
);


CREATE TABLE IF NOT EXISTS `school` (
  `schoolid` int(11) PRIMARY KEY NOT NULL,
  `location` varchar(50) NOT NULL,
  `postalCode` char(6) NOT NULL,
  `yearOpened` year NOT NULL,
  `status` char(8) NOT NULL,
  `openForReg` tinyint(1) NOT NULL,
  `lastAccessed` timestamp NOT NULL default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `school_schoolyear` (
  `schoolid` int(11) NOT NULL,
  `schoolyearid` int(11) NOT NULL,
  `status` char(8) NOT NULL,
  PRIMARY KEY(`schoolid`, `schoolyearid`),
  FOREIGN KEY (`scholid`) REFERENCES `school` (`schoolid`) ON DELETE CASCADE,
  FOREIGN KEY (`schoolyearid`) REFERENCES `schoolyear` (`schoolyearid`) ON DELETE CASCADE
 );


CREATE TABLE IF NOT EXISTS `department` (
  `deptid` int(11) PRIMARY KEY NOT NULL,
  `schoolid` int(11) NOT NULL,
  `deptName` varchar(50) NOT NULL,
  `schoolyearid` int(11) NOT NULL,
  `status` char(8) NOT NULL,
  `lastAccessed` timestamp NOT NULL default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`schoolid`) REFERENCES `school` (`schoolid`) ON DELETE CASCADE,
  FOREIGN KEY (`schoolyearid`) REFERENCES `schoolyear` (`schoolyearid`) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS `course` (
  `courseid` int(11) PRIMARY KEY NOT NULL,
  `courseName` varchar(50) NOT NULL,
  `description` varchar(255) NOT NULL,
  `deptid` int(11) NOT NULL,
  `schoolyearid` int(11) NOT NULL,
  `status` char(8) NOT NULL,
  `lastAccessed` timestamp NOT NULL default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`deptid`) REFERENCES `department` (`deptid`) ON DELETE CASCADE,
  FOREIGN KEY (`schoolyearid`) REFERENCES `schoolyear` (`schoolyearid`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `prereqs` (
  `courseid` int(11) NOT NULL,
  `prereq` int(11) NOT NULL,
  PRIMARY KEY (`courseid`, `prereq`),
  FOREIGN KEY (`courseid`) REFERENCES `course` (`courseid`) ON DELETE CASCADE,
  FOREIGN KEY (`prereq`) REFERENCES `course` (`courseid`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `login` (
  `userid` int(11) PRIMARY KEY NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255)  NOT NULL,
  `usertype` char(2) NOT NULL,
  `lastLogin` timestamp
);

CREATE TABLE IF NOT EXISTS `teacher` (
  `userid` int(11) PRIMARY KEY NOT NULL,
  `schoolid` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `emailAddr` varchar(50) NOT NULL,
  `status` char(8) NOT NULL,
  `usertype` char(2) NOT NULL,
  `lastAccessed` timestamp NOT NULL default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userid`) REFERENCES `login` (`userid`) ON DELETE CASCADE,
  FOREIGN KEY (`schoolid`) REFERENCES `school` (`schoolid`)
);


CREATE TABLE IF NOT EXISTS `superuser` (
  `userid` int(11) PRIMARY KEY NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `emailAddr` varchar(50) NOT NULL,
  `status` char(8) NOT NULL,
  `lastAccessed` timestamp NOT NULL default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userid`) REFERENCES `login` (`userid`) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS `student` (
  `userid` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `dateOfBirth` date NOT NULL,
  `gender` enum('M','F') NOT NULL,
  `streetAddr1` varchar(50) NOT NULL,
  `streetAddr2` varchar(50) NOT NULL default '',
  `city` varchar(50) NOT NULL,
  `province` char(2) NOT NULL,
  `country` varchar(50) NOT NULL,
  `postalCode` char(6) NOT NULL,
  `phoneNumber` char(11) NOT NULL,
  `emailAddr` varchar(50) NOT NULL,
  `allergies` varchar(255) NOT NULL default '',
  `prevSchools` varchar(50)NOT NULL default '',
  `parentFirstName` varchar(50) NOT NULL,
  `parentLastName` varchar(50) NOT NULL,
  `parentPhoneNumber` char(11) NOT NULL,
  `parentEmailAddr` varchar(50) NOT NULL,
  `emergencyContactFirstName` varchar(50) NOT NULL,
  `emergencyContactLastName` varchar(50) NOT NULL,
  `emergencyContactRelation` varchar(15) NOT NULL,
  `emergencyContactPhoneNumber` char(11) NOT NULL,
  `schoolid` int(11) NOT NULL,
  `paid` tinyint(1) NOT NULL default '0',
  `status` char(15) NOT NULL,
  `lastAccessed` timestamp NOT NULL default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`, `schoolid`),
  FOREIGN KEY (`userid`) REFERENCES `login` (`userid`) ON DELETE CASCADE,
  FOREIGN KEY (`schoolid`) REFERENCES `school` (`schoolid`)
);

CREATE TABLE IF NOT EXISTS `section` (
  `sectionid` int(11) PRIMARY KEY NOT NULL,
  `courseid` int(11)  NOT NULL,
  `sectionCode` varchar(50) NOT NULL,
  `day` set('MON','TUE','WED','THU','FRI','SAT','SUN') NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  `roomCapacity` smallint(5) NOT NULL,
  `roomLocation` varchar(50) NOT NULL,
  `classSize` int(5) NOT NULL,
  `schoolyearid` int(11) NOT NULL,
  `status` char(8) NOT NULL,
  `lastAccessed` timestamp NOT NULL default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`courseid`) REFERENCES `course` (`courseid`) ON DELETE CASCADE,
  FOREIGN KEY (`schoolyearid`) REFERENCES `schoolyear` (`schoolyearid`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `document` (
  `docid` int(11) PRIMARY KEY NOT NULL,
  `docName` varchar(50)  NOT NULL,
  `description` varchar(50) NOT NULL,
  `link` varchar(255),
  `sectionid` int(11) NOT NULL,
  `userid` int(11),
  `fullmark` smallint(5),
  `schoolyearid` int(11) NOT NULL,
  `status` char(8) NOT NULL,
  `lastAccessed` timestamp NOT NULL default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userid`) REFERENCES `login` (`userid`) ON DELETE SET NULL,
  FOREIGN KEY (`sectionid`) REFERENCES `section` (`sectionid`) ON DELETE CASCADE,
  FOREIGN KEY (`schoolyearid`) REFERENCES `schoolyear` (`schoolyearid`) ON DELETE CASCADE
);


 CREATE TABLE IF NOT EXISTS `attendance` (
  `date` date NOT NULL,
  `userid` int(11) NOT NULL,
  `sectionid` int(11) NOT NULL,
  `schoolyearid` int(11) NOT NULL,
  `schoolid` int(11) NOT NULL,
  `status` char(8) NOT NULL,
  `lastAccessed` timestamp NOT NULL default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`, `sectionid`, `date`),
  FOREIGN KEY (`userid`) REFERENCES `login` (`userid`) ON DELETE CASCADE,
  FOREIGN KEY (`schoolid`) REFERENCES `school` (`schoolid`) ON DELETE CASCADE,
  FOREIGN KEY (`sectionid`) REFERENCES `section` (`sectionid`) ON DELETE CASCADE,
  FOREIGN KEY (`schoolyearid`) REFERENCES `schoolyear` (`schoolyearid`) ON DELETE CASCADE
);


 CREATE TABLE IF NOT EXISTS `enrollment` (
  `userid` int(11) NOT NULL,
  `sectionid` int(11) NOT NULL,
  `schoolyearid` int(11) NOT NULL,
  `status` char(15) NOT NULL,
  `lastAccessed` timestamp NOT NULL default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`, `sectionid`, `schoolyearid`),
  FOREIGN KEY (`userid`) REFERENCES `student` (`userid`) ON DELETE CASCADE,
  FOREIGN KEY (`sectionid`) REFERENCES `section` (`sectionid`) ON DELETE CASCADE,
  FOREIGN KEY (`schoolyearid`) REFERENCES `schoolyear` (`schoolyearid`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `waitlisted` (
  `userid` int(11) NOT NULL,
  `waitlistid` int(11) NOT NULL,
  PRIMARY KEY (`userid`, `waitlistid`),
  FOREIGN KEY (`userid`) REFERENCES `student` (`userid`) ON DELETE CASCADE,
  FOREIGN KEY (`waitlistid`) REFERENCES `course` (`courseid`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `marks` (
  `docid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `mark` float  NOT NULL,
  `schoolyearid` int(11) NOT NULL,
  `status` char(8) NOT NULL,
  `lastAccessed` timestamp NOT NULL default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`docid`,`userid`, `schoolyearid`),
  FOREIGN KEY (`docid`) REFERENCES `document` (`docid`) ON DELETE CASCADE,
  FOREIGN KEY (`userid`) REFERENCES `student` (`userid`) ON DELETE CASCADE,
  FOREIGN KEY (`schoolyearid`) REFERENCES `schoolyear` (`schoolyearid`) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS `teacherCourseCompetency` (
  `userid` int(11) NOT NULL,
  `deptid` int(11) NOT NULL,
  `level` smallint(5)  NOT NULL,
  `status` char(8) NOT NULL,
  `lastAccessed` timestamp NOT NULL default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`,`deptid`),
  FOREIGN KEY (`userid`) REFERENCES `teacher` (`userid`) ON DELETE CASCADE,
  FOREIGN KEY (`deptid`) REFERENCES `department` (`deptid`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `teachingSection` (
  `userid` int(11) NOT NULL,
  `sectionid` int(11) NOT NULL,
  PRIMARY KEY (`userid`,`sectionid`),
  FOREIGN KEY (`userid`) REFERENCES `teacher` (`userid`) ON DELETE CASCADE,
  FOREIGN KEY (`sectionid`) REFERENCES `section` (`sectionid`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `teachingCourse` (
  `userid` int(11) NOT NULL,
  `courseid` int(11) NOT NULL,
  PRIMARY KEY (`userid`,`courseid`),
  FOREIGN KEY (`userid`) REFERENCES `teacher` (`userid`) ON DELETE CASCADE,
  FOREIGN KEY (`courseid`) REFERENCES `course` (`courseid`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `apikeys` (
  `keyid` varchar(255) NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`keyid`, `name`)
);


CREATE TABLE IF NOT EXISTS `student_year` (
  `userid` int(11) NOT NULL,
  `schoolyearid` int(11) NOT NULL,
  PRIMARY KEY (`userid`, `schoolyearid`),
  FOREIGN KEY (`userid`) REFERENCES `student` (`userid`) ON DELETE CASCADE,
  FOREIGN KEY (`schoolyearid`) REFERENCES `schoolyear` (`schoolyearid`) ON DELETE CASCADE
);