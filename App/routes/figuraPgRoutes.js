const express = require("express");

const router = express.Router();

const {
    obtenerFiguras,
    obtenerFiguraPorId,
    crearFigura,
    actualizarFigura,
    eliminarFigura
} = require("../controllers/figuraPgController");

// GET - Obtener todos
router.get("/", obtenerFiguras);

// GET - Obtener uno por ID
router.get("/:id", obtenerFiguraPorId);

// POST - Crear
router.post("/", crearFigura);

// PUT - Actualizar
router.put("/:id", actualizarFigura);

// DELETE - Eliminar
router.delete("/:id", eliminarFigura);

module.exports = router;
