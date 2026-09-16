/**
 * ==========================================
 * Controlador de Figuras Publicas + Cargos Historicos (Parte 2 - PostgreSQL)
 * ==========================================
 */

const FiguraPgService = require("../services/figuraPgService");
const CargoHistoricoPgService = require("../services/cargoHistoricoPgService");
const Logger = require("../utils/logger");

function usuarioDe(req) {

    return req.headers["x-usuario"] || "desconocido";

}

// ---------- Figuras Publicas ----------

async function listarFiguras(req, res, next) {

    try {

        const figuras = await FiguraPgService.listar();

        res.json(figuras);

    }
    catch (error) {

        next(error);

    }

}

async function crearFigura(req, res) {

    try {

        const figura = await FiguraPgService.crear(req.body);

        Logger.registrarAccion("Crear figura PG " + figura.id, usuarioDe(req));

        res.status(201).json({ mensaje: "Figura pública creada correctamente.", figura });

    }
    catch (error) {

        Logger.registrarAccion("Error al crear figura PG: " + error.message, usuarioDe(req));

        res.status(400).json({ mensaje: error.message });

    }

}

async function actualizarFigura(req, res) {

    try {

        const figura = await FiguraPgService.actualizar(req.params.id, req.body);

        Logger.registrarAccion("Actualizar figura PG " + req.params.id, usuarioDe(req));

        res.json({ mensaje: "Figura pública actualizada correctamente.", figura });

    }
    catch (error) {

        Logger.registrarAccion("Error al actualizar figura PG: " + error.message, usuarioDe(req));

        res.status(400).json({ mensaje: error.message });

    }

}

async function eliminarFigura(req, res) {

    try {

        await FiguraPgService.eliminar(req.params.id);

        Logger.registrarAccion("Eliminar figura PG " + req.params.id, usuarioDe(req));

        res.json({ mensaje: "Figura pública eliminada correctamente." });

    }
    catch (error) {

        Logger.registrarAccion("Error al eliminar figura PG: " + error.message, usuarioDe(req));

        res.status(400).json({ mensaje: error.message });

    }

}

// ---------- Cargos Historicos (relacionados por FK figura_id) ----------

async function listarCargos(req, res, next) {

    try {

        // CARGA EAGER: una sola consulta con JOIN trae el cargo + nombre de la figura.
        const cargos = await CargoHistoricoPgService.listarConFigura();

        res.json(cargos);

    }
    catch (error) {

        next(error);

    }

}

async function crearCargo(req, res) {

    try {

        const cargo = await CargoHistoricoPgService.crear(req.body);

        Logger.registrarAccion("Crear cargo histórico PG " + cargo.id, usuarioDe(req));

        res.status(201).json({ mensaje: "Cargo histórico creado correctamente.", cargo });

    }
    catch (error) {

        Logger.registrarAccion("Error al crear cargo histórico PG: " + error.message, usuarioDe(req));

        res.status(400).json({ mensaje: error.message });

    }

}

async function actualizarCargo(req, res) {

    try {

        const cargo = await CargoHistoricoPgService.actualizar(req.params.id, req.body);

        Logger.registrarAccion("Actualizar cargo histórico PG " + req.params.id, usuarioDe(req));

        res.json({ mensaje: "Cargo histórico actualizado correctamente.", cargo });

    }
    catch (error) {

        Logger.registrarAccion("Error al actualizar cargo histórico PG: " + error.message, usuarioDe(req));

        res.status(400).json({ mensaje: error.message });

    }

}

async function eliminarCargo(req, res) {

    try {

        await CargoHistoricoPgService.eliminar(req.params.id);

        Logger.registrarAccion("Eliminar cargo histórico PG " + req.params.id, usuarioDe(req));

        res.json({ mensaje: "Cargo histórico eliminado correctamente." });

    }
    catch (error) {

        Logger.registrarAccion("Error al eliminar cargo histórico PG: " + error.message, usuarioDe(req));

        res.status(400).json({ mensaje: error.message });

    }

}

module.exports = {
    listarFiguras,
    crearFigura,
    actualizarFigura,
    eliminarFigura,
    listarCargos,
    crearCargo,
    actualizarCargo,
    eliminarCargo
};
