/**
 * ==========================================
 * Controlador de Partidos
 * ==========================================
 */
 
const Partido = require("../models/partido");
const PartidoService = require("../services/partidoService");
 
const Logger = require("../utils/logger");
 
/*=========================================
  Listar partidos
=========================================*/
 
function listar(req, res) {
 
    try {
 
        const partidos = PartidoService.listar();
 
        Logger.registrar("Consultar partidos (.txt)");
 
        res.json(partidos);
 
    }
    catch (error) {
 
        Logger.registrar("Error al consultar partidos (.txt): " + error.message);
 
        res.status(500).json({
 
            mensaje: error.message
 
        });
 
    }
 
}
 
/*=========================================
  Buscar partido
=========================================*/
 
function buscar(req, res) {
 
    try {
 
        const codigo = req.params.codigo;
 
        const partido =
            PartidoService.buscarPorCodigo(codigo);
 
        if (!partido) {
 
            return res.status(404).json({
 
                mensaje: "Partido no encontrado."
 
            });
 
        }
 
        res.json(partido);
 
    }
    catch (error) {
 
        res.status(500).json({
 
            mensaje: error.message
 
        });
 
    }
 
}
 
/*=========================================
  Guardar partido
=========================================*/
 
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
 
        Logger.registrar("Guardar partido " + partido.codigo + " (.txt)");
 
        res.status(201).json({
 
            mensaje: "Partido guardado correctamente."
 
        });
 
    }
    catch (error) {
 
        Logger.registrar("Error al guardar partido (.txt): " + error.message);
 
        res.status(400).json({
 
            mensaje: error.message
 
        });
 
    }
 
}
 
/*=========================================
  Modificar partido
=========================================*/
 
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
 
        Logger.registrar("Modificar partido " + partido.codigo + " (.txt)");
 
        res.json({
 
            mensaje: "Partido modificado correctamente."
 
        });
 
    }
    catch (error) {
 
        Logger.registrar("Error al modificar partido (.txt): " + error.message);
 
        res.status(400).json({
 
            mensaje: error.message
 
        });
 
    }
 
}
 
/*=========================================
  Eliminar partido
=========================================*/
 
function eliminar(req, res) {
 
    try {
 
        const codigo = req.params.codigo;
 
        PartidoService.eliminar(codigo);
 
        Logger.registrar("Eliminar partido " + codigo + " (.txt)");
 
        res.json({
 
            mensaje: "Partido eliminado correctamente."
 
        });
 
    }
    catch (error) {
 
        Logger.registrar("Error al eliminar partido (.txt): " + error.message);
 
        res.status(400).json({
 
            mensaje: error.message
 
        });
 
    }
 
}
 
/*=========================================
  Exportar funciones
=========================================*/
 
module.exports = {
 
    listar,
 
    buscar,
 
    guardar,
 
    modificar,
 
    eliminar
 
};