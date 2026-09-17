/**
 * ==========================================
 * Controlador de Figuras Públicas
 * ==========================================
 */
 
const FiguraPublica = require("../models/figuraPublica");
const FiguraPublicaService = require("../services/figuraPublicaService");
 
// AGREGADO: logger de acciones (requerimiento del proyecto)
 
const Logger = require("../utils/logger");
 
/*=========================================
  Listar figuras públicas
=========================================*/
 
function listar(req, res) {
 
    try {
 
        const figuras = FiguraPublicaService.listar();
 
        // AGREGADO: registro en el log
 
        Logger.registrar("Consultar figuras públicas (.txt)");
 
        res.json(figuras);
 
    }
    catch (error) {
 
        // AGREGADO: registro en el log
 
        Logger.registrar("Error al consultar figuras públicas (.txt): " + error.message);
 
        res.status(500).json({
 
            mensaje: error.message
 
        });
 
    }
 
}
 
/*=========================================
  Buscar figura pública
=========================================*/
 
function buscar(req, res) {
 
    try {
 
        const codigo = req.params.codigo;
 
        const figura =
            FiguraPublicaService.buscarPorCodigo(codigo);
 
        if (!figura) {
 
            return res.status(404).json({
 
                mensaje: "Figura pública no encontrada."
 
            });
 
        }
 
        res.json(figura);
 
    }
    catch (error) {
 
        res.status(500).json({
 
            mensaje: error.message
 
        });
 
    }
 
}
 
/*=========================================
  Guardar figura pública
=========================================*/
 
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
 
        // AGREGADO: registro en el log
 
        Logger.registrar("Guardar figura pública " + figura.codigo + " (.txt)");
 
        res.status(201).json({
 
            mensaje: "Figura pública guardada correctamente."
 
        });
 
    }
    catch (error) {
 
        // AGREGADO: registro en el log
 
        Logger.registrar("Error al guardar figura pública (.txt): " + error.message);
 
        res.status(400).json({
 
            mensaje: error.message
 
        });
 
    }
 
}
 
/*=========================================
  Modificar figura pública
=========================================*/
 
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
 
        // AGREGADO: registro en el log
 
        Logger.registrar("Modificar figura pública " + figura.codigo + " (.txt)");
 
        res.json({
 
            mensaje: "Figura pública modificada correctamente."
 
        });
 
    }
    catch (error) {
 
        // AGREGADO: registro en el log
 
        Logger.registrar("Error al modificar figura pública (.txt): " + error.message);
 
        res.status(400).json({
 
            mensaje: error.message
 
        });
 
    }
 
}
 
/*=========================================
  Eliminar figura pública
=========================================*/
 
function eliminar(req, res) {
 
    try {
 
        const codigo = req.params.codigo;
 
        FiguraPublicaService.eliminar(codigo);
 
        // AGREGADO: registro en el log
 
        Logger.registrar("Eliminar figura pública " + codigo + " (.txt)");
 
        res.json({
 
            mensaje: "Figura pública eliminada correctamente."
 
        });
 
    }
    catch (error) {
 
        // AGREGADO: registro en el log
 
        Logger.registrar("Error al eliminar figura pública (.txt): " + error.message);
 
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