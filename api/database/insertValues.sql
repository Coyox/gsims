USE gobind;

INSERT INTO teacher (`userid`, `schoolid`, `firstName`, `lastName`, `emailAddr`, `status`, `usertype`)
VALUES(341231, 412312, "Harry", "Potter", "test@gmail.com", "active", "T"),
(341232, 412312, "Shanifer, Seit", "test1@gmail.com", "active", "T"),
(341331, 412312, "Claire", "Barretto", "test2@gmail.com", "active", "T"),
(341531, 412312, "Cassandra", "Lim", "test3@gmail.com", "active", "T")

;

-- INSERT STUDENTS/LOGIN --

INSERT INTO `gobind`.`login` (`userid`, `username`, `password`, `usertype`, `lastLogin`) 
VALUES ('1234567', 'KYLE@test.com', 'pass1', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`) 
values(1234567, "Kyle", "Seager", "1980-09-24", "M", "123 4th St", "", "Surrey",
    "BC", "Canada", "V6T1W9", "1234567890", "KYLE@test.com", "", "", "Dustin", "Ackley",
    "0987654321", "dustin@test.com", "Bob", "Seager", "brother",
    "7781234567", 412312, "T", "active", CURRENT_TIMESTAMP);


INSERT INTO `gobind`.`login` (`userid`, `username`, `password`, `usertype`, `lastLogin`) 
VALUES ('1234568', 'robinson@test.com', 'pass1', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`) 
values(1234568, "Robinson", "Cano", "1982-05-13", "M", "888 4th St", "", "Richmond",
    "BC", "Canada", "V6T1W9", "1234567890", "robinson@test.com", "", "", "Felix", "Hernandez",
    "0987654321", "felix@test.com", "Nelson", "Cruz", "uncle",
    "7781234567", 412312, "T", "active", CURRENT_TIMESTAMP);


INSERT INTO `gobind`.`login` (`userid`, `username`, `password`, `usertype`, `lastLogin`) 
VALUES ('1234569', 'arod@test.com', 'pass1', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`) 
values(1234569, "Alex", "Rodriguez", "1973-02-17", "M", "123 10th Ave", "", "Burnaby",
    "BC", "Canada", "V6T1W9", "1234567890", "arod@test.com", "", "", "Derek", "Jeter",
    "0987654321", "derek@test.com", "Bio", "Genisis", "brother",
    "7781234567", 412312, "T", "active", CURRENT_TIMESTAMP);


INSERT INTO `gobind`.`login` (`userid`, `username`, `password`, `usertype`, `lastLogin`) 
VALUES ('1234571', 'kim@test.com', 'pass1', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`) 
values(1234571, "Kim", "Kardashian", "1980-09-24", "M", "1234 Rodeo Dr", "", "Beverly Hills",
    "BC", "Canada", "90210", "1234567890", "kim@test.com", "", "", "Kanye", "West",
    "0987654321", "kanye@test.com", "Kourtney", "Kardashian", "sister",
    "7781234567", 412312, "T", "active", CURRENT_TIMESTAMP);


INSERT INTO `gobind`.`login` (`userid`, `username`, `password`, `usertype`, `lastLogin`) 
VALUES ('1234572', 'kanye@test.com', 'pass1', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`) 
values(1234572, "Kanye", "West", "1980-03-12", "M", "1234 Rodeo Dr", "", "Beverly Hills",
    "BC", "Canada", "90210", "1234567890", "kanye@test.com", "", "", "Jay", "Z",
    "0987654321", "jayz@test.com", "Kim", "Kardashian", "wifey",
    "7781234567", 412312, "T", "active", CURRENT_TIMESTAMP);


INSERT INTO `gobind`.`login` (`userid`, `username`, `password`, `usertype`, `lastLogin`) 
VALUES ('1234573', 'richard@test.com', 'pass1', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`) 
values(1234573, "Richard", "Sherman", "1987-03-11", "M", "43134 5th Ave", "", "Vancouver",
    "BC", "Canada", "V6T1W9", "1234567890", "richard@test.com", "", "", "Kam", "Chancellor",
    "0987654321", "kam@test.com", "Earl", "Thomas", "bro",
    "7781234567", 412312, "T", "active", CURRENT_TIMESTAMP);


