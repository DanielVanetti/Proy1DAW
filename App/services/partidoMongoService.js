/**
 * ==========================================
 * Servicio de Partidos (Parte 3 - MongoDB)
 * ==========================================
 */

const PartidoMongoDAO = require("../dao/mongo/partidoMongoDAO");

function listar() {

    return PartidoMongoDAO.listar();

}

function obtenerPorId(id) {

    return PartidoMongoDAO.obtenerPorId(id);

}

function crear(datos) {

    if (!datos.nombre || !datos.siglas || !datos.ideologia) {

        throw new Error("Nombre, siglas e ideología son obligatorios.");

    }

    return PartidoMongoDAO.crear(datos);

}

async function actualizar(id, datos) {

    const actualizado = await PartidoMongoDAO.actualizar(id, datos);

    if (!actualizado) {

        throw new Error("Partido no encontrado.");

    }

    return actualizado;

}

async function eliminar(id) {

    const eliminado = await PartidoMongoDAO.eliminar(id);

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
