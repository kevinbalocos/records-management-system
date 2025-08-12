-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 12, 2025 at 05:45 AM
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
  `representative_id_path` varchar(255) DEFAULT NULL,
  `approval_type` enum('guarantee_letter','cash_payment') DEFAULT NULL,
  `cash_amount` decimal(15,2) DEFAULT NULL,
  `approval_file` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requests`
--

INSERT INTO `requests` (`id`, `user_id`, `type`, `details`, `status`, `created_at`, `patient_name`, `age`, `gender`, `street`, `municipality`, `hospital_admitted`, `medical_abstract_path`, `medical_request_path`, `hospital_bill_path`, `social_case_study_path`, `patient_id_path`, `representative_id_path`, `approval_type`, `cash_amount`, `approval_file`) VALUES
(10, 43, 'Medical Assistance', 'needed medical assistance', 'completed', '2025-08-12 02:46:59', 'sample med assistance', 22, 'Male', 'lumingon', 'tiaong', 'spc medical', 'records_request/1754966819528-440811920.pdf', 'records_request/1754966819529-911061491.pdf', 'records_request/1754966819529-508743061.pdf', 'records_request/1754966819529-803651172.pdf', 'records_request/1754966819529-65117761.pdf', 'records_request/1754966819529-841374641.pdf', 'cash_payment', 500000.00, 'records_request/1754966865125-514035018.jfif');

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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `request_types`
--

INSERT INTO `request_types` (`id`, `name`, `description`, `status`, `created_at`, `updated_at`) VALUES
(21, 'Medical Assistance', 'For medical assistance', 'published', '2025-08-10 03:48:59', '2025-08-10 03:49:50'),
(22, 'Burial Assistance', 'For burial assistance', 'published', '2025-08-10 03:49:21', '2025-08-10 03:49:48'),
(23, 'Other Assistance', 'For other assistance', 'published', '2025-08-10 03:49:45', '2025-08-10 03:49:51');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `request_types`
--
ALTER TABLE `request_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
