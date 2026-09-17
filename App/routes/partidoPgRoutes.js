const express = require("express");

const router = express.Router();

const {
    getAllPartidos,
    getPartidoById,
    createPartido,
    updatePartido,
    deletePartido
} = require("../controllers/partidoPgController");

// GET - Obtener todos
router.get("/", getAllPartidos);

// GET - Obtener uno por ID
router.get("/:id", getPartidoById);

// POST - Crear
router.post("/", createPartido);

// PUT - Actualizar
router.put("/:id", updatePartido);

// DELETE - Eliminar
router.delete("/:id", deletePartido);

module.exports = router;
