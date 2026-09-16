/**
 * ==========================================
 * Controlador de Figuras Publicas (Parte 3 - MongoDB)
 * ==========================================
 */

const FiguraMongoService = require("../services/figuraMongoService");
const Logger = require("../utils/logger");

function usuarioDe(req) {

    return req.headers["x-usuario"] || "desconocido";

}

async function listar(req, res, next) {

    try {

        const figuras = await FiguraMongoService.listar();

        res.json(figuras);

    }
    catch (error) {

        next(error);

    }

}

async function obtenerPorId(req, res) {

    try {

        const figura = await FiguraMongoService.obtenerPorId(req.params.id);

        if (!figura) {

            return res.status(404).json({ mensaje: "Figura pública no encontrada." });

        }

        res.json(figura);

    }
    catch (error) {

        res.status(500).json({ mensaje: error.message });

    }

}

async function crear(req, res) {

    try {

        const figura = await FiguraMongoService.crear(req.body);

        Logger.registrarAccion("Crear figura Mongo " + figura._id, usuarioDe(req));

        res.status(201).json({ mensaje: "Figura pública creada correctamente.", figura });

    }
    catch (error) {

        Logger.registrarAccion("Error al crear figura Mongo: " + error.message, usuarioDe(req));

        res.status(400).json({ mensaje: error.message });

    }

}

async function actualizar(req, res) {

    try {

        const figura = await FiguraMongoService.actualizar(req.params.id, req.body);

        Logger.registrarAccion("Actualizar figura Mongo " + req.params.id, usuarioDe(req));

        res.json({ mensaje: "Figura pública actualizada correctamente.", figura });

    }
    catch (error) {

        Logger.registrarAccion("Error al actualizar figura Mongo: " + error.message, usuarioDe(req));

        res.status(400).json({ mensaje: error.message });

    }

}

async function eliminar(req, res) {

    try {

        await FiguraMongoService.eliminar(req.params.id);

        Logger.registrarAccion("Eliminar figura Mongo " + req.params.id, usuarioDe(req));

        res.json({ mensaje: "Figura pública eliminada correctamente." });

    }
    catch (error) {

        Logger.registrarAccion("Error al eliminar figura Mongo: " + error.message, usuarioDe(req));

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
