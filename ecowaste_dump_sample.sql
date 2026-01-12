-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: ecowaste_db
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
-- Table structure for table `ewaste_requests`
--

DROP TABLE IF EXISTS `ewaste_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ewaste_requests` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `admin_remarks` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `completed_date` datetime(6) DEFAULT NULL,
  `condition_status` enum('WORKING','DAMAGED','DEAD') NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `device_type` varchar(255) NOT NULL,
  `image_urls` varchar(255) DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `pickup_address` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `rejection_reason` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `scheduled_pickup_date` datetime(6) DEFAULT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','SCHEDULED','COLLECTED','COMPLETED') NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `assigned_pickup_person_id` bigint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKtob6onp790ln6m14l59392k15` (`assigned_pickup_person_id`),
  KEY `FK37qpf6njim8inp6c7ig0byw6p` (`user_id`),
  CONSTRAINT `FK37qpf6njim8inp6c7ig0byw6p` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKtob6onp790ln6m14l59392k15` FOREIGN KEY (`assigned_pickup_person_id`) REFERENCES `pickup_persons` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ewaste_requests`
--

LOCK TABLES `ewaste_requests` WRITE;
/*!40000 ALTER TABLE `ewaste_requests` DISABLE KEYS */;
INSERT INTO `ewaste_requests` VALUES (1,NULL,'Lenovo','2025-12-23 17:24:17.169886','DAMAGED','2025-12-23 17:08:20.639027','LAPTOP','/uploads/8356f510-7dcf-4512-be66-3bd38ce155a8-WhatsApp Image 2025-12-23 at 6.39.53 PM (2).jpeg,/uploads/63da7cae-95f5-4aba-a20a-aeb394ba6ae0-WhatsApp Image 2025-12-23 at 6.39.53 PM (1).jpeg','Thinkpad','South car street ,rajakrishnapuram',1,'','','2025-12-24 04:30:00.000000','COMPLETED','2025-12-23 17:24:17.170423',2,3),(2,NULL,'kh','2025-12-23 17:20:41.864970','WORKING','2025-12-23 17:08:44.020144','LAPTOP','/uploads/17665794-5553-402d-b3b7-e9ea355e2b8e-WhatsApp Image 2025-12-23 at 6.39.53 PM (2).jpeg,/uploads/ba70d066-4341-4420-80a5-cb825f3cdbbb-WhatsApp Image 2025-12-23 at 6.39.53 PM (2).jpeg','jg','South car street ,rajakrishnapuram',1,'','','2025-12-24 04:30:00.000000','COMPLETED','2025-12-23 17:20:41.866971',1,3),(3,NULL,'Iphone','2026-01-06 17:23:12.333307','WORKING','2026-01-06 17:02:25.485599','MOBILE','/uploads/ff50d6cd-9357-4435-b3f9-b66cdca7d2c2-iPhone-16.jpg,/uploads/4c857e18-830b-4d55-a515-73819c2a4810-photo-1726828537956-61ae115d7d7a.jpg','16','South car street ,rajakrishnapuram',1,'','','2026-01-07 04:30:00.000000','COMPLETED','2026-01-06 17:23:12.335332',2,3),(4,NULL,'Samsung',NULL,'DAMAGED','2026-01-06 17:07:50.574402','MOBILE','/uploads/507f0ece-2800-41c1-bf8d-910913e58944-samsung-galaxy-s24-ultra-1887.webp,/uploads/94350040-28aa-48d1-bc9b-84a43b099f58-Samsung_S24_02.jpeg','S 24','South car street ,rajakrishnapuram',1,'','','2026-01-07 04:30:00.000000','COMPLETED','2026-01-11 16:50:56.996590',1,3);
/*!40000 ALTER TABLE `ewaste_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pickup_persons`
--

DROP TABLE IF EXISTS `pickup_persons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pickup_persons` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `is_available` bit(1) NOT NULL,
  `vehicle_number` varchar(255) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_f557hdeua5ygcphksvpuvy4te` (`user_id`),
  CONSTRAINT `FKqnnrxg0c48l3jbglka46ycw1i` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pickup_persons`
--

LOCK TABLES `pickup_persons` WRITE;
/*!40000 ALTER TABLE `pickup_persons` DISABLE KEYS */;
INSERT INTO `pickup_persons` VALUES (1,'2025-12-23 17:11:50.501244',_binary '','TN 72 BE 0808',4),(2,'2025-12-23 17:22:10.999823',_binary '','',5);
/*!40000 ALTER TABLE `pickup_persons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support_queries`
--

DROP TABLE IF EXISTS `support_queries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support_queries` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `admin_reply` text,
  `category` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text,
  `related_request_id` varchar(255) DEFAULT NULL,
  `resolved_at` datetime(6) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKd55p600ig4r5d3jncfyf57vgy` (`user_id`),
  CONSTRAINT `FKd55p600ig4r5d3jncfyf57vgy` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_queries`
--

LOCK TABLES `support_queries` WRITE;
/*!40000 ALTER TABLE `support_queries` DISABLE KEYS */;
INSERT INTO `support_queries` VALUES (1,'Sorry for this, Next time we try our best','Pickup Issues','2026-01-06 17:04:12.595186','Takes more time ti Pickup','2','2026-01-06 17:12:44.771241','Resolved','Takes more time ti Pickup',3);
/*!40000 ALTER TABLE `support_queries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `role` enum('ROLE_USER','ROLE_ADMIN','ROLE_PICKUP_PERSON') NOT NULL,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,NULL,'2025-12-23 16:59:46.075929','admin@ewaste.com','Admin User','$2a$10$DGEYyjtToI860.iZMN0zteEkRh.WvrUhK25K2s9.MVwYe39WstWUG',NULL,'ROLE_ADMIN','ACTIVE'),(2,NULL,'2025-12-23 16:59:46.289668','user@example.com','Regular User','$2a$10$PnSyPW0xTZygSFYi2w5/beGLUhHvUxMIVq/iaq56k2shUCpjMBZr2',NULL,'ROLE_USER','ACTIVE'),(3,'South car street ,rajakrishnapuram','2025-12-23 17:01:50.377847','mahesh222ma@gmail.com','mahesh','$2a$10$849Rhk337SMJIgmWNlX0Vut.8L.3Hyk0054Kxw1yUmDoI7XmGc5lK','12345678','ROLE_USER','ACTIVE'),(4,'Rajakrishnapuram, Tirunelveli','2025-12-23 17:11:50.285552','ssreemaheshkumar@gmail.com','Dreamer','$2a$10$9lVWUvmB1i38c/b.atgYcenzozG0Qa2KOAWy8Ya1WtQnkCQgLewti','8680072366','ROLE_PICKUP_PERSON','ACTIVE'),(5,'3/13,South car street ,rajakam','2025-12-23 17:22:10.804550','mahesh123qr@gmail.com','Mahesh Kumar','$2a$10$ZORQ8AocL4NQXlgiUCUo8OhUSzp4aGkWKMr7E5PD56TCfoLVJ/X5i','8680072366','ROLE_PICKUP_PERSON','ACTIVE');
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

-- Dump completed on 2026-01-11 22:55:46
