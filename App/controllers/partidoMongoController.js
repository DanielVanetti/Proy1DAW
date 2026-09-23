const PartidoMongoService =
    require("../services/partidoMongoService");
 
// Logger de acciones
const Logger =
    require("../utils/logger");
 
 
const service =
    new PartidoMongoService();


// El campo "foto" es binario (BinData) y MongoDB lo devuelve como Binary

const serializarImagen = (partido) => {

    let logo = null;

    if (partido.logo) {

        if (Buffer.isBuffer(partido.logo)) {

            logo = partido.logo.toString("base64");

        } else {

            logo = Buffer.from(partido.logo.buffer).toString("base64");
        }
    }

    return {
        ...partido,
        logo: logo
    };
};



const deserializarImagen = (cuerpo) => {

    let logoBinario = null;

    if (cuerpo.logo) {

        logoBinario = Buffer.from(cuerpo.logo, "base64");
    }

    return {
        ...cuerpo,
        logo: logoBinario
    };
};
 
 
class PartidoMongoController {
 
 
 
    // ==================================================
    // MONGODB + DAO
    // ==================================================
 
 
    static async crearMongo(
        req,
        res
    ) {
 
        try {
 
            const partido =
                await service.crearMongo(
                    deserializarImagen(req.body)
                );


            Logger.registrar(
                "Crear partido " + partido._id + " (MongoDB)"
            );


            res.json({

                mensaje:
                    "MongoDB: partido creado",

                partido:
                    serializarImagen(partido)

            });
 
 
        } catch (error) {
 
            console.error(error);
 
            Logger.registrar(
                "Error al crear partido en MongoDB: " + error.message
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


            const partidos =
                await service.obtenerTodosMongo(saltar, limite);
 
 
            // Total de documentos en la coleccion, para que la
            // vista sepa cuando esconder el boton VER MAS
 
            const total =
                await service.contarMongo();
 
 
            Logger.registrar(
                "Consultar todos los partidos, sin imagen - carga lazy (MongoDB)"
            );
 
 
            res.json({
 
                mensaje:
                    "MongoDB: consulta realizada",
 
                partidos,
 
                total
 
            });
 
 
        } catch (error) {
 
            console.error(error);
 
            Logger.registrar(
                "Error consultando partidos en MongoDB: " + error.message
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
 
            const partido =
                await service.obtenerPorIdMongo(
                    req.params.id
                );
 
 
            if (!partido) {
 
                Logger.registrar(
                    "Partido " + req.params.id + " no encontrado (MongoDB)"
                );
 
                return res.status(404).json({
 
                    mensaje:
                        "Partido no encontrado en MongoDB"
 
                });
            }
 
 
            Logger.registrar(
                "Consultar partido " + req.params.id + " con imagen - carga lazy (MongoDB)"
            );


            res.json({

                mensaje:
                    "MongoDB: partido encontrado",

                partido:
                    serializarImagen(partido)

            });
 
 
        } catch (error) {
 
            console.error(error);
 
            Logger.registrar(
                "Error consultando partido en MongoDB: " + error.message
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
 
            const partido =
                await service.actualizarMongo(

                    req.params.id,

                    deserializarImagen(req.body)

                );
 
 
            if (!partido) {
 
                Logger.registrar(
                    "Partido " + req.params.id + " no encontrado (MongoDB)"
                );
 
                return res.status(404).json({
 
                    mensaje:
                        "Partido no encontrado en MongoDB"
 
                });
            }
 
 
            Logger.registrar(
                "Actualizar partido " + req.params.id + " (MongoDB)"
            );
 
 
            res.json({

                mensaje:
                    "MongoDB: partido actualizado",

                partido:
                    serializarImagen(partido)

            });
 
 
        } catch (error) {
 
            console.error(error);
 
            Logger.registrar(
                "Error actualizando partido en MongoDB: " + error.message
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
 
            const partido =
                await service.eliminarMongo(
                    req.params.id
                );
 
 
            if (!partido) {

                Logger.registrar(
                    "Partido " + req.params.id + " no encontrado (MongoDB)"
                );
 
                return res.status(404).json({
 
                    mensaje:
                        "Partido no encontrado en MongoDB"
 
                });
            }
 
 
            Logger.registrar(
                "Eliminar partido " + req.params.id + " (MongoDB)"
            );
 
 
            res.json({
 
                mensaje:
                    "MongoDB: partido eliminado",
 
                partido:
                    serializarImagen(partido)
 
            });
 
 
        } catch (error) {
 
            console.error(error);
 
            Logger.registrar(
                "Error eliminando partido en MongoDB: " + error.message
            );
 
            res.status(500).json({
 
                mensaje:
                    "Error eliminando MongoDB"
 
            });
        }
    }
 
}
 
 
module.exports =
    PartidoMongoController;