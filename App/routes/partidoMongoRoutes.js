const express = require("express");
const path = require("path");

const router = express.Router();

const PartidoMongoController = require("../controllers/partidoMongoController");

router.get("/partidos-mongo/pagina", (req, res) => {

    res.sendFile(path.join(__dirname, "..", "views", "partidosMongo.html"));

});

router.get("/api/partidos-mongo", PartidoMongoController.listar);
router.get("/api/partidos-mongo/:id", PartidoMongoController.obtenerPorId);
router.post("/api/partidos-mongo", PartidoMongoController.crear);
router.put("/api/partidos-mongo/:id", PartidoMongoController.actualizar);
router.delete("/api/partidos-mongo/:id", PartidoMongoController.eliminar);

module.exports = router;
