-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 05, 2025 at 05:11 PM
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
-- Table structure for table `correction_requests`
--

CREATE TABLE `correction_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `record_type` varchar(100) DEFAULT NULL,
  `record_id` int(11) DEFAULT NULL,
  `field_to_correct` varchar(100) DEFAULT NULL,
  `current_value` text DEFAULT NULL,
  `requested_value` text DEFAULT NULL,
  `proof_file` varchar(255) DEFAULT NULL,
  `pdf_path` varchar(255) DEFAULT NULL,
  `original_pdf_path` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `admin_remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `correction_requests`
--

INSERT INTO `correction_requests` (`id`, `user_id`, `record_type`, `record_id`, `field_to_correct`, `current_value`, `requested_value`, `proof_file`, `pdf_path`, `original_pdf_path`, `status`, `admin_remarks`, `created_at`, `updated_at`) VALUES
(3, 1, 'users', 1, 'first_name', 'ivan', 'vanx', '1754330647113-certificate_13.pdf', 'uploads/certificates/correction-1754330673174.pdf', 'uploads/originals/updated-record-1754330673174.pdf', 'approved', 'Correction approved', '2025-08-04 18:04:07', '2025-08-04 18:04:33'),
(4, 1, 'users', 6767, 'first_name', 'ivan', 'vhjkkj', '1754405885765-certificate_14.pdf', 'uploads/certificates/correction-1754405908128.pdf', 'uploads/originals/updated-record-1754405908128.pdf', 'approved', 'Correction approved', '2025-08-05 14:58:05', '2025-08-05 14:58:28');

-- --------------------------------------------------------

--
-- Table structure for table `indigency_requests`
--

