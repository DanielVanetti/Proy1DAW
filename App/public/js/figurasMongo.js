// ==================================================
// CONFIGURACIÓN
// ==================================================
 
const API =
    "/api/figuras";
 
 
// ==================================================
// FUNCIONES GENERALES
// ==================================================
 
function obtenerDatos() {
 
    return {
 
        nombreCompleto:
            document.getElementById(
                "nombreCompleto"
            ).value,
 
        cargoActual:
            document.getElementById(
                "cargoActual"
            ).value,
 
        partido:
            document.getElementById(
                "partido"
            ).value,
 
        fechaNacimiento:
            document.getElementById(
                "fechaNacimiento"
            ).value,
 
        nacionalidad:
            document.getElementById(
                "nacionalidad"
            ).value,
 
        nivelEducativo:
            document.getElementById(
                "nivelEducativo"
            ).value,
 
        universidad:
            document.getElementById(
                "universidad"
            ).value,
 
        profesion:
            document.getElementById(
                "profesion"
            ).value,
 
        aniosExperiencia:
            document.getElementById(
                "aniosExperiencia"
            ).value,
 
        cargosAnteriores:
            document.getElementById(
                "cargosAnteriores"
            ).value,
 
        propuestasPrincipales:
            document.getElementById(
                "propuestasPrincipales"
            ).value,
 
        redesSociales:
            document.getElementById(
                "redesSociales"
            ).value,
 
        popularidadEstimada:
            document.getElementById(
                "popularidadEstimada"
            ).value,
 
        regionRepresentada:
            document.getElementById(
                "regionRepresentada"
            ).value,
 
        fechaInicioCargo:
            document.getElementById(
                "fechaInicioCargo"
            ).value,
 
        fechaFinCargo:
            document.getElementById(
                "fechaFinCargo"
            ).value,
 
        estadoCivil:
            document.getElementById(
                "estadoCivil"
            ).value,
 
        idiomas:
            document.getElementById(
                "idiomas"
            ).value,
 
        premiosReconocimientos:
            document.getElementById(
                "premiosReconocimientos"
            ).value,
 
        controversias:
            document.getElementById(
                "controversias"
            ).value,
 
        biografiaCorta:
            document.getElementById(
                "biografiaCorta"
            ).value,
 
        sitioWebOficial:
            document.getElementById(
                "sitioWebOficial"
            ).value,
 
        numeroSeguidores:
            document.getElementById(
                "numeroSeguidores"
            ).value,
 
        afiliaciones:
            document.getElementById(
                "afiliaciones"
            ).value
 
    };
}
 
 
function obtenerId() {
 
    return document.getElementById(
        "id"
    ).value;
}
 
 
function mostrarMensaje(texto) {
 
    document.getElementById(
        "mensaje"
    ).textContent = texto;
}
 
 
 
// ==================================================
// AGREGADO: SERIALIZAR IMAGEN (no está en S5)
// ==================================================
 
 
// Lee el archivo seleccionado y lo convierte a texto base64
 
function leerImagen() {
 
    return new Promise(
        (resolve, reject) => {
 
            const archivo =
                document.getElementById(
                    "foto"
                ).files[0];
 
 
            if (!archivo) {
 
                resolve(null);
 
                return;
            }
 
 
            const lector =
                new FileReader();
 
 
            lector.onload = () =>
                resolve(
                    lector.result.split(",")[1]
                );
 
 
            lector.onerror = reject;
 
 
            lector.readAsDataURL(
                archivo
            );
        }
    );
}
 
 
// Muestra en la vista la imagen que llega serializada en base64
 
function mostrarImagen(base64) {
 
    const imagen =
        document.getElementById(
            "vistaFoto"
        );
 
 
    if (base64) {
 
        imagen.src =
            "data:image/png;base64," + base64;
 
    } else {
 
        imagen.removeAttribute(
            "src"
        );
    }
}
 
 
 
// ==================================================
// MONGODB + DAO
// ==================================================
 
 
// CREAR MONGODB
 
