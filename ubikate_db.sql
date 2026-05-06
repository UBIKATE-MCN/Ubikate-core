CREATE DATABASE IF NOT EXISTS ubikate;
USE ubikate;
CREATE TABLE DISTRITO (
    id_distrito INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    codigo_postal VARCHAR(5),
    puntuacion_4ejes DECIMAL(5,2)
);

CREATE TABLE VIVIENDA (
    id_vivienda INT PRIMARY KEY AUTO_INCREMENT,
    id_distrito INT,
    direccion VARCHAR(200),
    precio DECIMAL(12,2),
    metros_cuadrados INT,
    FOREIGN KEY (id_distrito) REFERENCES DISTRITO(id_distrito)
);

CREATE TABLE USUARIO (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100),
    password VARCHAR(255),
    fecha_registro DATE
);

CREATE TABLE USUARIO_FAVORITOS (
    id_favorito INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    id_vivienda INT,
    fecha_guardado DATE,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),
    FOREIGN KEY (id_vivienda) REFERENCES VIVIENDA(id_vivienda)
);

CREATE TABLE DATOS_MUNICIPIO (
    id_dato INT PRIMARY KEY AUTO_INCREMENT,
    id_distrito INT,
    eje VARCHAR(50),
    valor DECIMAL(10,2),
    fuente VARCHAR(100),
    FOREIGN KEY (id_distrito) REFERENCES DISTRITO(id_distrito)
);