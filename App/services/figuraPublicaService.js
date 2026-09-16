/**
 * ==========================================
 * Servicio de Figuras Públicas (Parte 1 - .txt)
 * ==========================================
 */

const FiguraPublicaDAO = require("../dao/figuraPublicaDAO");

function listar() {

    return FiguraPublicaDAO.listar();

}

function buscarPorCodigo(codigo) {

    return FiguraPublicaDAO.buscarPorCodigo(codigo);

}

function guardar(figura) {

    if (!figura.codigo || !figura.nombreCompleto || !figura.cargoActual ||
        !figura.partido || !figura.fechaNacimiento) {

        throw new Error("Todos los campos son obligatorios.");

    }

    const existente = FiguraPublicaDAO.buscarPorCodigo(figura.codigo);

    if (existente) {

        throw new Error("El código de figura pública ya existe.");

    }

    FiguraPublicaDAO.guardar(figura);

}

function modificar(figura) {

    const existente = FiguraPublicaDAO.buscarPorCodigo(figura.codigo);

    if (!existente) {

        throw new Error("La figura pública no existe.");

    }

    FiguraPublicaDAO.modificar(figura);

}

function eliminar(codigo) {

    const existente = FiguraPublicaDAO.buscarPorCodigo(codigo);

    if (!existente) {

        throw new Error("La figura pública no existe.");

    }

    FiguraPublicaDAO.eliminar(codigo);

}

module.exports = {
    listar,
    buscarPorCodigo,
    guardar,
    modificar,
    eliminar
};