INSERT INTO `gobind`.`login` (`userid`, `username`, `password`, `usertype`, `lastLogin`) 
VALUES ('1234574', 'russell@test.com', 'pass1', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`) 
values(1234574, "Russell", "Wilson", "1980-03-12", "M", "1234 Rodeo Dr", "", "Delta",
    "BC", "Canada", "V6T1W9", "1234567890", "russell@test.com", "", "", "Marshawn", "Lynch",
    "0987654321", "marshawn@test.com", "pete", "carroll", "coach",
    "7781234567", 412312, "T", "active", CURRENT_TIMESTAMP);


INSERT INTO `gobind`.`login` (`userid`, `username`, `password`, `usertype`, `lastLogin`) 
VALUES ('1234575', 'marshawn@test.com', 'pass1', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`) 
values(1234575, "Beast", "Mode", "1980-03-12", "M", "1234 Seahawks Way", "", "Vancouver",
    "BC", "Canada", "V6T1W9", "1234567890", "marshawn@test.com", "", "", "Pete", "Carroll",
    "0987654321", "pete@test.com", "Richard", "Sherman", "teammate",
    "7781234567", 412312, "T", "active", CURRENT_TIMESTAMP);


INSERT INTO `gobind`.`login` (`userid`, `username`, `password`, `usertype`, `lastLogin`) 
VALUES ('1234576', 'earl@test.com', 'pass1', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`) 
values(1234576, "Earl", "Thomas", "1980-03-12", "M", "1234 Rodeo Dr", "", "Vancouver",
    "BC", "Canada", "V6T1W9", "1234567890", "earl@test.com", "", "", "Nina", "Dobrev",
    "0987654321", "nina@test.com", "Kam", "Chancellor", "bro",
    "7781234567", 412312, "T", "active", CURRENT_TIMESTAMP);


-- INSERT DEPARTMENTS --

INSERT INTO `department`(`deptid`, `schoolid`, `deptName`, `schoolyearid`, `status`, `lastAccessed`) 
VALUES (444444, 412312, "Gurmukhi", 100000, "active", CURRENT_TIMESTAMP),
(444441, 412312, "Little Khalsa Club", 100000, "active", CURRENT_TIMESTAMP),
(444442, 412312, "Tantee Saaj", 100000, "active", CURRENT_TIMESTAMP),
(444443, 412312, "Santhiya", 100000, "active", CURRENT_TIMESTAMP),
(444445, 412312, "Waga", 100000, "active", CURRENT_TIMESTAMP),
(444446, 412312, "Tabla", 100000, "active", CURRENT_TIMESTAMP),
(444447, 412312, "Gatka", 100000, "active", CURRENT_TIMESTAMP),
(444448, 412312, "Sikh History", 100000, "active", CURRENT_TIMESTAMP),
(444449, 412312, "Extra Help", 100000, "active", CURRENT_TIMESTAMP),
(444450, 412312, "Dastar", 100000, "active", CURRENT_TIMESTAMP),
(444451, 412312, "Girls Activity", 100000, "active", CURRENT_TIMESTAMP),
(444452, 412312, "SSGS Pothi", 100000, "active", CURRENT_TIMESTAMP);


-- INSERT COURSES --
INSERT INTO `course`(`courseid`, `courseName`, `description`, `deptid`, `schoolyearid`, `status`, `lastAccessed`) 
VALUES 
(222220, "Little Khalsa Club Level 2", "", 444441, 100000, "active", CURRENT_TIMESTAMP),
(222221, "Little Khalsa Club Level 2", "", 444441, 100000, "active", CURRENT_TIMESTAMP),
(222222, "Gurmukhi Beg", "", 444444, 100000, "active", CURRENT_TIMESTAMP),
(222223, "Gurmukhi Beg Adult", "", 444444, 100000, "active", CURRENT_TIMESTAMP),
(222224, "Gurmukhi Intermediate", "", 444444, 100000, "active", CURRENT_TIMESTAMP),
(222225, "Tantee Saaj Advance", "", 444442, 100000, "active", CURRENT_TIMESTAMP),
(222226, "Nitnem Santhiya Introduction Girls", "", 444443, 100000, "active", CURRENT_TIMESTAMP),
(222227, "Nitnem Santhiya Introduction Boys", "", 444443, 100000, "active", CURRENT_TIMESTAMP),
(222228, "Gurmukhi Advance", "", 444444, 100000, "active", CURRENT_TIMESTAMP),
(222229, "SSGS Pothi 1 Boys", "", 444452, 100000, "active", CURRENT_TIMESTAMP),
(222230, "SSGS Pothi 1 Girls", "", 444452, 100000, "active", CURRENT_TIMESTAMP),
(222240, "Waja Level 4/5 Boys", "", 444445, 100000, "active", CURRENT_TIMESTAMP),
(222250, "Waja Level 5 Girls", "", 444445, 100000, "active", CURRENT_TIMESTAMP),
(222260, "Tabla Level 1/2 Girls", "", 444446, 100000, "active", CURRENT_TIMESTAMP),
(222270, "Gatka Level 1", "", 444447, 100000, "active", CURRENT_TIMESTAMP),
(222280, "Little  Khalsa Club Level 3", "", 444441, 100000, "active", CURRENT_TIMESTAMP),
(222290, "Gurmukhi Advance Boys", "", 444444, 100000, "active", CURRENT_TIMESTAMP),
(222020, "Tabla Level 3 Boys", "", 444446, 100000, "active", CURRENT_TIMESTAMP),
(222120, "Waja Level 4 Girls", "", 444445, 100000, "active", CURRENT_TIMESTAMP),
(223220, "Waja Level 3 Boys", "", 444445, 100000, "active", CURRENT_TIMESTAMP),
(222320, "Gatka Level 3 Boys", "", 444447, 100000, "active", CURRENT_TIMESTAMP),
(222420, "Sikh History Girls 7-10", "", 444448, 100000, "active", CURRENT_TIMESTAMP),
(222520, "Sikh History Boys 7-10", "", 444448, 100000, "active", CURRENT_TIMESTAMP),
(222620, "Sikh History Girls 11-13", "", 444448, 100000, "active", CURRENT_TIMESTAMP),
(222720, "Sikh History Girls 14-17", "", 444448, 100000, "active", CURRENT_TIMESTAMP),
(222820, "Sikh History Boys 11-15", "", 444448, 100000, "active", CURRENT_TIMESTAMP),
(222920, "Sikh History Boys 16+", "", 444448, 100000, "active", CURRENT_TIMESTAMP),
(220220, "Sikh History Girls 18+", "", 444448, 100000, "active", CURRENT_TIMESTAMP),
(221220, "Extra Help Gurmukhi", "", 444449, 100000, "active", CURRENT_TIMESTAMP),
(224220, "Waja Level 1 Girls", "", 444445, 100000, "active", CURRENT_TIMESTAMP),
(223227, "Tabla Level 3 Girls", "", 444446, 100000, "active", CURRENT_TIMESTAMP),
(224228, "Gatka Level 2 Boys", "", 444447, 100000, "active", CURRENT_TIMESTAMP),
(225220, "Waja Level 5 Boys", "", 444445, 100000, "active", CURRENT_TIMESTAMP),
(226220, "Tabla Level 1 Boys", "", 444446, 100000, "active", CURRENT_TIMESTAMP),
(227220, "Tantee Saaj Boys", "", 444442, 100000, "active", CURRENT_TIMESTAMP),
(228220, "Waja Level 3 Girls", "", 444445, 100000, "active", CURRENT_TIMESTAMP),
(229220, "Waja 18+ Girls", "", 444445, 100000, "active", CURRENT_TIMESTAMP),
(202220, "Dastar Class", "", 444450, 100000, "active", CURRENT_TIMESTAMP),
(212220, "Girls Activity Class 12-16", "", 444451, 100000, "active", CURRENT_TIMESTAMP);













