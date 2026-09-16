/**
 * ==========================================
 * Servicio de Propuestas (Parte 2 - PostgreSQL)
 * ==========================================
 */

const PropuestaPgDAO = require("../dao/postgres/propuestaPgDAO");

function listarConPartido() {

    return PropuestaPgDAO.listarConPartido();

}

function obtenerPorId(id) {

    return PropuestaPgDAO.obtenerPorId(id);

}

function crear(datos) {

    if (!datos.partidoId || !datos.titulo || !datos.area || !datos.descripcion ||
        !datos.fechaPresentacion || !datos.estado || !datos.alcance) {

        throw new Error("Todos los campos obligatorios deben completarse.");

    }

    return PropuestaPgDAO.crear(datos);

}

async function actualizar(id, datos) {

    const actualizada = await PropuestaPgDAO.actualizar(id, datos);

    if (!actualizada) {

        throw new Error("Propuesta no encontrada.");

    }

    return actualizada;

}

async function eliminar(id) {

    const eliminada = await PropuestaPgDAO.eliminar(id);

    if (!eliminada) {

        throw new Error("Propuesta no encontrada.");

    }

}

module.exports = {
    listarConPartido,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