async function crearMongo() {
 
    const figura =
        obtenerDatos();
 
 
    // AGREGADO: imagen serializada en base64
 
    figura.fotoBase64 =
        await leerImagen();
 
 
    const respuesta =
        await fetch(
 
            `${API}/mongo`,
 
            {
 
                method: "POST",
 
                headers: {
 
                    "Content-Type":
                        "application/json"
 
                },
 
                body:
                    JSON.stringify(
                        figura
                    )
            }
        );
 
 
    const datos =
        await respuesta.json();
 
 
    mostrarMensaje(
        datos.mensaje
    );
 
 
    mostrarMongo();
}
 
 
 
// CONSULTAR MONGODB
 
async function consultarMongo() {
 
    const id =
        obtenerId();
 
 
    if (!id) {
 
        mostrarMensaje(
            "Ingrese el ObjectId de MongoDB"
        );
 
        return;
    }
 
 
    const respuesta =
        await fetch(
 
            `${API}/mongo/${id}`
 
        );
 
 
    const datos =
        await respuesta.json();
 
 
    if (!respuesta.ok) {
 
        mostrarMensaje(
            datos.mensaje
        );
 
        return;
    }
 
 
    document.getElementById(
        "nombreCompleto"
    ).value =
        datos.figura.nombreCompleto;
 
 
    document.getElementById(
        "cargoActual"
    ).value =
        datos.figura.cargoActual;
 
 
    document.getElementById(
        "partido"
    ).value =
        datos.figura.partido;
 
 
    document.getElementById(
        "fechaNacimiento"
    ).value =
        datos.figura.fechaNacimiento;
 
 
    document.getElementById(
        "nacionalidad"
    ).value =
        datos.figura.nacionalidad;
 
 
    document.getElementById(
        "nivelEducativo"
    ).value =
        datos.figura.nivelEducativo;
 
 
    document.getElementById(
        "universidad"
    ).value =
        datos.figura.universidad;
 
 
    document.getElementById(
        "profesion"
    ).value =
        datos.figura.profesion;
 
 
    document.getElementById(
        "aniosExperiencia"
    ).value =
        datos.figura.aniosExperiencia;
 
 
    document.getElementById(
        "cargosAnteriores"
    ).value =
        datos.figura.cargosAnteriores;
 
 
    document.getElementById(
        "propuestasPrincipales"
    ).value =
        datos.figura.propuestasPrincipales;
 
 
    document.getElementById(
        "redesSociales"
    ).value =
        datos.figura.redesSociales;
 
 
    document.getElementById(
        "popularidadEstimada"
    ).value =
        datos.figura.popularidadEstimada;
 
 
    document.getElementById(
        "regionRepresentada"
    ).value =
        datos.figura.regionRepresentada;
 
 
    document.getElementById(
        "fechaInicioCargo"
    ).value =
        datos.figura.fechaInicioCargo;
 
 
    document.getElementById(
        "fechaFinCargo"
    ).value =
        datos.figura.fechaFinCargo;
 
 
    document.getElementById(
        "estadoCivil"
    ).value =
        datos.figura.estadoCivil;
 
 
    document.getElementById(
        "idiomas"
    ).value =
        datos.figura.idiomas;
 
 
    document.getElementById(
        "premiosReconocimientos"
    ).value =
        datos.figura.premiosReconocimientos;
 
 
    document.getElementById(
        "controversias"
    ).value =
        datos.figura.controversias;
 
 
    document.getElementById(
        "biografiaCorta"
    ).value =
        datos.figura.biografiaCorta;
 
 
    document.getElementById(
        "sitioWebOficial"
    ).value =
        datos.figura.sitioWebOficial;
 
 
    document.getElementById(
        "numeroSeguidores"
    ).value =
        datos.figura.numeroSeguidores;
 
 
    document.getElementById(
        "afiliaciones"
    ).value =
        datos.figura.afiliaciones;
 
 
    // CARGA LAZY (AGREGADO): la foto solo llega al consultar
    // un documento específico, no en MOSTRAR TODOS
 
    mostrarImagen(
        datos.figura.fotoBase64
    );
 
 
    mostrarMensaje(
        datos.mensaje
    );
}
 
 
 
