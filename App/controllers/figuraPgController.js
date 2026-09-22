const pool = require("../db/database");

const Logger = require("../utils/logger");

// La columna "foto" es BYTEA: PostgreSQL la devuelve como binario (Buffer)
// y aquí se convierte a texto base64 para enviarla serializada a la vista.
const serializarImagen = (figura) => {

    let foto = null;

    if (figura.foto) {
        foto = figura.foto.toString("base64");
    }

    return {
        ...figura,
        foto: foto
    };
};

// Obtener todas las figuras
const obtenerFiguras = async (req, res) => {
    try {
        const resultado = await pool.query(
            "SELECT * FROM figuras_pg ORDER BY id"
        );

        Logger.registrar("Consultar figuras públicas (PostgreSQL)");

        res.json(resultado.rows.map(serializarImagen));

    } catch (error) {
        console.error(error);
        Logger.registrar("Error al obtener figuras públicas (PostgreSQL): " + error.message);
        res.status(500).json({
            mensaje: "Error al obtener las figuras"
        });
    }
};



// Obtener una figura por ID
const obtenerFiguraPorId = async (req, res) => {

    try {

        const { id } = req.params;

        const resultado = await pool.query(
            "SELECT * FROM figuras_pg WHERE id = $1",
            [id]
        );

        if (resultado.rows.length === 0) {

            Logger.registrar("Figura pública " + id + " no encontrada (PostgreSQL)");

            return res.status(404).json({
                mensaje: "Figura no encontrada"
            });

        }

        Logger.registrar("Consultar figura pública " + id + " (PostgreSQL)");

        res.json(serializarImagen(resultado.rows[0]));

    } catch (error) {

        console.error(error);

        Logger.registrar("Error al obtener figura pública (PostgreSQL): " + error.message);

        res.status(500).json({
            mensaje: "Error al obtener la figura"
        });
    }
};


// Crear figura
const crearFigura = async (req, res) => {

    try {

        const { nombre_completo, cargo_actual, fecha_nacimiento, nacionalidad, nivel_educativo, anios_experiencia, biografia, foto } = req.body;

        // La imagen llega en base64 y se convierte a binario (BYTEA)
        let fotoBinaria = null;

        if (foto) {
            fotoBinaria = Buffer.from(foto, "base64");
        }

        const resultado = await pool.query(
            "INSERT INTO figuras_pg (nombre_completo, cargo_actual, fecha_nacimiento, nacionalidad, nivel_educativo, anios_experiencia, biografia, foto) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [nombre_completo, cargo_actual, fecha_nacimiento, nacionalidad, nivel_educativo, anios_experiencia, biografia, fotoBinaria]
        );

        Logger.registrar("Crear figura pública " + resultado.rows[0].id + " (PostgreSQL)");

        res.status(201).json(serializarImagen(resultado.rows[0]));

    } catch (error) {

        console.error(error);

        Logger.registrar("Error al crear figura pública (PostgreSQL): " + error.message);

        res.status(500).json({
            mensaje: "Error al crear la figura"
        });
    }
};


// Actualizar figura
const actualizarFigura = async (req, res) => {

    try {

        const { id } = req.params;
        const { nombre_completo, cargo_actual, fecha_nacimiento, nacionalidad, nivel_educativo, anios_experiencia, biografia, foto } = req.body;

        // La imagen llega en base64 y se convierte a binario (BYTEA)
        let fotoBinaria = null;

        if (foto) {
            fotoBinaria = Buffer.from(foto, "base64");
        }

        // COALESCE conserva la foto actual si no se selecciona una nueva
        const resultado = await pool.query(
            "UPDATE figuras_pg SET nombre_completo = $1, cargo_actual = $2, fecha_nacimiento = $3, nacionalidad = $4, nivel_educativo = $5, anios_experiencia = $6, biografia = $7, foto = COALESCE($8, foto) WHERE id = $9 RETURNING *",
            [nombre_completo, cargo_actual, fecha_nacimiento, nacionalidad, nivel_educativo, anios_experiencia, biografia, fotoBinaria, id]
        );

        if (resultado.rows.length === 0) {

            Logger.registrar("Figura pública " + id + " no encontrada (PostgreSQL)");

            return res.status(404).json({
                mensaje: "Figura no encontrada"
            });

        }

        Logger.registrar("Actualizar figura pública " + id + " (PostgreSQL)");

        res.json(serializarImagen(resultado.rows[0]));

    } catch (error) {

        console.error(error);

        Logger.registrar("Error al actualizar figura pública (PostgreSQL): " + error.message);

        res.status(500).json({
            mensaje: "Error al actualizar la figura"
        });
    }
};


// Eliminar figura
const eliminarFigura = async (req, res) => {

    try {

        const { id } = req.params;

        const resultado = await pool.query(
            "DELETE FROM figuras_pg WHERE id = $1 RETURNING *",
            [id]
        );

        if (resultado.rows.length === 0) {

            Logger.registrar("Figura pública " + id + " no encontrada (PostgreSQL)");

            return res.status(404).json({
                mensaje: "Figura no encontrada"
            });

        }

        Logger.registrar("Eliminar figura pública " + id + " (PostgreSQL)");

        res.json({
            mensaje: "Figura eliminada correctamente"
        });

    } catch (error) {

        console.error(error);

        Logger.registrar("Error al eliminar figura pública (PostgreSQL): " + error.message);

        res.status(500).json({
            mensaje: "Error al eliminar la figura"
        });
    }
};


module.exports = {
    obtenerFiguras,
    obtenerFiguraPorId,
    crearFigura,
    actualizarFigura,
    eliminarFigura
};
