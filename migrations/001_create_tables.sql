SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- ------------------------------------------------------------------
-- Helper function used by triggers to generate a unique token
-- ------------------------------------------------------------------
DELIMITER $$
CREATE FUNCTION `generate_custom_uuid`()
RETURNS varchar(31)
    DETERMINISTIC
BEGIN
    -- Returns a 31 character UUID without dashes
    RETURN SUBSTR(REPLACE(UUID(), '-', ''), 1, 31);
END$$
DELIMITER ;

-- Database: `lmbolwmy_leave`

-- --------------------------------------------------------

-- بنية الجدول `OPC_Brand`
CREATE TABLE `OPC_Brand` (
  `BrandID` int(11) NOT NULL,
  `BrandName` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `BrandEn` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

-- بنية الجدول `OPC_Card`
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

-- القوادح `OPC_Card`
DELIMITER $$
CREATE TRIGGER `before_insert_opc_card` BEFORE INSERT ON `OPC_Card` FOR EACH ROW BEGIN
    DECLARE new_token VARCHAR(31);
    SET new_token = generate_custom_uuid();
    WHILE EXISTS (SELECT 1 FROM OPC_Card WHERE token = new_token) DO
        SET new_token = generate_custom_uuid();
    END WHILE;
    SET NEW.token = new_token;
END$$
DELIMITER ;

-- --------------------------------------------------------

-- بنية الجدول `OPC_Color`
CREATE TABLE `OPC_Color` (
  `ColorID` int(11) NOT NULL,
  `ColorName` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `ColorEn` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

-- بنية الجدول `OPC_Driver`
CREATE TABLE `OPC_Driver` (
  `DriverID` int(11) NOT NULL,
  `FacilityID` int(11) DEFAULT NULL,
  `FirstName` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `LastName` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `IdentityNumber` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

-- بنية الجدول `OPC_DriverCard`
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

-- القوادح `OPC_DriverCard`
DELIMITER $$
CREATE TRIGGER `before_insert_opc_drivercard` BEFORE INSERT ON `OPC_DriverCard` FOR EACH ROW BEGIN
    DECLARE new_token VARCHAR(31);
    SET new_token = generate_custom_uuid();
    WHILE EXISTS (SELECT 1 FROM OPC_DriverCard WHERE token = new_token) DO
        SET new_token = generate_custom_uuid();
    END WHILE;
    SET NEW.token = new_token;
END$$
DELIMITER ;

-- --------------------------------------------------------

-- بنية الجدول `OPC_Facility`
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

-- بنية الجدول `OPC_LicenseType`
CREATE TABLE `OPC_LicenseType` (
  `LicenseTypeID` int(11) NOT NULL,
  `LicenseTypeNameAR` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `LicenseTypeNameEN` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

-- بنية الجدول `OPC_Model`
CREATE TABLE `OPC_Model` (
  `ModelID` int(11) NOT NULL,
  `ModelName` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `ModelEn` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `BrandID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

-- بنية الجدول `OPC_Vehicle`
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

-- بنية الجدول `Supplier`
CREATE TABLE `Supplier` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Indexes for dumped tables
ALTER TABLE `OPC_Brand`
  ADD PRIMARY KEY (`BrandID`);
ALTER TABLE `OPC_Card`
  ADD PRIMARY KEY (`ID`);
ALTER TABLE `OPC_Color`
  ADD PRIMARY KEY (`ColorID`);
ALTER TABLE `OPC_Driver`
  ADD PRIMARY KEY (`DriverID`);
ALTER TABLE `OPC_DriverCard`
  ADD PRIMARY KEY (`ID`);
ALTER TABLE `OPC_Facility`
  ADD PRIMARY KEY (`FacilityID`);
ALTER TABLE `OPC_LicenseType`
  ADD PRIMARY KEY (`LicenseTypeID`);
ALTER TABLE `OPC_Model`
  ADD PRIMARY KEY (`ModelID`);
ALTER TABLE `OPC_Vehicle`
  ADD PRIMARY KEY (`ID`);
ALTER TABLE `Supplier`
  ADD PRIMARY KEY (`id`);

-- AUTO_INCREMENT for dumped tables
ALTER TABLE `OPC_Brand`
  MODIFY `BrandID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `OPC_Card`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `OPC_Color`
  MODIFY `ColorID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `OPC_Driver`
  MODIFY `DriverID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `OPC_DriverCard`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `OPC_Facility`
  MODIFY `FacilityID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `OPC_LicenseType`
  MODIFY `LicenseTypeID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `OPC_Model`
  MODIFY `ModelID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `OPC_Vehicle`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `Supplier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
