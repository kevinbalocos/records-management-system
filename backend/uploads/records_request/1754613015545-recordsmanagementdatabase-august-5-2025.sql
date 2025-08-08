-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 05, 2025 at 03:25 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

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
  `record_type` varchar(255) NOT NULL,
  `record_id` int(11) NOT NULL,
  `field_to_correct` varchar(255) NOT NULL,
  `current_value` text DEFAULT NULL,
  `requested_value` text NOT NULL,
  `proof_file` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `admin_remarks` text DEFAULT NULL,
  `pdf_path` varchar(255) DEFAULT NULL,
  `original_pdf_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `correction_requests`
--

INSERT INTO `correction_requests` (`id`, `user_id`, `record_type`, `record_id`, `field_to_correct`, `current_value`, `requested_value`, `proof_file`, `status`, `admin_remarks`, `pdf_path`, `original_pdf_path`, `created_at`) VALUES
(1, 0, 'users', 23, '23', '23', '23', '1754393138629-Formal_Board_Resolution_Template.docx', 'pending', NULL, NULL, NULL, '2025-08-05 11:25:38');

-- --------------------------------------------------------

--
-- Table structure for table `indigency_requests`
--

CREATE TABLE `indigency_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `purpose` text DEFAULT NULL,
  `proof_file` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `is_approved` tinyint(1) DEFAULT 0,
  `approved_at` datetime DEFAULT NULL,
  `pdf_path` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `indigency_requests`
--

