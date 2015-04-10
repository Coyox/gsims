-- INSERT SUPERUSER --
INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES (999999, 'superuser', '$2a$10$bnajzD3X7uBkmRI1CPnRCOo6dKn5OQuCofAGlkffqVq7HE0b1mzxS', 'SU', CURRENT_TIMESTAMP);

INSERT INTO `superuser`(`userid`, `firstName`, `lastName`, `emailAddr`, `status`, `lastAccessed`) 
VALUES (999999, 'Demo', 'Superuser', 'info@gobindsarvar.com', 'active', '');

-- INSERT SCHOOL -- 
INSERT INTO `school`(`schoolid`, `location`, `postalCode`, `yearOpened`, `status`, `lastAccessed`) 
VALUES (111111, 'Surrey', 'V4N 6G7', 1999, 'active', '');