const FiguraMongoService =
    require("../services/figuraMongoService");
 
// Logger de acciones
const Logger =
    require("../utils/logger");
 
 
const service =
    new FiguraMongoService();


// El campo "foto" es binario (BinData) y MongoDB lo devuelve como Binary

const serializarImagen = (figura) => {

    let foto = null;

    if (figura.foto) {

        if (Buffer.isBuffer(figura.foto)) {

            foto = figura.foto.toString("base64");

        } else {

            foto = Buffer.from(figura.foto.buffer).toString("base64");
        }
    }

    return {
        ...figura,
        foto: foto
    };
};



const deserializarImagen = (cuerpo) => {

    let fotoBinaria = null;

    if (cuerpo.foto) {

        fotoBinaria = Buffer.from(cuerpo.foto, "base64");
    }

    return {
        ...cuerpo,
        foto: fotoBinaria
    };
};
 
 
class FiguraMongoController {
 
 
 
    // ==================================================
    // MONGODB + DAO
    // ==================================================
 
 
    static async crearMongo(
        req,
        res
    ) {
 
        try {
 
            const figura =
                await service.crearMongo(
                    deserializarImagen(req.body)
                );

            Logger.registrar(
                "Crear figura pública " + figura._id + " (MongoDB)"
            );


            res.json({

                mensaje:
                    "MongoDB: figura pública creada",

                figura:
                    serializarImagen(figura)

            });
 
 
        } catch (error) {
 
            console.error(error);
 
            Logger.registrar(
                "Error al crear figura pública en MongoDB: " + error.message
            );
 
            res.status(500).json({
 
                mensaje:
                    "Error al crear en MongoDB"
 
            });
        }
    }
 
 
 
    static async obtenerTodosMongo(
        req,
        res
    ) {
 
        try {
 
            // CARGA LAZY: la vista pide los documentos de 10 en 10 con el boton VER MAS

            let saltar = Number(req.query.saltar);

            if (!saltar) {

                saltar = 0;
            }


            let limite = Number(req.query.limite);

            if (!limite) {

                limite = 10;
            }


            const figuras =
                await service.obtenerTodosMongo(saltar, limite);
 
 
            // Total de documentos en la coleccion, para que la
            // vista sepa cuando esconder el boton VER MAS
 
            const total =
                await service.contarMongo();
 
 
            Logger.registrar(
                "Consultar todas las figuras públicas"
            );
 
 
            res.json({
 
                mensaje:
                    "MongoDB: consulta realizada",
 
                figuras,
 
                total
 
            });
 
 
        } catch (error) {
 
            console.error(error);
 
            Logger.registrar(
                "Error consultando figuras públicas en MongoDB: " + error.message
            );
 
            res.status(500).json({
 
                mensaje:
                    "Error consultando MongoDB"
 
            });
        }
    }
 
 
 
    static async obtenerPorIdMongo(
        req,
        res
    ) {
 
        try {
 
            const figura =
                await service.obtenerPorIdMongo(
                    req.params.id
                );
 
 
            if (!figura) {
 
                Logger.registrar(
                    "Figura pública " + req.params.id + " no encontrada (MongoDB)"
                );
 
                return res.status(404).json({
 
                    mensaje:
                        "Figura pública no encontrada en MongoDB"
 
                });
            }
 
            Logger.registrar(
                "Consultar figura pública " + req.params.id
            );
 
 
            res.json({
 
                mensaje:
                    "MongoDB: figura pública encontrada",

                figura:
                    serializarImagen(figura)

            });
 
 
        } catch (error) {
 
            console.error(error);
 
            Logger.registrar(
                "Error consultando figura pública en MongoDB: " + error.message
            );
 
            res.status(500).json({
 
                mensaje:
                    "Error consultando MongoDB"
 
            });
        }
    }
 
 
 
    static async actualizarMongo(
        req,
        res
    ) {
 
        try {
 
            const figura =
                await service.actualizarMongo(

                    req.params.id,

                    deserializarImagen(req.body)

                );
 
 
            if (!figura) {
 
                Logger.registrar(
                    "Figura pública " + req.params.id + " no encontrada (MongoDB)"
                );
 
                return res.status(404).json({
 
                    mensaje:
                        "Figura pública no encontrada en MongoDB"
 
                });
            }
 
 
            Logger.registrar(
                "Actualizar figura pública " + req.params.id + " (MongoDB)"
            );
 
 
            res.json({
 
                mensaje:
                    "MongoDB: figura pública actualizada",

                figura:
                    serializarImagen(figura)

            });
 
 
        } catch (error) {
 
            console.error(error);
 
            Logger.registrar(
                "Error actualizando figura pública en MongoDB: " + error.message
            );
 
            res.status(500).json({
 
                mensaje:
                    "Error actualizando MongoDB"
 
            });
        }
    }
 
 
 
    static async eliminarMongo(
        req,
        res
    ) {
 
        try {
 
            const figura =
                await service.eliminarMongo(
                    req.params.id
                );
 
 
            if (!figura) {
 
                Logger.registrar(
                    "Figura pública " + req.params.id + " no encontrada (MongoDB)"
                );
 
                return res.status(404).json({
 
                    mensaje:
                        "Figura pública no encontrada en MongoDB"
 
                });
            }
 
 
            Logger.registrar(
                "Eliminar figura pública " + req.params.id + " (MongoDB)"
            );
 
 
            res.json({
 
                mensaje:
                    "MongoDB: figura pública eliminada",
 
                figura:
                    serializarImagen(figura)
 
            });
 
 
        } catch (error) {
 
            console.error(error);
 
            Logger.registrar(
                "Error eliminando figura pública en MongoDB: " + error.message
            );
 
            res.status(500).json({
 
                mensaje:
                    "Error eliminando MongoDB"
 
            });
        }
    }
 
}
 
 
module.exports =
    FiguraMongoController;