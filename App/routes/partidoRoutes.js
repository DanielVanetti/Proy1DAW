const express = require("express");
 
const router = express.Router();
 
const PartidoController =
require("../controllers/partidoController");
 
 
const path = require("path");
 
 
/*
==================================
Mostrar página CRUD
==================================
*/
 
router.get(
    "/partidos/pagina",
    (req,res)=>{
 
        res.sendFile(
 
            path.join(
 
                __dirname,
 
                "..",
 
                "views",
 
                "partidos.html"
 
            )
 
        );
 
    }
);
 
 
 
/*
==================================
Consultar partidos
==================================
*/
 
router.get(
 
    "/partidos",
 
    PartidoController.listar
 
);
 
 
 
/*
==================================
Crear partido
==================================
*/
 
router.post(
 
    "/partidos",
 
    PartidoController.guardar
 
);
 
 
 
/*
==================================
Modificar partido
==================================
*/
 
router.put(
 
    "/partidos",
 
    PartidoController.modificar
 
);
 
 
 
/*
==================================
Eliminar partido
==================================
*/
 
router.delete(
 
    "/partidos/:codigo",
 
    PartidoController.eliminar
 
);
 
 
 
module.exports = router;