CREATE TABLE `indigency_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `purpose` text NOT NULL,
  `proof_file` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` datetime DEFAULT current_timestamp(),
  `approved_at` datetime DEFAULT NULL,
  `is_approved` tinyint(1) DEFAULT 0,
  `pdf_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `indigency_requests`
--

INSERT INTO `indigency_requests` (`id`, `user_id`, `purpose`, `proof_file`, `status`, `created_at`, `approved_at`, `is_approved`, `pdf_path`) VALUES
(2, 43, 'asdsad', '1754152460866-brilata.pdf', 'approved', '2025-08-03 00:34:20', '2025-08-03 00:57:59', 1, 'certificate_2.pdf'),
(3, 48, 'asdasas', '1754154153184-brilata.pdf', 'approved', '2025-08-03 01:02:33', '2025-08-03 01:02:51', 1, 'certificate_3.pdf'),
(4, 43, 'adaasd', '1754192444611-brilata.pdf', 'approved', '2025-08-03 11:40:44', '2025-08-03 11:41:51', 1, 'certificate_4.pdf'),
(5, 43, 'sadas', '1754192499950-brilata.pdf', 'approved', '2025-08-03 11:41:39', '2025-08-03 11:41:50', 1, 'certificate_5.pdf'),
(6, 43, 'asdsa', '1754194019179-brilata.pdf', 'approved', '2025-08-03 12:06:59', '2025-08-03 12:07:23', 1, 'certificate_6.pdf'),
(7, 43, 'asdsadsa', '1754195339592-brilata.pdf', 'approved', '2025-08-03 12:28:59', '2025-08-03 12:39:22', 1, 'certificate_7.pdf'),
(8, 43, 'asdada', '1754195994356-brilata.pdf', 'approved', '2025-08-03 12:39:54', '2025-08-03 12:40:02', 1, 'certificate_8.pdf'),
(9, 43, 'sadasdas', '1754280661456-certificate_2.pdf', 'approved', '2025-08-04 12:11:01', '2025-08-04 14:43:06', 1, 'certificate_9.pdf'),
(10, 43, 'sadsa', '1754280702853-certificate_2.pdf', 'approved', '2025-08-04 12:11:42', '2025-08-04 12:36:38', 1, 'certificate_10.pdf'),
(11, 48, 'sadasds', '1754282366397-certificate_2.pdf', 'approved', '2025-08-04 12:39:26', '2025-08-04 12:40:40', 1, 'certificate_11.pdf'),
(12, 43, 'dasdas', '1754289742847-certificate_2.pdf', 'approved', '2025-08-04 14:42:22', '2025-08-04 14:42:39', 1, 'certificate_12.pdf'),
(13, 43, 'sda', '1754327521692-certificate_2.pdf', 'approved', '2025-08-05 01:12:01', '2025-08-05 01:12:18', 1, 'certificate_13.pdf'),
(14, 43, 'sadas', '1754331245601-certificate_11.pdf', 'approved', '2025-08-05 02:14:05', '2025-08-05 02:14:22', 1, 'certificate_14.pdf');

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
  `status` enum('pending','approved','completed','rejected') DEFAULT 'pending',
  `admin_file_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requests`
--

INSERT INTO `requests` (`id`, `user_id`, `type`, `details`, `file_path`, `created_at`, `status`, `admin_file_path`) VALUES
(5, 43, 'MAIP', 'asdsaddasadas', '1753986655116-brilata.pdf', '2025-07-31 18:30:55', '', NULL),
(6, 43, 'MAIP', 'asdsadsa', '1754032056998-brilata.pdf', '2025-08-01 07:07:37', '', NULL),
(7, 48, 'Medical', 'asdsaas', '1754035920130-brilata.pdf', '2025-08-01 08:12:00', '', NULL),
(8, 43, 'MAIP', 'asdas', '1754055372971-brilata.pdf', '2025-08-01 13:36:12', '', NULL),
(9, 43, 'Guarantee Letter', 'asdasas', '1754058034255-brilata.pdf', '2025-08-01 14:20:34', '', NULL),
(10, 43, 'Guarantee Letter', 'adsasad', '1754058614751-brilata.pdf', '2025-08-01 14:30:14', 'completed', NULL),
(11, 43, 'Guarantee Letter', 'asdsa', '1754059081573-brilata.pdf', '2025-08-01 14:38:01', 'rejected', NULL),
(12, 43, 'Medical', 'asdsa', '1754059647404-brilata.pdf', '2025-08-01 14:47:27', 'completed', NULL),
(13, 43, 'Guarantee Letter', 'bilis nga ng realtime pag node js backend', '1754059964749-brilata.pdf', '2025-08-01 14:52:44', 'completed', '1754327360062-certificate_2.pdf'),
(14, 43, 'Guarantee Letter', 'bilis nga ng real time pag node. js', '1754060032219-brilata.pdf', '2025-08-01 14:53:52', 'pending', NULL),
(15, 43, 'Medical', 'ang bilis nga pag node js sa real time updates', '1754060096392-brilata.pdf', '2025-08-01 14:54:56', 'pending', NULL),
(16, 43, 'MAIP', 'asdas', '1754137120726-brilata.pdf', '2025-08-02 12:18:40', 'pending', NULL),
(18, 43, 'Guarantee Letter', 'asdsa', '1754192368628-brilata.pdf', '2025-08-03 03:39:28', '', NULL),
(19, 43, 'Medical', 'sada', '1754195319999-brilata.pdf', '2025-08-03 04:28:40', 'completed', NULL),
(20, 43, 'Medical', 'asdsasa', '1754200272957-brilata.pdf', '2025-08-03 05:51:12', '', NULL),
(21, 43, 'Medical', 'asdas', '1754200905364-brilata.pdf', '2025-08-03 06:01:45', '', NULL),
(22, 43, 'Medical', 'asdsaas', '1754202302014-brilata.pdf', '2025-08-03 06:25:02', 'completed', NULL),
(23, 43, 'Medical', 'sada', '1754275440016-certificate_2.pdf', '2025-08-04 02:44:00', 'completed', NULL),
(24, 43, 'Medical', 'asdadsa', '1754276271005-brilata.pdf', '2025-08-04 02:57:51', 'completed', '1754276708683-certificate_2.pdf'),
(25, 43, 'Medical', 'i need a documents for medical assistance that i want to submit in barangay', '1754277360739-brilata.pdf', '2025-08-04 03:16:00', 'completed', '1754277403797-brilata.pdf'),
(26, 48, 'Medical', 'asdasdsa', '1754282285944-certificate_2.pdf', '2025-08-04 04:38:05', 'completed', '1754282340288-certificate_2.pdf'),
(27, 43, 'Medical', 'adasdaas', '1754289645400-certificate_2.pdf', '2025-08-04 06:40:45', 'completed', '1754289699465-certificate_2.pdf'),
(28, 43, 'Medical', 'asdsasa', '1754327465816-certificate_2.pdf', '2025-08-04 17:11:05', 'rejected', NULL),
(29, 43, 'Medical', 'asdadas', '1754331289193-certificate_14.pdf', '2025-08-04 18:14:49', 'completed', '1754331314562-certificate_14.pdf'),
(30, 43, 'Medical', 'sadasd', 'records_request/1754402171429-certificate_13.pdf', '2025-08-05 13:56:11', 'completed', NULL),
(31, 43, 'Medical', 'adsad', 'records_request/1754404104601-certificate_13.pdf', '2025-08-05 14:28:24', 'completed', 'records_request/1754404137660-certificate_14.pdf'),
(32, 43, 'Medical', 'asdadas', 'records_request/1754404213783-certificate_13.pdf', '2025-08-05 14:30:13', 'completed', NULL),
(33, 43, 'Medical', 'adasasa', 'records_request/1754404349032-certificate_13.pdf', '2025-08-05 14:32:29', 'completed', 'records_request/1754404417318-brilata.pdf'),
(34, 43, 'Medical', 'asdasdasdsaada', 'records_request/1754404527370-certificate_13.pdf', '2025-08-05 14:35:27', 'completed', 'records_request/1754404594984-brilata.pdf'),
(35, 43, 'Medical', 'adsasa', 'records_request/1754404769585-certificate_13.pdf', '2025-08-05 14:39:29', 'completed', 'records_request/1754404779885-certificate_2.pdf'),
(36, 43, 'Medical', 'adsada', 'records_request/1754405014259-certificate_14.pdf', '2025-08-05 14:43:34', 'completed', 'records_request/1754405026462-certificate_2 (1).pdf'),
(37, 43, 'Medical', 'ghjgjhgjghjgjhgjggh', 'records_request/1754405268904-certificate_14.pdf', '2025-08-05 14:47:48', 'completed', 'records_request/1754405383849-certificate_14.pdf'),
(38, 43, 'Medical', 'ghghghgjjh', 'records_request/1754405439395-certificate_14.pdf', '2025-08-05 14:50:39', 'completed', 'records_request/1754405611565-certificate_14.pdf'),
(39, 43, 'Medical', 'ghghhgjgjgjh', 'records_request/1754405697178-certificate_14.pdf', '2025-08-05 14:54:57', 'approved', NULL);

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
(48, '', 'brilataivan86@gmail.com', '$2b$10$ou7XX.kK6slEAzt1lOHrRuDS6Gi262UjrOZP9YaG5xlYy00Z6PdU.', 'approved', 'user', '2025-08-01 08:08:03', 1, NULL, 'ivan', 'atalirb', '09956738140', '2025-08-04 04:37:20'),
(53, '', 'aybanbrilata05@gmail.com', '$2b$10$rjmyt76TL/0IHnPvFLr7q.V5/bmabVQmojG6KjNGq9ryeRTc66JKy', 'approved', 'admin', '2025-08-02 15:58:40', 1, NULL, 'asd', 'ivan', '09956738140', '2025-08-02 15:59:33');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `correction_requests`
--
ALTER TABLE `correction_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `indigency_requests`
--
ALTER TABLE `indigency_requests`
  ADD PRIMARY KEY (`id`);

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
-- AUTO_INCREMENT for table `correction_requests`
--
ALTER TABLE `correction_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `indigency_requests`
--
ALTER TABLE `indigency_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

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
