/**
 * ==========================================
 * Servicio de Figuras Publicas (Parte 3 - MongoDB)
 * ==========================================
 */

const FiguraMongoDAO = require("../dao/mongo/figuraMongoDAO");

function listar() {

    return FiguraMongoDAO.listar();

}

function obtenerPorId(id) {

    return FiguraMongoDAO.obtenerPorId(id);

}

function crear(datos) {

    if (!datos.nombreCompleto || !datos.cargoActual) {

        throw new Error("Nombre completo y cargo actual son obligatorios.");

    }

    return FiguraMongoDAO.crear(datos);

}

async function actualizar(id, datos) {

    const actualizada = await FiguraMongoDAO.actualizar(id, datos);

    if (!actualizada) {

        throw new Error("Figura pública no encontrada.");

    }

    return actualizada;

}

async function eliminar(id) {

    const eliminada = await FiguraMongoDAO.eliminar(id);

    if (!eliminada) {

        throw new Error("Figura pública no encontrada.");

    }

}

module.exports = {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
