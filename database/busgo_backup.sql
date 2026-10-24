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
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `booking_reference` varchar(255) NOT NULL,
  `booking_status` varchar(255) NOT NULL,
  `booking_time` datetime(6) DEFAULT NULL,
  `journey_date` date NOT NULL,
  `passenger_details` text,
  `payment_status` varchar(255) NOT NULL,
  `refund_amount` double DEFAULT NULL,
  `seat_numbers` varchar(255) NOT NULL,
  `total_amount` double NOT NULL,
  `schedule_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `cancellation_reason` varchar(40) DEFAULT NULL,
  `cancellation_reason_details` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKe92mgyq35mdeo8gc1un2o6uk0` (`booking_reference`),
  KEY `FKer0lq2qsui5vv3qn0i6sm1rom` (`schedule_id`),
  KEY `FKeyog2oic85xg7hsu2je2lx3s6` (`user_id`),
  CONSTRAINT `FKer0lq2qsui5vv3qn0i6sm1rom` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`),
  CONSTRAINT `FKeyog2oic85xg7hsu2je2lx3s6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,'BG-712849','CANCELLED','2026-10-13 19:12:30.999493','2026-10-15','[{\"name\":\"Yuvraj Sharma\",\"age\":22,\"gender\":\"MALE\",\"seatNumber\":\"L3\"},{\"name\":\"Rahul Deshmukh\",\"age\":23,\"gender\":\"MALE\",\"seatNumber\":\"L4\"}]','REFUNDED',943.11,'L3, L4',1047.9,1,2,NULL,NULL),(2,'BG-583920','CONFIRMED','2026-10-09 19:12:31.024491','2026-10-11','[{\"name\":\"Yuvraj Sharma\",\"age\":22,\"gender\":\"MALE\",\"seatNumber\":\"U1\"}]','COMPLETED',0,'U1',1299,7,2,NULL,NULL),(3,'BG-165224','CANCELLED','2026-10-15 16:14:57.209995','2026-10-15','[{\"name\":\"Yuvraj Sharma\",\"age\":18,\"gender\":\"MALE\",\"seatNumber\":\"L15\"}]','REFUNDED',396.9,'L15',441,9,2,NULL,NULL),(4,'BG-651453','CONFIRMED','2026-10-16 15:45:56.929860','2026-10-16','[{\"name\":\"Yuvraj Sharma\",\"age\":22,\"gender\":\"MALE\",\"seatNumber\":\"U2\"}]','COMPLETED',0,'U2',547.63,2,2,NULL,NULL),(5,'BG-323765','CANCELLED','2026-10-24 18:13:09.617353','2026-10-24','[{\"name\":\"Test Passenger\",\"age\":25,\"gender\":\"MALE\",\"seatNumber\":\"L5\"}]','REFUNDED',471.56,'L5',523.95,1,2,'CHANGE_OF_PLANS',NULL);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buses`
--

DROP TABLE IF EXISTS `buses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amenities` varchar(255) DEFAULT NULL,
  `bus_number` varchar(255) NOT NULL,
  `bus_type` varchar(255) NOT NULL,
  `operator_name` varchar(255) NOT NULL,
  `rating` double DEFAULT NULL,
  `reviews_count` int DEFAULT NULL,
  `total_seats` int NOT NULL,
  `average_speed_kmh` double DEFAULT NULL,
  `brand_name` varchar(255) DEFAULT NULL,
  `bus_age_years` int DEFAULT NULL,
  `bus_color` varchar(255) DEFAULT NULL,
  `bus_model` varchar(255) DEFAULT NULL,
  `company_email` varchar(255) DEFAULT NULL,
  `company_phone` varchar(255) DEFAULT NULL,
  `company_website` varchar(255) DEFAULT NULL,
  `engine_type` varchar(255) DEFAULT NULL,
  `established_year` varchar(255) DEFAULT NULL,
  `hasac` bit(1) DEFAULT NULL,
  `has_blanket_pillow` bit(1) DEFAULT NULL,
  `hascctv` bit(1) DEFAULT NULL,
  `has_charging_point` bit(1) DEFAULT NULL,
  `has_clean_washroom` bit(1) DEFAULT NULL,
  `has_emergencysos` bit(1) DEFAULT NULL,
  `hasgps` bit(1) DEFAULT NULL,
  `has_ladies_seat` bit(1) DEFAULT NULL,
  `has_live_tracking` bit(1) DEFAULT NULL,
  `has_panic_button` bit(1) DEFAULT NULL,
  `has_reading_light` bit(1) DEFAULT NULL,
  `has_seater` bit(1) DEFAULT NULL,
  `has_sleeper` bit(1) DEFAULT NULL,
  `has_water_bottle` bit(1) DEFAULT NULL,
  `has_wifi` bit(1) DEFAULT NULL,
  `insurance_provider` varchar(255) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `last_service_date` varchar(255) DEFAULT NULL,
  `permit_number` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKf0wpejbtx1fk17hi1t6ba5vbv` (`bus_number`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buses`
--

LOCK TABLES `buses` WRITE;
/*!40000 ALTER TABLE `buses` DISABLE KEYS */;
INSERT INTO `buses` VALUES (1,'WiFi,Charging Point,Water Bottle,Blanket,Live Tracking,Reading Light','MH-01-BG-1001','AC_SLEEPER','Zingbus Electric Multi-Axle',4.9,320,30,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,'AC,Pillows,Clean Washroom,Charging Point,GPS,CCTV','MH-12-BG-2002','AC_SLEEPER','IntrCity SmartBus Premium Lounge',4.8,215,30,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,'WiFi,AC,Water Bottle,Emergency SOS,Personal Screen','KA-05-BG-3003','AC_SLEEPER','Orange Travels Volvo 9600',4.7,180,30,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,'AC,Ergonomic Recliner,Snacks,USB Port,M-Ticket','DL-01-BG-4004','AC_SEATER','SRS Travels Club Class',4.6,95,36,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,'AC,WiFi,Blanket,Mineral Water,GPS Tracking','GA-03-BG-5005','AC_SLEEPER','VRL Travels Super Luxury Sleeper',4.9,440,30,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,'WiFi,AC,Blanket,Water Bottle,Reading Light,GPS','MH-04-GR-8754','NON_AC_SLEEPER','Rahul Jain',4.8,10,22,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(10,'WiFi,AC,Blanket,Water Bottle,Reading Light,GPS','MH-07-JH-6058','AC_SEATER','Aakash',4.5,10,30,84,'VLR',14,'','Other','aakash30@gmail.com','9822768402','aakash.in','DIESEL','2022',_binary '',_binary '\0',_binary '',_binary '',_binary '\0',_binary '',_binary '',_binary '',_binary '\0',_binary '',_binary '',_binary '',_binary '\0',_binary '',_binary '','',_binary '','','');
/*!40000 ALTER TABLE `buses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `holiday_plan_highlights`
--

DROP TABLE IF EXISTS `holiday_plan_highlights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `holiday_plan_highlights` (
  `holiday_plan_id` bigint NOT NULL,
  `highlight` varchar(500) NOT NULL,
  `position` int NOT NULL,
  PRIMARY KEY (`holiday_plan_id`,`position`),
  CONSTRAINT `FK5w6xkp4lwpo70yrlnlen5bnfv` FOREIGN KEY (`holiday_plan_id`) REFERENCES `holiday_plans` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `holiday_plan_highlights`
--

LOCK TABLES `holiday_plan_highlights` WRITE;
/*!40000 ALTER TABLE `holiday_plan_highlights` DISABLE KEYS */;
INSERT INTO `holiday_plan_highlights` VALUES (1,'Sunset at the shore',0),(1,'Old Goa heritage walk',1),(1,'Local food & market time',2),(2,'Amber Fort & city views',0),(2,'Pink City streets',1),(2,'Hawa Mahal photo stop',2),(3,'Charminar & old city',0),(3,'Local food trail',1),(3,'Lakefront evening',2),(6,'Sunrise, sunset, Multiple Activities',0);
/*!40000 ALTER TABLE `holiday_plan_highlights` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `holiday_plan_itinerary`
--

DROP TABLE IF EXISTS `holiday_plan_itinerary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `holiday_plan_itinerary` (
  `holiday_plan_id` bigint NOT NULL,
  `itinerary_item` varchar(1000) NOT NULL,
  `position` int NOT NULL,
  PRIMARY KEY (`holiday_plan_id`,`position`),
  CONSTRAINT `FK3m34ha8s0ei77mqeovkcouu4d` FOREIGN KEY (`holiday_plan_id`) REFERENCES `holiday_plans` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `holiday_plan_itinerary`
--

LOCK TABLES `holiday_plan_itinerary` WRITE;
/*!40000 ALTER TABLE `holiday_plan_itinerary` DISABLE KEYS */;
INSERT INTO `holiday_plan_itinerary` VALUES (1,'Day 1 · Arrive in Goa, check in, and spend the evening by the coast.',0),(1,'Day 2 · Explore Old Goa, enjoy a relaxed lunch, and catch sunset at the beach.',1),(1,'Day 3 · Take a slow morning before your return journey.',2),(2,'Day 1 · Explore the Pink City, local bazaars, and Hawa Mahal.',0),(2,'Day 2 · Visit Amber Fort and enjoy a final meal before heading back.',1),(3,'Day 1 · Settle in and take an evening stroll by Hussain Sagar.',0),(3,'Day 2 · Visit Charminar and explore the old city food scene.',1),(3,'Day 3 · Enjoy a relaxed breakfast before your return journey.',2),(6,'Day1: Travling',0);
/*!40000 ALTER TABLE `holiday_plan_itinerary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `holiday_plans`
--

DROP TABLE IF EXISTS `holiday_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `holiday_plans` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(2000) NOT NULL,
  `destination_city` varchar(255) NOT NULL,
  `duration` varchar(255) NOT NULL,
  `fare` double NOT NULL,
  `image` varchar(1000) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `published` bit(1) NOT NULL,
  `source_city` varchar(255) NOT NULL,
  `theme` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `holiday_plans`
--

LOCK TABLES `holiday_plans` WRITE;
/*!40000 ALTER TABLE `holiday_plans` DISABLE KEYS */;
INSERT INTO `holiday_plans` VALUES (1,'A relaxed coastal escape with heritage, local food, and time by the sea.','Goa','3 days · 2 nights',1299,'/images/hero-bus.jpg','Goa coast & slow mornings',_binary '','Mumbai','Beach'),(2,'A short city break for forts, pink-hued streets, and local markets.','Jaipur','2 days · 1 night',599,'','Jaipur royal weekend',_binary '','Delhi','Culture'),(3,'Discover the old city, regional food, and a relaxed evening by the lake.','Hyderabad','3 days · 2 nights',999,'','Hyderabad heritage & food',_binary '','Bangalore','Culture'),(6,'lets explore new mwmories','Ratnagiri','5days. 3night',1500,'','Kokan Exp.',_binary '','Pune','Beach');
/*!40000 ALTER TABLE `holiday_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` double NOT NULL,
  `paid_at` datetime(6) DEFAULT NULL,
  `payment_method` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `transaction_id` varchar(255) NOT NULL,
  `booking_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKlryndveuwa4k5qthti0pkmtlx` (`transaction_id`),
  UNIQUE KEY `UKnuscjm6x127hkb15kcb8n56wo` (`booking_id`),
  CONSTRAINT `FKc52o2b1jkxttngufqp3t7jr3h` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1047.9,'2026-10-13 19:12:31.015492','UPI','SUCCESS','TXN-849102',1),(2,1299,'2026-10-13 19:12:31.030490','CARD','SUCCESS','TXN-391829',2),(3,441,'2026-10-15 16:14:57.228988','UPI','SUCCESS','TXN-1792080897196',3),(4,547.63,'2026-10-16 15:45:56.950135','UPI','SUCCESS','TXN-1792165556920',4),(5,523.95,'2026-10-24 18:13:09.688171','UPI','SUCCESS','TXN-1792865589613',5);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routes`
--

DROP TABLE IF EXISTS `routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `routes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `destination_city` varchar(255) NOT NULL,
  `distance_km` int DEFAULT NULL,
  `estimated_duration_hours` double DEFAULT NULL,
  `source_city` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routes`
--

LOCK TABLES `routes` WRITE;
/*!40000 ALTER TABLE `routes` DISABLE KEYS */;
INSERT INTO `routes` VALUES (1,'Pune',150,3.5,'Mumbai'),(2,'Mumbai',150,3.5,'Pune'),(3,'Hyderabad',570,8.5,'Bangalore'),(4,'Jaipur',280,5,'Delhi'),(5,'Goa',590,11,'Mumbai'),(6,'Chennai',350,6,'Bangalore'),(7,'Bangalore',570,8.5,'Hyderabad'),(8,'Pune',200,4,'Mumbai');
/*!40000 ALTER TABLE `routes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedules`
--

DROP TABLE IF EXISTS `schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedules` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `arrival_time` varchar(255) NOT NULL,
  `boarding_point` varchar(255) DEFAULT NULL,
  `departure_time` varchar(255) NOT NULL,
  `dropping_point` varchar(255) DEFAULT NULL,
  `fare` double NOT NULL,
  `bus_id` bigint NOT NULL,
  `route_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpuih24muu99o0lkfkasqh26uj` (`bus_id`),
  KEY `FKc29vj8art9umx13trmnv0pqw7` (`route_id`),
  CONSTRAINT `FKc29vj8art9umx13trmnv0pqw7` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`),
  CONSTRAINT `FKpuih24muu99o0lkfkasqh26uj` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedules`
--

LOCK TABLES `schedules` WRITE;
/*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
INSERT INTO `schedules` VALUES (1,'10:00 AM','Borivali West / Dadar TT Circle','06:30 AM','Swargate / Hinjawadi Bridge',499,1,1),(2,'05:30 PM','Bandra Kurla Complex / Vashi Plaza','02:00 PM','Wakad Flyover / Pune Station',549,2,1),(3,'02:00 AM','Andheri East / Chembur Maitri Park','10:30 PM','Shivajinagar / Swargate Bus Stand',699,3,1),(4,'10:30 AM','Pune Station / Wakad','07:00 AM','Dadar TT / Borivali',499,1,2),(5,'06:00 AM','Majestic Bus Stand / Hebbal','09:30 PM','Ameerpet / Gachibowli ORR',999,2,3),(6,'11:15 AM','Kashmere Gate ISBT / Dhaula Kuan','06:00 AM','Sindhi Camp / 200 Ft Bypass',599,4,4),(7,'07:00 AM','Borivali / Sion / Panvel','08:00 PM','Panjim KTC Bus Stand / Mapusa',1299,5,5),(8,'05:00 AM','Electronic City / Silk Board','11:00 PM','Koyambedu CMBT / Guindy',699,3,6),(9,'06:00 AM','Dadar main h','09:00 PM','Pune',400,1,1),(10,'06:00 AM','','09:00 PM','',799,1,1),(11,'06:00 AM','DADAR','09:00 PM','PUNE',799,10,1);
/*!40000 ALTER TABLE `schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seats`
--

DROP TABLE IF EXISTS `seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seats` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `deck` varchar(255) NOT NULL,
  `is_window` bit(1) DEFAULT NULL,
  `price_multiplier` double DEFAULT NULL,
  `seat_number` varchar(255) NOT NULL,
  `seat_type` varchar(255) NOT NULL,
  `bus_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKdysgofh5bvo6ijbxunf7x6fa6` (`bus_id`),
  CONSTRAINT `FKdysgofh5bvo6ijbxunf7x6fa6` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=217 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seats`
--

LOCK TABLES `seats` WRITE;
/*!40000 ALTER TABLE `seats` DISABLE KEYS */;
INSERT INTO `seats` VALUES (1,'LOWER',_binary '',1.05,'L1','SLEEPER',1),(2,'UPPER',_binary '',1,'U1','SLEEPER',1),(3,'LOWER',_binary '\0',1,'L2','SLEEPER',1),(4,'UPPER',_binary '\0',0.95,'U2','SLEEPER',1),(5,'LOWER',_binary '',1.05,'L3','SLEEPER',1),(6,'UPPER',_binary '',1,'U3','SLEEPER',1),(7,'LOWER',_binary '',1.05,'L4','SLEEPER',1),(8,'UPPER',_binary '',1,'U4','SLEEPER',1),(9,'LOWER',_binary '\0',1,'L5','SLEEPER',1),(10,'UPPER',_binary '\0',0.95,'U5','SLEEPER',1),(11,'LOWER',_binary '',1.05,'L6','SLEEPER',1),(12,'UPPER',_binary '',1,'U6','SLEEPER',1),(13,'LOWER',_binary '',1.05,'L7','SLEEPER',1),(14,'UPPER',_binary '',1,'U7','SLEEPER',1),(15,'LOWER',_binary '\0',1,'L8','SLEEPER',1),(16,'UPPER',_binary '\0',0.95,'U8','SLEEPER',1),(17,'LOWER',_binary '',1.05,'L9','SLEEPER',1),(18,'UPPER',_binary '',1,'U9','SLEEPER',1),(19,'LOWER',_binary '',1.05,'L10','SLEEPER',1),(20,'UPPER',_binary '',1,'U10','SLEEPER',1),(21,'LOWER',_binary '\0',1,'L11','SLEEPER',1),(22,'UPPER',_binary '\0',0.95,'U11','SLEEPER',1),(23,'LOWER',_binary '',1.05,'L12','SLEEPER',1),(24,'UPPER',_binary '',1,'U12','SLEEPER',1),(25,'LOWER',_binary '',1.05,'L13','SLEEPER',1),(26,'UPPER',_binary '',1,'U13','SLEEPER',1),(27,'LOWER',_binary '\0',1,'L14','SLEEPER',1),(28,'UPPER',_binary '\0',0.95,'U14','SLEEPER',1),(29,'LOWER',_binary '',1.05,'L15','SLEEPER',1),(30,'UPPER',_binary '',1,'U15','SLEEPER',1),(31,'LOWER',_binary '',1.05,'L1','SLEEPER',2),(32,'UPPER',_binary '',1,'U1','SLEEPER',2),(33,'LOWER',_binary '\0',1,'L2','SLEEPER',2),(34,'UPPER',_binary '\0',0.95,'U2','SLEEPER',2),(35,'LOWER',_binary '',1.05,'L3','SLEEPER',2),(36,'UPPER',_binary '',1,'U3','SLEEPER',2),(37,'LOWER',_binary '',1.05,'L4','SLEEPER',2),(38,'UPPER',_binary '',1,'U4','SLEEPER',2),(39,'LOWER',_binary '\0',1,'L5','SLEEPER',2),(40,'UPPER',_binary '\0',0.95,'U5','SLEEPER',2),(41,'LOWER',_binary '',1.05,'L6','SLEEPER',2),(42,'UPPER',_binary '',1,'U6','SLEEPER',2),(43,'LOWER',_binary '',1.05,'L7','SLEEPER',2),(44,'UPPER',_binary '',1,'U7','SLEEPER',2),(45,'LOWER',_binary '\0',1,'L8','SLEEPER',2),(46,'UPPER',_binary '\0',0.95,'U8','SLEEPER',2),(47,'LOWER',_binary '',1.05,'L9','SLEEPER',2),(48,'UPPER',_binary '',1,'U9','SLEEPER',2),(49,'LOWER',_binary '',1.05,'L10','SLEEPER',2),(50,'UPPER',_binary '',1,'U10','SLEEPER',2),(51,'LOWER',_binary '\0',1,'L11','SLEEPER',2),(52,'UPPER',_binary '\0',0.95,'U11','SLEEPER',2),(53,'LOWER',_binary '',1.05,'L12','SLEEPER',2),(54,'UPPER',_binary '',1,'U12','SLEEPER',2),(55,'LOWER',_binary '',1.05,'L13','SLEEPER',2),(56,'UPPER',_binary '',1,'U13','SLEEPER',2),(57,'LOWER',_binary '\0',1,'L14','SLEEPER',2),(58,'UPPER',_binary '\0',0.95,'U14','SLEEPER',2),(59,'LOWER',_binary '',1.05,'L15','SLEEPER',2),(60,'UPPER',_binary '',1,'U15','SLEEPER',2),(61,'LOWER',_binary '',1.05,'L1','SLEEPER',3),(62,'UPPER',_binary '',1,'U1','SLEEPER',3),(63,'LOWER',_binary '\0',1,'L2','SLEEPER',3),(64,'UPPER',_binary '\0',0.95,'U2','SLEEPER',3),(65,'LOWER',_binary '',1.05,'L3','SLEEPER',3),(66,'UPPER',_binary '',1,'U3','SLEEPER',3),(67,'LOWER',_binary '',1.05,'L4','SLEEPER',3),(68,'UPPER',_binary '',1,'U4','SLEEPER',3),(69,'LOWER',_binary '\0',1,'L5','SLEEPER',3),(70,'UPPER',_binary '\0',0.95,'U5','SLEEPER',3),(71,'LOWER',_binary '',1.05,'L6','SLEEPER',3),(72,'UPPER',_binary '',1,'U6','SLEEPER',3),(73,'LOWER',_binary '',1.05,'L7','SLEEPER',3),(74,'UPPER',_binary '',1,'U7','SLEEPER',3),(75,'LOWER',_binary '\0',1,'L8','SLEEPER',3),(76,'UPPER',_binary '\0',0.95,'U8','SLEEPER',3),(77,'LOWER',_binary '',1.05,'L9','SLEEPER',3),(78,'UPPER',_binary '',1,'U9','SLEEPER',3),(79,'LOWER',_binary '',1.05,'L10','SLEEPER',3),(80,'UPPER',_binary '',1,'U10','SLEEPER',3),(81,'LOWER',_binary '\0',1,'L11','SLEEPER',3),(82,'UPPER',_binary '\0',0.95,'U11','SLEEPER',3),(83,'LOWER',_binary '',1.05,'L12','SLEEPER',3),(84,'UPPER',_binary '',1,'U12','SLEEPER',3),(85,'LOWER',_binary '',1.05,'L13','SLEEPER',3),(86,'UPPER',_binary '',1,'U13','SLEEPER',3),(87,'LOWER',_binary '\0',1,'L14','SLEEPER',3),(88,'UPPER',_binary '\0',0.95,'U14','SLEEPER',3),(89,'LOWER',_binary '',1.05,'L15','SLEEPER',3),(90,'UPPER',_binary '',1,'U15','SLEEPER',3),(91,'LOWER',_binary '',1.05,'L1','SLEEPER',4),(92,'UPPER',_binary '',1,'U1','SLEEPER',4),(93,'LOWER',_binary '\0',1,'L2','SLEEPER',4),(94,'UPPER',_binary '\0',0.95,'U2','SLEEPER',4),(95,'LOWER',_binary '',1.05,'L3','SLEEPER',4),(96,'UPPER',_binary '',1,'U3','SLEEPER',4),(97,'LOWER',_binary '',1.05,'L4','SLEEPER',4),(98,'UPPER',_binary '',1,'U4','SLEEPER',4),(99,'LOWER',_binary '\0',1,'L5','SLEEPER',4),(100,'UPPER',_binary '\0',0.95,'U5','SLEEPER',4),(101,'LOWER',_binary '',1.05,'L6','SLEEPER',4),(102,'UPPER',_binary '',1,'U6','SLEEPER',4),(103,'LOWER',_binary '',1.05,'L7','SLEEPER',4),(104,'UPPER',_binary '',1,'U7','SLEEPER',4),(105,'LOWER',_binary '\0',1,'L8','SLEEPER',4),(106,'UPPER',_binary '\0',0.95,'U8','SLEEPER',4),(107,'LOWER',_binary '',1.05,'L9','SLEEPER',4),(108,'UPPER',_binary '',1,'U9','SLEEPER',4),(109,'LOWER',_binary '',1.05,'L10','SLEEPER',4),(110,'UPPER',_binary '',1,'U10','SLEEPER',4),(111,'LOWER',_binary '\0',1,'L11','SLEEPER',4),(112,'UPPER',_binary '\0',0.95,'U11','SLEEPER',4),(113,'LOWER',_binary '',1.05,'L12','SLEEPER',4),(114,'UPPER',_binary '',1,'U12','SLEEPER',4),(115,'LOWER',_binary '',1.05,'L13','SLEEPER',4),(116,'UPPER',_binary '',1,'U13','SLEEPER',4),(117,'LOWER',_binary '\0',1,'L14','SLEEPER',4),(118,'UPPER',_binary '\0',0.95,'U14','SLEEPER',4),(119,'LOWER',_binary '',1.05,'L15','SLEEPER',4),(120,'UPPER',_binary '',1,'U15','SLEEPER',4),(121,'LOWER',_binary '',1.05,'L16','SLEEPER',4),(122,'UPPER',_binary '',1,'U16','SLEEPER',4),(123,'LOWER',_binary '\0',1,'L17','SLEEPER',4),(124,'UPPER',_binary '\0',0.95,'U17','SLEEPER',4),(125,'LOWER',_binary '',1.05,'L18','SLEEPER',4),(126,'UPPER',_binary '',1,'U18','SLEEPER',4),(127,'LOWER',_binary '',1.05,'L1','SLEEPER',5),(128,'UPPER',_binary '',1,'U1','SLEEPER',5),(129,'LOWER',_binary '\0',1,'L2','SLEEPER',5),(130,'UPPER',_binary '\0',0.95,'U2','SLEEPER',5),(131,'LOWER',_binary '',1.05,'L3','SLEEPER',5),(132,'UPPER',_binary '',1,'U3','SLEEPER',5),(133,'LOWER',_binary '',1.05,'L4','SLEEPER',5),(134,'UPPER',_binary '',1,'U4','SLEEPER',5),(135,'LOWER',_binary '\0',1,'L5','SLEEPER',5),(136,'UPPER',_binary '\0',0.95,'U5','SLEEPER',5),(137,'LOWER',_binary '',1.05,'L6','SLEEPER',5),(138,'UPPER',_binary '',1,'U6','SLEEPER',5),(139,'LOWER',_binary '',1.05,'L7','SLEEPER',5),(140,'UPPER',_binary '',1,'U7','SLEEPER',5),(141,'LOWER',_binary '\0',1,'L8','SLEEPER',5),(142,'UPPER',_binary '\0',0.95,'U8','SLEEPER',5),(143,'LOWER',_binary '',1.05,'L9','SLEEPER',5),(144,'UPPER',_binary '',1,'U9','SLEEPER',5),(145,'LOWER',_binary '',1.05,'L10','SLEEPER',5),(146,'UPPER',_binary '',1,'U10','SLEEPER',5),(147,'LOWER',_binary '\0',1,'L11','SLEEPER',5),(148,'UPPER',_binary '\0',0.95,'U11','SLEEPER',5),(149,'LOWER',_binary '',1.05,'L12','SLEEPER',5),(150,'UPPER',_binary '',1,'U12','SLEEPER',5),(151,'LOWER',_binary '',1.05,'L13','SLEEPER',5),(152,'UPPER',_binary '',1,'U13','SLEEPER',5),(153,'LOWER',_binary '\0',1,'L14','SLEEPER',5),(154,'UPPER',_binary '\0',0.95,'U14','SLEEPER',5),(155,'LOWER',_binary '',1.05,'L15','SLEEPER',5),(156,'UPPER',_binary '',1,'U15','SLEEPER',5),(157,'LOWER',_binary '',1,'L1','SLEEPER',7),(158,'UPPER',_binary '',1,'U1','SLEEPER',7),(159,'LOWER',_binary '\0',1,'L2','SLEEPER',7),(160,'UPPER',_binary '\0',1,'U2','SLEEPER',7),(161,'LOWER',_binary '',1,'L3','SLEEPER',7),(162,'UPPER',_binary '',1,'U3','SLEEPER',7),(163,'LOWER',_binary '\0',1,'L4','SLEEPER',7),(164,'UPPER',_binary '\0',1,'U4','SLEEPER',7),(165,'LOWER',_binary '',1,'L5','SLEEPER',7),(166,'UPPER',_binary '',1,'U5','SLEEPER',7),(167,'LOWER',_binary '\0',1,'L6','SLEEPER',7),(168,'UPPER',_binary '\0',1,'U6','SLEEPER',7),(169,'LOWER',_binary '',1,'L7','SLEEPER',7),(170,'UPPER',_binary '',1,'U7','SLEEPER',7),(171,'LOWER',_binary '\0',1,'L8','SLEEPER',7),(172,'UPPER',_binary '\0',1,'U8','SLEEPER',7),(173,'LOWER',_binary '',1,'L9','SLEEPER',7),(174,'UPPER',_binary '',1,'U9','SLEEPER',7),(175,'LOWER',_binary '\0',1,'L10','SLEEPER',7),(176,'UPPER',_binary '\0',1,'U10','SLEEPER',7),(177,'LOWER',_binary '',1,'L11','SLEEPER',7),(178,'UPPER',_binary '',1,'U11','SLEEPER',7),(179,'LOWER',_binary '\0',1,'L12','SLEEPER',7),(180,'UPPER',_binary '\0',1,'U12','SLEEPER',7),(181,'LOWER',_binary '',1,'L13','SLEEPER',7),(182,'UPPER',_binary '',1,'U13','SLEEPER',7),(183,'LOWER',_binary '\0',1,'L14','SLEEPER',7),(184,'UPPER',_binary '\0',1,'U14','SLEEPER',7),(185,'LOWER',_binary '',1,'L15','SLEEPER',7),(186,'UPPER',_binary '',1,'U15','SLEEPER',7),(187,'LOWER',_binary '',1.05,'L1','SLEEPER',10),(188,'UPPER',_binary '',1,'U1','SLEEPER',10),(189,'LOWER',_binary '\0',1,'L2','SLEEPER',10),(190,'UPPER',_binary '\0',0.95,'U2','SLEEPER',10),(191,'LOWER',_binary '',1.05,'L3','SLEEPER',10),(192,'UPPER',_binary '',1,'U3','SLEEPER',10),(193,'LOWER',_binary '',1.05,'L4','SLEEPER',10),(194,'UPPER',_binary '',1,'U4','SLEEPER',10),(195,'LOWER',_binary '\0',1,'L5','SLEEPER',10),(196,'UPPER',_binary '\0',0.95,'U5','SLEEPER',10),(197,'LOWER',_binary '',1.05,'L6','SLEEPER',10),(198,'UPPER',_binary '',1,'U6','SLEEPER',10),(199,'LOWER',_binary '',1.05,'L7','SLEEPER',10),(200,'UPPER',_binary '',1,'U7','SLEEPER',10),(201,'LOWER',_binary '\0',1,'L8','SLEEPER',10),(202,'UPPER',_binary '\0',0.95,'U8','SLEEPER',10),(203,'LOWER',_binary '',1.05,'L9','SLEEPER',10),(204,'UPPER',_binary '',1,'U9','SLEEPER',10),(205,'LOWER',_binary '',1.05,'L10','SLEEPER',10),(206,'UPPER',_binary '',1,'U10','SLEEPER',10),(207,'LOWER',_binary '\0',1,'L11','SLEEPER',10),(208,'UPPER',_binary '\0',0.95,'U11','SLEEPER',10),(209,'LOWER',_binary '',1.05,'L12','SLEEPER',10),(210,'UPPER',_binary '',1,'U12','SLEEPER',10),(211,'LOWER',_binary '',1.05,'L13','SLEEPER',10),(212,'UPPER',_binary '',1,'U13','SLEEPER',10),(213,'LOWER',_binary '\0',1,'L14','SLEEPER',10),(214,'UPPER',_binary '\0',0.95,'U14','SLEEPER',10),(215,'LOWER',_binary '',1.05,'L15','SLEEPER',10),(216,'UPPER',_binary '',1,'U15','SLEEPER',10);
/*!40000 ALTER TABLE `seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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

-- Dump completed on 2026-10-24 23:44:28
