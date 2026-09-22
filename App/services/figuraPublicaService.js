/**
 * ==========================================
 * Servicio de Figuras Públicas
 * ==========================================
 */
 
const FiguraPublicaDAO = require("../dao/figuraPublicaDAO");
 
/*=========================================
  Listar figuras públicas
=========================================*/
 
function listar() {
 
    return FiguraPublicaDAO.listar();
 
}
 
/*=========================================
  Buscar por código
=========================================*/
 
function buscarPorCodigo(codigo) {
 
    return FiguraPublicaDAO.buscarPorCodigo(codigo);
 
}
 
/*=========================================
  Guardar figura pública
=========================================*/
 
function guardar(figura) {
 
    if (!figura.codigo ||
        !figura.nombreCompleto ||
        !figura.cargoActual ||
        !figura.partido ||
        !figura.fechaNacimiento) {
 
        throw new Error("Todos los campos son obligatorios.");
 
    }
 
    const existente =
        FiguraPublicaDAO.buscarPorCodigo(figura.codigo);
 
    if (existente) {
 
        throw new Error(
            "El código ya existe."
        );
 
    }
 
    FiguraPublicaDAO.guardar(figura);
 
}
 
/*=========================================
  Modificar figura pública
=========================================*/
 
function modificar(figura) {
 
    const existente =
        FiguraPublicaDAO.buscarPorCodigo(figura.codigo);
 
    if (!existente) {
 
        throw new Error(
            "La figura pública no existe."
        );
 
    }
 
    FiguraPublicaDAO.modificar(figura);
 
}
 
/*=========================================
  Eliminar figura pública
=========================================*/
 
function eliminar(codigo) {
 
    const existente =
        FiguraPublicaDAO.buscarPorCodigo(codigo);
 
    if (!existente) {
 
        throw new Error(
            "La figura pública no existe."
        );
 
    }
 
    FiguraPublicaDAO.eliminar(codigo);
 
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