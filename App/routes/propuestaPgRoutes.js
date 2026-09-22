const express = require("express");

const router = express.Router();

const {
    obtenerPropuestas,
    obtenerPropuestaPorId,
    crearPropuesta,
    actualizarPropuesta,
    eliminarPropuesta
} = require("../controllers/propuestaPgController");

// GET - Obtener todos
router.get("/", obtenerPropuestas);

// GET - Obtener uno por ID
router.get("/:id", obtenerPropuestaPorId);

// POST - Crear
router.post("/", crearPropuesta);

// PUT - Actualizar
router.put("/:id", actualizarPropuesta);

// DELETE - Eliminar
router.delete("/:id", eliminarPropuesta);

module.exports = router;
