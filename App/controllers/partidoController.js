/**
 * ==========================================
 * Controlador de Partidos Políticos (Parte 1 - .txt)
 * ==========================================
 */

const Partido = require("../models/partido");
const PartidoService = require("../services/partidoService");
const Logger = require("../utils/logger");

function usuarioDe(req) {

    return req.headers["x-usuario"] || "desconocido";

}

function listar(req, res) {

    try {

        const partidos = PartidoService.listar();

        res.json(partidos);

    }
    catch (error) {

        res.status(500).json({ mensaje: error.message });

    }

}

function buscar(req, res) {

    try {

        const partido = PartidoService.buscarPorCodigo(req.params.codigo);

        if (!partido) {

            return res.status(404).json({ mensaje: "Partido no encontrado." });

        }

        res.json(partido);

    }
    catch (error) {

        res.status(500).json({ mensaje: error.message });

    }

}

function guardar(req, res) {

    try {

        const partido = new Partido(
            req.body.codigo,
            req.body.nombre,
            req.body.siglas,
            req.body.ideologia,
            req.body.fechaFundacion
        );

        PartidoService.guardar(partido);

        Logger.registrarAccion("Guardar partido " + partido.codigo, usuarioDe(req));

        res.status(201).json({ mensaje: "Partido guardado correctamente." });

    }
    catch (error) {

        Logger.registrarAccion("Error al guardar partido: " + error.message, usuarioDe(req));

        res.status(400).json({ mensaje: error.message });

    }

}

function modificar(req, res) {

    try {

        const partido = new Partido(
            req.body.codigo,
            req.body.nombre,
            req.body.siglas,
            req.body.ideologia,
            req.body.fechaFundacion
        );

        PartidoService.modificar(partido);

        Logger.registrarAccion("Modificar partido " + partido.codigo, usuarioDe(req));

        res.json({ mensaje: "Partido modificado correctamente." });

    }
    catch (error) {

        Logger.registrarAccion("Error al modificar partido: " + error.message, usuarioDe(req));

        res.status(400).json({ mensaje: error.message });

    }

}

function eliminar(req, res) {

    try {

        const codigo = req.params.codigo;

        PartidoService.eliminar(codigo);

        Logger.registrarAccion("Eliminar partido " + codigo, usuarioDe(req));

        res.json({ mensaje: "Partido eliminado correctamente." });

    }
    catch (error) {

        Logger.registrarAccion("Error al eliminar partido: " + error.message, usuarioDe(req));

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
