/**
 * ==========================================
 * Rutas de Autenticación
 * ==========================================
 */
 
const express = require("express");
 
const router = express.Router();
 
const AuthController =
    require("../controllers/authController");
 
/*=========================================
  GET
  Mostrar Login
=========================================*/
 
router.get(
 
    "/",
 
    AuthController.mostrarLogin
 
);
 
/*=========================================
  POST
  Iniciar Sesión
=========================================*/
 
router.post(
 
    "/login",
 
    AuthController.iniciarSesion
 
);
 
/*=========================================
  GET
  Mostrar Menú
  menú principal (requerimiento del proyecto)
=========================================*/
 
router.get(
 
    "/menu",
 
    AuthController.mostrarMenu
 
);
 
/*=========================================
  GET
  Cerrar Sesión
=========================================*/
 
router.get(
 
    "/logout",
 
    AuthController.cerrarSesion
 
);
 
/*=========================================
  Exportar Router
=========================================*/
 
module.exports = router;