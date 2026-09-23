/**
 * ==========================================
 * Servicio de Partidos
 * ==========================================
 */
 
const PartidoDAO = require("../dao/partidoDAO");
 
/*=========================================
  Listar partidos
=========================================*/
 
function listar() {
 
    return PartidoDAO.listar();
 
}
 
/*=========================================
  Buscar por código
=========================================*/
 
function buscarPorCodigo(codigo) {
 
    return PartidoDAO.buscarPorCodigo(codigo);
 
}
 
/*=========================================
  Guardar partido
=========================================*/
 
function guardar(partido) {
 
    if (!partido.codigo ||
        !partido.nombre ||
        !partido.siglas ||
        !partido.ideologia ||
        !partido.fechaFundacion) {
 
        throw new Error("Todos los campos son obligatorios.");
 
    }
 
    const existente =
        PartidoDAO.buscarPorCodigo(partido.codigo);
 
    if (existente) {
 
        throw new Error(
            "El código ya existe."
        );
 
    }
 
    PartidoDAO.guardar(partido);
 
}
 
/*=========================================
  Modificar partido
=========================================*/
 
function modificar(partido) {
 
    const existente =
        PartidoDAO.buscarPorCodigo(partido.codigo);
 
    if (!existente) {
 
        throw new Error(
            "El partido no existe."
        );
 
    }
 
    PartidoDAO.modificar(partido);
 
}
 
/*=========================================
  Eliminar partido
=========================================*/
 
function eliminar(codigo) {
 
    const existente =
        PartidoDAO.buscarPorCodigo(codigo);
 
    if (!existente) {
 
        throw new Error(
            "El partido no existe."
        );
 
    }
 
    PartidoDAO.eliminar(codigo);
 
}
 
/*=========================================
  Exportar funciones
=========================================*/
 
module.exports = {
 
    listar,
 
    buscarPorCodigo,
 
    guardar,
 
    modificar,
 
    eliminar
 
};