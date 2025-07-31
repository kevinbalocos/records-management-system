-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 31, 2025 at 04:08 PM
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
  `verified` tinyint(1) DEFAULT 0,
  `verification_token` varchar(255) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `status`, `role`, `created_at`, `verified`, `verification_token`, `first_name`, `last_name`, `phone_number`, `updated_at`) VALUES
(19, '', 'kevinbalocos03@gmail.com', '$2b$10$GRzSGAynia10mvCiHQPcnOFX9aaX995A/bpOtiMMbOOlpKJtD5wR2', 'approved', 'admin', '2025-07-21 19:19:17', 1, '8f91eabaa3b5f08eca3268fab1788c4b5e24af8fde514162e0a56279783e4d3e', NULL, NULL, NULL, '2025-07-31 12:58:09'),
(29, '', 'kevinbalocos@gmail.com', '$2b$10$3pI58TrxVxbHnP0JMT6tH.C51S5Hw9335GXfugy1d6JpPCv4RA0OS', 'approved', 'user', '2025-07-24 09:12:07', 1, NULL, 'Jade Kevin', 'Balocos', '09054651578', '2025-07-31 12:58:09'),
(34, '', 'kevinbalocos1@gmail.com', '$2b$10$3DEJnD2XhMUe/35DHTJ.lOtvTNRNLXNizeHyAgkPjWvaXTl32odk2', 'pending', 'user', '2025-07-31 12:35:34', 0, '277c0714720c1b118daa581b4b5a4e7bf18c6c30df977e460c59dfa499596b20', '123', '123', '123123123', '2025-07-31 12:58:09'),
(35, '', 'kevinbalocos21@gmail.com', '$2b$10$DfuW7eIkEF1s.egc.MY4M.7Ap7UdOVw99esQo/a3xpRrpkqQt9VrC', 'pending', 'user', '2025-07-31 12:38:08', 0, '47d6cd460743085b112e076b2c349f985150ad35c666a002661a279a20ce32c5', '123123', '123123', '123123132', '2025-07-31 12:58:09'),
(37, '', 'kevinbalocos023@gmail.com', '$2b$10$FFub5dVY0upPrkaq3qX3I.Ol7OWl4Xwavq/NKBOycB.i8R.qPN.Fm', 'pending', 'admin', '2025-07-31 12:52:32', 0, '0d4a3c20d3e9b60526229af855877bbb855c3b3e1da109ff00b837834493abc7', '123123123', '123123', '123123123123', '2025-07-31 12:58:09'),
(39, '', 'superadmin@example.com', '$2b$10$1WSkB796wgqQmChyRXw83eaWZIK6VK1FYWx4jbsGU73RTqjENbBnW', 'pending', 'superadmin', '2025-07-31 12:54:34', 1, NULL, 'Super', 'Admin', '0000000000', '2025-07-31 12:58:09'),
(40, '', 'kevinbalocosasd@gmail.com', '$2b$10$vxISv0QLFUnPGGXbj7nS2e957SKEn1IdipUvvAxehyl3pXYEkZ10m', 'pending', 'user', '2025-07-31 13:30:26', 0, '58cf3bb9006f72e26fa02ced64d7ed9d1453f3fb9d59b6066a8ec29c144e63fc', 'asd', 'asd', '1231231312313', '2025-07-31 13:30:26');

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
