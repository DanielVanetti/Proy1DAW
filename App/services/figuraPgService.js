/**
 * ==========================================
 * Servicio de Figuras Publicas (Parte 2 - PostgreSQL)
 * ==========================================
 */

const FiguraPgDAO = require("../dao/postgres/figuraPgDAO");

function listar() {

    return FiguraPgDAO.listar();

}

function obtenerPorId(id) {

    return FiguraPgDAO.obtenerPorId(id);

}

function crear(datos) {

    if (!datos.nombreCompleto || !datos.cargoActual || !datos.fechaNacimiento ||
        !datos.nacionalidad || !datos.nivelEducativo || !datos.biografia) {

        throw new Error("Todos los campos obligatorios deben completarse.");

    }

    return FiguraPgDAO.crear(datos);

}

async function actualizar(id, datos) {

    const actualizada = await FiguraPgDAO.actualizar(id, datos);

    if (!actualizada) {

        throw new Error("Figura pública no encontrada.");

    }

    return actualizada;

}

async function eliminar(id) {

    const eliminada = await FiguraPgDAO.eliminar(id);

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
