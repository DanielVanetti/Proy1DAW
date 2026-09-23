const conectarMongoDB =
    require("../config/mongodb");
 
const { ObjectId } =
    require("mongodb");
 
 
class PartidoMongoDAO {
 
 
    // ==========================
    // CREAR
    // ==========================
 
    async crear(partido) {

        const db =
            await conectarMongoDB();


        const documento = {
 
            tipo: "partido",
 
            nombre: partido.nombre,
 
            siglas: partido.siglas,
 
            ideologia: partido.ideologia,
 
            fechaFundacion: partido.fechaFundacion,
 
            sede: partido.sede,
 
            sitioWeb: partido.sitioWeb,
 
            numMilitantes: Number(
                partido.numMilitantes
            ),
 
            liderActual: partido.liderActual,
 
            coloresRepresentativos:
                partido.coloresRepresentativos,
 
            presenciaRegional:
                partido.presenciaRegional,
 
            numeroDiputados: Number(
                partido.numeroDiputados
            ),
 
            descripcion: partido.descripcion,
 
            // El logo llega BINARIO desde el controlador
            logo: partido.logo || null
        };


        const resultado =
            await db
                .collection("CollMongoDB")
                .insertOne(documento);


        return {

            _id: resultado.insertedId,

            ...documento

        };
    }
 
 
    // ==========================
    // CONSULTAR TODOS
    // ==========================
 
    async obtenerTodos(saltar, limite) {
 
        const db =
            await conectarMongoDB();
 
 
        // CARGA LAZY: lista sin imagen, paginada
        return await db
            .collection("CollMongoDB")
            .find({
                tipo: "partido"
            })
            .project({
                logo: 0
            })
            .skip(saltar)
            .limit(limite)
            .toArray();
    }
 
 
    // ==========================
    // CONTAR
    // ==========================
 
    async contar() {
 
        const db =
            await conectarMongoDB();
 
 
        // Total de documentos, para que la vista sepa
        // cuando ya no queda nada por cargar
 
        return await db
            .collection("CollMongoDB")
            .countDocuments({
                tipo: "partido"
            });
    }
 
 
    // ==========================
    // CONSULTAR UNO
    // ==========================
 
    async obtenerPorId(id) {
 
        const db =
            await conectarMongoDB();
 
 
        // Si el ObjectId no es valido se devuelve null y el
        // controlador responde 404, igual que cuando no existe
 
        if (!ObjectId.isValid(id)) {
 
            return null;
        }
 
 
        // CARGA LAZY: aquí sí se trae el documento completo con la imagen
        return await db
            .collection("CollMongoDB")
            .findOne({
                _id: new ObjectId(id),
                tipo: "partido"
            });
    }
 
 
    // ==========================
    // ACTUALIZAR
    // ==========================
 
    async actualizar(id, partido) {
 
        const db =
            await conectarMongoDB();
 
 
        // Si el ObjectId no es valido se devuelve null y el
        // controlador responde 404, igual que cuando no existe
 
        if (!ObjectId.isValid(id)) {
 
            return null;
        }
 
 
        const datos = {
 
            nombre: partido.nombre,
 
            siglas: partido.siglas,
 
            ideologia: partido.ideologia,
 
            fechaFundacion: partido.fechaFundacion,
 
            sede: partido.sede,
 
            sitioWeb: partido.sitioWeb,
 
            numMilitantes: Number(
                partido.numMilitantes
            ),
 
            liderActual: partido.liderActual,
 
            coloresRepresentativos:
                partido.coloresRepresentativos,
 
            presenciaRegional:
                partido.presenciaRegional,
 
            numeroDiputados: Number(
                partido.numeroDiputados
            ),
 
            descripcion:
                partido.descripcion
        };
 


        if (partido.logo) {

            datos.logo = partido.logo;
        }
 
 
        const resultado =
            await db
                .collection("CollMongoDB")
                .updateOne(
 
                    {
                        _id:
                            new ObjectId(id),
                        tipo: "partido"
                    },
 
                    {
                        $set: datos
                    }
 
                );
 
 
        if (resultado.matchedCount === 0) {
 
            return null;
        }
 
 
        return await this.obtenerPorId(id);
    }
 
 
    // ==========================
    // ELIMINAR
    // ==========================
 
    async eliminar(id) {
 
        const db =
            await conectarMongoDB();
 
 
        const partido =
            await this.obtenerPorId(id);
 
 
        if (!partido) {
 
            return null;
        }
 
 
        await db
            .collection("CollMongoDB")
            .deleteOne({
 
                _id:
                    new ObjectId(id)
 
            });
 
 
        return partido;
    }
 
}
 
 
module.exports = PartidoMongoDAO;