-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 11, 2025 at 12:31 PM
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
  `description` text DEFAULT NULL,
  `proof_file` varchar(255) DEFAULT NULL,
  `admin_file` varchar(255) DEFAULT NULL,
  `admin_remarks` text DEFAULT NULL,
  `status` enum('pending','approved','rejected','completed') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `correction_requests`
--

INSERT INTO `correction_requests` (`id`, `user_id`, `record_type`, `record_id`, `description`, `proof_file`, `admin_file`, `admin_remarks`, `status`, `created_at`) VALUES
(9, 1, 'indigency', 232, 'adsaas', '1754612831477-certificate_2 (1).pdf', '1754612855359-certificate_2.pdf', 'Correction completed and file uploaded.', 'completed', '2025-08-08 00:27:11');

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
(16, 43, 'asdasdsa', '1754612814379-certificate_2.pdf', 'approved', '2025-08-08 08:26:54', '2025-08-08 08:27:00', 1, 'certificate_16.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

CREATE TABLE `requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `status` enum('pending','approved','completed','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `patient_name` varchar(255) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `municipality` varchar(255) DEFAULT NULL,
  `hospital_admitted` varchar(255) DEFAULT NULL,
  `medical_abstract_path` varchar(255) DEFAULT NULL,
  `medical_request_path` varchar(255) DEFAULT NULL,
  `hospital_bill_path` varchar(255) DEFAULT NULL,
  `social_case_study_path` varchar(255) DEFAULT NULL,
  `patient_id_path` varchar(255) DEFAULT NULL,
  `representative_id_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requests`
--

INSERT INTO `requests` (`id`, `user_id`, `type`, `details`, `status`, `created_at`, `patient_name`, `age`, `gender`, `street`, `municipality`, `hospital_admitted`, `medical_abstract_path`, `medical_request_path`, `hospital_bill_path`, `social_case_study_path`, `patient_id_path`, `representative_id_path`) VALUES
(1, 43, 'Burial Assistance', 'asdsa', 'pending', '2025-08-10 06:05:58', 'asdsa', 23, 'Male', 'asdsa', 'asda', 'asadsa', 'records_request/1754805958075-654701043.pdf', 'records_request/1754805958078-916745858.pdf', 'records_request/1754805958078-80669683.pdf', 'records_request/1754805958079-649060290.pdf', 'records_request/1754805958079-347945800.pdf', 'records_request/1754805958079-910788904.pdf'),
(2, 43, 'Burial Assistance', 'asdsa', 'pending', '2025-08-10 06:16:22', 'adsa', 23, 'Male', 'asdsa', 'asdsa', 'asda', 'records_request/1754806582800-586248058.pdf', 'records_request/1754806582801-939926334.pdf', 'records_request/1754806582801-724336490.pdf', 'records_request/1754806582801-783668698.pdf', 'records_request/1754806582801-900987934.pdf', 'records_request/1754806582801-807989940.pdf'),
(3, 43, 'Medical Assistance', 'asda', 'pending', '2025-08-10 06:17:39', 'sada', 12, 'Male', 'adsa', 'asda', 'asd', 'records_request/1754806659187-139739400.pdf', 'records_request/1754806659188-173655600.pdf', 'records_request/1754806659188-894477000.pdf', 'records_request/1754806659188-268433398.pdf', 'records_request/1754806659188-904907856.pdf', 'records_request/1754806659188-462887863.pdf'),
(4, 43, 'Medical Assistance', 'need of medical', 'pending', '2025-08-11 03:40:33', 'sample', 22, 'Male', 'lapids', 'tiaong', 'spc medical', 'records_request/1754883633323-167708100.pdf', 'records_request/1754883633325-596586876.pdf', 'records_request/1754883633325-792583045.pdf', 'records_request/1754883633325-270960819.pdf', 'records_request/1754883633325-918439316.pdf', 'records_request/1754883633325-764355115.pdf'),
(5, 43, 'Medical Assistance', 'need a medical assistance', 'pending', '2025-08-11 03:46:39', 'sadas', 23, 'Male', 'lumingon', 'tiaong', 'spc medical', 'records_request/1754883999251-412153990.pdf', 'records_request/1754883999251-731264599.pdf', 'records_request/1754883999252-766687523.pdf', 'records_request/1754883999252-105449247.pdf', 'records_request/1754883999252-413289036.pdf', 'records_request/1754883999252-582532513.pdf'),
(6, 43, 'Medical Assistance', 'sad', 'pending', '2025-08-11 03:47:39', 'sadas', 232, 'Male', 'asd', 'asdas', 'sad', 'records_request/1754884059452-667947928.pdf', 'records_request/1754884059452-179607638.pdf', 'records_request/1754884059452-46746677.pdf', 'records_request/1754884059452-224627390.pdf', 'records_request/1754884059453-682012393.pdf', 'records_request/1754884059453-741879006.pdf'),
(7, 43, 'Medical Assistance', 'need a medical assistance', 'pending', '2025-08-11 04:37:56', 'van', 22, 'Male', 'lapids', 'tiaong', 'spc medical', 'records_request/1754887076366-640262787.pdf', 'records_request/1754887076371-841793610.pdf', 'records_request/1754887076371-90805339.pdf', 'records_request/1754887076371-513135226.pdf', 'records_request/1754887076372-113107268.pdf', 'records_request/1754887076372-628688484.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `request_types`
--

CREATE TABLE `request_types` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('draft','published') DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `price` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `request_types`
--

INSERT INTO `request_types` (`id`, `name`, `description`, `status`, `created_at`, `updated_at`, `price`) VALUES
(21, 'Medical Assistance', 'For medical assistance', 'published', '2025-08-10 03:48:59', '2025-08-10 03:49:50', NULL),
(22, 'Burial Assistance', 'For burial assistance', 'published', '2025-08-10 03:49:21', '2025-08-10 03:49:48', NULL),
(23, 'Other Assistance', 'For other assistance', 'published', '2025-08-10 03:49:45', '2025-08-10 03:49:51', NULL);

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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `address` varchar(255) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `status`, `role`, `created_at`, `is_verified`, `verification_token`, `first_name`, `last_name`, `phone_number`, `updated_at`, `address`, `contact_number`) VALUES
(19, '', 'kevinbalocos03@gmail.com', '$2b$10$GRzSGAynia10mvCiHQPcnOFX9aaX995A/bpOtiMMbOOlpKJtD5wR2', 'approved', 'admin', '2025-07-21 19:19:17', 1, '8f91eabaa3b5f08eca3268fab1788c4b5e24af8fde514162e0a56279783e4d3e', NULL, NULL, NULL, '2025-07-31 12:58:09', NULL, NULL),
(29, '', 'kevinbalocos@gmail.com', '$2b$10$3pI58TrxVxbHnP0JMT6tH.C51S5Hw9335GXfugy1d6JpPCv4RA0OS', 'approved', 'user', '2025-07-24 09:12:07', 1, NULL, 'Jade Kevin', 'Balocos', '09054651578', '2025-07-31 12:58:09', NULL, NULL),
(34, '', 'kevinbalocos1@gmail.com', '$2b$10$3DEJnD2XhMUe/35DHTJ.lOtvTNRNLXNizeHyAgkPjWvaXTl32odk2', 'pending', 'user', '2025-07-31 12:35:34', 0, '277c0714720c1b118daa581b4b5a4e7bf18c6c30df977e460c59dfa499596b20', '123', '123', '123123123', '2025-07-31 12:58:09', NULL, NULL),
(35, '', 'kevinbalocos21@gmail.com', '$2b$10$DfuW7eIkEF1s.egc.MY4M.7Ap7UdOVw99esQo/a3xpRrpkqQt9VrC', 'pending', 'user', '2025-07-31 12:38:08', 0, '47d6cd460743085b112e076b2c349f985150ad35c666a002661a279a20ce32c5', '123123', '123123', '123123132', '2025-07-31 12:58:09', NULL, NULL),
(37, '', 'kevinbalocos023@gmail.com', '$2b$10$FFub5dVY0upPrkaq3qX3I.Ol7OWl4Xwavq/NKBOycB.i8R.qPN.Fm', 'pending', 'admin', '2025-07-31 12:52:32', 0, '0d4a3c20d3e9b60526229af855877bbb855c3b3e1da109ff00b837834493abc7', '123123123', '123123', '123123123123', '2025-07-31 12:58:09', NULL, NULL),
(39, '', 'superadmin@example.com', '$2b$10$1WSkB796wgqQmChyRXw83eaWZIK6VK1FYWx4jbsGU73RTqjENbBnW', 'approved', 'superadmin', '2025-07-31 12:54:34', 1, NULL, 'Super', 'Admin', '0000000000', '2025-07-31 15:56:16', NULL, NULL),
(40, '', 'kevinbalocosasd@gmail.com', '$2b$10$vxISv0QLFUnPGGXbj7nS2e957SKEn1IdipUvvAxehyl3pXYEkZ10m', 'pending', 'user', '2025-07-31 13:30:26', 0, '58cf3bb9006f72e26fa02ced64d7ed9d1453f3fb9d59b6066a8ec29c144e63fc', 'asd', 'asd', '1231231312313', '2025-07-31 13:30:26', NULL, NULL),
(43, 'vanskieee', 'ibrilata.dev@gmail.com', '$2b$10$3Go56SHTSujCjio87SHe1.NMLRSUeitFbG/Hw3Z8jwC4zuy6Tjc1G', 'approved', 'user', '2025-07-31 15:37:17', 1, NULL, 'ivan', 'brilata', '09956738140', '2025-08-01 13:35:38', NULL, NULL),
(53, '', 'aybanbrilata05@gmail.com', '$2b$10$rjmyt76TL/0IHnPvFLr7q.V5/bmabVQmojG6KjNGq9ryeRTc66JKy', 'approved', 'admin', '2025-08-02 15:58:40', 1, NULL, 'asd', 'ivan', '09956738140', '2025-08-02 15:59:33', NULL, NULL),
(56, '', 'brilataivan86@gmail.com', '$2b$10$B05b.R75J/POpG7cmDzR7OZOJjfVAAHr7e6pUDEr6NHd.zZdQuaAi', 'approved', 'user', '2025-08-08 16:03:48', 1, NULL, 'ivan', 'brilata', '09956738140', '2025-08-08 16:05:04', NULL, NULL);

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
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `request_types`
--
ALTER TABLE `request_types`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `indigency_requests`
--
ALTER TABLE `indigency_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `request_types`
--
ALTER TABLE `request_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