INSERT INTO `indigency_requests` (`id`, `user_id`, `purpose`, `proof_file`, `status`, `is_approved`, `approved_at`, `pdf_path`, `created_at`) VALUES
(1, 19, '23', '1754313458335-DCSI LOGO.png', 'approved', 1, '2025-08-04 21:17:45', 'certificate_1.pdf', '2025-08-04 21:17:38'),
(2, 19, '2', '1754313480111-DCSI_LOGO-removebg-preview.png', 'pending', 0, NULL, NULL, '2025-07-01 21:18:00');

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
  `status` enum('pending','in_review','approved','completed','rejected','denied') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requests`
--

INSERT INTO `requests` (`id`, `user_id`, `type`, `details`, `file_path`, `created_at`, `status`) VALUES
(5, 43, 'MAIP', 'asdsaddasadas', '1753986655116-brilata.pdf', '2025-05-31 18:30:55', ''),
(6, 43, 'MAIP', 'asdsadsa', '1754032056998-brilata.pdf', '2025-07-01 07:07:37', 'pending'),
(7, 48, 'Medical', 'asdsaas', '1754035920130-brilata.pdf', '2025-08-01 08:12:00', 'pending'),
(8, 43, 'MAIP', 'asdas', '1754055372971-brilata.pdf', '2025-02-01 13:36:12', 'pending'),
(9, 43, 'Guarantee Letter', 'asdasas', '1754058034255-brilata.pdf', '2025-08-29 14:20:34', ''),
(10, 43, 'Guarantee Letter', 'adsasad', '1754058614751-brilata.pdf', '2025-09-01 14:30:14', 'pending'),
(11, 43, 'Guarantee Letter', 'asdsa', '1754059081573-brilata.pdf', '2025-08-01 14:38:01', 'pending'),
(12, 43, 'Medical', 'asdsa', '1754059647404-brilata.pdf', '2025-08-01 14:47:27', 'pending'),
(13, 43, 'Guarantee Letter', 'bilis nga ng realtime pag node js backend', '1754059964749-brilata.pdf', '2025-08-01 14:52:44', 'pending'),
(14, 43, 'Guarantee Letter', 'bilis nga ng real time pag node. js', '1754060032219-brilata.pdf', '2025-08-01 14:53:52', 'pending'),
(15, 43, 'Medical', 'ang bilis nga pag node js sa real time updates', '1754060096392-brilata.pdf', '2025-08-01 14:54:56', 'pending'),
(16, 29, 'Medical', 'asd', '1754138362954-BOARD-RESOLUTION.docx', '2025-08-02 12:39:22', ''),
(17, 29, 'Medical', '123123', '1754146604035-BOARD-RESOLUTION.docx', '2025-08-02 14:56:44', 'pending'),
(18, 29, 'Guarantee Letter', 'asdasd', '1754146626100-Advanced_Board_Resolution_for_Mayor.docx', '2025-08-02 14:57:06', ''),
(19, 29, 'Medical', '123', '1754188264063-DCSI_LOGO-removebg-preview.png', '2025-08-03 02:31:04', ''),
(50, 19, 'Indigency', 'Requesting indigency certificate.', 'files/indigency1.pdf', '2025-01-10 02:00:00', 'pending'),
(51, 29, 'Indigency', 'Lost previous document.', 'files/indigency2.pdf', '2025-01-15 01:00:00', 'approved'),
(52, 34, 'Clearance', 'Need clearance for scholarship.', 'files/clearance1.pdf', '2025-02-05 03:30:00', 'in_review'),
(53, 35, 'Clearance', 'Urgent clearance request.', 'files/clearance2.pdf', '2025-02-22 06:20:00', 'approved'),
(54, 37, 'Barangay ID', 'Requesting new ID.', 'files/id1.pdf', '2025-03-12 00:45:00', 'denied'),
(55, 39, 'Indigency', 'Renewal of indigency.', 'files/indigency3.pdf', '2025-04-01 05:00:00', 'pending'),
(56, 40, 'Clearance', 'Follow-up on clearance.', 'files/clearance3.pdf', '2025-04-10 08:10:00', 'approved'),
(57, 43, 'Barangay ID', 'New resident ID.', 'files/id2.pdf', '2025-05-05 02:10:00', 'approved'),
(58, 48, 'Indigency', 'School requirement.', 'files/indigency4.pdf', '2025-05-25 09:50:00', 'in_review'),
(59, 52, 'Clearance', 'Employment clearance.', 'files/clearance4.pdf', '2025-06-08 04:15:00', 'pending'),
(60, 19, 'Indigency', 'Financial aid requirement.', 'files/indigency5.pdf', '2025-07-09 03:00:00', 'approved'),
(61, 29, 'Clearance', 'Lost clearance document.', 'files/clearance5.pdf', '2025-07-18 01:40:00', 'denied'),
(62, 34, 'Barangay ID', 'Correction of name.', 'files/id3.pdf', '2025-07-25 07:25:00', 'in_review'),
(63, 35, 'Clearance', 'Urgent request.', 'files/clearance6.pdf', '2025-08-01 00:00:00', 'pending'),
(64, 37, 'Indigency', 'Follow-up document.', 'files/indigency6.pdf', '2025-08-03 06:30:00', 'approved'),
(65, 34, 'Indigency', 'Utility discount application.', 'files/indigency7.pdf', '2025-01-22 01:10:00', 'pending'),
(66, 52, 'Barangay ID', 'Request for duplicate ID.', 'files/id4.pdf', '2025-01-28 08:45:00', 'in_review'),
(67, 19, 'Clearance', 'Follow-up application.', 'files/clearance8.pdf', '2025-02-09 04:00:00', 'approved'),
(68, 48, 'Indigency', 'Medical assistance requirement.', 'files/indigency8.pdf', '2025-02-19 02:15:00', 'denied'),
(69, 29, 'Barangay ID', 'New address update.', 'files/id5.pdf', '2025-03-05 03:00:00', 'approved'),
(70, 35, 'Clearance', 'College application requirement.', 'files/clearance9.pdf', '2025-03-17 06:30:00', 'in_review'),
(71, 43, 'Indigency', 'Business permit support.', 'files/indigency9.pdf', '2025-03-22 07:00:00', 'pending'),
(72, 40, 'Clearance', 'Request for document revision.', 'files/clearance10.pdf', '2025-03-27 05:45:00', 'approved'),
(73, 52, 'Barangay ID', 'Lost barangay ID.', 'files/id6.pdf', '2025-04-21 01:20:00', 'approved'),
(74, 19, 'Clearance', 'Scholarship renewal.', 'files/clearance11.pdf', '2025-05-10 00:40:00', 'pending'),
(75, 29, 'Indigency', 'Senior citizen benefit.', 'files/indigency10.pdf', '2025-05-18 02:10:00', 'approved'),
(76, 35, 'Barangay ID', 'For travel requirement.', 'files/id7.pdf', '2025-05-28 09:30:00', 'in_review'),
(77, 43, 'Indigency', 'Financial grant support.', 'files/indigency11.pdf', '2025-06-12 06:00:00', 'pending'),
(78, 34, 'Clearance', 'Job onboarding requirement.', 'files/clearance12.pdf', '2025-06-20 03:50:00', 'approved'),
(79, 48, 'Barangay ID', 'First-time request.', 'files/id8.pdf', '2025-07-30 02:05:00', 'pending'),
(80, 29, 'Indigency', 'Request for school.', 'files/indigency12.pdf', '2025-08-05 07:30:00', 'approved'),
(81, 52, 'Clearance', 'Personal clearance.', 'files/clearance13.pdf', '2025-08-08 01:00:00', 'in_review'),
(82, 19, 'Barangay ID', 'Correction of birthdate.', 'files/id9.pdf', '2025-08-14 08:00:00', 'denied'),
(83, 43, 'Clearance', 'Additional employment document.', 'files/clearance14.pdf', '2025-08-22 05:20:00', 'approved'),
(84, 19, 'Others', 'asd', '1754396152314-Advanced_Board_Resolution_for_Mayor.docx', '2025-08-05 12:15:52', 'pending'),
(85, 19, 'Medical', '123', '1754396167407-BOARD-RESOLUTION.docx', '2025-08-05 12:16:07', 'pending'),
(86, 29, 'Medical', '23', '1754397502346-BOARD-RESOLUTION.docx', '2025-08-05 12:38:22', 'pending'),
(87, 29, 'Medical', '1541', NULL, '2025-08-05 12:38:29', 'rejected'),
(88, 29, 'Medical', 'jade kevin', NULL, '2025-08-05 12:38:38', ''),
(89, 29, 'Medical', 'asd', '1754397568691-DCSI LOGO.png', '2025-08-05 12:39:28', ''),
(90, 29, 'Medical', 'ttt', NULL, '2025-08-05 12:39:32', 'completed'),
(91, 29, 'Medical', 'asd', '1754398095811-DCSI_LOGO-removebg-preview.png', '2025-08-05 12:48:15', 'completed'),
(92, 29, 'Guarantee Letter', 's', '1754398578265-DCSI_LOGO-removebg-preview.png', '2025-08-05 12:56:18', 'pending'),
(93, 29, 'Medical', 'asd', '1754398593320-Advanced_Board_Resolution_for_Mayor.docx', '2025-08-05 12:56:33', 'pending'),
(94, 29, 'Medical', '23', '1754398780678-DCSI LOGO.png', '2025-08-05 12:59:40', 'pending'),
(95, 29, 'Guarantee Letter', 'asd', '1754398839100-DCSI LOGO.png', '2025-08-05 13:00:39', 'completed'),
(96, 29, 'Medical', 'asd', '1754398907813-DCSI_LOGO-removebg-preview.png', '2025-08-05 13:01:47', 'pending'),
(97, 29, 'Medical', 'sd', '1754399164497-DCSI LOGO.png', '2025-08-05 13:06:04', 'pending'),
(98, 29, 'Medical', 'sd', '1754399226116-DCSI LOGO.png', '2025-08-05 13:07:06', 'pending'),
(99, 29, 'Medical', 'asd', 'records_request/1754399335676-DCSI LOGO.png', '2025-08-05 13:08:55', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) DEFAULT '',
  `last_name` varchar(100) DEFAULT '',
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` enum('pending','approved','denied') DEFAULT 'pending',
  `role` enum('user','superadmin','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_verified` tinyint(1) DEFAULT NULL,
  `verification_token` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `name`, `email`, `password`, `status`, `role`, `created_at`, `is_verified`, `verification_token`, `phone_number`, `updated_at`) VALUES
