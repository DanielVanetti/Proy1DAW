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
 
            redesSociales: partido.redesSociales,
 
            numeroDiputados: Number(
                partido.numeroDiputados
            ),
 
            estadoLegal: partido.estadoLegal,
 
            descripcion: partido.descripcion,
 
            logoBase64:
                partido.logoBase64 || null
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
 
    async obtenerTodos() {
 
        const db =
            await conectarMongoDB();
 
 
        // CARGA LAZY : aquí se trae solo la lista de documentos sin la imagen
        return await db
            .collection("CollMongoDB")
            .find({
                tipo: "partido"
            })
            .project({
                logoBase64: 0
            })
            .toArray();
    }
 
 
    // ==========================
    // CONSULTAR UNO
    // ==========================
 
    async obtenerPorId(id) {
 
        const db =
            await conectarMongoDB();
 
 
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
 
            redesSociales: partido.redesSociales,
 
            numeroDiputados: Number(
                partido.numeroDiputados
            ),
 
            estadoLegal: partido.estadoLegal,
 
            descripcion:
                partido.descripcion
        };
 

        if (partido.logoBase64) {
 
            datos.logoBase64 =
                partido.logoBase64;
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