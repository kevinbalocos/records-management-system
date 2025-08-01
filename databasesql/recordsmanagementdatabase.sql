-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 01, 2025 at 05:07 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 7.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `recordsmanagementdatabase`
--

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

CREATE TABLE `requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','in_review','approved','denied') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requests`
--

INSERT INTO `requests` (`id`, `user_id`, `type`, `details`, `file_path`, `created_at`, `status`) VALUES
(5, 43, 'MAIP', 'asdsaddasadas', '1753986655116-brilata.pdf', '2025-07-31 18:30:55', 'pending'),
(6, 43, 'MAIP', 'asdsadsa', '1754032056998-brilata.pdf', '2025-08-01 07:07:37', 'pending'),
(7, 48, 'Medical', 'asdsaas', '1754035920130-brilata.pdf', '2025-08-01 08:12:00', 'pending'),
(8, 43, 'MAIP', 'asdas', '1754055372971-brilata.pdf', '2025-08-01 13:36:12', 'pending'),
(9, 43, 'Guarantee Letter', 'asdasas', '1754058034255-brilata.pdf', '2025-08-01 14:20:34', 'pending'),
(10, 43, 'Guarantee Letter', 'adsasad', '1754058614751-brilata.pdf', '2025-08-01 14:30:14', 'pending'),
(11, 43, 'Guarantee Letter', 'asdsa', '1754059081573-brilata.pdf', '2025-08-01 14:38:01', 'pending'),
(12, 43, 'Medical', 'asdsa', '1754059647404-brilata.pdf', '2025-08-01 14:47:27', 'pending'),
(13, 43, 'Guarantee Letter', 'bilis nga ng realtime pag node js backend', '1754059964749-brilata.pdf', '2025-08-01 14:52:44', 'pending'),
(14, 43, 'Guarantee Letter', 'bilis nga ng real time pag node. js', '1754060032219-brilata.pdf', '2025-08-01 14:53:52', 'pending'),
(15, 43, 'Medical', 'ang bilis nga pag node js sa real time updates', '1754060096392-brilata.pdf', '2025-08-01 14:54:56', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` enum('pending','approved','denied') DEFAULT 'pending',
  `role` enum('user','superadmin','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_verified` tinyint(1) DEFAULT NULL,
  `verification_token` varchar(255) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `status`, `role`, `created_at`, `is_verified`, `verification_token`, `first_name`, `last_name`, `phone_number`, `updated_at`) VALUES
(19, '', 'kevinbalocos03@gmail.com', '$2b$10$GRzSGAynia10mvCiHQPcnOFX9aaX995A/bpOtiMMbOOlpKJtD5wR2', 'approved', 'admin', '2025-07-21 19:19:17', 1, '8f91eabaa3b5f08eca3268fab1788c4b5e24af8fde514162e0a56279783e4d3e', NULL, NULL, NULL, '2025-07-31 12:58:09'),
(29, '', 'kevinbalocos@gmail.com', '$2b$10$3pI58TrxVxbHnP0JMT6tH.C51S5Hw9335GXfugy1d6JpPCv4RA0OS', 'approved', 'user', '2025-07-24 09:12:07', 1, NULL, 'Jade Kevin', 'Balocos', '09054651578', '2025-07-31 12:58:09'),
(34, '', 'kevinbalocos1@gmail.com', '$2b$10$3DEJnD2XhMUe/35DHTJ.lOtvTNRNLXNizeHyAgkPjWvaXTl32odk2', 'pending', 'user', '2025-07-31 12:35:34', 0, '277c0714720c1b118daa581b4b5a4e7bf18c6c30df977e460c59dfa499596b20', '123', '123', '123123123', '2025-07-31 12:58:09'),
(35, '', 'kevinbalocos21@gmail.com', '$2b$10$DfuW7eIkEF1s.egc.MY4M.7Ap7UdOVw99esQo/a3xpRrpkqQt9VrC', 'pending', 'user', '2025-07-31 12:38:08', 0, '47d6cd460743085b112e076b2c349f985150ad35c666a002661a279a20ce32c5', '123123', '123123', '123123132', '2025-07-31 12:58:09'),
(37, '', 'kevinbalocos023@gmail.com', '$2b$10$FFub5dVY0upPrkaq3qX3I.Ol7OWl4Xwavq/NKBOycB.i8R.qPN.Fm', 'pending', 'admin', '2025-07-31 12:52:32', 0, '0d4a3c20d3e9b60526229af855877bbb855c3b3e1da109ff00b837834493abc7', '123123123', '123123', '123123123123', '2025-07-31 12:58:09'),
(39, '', 'superadmin@example.com', '$2b$10$1WSkB796wgqQmChyRXw83eaWZIK6VK1FYWx4jbsGU73RTqjENbBnW', 'approved', 'superadmin', '2025-07-31 12:54:34', 1, NULL, 'Super', 'Admin', '0000000000', '2025-07-31 15:56:16'),
(40, '', 'kevinbalocosasd@gmail.com', '$2b$10$vxISv0QLFUnPGGXbj7nS2e957SKEn1IdipUvvAxehyl3pXYEkZ10m', 'pending', 'user', '2025-07-31 13:30:26', 0, '58cf3bb9006f72e26fa02ced64d7ed9d1453f3fb9d59b6066a8ec29c144e63fc', 'asd', 'asd', '1231231312313', '2025-07-31 13:30:26'),
(43, 'vanskieee', 'ibrilata.dev@gmail.com', '$2b$10$3Go56SHTSujCjio87SHe1.NMLRSUeitFbG/Hw3Z8jwC4zuy6Tjc1G', 'approved', 'user', '2025-07-31 15:37:17', 1, NULL, 'ivan', 'brilata', '09956738140', '2025-08-01 13:35:38'),
(48, '', 'brilataivan86@gmail.com', '$2b$10$ou7XX.kK6slEAzt1lOHrRuDS6Gi262UjrOZP9YaG5xlYy00Z6PdU.', 'approved', 'user', '2025-08-01 08:08:03', 1, NULL, 'ivan', 'brilata', '09956738140', '2025-08-01 08:11:13'),
(52, '', 'aybanbrilata05@gmail.com', '$2b$10$87C.cjZkOe88HL7Fr4DVyuOnxhfp/mAYs6HQSwO1bDoF8RkHHmuGK', '', 'user', '2025-08-01 13:32:50', 1, NULL, 'ivan', 'brilata', '09956738140', '2025-08-01 13:34:40');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `requests`
--
ALTER TABLE `requests`
  ADD CONSTRAINT `requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
