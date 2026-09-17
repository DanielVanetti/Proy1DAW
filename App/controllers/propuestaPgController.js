const pool = require("../db/database");

// AGREGADO: logger de acciones (requerimiento del proyecto, no está en S4)
const Logger = require("../utils/logger");

// AGREGADO: serialización de imágenes (requerimiento del proyecto, no está en S4)
// La columna "imagen" es BYTEA: PostgreSQL la devuelve como binario (Buffer)
// y aquí se convierte a texto base64 para enviarla serializada a la vista.
const serializarImagen = (propuesta) => ({
    ...propuesta,
    imagen: propuesta.imagen ? propuesta.imagen.toString("base64") : null
});

// Obtener todas las propuestas
// CARGA EAGER (AGREGADO, no está en S4):
// con UNA sola consulta (INNER JOIN) se traen las propuestas junto con los
// datos del partido al que pertenecen (llave foránea partido_id), en lugar
// de hacer una consulta aparte para buscar el partido de cada propuesta.
exports.getAllPropuestas = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT pr.*, pa.nombre AS partido_nombre, pa.siglas AS partido_siglas FROM propuestas_pg pr INNER JOIN partidos_pg pa ON pa.id = pr.partido_id ORDER BY pr.id"
        );
        Logger.registrar("Consultar propuestas con JOIN a partidos (PostgreSQL)"); // AGREGADO: log
        res.json(result.rows.map(serializarImagen));
    } catch (err) {
        console.error(err);
        Logger.registrar("Error al obtener propuestas (PostgreSQL): " + err.message); // AGREGADO: log
        res.status(500).json({ error: "Error al obtener propuestas" });
    }
};

// Obtener una propuesta por ID
// CARGA EAGER (AGREGADO): la propuesta se trae junto con su partido en la misma consulta
exports.getPropuestaById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "SELECT pr.*, pa.nombre AS partido_nombre, pa.siglas AS partido_siglas FROM propuestas_pg pr INNER JOIN partidos_pg pa ON pa.id = pr.partido_id WHERE pr.id = $1",
            [id]
        );
        if (result.rows.length === 0) {
            Logger.registrar("Propuesta " + id + " no encontrada (PostgreSQL)"); // AGREGADO: log
            return res.status(404).json({ error: "Propuesta no encontrada" });
        }
        Logger.registrar("Consultar propuesta " + id + " (PostgreSQL)"); // AGREGADO: log
        res.json(serializarImagen(result.rows[0]));
    } catch (err) {
        console.error(err);
        Logger.registrar("Error al obtener propuesta (PostgreSQL): " + err.message); // AGREGADO: log
        res.status(500).json({ error: "Error al obtener propuesta" });
    }
};

// Crear una nueva propuesta
exports.createPropuesta = async (req, res) => {
    const { partido_id, titulo, area, descripcion, fecha_presentacion, estado, presupuesto_estimado, alcance, imagen } = req.body;
    // AGREGADO: la imagen llega serializada en base64 y se guarda como binario (BYTEA)
    const imagenBinaria = imagen ? Buffer.from(imagen, "base64") : null;
    try {
        const result = await pool.query(
            "INSERT INTO propuestas_pg (partido_id, titulo, area, descripcion, fecha_presentacion, estado, presupuesto_estimado, alcance, imagen) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
            [partido_id, titulo, area, descripcion, fecha_presentacion, estado, presupuesto_estimado, alcance, imagenBinaria]
        );
        Logger.registrar("Crear propuesta " + result.rows[0].id + " (PostgreSQL)"); // AGREGADO: log
        res.status(201).json(serializarImagen(result.rows[0]));
    } catch (err) {
        console.error(err);
        Logger.registrar("Error al crear propuesta (PostgreSQL): " + err.message); // AGREGADO: log
        res.status(500).json({ error: "Error al crear propuesta" });
    }
};

// Actualizar una propuesta
exports.updatePropuesta = async (req, res) => {
    const { id } = req.params;
    const { partido_id, titulo, area, descripcion, fecha_presentacion, estado, presupuesto_estimado, alcance, imagen } = req.body;
    // AGREGADO: la imagen llega serializada en base64 y se guarda como binario (BYTEA)
    const imagenBinaria = imagen ? Buffer.from(imagen, "base64") : null;
    try {
        // AGREGADO: COALESCE conserva la imagen actual si no se selecciona una nueva
        const result = await pool.query(
            "UPDATE propuestas_pg SET partido_id = $1, titulo = $2, area = $3, descripcion = $4, fecha_presentacion = $5, estado = $6, presupuesto_estimado = $7, alcance = $8, imagen = COALESCE($9, imagen) WHERE id = $10 RETURNING *",
            [partido_id, titulo, area, descripcion, fecha_presentacion, estado, presupuesto_estimado, alcance, imagenBinaria, id]
        );
        if (result.rows.length === 0) {
            Logger.registrar("Propuesta " + id + " no encontrada (PostgreSQL)"); // AGREGADO: log
            return res.status(404).json({ error: "Propuesta no encontrada" });
        }
        Logger.registrar("Actualizar propuesta " + id + " (PostgreSQL)"); // AGREGADO: log
        res.json(serializarImagen(result.rows[0]));
    } catch (err) {
        console.error(err);
        Logger.registrar("Error al actualizar propuesta (PostgreSQL): " + err.message); // AGREGADO: log
        res.status(500).json({ error: "Error al actualizar propuesta" });
    }
};

// Eliminar una propuesta
exports.deletePropuesta = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM propuestas_pg WHERE id = $1 RETURNING *",
            [id]
        );
        if (result.rows.length === 0) {
            Logger.registrar("Propuesta " + id + " no encontrada (PostgreSQL)"); // AGREGADO: log
            return res.status(404).json({ error: "Propuesta no encontrada" });
        }
        Logger.registrar("Eliminar propuesta " + id + " (PostgreSQL)"); // AGREGADO: log
        res.json({ message: "Propuesta eliminada exitosamente" });
    } catch (err) {
        console.error(err);
        Logger.registrar("Error al eliminar propuesta (PostgreSQL): " + err.message); // AGREGADO: log
        res.status(500).json({ error: "Error al eliminar propuesta" });
    }
};
