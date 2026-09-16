/**
 * ==========================================
 * Servicio de Cargos Historicos (Parte 2 - PostgreSQL)
 * ==========================================
 */

const CargoHistoricoPgDAO = require("../dao/postgres/cargoHistoricoPgDAO");

function listarConFigura() {

    return CargoHistoricoPgDAO.listarConFigura();

}

function obtenerPorId(id) {

    return CargoHistoricoPgDAO.obtenerPorId(id);

}

function crear(datos) {

    if (!datos.figuraId || !datos.cargo || !datos.institucion ||
        !datos.fechaInicio || !datos.logros || !datos.region) {

        throw new Error("Todos los campos obligatorios deben completarse.");

    }

    return CargoHistoricoPgDAO.crear(datos);

}

async function actualizar(id, datos) {

    const actualizado = await CargoHistoricoPgDAO.actualizar(id, datos);

    if (!actualizado) {

        throw new Error("Cargo histórico no encontrado.");

    }

    return actualizado;

}

async function eliminar(id) {

    const eliminado = await CargoHistoricoPgDAO.eliminar(id);

    if (!eliminado) {

        throw new Error("Cargo histórico no encontrado.");

    }

}

module.exports = {
    listarConFigura,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
