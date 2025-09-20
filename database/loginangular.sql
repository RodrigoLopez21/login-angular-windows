-- MySQL dump 10.13  Distrib 9.4.0, for macos14.7 (arm64)
--
-- Host: localhost    Database: loginangular
-- ------------------------------------------------------
-- Server version	9.4.0

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
-- Table structure for table `categories`
--
CREATE DATABASE IF NOT EXISTS loginangular;
USE loginangular;
CREATE USER IF NOT EXISTS 'usuario_app'@'localhost' IDENTIFIED BY 'contraseña_segura';
GRANT ALL PRIVILEGES ON loginangular.* TO 'usuario_app'@'localhost';
FLUSH PRIVILEGES;

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `Cid` int NOT NULL AUTO_INCREMENT,
  `Cname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Cdescription` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Cstatus` int NOT NULL,
  `Ccreated` datetime NOT NULL,
  `Cupdated` datetime NOT NULL,
  `Cdeleted` datetime NOT NULL,
  PRIMARY KEY (`Cid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Tecnología','Gadgets y más',1,'2025-09-14 03:49:09','2025-09-14 03:49:09','2025-09-14 03:49:09');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `Cid` int NOT NULL AUTO_INCREMENT,
  `Cname` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Cdescription` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Cstatus` int NOT NULL DEFAULT '1',
  `Ccreated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Cupdated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Cdeleted` datetime DEFAULT NULL,
  PRIMARY KEY (`Cid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Tecnología','Gadgets y más',1,'2025-09-13 21:43:33','2025-09-13 21:43:33',NULL),(2,'Tecnología','Gadgets y más',1,'2025-09-13 21:48:02','2025-09-13 21:48:02',NULL);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `Pid` int NOT NULL AUTO_INCREMENT,
  `Pname` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Cid` int DEFAULT NULL,
  PRIMARY KEY (`Pid`),
  KEY `fk_prod_cat` (`Cid`),
  CONSTRAINT `fk_prod_cat` FOREIGN KEY (`Cid`) REFERENCES `category` (`Cid`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `Pid` int NOT NULL AUTO_INCREMENT,
  `Pname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Pdescription` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `CategoryId` int NOT NULL,
  `Pstatus` int NOT NULL,
  `Pcreated` datetime NOT NULL,
  `Pupdated` datetime NOT NULL,
  `Pdeleted` datetime NOT NULL,
  PRIMARY KEY (`Pid`),
  KEY `CategoryId` (`CategoryId`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`CategoryId`) REFERENCES `categories` (`Cid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `Rid` int NOT NULL AUTO_INCREMENT,
  `Rname` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`Rid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'Admin'),(2,'User');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `Rid` int NOT NULL AUTO_INCREMENT,
  `Rname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Rstatus` int NOT NULL,
  `Rcreated` datetime NOT NULL,
  `Rupdated` datetime NOT NULL,
  `Rdeleted` datetime NOT NULL,
  PRIMARY KEY (`Rid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `Uid` int NOT NULL AUTO_INCREMENT,
  `Uname` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Ulastname` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Uemail` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Upassword` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Ucredential` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Ustatus` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`Uid`),
  UNIQUE KEY `Uemail` (`Uemail`),
  UNIQUE KEY `Ucredential` (`Ucredential`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_has_roles`
--

DROP TABLE IF EXISTS `user_has_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_has_roles` (
  `Uid` int NOT NULL,
  `Rid` int NOT NULL,
  PRIMARY KEY (`Uid`,`Rid`),
  KEY `fk_uhr_role` (`Rid`),
  CONSTRAINT `fk_uhr_role` FOREIGN KEY (`Rid`) REFERENCES `role` (`Rid`) ON DELETE CASCADE,
  CONSTRAINT `fk_uhr_users` FOREIGN KEY (`Uid`) REFERENCES `users` (`Uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_has_roles`
--

LOCK TABLES `user_has_roles` WRITE;
/*!40000 ALTER TABLE `user_has_roles` DISABLE KEYS */;
INSERT INTO `user_has_roles` VALUES (1,1),(2,2);
/*!40000 ALTER TABLE `user_has_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `Uid` int NOT NULL AUTO_INCREMENT,
  `Uname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Ulastname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Uemail` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Upassword` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Ucredential` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Ustatus` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`Uid`),
  UNIQUE KEY `Uemail` (`Uemail`),
  UNIQUE KEY `Upassword` (`Upassword`),
  UNIQUE KEY `Ucredential` (`Ucredential`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Rosy','Herrera','rosy@example.com','$2b$10$wyQUijtMIOXYhMh3n6NHkOkc.YWo7e37TtDJHV268DWZIHip5zcay','rosy',1,'2025-09-15 03:44:12','2025-09-15 03:44:12'),(2,'Rodrigo','Lopez','rodrigo@example.com','$2b$10$XcVJXqRKxPR1eQvx2MFV6OxyTHP62awOL2577c0FEQnyC8bd4eP8u','rodrigo',1,'2025-09-15 20:52:06','2025-09-15 20:52:06');
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

-- Dump completed on 2025-09-16 20:10:01
