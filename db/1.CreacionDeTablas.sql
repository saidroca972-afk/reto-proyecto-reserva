-- PostgreSQL/Supabase: ejecutar en el SQL Editor del proyecto.
-- Supabase utiliza su base PostgreSQL administrada (normalmente llamada postgres),
-- por lo que no se crea una base de datos desde este script.
-- Creación de tablas sin restricciones de integridad.
CREATE TABLE administrador (
    identificador INTEGER,
    usuario VARCHAR(255),
    contrasena VARCHAR(255)
);

CREATE TABLE tablareserva (
    identificador INTEGER,
    nombrecliente VARCHAR(255),
    numerocliente VARCHAR(30),
    estadopedido VARCHAR(50),
    numeromesa INTEGER,
    fechareserva TIMESTAMP
);
