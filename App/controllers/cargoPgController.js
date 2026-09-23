const pool = require("../db/database");

const Logger = require("../utils/logger");

// "imagen_evento" es BYTEA (Buffer); se convierte a base64 para enviarla a la vista.
const serializarImagen = (cargo) => {

    let imagenEvento = null;

    if (cargo.imagen_evento) {
        imagenEvento = cargo.imagen_evento.toString("base64");
    }

    return {
        ...cargo,
        imagen_evento: imagenEvento
    };
};

// Obtener todos los cargos históricos
// CARGA EAGER: INNER JOIN trae cada cargo junto con su figura
const obtenerCargos = async (req, res) => {
    try {
        const resultado = await pool.query(
            "SELECT c.*, f.nombre_completo AS figura_nombre, f.cargo_actual AS figura_cargo_actual FROM cargos_historicos_pg c INNER JOIN figuras_pg f ON f.id = c.figura_id ORDER BY c.id"
        );

        Logger.registrar("Consultar cargos históricos con JOIN a figuras (PostgreSQL)");

        res.json(resultado.rows.map(serializarImagen));

    } catch (error) {
        console.error(error);
        Logger.registrar("Error al obtener cargos históricos (PostgreSQL): " + error.message);
        res.status(500).json({
            mensaje: "Error al obtener los cargos"
        });
    }
};



// Obtener un cargo histórico por ID
// CARGA EAGER: trae el cargo junto con su figura
const obtenerCargoPorId = async (req, res) => {

    try {

        const { id } = req.params;

        const resultado = await pool.query(
            "SELECT c.*, f.nombre_completo AS figura_nombre, f.cargo_actual AS figura_cargo_actual FROM cargos_historicos_pg c INNER JOIN figuras_pg f ON f.id = c.figura_id WHERE c.id = $1",
            [id]
        );

        if (resultado.rows.length === 0) {

            Logger.registrar("Cargo histórico " + id + " no encontrado (PostgreSQL)");

            return res.status(404).json({
                mensaje: "Cargo no encontrado"
            });

        }

        Logger.registrar("Consultar cargo histórico " + id + " (PostgreSQL)");

        res.json(serializarImagen(resultado.rows[0]));

    } catch (error) {

        console.error(error);

        Logger.registrar("Error al obtener cargo histórico (PostgreSQL): " + error.message);

        res.status(500).json({
            mensaje: "Error al obtener el cargo"
        });
    }
};


// Crear cargo histórico
const crearCargo = async (req, res) => {

    try {

        const { figura_id, cargo, institucion, fecha_inicio, fecha_fin, logros, motivo_salida, region, imagen_evento } = req.body;

        // La imagen llega en base64 y se convierte a binario (BYTEA)
        let imagenBinaria = null;

        if (imagen_evento) {
            imagenBinaria = Buffer.from(imagen_evento, "base64");
        }

        // fecha_fin puede quedar vacía (cargo que aún se ejerce)
        const resultado = await pool.query(
            "INSERT INTO cargos_historicos_pg (figura_id, cargo, institucion, fecha_inicio, fecha_fin, logros, motivo_salida, region, imagen_evento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
            [figura_id, cargo, institucion, fecha_inicio, fecha_fin || null, logros, motivo_salida, region, imagenBinaria]
        );

        Logger.registrar("Crear cargo histórico " + resultado.rows[0].id + " (PostgreSQL)");

        res.status(201).json(serializarImagen(resultado.rows[0]));

    } catch (error) {

        console.error(error);

        Logger.registrar("Error al crear cargo histórico (PostgreSQL): " + error.message);

        res.status(500).json({
            mensaje: "Error al crear el cargo"
        });
    }
};


// Actualizar cargo histórico
const actualizarCargo = async (req, res) => {

    try {

        const { id } = req.params;
        const { figura_id, cargo, institucion, fecha_inicio, fecha_fin, logros, motivo_salida, region, imagen_evento } = req.body;

        let imagenBinaria = null;

        if (imagen_evento) {
            imagenBinaria = Buffer.from(imagen_evento, "base64");
        }

        // Imagen en base64 -> binario; COALESCE conserva la actual si no se sube una nueva
        const resultado = await pool.query(
            "UPDATE cargos_historicos_pg SET figura_id = $1, cargo = $2, institucion = $3, fecha_inicio = $4, fecha_fin = $5, logros = $6, motivo_salida = $7, region = $8, imagen_evento = COALESCE($9, imagen_evento) WHERE id = $10 RETURNING *",
            [figura_id, cargo, institucion, fecha_inicio, fecha_fin || null, logros, motivo_salida, region, imagenBinaria, id]
        );

        if (resultado.rows.length === 0) {

            Logger.registrar("Cargo histórico " + id + " no encontrado (PostgreSQL)");

            return res.status(404).json({
                mensaje: "Cargo no encontrado"
            });

        }

        Logger.registrar("Actualizar cargo histórico " + id + " (PostgreSQL)");

        res.json(serializarImagen(resultado.rows[0]));

    } catch (error) {

        console.error(error);

        Logger.registrar("Error al actualizar cargo histórico (PostgreSQL): " + error.message);

        res.status(500).json({
            mensaje: "Error al actualizar el cargo"
        });
    }
};


// Eliminar cargo histórico
const eliminarCargo = async (req, res) => {

    try {

        const { id } = req.params;

        const resultado = await pool.query(
            "DELETE FROM cargos_historicos_pg WHERE id = $1 RETURNING *",
            [id]
        );

        if (resultado.rows.length === 0) {

            Logger.registrar("Cargo histórico " + id + " no encontrado (PostgreSQL)");

            return res.status(404).json({
                mensaje: "Cargo no encontrado"
            });

        }

        Logger.registrar("Eliminar cargo histórico " + id + " (PostgreSQL)");

        res.json({
            mensaje: "Cargo eliminado correctamente"
        });

    } catch (error) {

        console.error(error);

        Logger.registrar("Error al eliminar cargo histórico (PostgreSQL): " + error.message);

        res.status(500).json({
            mensaje: "Error al eliminar el cargo"
        });
    }
};


module.exports = {
    obtenerCargos,
    obtenerCargoPorId,
    crearCargo,
    actualizarCargo,
    eliminarCargo
};
