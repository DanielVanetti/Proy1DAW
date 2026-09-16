/**
 * ==========================================
 * Servicio de Partidos Políticos (Parte 1 - .txt)
 * ==========================================
 */

const PartidoDAO = require("../dao/partidoDAO");

function listar() {

    return PartidoDAO.listar();

}

function buscarPorCodigo(codigo) {

    return PartidoDAO.buscarPorCodigo(codigo);

}

function guardar(partido) {

    if (!partido.codigo || !partido.nombre || !partido.siglas ||
        !partido.ideologia || !partido.fechaFundacion) {

        throw new Error("Todos los campos son obligatorios.");

    }

    const existente = PartidoDAO.buscarPorCodigo(partido.codigo);

    if (existente) {

        throw new Error("El código de partido ya existe.");

    }

    PartidoDAO.guardar(partido);

}

function modificar(partido) {

    const existente = PartidoDAO.buscarPorCodigo(partido.codigo);

    if (!existente) {

        throw new Error("El partido no existe.");

    }

    PartidoDAO.modificar(partido);

}

function eliminar(codigo) {

    const existente = PartidoDAO.buscarPorCodigo(codigo);

    if (!existente) {

        throw new Error("El partido no existe.");

    }

    PartidoDAO.eliminar(codigo);

}

module.exports = {
    listar,
    buscarPorCodigo,
    guardar,
    modificar,
    eliminar
};
