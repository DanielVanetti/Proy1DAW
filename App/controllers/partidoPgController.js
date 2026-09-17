const pool = require("../db/database");

// AGREGADO: logger de acciones (requerimiento del proyecto, no está en S4)
const Logger = require("../utils/logger");

// AGREGADO: serialización de imágenes (requerimiento del proyecto, no está en S4)
// La columna "logo" es BYTEA: PostgreSQL la devuelve como binario (Buffer)
// y aquí se convierte a texto base64 para enviarla serializada a la vista.
const serializarImagen = (partido) => ({
    ...partido,
    logo: partido.logo ? partido.logo.toString("base64") : null
});

// Obtener todos los partidos
exports.getAllPartidos = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM partidos_pg ORDER BY id");
        Logger.registrar("Consultar partidos (PostgreSQL)"); // AGREGADO: log
        res.json(result.rows.map(serializarImagen));
    } catch (err) {
        console.error(err);
        Logger.registrar("Error al obtener partidos (PostgreSQL): " + err.message); // AGREGADO: log
        res.status(500).json({ error: "Error al obtener partidos" });
    }
};

// Obtener un partido por ID
exports.getPartidoById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM partidos_pg WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            Logger.registrar("Partido " + id + " no encontrado (PostgreSQL)"); // AGREGADO: log
            return res.status(404).json({ error: "Partido no encontrado" });
        }
        Logger.registrar("Consultar partido " + id + " (PostgreSQL)"); // AGREGADO: log
        res.json(serializarImagen(result.rows[0]));
    } catch (err) {
        console.error(err);
        Logger.registrar("Error al obtener partido (PostgreSQL): " + err.message); // AGREGADO: log
        res.status(500).json({ error: "Error al obtener partido" });
    }
};

// Crear un nuevo partido
exports.createPartido = async (req, res) => {
    const { nombre, siglas, ideologia, fecha_fundacion, sede, sitio_web, num_militantes, logo } = req.body;
    // AGREGADO: la imagen llega serializada en base64 y se guarda como binario (BYTEA)
    const logoBinario = logo ? Buffer.from(logo, "base64") : null;
    try {
        const result = await pool.query(
            "INSERT INTO partidos_pg (nombre, siglas, ideologia, fecha_fundacion, sede, sitio_web, num_militantes, logo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [nombre, siglas, ideologia, fecha_fundacion, sede, sitio_web, num_militantes, logoBinario]
        );
        Logger.registrar("Crear partido " + result.rows[0].id + " (PostgreSQL)"); // AGREGADO: log
        res.status(201).json(serializarImagen(result.rows[0]));
    } catch (err) {
        console.error(err);
        Logger.registrar("Error al crear partido (PostgreSQL): " + err.message); // AGREGADO: log
        res.status(500).json({ error: "Error al crear partido" });
    }
};

// Actualizar un partido
exports.updatePartido = async (req, res) => {
    const { id } = req.params;
    const { nombre, siglas, ideologia, fecha_fundacion, sede, sitio_web, num_militantes, logo } = req.body;
    // AGREGADO: la imagen llega serializada en base64 y se guarda como binario (BYTEA)
    const logoBinario = logo ? Buffer.from(logo, "base64") : null;
    try {
        // AGREGADO: COALESCE conserva el logo actual si no se selecciona uno nuevo
        const result = await pool.query(
            "UPDATE partidos_pg SET nombre = $1, siglas = $2, ideologia = $3, fecha_fundacion = $4, sede = $5, sitio_web = $6, num_militantes = $7, logo = COALESCE($8, logo) WHERE id = $9 RETURNING *",
            [nombre, siglas, ideologia, fecha_fundacion, sede, sitio_web, num_militantes, logoBinario, id]
        );
        if (result.rows.length === 0) {
            Logger.registrar("Partido " + id + " no encontrado (PostgreSQL)"); // AGREGADO: log
            return res.status(404).json({ error: "Partido no encontrado" });
        }
        Logger.registrar("Actualizar partido " + id + " (PostgreSQL)"); // AGREGADO: log
        res.json(serializarImagen(result.rows[0]));
    } catch (err) {
        console.error(err);
        Logger.registrar("Error al actualizar partido (PostgreSQL): " + err.message); // AGREGADO: log
        res.status(500).json({ error: "Error al actualizar partido" });
    }
};

// Eliminar un partido
exports.deletePartido = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM partidos_pg WHERE id = $1 RETURNING *",
            [id]
        );
        if (result.rows.length === 0) {
            Logger.registrar("Partido " + id + " no encontrado (PostgreSQL)"); // AGREGADO: log
            return res.status(404).json({ error: "Partido no encontrado" });
        }
        Logger.registrar("Eliminar partido " + id + " (PostgreSQL)"); // AGREGADO: log
        res.json({ message: "Partido eliminado exitosamente" });
    } catch (err) {
        console.error(err);
        Logger.registrar("Error al eliminar partido (PostgreSQL): " + err.message); // AGREGADO: log
        res.status(500).json({ error: "Error al eliminar partido" });
    }
};
