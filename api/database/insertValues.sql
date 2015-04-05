USE gobind;


-- Insert Schoolyear --

INSERT INTO schoolyear (`schoolyearid`, `schoolyear`, `status`, `openForReg`)
VALUES(123456, "2013-2014", "inactive", 0),
(122334, "2014-2015", "inactive", 0),
(122335, "2015S", "inactive", 0),
(233464, "2015-2016", "active", 1),
(876390, "2016-2017", "inactive", 1)
; 

-- Insert School --

INSERT INTO school (`schoolid`, `location`, `postalCode`, `yearOpened`, `status`, `lastAccessed`)
VALUES(863941, "Surrey", "v7s3j5", "2005", "active", CURRENT_TIMESTAMP),
(868731, "Toronto", "b7l1kc", "2015", "active", CURRENT_TIMESTAMP),
(783941, "London", "v8d3s4", "2015", "active", CURRENT_TIMESTAMP),
(872341, "Calgary", "v7d9d7", "2016", "active", CURRENT_TIMESTAMP)
;

-- Insert Departments--
-- Insert surrey 20162017--
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

-- Insert surrey 20152016--
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

-- Insert surrey 20142015--
INSERT INTO `department`(`deptid`, `schoolid`, `deptName`, `schoolyearid`, `status`, `lastAccessed`)
VALUES (544634, 863941, "Gurmukhi", 122334, "active", CURRENT_TIMESTAMP),
(544631, 863941, "Little Khalsa Club", 122334, "active", CURRENT_TIMESTAMP),
(544637, 863941, "Gatka", 122334, "active", CURRENT_TIMESTAMP),
(544638, 863941, "Sikh History", 122334, "active", CURRENT_TIMESTAMP)
;

-- Insert surrey 2014S--
INSERT INTO `department`(`deptid`, `schoolid`, `deptName`, `schoolyearid`, `status`, `lastAccessed`)
VALUES (544734, 863941, "Gurmukhi", 123456, "active", CURRENT_TIMESTAMP),
(544731, 863941, "Little Khalsa Club", 123456, "active", CURRENT_TIMESTAMP),
(544737, 863941, "Gatka", 123456, "active", CURRENT_TIMESTAMP),
(544738, 863941, "Sikh History", 123456, "active", CURRENT_TIMESTAMP)
;

-- Insert Toronto 20152016--
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


-- Insert Toronto 20162017--
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

-- Insert London 20152016--
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


-- Insert London 20162017--
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


-- Insert Calgary 20162017--
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


-- INSERT COURSES --
-- Insert courses Surrey 2015-2016 --

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


-- Insert courses 2016-2017 --

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


-- INSERT SECTIONS surrey 20152016 --
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


-- INSERT PREREQUISITES --
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

