const express = require("express");

const router = express.Router();

const {
    getAllPropuestas,
    getPropuestaById,
    createPropuesta,
    updatePropuesta,
    deletePropuesta
} = require("../controllers/propuestaPgController");

// GET - Obtener todos
router.get("/", getAllPropuestas);

// GET - Obtener uno por ID
router.get("/:id", getPropuestaById);

// POST - Crear
router.post("/", createPropuesta);

// PUT - Actualizar
router.put("/:id", updatePropuesta);

// DELETE - Eliminar
router.delete("/:id", deletePropuesta);

module.exports = router;
