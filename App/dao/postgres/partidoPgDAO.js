/**
 * ==========================================
 * DAO de Partidos (Parte 2 - PostgreSQL, Semana 4)
 * SQL parametrizado directo con pg.Pool, sin ORM (mismo patron de S4-SW)
 * ==========================================
 */

const pool = require("../../config/postgres");

function filaAObjeto(fila) {

    return {
        id: fila.id,
        nombre: fila.nombre,
        siglas: fila.siglas,
        ideologia: fila.ideologia,
        fechaFundacion: fila.fecha_fundacion,
        sede: fila.sede,
        sitioWeb: fila.sitio_web,
        numMilitantes: fila.num_militantes,
        logoBase64: fila.logo ? fila.logo.toString("base64") : null
    };

}

async function listar() {

    const resultado = await pool.query(
        "SELECT id, nombre, siglas, ideologia, fecha_fundacion, sede, sitio_web, num_militantes, logo FROM partidos_pg ORDER BY id"
    );

    return resultado.rows.map(filaAObjeto);

}

async function obtenerPorId(id) {

    const resultado = await pool.query(
        "SELECT id, nombre, siglas, ideologia, fecha_fundacion, sede, sitio_web, num_militantes, logo FROM partidos_pg WHERE id = $1",
        [id]
    );

    if (resultado.rows.length === 0) {

        return null;

    }

    return filaAObjeto(resultado.rows[0]);

}

async function crear(datos) {

    const logoBuffer = datos.logoBase64 ? Buffer.from(datos.logoBase64, "base64") : null;

    const resultado = await pool.query(
        `INSERT INTO partidos_pg
            (nombre, siglas, ideologia, fecha_fundacion, sede, sitio_web, num_militantes, logo)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [
            datos.nombre,
            datos.siglas,
            datos.ideologia,
            datos.fechaFundacion,
            datos.sede,
            datos.sitioWeb,
            datos.numMilitantes,
            logoBuffer
        ]
    );

    return obtenerPorId(resultado.rows[0].id);

}

async function actualizar(id, datos) {

    const logoBuffer = datos.logoBase64 ? Buffer.from(datos.logoBase64, "base64") : null;

    const resultado = await pool.query(
        `UPDATE partidos_pg SET
            nombre = $1, siglas = $2, ideologia = $3, fecha_fundacion = $4,
            sede = $5, sitio_web = $6, num_militantes = $7,
            logo = COALESCE($8, logo)
         WHERE id = $9
         RETURNING id`,
        [
            datos.nombre,
            datos.siglas,
            datos.ideologia,
            datos.fechaFundacion,
            datos.sede,
            datos.sitioWeb,
            datos.numMilitantes,
            logoBuffer,
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
        "DELETE FROM partidos_pg WHERE id = $1 RETURNING id",
        [id]
    );

    return resultado.rows.length > 0;

}

module.exports = {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
