USE gobind;

INSERT into apikeys(`keyid`, `name`) values ('C_s6D7OmZEgKBIspAvuBcw', 'mandrill');

-- INSERT STAFF --

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
(222220, "Little Khalsa Club Level 1", "", 444441, 100000, "active", CURRENT_TIMESTAMP),
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


-- INSERT SECTIONS --

INSERT INTO `section`(`sectionid`, `courseid`, `sectionCode`, `day`, `startTime`, `endTime`, `roomCapacity`, `roomLocation`, `classSize`, `schoolyearid`, `status`, `lastAccessed`)
VALUES
(900000, 222220, "1B", ("SAT, SUN"), "5:15:00", "6:15:00", "50", "#3", "43", 100000, "active", CURRENT_TIMESTAMP),
(900001, 222221, "2B", ("SAT, SUN"), "5:15:00", "6:15:00", "50", "#2", "43", 100000, "active", CURRENT_TIMESTAMP),
(900002, 222222, "GB1", ("SAT, SUN"), "5:15:00", "6:15:00", "50", "#1", "43", 100000, "active", CURRENT_TIMESTAMP),
(900003, 222223, "GBA1", ("SAT, SUN"), "5:15:00", "6:15:00", "50", "#6", "43", 100000, "active", CURRENT_TIMESTAMP),
(900004, 222224, "GM1", ("SAT, SUN"), "5:15:00", "6:15:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900005, 222225, "TSA1", ("SAT, SUN"), "5:15:00", "6:15:00", "50", "#10", "43", 100000, "active", CURRENT_TIMESTAMP),
(900006, 222226, "ISG1", ("SAT, SUN"), "5:15:00", "6:15:00", "50", "#12", "43", 100000, "active", CURRENT_TIMESTAMP),
(900007, 222227, "ISB1", ("SAT, SUN"), "5:15:00", "6:15:00", "50", "#7", "43", 100000, "active", CURRENT_TIMESTAMP),
(900008, 222228, "GA1", ("SAT, SUN"), "5:15:00", "6:15:00", "50", "#4", "43", 100000, "active", CURRENT_TIMESTAMP),
(900009, 222229, "SPB1", ("SAT, SUN"), "5:15:00", "6:15:00", "50", "#8", "43", 100000, "active", CURRENT_TIMESTAMP),
(900010, 222230, "SPG1", ("SAT, SUN"), "5:15:00", "6:15:00", "50", "#11", "43", 100000, "active", CURRENT_TIMESTAMP),

(900011, 222220, "1A", ("MON, THU"), "6:15:00", "7:15:00", "50", "#1", "43", 100000, "active", CURRENT_TIMESTAMP),
(900012, 222221, "2A", ("MON, THU"), "6:15:00", "7:15:00", "50", "#6", "43", 100000, "active", CURRENT_TIMESTAMP),
(900013, 222228, "GA2", ("MON, THU"), "6:15:00", "7:15:00", "50", "#7", "43", 100000, "active", CURRENT_TIMESTAMP),
(900014, 222227, "ISB2", ("MON, THU"), "6:15:00", "7:15:00", "50", "#12", "43", 100000, "active", CURRENT_TIMESTAMP),
(900015, 222226, "ISG2", ("MON, THU"), "6:15:00", "7:15:00", "50", "#9", "43", 100000, "active", CURRENT_TIMESTAMP),
(900016, 222240, "WB4", ("MON, THU"), "6:15:00", "7:15:00", "50", "#10", "43", 100000, "active", CURRENT_TIMESTAMP),
(900017, 222250, "WG5", ("MON, THU"), "6:15:00", "7:15:00", "50", "#11", "43", 100000, "active", CURRENT_TIMESTAMP),
(900018, 222260, "TG12", ("MON, THU"), "6:15:00", "7:15:00", "50", "GYM", "43", 100000, "active", CURRENT_TIMESTAMP),
(900019, 222270, "GK1", ("MON, THU"), "6:15:00", "7:15:00", "50", "#2/3", "43", 100000, "active", CURRENT_TIMESTAMP),

(900020, 222220, "1C", ("TUE, FRI"), "6:15:00", "7:15:00", "50", "#3", "43", 100000, "active", CURRENT_TIMESTAMP),
(900021, 222280, "3A", ("TUE, FRI"), "6:15:00", "7:15:00", "50", "#3", "43", 100000, "active", CURRENT_TIMESTAMP),
(900022, 222222, "GB3", ("TUE, FRI"), "6:15:00", "7:15:00", "50", "#3", "43", 100000, "active", CURRENT_TIMESTAMP),
(900023, 222223, "GBA3", ("TUE, FRI"), "6:15:00", "7:15:00", "50", "#3", "43", 100000, "active", CURRENT_TIMESTAMP),
(900024, 222224, "GI3", ("TUE, FRI"), "6:15:00", "7:15:00", "50", "#3", "43", 100000, "active", CURRENT_TIMESTAMP),
(900025, 222290, "GA3", ("TUE, FRI"), "6:15:00", "7:15:00", "50", "#3", "43", 100000, "active", CURRENT_TIMESTAMP),
(900026, 222020, "TB3", ("TUE, FRI"), "6:15:00", "7:15:00", "50", "#3", "43", 100000, "active", CURRENT_TIMESTAMP),
(900027, 223220, "WB2", ("TUE, FRI"), "6:15:00", "7:15:00", "50", "#3", "43", 100000, "active", CURRENT_TIMESTAMP),
(900028, 222120, "WG2", ("TUE, FRI"), "6:15:00", "7:15:00", "50", "#3", "43", 100000, "active", CURRENT_TIMESTAMP),
(900029, 227220, "TSIB", ("TUE, FRI"), "6:15:00", "7:15:00", "50", "#3", "43", 100000, "active", CURRENT_TIMESTAMP),

(900030, 222224, "GI4", ("WED, SAT"), "6:15:00", "7:15:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900031, 222228, "GA4", ("WED, SAT"), "6:15:00", "7:15:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900032, 222020, "TB2", ("WED, SAT"), "6:15:00", "7:15:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900033, 222120, "WG4", ("WED, SAT"), "6:15:00", "7:15:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900034, 223220, "WB3", ("WED, SAT"), "6:15:00", "7:15:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900035, 222229, "SPB2", ("WED, SAT"), "6:15:00", "7:15:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900036, 222230, "SPG2", ("WED, SAT"), "6:15:00", "7:15:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900037, 222230, "SPG3", ("WED, SAT"), "6:15:00", "7:15:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900038, 222320, "GK3", ("WED, SAT"), "6:15:00", "7:15:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),

(900039, 222420, "SHG7", ("SUN"), "6:15:00", "7:15:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900040, 222520, "SHB7", ("SUN"), "6:15:00", "7:15:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900041, 222620, "SHG11", ("SUN"), "6:15:00", "7:15:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900042, 222720, "SHG14", ("SUN"), "6:15:00", "7:15:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900043, 222820, "SHB11", ("SUN"), "6:15:00", "7:15:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900044, 222920, "SHB16", ("SUN"), "6:15:00", "7:15:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900045, 222320, "SHB18", ("SUN"), "6:15:00", "7:15:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900046, 220220, "EHG1", ("SUN"), "6:15:00", "7:15:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),

(900047, 224220, "WG1", ("MON, THU"), "7:30:00", "8:30:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900048, 223227, "TG3", ("MON, THU"), "7:30:00", "8:30:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900049, 224228, "GK2", ("MON, THU"), "7:30:00", "8:30:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900050, 222224, "GI2", ("MON, THU"), "7:30:00", "8:30:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900051, 225220, "WB5", ("MON, THU"), "7:30:00", "8:30:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),

(900052, 226220, "TB1", ("TUE, FRI"), "7:30:00", "8:30:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900053, 227220, "TSB", ("TUE, FRI"), "7:30:00", "8:30:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900054, 228220, "WG3", ("TUE, FRI"), "7:30:00", "8:30:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900055, 229220, "WG18", ("TUE, FRI"), "7:30:00", "8:30:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900056, 202220, "DC1", ("TUE, FRI"), "7:30:00", "8:30:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900057, 212220, "GA12", ("TUE, FRI"), "7:30:00", "8:30:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900058, 220220, "EHG2", ("TUE, FRI"), "7:30:00", "8:30:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),

(900059, 224220, "WB1", ("WED, SAT"), "7:30:00", "8:30:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900060, 227220, "TSBG", ("WED, SAT"), "7:30:00", "8:30:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP),
(900061, 220220, "EHG3", ("WED, SAT"), "7:30:00", "8:30:00", "50", "#5", "43", 100000, "active", CURRENT_TIMESTAMP);



INSERT INTO attendance (`date`, `userid`, `sectionid`, `schoolyearid`, `status`)
VALUES
('2015-02-11', 341231, 900054, 100000, 'active'),
('2015-02-12', 341231, 900021, 100000, 'active'),
('2015-03-11', 341232, 900014, 100000, 'active'),
('2015-03-12', 341232,900023 , 100000, 'active'),
('2015-01-20', 341331,900048 , 100000, 'active'),
('2015-03-24', 341531,900049 , 100000, 'active');


