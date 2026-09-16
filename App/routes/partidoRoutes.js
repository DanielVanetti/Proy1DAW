const express = require("express");

const router = express.Router();

const PartidoController = require("../controllers/partidoController");

const path = require("path");

router.get("/partidos/pagina", (req, res) => {

    res.sendFile(path.join(__dirname, "..", "views", "partidos.html"));

});

router.get("/partidos", PartidoController.listar);

router.post("/partidos", PartidoController.guardar);

router.put("/partidos", PartidoController.modificar);

router.delete("/partidos/:codigo", PartidoController.eliminar);

module.exports = router;