-- INSERT STUDENTS --
INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('1234567', 'kseager34567', '$2a$10$QNm2LeUUHB/FnJ9JvzNZcO48o86K/Gcljk/PukXAXy.a.gCbrw9Vu', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(1234567, "Kyle", "Seager", "1980-09-24", "M", "123 4th St", "", "Surrey",
    "BC", "Canada", "V6T1W9", "1234567890", "KYLE@test.com", "", "", "Dustin", "Ackley",
    "0987654321", "dustin@test.com", "Bob", "Seager", "brother",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);


INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('1234568', 'rcano34568', '$2a$10$hZNXhfhAcPk36SkGEhGn4.7cTkSbOlXrbetCOISLaQz6L2BBM7fSS', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(1234568, "Robinson", "Cano", "1982-05-13", "M", "888 4th St", "", "Richmond",
    "BC", "Canada", "V6T1W9", "1234567890", "robinson@test.com", "", "", "Felix", "Hernandez",
    "0987654321", "felix@test.com", "Nelson", "Cruz", "uncle",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);


INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('1234569', 'arodriguez34569', 'pass1', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(1234569, "Alex", "Rodriguez", "1973-02-17", "F", "123 10th Ave", "", "Burnaby",
    "BC", "Canada", "V6T1W9", "1234567890", "arod@test.com", "", "", "Derek", "Jeter",
    "0987654321", "derek@test.com", "Bio", "Genisis", "brother",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);


INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('1234571', 'kkardashian34571', '$2a$10$8bVPWBhrzuDuwwruxNlBjuodN/Y3cD97H7e9/7gXbtcsz.yDRq.i6', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(1234571, "Kim", "Kardashian", "1980-09-24", "F", "1234 Rodeo Dr", "", "Beverly Hills",
    "BC", "Canada", "90210", "1234567890", "kim@test.com", "", "", "Kanye", "West",
    "0987654321", "kanye@test.com", "Kourtney", "Kardashian", "sister",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);


INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('1234572', 'kwest34572', '$2a$2a$10$Gfj84CsS8XOunp8xzacxke8ET5e/yVh.k5WBR2y8KqZe6nwqkJylW', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(1234572, "Kanye", "West", "1980-03-12", "M", "1234 Rodeo Dr", "", "Beverly Hills",
    "BC", "Canada", "90210", "1234567890", "kanye@test.com", "", "", "Jay", "Z",
    "0987654321", "jayz@test.com", "Kim", "Kardashian", "wifey",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);


INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('1234573', 'rsherman34573', '$2a$2a$2a$10$vKNZ62QcIR3gkkJKDOLoFe/hu.qx77KBr1yKychMR46DpqtY92BSy', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(1234573, "Richard", "Sherman", "1987-03-11", "M", "43134 5th Ave", "", "Vancouver",
    "BC", "Canada", "V6T1W9", "1234567890", "richard@test.com", "", "", "Kam", "Chancellor",
    "0987654321", "kam@test.com", "Earl", "Thomas", "bro",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);


INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('1234574', 'rwilson34574', '$2a$2a$2a$2a$10$7ZUbK7J6eoVD6EvhyLZOGemuqPZRG9j7Lf3jU9AXhvG5XDyr0atHq', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(1234574, "Russell", "Wilson", "1980-03-12", "M", "1234 Rodeo Dr", "", "Delta",
    "BC", "Canada", "V6T1W9", "1234567890", "russell@test.com", "", "", "Marshawn", "Lynch",
    "0987654321", "marshawn@test.com", "pete", "carroll", "coach",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);


INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('1234575', 'bdylan34575', '$2a$2a$2a$2a$2a$10$s/LZPNjpMrRcSgTtsudXPO.F6EnRg3RgrKUOynNYoxphKGJY8/neC', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(1234575, "Bob", "Dylan", "1980-03-12", "F", "1234 Seahawks Way", "", "Vancouver",
    "BC", "Canada", "V6T1W9", "1234567890", "marshawn@test.com", "", "", "Pete", "Carroll",
    "0987654321", "pete@test.com", "Richard", "Sherman", "teammate",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);


INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('1234576', 'ethomas34576', '$2a$2a$2a$2a$2a$2a$10$bXJD5jY0KLLRn0LrvRnAheOnBdeRVOrauCADFYHY74ssE98QDWxki', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(1234576, "Earl", "Thomas", "1980-03-12", "M", "1234 Rodeo Dr", "", "Vancouver",
    "BC", "Canada", "V6T1W9", "1234567890", "earl@test.com", "", "", "Nina", "Dobrev",
    "0987654321", "nina@test.com", "Kam", "Chancellor", "bro",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);


INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('2234573', 'rastley34573', '$2a$2a$2a$2a$2a$2a$2a$10$K34J6IvgHr9JgrAh8fWvAOMN84j9IxViSHAvPZHptP3ksK.Cve/OC', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(2234573, "Rick", "Astley", "1987-03-11", "M", "43134 5th Ave", "", "Vancouver",
    "BC", "Canada", "V6T1W9", "1234567890", "richard@test.com", "", "", "Kam", "Chancellor",
    "0987654321", "kam@test.com", "Earl", "Thomas", "bro",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);


INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('2234574', 'aketchum34574', '$2a$2a$2a$2a$2a$2a$2a$2a$10$AKA7oYyWVIjzpCtjm0UR/eoaJ5SP0VVhOXElokOgfMg.hmWDqEGCW', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(2234574, "Ash", "Ketchum", "1980-03-12", "M", "1234 Rodeo Dr", "", "Delta",
    "BC", "Canada", "V6T1W9", "1234567890", "russell@test.com", "", "", "Marshawn", "Lynch",
    "0987654321", "marshawn@test.com", "pete", "carroll", "coach",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);


INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('2234575', 'rpieces34575', '$2a$2a$2a$2a$2a$2a$2a$2a$2a$10$dmqMlDeLETNTEqihSy/YGuMIT6FtVjXIKEd/yfHmQ5HBsc4n.ocjm', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(2234575, "Reese", "Pieces", "1980-03-12", "F", "1234 Seahawks Way", "", "Vancouver",
    "BC", "Canada", "V6T1W9", "1234567890", "marshawn@test.com", "", "", "Pete", "Carroll",
    "0987654321", "pete@test.com", "Richard", "Sherman", "teammate",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);


INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('2234576', 'narmstrong34576', '$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$10$hSJy4J2EpJD0LdXrVuWjeuKacdLvitM5NGmZ8c6aAYPcE2EzXjeN2', 'S', CURRENT_TIMESTAMP);

INSERT INTO student (`userid`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `streetAddr1`, `streetAddr2`, `city`, `province`, `country`, `postalCode`, `phoneNumber`, `emailAddr`, `allergies`, `prevSchools`, `parentFirstName`, `parentLastName`, `parentPhoneNumber`, `parentEmailAddr`, `emergencyContactFirstName`, `emergencyContactLastName`, `emergencyContactRelation`, `emergencyContactPhoneNumber`, `schoolid`, `paid`, `status`, `lastAccessed`)
values(2234576, "Neil", "Armstrong", "1980-03-12", "M", "1234 Rodeo Dr", "", "Vancouver",
    "BC", "Canada", "V6T1W9", "1234567890", "earl@test.com", "", "", "Nina", "Dobrev",
    "0987654321", "nina@test.com", "Kam", "Chancellor", "bro",
    "7781234567", 863941, "T", "active", CURRENT_TIMESTAMP);


-- INSERT STAFF --

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('5534576', 'poak34576', '$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$10$v4WOkIDuUu5XDqtbFjWy8.TxhA6y9RMzvf3MReoGOTTWhzPcQR.8C', 'S', CURRENT_TIMESTAMP);
INSERT INTO superuser (`userid`, `firstName`, `lastName`, `emailAddr`, `status`)
VALUES(5534576, "Professor", "Oak", "test@gmail.com", "active");


INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('5534577', 'nuzumaki34577', '$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$10$qDeXAcgWWrW8v1uzfYo37.VFlVAqjCE9rHIGtvFq1aOzwJR3dR/IS', 'S', CURRENT_TIMESTAMP);
INSERT INTO teacher (`userid`, `schoolid`, `firstName`, `lastName`, `emailAddr`, `status`, `usertype`)
VALUES(5534577, 863941, "Naruto", "Uzumaki", "test@gmail.com", "active", "T");


INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('5512345', 'ssnape12345', '$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$10$AvGs8YHoQZQHwUpwEbZbJOJuKrj9plGukvxz7k2QICM4/ehnWlpeW', 'S', CURRENT_TIMESTAMP);
INSERT INTO superuser (`userid`, `firstName`, `lastName`, `emailAddr`, `status`)
VALUES(5512345, "Severus", "Snape", "test@gmail.com", "active");


INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('5534579', 'njones34579', '$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$10$8SST9XfxMr7/Mgyij0Gicu1ON4Mn2c9FMf5f0B.0jR7zaUbQ90mSq', 'S', CURRENT_TIMESTAMP);
INSERT INTO teacher (`userid`, `schoolid`, `firstName`, `lastName`, `emailAddr`, `status`, `usertype`)
VALUES(5534579, 863941, "Nebraska", "Jones", "test@gmail.com", "active", "T");


INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('5534580', 'adumbledore34580', '$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$10$tU38ESEg1vO8XyPx9cxsT.QNZDnrGZNaxPR5x40e2AY/BEMHYIn/i', 'S', CURRENT_TIMESTAMP);
INSERT INTO teacher (`userid`, `schoolid`, `firstName`, `lastName`, `emailAddr`, `status`, `usertype`)
VALUES(5534580, 863941, "Albus", "Dumbledore", "test@gmail.com", "active", "T");


INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('5534581', 'tcruise34581', '$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$10$qy.TXbubasWjnFQzUg5eo.IY2LLrqLfJ6MBfcK4qrgEQKVI9eMlCe', 'S', CURRENT_TIMESTAMP);
INSERT INTO teacher (`userid`, `schoolid`, `firstName`, `lastName`, `emailAddr`, `status`, `usertype`)
VALUES(5534581, 863941, "Tom", "Cruise", "test@gmail.com", "active", "T");

INSERT INTO login (`userid`, `username`, `password`, `usertype`, `lastLogin`)
VALUES ('5534582', 'ymoto34582', '$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$2a$10$1Qm6nycDObz4Nut1nTh5UuH0d.wesIEinU5TYmExdrZbCSJWoJF7m', 'S', CURRENT_TIMESTAMP);
INSERT INTO teacher (`userid`, `schoolid`, `firstName`, `lastName`, `emailAddr`, `status`, `usertype`)
VALUES(5534582, 863941, "Yugi", "Moto", "test@gmail.com", "active", "T");


-- INSERT TEACHER COMPETENCY --

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


-- INSERT TEACHING Section --
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


-- INSERT TEACHING SECTION -- 
-- INSERT TEACHING COURSE --
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


-- INSERT DOCUMENT --
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



-- INSERT ENROLLMENT --
INSERT INTO enrollment (`userid`, `sectionid`, `schoolyearid`, `status`, `lastAccessed`)
VALUES
(1234567, 500000, 233464, "inactive", CURRENT_TIMESTAMP),
(1234568, 500000, 233464, "active", CURRENT_TIMESTAMP),
(1234569, 500000, 233464, "active", CURRENT_TIMESTAMP),
(1234571, 500000, 233464, "pending", CURRENT_TIMESTAMP),

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
(2234573, 500050, 233464, "active", CURRENT_TIMESTAMP),

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


-- INSERT WAITLIST --
INSERT INTO waitlisted (`userid`, `waitlistid`)
VALUES
(2234574,422220),
(2234574,422229),
(2234574,422280),
(2234575,422220),
(2234575,422221),
(2234576,422280);


-- INSERT ATTENDANCE --

INSERT INTO attendance(`date`, `userid`, `sectionid`,`schoolyearid`, `status`, `lastAccessed`)
VALUES
("2015-03-07", 1234572, 500001, 233464, "active", CURRENT_TIMESTAMP),
("2015-03-07", 1234573, 500001, 233464, "active", CURRENT_TIMESTAMP),
("2015-03-07", 1234574, 500001, 233464, "active", CURRENT_TIMESTAMP),
("2015-03-07", 1234575, 500001, 233464, "active", CURRENT_TIMESTAMP),
("2015-03-07", 2234573, 500001, 233464, "active", CURRENT_TIMESTAMP),

("2015-03-14", 1234572, 500001, 233464, "active", CURRENT_TIMESTAMP),
("2015-03-14", 1234573, 500001, 233464, "active", CURRENT_TIMESTAMP),
("2015-03-14", 1234575, 500001, 233464, "active", CURRENT_TIMESTAMP),
("2015-03-14", 2234573, 500001, 233464, "active", CURRENT_TIMESTAMP),

("2015-03-21", 1234572, 500001, 233464, "active", CURRENT_TIMESTAMP),
("2015-03-21", 1234573, 500001, 233464, "active", CURRENT_TIMESTAMP),
("2015-03-21", 1234574, 500001, 233464, "active", CURRENT_TIMESTAMP),
("2015-03-21", 1234575, 500001, 233464, "active", CURRENT_TIMESTAMP),
("2015-03-21", 2234573, 500001, 233464, "active", CURRENT_TIMESTAMP),

("2015-03-28", 1234572, 500001, 233464, "active", CURRENT_TIMESTAMP),
("2015-03-28", 1234574, 500001, 233464, "active", CURRENT_TIMESTAMP),
("2015-03-28", 1234575, 500001, 233464, "active", CURRENT_TIMESTAMP),
("2015-03-28", 2234573, 500001, 233464, "active", CURRENT_TIMESTAMP),

("2015-03-02", 1234567, 500012, 233464, "active", CURRENT_TIMESTAMP),
("2015-03-02", 1234572, 500012, 233464, "active", CURRENT_TIMESTAMP),

("2015-03-06", 1234567, 500012, 233464, "active", CURRENT_TIMESTAMP),

("2015-03-09", 1234567, 500012, 233464, "active", CURRENT_TIMESTAMP),
("2015-03-09", 1234572, 500012, 233464, "active", CURRENT_TIMESTAMP),

("2015-03-13", 1234567, 500012, 233464, "active", CURRENT_TIMESTAMP),
("2015-03-13", 1234572, 500012, 233464, "active", CURRENT_TIMESTAMP),

("2015-03-16", 1234567, 500012, 233464, "active", CURRENT_TIMESTAMP),
("2015-03-16", 1234572, 500012, 233464, "active", CURRENT_TIMESTAMP),

("2015-03-20", 1234572, 500012, 233464, "active", CURRENT_TIMESTAMP),

("2015-03-23", 1234567, 500012, 233464, "active", CURRENT_TIMESTAMP),
("2015-03-23", 1234572, 500012, 233464, "active", CURRENT_TIMESTAMP),

("2015-03-27", 1234572, 500012, 233464, "active", CURRENT_TIMESTAMP),

("2015-03-30", 1234567, 500012, 233464, "active", CURRENT_TIMESTAMP),
("2015-03-30", 1234572, 500012, 233464, "active", CURRENT_TIMESTAMP);


-- INSERT MARKS --

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

-- INSERT API KEYS --

INSERT into apikeys(`keyid`, `name`) values ('C_s6D7OmZEgKBIspAvuBcw', 'mandrill');

