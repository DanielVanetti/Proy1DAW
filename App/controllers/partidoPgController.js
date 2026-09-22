const pool = require("../db/database");

const Logger = require("../utils/logger");

// La columna "logo" es BYTEA: PostgreSQL la devuelve como binario (Buffer)
// y aquí se convierte a texto base64 para enviarla serializada a la vista.
const serializarImagen = (partido) => ({
    ...partido,
    logo: partido.logo ? partido.logo.toString("base64") : null
});

// Obtener todos los partidos
const obtenerPartidos = async (req, res) => {
    try {
        const resultado = await pool.query(
            "SELECT * FROM partidos_pg ORDER BY id"
        );

        Logger.registrar("Consultar partidos (PostgreSQL)");

        res.json(resultado.rows.map(serializarImagen));

    } catch (error) {
        console.error(error);
        Logger.registrar("Error al obtener partidos (PostgreSQL): " + error.message);
        res.status(500).json({
            mensaje: "Error al obtener los partidos"
        });
    }
};



// Obtener un partido por ID
const obtenerPartidoPorId = async (req, res) => {

    try {

        const { id } = req.params;

        const resultado = await pool.query(
            "SELECT * FROM partidos_pg WHERE id = $1",
            [id]
        );

        if (resultado.rows.length === 0) {

            Logger.registrar("Partido " + id + " no encontrado (PostgreSQL)");

            return res.status(404).json({
                mensaje: "Partido no encontrado"
            });

        }

        Logger.registrar("Consultar partido " + id + " (PostgreSQL)");

        res.json(serializarImagen(resultado.rows[0]));

    } catch (error) {

        console.error(error);

        Logger.registrar("Error al obtener partido (PostgreSQL): " + error.message);

        res.status(500).json({
            mensaje: "Error al obtener el partido"
        });
    }
};


// Crear partido
const crearPartido = async (req, res) => {

    try {

        const { nombre, siglas, ideologia, fecha_fundacion, sede, sitio_web, num_militantes, logo } = req.body;

        // La imagen llega en base64 y se convierte a binario (BYTEA)
        const logoBinario = logo ? Buffer.from(logo, "base64") : null;

        const resultado = await pool.query(
            "INSERT INTO partidos_pg (nombre, siglas, ideologia, fecha_fundacion, sede, sitio_web, num_militantes, logo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [nombre, siglas, ideologia, fecha_fundacion, sede, sitio_web, num_militantes, logoBinario]
        );

        Logger.registrar("Crear partido " + resultado.rows[0].id + " (PostgreSQL)");

        res.status(201).json(serializarImagen(resultado.rows[0]));

    } catch (error) {

        console.error(error);

        Logger.registrar("Error al crear partido (PostgreSQL): " + error.message);

        res.status(500).json({
            mensaje: "Error al crear el partido"
        });
    }
};


// Actualizar partido
const actualizarPartido = async (req, res) => {

    try {

        const { id } = req.params;
        const { nombre, siglas, ideologia, fecha_fundacion, sede, sitio_web, num_militantes, logo } = req.body;

        // La imagen llega en base64 y se convierte a binario (BYTEA)
        const logoBinario = logo ? Buffer.from(logo, "base64") : null;

        // COALESCE conserva el logo actual si no se selecciona uno nuevo
        const resultado = await pool.query(
            "UPDATE partidos_pg SET nombre = $1, siglas = $2, ideologia = $3, fecha_fundacion = $4, sede = $5, sitio_web = $6, num_militantes = $7, logo = COALESCE($8, logo) WHERE id = $9 RETURNING *",
            [nombre, siglas, ideologia, fecha_fundacion, sede, sitio_web, num_militantes, logoBinario, id]
        );

        if (resultado.rows.length === 0) {

            Logger.registrar("Partido " + id + " no encontrado (PostgreSQL)");

            return res.status(404).json({
                mensaje: "Partido no encontrado"
            });

        }

        Logger.registrar("Actualizar partido " + id + " (PostgreSQL)");

        res.json(serializarImagen(resultado.rows[0]));

    } catch (error) {

        console.error(error);

        Logger.registrar("Error al actualizar partido (PostgreSQL): " + error.message);

        res.status(500).json({
            mensaje: "Error al actualizar el partido"
        });
    }
};


// Eliminar partido
const eliminarPartido = async (req, res) => {

    try {

        const { id } = req.params;

        const resultado = await pool.query(
            "DELETE FROM partidos_pg WHERE id = $1 RETURNING *",
            [id]
        );

        if (resultado.rows.length === 0) {

            Logger.registrar("Partido " + id + " no encontrado (PostgreSQL)");

            return res.status(404).json({
                mensaje: "Partido no encontrado"
            });

        }

        Logger.registrar("Eliminar partido " + id + " (PostgreSQL)");

        res.json({
            mensaje: "Partido eliminado correctamente"
        });

    } catch (error) {

        console.error(error);

        Logger.registrar("Error al eliminar partido (PostgreSQL): " + error.message);

        res.status(500).json({
            mensaje: "Error al eliminar el partido"
        });
    }
};


module.exports = {
    obtenerPartidos,
    obtenerPartidoPorId,
    crearPartido,
    actualizarPartido,
    eliminarPartido
};
