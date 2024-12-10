DROP DATABASE IF EXISTS Omega;
CREATE DATABASE Omega;
USE Omega;

CREATE TABLE Administrador (
    id_Admin INT PRIMARY KEY AUTO_INCREMENT,
    nombre_Admin VARCHAR(20) NOT NULL,
    apellido_Admin VARCHAR(20) NOT NULL,
    doc_Admin VARCHAR(20) NOT NULL,
    cel_Admin VARCHAR(20) NOT NULL,
    direccion_Admin VARCHAR(50) NOT NULL,
    correo_Admin VARCHAR(50) NOT NULL
);

CREATE TABLE Proveedor (
    id_Proveedor INT PRIMARY KEY AUTO_INCREMENT,
    nombre_Proveedor VARCHAR(20) NOT NULL,
    nit_Proveedor VARCHAR(20) NOT NULL,
    cel_Proveedor VARCHAR(20) NOT NULL,
    direccion_Proveedor VARCHAR(50) NOT NULL,
    Administrador_id INT,
    CONSTRAINT FK_Proveedor_Administrador FOREIGN KEY (Administrador_id) REFERENCES Administrador(id_Admin)
);

CREATE TABLE Productos (
    id_Producto INT PRIMARY KEY AUTO_INCREMENT,
    nombre_Producto VARCHAR(25) NOT NULL,
    marca_Producto VARCHAR(20) NOT NULL,
    precio_Producto DECIMAL(10, 2) NOT NULL,
    id_Proveedor INT,
    CONSTRAINT FK_Productos_Proveedor FOREIGN KEY (id_Proveedor) REFERENCES Proveedor(id_Proveedor)
);

CREATE TABLE Domiciliario (
    id_Domiciliario INT PRIMARY KEY AUTO_INCREMENT,
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

CREATE TABLE Cliente (
    id_Cliente INT PRIMARY KEY AUTO_INCREMENT,
    nombre_Cliente VARCHAR(20) NOT NULL,
    apellido_Cliente VARCHAR(20) NOT NULL,
    cel_Cliente VARCHAR(20) NOT NULL,
    correo_Cliente VARCHAR(50) NOT NULL,
    doc_Cliente VARCHAR(20) NOT NULL,
    id_Domiciliario INT,
    CONSTRAINT FK_Cliente_Domiciliario FOREIGN KEY (id_Domiciliario) REFERENCES Domiciliario(id_Domiciliario) ON DELETE SET NULL
);

CREATE TABLE Factura (
    id_Factura INT PRIMARY KEY AUTO_INCREMENT,
    fecha_Factura DATE NOT NULL,
    total_Factura DECIMAL(10, 2) NOT NULL,
    id_Producto INT NOT NULL,
    id_Cliente INT NOT NULL,
    id_Domiciliario INT NOT NULL,
    cantidad_Productos INT NOT NULL,
    CONSTRAINT FK_Factura_Productos FOREIGN KEY (id_Producto) REFERENCES Productos(id_Producto) ON DELETE CASCADE,
    CONSTRAINT FK_Factura_Cliente FOREIGN KEY (id_Cliente) REFERENCES Cliente(id_Cliente) ON DELETE CASCADE,
    CONSTRAINT FK_Factura_Domiciliario FOREIGN KEY (id_Domiciliario) REFERENCES Domiciliario(id_Domiciliario) ON DELETE CASCADE
);

-- Inserción de datos con la corrección del producto Lapiz
INSERT INTO Administrador (nombre_Admin, apellido_Admin, doc_Admin, cel_Admin, direccion_Admin, correo_Admin)
VALUES
('pablo', 'escobar', '123456789', '3236998', 'calle 128', 'pablo15@.com'),
('popeye', 'marino', '1234561', '3239428', 'av 100', 'popetem15@.com'),
('laura', 'hernandez', '1271252', '9329428', 'av cali', 'laurah15@.com'),
('alejandra', 'joya', '12345951', '3931528', 'calle 200', 'alejaja15@.com'),
('mariana', 'villamil', '12342652', '323567', 'occidente norte', 'marianavilla@.com');

INSERT INTO Proveedor (nombre_Proveedor, nit_Proveedor, cel_Proveedor, direccion_Proveedor, Administrador_id)
VALUES
('Julian', '2324', '32214563', 'cll 128', 1),
('Andres', '3433', '32134265', 'tv 12', 2),
('Carlos', '7679', '30087453', 'cll 43', 3),
('Gregorio', '9097', '32189765', 'tv 01', 4),
('Anderson', '6561', '32236509', 'cll 87', 5);

INSERT INTO Productos (nombre_Producto, marca_Producto, precio_Producto, id_Proveedor)
VALUES
('Boligrafos', 'Bic', 3000, 1),
('Borrador', 'Pelikan', 10000, 2),
('Cuadernos', 'Triunfante', 25000, 3),
('Colores', 'Norma', 75000, 4),
('Lapiz', 'Faber-Castell', 1200, 5),
('Marcadores', 'Wellokb', 55000, 1);

INSERT INTO Domiciliario (nombre_Domiciliario, apellido_Domiciliario, doc_Domiciliario, cel_Domiciliario, direccion_Domiciliario, correo_Domiciliario, placa_Domiciliario, licencia_Domiciliario, id_Producto)
VALUES
('mariana', 'salcedo', '135157', '462541', 'suba tv 91', 'mar@gmail.com', 'RTO85V', '452PUIK', 1),
('cesar', 'pinzon', '895642', '58234', 'lagos', 'cesa@gmail.com', 'LVK32E', '535IKER', 2),
('bryan', 'causado', '45639', '485271', 'rubi', 'bryancau@gmail.com', 'NVV62H', '856MER', 3),
('sofia', 'castellanos', '78932', '15962', 'hunza', 'sofii@gmail.com', 'LOP68L', '452TYM', 4),
('laura', 'hernandez', '1031807', '794221', 'japon 90', 'lauher@gmail.com', 'GSX15R', '853GYV', 5);

INSERT INTO Cliente (nombre_Cliente, apellido_Cliente, cel_Cliente, correo_Cliente, doc_Cliente, id_Domiciliario)
VALUES
('Jaime', 'Garzon', '3211234', 'pablo15@.com', '12345678', 1),
('julian', 'marino', '3131234', 'julian10@.com', '123567365', 2),
('juan', 'moreno', '3131213', 'juan12@.com', '123567768', 3),
('camilo', 'fernandez', '3131786', 'camilo13@.com', '123567767', 4),
('ivan', 'choles', '3131369', 'ivan20@.com', '123567321', 5);