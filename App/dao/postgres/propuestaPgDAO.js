/**
 * ==========================================
 * DAO de Propuestas (Parte 2 - PostgreSQL, Semana 4)
 * Tabla relacionada con partidos_pg (FK partido_id)
 *
 * CARGA EAGER: "listarConPartido" trae, en una UNICA consulta SQL
 * con JOIN, la propuesta junto con los datos del partido relacionado
 * (en vez de hacer una consulta separada por cada propuesta, que
 * seria carga "perezosa"/lazy). Esa es la tecnica de Eager Loading
 * usada aqui, ya que en Semana 4 no se usa ORM.
 * ==========================================
 */

const pool = require("../../config/postgres");

function filaAObjeto(fila) {

    return {
        id: fila.id,
        partidoId: fila.partido_id,
        titulo: fila.titulo,
        area: fila.area,
        descripcion: fila.descripcion,
        fechaPresentacion: fila.fecha_presentacion,
        estado: fila.estado,
        presupuestoEstimado: fila.presupuesto_estimado,
        alcance: fila.alcance,
        imagenBase64: fila.imagen ? fila.imagen.toString("base64") : null,
        partidoNombre: fila.partido_nombre || null
    };

}

// ---------- CARGA EAGER (JOIN en una sola consulta) ----------

async function listarConPartido() {

    const resultado = await pool.query(
        `SELECT
            p.id, p.partido_id, p.titulo, p.area, p.descripcion,
            p.fecha_presentacion, p.estado, p.presupuesto_estimado,
            p.alcance, p.imagen,
            pa.nombre AS partido_nombre
         FROM propuestas_pg p
         JOIN partidos_pg pa ON pa.id = p.partido_id
         ORDER BY p.id`
    );

    return resultado.rows.map(filaAObjeto);

}

async function obtenerPorId(id) {

    const resultado = await pool.query(
        `SELECT
            p.id, p.partido_id, p.titulo, p.area, p.descripcion,
            p.fecha_presentacion, p.estado, p.presupuesto_estimado,
            p.alcance, p.imagen,
            pa.nombre AS partido_nombre
         FROM propuestas_pg p
         JOIN partidos_pg pa ON pa.id = p.partido_id
         WHERE p.id = $1`,
        [id]
    );

    if (resultado.rows.length === 0) {

        return null;

    }

    return filaAObjeto(resultado.rows[0]);

}

async function crear(datos) {

    const imagenBuffer = datos.imagenBase64 ? Buffer.from(datos.imagenBase64, "base64") : null;

    const resultado = await pool.query(
        `INSERT INTO propuestas_pg
            (partido_id, titulo, area, descripcion, fecha_presentacion, estado, presupuesto_estimado, alcance, imagen)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id`,
        [
            datos.partidoId,
            datos.titulo,
            datos.area,
            datos.descripcion,
            datos.fechaPresentacion,
            datos.estado,
            datos.presupuestoEstimado,
            datos.alcance,
            imagenBuffer
        ]
    );

    return obtenerPorId(resultado.rows[0].id);

}

async function actualizar(id, datos) {

    const imagenBuffer = datos.imagenBase64 ? Buffer.from(datos.imagenBase64, "base64") : null;

    const resultado = await pool.query(
        `UPDATE propuestas_pg SET
            partido_id = $1, titulo = $2, area = $3, descripcion = $4,
            fecha_presentacion = $5, estado = $6, presupuesto_estimado = $7,
            alcance = $8, imagen = COALESCE($9, imagen)
         WHERE id = $10
         RETURNING id`,
        [
            datos.partidoId,
            datos.titulo,
            datos.area,
            datos.descripcion,
            datos.fechaPresentacion,
            datos.estado,
            datos.presupuestoEstimado,
            datos.alcance,
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
        "DELETE FROM propuestas_pg WHERE id = $1 RETURNING id",
        [id]
    );

    return resultado.rows.length > 0;

}

module.exports = {
    listarConPartido,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
