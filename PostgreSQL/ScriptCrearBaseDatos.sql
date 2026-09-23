-- ---------- Vista A: Partidos y Propuestas ----------

CREATE TABLE partidos_pg (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    siglas VARCHAR(20) NOT NULL,
    ideologia VARCHAR(100) NOT NULL,
    fecha_fundacion DATE NOT NULL,
    sede VARCHAR(150) NOT NULL,
    sitio_web VARCHAR(150),
    num_militantes INTEGER NOT NULL,
    logo BYTEA
);

CREATE TABLE propuestas_pg (
    id SERIAL PRIMARY KEY,
    partido_id INTEGER NOT NULL REFERENCES partidos_pg(id) ON DELETE CASCADE,
    titulo VARCHAR(200) NOT NULL,
    area VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_presentacion DATE NOT NULL,
    estado VARCHAR(50) NOT NULL,
    presupuesto_estimado NUMERIC(14,2) NOT NULL,
    alcance VARCHAR(100) NOT NULL,
    imagen BYTEA
);

-- ---------- Vista B: Figuras Publicas y Cargos Historicos ----------

CREATE TABLE figuras_pg (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    cargo_actual VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    nacionalidad VARCHAR(80) NOT NULL,
    nivel_educativo VARCHAR(100) NOT NULL,
    anios_experiencia INTEGER NOT NULL,
    biografia TEXT NOT NULL,
    foto BYTEA
);

CREATE TABLE cargos_historicos_pg (
    id SERIAL PRIMARY KEY,
    figura_id INTEGER NOT NULL REFERENCES figuras_pg(id) ON DELETE CASCADE,
    cargo VARCHAR(100) NOT NULL,
    institucion VARCHAR(150) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    logros TEXT NOT NULL,
    motivo_salida VARCHAR(150),
    region VARCHAR(100) NOT NULL,
    imagen_evento BYTEA
);
