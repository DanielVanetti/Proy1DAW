/**
 * ==========================================
 * Controlador de Figuras Públicas (Parte 1 - .txt)
 * ==========================================
 */

const FiguraPublica = require("../models/figuraPublica");
const FiguraPublicaService = require("../services/figuraPublicaService");
const Logger = require("../utils/logger");

function usuarioDe(req) {

    return req.headers["x-usuario"] || "desconocido";

}

function listar(req, res) {

    try {

        const figuras = FiguraPublicaService.listar();

        res.json(figuras);

    }
    catch (error) {

        res.status(500).json({ mensaje: error.message });

    }

}

function buscar(req, res) {

    try {

        const figura = FiguraPublicaService.buscarPorCodigo(req.params.codigo);

        if (!figura) {

            return res.status(404).json({ mensaje: "Figura pública no encontrada." });

        }

        res.json(figura);

    }
    catch (error) {

        res.status(500).json({ mensaje: error.message });

    }

}

function guardar(req, res) {

    try {

        const figura = new FiguraPublica(
            req.body.codigo,
            req.body.nombreCompleto,
            req.body.cargoActual,
            req.body.partido,
            req.body.fechaNacimiento
        );

        FiguraPublicaService.guardar(figura);

        Logger.registrarAccion("Guardar figura pública " + figura.codigo, usuarioDe(req));

        res.status(201).json({ mensaje: "Figura pública guardada correctamente." });

    }
    catch (error) {

        Logger.registrarAccion("Error al guardar figura pública: " + error.message, usuarioDe(req));

        res.status(400).json({ mensaje: error.message });

    }

}

function modificar(req, res) {

    try {

        const figura = new FiguraPublica(
            req.body.codigo,
            req.body.nombreCompleto,
            req.body.cargoActual,
            req.body.partido,
            req.body.fechaNacimiento
        );

        FiguraPublicaService.modificar(figura);

        Logger.registrarAccion("Modificar figura pública " + figura.codigo, usuarioDe(req));

        res.json({ mensaje: "Figura pública modificada correctamente." });

    }
    catch (error) {

        Logger.registrarAccion("Error al modificar figura pública: " + error.message, usuarioDe(req));

        res.status(400).json({ mensaje: error.message });

    }

}

function eliminar(req, res) {

    try {

        const codigo = req.params.codigo;

        FiguraPublicaService.eliminar(codigo);

        Logger.registrarAccion("Eliminar figura pública " + codigo, usuarioDe(req));

        res.json({ mensaje: "Figura pública eliminada correctamente." });

    }
    catch (error) {

        Logger.registrarAccion("Error al eliminar figura pública: " + error.message, usuarioDe(req));

        res.status(400).json({ mensaje: error.message });

    }

}

module.exports = {
    listar,
    buscar,
    guardar,
    modificar,
    eliminar
};
