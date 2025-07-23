-- Create initial schema for Express app
CREATE TABLE IF NOT EXISTS OPC_Facility (
    FacilityID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    EnglishName VARCHAR(255),
    IdentityNumber VARCHAR(255) NOT NULL,
    LicenseNumber VARCHAR(255),
    LicenseType VARCHAR(255),
    LicenseIssueDate DATE,
    LicenseExpirationDate DATE,
    LicenseCity VARCHAR(255),
    LicenseCityEn VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS OPC_Driver (
    DriverID INT AUTO_INCREMENT PRIMARY KEY,
    FacilityID INT,
    IdentityNumber VARCHAR(255),
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    FOREIGN KEY (FacilityID) REFERENCES OPC_Facility(FacilityID)
);

CREATE TABLE IF NOT EXISTS OPC_Vehicle (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    FacilityID INT,
    PlateNumber VARCHAR(255) NOT NULL,
    SerialNumber VARCHAR(255) NOT NULL,
    FOREIGN KEY (FacilityID) REFERENCES OPC_Facility(FacilityID)
);

CREATE TABLE IF NOT EXISTS Supplier (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS OPC_LicenseType (
    LicenseTypeID INT AUTO_INCREMENT PRIMARY KEY,
    LicenseTypeNameAR VARCHAR(255) NOT NULL,
    LicenseTypeNameEN VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS OPC_DriverCard (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    CardNumber VARCHAR(255) UNIQUE NOT NULL,
    token VARCHAR(255),
    CardType VARCHAR(255),
    FacilityID INT,
    DriverID INT,
    IssueDate DATE,
    ExpirationDate DATE,
    Supplier INT,
    addingDate DATE,
    LastUpdate DATE,
    FOREIGN KEY (FacilityID) REFERENCES OPC_Facility(FacilityID),
    FOREIGN KEY (DriverID) REFERENCES OPC_Driver(DriverID),
    FOREIGN KEY (Supplier) REFERENCES Supplier(id)
);

CREATE TABLE IF NOT EXISTS OPC_Card (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    CardNumber VARCHAR(255) UNIQUE NOT NULL,
    FacilityID INT,
    VehicleID INT,
    IssueDate DATE,
    ExpirationDate DATE,
    RenewalDate DATE,
    Supplier INT,
    addingDate DATE,
    LastUpdate DATE,
    FOREIGN KEY (FacilityID) REFERENCES OPC_Facility(FacilityID),
    FOREIGN KEY (VehicleID) REFERENCES OPC_Vehicle(ID),
    FOREIGN KEY (Supplier) REFERENCES Supplier(id)
);
