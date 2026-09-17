const express = require("express");

const router = express.Router();

const {
    getAllFiguras,
    getFiguraById,
    createFigura,
    updateFigura,
    deleteFigura
} = require("../controllers/figuraPgController");

// GET - Obtener todos
router.get("/", getAllFiguras);

// GET - Obtener uno por ID
router.get("/:id", getFiguraById);

// POST - Crear
router.post("/", createFigura);

// PUT - Actualizar
router.put("/:id", updateFigura);

// DELETE - Eliminar
router.delete("/:id", deleteFigura);

module.exports = router;
