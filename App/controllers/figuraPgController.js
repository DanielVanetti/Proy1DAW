const pool = require("../db/database");

// AGREGADO: logger de acciones (requerimiento del proyecto, no está en S4)
const Logger = require("../utils/logger");

// AGREGADO: serialización de imágenes (requerimiento del proyecto, no está en S4)
// La columna "foto" es BYTEA: PostgreSQL la devuelve como binario (Buffer)
// y aquí se convierte a texto base64 para enviarla serializada a la vista.
const serializarImagen = (figura) => ({
    ...figura,
    foto: figura.foto ? figura.foto.toString("base64") : null
});

// Obtener todas las figuras
exports.getAllFiguras = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM figuras_pg ORDER BY id");
        Logger.registrar("Consultar figuras públicas (PostgreSQL)"); // AGREGADO: log
        res.json(result.rows.map(serializarImagen));
    } catch (err) {
        console.error(err);
        Logger.registrar("Error al obtener figuras públicas (PostgreSQL): " + err.message); // AGREGADO: log
        res.status(500).json({ error: "Error al obtener figuras" });
    }
};

// Obtener una figura por ID
exports.getFiguraById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM figuras_pg WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            Logger.registrar("Figura pública " + id + " no encontrada (PostgreSQL)"); // AGREGADO: log
            return res.status(404).json({ error: "Figura no encontrada" });
        }
        Logger.registrar("Consultar figura pública " + id + " (PostgreSQL)"); // AGREGADO: log
        res.json(serializarImagen(result.rows[0]));
    } catch (err) {
        console.error(err);
        Logger.registrar("Error al obtener figura pública (PostgreSQL): " + err.message); // AGREGADO: log
        res.status(500).json({ error: "Error al obtener figura" });
    }
};

// Crear una nueva figura
exports.createFigura = async (req, res) => {
    const { nombre_completo, cargo_actual, fecha_nacimiento, nacionalidad, nivel_educativo, anios_experiencia, biografia, foto } = req.body;
    // AGREGADO: la imagen llega serializada en base64 y se guarda como binario (BYTEA)
    const fotoBinaria = foto ? Buffer.from(foto, "base64") : null;
    try {
        const result = await pool.query(
            "INSERT INTO figuras_pg (nombre_completo, cargo_actual, fecha_nacimiento, nacionalidad, nivel_educativo, anios_experiencia, biografia, foto) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [nombre_completo, cargo_actual, fecha_nacimiento, nacionalidad, nivel_educativo, anios_experiencia, biografia, fotoBinaria]
        );
        Logger.registrar("Crear figura pública " + result.rows[0].id + " (PostgreSQL)"); // AGREGADO: log
        res.status(201).json(serializarImagen(result.rows[0]));
    } catch (err) {
        console.error(err);
        Logger.registrar("Error al crear figura pública (PostgreSQL): " + err.message); // AGREGADO: log
        res.status(500).json({ error: "Error al crear figura" });
    }
};

// Actualizar una figura
exports.updateFigura = async (req, res) => {
    const { id } = req.params;
    const { nombre_completo, cargo_actual, fecha_nacimiento, nacionalidad, nivel_educativo, anios_experiencia, biografia, foto } = req.body;
    // AGREGADO: la imagen llega serializada en base64 y se guarda como binario (BYTEA)
    const fotoBinaria = foto ? Buffer.from(foto, "base64") : null;
    try {
        // AGREGADO: COALESCE conserva la foto actual si no se selecciona una nueva
        const result = await pool.query(
            "UPDATE figuras_pg SET nombre_completo = $1, cargo_actual = $2, fecha_nacimiento = $3, nacionalidad = $4, nivel_educativo = $5, anios_experiencia = $6, biografia = $7, foto = COALESCE($8, foto) WHERE id = $9 RETURNING *",
            [nombre_completo, cargo_actual, fecha_nacimiento, nacionalidad, nivel_educativo, anios_experiencia, biografia, fotoBinaria, id]
        );
        if (result.rows.length === 0) {
            Logger.registrar("Figura pública " + id + " no encontrada (PostgreSQL)"); // AGREGADO: log
            return res.status(404).json({ error: "Figura no encontrada" });
        }
        Logger.registrar("Actualizar figura pública " + id + " (PostgreSQL)"); // AGREGADO: log
        res.json(serializarImagen(result.rows[0]));
    } catch (err) {
        console.error(err);
        Logger.registrar("Error al actualizar figura pública (PostgreSQL): " + err.message); // AGREGADO: log
        res.status(500).json({ error: "Error al actualizar figura" });
    }
};

// Eliminar una figura
exports.deleteFigura = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM figuras_pg WHERE id = $1 RETURNING *",
            [id]
        );
        if (result.rows.length === 0) {
            Logger.registrar("Figura pública " + id + " no encontrada (PostgreSQL)"); // AGREGADO: log
            return res.status(404).json({ error: "Figura no encontrada" });
        }
        Logger.registrar("Eliminar figura pública " + id + " (PostgreSQL)"); // AGREGADO: log
        res.json({ message: "Figura eliminada exitosamente" });
    } catch (err) {
        console.error(err);
        Logger.registrar("Error al eliminar figura pública (PostgreSQL): " + err.message); // AGREGADO: log
        res.status(500).json({ error: "Error al eliminar figura" });
    }
};
