const express = require("express");

const router = express.Router();

const {
    getAllCargos,
    getCargoById,
    createCargo,
    updateCargo,
    deleteCargo
} = require("../controllers/cargoPgController");

// GET - Obtener todos
router.get("/", getAllCargos);

// GET - Obtener uno por ID
router.get("/:id", getCargoById);

// POST - Crear
router.post("/", createCargo);

// PUT - Actualizar
router.put("/:id", updateCargo);

// DELETE - Eliminar
router.delete("/:id", deleteCargo);

module.exports = router;
