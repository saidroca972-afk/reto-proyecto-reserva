-- Administrador con hash bcrypt de 8 saltos.
-- Contraseña de ejemplo: 123456
INSERT INTO administrador (identificador, usuario, contrasena)
VALUES (1, 'sabinofc', '$2b$08$Eo180oHhgA29xp3NmRbREeLhc0GFK/hTqiFtQXyFtnGJzsO3gDt/6');

-- Reservas de ejemplo
INSERT INTO tablareserva
    (identificador, nombrecliente, numerocliente, estadopedido, numeromesa, fechareserva)
VALUES
    (1, 'Ana Martinez',     '5551234567', 'Disponible', 1,  '2026-10-01 12:30:00'),
    (2, 'Carlos Rodriguez', '5552345678', 'Cancelado',  2,  '2026-10-01 13:00:00'),
    (3, 'Laura Hernandez',  '5553456789', 'Disponible', 3,  '2026-10-01 13:30:00'),
    (4, 'Miguel Torres',    '5554567890', 'Disponible', 4,  '2026-10-01 14:00:00'),
    (5, 'Sofia Ramirez',    '5555678901', 'Cancelado',  5,  '2026-10-01 14:30:00'),
    (6, 'Diego Flores',     '5556789012', 'Disponible', 6,  '2026-10-01 15:00:00'),
    (7, 'Valentina Cruz',   '5557890123', 'Cancelado',  7,  '2026-10-01 15:30:00'),
    (8, 'Jorge Navarro',    '5558901234', 'Disponible', 8,  '2026-10-01 16:00:00'),
    (9, 'Camila Vargas',    '5559012345', 'Disponible', 9,  '2026-10-01 16:30:00'),
    (10, 'Andres Castillo', '5550123456', 'Cancelado',  10, '2026-10-01 17:00:00');

-- Sincroniza las secuencias después de insertar identificadores explícitos.
SELECT setval(pg_get_serial_sequence('administrador', 'identificador'), COALESCE(MAX(identificador), 1), true) FROM administrador;
SELECT setval(pg_get_serial_sequence('tablareserva', 'identificador'), COALESCE(MAX(identificador), 1), true) FROM tablareserva;
