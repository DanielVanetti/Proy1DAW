INSERT INTO partidos_pg (nombre, siglas, ideologia, fecha_fundacion, sede, sitio_web, num_militantes)
VALUES
('Partido Renovacion Nacional', 'PRN', 'Centro', '1998-03-14', 'San Jose', 'https://prn.example.org', 45000),
('Alianza Progresista', 'AP', 'Centro-izquierda', '2004-07-22', 'Heredia', 'https://alianzaprogresista.example.org', 32000),
('Frente Unido Democratico', 'FUD', 'Socialdemocrata', '1991-11-05', 'Cartago', 'https://fud.example.org', 58000),
('Movimiento Civico Independiente', 'MCI', 'Independiente', '2012-02-18', 'Alajuela', 'https://mci.example.org', 15000);

INSERT INTO propuestas_pg (partido_id, titulo, area, descripcion, fecha_presentacion, estado, presupuesto_estimado, alcance)
VALUES
(1, 'Modernizacion de la red vial nacional', 'Infraestructura', 'Plan de repavimentacion y ampliacion de rutas principales.', '2025-02-10', 'En discusion', 850000000.00, 'Nacional'),
(1, 'Becas tecnologicas para zonas rurales', 'Educacion', 'Programa de becas en carreras STEM para estudiantes rurales.', '2025-05-03', 'Aprobada', 120000000.00, 'Regional'),
(2, 'Reforma al sistema de pensiones', 'Seguridad social', 'Ajustes actuariales para sostenibilidad del regimen de pensiones.', '2024-09-18', 'En discusion', 0.00, 'Nacional'),
(3, 'Plan nacional de vivienda social', 'Vivienda', 'Construccion de vivienda de interes social en zonas urbanas.', '2025-01-22', 'Aprobada', 430000000.00, 'Nacional'),
(4, 'Transparencia en contratacion publica', 'Gobierno abierto', 'Plataforma digital para seguimiento de licitaciones publicas.', '2025-03-30', 'Presentada', 60000000.00, 'Nacional');

INSERT INTO figuras_pg (nombre_completo, cargo_actual, fecha_nacimiento, nacionalidad, nivel_educativo, anios_experiencia, biografia)
VALUES
('Marcela Vindas Soto', 'Diputada', '1978-05-12', 'Costarricense', 'Maestria en Ciencias Politicas', 12, 'Diputada de la Republica, especialista en politicas sociales.'),
('Rodrigo Salazar Urena', 'Alcalde', '1970-09-30', 'Costarricense', 'Licenciatura en Administracion Publica', 20, 'Alcalde municipal con enfoque en gestion de infraestructura local.'),
('Ana Lucia Mora Chinchilla', 'Ministra', '1982-01-27', 'Costarricense', 'Doctorado en Economia', 15, 'Ministra encargada de politica economica y fiscal.'),
('Esteban Quesada Rojas', 'Diputado', '1985-06-19', 'Costarricense', 'Licenciatura en Derecho', 8, 'Diputado enfocado en reformas al sistema judicial.');

INSERT INTO cargos_historicos_pg (figura_id, cargo, institucion, fecha_inicio, fecha_fin, logros, motivo_salida, region)
VALUES
(1, 'Regidora Municipal', 'Municipalidad de San Jose', '2016-05-01', '2020-04-30', 'Impulso de ordenanzas de movilidad urbana.', 'Fin de periodo', 'San Jose'),
(2, 'Concejal', 'Municipalidad de Heredia', '2010-05-01', '2016-04-30', 'Gestion de proyectos de acueductos rurales.', 'Fin de periodo', 'Heredia'),
(3, 'Viceministra de Hacienda', 'Ministerio de Hacienda', '2018-05-08', '2022-05-07', 'Reduccion del deficit fiscal en un periodo de gobierno.', 'Cambio de administracion', 'Nacional'),
(4, 'Asesor Legislativo', 'Asamblea Legislativa', '2014-01-15', '2018-04-30', 'Redaccion de proyectos de ley en materia penal.', 'Postulacion a diputado', 'Nacional');
