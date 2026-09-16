const express = require("express");
const path = require("path");

const router = express.Router();

const PartidoPgController = require("../controllers/partidoPgController");

router.get("/partidos-pg/pagina", (req, res) => {

    res.sendFile(path.join(__dirname, "..", "views", "partidosPg.html"));

});

// Partidos
router.get("/api/partidos-pg", PartidoPgController.listarPartidos);
router.post("/api/partidos-pg", PartidoPgController.crearPartido);
router.put("/api/partidos-pg/:id", PartidoPgController.actualizarPartido);
router.delete("/api/partidos-pg/:id", PartidoPgController.eliminarPartido);

// Propuestas (relacionadas por partido_id)
router.get("/api/propuestas-pg", PartidoPgController.listarPropuestas);
router.post("/api/propuestas-pg", PartidoPgController.crearPropuesta);
router.put("/api/propuestas-pg/:id", PartidoPgController.actualizarPropuesta);
router.delete("/api/propuestas-pg/:id", PartidoPgController.eliminarPropuesta);

module.exports = router;
