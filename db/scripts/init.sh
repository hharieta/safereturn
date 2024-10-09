#!/bin/bash
#
# Script Name: init.sh
# Author: Inge Gatovsky
# Date: 03/10/24

set -euo pipefail

DB_PASSWORD=$(cat /run/secrets/db_password)
POSTGRES_PASSWORD=$(cat /run/secrets/postgres-passwd)
DB_USER=${DB_USER:-}
DB_NAME=${DB_NAME:-}

echo "DB_USER: $DB_USER"
echo "DB_NAME: $DB_NAME"
echo "DB_PASSWORD: $DB_PASSWORD"
echo "POSTGRES_PASSWORD: $POSTGRES_PASSWORD"

# check if the variables are empty
if [ -z "$POSTGRES_PASSWORD" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_NAME" ] || [ -z "$DB_USER" ]; then
    echo "Usage: $0 POSTGRES_PASSWORD DB_PASSWORD DB_NAME DB_USER"
    exit 1
fi

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER "$DB_USER" WITH PASSWORD '$DB_PASSWORD';
    CREATE DATABASE "$DB_NAME" 
    WITH 
        OWNER = "$DB_USER" 
        ENCODING = 'UTF8' 
        TABLESPACE = pg_default 
        CONNECTION LIMIT = -1;
EOSQL


psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB_NAME" <<-EOSQL
    SET timezone = 'America/Denver'; -- UTC-7

    
    CREATE TABLE users (
        IdUser SERIAL PRIMARY KEY,
        Name VARCHAR(255) NOT NULL,
        Password VARCHAR(255) NOT NULL,
        Role VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE objects (
        IdObject SERIAL PRIMARY KEY,
        IdUser INT NOT NULL,
        Name VARCHAR(255) NOT NULL,
        Category VARCHAR(255) NOT NULL,
        Description TEXT,
        CONSTRAINT fk_user
            FOREIGN KEY(IdUser)
                REFERENCES users(IdUser)
                ON DELETE SET NULL
                ON UPDATE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX idx_category ON objects(Category);
    CREATE TABLE  locations (
        IdLocation SERIAL PRIMARY KEY,
        Name VARCHAR(255) NOT NULL,
        Address VARCHAR(255) NOT NULL,
        Description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE images (
        IdImage SERIAL PRIMARY KEY,
        IdObject INT NOT NULL,
        Image BYTEA NULL,
        CONSTRAINT fk_object_image
            FOREIGN KEY(IdObject)
                REFERENCES objects(IdObject)
                ON DELETE SET NULL
                ON UPDATE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE founds (
        IdFound SERIAL PRIMARY KEY,
        IdObject INT NOT NULL,
        IdLocation INT NOT NULL,
        FinderName VARCHAR(255),
        FoundDate DATE NOT NULL,
        CONSTRAINT fk_object_found
            FOREIGN KEY(IdObject)
                REFERENCES objects(IdObject)
                ON DELETE SET NULL
                ON UPDATE CASCADE,
        CONSTRAINT fk_location
            FOREIGN KEY(IdLocation)
                REFERENCES locations(IdLocation)
                ON DELETE SET NULL
                ON UPDATE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE returneds (
        IdReturned SERIAL PRIMARY KEY,
        IdObject INT NOT NULL,
        ReturnerName VARCHAR(255),
        ReturnDate DATE NOT NULL,
        CONSTRAINT fk_object_returned
            FOREIGN KEY(IdObject)
                REFERENCES objects(IdObject)
                ON DELETE SET NULL
                ON UPDATE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    -- data for testing
    -- Insert users
    INSERT INTO users (Name, Password, Role)
    VALUES 
    ('admin', 'securepassword', 'admin'),
    ('john_doe', 'password123', 'user');
    -- Insert locations
    INSERT INTO locations (Name, Address, Description)
    VALUES
    ('Main Hall', '123 University Ave', 'Lost and Found counter in the main hall'),
    ('Library', '456 Library St', 'Objects found in the library'),
    ('Cafeteria', '789 Food St', 'Found items from the cafeteria');
    -- Insert objects
    INSERT INTO objects (IdUser, Name, Category, Description)
    VALUES
    (1, 'Black Wallet', 'Accessories', 'Leather wallet with several cards inside'),
    (2, 'Bottle Watter', 'Accessories', 'Blue bottle of water with a sticker'),
    (1, 'Backpack', 'Bags', 'Blue backpack with books inside');
    -- Insert founds
    INSERT INTO founds (IdObject, IdLocation, FinderName, FoundDate)
    VALUES
    (1, 1, 'Jane Smith', '2024-09-01'),
    (2, 2, 'John Doe', '2024-09-05'),
    (3, 3, 'Mike Brown', '2024-09-10');
    -- Insert returneds
    -- INSERT INTO returneds (IdObject, ReturnerName, ReturnDate)
    -- VALUES
    -- (1, 'Jane Smith', '2024-09-02'),
    -- (2, 'John Doe', '2024-09-06');

    -- Insert images
    INSERT INTO images (IdObject, Image)
    VALUES
    (1, pg_read_binary_file('/assets/blackwallet.jpg')),
    (2, pg_read_binary_file('/assets/bottle_watter.webp')),
    (3, pg_read_binary_file('/assets/backpack.webp'));

    -- Grant privileges
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "$DB_USER";
    GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO "$DB_USER";

EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB_NAME" <<-EOSQL
  ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "$DB_USER";
EOSQL

