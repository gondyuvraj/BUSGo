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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-24 23:57:12
