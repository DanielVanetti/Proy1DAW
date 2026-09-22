const pool = require("../db/database");

// AGREGADO: logger de acciones (requerimiento del proyecto, no está en S4)
const Logger = require("../utils/logger");

// AGREGADO: serialización de imágenes (requerimiento del proyecto, no está en S4)
// La columna "imagen_evento" es BYTEA: PostgreSQL la devuelve como binario (Buffer)
// y aquí se convierte a texto base64 para enviarla serializada a la vista.
const serializarImagen = (cargo) => ({
    ...cargo,
    imagen_evento: cargo.imagen_evento ? cargo.imagen_evento.toString("base64") : null
});

// Obtener todos los cargos históricos
// CARGA EAGER (AGREGADO, no está en S4):
// con UNA sola consulta (INNER JOIN) se traen los cargos históricos junto con
// los datos de la figura pública a la que pertenecen (llave foránea figura_id),
// en lugar de hacer una consulta aparte para buscar la figura de cada cargo.
const obtenerCargos = async (req, res) => {
    try {
        const resultado = await pool.query(
            "SELECT c.*, f.nombre_completo AS figura_nombre, f.cargo_actual AS figura_cargo_actual FROM cargos_historicos_pg c INNER JOIN figuras_pg f ON f.id = c.figura_id ORDER BY c.id"
        );

        Logger.registrar("Consultar cargos históricos con JOIN a figuras (PostgreSQL)"); // AGREGADO: log

        res.json(resultado.rows.map(serializarImagen));

    } catch (error) {
        console.error(error);
        Logger.registrar("Error al obtener cargos históricos (PostgreSQL): " + error.message); // AGREGADO: log
        res.status(500).json({
            mensaje: "Error al obtener los cargos"
        });
    }
};



// Obtener un cargo histórico por ID
// CARGA EAGER (AGREGADO): el cargo se trae junto con su figura en la misma consulta
const obtenerCargoPorId = async (req, res) => {

    try {

        const { id } = req.params;

        const resultado = await pool.query(
            "SELECT c.*, f.nombre_completo AS figura_nombre, f.cargo_actual AS figura_cargo_actual FROM cargos_historicos_pg c INNER JOIN figuras_pg f ON f.id = c.figura_id WHERE c.id = $1",
            [id]
        );

        if (resultado.rows.length === 0) {

            Logger.registrar("Cargo histórico " + id + " no encontrado (PostgreSQL)"); // AGREGADO: log

            return res.status(404).json({
                mensaje: "Cargo no encontrado"
            });

        }

        Logger.registrar("Consultar cargo histórico " + id + " (PostgreSQL)"); // AGREGADO: log

        res.json(serializarImagen(resultado.rows[0]));

    } catch (error) {

        console.error(error);

        Logger.registrar("Error al obtener cargo histórico (PostgreSQL): " + error.message); // AGREGADO: log

        res.status(500).json({
            mensaje: "Error al obtener el cargo"
        });
    }
};


// Crear cargo histórico
const crearCargo = async (req, res) => {

    try {

        const { figura_id, cargo, institucion, fecha_inicio, fecha_fin, logros, motivo_salida, region, imagen_evento } = req.body;

        // AGREGADO: la imagen llega serializada en base64 y se guarda como binario (BYTEA)
        const imagenBinaria = imagen_evento ? Buffer.from(imagen_evento, "base64") : null;

        // AGREGADO: fecha_fin puede quedar vacía (cargo que aún se ejerce)
        const resultado = await pool.query(
            "INSERT INTO cargos_historicos_pg (figura_id, cargo, institucion, fecha_inicio, fecha_fin, logros, motivo_salida, region, imagen_evento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
            [figura_id, cargo, institucion, fecha_inicio, fecha_fin || null, logros, motivo_salida, region, imagenBinaria]
        );

        Logger.registrar("Crear cargo histórico " + resultado.rows[0].id + " (PostgreSQL)"); // AGREGADO: log

        res.status(201).json(serializarImagen(resultado.rows[0]));

    } catch (error) {

        console.error(error);

        Logger.registrar("Error al crear cargo histórico (PostgreSQL): " + error.message); // AGREGADO: log

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

        // AGREGADO: la imagen llega serializada en base64 y se guarda como binario (BYTEA)
        const imagenBinaria = imagen_evento ? Buffer.from(imagen_evento, "base64") : null;

        // AGREGADO: COALESCE conserva la imagen actual si no se selecciona una nueva
        const resultado = await pool.query(
            "UPDATE cargos_historicos_pg SET figura_id = $1, cargo = $2, institucion = $3, fecha_inicio = $4, fecha_fin = $5, logros = $6, motivo_salida = $7, region = $8, imagen_evento = COALESCE($9, imagen_evento) WHERE id = $10 RETURNING *",
            [figura_id, cargo, institucion, fecha_inicio, fecha_fin || null, logros, motivo_salida, region, imagenBinaria, id]
        );

        if (resultado.rows.length === 0) {

            Logger.registrar("Cargo histórico " + id + " no encontrado (PostgreSQL)"); // AGREGADO: log

            return res.status(404).json({
                mensaje: "Cargo no encontrado"
            });

        }

        Logger.registrar("Actualizar cargo histórico " + id + " (PostgreSQL)"); // AGREGADO: log

        res.json(serializarImagen(resultado.rows[0]));

    } catch (error) {

        console.error(error);

        Logger.registrar("Error al actualizar cargo histórico (PostgreSQL): " + error.message); // AGREGADO: log

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

            Logger.registrar("Cargo histórico " + id + " no encontrado (PostgreSQL)"); // AGREGADO: log

            return res.status(404).json({
                mensaje: "Cargo no encontrado"
            });

        }

        Logger.registrar("Eliminar cargo histórico " + id + " (PostgreSQL)"); // AGREGADO: log

        res.json({
            mensaje: "Cargo eliminado correctamente"
        });

    } catch (error) {

        console.error(error);

        Logger.registrar("Error al eliminar cargo histórico (PostgreSQL): " + error.message); // AGREGADO: log

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