// ACTUALIZAR MONGODB
 
async function actualizarMongo() {
 
    const id =
        obtenerId();
 
 
    if (!id) {
 
        mostrarMensaje(
            "Ingrese el ObjectId de MongoDB"
        );
 
        return;
    }
 
 
    const figura =
        obtenerDatos();
 
 
    // AGREGADO: imagen serializada en base64
 
    figura.fotoBase64 =
        await leerImagen();
 
 
    const respuesta =
        await fetch(
 
            `${API}/mongo/${id}`,
 
            {
 
                method: "PUT",
 
                headers: {
 
                    "Content-Type":
                        "application/json"
 
                },
 
                body:
                    JSON.stringify(
                        figura
                    )
            }
        );
 
 
    const datos =
        await respuesta.json();
 
 
    mostrarMensaje(
        datos.mensaje
    );
 
 
    mostrarMongo();
}
 
 
 
// ELIMINAR MONGODB
 
async function eliminarMongo() {
 
    const id =
        obtenerId();
 
 
    if (!id) {
 
        mostrarMensaje(
            "Ingrese el ObjectId de MongoDB"
        );
 
        return;
    }
 
 
    const respuesta =
        await fetch(
 
            `${API}/mongo/${id}`,
 
            {
 
                method: "DELETE"
 
            }
        );
 
 
    const datos =
        await respuesta.json();
 
 
    mostrarMensaje(
        datos.mensaje
    );
 
 
    mostrarMongo();
}
 
 
 
// MOSTRAR TODOS MONGODB
 
async function mostrarMongo() {
 
    const respuesta =
        await fetch(
 
            `${API}/mongo`
 
        );
 
 
    const datos =
        await respuesta.json();
 
 
    const tabla =
        document.getElementById(
            "tablaMongo"
        );
 
 
    tabla.innerHTML = "";
 
 
    // CARGA LAZY (AGREGADO): estos documentos llegan sin fotoBase64
 
    datos.figuras.forEach(
        figura => {
 
            const fila =
                document.createElement(
                    "tr"
                );
 
 
            fila.innerHTML = `
 
                <td>
                    ${figura._id}
                </td>
 
                <td>
                    ${figura.nombreCompleto}
                </td>
 
                <td>
                    ${figura.cargoActual}
                </td>
 
                <td>
                    ${figura.partido}
                </td>
 
                <td>
                    ${figura.fechaNacimiento}
                </td>
 
                <td>
                    ${figura.nacionalidad}
                </td>
 
                <td>
                    ${figura.nivelEducativo}
                </td>
 
                <td>
                    ${figura.universidad}
                </td>
 
                <td>
                    ${figura.profesion}
                </td>
 
                <td>
                    ${figura.aniosExperiencia}
                </td>
 
                <td>
                    ${figura.cargosAnteriores}
                </td>
 
                <td>
                    ${figura.propuestasPrincipales}
                </td>
 
                <td>
                    ${figura.redesSociales}
                </td>
 
                <td>
                    ${figura.popularidadEstimada}
                </td>
 
                <td>
                    ${figura.regionRepresentada}
                </td>
 
                <td>
                    ${figura.fechaInicioCargo}
                </td>
 
                <td>
                    ${figura.fechaFinCargo}
                </td>
 
                <td>
                    ${figura.estadoCivil}
                </td>
 
                <td>
                    ${figura.idiomas}
                </td>
 
                <td>
                    ${figura.premiosReconocimientos}
                </td>
 
                <td>
                    ${figura.controversias}
                </td>
 
                <td>
                    ${figura.biografiaCorta}
                </td>
 
                <td>
                    ${figura.sitioWebOficial}
                </td>
 
                <td>
                    ${figura.numeroSeguidores}
                </td>
 
                <td>
                    ${figura.afiliaciones}
                </td>
 
            `;
 
 
            tabla.appendChild(
                fila
            );
 
        }
    );
}
 
 
 
// ==================================================
// CARGAR AL INICIAR
// ==================================================
 
mostrarMongo();