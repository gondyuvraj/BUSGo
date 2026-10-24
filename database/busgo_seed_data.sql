-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: busgo
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `busgo`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `busgo` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `busgo`;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,'BG-712849','CANCELLED','2026-10-13 19:12:30.999493','2026-10-15','[{\"name\":\"Yuvraj Sharma\",\"age\":22,\"gender\":\"MALE\",\"seatNumber\":\"L3\"},{\"name\":\"Rahul Deshmukh\",\"age\":23,\"gender\":\"MALE\",\"seatNumber\":\"L4\"}]','REFUNDED',943.11,'L3, L4',1047.9,1,2,NULL,NULL),(2,'BG-583920','CONFIRMED','2026-10-09 19:12:31.024491','2026-10-11','[{\"name\":\"Yuvraj Sharma\",\"age\":22,\"gender\":\"MALE\",\"seatNumber\":\"U1\"}]','COMPLETED',0,'U1',1299,7,2,NULL,NULL),(3,'BG-165224','CANCELLED','2026-10-15 16:14:57.209995','2026-10-15','[{\"name\":\"Yuvraj Sharma\",\"age\":18,\"gender\":\"MALE\",\"seatNumber\":\"L15\"}]','REFUNDED',396.9,'L15',441,9,2,NULL,NULL),(4,'BG-651453','CONFIRMED','2026-10-16 15:45:56.929860','2026-10-16','[{\"name\":\"Yuvraj Sharma\",\"age\":22,\"gender\":\"MALE\",\"seatNumber\":\"U2\"}]','COMPLETED',0,'U2',547.63,2,2,NULL,NULL),(5,'BG-323765','CANCELLED','2026-10-24 18:13:09.617353','2026-10-24','[{\"name\":\"Test Passenger\",\"age\":25,\"gender\":\"MALE\",\"seatNumber\":\"L5\"}]','REFUNDED',471.56,'L5',523.95,1,2,'CHANGE_OF_PLANS',NULL);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `buses`
--

