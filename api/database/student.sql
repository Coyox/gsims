--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
CREATE TABLE `student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(30) NOT NULL,
  `lastName` varchar(30) NOT NULL,
  `email` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `student` VALUES 
  (1, "Claire", "Barretto", "claire@gmail.com"),
  (2, "Adam", "Lloyd", "adam@gmail.com"),
  (3, "Shanifer", "Seit", "shanifer@gmail.com"),
  (4, "Cassandra", "Lim", "cassandra@gmail.com"),
  (5, "Alexander", "Fetherstonahugh", "alexander@gmail.com");