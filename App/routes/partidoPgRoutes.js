const express = require("express");

const router = express.Router();

const {
    obtenerPartidos,
    obtenerPartidoPorId,
    crearPartido,
    actualizarPartido,
    eliminarPartido
} = require("../controllers/partidoPgController");

// GET - Obtener todos
router.get("/", obtenerPartidos);

// GET - Obtener uno por ID
router.get("/:id", obtenerPartidoPorId);

// POST - Crear
router.post("/", crearPartido);

// PUT - Actualizar
router.put("/:id", actualizarPartido);

// DELETE - Eliminar
router.delete("/:id", eliminarPartido);

module.exports = router;
