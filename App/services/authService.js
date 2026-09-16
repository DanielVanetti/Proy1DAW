/**
 * ==========================================
 * Servicio de Autenticación
 * ==========================================
 */

const UsuarioDAO = require("../dao/usuarioDAO");

function autenticar(usuario, password) {

    const encontrado = UsuarioDAO.validarCredenciales(usuario, password);

    if (!encontrado) {

        throw new Error("Usuario o contraseña incorrectos.");

    }

    return encontrado;

}

module.exports = {
    autenticar
};
