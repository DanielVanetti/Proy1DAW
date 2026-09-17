const conectarMongoDB =
    require("../config/mongodb");
 
const { ObjectId } =
    require("mongodb");
 
 
class FiguraMongoDAO {
 
 
    // ==========================
    // CREAR
    // ==========================
 
    async crear(figura) {
 
        const db =
            await conectarMongoDB();
 
        const documento = {
 
            // AGREGADO: "tipo" separa las 120 figuras de los 60 partidos
            // porque ambos conjuntos se guardan en la colección CollMongoDB
            tipo: "figura",
 
            nombreCompleto: figura.nombreCompleto,
 
            cargoActual: figura.cargoActual,
 
            partido: figura.partido,
 
            fechaNacimiento: figura.fechaNacimiento,
 
            nacionalidad: figura.nacionalidad,
 
            nivelEducativo: figura.nivelEducativo,
 
            universidad: figura.universidad,
 
            profesion: figura.profesion,
 
            aniosExperiencia: Number(
                figura.aniosExperiencia
            ),
 
            cargosAnteriores: figura.cargosAnteriores,
 
            propuestasPrincipales:
                figura.propuestasPrincipales,
 
            redesSociales: figura.redesSociales,
 
            popularidadEstimada: Number(
                figura.popularidadEstimada
            ),
 
            regionRepresentada:
                figura.regionRepresentada,
 
            fechaInicioCargo: figura.fechaInicioCargo,
 
            fechaFinCargo:
                figura.fechaFinCargo || null,
 
            estadoCivil: figura.estadoCivil,
 
            idiomas: figura.idiomas,
 
            premiosReconocimientos:
                figura.premiosReconocimientos,
 
            controversias: figura.controversias,
 
            biografiaCorta: figura.biografiaCorta,
 
            sitioWebOficial: figura.sitioWebOficial,
 
            numeroSeguidores: Number(
                figura.numeroSeguidores
            ),
 
            afiliaciones: figura.afiliaciones,
 
            // AGREGADO: imagen serializada en base64 (no está en S5)
            fotoBase64:
                figura.fotoBase64 || null
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
        // la lista de los 120 documentos NO trae el campo fotoBase64
        // (se excluye con project). La imagen solo se carga cuando se
        // consulta un documento específico con obtenerPorId (botón CONSULTAR).
        return await db
            .collection("CollMongoDB")
            .find({
                tipo: "figura"
            })
            .project({
                fotoBase64: 0
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
                tipo: "figura"
            });
    }
 
 
    // ==========================
    // ACTUALIZAR
    // ==========================
 
    async actualizar(id, figura) {
 
        const db =
            await conectarMongoDB();
 
 
        const datos = {
 
            nombreCompleto: figura.nombreCompleto,
 
            cargoActual: figura.cargoActual,
 
            partido: figura.partido,
 
            fechaNacimiento: figura.fechaNacimiento,
 
            nacionalidad: figura.nacionalidad,
 
            nivelEducativo: figura.nivelEducativo,
 
            universidad: figura.universidad,
 
            profesion: figura.profesion,
 
            aniosExperiencia: Number(
                figura.aniosExperiencia
            ),
 
            cargosAnteriores: figura.cargosAnteriores,
 
            propuestasPrincipales:
                figura.propuestasPrincipales,
 
            redesSociales: figura.redesSociales,
 
            popularidadEstimada: Number(
                figura.popularidadEstimada
            ),
 
            regionRepresentada:
                figura.regionRepresentada,
 
            fechaInicioCargo: figura.fechaInicioCargo,
 
            fechaFinCargo:
                figura.fechaFinCargo || null,
 
            estadoCivil: figura.estadoCivil,
 
            idiomas: figura.idiomas,
 
            premiosReconocimientos:
                figura.premiosReconocimientos,
 
            controversias: figura.controversias,
 
            biografiaCorta: figura.biografiaCorta,
 
            sitioWebOficial: figura.sitioWebOficial,
 
            numeroSeguidores: Number(
                figura.numeroSeguidores
            ),
 
            afiliaciones:
                figura.afiliaciones
        };
 
 
        // AGREGADO: la imagen solo se reemplaza si se seleccionó una nueva
        if (figura.fotoBase64) {
 
            datos.fotoBase64 =
                figura.fotoBase64;
        }
 
 
        const resultado =
            await db
                .collection("CollMongoDB")
                .updateOne(
 
                    {
                        _id:
                            new ObjectId(id),
                        tipo: "figura"
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
 
 
        const figura =
            await this.obtenerPorId(id);
 
 
        if (!figura) {
 
            return null;
        }
 
 
        await db
            .collection("CollMongoDB")
            .deleteOne({
 
                _id:
                    new ObjectId(id)
 
            });
 
 
        return figura;
    }
 
}
 
 
module.exports = FiguraMongoDAO;