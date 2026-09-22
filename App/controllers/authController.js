/**
 * ==========================================
 * Controlador de Autenticación
 * ==========================================
 */
 
const path = require("path");
 
 
 
const AuthService = require("../services/authService");
 
// AGREGADO: logger de acciones (requerimiento del proyecto)
 
const Logger = require("../utils/logger");
 
/*=========================================
  Mostrar pantalla de login
=========================================*/
 
function mostrarLogin(req, res) {
 
    res.sendFile(
        path.join(__dirname, "..", "views", "login.html")  //carpeta donde este el archivo
    );
 
}
 
/*=========================================
  Procesar login
=========================================*/
 
 
 
 
function iniciarSesion(req,res){
 
    try{
 
        const usuario =
        req.body.usuario;
 
 
        const password =
        req.body.password;
 
        /********************************* */
        console.log(
            "Usuario recibido:",
            usuario
        );
 
 
        console.log(
            "Password recibido:",
            password
        );
        /********************************* */
 
        AuthService.autenticar(
            usuario,
            password
        );
 
        // AGREGADO: se guarda el usuario activo y se registra en el log
 
        Logger.asignarUsuario(usuario);
 
        Logger.registrar(
            "Inicio de sesión correcto",
            usuario
        );
 
 
        res.json({
 
            ok:true
 
        });
 
 
    }
    catch(error){
 
        // AGREGADO: registro del error de autenticación en el log
 
        Logger.registrar(
            "Error de autenticación: " + error.message,
            req.body.usuario
        );
 
 
        res.status(401).json({
 
            ok:false,
 
            mensaje:error.message
 
        });
 
 
    }
 
}

/*=========================================
  Mostrar menú principal
  AGREGADO: menú lateral que se muestra
  después de una autenticación correcta
  (requerimiento del proyecto)
=========================================*/
 
function mostrarMenu(req, res) {
 
    res.sendFile(
        path.join(__dirname, "..", "views", "menu.html")
    );
 
}
 
/*=========================================
  Cerrar sesión
=========================================*/
 
function cerrarSesion(req, res) {
 
    // AGREGADO: registro del cierre de sesión en el log
 
    Logger.registrar("Cierre de sesión");
 
    Logger.asignarUsuario("desconocido");
 
    res.redirect("/");
 
}
 
/*=========================================
  Exportar funciones
=========================================*/
 
module.exports = {
 
    mostrarLogin,
 
    iniciarSesion,
 
    mostrarMenu,
 
    cerrarSesion
 
};