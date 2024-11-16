
CREATE TABLE users (
    IdUser SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Phone VARCHAR(20) NOT NULL,
    Password TEXT NOT NULL,
    Role VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email ON users(Email);
CREATE INDEX idx_role ON users(Role);

CREATE TABLE categories (
    IdCategory SERIAL PRIMARY KEY,
    CategoryName VARCHAR(255) NOT NULL
);

CREATE TABLE objects (
    IdObject SERIAL PRIMARY KEY,
    IdUser INT NOT NULL,
    Name VARCHAR(255) NOT NULL,
    IdCategory INT NOT NULL,
    Description TEXT,
    CONSTRAINT fk_user
        FOREIGN KEY(IdUser)
            REFERENCES users(IdUser)
            ON DELETE SET NULL
            ON UPDATE CASCADE,
    CONSTRAINT fk_category
        FOREIGN KEY(IdCategory)
            REFERENCES categories(IdCategory)
            ON DELETE SET NULL
            ON UPDATE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_category ON objects(IdCategory);

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

CREATE TABLE status (
    IdStatus SERIAL PRIMARY KEY,
    StatusName VARCHAR(50) NOT NULL
);

CREATE TABLE status_history (
    IdHistory SERIAL PRIMARY KEY,
    IdObject INT NOT NULL,
    IdStatus INT NOT NULL,
    StatusChangeDate DATE NOT NULL,
    CONSTRAINT fk_object_status FOREIGN KEY(IdObject)
        REFERENCES objects(IdObject)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_status FOREIGN KEY(IdStatus)
        REFERENCES status(IdStatus)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE founds (
    IdFound SERIAL PRIMARY KEY,
    IdObject INT NOT NULL,
    IdLocation INT NOT NULL,
    IdFinder INT,
    FinderName VARCHAR(255) NOT NULL,
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
    CONSTRAINT fk_finder
        FOREIGN KEY(IdFinder)
            REFERENCES users(IdUser)
            ON DELETE SET NULL
            ON UPDATE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE returneds (
    IdReturned SERIAL PRIMARY KEY,
    IdObject INT NOT NULL,
    IdReturner INT,
    ReturnerName VARCHAR(255) NOT NULL,
    ReturnDate DATE NOT NULL,
    CONSTRAINT fk_object_returned
        FOREIGN KEY(IdObject)
            REFERENCES objects(IdObject)
            ON DELETE SET NULL
            ON UPDATE CASCADE,
    CONSTRAINT fk_returner
        FOREIGN KEY(IdReturner)
            REFERENCES users(IdUser)
            ON DELETE SET NULL
            ON UPDATE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- data for testing

-- Insert users
INSERT INTO users (Name, Email, Phone, Password, Role)
VALUES 
('admin', 'admin@email.com', '+52 0000000000', crypt('securepassword', gen_salt('bf')), 'admin'),  -- Use bcrypt
('gatovsky', 'contacto@hharieta.lat', '+52 0000000000', crypt('gato1234!', gen_salt('bf')), 'admin');

-- Insert categories
INSERT INTO categories (CategoryName)
VALUES 
    ('Accesorios'), 
    ('Bolsos'), 
    ('Ropa'), 
    ('Electrónicos'), 
    ('Documentos'), 
    ('Termos'), 
    ('Loncheras'),
    ('Utiles'), 
    ('Libros'),
    ('Otros');

-- Insert locations
INSERT INTO locations (Name, Address, Description)
VALUES
('Sala de Usos Multiples', 'Cecilio Chavez', 'Se encontró debajo  de una banca por la entrada'),
('Biblioteca', 'Av. Universidad', 'Se encontró en el pasillo de la biblioteca'),
('Salón 6', 'Edificio Q', 'Se encontró debajo de una silla junto a la puerta');

-- Insert objects
INSERT INTO objects (IdUser, Name, IdCategory, Description)
VALUES
(1, 'Cartera Negra', 1, 'Cartera de cuero con varias tarjetas adentro'),
(2, 'Botella de Agua', 6, 'Botella de agua azul con un sticker'),
(1, 'Mochila', 2, 'Mochila azul con libros adentro');

-- Insert status
INSERT INTO status (StatusName)
VALUES ('Found'), ('Returned'), ('Claimed'), ('Lost');

-- Insert found objects
INSERT INTO founds (IdObject, IdLocation, IdFinder, FinderName, FoundDate)
VALUES
(1, 1, NULL, 'Panchito López', '2024-09-01'),  -- Sin usuario registrado como finder
(2, 2, 2, 'Gatovsky', '2024-09-05'),    -- Usuario registrado como finder
(3, 3, NULL, 'Paco de la Vega', '2024-09-10');

-- Insert returned objects
INSERT INTO returneds (IdObject, IdReturner, ReturnerName, ReturnDate)
VALUES
(1, NULL, 'Paco de la Vega','2024-09-02'),  -- Sin usuario registrado como returner
(2, 2, 'Gatovsky', '2024-09-06');     -- Usuario registrado como returner

-- Insert images
INSERT INTO images (IdObject, Image)
VALUES
(1, pg_read_binary_file('/assets/blackwallet.jpg')),
(2, pg_read_binary_file('/assets/bottle_water.webp')),
(3, pg_read_binary_file('/assets/backpack.webp'));

-- Insert status history
INSERT INTO status_history (IdObject, IdStatus, StatusChangeDate)
VALUES
(1, 1, '2024-09-01'),  -- Black Wallet encontrado
(1, 2, '2024-09-02'),  -- Black Wallet devuelto
(2, 1, '2024-09-05'),  -- Bottle Water encontrado
(2, 2, '2024-09-06');  -- Bottle Water devuelto
