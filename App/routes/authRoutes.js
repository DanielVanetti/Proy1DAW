/**
 * ==========================================
 * Rutas de Autenticación
 * ==========================================
 */

const express = require("express");

const router = express.Router();

const AuthController = require("../controllers/authController");

router.get("/", AuthController.mostrarLogin);

router.post("/login", AuthController.iniciarSesion);

router.get("/menu", AuthController.mostrarMenu);

router.get("/logout", AuthController.cerrarSesion);

module.exports = router;
