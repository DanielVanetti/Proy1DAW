/**
 * ==========================================
 * Servicio de Autenticación
 * ==========================================
 */
 
const UsuarioDAO = require("../dao/usuarioDAO");
 
/*=========================================
  Autenticar usuario
=========================================*/
function autenticar(usuario,password){
 
 
    const encontrado =
    UsuarioDAO.validarCredenciales(
        usuario,
        password
    );
 
 
    if(!encontrado){
 
        throw new Error(
            "Usuario o contraseña incorrectos."
        );
 
    }
 
 
    return encontrado;
 
}
/* function autenticar(usuario, password) {
 
    if (!usuario || usuario.trim() === "") {
 
        throw new Error("Debe ingresar el usuario.");
 
    }
 
    if (!password || password.trim() === "") {
 
        throw new Error("Debe ingresar la contraseña.");
 
    }
 
    const usuarioEncontrado =
        UsuarioDAO.validarCredenciales(
            usuario.trim(),
            password.trim()
        );
 
    if (!usuarioEncontrado) {
 
        throw new Error(
            "Usuario o contraseña incorrectos."
        );
 
    }
 
    return usuarioEncontrado;
 
} */
 
/*=========================================
  Buscar usuario
=========================================*/
 
function buscarPorUsuario(usuario) {
 
    if (!usuario || usuario.trim() === "") {
 
        return null;
 
    }
 
    return UsuarioDAO.buscarPorUsuario(
        usuario.trim()
    );
 
}
 
/*=========================================
  Listar usuarios
=========================================*/
 
function listar() {
 
    return UsuarioDAO.listar();
 
}
 
/*=========================================
  Exportar funciones
=========================================*/
/* module.exports={
 
    autenticar
 
}; */
module.exports = {
 
    autenticar,
 
    buscarPorUsuario,
 
    listar
 
};