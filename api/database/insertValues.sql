USE gobind;

INSERT INTO teacher (`userid`, `schoolid`, `firstName`, `lastName`, `emailAddr`, `status`, `usertype`)
VALUES(341231, 412312, "Harry", "Potter", "test@gmail.com", "active", "T"),
(341232, 412312, "Shanifer, Seit", "test1@gmail.com", "active", "T"),
(341331, 412312, "Claire", "Barretto", "test2@gmail.com", "active", "T"),
(341531, 412312, "Cassandra", "Lim", "test3@gmail.com", "active", "T")

;

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



