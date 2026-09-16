/**
 * ==========================================
 * Controlador de Partidos (Parte 3 - MongoDB)
 * ==========================================
 */

const PartidoMongoService = require("../services/partidoMongoService");
const Logger = require("../utils/logger");

function usuarioDe(req) {

    return req.headers["x-usuario"] || "desconocido";

}

async function listar(req, res, next) {

    try {

        const partidos = await PartidoMongoService.listar();

        res.json(partidos);

    }
    catch (error) {

        next(error);

    }

}

async function obtenerPorId(req, res) {

    try {

        const partido = await PartidoMongoService.obtenerPorId(req.params.id);

        if (!partido) {

            return res.status(404).json({ mensaje: "Partido no encontrado." });

        }

        res.json(partido);

    }
    catch (error) {

        res.status(500).json({ mensaje: error.message });

    }

}

async function crear(req, res) {

    try {

        const partido = await PartidoMongoService.crear(req.body);

        Logger.registrarAccion("Crear partido Mongo " + partido._id, usuarioDe(req));

        res.status(201).json({ mensaje: "Partido creado correctamente.", partido });

    }
    catch (error) {

        Logger.registrarAccion("Error al crear partido Mongo: " + error.message, usuarioDe(req));

        res.status(400).json({ mensaje: error.message });

    }

}

async function actualizar(req, res) {

    try {

        const partido = await PartidoMongoService.actualizar(req.params.id, req.body);

        Logger.registrarAccion("Actualizar partido Mongo " + req.params.id, usuarioDe(req));

        res.json({ mensaje: "Partido actualizado correctamente.", partido });

    }
    catch (error) {

        Logger.registrarAccion("Error al actualizar partido Mongo: " + error.message, usuarioDe(req));

        res.status(400).json({ mensaje: error.message });

    }

}

async function eliminar(req, res) {

    try {

        await PartidoMongoService.eliminar(req.params.id);

        Logger.registrarAccion("Eliminar partido Mongo " + req.params.id, usuarioDe(req));

        res.json({ mensaje: "Partido eliminado correctamente." });

    }
    catch (error) {

        Logger.registrarAccion("Error al eliminar partido Mongo: " + error.message, usuarioDe(req));

        res.status(400).json({ mensaje: error.message });

    }

}

module.exports = {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