LOCK TABLES `buses` WRITE;
/*!40000 ALTER TABLE `buses` DISABLE KEYS */;
INSERT INTO `buses` VALUES (1,'WiFi,Charging Point,Water Bottle,Blanket,Live Tracking,Reading Light','MH-01-BG-1001','AC_SLEEPER','Zingbus Electric Multi-Axle',4.9,320,30,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,'AC,Pillows,Clean Washroom,Charging Point,GPS,CCTV','MH-12-BG-2002','AC_SLEEPER','IntrCity SmartBus Premium Lounge',4.8,215,30,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,'WiFi,AC,Water Bottle,Emergency SOS,Personal Screen','KA-05-BG-3003','AC_SLEEPER','Orange Travels Volvo 9600',4.7,180,30,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,'AC,Ergonomic Recliner,Snacks,USB Port,M-Ticket','DL-01-BG-4004','AC_SEATER','SRS Travels Club Class',4.6,95,36,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,'AC,WiFi,Blanket,Mineral Water,GPS Tracking','GA-03-BG-5005','AC_SLEEPER','VRL Travels Super Luxury Sleeper',4.9,440,30,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,'WiFi,AC,Blanket,Water Bottle,Reading Light,GPS','MH-04-GR-8754','NON_AC_SLEEPER','Rahul Jain',4.8,10,22,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(10,'WiFi,AC,Blanket,Water Bottle,Reading Light,GPS','MH-07-JH-6058','AC_SEATER','Aakash',4.5,10,30,84,'VLR',14,'','Other','aakash30@gmail.com','9822768402','aakash.in','DIESEL','2022',_binary '',_binary '\0',_binary '',_binary '',_binary '\0',_binary '',_binary '',_binary '',_binary '\0',_binary '',_binary '',_binary '',_binary '\0',_binary '',_binary '','',_binary '','','');
/*!40000 ALTER TABLE `buses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `holiday_plan_highlights`
--

LOCK TABLES `holiday_plan_highlights` WRITE;
/*!40000 ALTER TABLE `holiday_plan_highlights` DISABLE KEYS */;
INSERT INTO `holiday_plan_highlights` VALUES (1,'Sunset at the shore',0),(1,'Old Goa heritage walk',1),(1,'Local food & market time',2),(2,'Amber Fort & city views',0),(2,'Pink City streets',1),(2,'Hawa Mahal photo stop',2),(3,'Charminar & old city',0),(3,'Local food trail',1),(3,'Lakefront evening',2),(6,'Sunrise, sunset, Multiple Activities',0);
/*!40000 ALTER TABLE `holiday_plan_highlights` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `holiday_plan_itinerary`
--

LOCK TABLES `holiday_plan_itinerary` WRITE;
/*!40000 ALTER TABLE `holiday_plan_itinerary` DISABLE KEYS */;
INSERT INTO `holiday_plan_itinerary` VALUES (1,'Day 1 · Arrive in Goa, check in, and spend the evening by the coast.',0),(1,'Day 2 · Explore Old Goa, enjoy a relaxed lunch, and catch sunset at the beach.',1),(1,'Day 3 · Take a slow morning before your return journey.',2),(2,'Day 1 · Explore the Pink City, local bazaars, and Hawa Mahal.',0),(2,'Day 2 · Visit Amber Fort and enjoy a final meal before heading back.',1),(3,'Day 1 · Settle in and take an evening stroll by Hussain Sagar.',0),(3,'Day 2 · Visit Charminar and explore the old city food scene.',1),(3,'Day 3 · Enjoy a relaxed breakfast before your return journey.',2),(6,'Day1: Travling',0);
/*!40000 ALTER TABLE `holiday_plan_itinerary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `holiday_plans`
--

LOCK TABLES `holiday_plans` WRITE;
/*!40000 ALTER TABLE `holiday_plans` DISABLE KEYS */;
INSERT INTO `holiday_plans` VALUES (1,'A relaxed coastal escape with heritage, local food, and time by the sea.','Goa','3 days · 2 nights',1299,'/images/hero-bus.jpg','Goa coast & slow mornings',_binary '','Mumbai','Beach'),(2,'A short city break for forts, pink-hued streets, and local markets.','Jaipur','2 days · 1 night',599,'','Jaipur royal weekend',_binary '','Delhi','Culture'),(3,'Discover the old city, regional food, and a relaxed evening by the lake.','Hyderabad','3 days · 2 nights',999,'','Hyderabad heritage & food',_binary '','Bangalore','Culture'),(6,'lets explore new mwmories','Ratnagiri','5days. 3night',1500,'','Kokan Exp.',_binary '','Pune','Beach');
/*!40000 ALTER TABLE `holiday_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1047.9,'2026-10-13 19:12:31.015492','UPI','SUCCESS','TXN-849102',1),(2,1299,'2026-10-13 19:12:31.030490','CARD','SUCCESS','TXN-391829',2),(3,441,'2026-10-15 16:14:57.228988','UPI','SUCCESS','TXN-1792080897196',3),(4,547.63,'2026-10-16 15:45:56.950135','UPI','SUCCESS','TXN-1792165556920',4),(5,523.95,'2026-10-24 18:13:09.688171','UPI','SUCCESS','TXN-1792865589613',5);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `routes`
--

LOCK TABLES `routes` WRITE;
/*!40000 ALTER TABLE `routes` DISABLE KEYS */;
INSERT INTO `routes` VALUES (1,'Pune',150,3.5,'Mumbai'),(2,'Mumbai',150,3.5,'Pune'),(3,'Hyderabad',570,8.5,'Bangalore'),(4,'Jaipur',280,5,'Delhi'),(5,'Goa',590,11,'Mumbai'),(6,'Chennai',350,6,'Bangalore'),(7,'Bangalore',570,8.5,'Hyderabad'),(8,'Pune',200,4,'Mumbai');
/*!40000 ALTER TABLE `routes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `schedules`
--

LOCK TABLES `schedules` WRITE;
/*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
INSERT INTO `schedules` VALUES (1,'10:00 AM','Borivali West / Dadar TT Circle','06:30 AM','Swargate / Hinjawadi Bridge',499,1,1),(2,'05:30 PM','Bandra Kurla Complex / Vashi Plaza','02:00 PM','Wakad Flyover / Pune Station',549,2,1),(3,'02:00 AM','Andheri East / Chembur Maitri Park','10:30 PM','Shivajinagar / Swargate Bus Stand',699,3,1),(4,'10:30 AM','Pune Station / Wakad','07:00 AM','Dadar TT / Borivali',499,1,2),(5,'06:00 AM','Majestic Bus Stand / Hebbal','09:30 PM','Ameerpet / Gachibowli ORR',999,2,3),(6,'11:15 AM','Kashmere Gate ISBT / Dhaula Kuan','06:00 AM','Sindhi Camp / 200 Ft Bypass',599,4,4),(7,'07:00 AM','Borivali / Sion / Panvel','08:00 PM','Panjim KTC Bus Stand / Mapusa',1299,5,5),(8,'05:00 AM','Electronic City / Silk Board','11:00 PM','Koyambedu CMBT / Guindy',699,3,6),(9,'06:00 AM','Dadar main h','09:00 PM','Pune',400,1,1),(10,'06:00 AM','','09:00 PM','',799,1,1),(11,'06:00 AM','DADAR','09:00 PM','PUNE',799,10,1);
/*!40000 ALTER TABLE `schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `seats`
--

LOCK TABLES `seats` WRITE;
/*!40000 ALTER TABLE `seats` DISABLE KEYS */;
INSERT INTO `seats` VALUES (1,'LOWER',_binary '',1.05,'L1','SLEEPER',1),(2,'UPPER',_binary '',1,'U1','SLEEPER',1),(3,'LOWER',_binary '\0',1,'L2','SLEEPER',1),(4,'UPPER',_binary '\0',0.95,'U2','SLEEPER',1),(5,'LOWER',_binary '',1.05,'L3','SLEEPER',1),(6,'UPPER',_binary '',1,'U3','SLEEPER',1),(7,'LOWER',_binary '',1.05,'L4','SLEEPER',1),(8,'UPPER',_binary '',1,'U4','SLEEPER',1),(9,'LOWER',_binary '\0',1,'L5','SLEEPER',1),(10,'UPPER',_binary '\0',0.95,'U5','SLEEPER',1),(11,'LOWER',_binary '',1.05,'L6','SLEEPER',1),(12,'UPPER',_binary '',1,'U6','SLEEPER',1),(13,'LOWER',_binary '',1.05,'L7','SLEEPER',1),(14,'UPPER',_binary '',1,'U7','SLEEPER',1),(15,'LOWER',_binary '\0',1,'L8','SLEEPER',1),(16,'UPPER',_binary '\0',0.95,'U8','SLEEPER',1),(17,'LOWER',_binary '',1.05,'L9','SLEEPER',1),(18,'UPPER',_binary '',1,'U9','SLEEPER',1),(19,'LOWER',_binary '',1.05,'L10','SLEEPER',1),(20,'UPPER',_binary '',1,'U10','SLEEPER',1),(21,'LOWER',_binary '\0',1,'L11','SLEEPER',1),(22,'UPPER',_binary '\0',0.95,'U11','SLEEPER',1),(23,'LOWER',_binary '',1.05,'L12','SLEEPER',1),(24,'UPPER',_binary '',1,'U12','SLEEPER',1),(25,'LOWER',_binary '',1.05,'L13','SLEEPER',1),(26,'UPPER',_binary '',1,'U13','SLEEPER',1),(27,'LOWER',_binary '\0',1,'L14','SLEEPER',1),(28,'UPPER',_binary '\0',0.95,'U14','SLEEPER',1),(29,'LOWER',_binary '',1.05,'L15','SLEEPER',1),(30,'UPPER',_binary '',1,'U15','SLEEPER',1),(31,'LOWER',_binary '',1.05,'L1','SLEEPER',2),(32,'UPPER',_binary '',1,'U1','SLEEPER',2),(33,'LOWER',_binary '\0',1,'L2','SLEEPER',2),(34,'UPPER',_binary '\0',0.95,'U2','SLEEPER',2),(35,'LOWER',_binary '',1.05,'L3','SLEEPER',2),(36,'UPPER',_binary '',1,'U3','SLEEPER',2),(37,'LOWER',_binary '',1.05,'L4','SLEEPER',2),(38,'UPPER',_binary '',1,'U4','SLEEPER',2),(39,'LOWER',_binary '\0',1,'L5','SLEEPER',2),(40,'UPPER',_binary '\0',0.95,'U5','SLEEPER',2),(41,'LOWER',_binary '',1.05,'L6','SLEEPER',2),(42,'UPPER',_binary '',1,'U6','SLEEPER',2),(43,'LOWER',_binary '',1.05,'L7','SLEEPER',2),(44,'UPPER',_binary '',1,'U7','SLEEPER',2),(45,'LOWER',_binary '\0',1,'L8','SLEEPER',2),(46,'UPPER',_binary '\0',0.95,'U8','SLEEPER',2),(47,'LOWER',_binary '',1.05,'L9','SLEEPER',2),(48,'UPPER',_binary '',1,'U9','SLEEPER',2),(49,'LOWER',_binary '',1.05,'L10','SLEEPER',2),(50,'UPPER',_binary '',1,'U10','SLEEPER',2),(51,'LOWER',_binary '\0',1,'L11','SLEEPER',2),(52,'UPPER',_binary '\0',0.95,'U11','SLEEPER',2),(53,'LOWER',_binary '',1.05,'L12','SLEEPER',2),(54,'UPPER',_binary '',1,'U12','SLEEPER',2),(55,'LOWER',_binary '',1.05,'L13','SLEEPER',2),(56,'UPPER',_binary '',1,'U13','SLEEPER',2),(57,'LOWER',_binary '\0',1,'L14','SLEEPER',2),(58,'UPPER',_binary '\0',0.95,'U14','SLEEPER',2),(59,'LOWER',_binary '',1.05,'L15','SLEEPER',2),(60,'UPPER',_binary '',1,'U15','SLEEPER',2),(61,'LOWER',_binary '',1.05,'L1','SLEEPER',3),(62,'UPPER',_binary '',1,'U1','SLEEPER',3),(63,'LOWER',_binary '\0',1,'L2','SLEEPER',3),(64,'UPPER',_binary '\0',0.95,'U2','SLEEPER',3),(65,'LOWER',_binary '',1.05,'L3','SLEEPER',3),(66,'UPPER',_binary '',1,'U3','SLEEPER',3),(67,'LOWER',_binary '',1.05,'L4','SLEEPER',3),(68,'UPPER',_binary '',1,'U4','SLEEPER',3),(69,'LOWER',_binary '\0',1,'L5','SLEEPER',3),(70,'UPPER',_binary '\0',0.95,'U5','SLEEPER',3),(71,'LOWER',_binary '',1.05,'L6','SLEEPER',3),(72,'UPPER',_binary '',1,'U6','SLEEPER',3),(73,'LOWER',_binary '',1.05,'L7','SLEEPER',3),(74,'UPPER',_binary '',1,'U7','SLEEPER',3),(75,'LOWER',_binary '\0',1,'L8','SLEEPER',3),(76,'UPPER',_binary '\0',0.95,'U8','SLEEPER',3),(77,'LOWER',_binary '',1.05,'L9','SLEEPER',3),(78,'UPPER',_binary '',1,'U9','SLEEPER',3),(79,'LOWER',_binary '',1.05,'L10','SLEEPER',3),(80,'UPPER',_binary '',1,'U10','SLEEPER',3),(81,'LOWER',_binary '\0',1,'L11','SLEEPER',3),(82,'UPPER',_binary '\0',0.95,'U11','SLEEPER',3),(83,'LOWER',_binary '',1.05,'L12','SLEEPER',3),(84,'UPPER',_binary '',1,'U12','SLEEPER',3),(85,'LOWER',_binary '',1.05,'L13','SLEEPER',3),(86,'UPPER',_binary '',1,'U13','SLEEPER',3),(87,'LOWER',_binary '\0',1,'L14','SLEEPER',3),(88,'UPPER',_binary '\0',0.95,'U14','SLEEPER',3),(89,'LOWER',_binary '',1.05,'L15','SLEEPER',3),(90,'UPPER',_binary '',1,'U15','SLEEPER',3),(91,'LOWER',_binary '',1.05,'L1','SLEEPER',4),(92,'UPPER',_binary '',1,'U1','SLEEPER',4),(93,'LOWER',_binary '\0',1,'L2','SLEEPER',4),(94,'UPPER',_binary '\0',0.95,'U2','SLEEPER',4),(95,'LOWER',_binary '',1.05,'L3','SLEEPER',4),(96,'UPPER',_binary '',1,'U3','SLEEPER',4),(97,'LOWER',_binary '',1.05,'L4','SLEEPER',4),(98,'UPPER',_binary '',1,'U4','SLEEPER',4),(99,'LOWER',_binary '\0',1,'L5','SLEEPER',4),(100,'UPPER',_binary '\0',0.95,'U5','SLEEPER',4),(101,'LOWER',_binary '',1.05,'L6','SLEEPER',4),(102,'UPPER',_binary '',1,'U6','SLEEPER',4),(103,'LOWER',_binary '',1.05,'L7','SLEEPER',4),(104,'UPPER',_binary '',1,'U7','SLEEPER',4),(105,'LOWER',_binary '\0',1,'L8','SLEEPER',4),(106,'UPPER',_binary '\0',0.95,'U8','SLEEPER',4),(107,'LOWER',_binary '',1.05,'L9','SLEEPER',4),(108,'UPPER',_binary '',1,'U9','SLEEPER',4),(109,'LOWER',_binary '',1.05,'L10','SLEEPER',4),(110,'UPPER',_binary '',1,'U10','SLEEPER',4),(111,'LOWER',_binary '\0',1,'L11','SLEEPER',4),(112,'UPPER',_binary '\0',0.95,'U11','SLEEPER',4),(113,'LOWER',_binary '',1.05,'L12','SLEEPER',4),(114,'UPPER',_binary '',1,'U12','SLEEPER',4),(115,'LOWER',_binary '',1.05,'L13','SLEEPER',4),(116,'UPPER',_binary '',1,'U13','SLEEPER',4),(117,'LOWER',_binary '\0',1,'L14','SLEEPER',4),(118,'UPPER',_binary '\0',0.95,'U14','SLEEPER',4),(119,'LOWER',_binary '',1.05,'L15','SLEEPER',4),(120,'UPPER',_binary '',1,'U15','SLEEPER',4),(121,'LOWER',_binary '',1.05,'L16','SLEEPER',4),(122,'UPPER',_binary '',1,'U16','SLEEPER',4),(123,'LOWER',_binary '\0',1,'L17','SLEEPER',4),(124,'UPPER',_binary '\0',0.95,'U17','SLEEPER',4),(125,'LOWER',_binary '',1.05,'L18','SLEEPER',4),(126,'UPPER',_binary '',1,'U18','SLEEPER',4),(127,'LOWER',_binary '',1.05,'L1','SLEEPER',5),(128,'UPPER',_binary '',1,'U1','SLEEPER',5),(129,'LOWER',_binary '\0',1,'L2','SLEEPER',5),(130,'UPPER',_binary '\0',0.95,'U2','SLEEPER',5),(131,'LOWER',_binary '',1.05,'L3','SLEEPER',5),(132,'UPPER',_binary '',1,'U3','SLEEPER',5),(133,'LOWER',_binary '',1.05,'L4','SLEEPER',5),(134,'UPPER',_binary '',1,'U4','SLEEPER',5),(135,'LOWER',_binary '\0',1,'L5','SLEEPER',5),(136,'UPPER',_binary '\0',0.95,'U5','SLEEPER',5),(137,'LOWER',_binary '',1.05,'L6','SLEEPER',5),(138,'UPPER',_binary '',1,'U6','SLEEPER',5),(139,'LOWER',_binary '',1.05,'L7','SLEEPER',5),(140,'UPPER',_binary '',1,'U7','SLEEPER',5),(141,'LOWER',_binary '\0',1,'L8','SLEEPER',5),(142,'UPPER',_binary '\0',0.95,'U8','SLEEPER',5),(143,'LOWER',_binary '',1.05,'L9','SLEEPER',5),(144,'UPPER',_binary '',1,'U9','SLEEPER',5),(145,'LOWER',_binary '',1.05,'L10','SLEEPER',5),(146,'UPPER',_binary '',1,'U10','SLEEPER',5),(147,'LOWER',_binary '\0',1,'L11','SLEEPER',5),(148,'UPPER',_binary '\0',0.95,'U11','SLEEPER',5),(149,'LOWER',_binary '',1.05,'L12','SLEEPER',5),(150,'UPPER',_binary '',1,'U12','SLEEPER',5),(151,'LOWER',_binary '',1.05,'L13','SLEEPER',5),(152,'UPPER',_binary '',1,'U13','SLEEPER',5),(153,'LOWER',_binary '\0',1,'L14','SLEEPER',5),(154,'UPPER',_binary '\0',0.95,'U14','SLEEPER',5),(155,'LOWER',_binary '',1.05,'L15','SLEEPER',5),(156,'UPPER',_binary '',1,'U15','SLEEPER',5),(157,'LOWER',_binary '',1,'L1','SLEEPER',7),(158,'UPPER',_binary '',1,'U1','SLEEPER',7),(159,'LOWER',_binary '\0',1,'L2','SLEEPER',7),(160,'UPPER',_binary '\0',1,'U2','SLEEPER',7),(161,'LOWER',_binary '',1,'L3','SLEEPER',7),(162,'UPPER',_binary '',1,'U3','SLEEPER',7),(163,'LOWER',_binary '\0',1,'L4','SLEEPER',7),(164,'UPPER',_binary '\0',1,'U4','SLEEPER',7),(165,'LOWER',_binary '',1,'L5','SLEEPER',7),(166,'UPPER',_binary '',1,'U5','SLEEPER',7),(167,'LOWER',_binary '\0',1,'L6','SLEEPER',7),(168,'UPPER',_binary '\0',1,'U6','SLEEPER',7),(169,'LOWER',_binary '',1,'L7','SLEEPER',7),(170,'UPPER',_binary '',1,'U7','SLEEPER',7),(171,'LOWER',_binary '\0',1,'L8','SLEEPER',7),(172,'UPPER',_binary '\0',1,'U8','SLEEPER',7),(173,'LOWER',_binary '',1,'L9','SLEEPER',7),(174,'UPPER',_binary '',1,'U9','SLEEPER',7),(175,'LOWER',_binary '\0',1,'L10','SLEEPER',7),(176,'UPPER',_binary '\0',1,'U10','SLEEPER',7),(177,'LOWER',_binary '',1,'L11','SLEEPER',7),(178,'UPPER',_binary '',1,'U11','SLEEPER',7),(179,'LOWER',_binary '\0',1,'L12','SLEEPER',7),(180,'UPPER',_binary '\0',1,'U12','SLEEPER',7),(181,'LOWER',_binary '',1,'L13','SLEEPER',7),(182,'UPPER',_binary '',1,'U13','SLEEPER',7),(183,'LOWER',_binary '\0',1,'L14','SLEEPER',7),(184,'UPPER',_binary '\0',1,'U14','SLEEPER',7),(185,'LOWER',_binary '',1,'L15','SLEEPER',7),(186,'UPPER',_binary '',1,'U15','SLEEPER',7),(187,'LOWER',_binary '',1.05,'L1','SLEEPER',10),(188,'UPPER',_binary '',1,'U1','SLEEPER',10),(189,'LOWER',_binary '\0',1,'L2','SLEEPER',10),(190,'UPPER',_binary '\0',0.95,'U2','SLEEPER',10),(191,'LOWER',_binary '',1.05,'L3','SLEEPER',10),(192,'UPPER',_binary '',1,'U3','SLEEPER',10),(193,'LOWER',_binary '',1.05,'L4','SLEEPER',10),(194,'UPPER',_binary '',1,'U4','SLEEPER',10),(195,'LOWER',_binary '\0',1,'L5','SLEEPER',10),(196,'UPPER',_binary '\0',0.95,'U5','SLEEPER',10),(197,'LOWER',_binary '',1.05,'L6','SLEEPER',10),(198,'UPPER',_binary '',1,'U6','SLEEPER',10),(199,'LOWER',_binary '',1.05,'L7','SLEEPER',10),(200,'UPPER',_binary '',1,'U7','SLEEPER',10),(201,'LOWER',_binary '\0',1,'L8','SLEEPER',10),(202,'UPPER',_binary '\0',0.95,'U8','SLEEPER',10),(203,'LOWER',_binary '',1.05,'L9','SLEEPER',10),(204,'UPPER',_binary '',1,'U9','SLEEPER',10),(205,'LOWER',_binary '',1.05,'L10','SLEEPER',10),(206,'UPPER',_binary '',1,'U10','SLEEPER',10),(207,'LOWER',_binary '\0',1,'L11','SLEEPER',10),(208,'UPPER',_binary '\0',0.95,'U11','SLEEPER',10),(209,'LOWER',_binary '',1.05,'L12','SLEEPER',10),(210,'UPPER',_binary '',1,'U12','SLEEPER',10),(211,'LOWER',_binary '',1.05,'L13','SLEEPER',10),(212,'UPPER',_binary '',1,'U13','SLEEPER',10),(213,'LOWER',_binary '\0',1,'L14','SLEEPER',10),(214,'UPPER',_binary '\0',0.95,'U14','SLEEPER',10),(215,'LOWER',_binary '',1.05,'L15','SLEEPER',10),(216,'UPPER',_binary '',1,'U15','SLEEPER',10);
/*!40000 ALTER TABLE `seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2026-10-13 19:12:29.793609','admin@busgo.com','BusGo Operations Lead','$2a$10$CBBvEWPTn8auFPrwnIO81eopfTmdx7sGueC0TW8TOMHTOKR7bn2ey','+91 98765 43210','ROLE_ADMIN'),(2,'2026-10-13 19:12:29.919703','user@busgo.com','Yuvraj Sharma','$2a$10$iRC.hcxIwEwp643TpJRf4.VkZrXexUbmC5qEiwTfuIKc3vWtJBbiy','+91 98190 12345','ROLE_USER'),(3,'2026-10-14 16:31:09.377498','gondyuvraj30@gmail.com','Yuvraj Gond','$2a$10$.x.xa4CI6qmlqmCyNunPdOb/c./gh6u8DZpqGJhTcJQRwgfSJ4XLO','9370211194','ROLE_USER'),(4,'2026-10-14 16:56:12.810411','ashisadmin30@gmail.com','Ashis','$2a$10$1pQLlNQHibGBLDPYj8Q7O.4w9FeZA5h0ALG9QUwFMkFVNvGNeVu1S','9370211194','ROLE_USER');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-24 23:57:22
