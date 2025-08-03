-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: 03 أغسطس 2025 الساعة 11:06
-- إصدار الخادم: 5.7.23-23
-- PHP Version: 8.1.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lmbolwmy_leave`
--

-- --------------------------------------------------------

--
-- بنية الجدول `OPC_Brand`
--

CREATE TABLE `OPC_Brand` (
  `BrandID` int(11) NOT NULL,
  `BrandName` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `BrandEn` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `OPC_Card`
--

CREATE TABLE `OPC_Card` (
  `ID` int(11) NOT NULL,
  `token` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `CardNumber` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `FacilityID` int(11) NOT NULL,
  `VehicleID` int(11) NOT NULL,
  `DriverID` int(11) DEFAULT NULL,
  `IssueDate` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ExpirationDate` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `RenewalDate` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Supplier` int(11) DEFAULT NULL,
  `addingDate` date DEFAULT NULL,
  `LastUpdate` date DEFAULT NULL,
  `userID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- القوادح `OPC_Card`
--
DELIMITER $$
CREATE TRIGGER `before_insert_opc_card` BEFORE INSERT ON `OPC_Card` FOR EACH ROW BEGIN
    DECLARE new_token VARCHAR(31);
    DECLARE prefix VARCHAR(5) DEFAULT '54-00';
    DECLARE random_number INT;
    DECLARE card_number VARCHAR(20);
    DECLARE card_exists INT DEFAULT 1;

    -- توليد التوكن UUID المخصص مع التحقق من عدم التكرار
    SET new_token = generate_custom_uuid();
    WHILE EXISTS (SELECT 1 FROM OPC_Card WHERE token = new_token) DO
        SET new_token = generate_custom_uuid();
    END WHILE;

    -- توليد CardNumber بنفس منطق الدالة PHP
    WHILE card_exists = 1 DO
        SET random_number = FLOOR(100000 + (RAND() * 900000));
        SET card_number = CONCAT(prefix, random_number);
        SELECT COUNT(*) INTO card_exists FROM OPC_Card WHERE CardNumber = card_number;
    END WHILE;

    -- تعيين القيم الجديدة
    SET NEW.token = new_token;
    SET NEW.CardNumber = card_number;
    SET NEW.addingDate = NEW.LastUpdate;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- بنية الجدول `OPC_Color`
--

CREATE TABLE `OPC_Color` (
  `ColorID` int(11) NOT NULL,
  `ColorName` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `ColorEn` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `OPC_Driver`
--

CREATE TABLE `OPC_Driver` (
  `DriverID` int(11) NOT NULL,
  `FacilityID` int(11) DEFAULT NULL,
  `FirstName` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `LastName` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `IdentityNumber` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `OPC_DriverCard`
--

CREATE TABLE `OPC_DriverCard` (
  `ID` int(11) NOT NULL,
  `token` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `CardNumber` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `CardType` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `FacilityID` int(11) DEFAULT NULL,
  `DriverID` int(11) DEFAULT NULL,
  `IssueDate` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ExpirationDate` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Supplier` int(11) DEFAULT NULL,
  `addingDate` date DEFAULT NULL,
  `LastUpdate` date DEFAULT NULL,
  `userID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- القوادح `OPC_DriverCard`
--
DELIMITER $$
CREATE TRIGGER `before_insert_opc_drivercard` BEFORE INSERT ON `OPC_DriverCard` FOR EACH ROW BEGIN
    DECLARE new_token VARCHAR(31);
    
    -- توليد قيمة UUID مخصص والتأكد من عدم التكرار
    SET new_token = generate_custom_uuid();
    WHILE EXISTS (SELECT 1 FROM OPC_DriverCard WHERE token = new_token) DO
        SET new_token = generate_custom_uuid();
    END WHILE;
    
    -- تعيين القيمة إلى الحقل
    SET NEW.token = new_token;
    SET NEW.addingDate = NEW.LastUpdate;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- بنية الجدول `OPC_Facility`
--

CREATE TABLE `OPC_Facility` (
  `FacilityID` int(11) NOT NULL,
  `IdentityNumber` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `Name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `EnglishName` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `LicenseNumber` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `LicenseTypeID` int(11) DEFAULT NULL,
  `LicenseType` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `LicenseCity` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `LicenseCityEn` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `LicenseIssueDate` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `LicenseExpirationDate` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `OPC_LicenseType`
--

CREATE TABLE `OPC_LicenseType` (
  `LicenseTypeID` int(11) NOT NULL,
  `LicenseTypeNameAR` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `LicenseTypeNameEN` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `OPC_Model`
--

CREATE TABLE `OPC_Model` (
  `ModelID` int(11) NOT NULL,
  `ModelName` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `ModelEn` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `BrandID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `OPC_Vehicle`
--

CREATE TABLE `OPC_Vehicle` (
  `ID` int(11) NOT NULL,
  `BrandID` int(11) DEFAULT NULL,
  `ModelID` int(11) DEFAULT NULL,
  `ColorID` int(11) DEFAULT NULL,
  `PlateNumber` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `SerialNumber` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ManufacturingYear` int(11) DEFAULT NULL,
  `FacilityID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `Supplier`
--

CREATE TABLE `Supplier` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `OPC_Brand`
--
ALTER TABLE `OPC_Brand`
  ADD PRIMARY KEY (`BrandID`);

--
-- Indexes for table `OPC_Card`
--
ALTER TABLE `OPC_Card`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `OPC_Color`
--
ALTER TABLE `OPC_Color`
  ADD PRIMARY KEY (`ColorID`);

--
-- Indexes for table `OPC_Driver`
--
ALTER TABLE `OPC_Driver`
  ADD PRIMARY KEY (`DriverID`);

--
-- Indexes for table `OPC_DriverCard`
--
ALTER TABLE `OPC_DriverCard`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `OPC_Facility`
--
ALTER TABLE `OPC_Facility`
  ADD PRIMARY KEY (`FacilityID`);

--
-- Indexes for table `OPC_LicenseType`
--
ALTER TABLE `OPC_LicenseType`
  ADD PRIMARY KEY (`LicenseTypeID`);

--
-- Indexes for table `OPC_Model`
--
ALTER TABLE `OPC_Model`
  ADD PRIMARY KEY (`ModelID`);

--
-- Indexes for table `OPC_Vehicle`
--
ALTER TABLE `OPC_Vehicle`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `Supplier`
--
ALTER TABLE `Supplier`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `OPC_Brand`
--
ALTER TABLE `OPC_Brand`
  MODIFY `BrandID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `OPC_Card`
--
ALTER TABLE `OPC_Card`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `OPC_Color`
--
ALTER TABLE `OPC_Color`
  MODIFY `ColorID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `OPC_Driver`
--
ALTER TABLE `OPC_Driver`
  MODIFY `DriverID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `OPC_DriverCard`
--
ALTER TABLE `OPC_DriverCard`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `OPC_Facility`
--
ALTER TABLE `OPC_Facility`
  MODIFY `FacilityID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `OPC_LicenseType`
--
ALTER TABLE `OPC_LicenseType`
  MODIFY `LicenseTypeID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `OPC_Model`
--
ALTER TABLE `OPC_Model`
  MODIFY `ModelID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `OPC_Vehicle`
--
ALTER TABLE `OPC_Vehicle`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Supplier`
--
ALTER TABLE `Supplier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
