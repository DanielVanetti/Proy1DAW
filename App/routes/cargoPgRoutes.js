const express = require("express");

const router = express.Router();

const {
    obtenerCargos,
    obtenerCargoPorId,
    crearCargo,
    actualizarCargo,
    eliminarCargo
} = require("../controllers/cargoPgController");

// GET - Obtener todos
router.get("/", obtenerCargos);

// GET - Obtener uno por ID
router.get("/:id", obtenerCargoPorId);

// POST - Crear
router.post("/", crearCargo);

// PUT - Actualizar
router.put("/:id", actualizarCargo);

// DELETE - Eliminar
router.delete("/:id", eliminarCargo);

module.exports = router;
