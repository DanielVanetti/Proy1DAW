/**
 * ==========================================
 * Controlador de Autenticación
 * ==========================================
 */

const path = require("path");

const AuthService = require("../services/authService");
const Logger = require("../utils/logger");

function mostrarLogin(req, res) {

    res.sendFile(path.join(__dirname, "..", "views", "login.html"));

}

function iniciarSesion(req, res) {

    try {

        const usuario = req.body.usuario;
        const password = req.body.password;

        AuthService.autenticar(usuario, password);

        Logger.registrarAccion("Login correcto", usuario);

        res.json({
            ok: true
        });

    }
    catch (error) {

        Logger.registrarAccion(
            "Login fallido: " + error.message,
            req.body.usuario
        );

        res.status(401).json({
            ok: false,
            mensaje: error.message
        });

    }

}

function mostrarMenu(req, res) {

    res.sendFile(path.join(__dirname, "..", "views", "menu.html"));

}

function cerrarSesion(req, res) {

    Logger.registrarAccion("Logout", req.query.usuario);

    res.redirect("/");

}

module.exports = {
    mostrarLogin,
    iniciarSesion,
    mostrarMenu,
    cerrarSesion
};
