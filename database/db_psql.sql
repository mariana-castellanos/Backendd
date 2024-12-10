
-- Drop the database if it exists
DROP DATABASE IF EXISTS Omega;
-- Create a new database
CREATE DATABASE Omega;

-- Connect to the new database (In PostgreSQL, the connection is external, so we assume the connection will be done prior)

-- Create Administrador table
CREATE TABLE Administrador (
    id_Admin SERIAL PRIMARY KEY,
    nombre_Admin VARCHAR(20) NOT NULL,
    apellido_Admin VARCHAR(20) NOT NULL,
    doc_Admin VARCHAR(20) NOT NULL,
    cel_Admin VARCHAR(20) NOT NULL,
    direccion_Admin VARCHAR(50) NOT NULL,
    correo_Admin VARCHAR(50) NOT NULL
);

-- Create Proveedor table
CREATE TABLE Proveedor (
    id_Proveedor SERIAL PRIMARY KEY,
    nombre_Proveedor VARCHAR(20) NOT NULL,
    nit_Proveedor VARCHAR(20) NOT NULL,
    cel_Proveedor VARCHAR(20) NOT NULL,
    direccion_Proveedor VARCHAR(50) NOT NULL,
    Administrador_id INT,
    CONSTRAINT FK_Proveedor_Administrador FOREIGN KEY (Administrador_id) REFERENCES Administrador(id_Admin)
);

-- Create Productos table
CREATE TABLE Productos (
    id_Producto SERIAL PRIMARY KEY,
    nombre_Producto VARCHAR(25) NOT NULL,
    marca_Producto VARCHAR(20) NOT NULL,
    precio_Producto DECIMAL(10, 2) NOT NULL,
    id_Proveedor INT,
    CONSTRAINT FK_Productos_Proveedor FOREIGN KEY (id_Proveedor) REFERENCES Proveedor(id_Proveedor)
);

-- Create Domiciliario table
CREATE TABLE Domiciliario (
    id_Domiciliario SERIAL PRIMARY KEY,
    nombre_Domiciliario VARCHAR(30) NOT NULL,
    apellido_Domiciliario VARCHAR(30) NOT NULL,
    doc_Domiciliario VARCHAR(20) NOT NULL,
    cel_Domiciliario VARCHAR(20) NOT NULL,
    direccion_Domiciliario VARCHAR(50) NOT NULL,
    correo_Domiciliario VARCHAR(50) NOT NULL,
    placa_Domiciliario VARCHAR(10) NOT NULL,
    licencia_Domiciliario VARCHAR(50) NOT NULL,
    id_Producto INT,
    CONSTRAINT FK_Domiciliario_Productos FOREIGN KEY (id_Producto) REFERENCES Productos(id_Producto) ON DELETE SET NULL
);

-- Create Cliente table
CREATE TABLE Cliente (
    id_Cliente SERIAL PRIMARY KEY,
    nombre_Cliente VARCHAR(20) NOT NULL,
    apellido_Cliente VARCHAR(20) NOT NULL,
    cel_Cliente VARCHAR(20) NOT NULL,
    correo_Cliente VARCHAR(50) NOT NULL,
    doc_Cliente VARCHAR(20) NOT NULL,
    id_Domiciliario INT,
    CONSTRAINT FK_Cliente_Domiciliario FOREIGN KEY (id_Domiciliario) REFERENCES Domiciliario(id_Domiciliario)
);

-- Insert data into Administrador table
INSERT INTO Administrador (nombre_Admin, apellido_Admin, doc_Admin, cel_Admin, direccion_Admin, correo_Admin)
VALUES
('Julian', 'Rodriguez', '12345678', '3101234567', 'Calle 123', 'julian@correo.com'),
('Andres', 'Garcia', '87654321', '3119876543', 'Carrera 45', 'andres@correo.com'),
('Laura', 'Martinez', '13579135', '3121357913', 'Calle 72', 'laura@correo.com'),
('Sofia', 'Lopez', '24680246', '3132468024', 'Carrera 19', 'sofia@correo.com'),
('Camila', 'Perez', '36925814', '3143692581', 'Calle 100', 'camila@correo.com');

-- Insert data into Proveedor table
INSERT INTO Proveedor (nombre_Proveedor, nit_Proveedor, cel_Proveedor, direccion_Proveedor, Administrador_id)
VALUES
('Julian', '2324', '32214563', 'cll 128', 1),
('Andres', '3433', '32134265', 'tv 12', 2),
('Carlos', '7679', '30087453', 'cll 43', 3),
('Gregorio', '9097', '32189765', 'tv 01', 4),
('Anderson', '6561', '32236509', 'cll 87', 5);

-- Insert data into Productos table
INSERT INTO Productos (nombre_Producto, marca_Producto, precio_Producto, id_Proveedor)
VALUES
('Boligrafos', 'Bic', 3000, 1),
('Borrador', 'Pelikan', 10000, 2),
('Cuadernos', 'Triunfante', 25000, 3),
('Colores', 'Norma', 75000, 4),
('Lapiz', 'Faber-Castell', 1200, 5),
('Marcadores', 'Wellokb', 55000, 1);

-- Insert data into Domiciliario table
INSERT INTO Domiciliario (nombre_Domiciliario, apellido_Domiciliario, doc_Domiciliario, cel_Domiciliario, direccion_Domiciliario, correo_Domiciliario, placa_Domiciliario, licencia_Domiciliario, id_Producto)
VALUES
('mariana', 'salcedo', '135157', '462541', 'suba tv 91', 'mar@gmail.com', 'RTO85V', '452PUIK', 1),
('cesar', 'pinzon', '895642', '58234', 'lagos', 'cesa@gmail.com', 'LVK32E', '535IKER', 2),
('bryan', 'causado', '45639', '485271', 'rubi', 'bryancau@gmail.com', 'NVV62H', '856MER', 3),
('sofia', 'castellanos', '78932', '15962', 'hunza', 'sofii@gmail.com', 'LOP68L', '452TYM', 4),
('laura', 'hernandez', '1031807', '794221', 'japon 90', 'lauher@gmail.com', 'GSX15R', '853GYV', 5);

-- Insert data into Cliente table
INSERT INTO Cliente (nombre_Cliente, apellido_Cliente, cel_Cliente, correo_Cliente, doc_Cliente, id_Domiciliario)
VALUES
('Jaime', 'Garzon', '3211234', 'pablo15@.com', '12345678', 1),
('julian', 'marino', '3131234', 'julian10@.com', '123567365', 2),
('juan', 'moreno', '3131213', 'juan12@.com', '123567768', 3),
('camilo', 'fernandez', '3131786', 'camilo13@.com', '123567767', 4),
('ivan', 'choles', '3131369', 'ivan20@.com', '123567321', 5);
