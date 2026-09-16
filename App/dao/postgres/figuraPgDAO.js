/**
 * ==========================================
 * DAO de Figuras Publicas (Parte 2 - PostgreSQL, Semana 4)
 * SQL parametrizado directo con pg.Pool, sin ORM (mismo patron de S4-SW)
 * ==========================================
 */

const pool = require("../../config/postgres");

function filaAObjeto(fila) {

    return {
        id: fila.id,
        nombreCompleto: fila.nombre_completo,
        cargoActual: fila.cargo_actual,
        fechaNacimiento: fila.fecha_nacimiento,
        nacionalidad: fila.nacionalidad,
        nivelEducativo: fila.nivel_educativo,
        aniosExperiencia: fila.anios_experiencia,
        biografia: fila.biografia,
        fotoBase64: fila.foto ? fila.foto.toString("base64") : null
    };

}

async function listar() {

    const resultado = await pool.query(
        "SELECT id, nombre_completo, cargo_actual, fecha_nacimiento, nacionalidad, nivel_educativo, anios_experiencia, biografia, foto FROM figuras_pg ORDER BY id"
    );

    return resultado.rows.map(filaAObjeto);

}

async function obtenerPorId(id) {

    const resultado = await pool.query(
        "SELECT id, nombre_completo, cargo_actual, fecha_nacimiento, nacionalidad, nivel_educativo, anios_experiencia, biografia, foto FROM figuras_pg WHERE id = $1",
        [id]
    );

    if (resultado.rows.length === 0) {

        return null;

    }

    return filaAObjeto(resultado.rows[0]);

}

async function crear(datos) {

    const fotoBuffer = datos.fotoBase64 ? Buffer.from(datos.fotoBase64, "base64") : null;

    const resultado = await pool.query(
        `INSERT INTO figuras_pg
            (nombre_completo, cargo_actual, fecha_nacimiento, nacionalidad, nivel_educativo, anios_experiencia, biografia, foto)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [
            datos.nombreCompleto,
            datos.cargoActual,
            datos.fechaNacimiento,
            datos.nacionalidad,
            datos.nivelEducativo,
            datos.aniosExperiencia,
            datos.biografia,
            fotoBuffer
        ]
    );

    return obtenerPorId(resultado.rows[0].id);

}

async function actualizar(id, datos) {

    const fotoBuffer = datos.fotoBase64 ? Buffer.from(datos.fotoBase64, "base64") : null;

    const resultado = await pool.query(
        `UPDATE figuras_pg SET
            nombre_completo = $1, cargo_actual = $2, fecha_nacimiento = $3,
            nacionalidad = $4, nivel_educativo = $5, anios_experiencia = $6,
            biografia = $7, foto = COALESCE($8, foto)
         WHERE id = $9
         RETURNING id`,
        [
            datos.nombreCompleto,
            datos.cargoActual,
            datos.fechaNacimiento,
            datos.nacionalidad,
            datos.nivelEducativo,
            datos.aniosExperiencia,
            datos.biografia,
            fotoBuffer,
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
        "DELETE FROM figuras_pg WHERE id = $1 RETURNING id",
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
