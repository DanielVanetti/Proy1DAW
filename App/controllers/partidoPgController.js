/**
 * ==========================================
 * Controlador de Partidos + Propuestas (Parte 2 - PostgreSQL)
 * ==========================================
 */

const PartidoPgService = require("../services/partidoPgService");
const PropuestaPgService = require("../services/propuestaPgService");
const Logger = require("../utils/logger");

function usuarioDe(req) {

    return req.headers["x-usuario"] || "desconocido";

}

// ---------- Partidos ----------

async function listarPartidos(req, res, next) {

    try {

        const partidos = await PartidoPgService.listar();

        res.json(partidos);

    }
    catch (error) {

        next(error);

    }

}

async function crearPartido(req, res) {

    try {

        const partido = await PartidoPgService.crear(req.body);

        Logger.registrarAccion("Crear partido PG " + partido.id, usuarioDe(req));

        res.status(201).json({ mensaje: "Partido creado correctamente.", partido });

    }
    catch (error) {

        Logger.registrarAccion("Error al crear partido PG: " + error.message, usuarioDe(req));

        res.status(400).json({ mensaje: error.message });

    }

}

async function actualizarPartido(req, res) {

    try {

        const partido = await PartidoPgService.actualizar(req.params.id, req.body);

        Logger.registrarAccion("Actualizar partido PG " + req.params.id, usuarioDe(req));

        res.json({ mensaje: "Partido actualizado correctamente.", partido });

    }
    catch (error) {

        Logger.registrarAccion("Error al actualizar partido PG: " + error.message, usuarioDe(req));

        res.status(400).json({ mensaje: error.message });

    }

}

async function eliminarPartido(req, res) {

    try {

        await PartidoPgService.eliminar(req.params.id);

        Logger.registrarAccion("Eliminar partido PG " + req.params.id, usuarioDe(req));

        res.json({ mensaje: "Partido eliminado correctamente." });

    }
    catch (error) {

        Logger.registrarAccion("Error al eliminar partido PG: " + error.message, usuarioDe(req));

        res.status(400).json({ mensaje: error.message });

    }

}

// ---------- Propuestas (relacionadas por FK partido_id) ----------

async function listarPropuestas(req, res, next) {

    try {

        // CARGA EAGER: una sola consulta con JOIN trae propuesta + nombre del partido.
        const propuestas = await PropuestaPgService.listarConPartido();

        res.json(propuestas);

    }
    catch (error) {

        next(error);

    }

}

async function crearPropuesta(req, res) {

    try {

        const propuesta = await PropuestaPgService.crear(req.body);

        Logger.registrarAccion("Crear propuesta PG " + propuesta.id, usuarioDe(req));

        res.status(201).json({ mensaje: "Propuesta creada correctamente.", propuesta });

    }
    catch (error) {

        Logger.registrarAccion("Error al crear propuesta PG: " + error.message, usuarioDe(req));

        res.status(400).json({ mensaje: error.message });

    }

}

async function actualizarPropuesta(req, res) {

    try {

        const propuesta = await PropuestaPgService.actualizar(req.params.id, req.body);

        Logger.registrarAccion("Actualizar propuesta PG " + req.params.id, usuarioDe(req));

        res.json({ mensaje: "Propuesta actualizada correctamente.", propuesta });

    }
    catch (error) {

        Logger.registrarAccion("Error al actualizar propuesta PG: " + error.message, usuarioDe(req));

        res.status(400).json({ mensaje: error.message });

    }

}

async function eliminarPropuesta(req, res) {

    try {

        await PropuestaPgService.eliminar(req.params.id);

        Logger.registrarAccion("Eliminar propuesta PG " + req.params.id, usuarioDe(req));

        res.json({ mensaje: "Propuesta eliminada correctamente." });

    }
    catch (error) {

        Logger.registrarAccion("Error al eliminar propuesta PG: " + error.message, usuarioDe(req));

        res.status(400).json({ mensaje: error.message });

    }

}

module.exports = {
    listarPartidos,
    crearPartido,
    actualizarPartido,
    eliminarPartido,
    listarPropuestas,
    crearPropuesta,
    actualizarPropuesta,
    eliminarPropuesta
};
