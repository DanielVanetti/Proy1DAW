/**
 * ==========================================
 * Servicio de Partidos (Parte 2 - PostgreSQL)
 * ==========================================
 */

const PartidoPgDAO = require("../dao/postgres/partidoPgDAO");

function listar() {

    return PartidoPgDAO.listar();

}

function obtenerPorId(id) {

    return PartidoPgDAO.obtenerPorId(id);

}

function crear(datos) {

    if (!datos.nombre || !datos.siglas || !datos.ideologia || !datos.fechaFundacion ||
        !datos.sede || !datos.numMilitantes) {

        throw new Error("Todos los campos obligatorios deben completarse.");

    }

    return PartidoPgDAO.crear(datos);

}

async function actualizar(id, datos) {

    const actualizado = await PartidoPgDAO.actualizar(id, datos);

    if (!actualizado) {

        throw new Error("Partido no encontrado.");

    }

    return actualizado;

}

async function eliminar(id) {

    const eliminado = await PartidoPgDAO.eliminar(id);

    if (!eliminado) {

        throw new Error("Partido no encontrado.");

    }

}

module.exports = {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
