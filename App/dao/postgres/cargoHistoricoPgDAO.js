/**
 * ==========================================
 * DAO de Cargos Historicos (Parte 2 - PostgreSQL, Semana 4)
 * Tabla relacionada con figuras_pg (FK figura_id)
 *
 * CARGA EAGER: "listarConFigura" trae, en una UNICA consulta SQL
 * con JOIN, el cargo historico junto con los datos de la figura
 * publica relacionada (en vez de una consulta separada por cada
 * cargo, que seria carga "perezosa"/lazy).
 * ==========================================
 */

const pool = require("../../config/postgres");

function filaAObjeto(fila) {

    return {
        id: fila.id,
        figuraId: fila.figura_id,
        cargo: fila.cargo,
        institucion: fila.institucion,
        fechaInicio: fila.fecha_inicio,
        fechaFin: fila.fecha_fin,
        logros: fila.logros,
        motivoSalida: fila.motivo_salida,
        region: fila.region,
        imagenEventoBase64: fila.imagen_evento ? fila.imagen_evento.toString("base64") : null,
        figuraNombre: fila.figura_nombre || null
    };

}

async function listarConFigura() {

    const resultado = await pool.query(
        `SELECT
            c.id, c.figura_id, c.cargo, c.institucion, c.fecha_inicio,
            c.fecha_fin, c.logros, c.motivo_salida, c.region, c.imagen_evento,
            f.nombre_completo AS figura_nombre
         FROM cargos_historicos_pg c
         JOIN figuras_pg f ON f.id = c.figura_id
         ORDER BY c.id`
    );

    return resultado.rows.map(filaAObjeto);

}

async function obtenerPorId(id) {

    const resultado = await pool.query(
        `SELECT
            c.id, c.figura_id, c.cargo, c.institucion, c.fecha_inicio,
            c.fecha_fin, c.logros, c.motivo_salida, c.region, c.imagen_evento,
            f.nombre_completo AS figura_nombre
         FROM cargos_historicos_pg c
         JOIN figuras_pg f ON f.id = c.figura_id
         WHERE c.id = $1`,
        [id]
    );

    if (resultado.rows.length === 0) {

        return null;

    }

    return filaAObjeto(resultado.rows[0]);

}

async function crear(datos) {

    const imagenBuffer = datos.imagenEventoBase64 ? Buffer.from(datos.imagenEventoBase64, "base64") : null;

    const resultado = await pool.query(
        `INSERT INTO cargos_historicos_pg
            (figura_id, cargo, institucion, fecha_inicio, fecha_fin, logros, motivo_salida, region, imagen_evento)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id`,
        [
            datos.figuraId,
            datos.cargo,
            datos.institucion,
            datos.fechaInicio,
            datos.fechaFin || null,
            datos.logros,
            datos.motivoSalida || null,
            datos.region,
            imagenBuffer
        ]
    );

    return obtenerPorId(resultado.rows[0].id);

}

async function actualizar(id, datos) {

    const imagenBuffer = datos.imagenEventoBase64 ? Buffer.from(datos.imagenEventoBase64, "base64") : null;

    const resultado = await pool.query(
        `UPDATE cargos_historicos_pg SET
            figura_id = $1, cargo = $2, institucion = $3, fecha_inicio = $4,
            fecha_fin = $5, logros = $6, motivo_salida = $7, region = $8,
            imagen_evento = COALESCE($9, imagen_evento)
         WHERE id = $10
         RETURNING id`,
        [
            datos.figuraId,
            datos.cargo,
            datos.institucion,
            datos.fechaInicio,
            datos.fechaFin || null,
            datos.logros,
            datos.motivoSalida || null,
            datos.region,
            imagenBuffer,
            id
        ]
    );

    if (resultado.rows.length === 0) {

        return null;

    }

    return obtenerPorId(id);

}

async function eliminar(id) {

    const resultado = await pool.query(
        "DELETE FROM cargos_historicos_pg WHERE id = $1 RETURNING id",
        [id]
    );

    return resultado.rows.length > 0;

}

module.exports = {
    listarConFigura,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
