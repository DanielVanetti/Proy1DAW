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
const obtenerFiguras = async (req, res) => {
    try {
        const resultado = await pool.query(
            "SELECT * FROM figuras_pg ORDER BY id"
        );

        Logger.registrar("Consultar figuras públicas (PostgreSQL)"); // AGREGADO: log

        res.json(resultado.rows.map(serializarImagen));

    } catch (error) {
        console.error(error);
        Logger.registrar("Error al obtener figuras públicas (PostgreSQL): " + error.message); // AGREGADO: log
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

            Logger.registrar("Figura pública " + id + " no encontrada (PostgreSQL)"); // AGREGADO: log

            return res.status(404).json({
                mensaje: "Figura no encontrada"
            });

        }

        Logger.registrar("Consultar figura pública " + id + " (PostgreSQL)"); // AGREGADO: log

        res.json(serializarImagen(resultado.rows[0]));

    } catch (error) {

        console.error(error);

        Logger.registrar("Error al obtener figura pública (PostgreSQL): " + error.message); // AGREGADO: log

        res.status(500).json({
            mensaje: "Error al obtener la figura"
        });
    }
};


// Crear figura
const crearFigura = async (req, res) => {

    try {

        const { nombre_completo, cargo_actual, fecha_nacimiento, nacionalidad, nivel_educativo, anios_experiencia, biografia, foto } = req.body;

        // AGREGADO: la imagen llega serializada en base64 y se guarda como binario (BYTEA)
        const fotoBinaria = foto ? Buffer.from(foto, "base64") : null;

        const resultado = await pool.query(
            "INSERT INTO figuras_pg (nombre_completo, cargo_actual, fecha_nacimiento, nacionalidad, nivel_educativo, anios_experiencia, biografia, foto) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [nombre_completo, cargo_actual, fecha_nacimiento, nacionalidad, nivel_educativo, anios_experiencia, biografia, fotoBinaria]
        );

        Logger.registrar("Crear figura pública " + resultado.rows[0].id + " (PostgreSQL)"); // AGREGADO: log

        res.status(201).json(serializarImagen(resultado.rows[0]));

    } catch (error) {

        console.error(error);

        Logger.registrar("Error al crear figura pública (PostgreSQL): " + error.message); // AGREGADO: log

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

        // AGREGADO: la imagen llega serializada en base64 y se guarda como binario (BYTEA)
        const fotoBinaria = foto ? Buffer.from(foto, "base64") : null;

        // AGREGADO: COALESCE conserva la foto actual si no se selecciona una nueva
        const resultado = await pool.query(
            "UPDATE figuras_pg SET nombre_completo = $1, cargo_actual = $2, fecha_nacimiento = $3, nacionalidad = $4, nivel_educativo = $5, anios_experiencia = $6, biografia = $7, foto = COALESCE($8, foto) WHERE id = $9 RETURNING *",
            [nombre_completo, cargo_actual, fecha_nacimiento, nacionalidad, nivel_educativo, anios_experiencia, biografia, fotoBinaria, id]
        );

        if (resultado.rows.length === 0) {

            Logger.registrar("Figura pública " + id + " no encontrada (PostgreSQL)"); // AGREGADO: log

            return res.status(404).json({
                mensaje: "Figura no encontrada"
            });

        }

        Logger.registrar("Actualizar figura pública " + id + " (PostgreSQL)"); // AGREGADO: log

        res.json(serializarImagen(resultado.rows[0]));

    } catch (error) {

        console.error(error);

        Logger.registrar("Error al actualizar figura pública (PostgreSQL): " + error.message); // AGREGADO: log

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

            Logger.registrar("Figura pública " + id + " no encontrada (PostgreSQL)"); // AGREGADO: log

            return res.status(404).json({
                mensaje: "Figura no encontrada"
            });

        }

        Logger.registrar("Eliminar figura pública " + id + " (PostgreSQL)"); // AGREGADO: log

        res.json({
            mensaje: "Figura eliminada correctamente"
        });

    } catch (error) {

        console.error(error);

        Logger.registrar("Error al eliminar figura pública (PostgreSQL): " + error.message); // AGREGADO: log

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