(19, NULL, NULL, '', 'kevinbalocos03@gmail.com', '$2b$10$GRzSGAynia10mvCiHQPcnOFX9aaX995A/bpOtiMMbOOlpKJtD5wR2', 'approved', 'admin', '2025-07-21 19:19:17', 1, '8f91eabaa3b5f08eca3268fab1788c4b5e24af8fde514162e0a56279783e4d3e', NULL, '2025-07-31 12:58:09'),
(29, 'Jade Kevin', 'Balocos', '', 'kevinbalocos@gmail.com', '$2b$10$3pI58TrxVxbHnP0JMT6tH.C51S5Hw9335GXfugy1d6JpPCv4RA0OS', 'approved', 'user', '2025-07-24 09:12:07', 1, NULL, '09054651578', '2025-07-31 12:58:09'),
(34, '123', '123', '', 'kevinbalocos1@gmail.com', '$2b$10$3DEJnD2XhMUe/35DHTJ.lOtvTNRNLXNizeHyAgkPjWvaXTl32odk2', 'pending', 'user', '2025-07-31 12:35:34', 0, '277c0714720c1b118daa581b4b5a4e7bf18c6c30df977e460c59dfa499596b20', '123123123', '2025-07-31 12:58:09'),
(35, '123123', '123123', '', 'kevinbalocos21@gmail.com', '$2b$10$DfuW7eIkEF1s.egc.MY4M.7Ap7UdOVw99esQo/a3xpRrpkqQt9VrC', 'pending', 'user', '2025-07-31 12:38:08', 0, '47d6cd460743085b112e076b2c349f985150ad35c666a002661a279a20ce32c5', '123123132', '2025-07-31 12:58:09'),
(37, '123123123', '123123', '', 'kevinbalocos023@gmail.com', '$2b$10$FFub5dVY0upPrkaq3qX3I.Ol7OWl4Xwavq/NKBOycB.i8R.qPN.Fm', 'pending', 'admin', '2025-07-31 12:52:32', 0, '0d4a3c20d3e9b60526229af855877bbb855c3b3e1da109ff00b837834493abc7', '123123123123', '2025-07-31 12:58:09'),
(39, 'Super', 'Admin', '', 'superadmin@example.com', '$2b$10$1WSkB796wgqQmChyRXw83eaWZIK6VK1FYWx4jbsGU73RTqjENbBnW', 'approved', 'superadmin', '2025-07-31 12:54:34', 1, NULL, '0000000000', '2025-07-31 15:56:16'),
(40, 'asd', 'asd', '', 'kevinbalocosasd@gmail.com', '$2b$10$vxISv0QLFUnPGGXbj7nS2e957SKEn1IdipUvvAxehyl3pXYEkZ10m', 'pending', 'user', '2025-07-31 13:30:26', 0, '58cf3bb9006f72e26fa02ced64d7ed9d1453f3fb9d59b6066a8ec29c144e63fc', '1231231312313', '2025-07-31 13:30:26'),
(43, 'ivan', 'brilata', 'vanskieee', 'ibrilata.dev@gmail.com', '$2b$10$3Go56SHTSujCjio87SHe1.NMLRSUeitFbG/Hw3Z8jwC4zuy6Tjc1G', 'approved', 'user', '2025-07-31 15:37:17', 1, NULL, '09956738140', '2025-08-01 13:35:38'),
(48, 'ivan', 'brilata', '', 'brilataivan86@gmail.com', '$2b$10$ou7XX.kK6slEAzt1lOHrRuDS6Gi262UjrOZP9YaG5xlYy00Z6PdU.', 'approved', 'user', '2025-08-01 08:08:03', 1, NULL, '09956738140', '2025-08-01 08:11:13'),
(52, 'ivan', 'brilata', '', 'aybanbrilata05@gmail.com', '$2b$10$87C.cjZkOe88HL7Fr4DVyuOnxhfp/mAYs6HQSwO1bDoF8RkHHmuGK', 'denied', 'user', '2025-08-01 13:32:50', 1, NULL, '09956738140', '2025-08-02 13:35:53');

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `indigency_requests`
--
ALTER TABLE `indigency_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `indigency_requests`
--
ALTER TABLE `indigency_requests`
  ADD CONSTRAINT `indigency_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `requests`
--
ALTER TABLE `requests`
  ADD CONSTRAINT `requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
