const express = require("express");

const router = express.Router();

const FiguraPublicaController = require("../controllers/figuraPublicaController");

const path = require("path");

router.get("/figuras/pagina", (req, res) => {

    res.sendFile(path.join(__dirname, "..", "views", "figuras.html"));

});

router.get("/figuras", FiguraPublicaController.listar);

router.post("/figuras", FiguraPublicaController.guardar);

router.put("/figuras", FiguraPublicaController.modificar);

router.delete("/figuras/:codigo", FiguraPublicaController.eliminar);

module.exports = router;
