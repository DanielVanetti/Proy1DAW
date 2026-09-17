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
 
            // AGREGADO: "tipo" separa los 60 partidos de las 120 figuras
            // porque ambos conjuntos se guardan en la colección CollMongoDB
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
 
            // AGREGADO: imagen serializada en base64 (no está en S5)
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
 
 
        // CARGA LAZY (AGREGADO, no está en S5):
        // la lista de los 60 documentos NO trae el campo logoBase64
        // (se excluye con project). La imagen solo se carga cuando se
        // consulta un documento específico con obtenerPorId (botón CONSULTAR).
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
 
 
        // CARGA LAZY (AGREGADO): aquí sí se trae el documento completo con la imagen
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
 
 
        // AGREGADO: la imagen solo se reemplaza si se seleccionó una nueva
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