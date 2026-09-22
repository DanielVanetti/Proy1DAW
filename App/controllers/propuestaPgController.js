const pool = require("../db/database");

const Logger = require("../utils/logger");

// La columna "imagen" es BYTEA: PostgreSQL la devuelve como binario (Buffer)
// y aquí se convierte a texto base64 para enviarla serializada a la vista.
const serializarImagen = (propuesta) => ({
    ...propuesta,
    imagen: propuesta.imagen ? propuesta.imagen.toString("base64") : null
});

// Obtener todas las propuestas
// CARGA EAGER: una sola consulta con INNER JOIN trae las propuestas junto
// con los datos del partido al que pertenecen (llave foránea partido_id),
// en lugar de hacer una consulta aparte para buscar el partido de cada una.
const obtenerPropuestas = async (req, res) => {
    try {
        const resultado = await pool.query(
            "SELECT pr.*, pa.nombre AS partido_nombre, pa.siglas AS partido_siglas FROM propuestas_pg pr INNER JOIN partidos_pg pa ON pa.id = pr.partido_id ORDER BY pr.id"
        );

        Logger.registrar("Consultar propuestas con JOIN a partidos (PostgreSQL)");

        res.json(resultado.rows.map(serializarImagen));

    } catch (error) {
        console.error(error);
        Logger.registrar("Error al obtener propuestas (PostgreSQL): " + error.message);
        res.status(500).json({
            mensaje: "Error al obtener las propuestas"
        });
    }
};



// Obtener una propuesta por ID
// CARGA EAGER: la propuesta se trae junto con su partido en la misma consulta
const obtenerPropuestaPorId = async (req, res) => {

    try {

        const { id } = req.params;

        const resultado = await pool.query(
            "SELECT pr.*, pa.nombre AS partido_nombre, pa.siglas AS partido_siglas FROM propuestas_pg pr INNER JOIN partidos_pg pa ON pa.id = pr.partido_id WHERE pr.id = $1",
            [id]
        );

        if (resultado.rows.length === 0) {

            Logger.registrar("Propuesta " + id + " no encontrada (PostgreSQL)");

            return res.status(404).json({
                mensaje: "Propuesta no encontrada"
            });

        }

        Logger.registrar("Consultar propuesta " + id + " (PostgreSQL)");

        res.json(serializarImagen(resultado.rows[0]));

    } catch (error) {

        console.error(error);

        Logger.registrar("Error al obtener propuesta (PostgreSQL): " + error.message);

        res.status(500).json({
            mensaje: "Error al obtener la propuesta"
        });
    }
};


// Crear propuesta
const crearPropuesta = async (req, res) => {

    try {

        const { partido_id, titulo, area, descripcion, fecha_presentacion, estado, presupuesto_estimado, alcance, imagen } = req.body;

        // La imagen llega en base64 y se convierte a binario (BYTEA)
        const imagenBinaria = imagen ? Buffer.from(imagen, "base64") : null;

        const resultado = await pool.query(
            "INSERT INTO propuestas_pg (partido_id, titulo, area, descripcion, fecha_presentacion, estado, presupuesto_estimado, alcance, imagen) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
            [partido_id, titulo, area, descripcion, fecha_presentacion, estado, presupuesto_estimado, alcance, imagenBinaria]
        );

        Logger.registrar("Crear propuesta " + resultado.rows[0].id + " (PostgreSQL)");

        res.status(201).json(serializarImagen(resultado.rows[0]));

    } catch (error) {

        console.error(error);

        Logger.registrar("Error al crear propuesta (PostgreSQL): " + error.message);

        res.status(500).json({
            mensaje: "Error al crear la propuesta"
        });
    }
};


// Actualizar propuesta
const actualizarPropuesta = async (req, res) => {

    try {

        const { id } = req.params;
        const { partido_id, titulo, area, descripcion, fecha_presentacion, estado, presupuesto_estimado, alcance, imagen } = req.body;

        // La imagen llega en base64 y se convierte a binario (BYTEA)
        const imagenBinaria = imagen ? Buffer.from(imagen, "base64") : null;

        // COALESCE conserva la imagen actual si no se selecciona una nueva
        const resultado = await pool.query(
            "UPDATE propuestas_pg SET partido_id = $1, titulo = $2, area = $3, descripcion = $4, fecha_presentacion = $5, estado = $6, presupuesto_estimado = $7, alcance = $8, imagen = COALESCE($9, imagen) WHERE id = $10 RETURNING *",
            [partido_id, titulo, area, descripcion, fecha_presentacion, estado, presupuesto_estimado, alcance, imagenBinaria, id]
        );

        if (resultado.rows.length === 0) {

            Logger.registrar("Propuesta " + id + " no encontrada (PostgreSQL)");

            return res.status(404).json({
                mensaje: "Propuesta no encontrada"
            });

        }

        Logger.registrar("Actualizar propuesta " + id + " (PostgreSQL)");

        res.json(serializarImagen(resultado.rows[0]));

    } catch (error) {

        console.error(error);

        Logger.registrar("Error al actualizar propuesta (PostgreSQL): " + error.message);

        res.status(500).json({
            mensaje: "Error al actualizar la propuesta"
        });
    }
};


// Eliminar propuesta
const eliminarPropuesta = async (req, res) => {

    try {

        const { id } = req.params;

        const resultado = await pool.query(
            "DELETE FROM propuestas_pg WHERE id = $1 RETURNING *",
            [id]
        );

        if (resultado.rows.length === 0) {

            Logger.registrar("Propuesta " + id + " no encontrada (PostgreSQL)");

            return res.status(404).json({
                mensaje: "Propuesta no encontrada"
            });

        }

        Logger.registrar("Eliminar propuesta " + id + " (PostgreSQL)");

        res.json({
            mensaje: "Propuesta eliminada correctamente"
        });

    } catch (error) {

        console.error(error);

        Logger.registrar("Error al eliminar propuesta (PostgreSQL): " + error.message);

        res.status(500).json({
            mensaje: "Error al eliminar la propuesta"
        });
    }
};


module.exports = {
    obtenerPropuestas,
    obtenerPropuestaPorId,
    crearPropuesta,
    actualizarPropuesta,
    eliminarPropuesta
};
