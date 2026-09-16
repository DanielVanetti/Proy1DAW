const express = require("express");
const path = require("path");

const router = express.Router();

const FiguraMongoController = require("../controllers/figuraMongoController");

router.get("/figuras-mongo/pagina", (req, res) => {

    res.sendFile(path.join(__dirname, "..", "views", "figurasMongo.html"));

});

router.get("/api/figuras-mongo", FiguraMongoController.listar);
router.get("/api/figuras-mongo/:id", FiguraMongoController.obtenerPorId);
router.post("/api/figuras-mongo", FiguraMongoController.crear);
router.put("/api/figuras-mongo/:id", FiguraMongoController.actualizar);
router.delete("/api/figuras-mongo/:id", FiguraMongoController.eliminar);

module.exports = router;
