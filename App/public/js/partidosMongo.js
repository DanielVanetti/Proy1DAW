// ==================================================
// CONFIGURACIÓN
// ==================================================
 
const API =
    "/api/partidos";
 
 
// CARGA LAZY: los documentos se piden de 10 en 10.
// saltarMongo: lleva la cuenta de los que ya se cargaron.
 
const LIMITE_MONGO = 10;
 
let saltarMongo = 0;
 
let documentosMongo = [];
 
 
// ==================================================
// FUNCIONES GENERALES
// ==================================================
 
function obtenerDatos() {
 
    return {
 
        nombre:
            document.getElementById(
                "nombre"
            ).value,
 
        siglas:
            document.getElementById(
                "siglas"
            ).value,
 
        ideologia:
            document.getElementById(
                "ideologia"
            ).value,
 
        fechaFundacion:
            document.getElementById(
                "fechaFundacion"
            ).value,
 
        sede:
            document.getElementById(
                "sede"
            ).value,
 
        sitioWeb:
            document.getElementById(
                "sitioWeb"
            ).value,
 
        numMilitantes:
            document.getElementById(
                "numMilitantes"
            ).value,
 
        liderActual:
            document.getElementById(
                "liderActual"
            ).value,
 
        coloresRepresentativos:
            document.getElementById(
                "coloresRepresentativos"
            ).value,
 
        presenciaRegional:
            document.getElementById(
                "presenciaRegional"
            ).value,
 
        numeroDiputados:
            document.getElementById(
                "numeroDiputados"
            ).value,
 
        descripcion:
            document.getElementById(
                "descripcion"
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
// SERIALIZAR IMAGEN
// SERIALIZAR IMAGEN
// ==================================================
 
 
// Lee el archivo seleccionado y lo convierte a texto base64
 
function leerImagen() {
 
    return new Promise(
        (resolve, reject) => {
 
            const archivo =
                document.getElementById(
                    "logo"
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
            "vistaLogo"
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
 
    const partido =
        obtenerDatos();
 
 
    // Imagen serializada en base64
 
    partido.logo =
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
                        partido
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
        "nombre"
    ).value =
        datos.partido.nombre;
 
 
    document.getElementById(
        "siglas"
    ).value =
        datos.partido.siglas;
 
 
    document.getElementById(
        "ideologia"
    ).value =
        datos.partido.ideologia;
 
 
    document.getElementById(
        "fechaFundacion"
    ).value =
        datos.partido.fechaFundacion;
 
 
    document.getElementById(
        "sede"
    ).value =
        datos.partido.sede;
 
 
    document.getElementById(
        "sitioWeb"
    ).value =
        datos.partido.sitioWeb;
 
 
    document.getElementById(
        "numMilitantes"
    ).value =
        datos.partido.numMilitantes;
 
 
    document.getElementById(
        "liderActual"
    ).value =
        datos.partido.liderActual;
 
 
    document.getElementById(
        "coloresRepresentativos"
    ).value =
        datos.partido.coloresRepresentativos;
 
 
    document.getElementById(
        "presenciaRegional"
    ).value =
        datos.partido.presenciaRegional;
 
 
    document.getElementById(
        "numeroDiputados"
    ).value =
        datos.partido.numeroDiputados;
 
 
    document.getElementById(
        "descripcion"
    ).value =
        datos.partido.descripcion;
 
 
    // CARGA LAZY: el logo solo llega al consultar
    // un documento específico, no en MOSTRAR TODOS
 
    mostrarImagen(
        datos.partido.logo
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
 
 
    const partido =
        obtenerDatos();
 
 
    // Imagen serializada en base64
 
    partido.logo =
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
                        partido
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
 
    // vuelve a cargar la misma cantidad de filas que ya estaba desplegada
 
    let cantidad = saltarMongo;
 
 
    if (cantidad < LIMITE_MONGO) {
 
        cantidad = LIMITE_MONGO;
    }
 
 
    saltarMongo = 0;
 
    documentosMongo = [];
 
 
    await cargarMongo(cantidad);
}
 
 
 
// VER MAS (CARGA LAZY)
 
function verMas() {
 
    cargarMongo(LIMITE_MONGO);
}
 
 
 
// CARGA LAZY: trae solo la siguiente tanda de documentos, saltando los que ya estan en la tabla
 
async function cargarMongo(cantidad) {
 
    const respuesta =
        await fetch(
 
            `${API}/mongo?saltar=${saltarMongo}&limite=${cantidad}`
 
        );
 
 
    const datos =
        await respuesta.json();
 
 
    // los documentos nuevos se suman a los que ya estaban
 
    documentosMongo =
        documentosMongo.concat(datos.partidos);
 
 
    saltarMongo =
        saltarMongo + datos.partidos.length;
 
 
 
    const boton =
        document.getElementById(
            "botonVerMas"
        );
 
 
    if (datos.partidos.length < cantidad) {
 
        boton.style.display = "none";
 
    } else {
 
        boton.style.display = "inline-block";
    }
 
 
    dibujarMongo();
}
 
 
 
// DIBUJAR LA TABLA
 
function dibujarMongo() {
 
    const tabla =
        document.getElementById(
            "tablaMongo"
        );
 
 
    tabla.innerHTML = "";
 
 
    // CARGA LAZY: estos documentos llegan sin logo
 
    documentosMongo.forEach(
        partido => {
 
            const fila =
                document.createElement(
                    "tr"
                );
 
 
            fila.innerHTML = `
 
                <td>
                    ${partido._id}
                </td>
 
                <td>
                    ${partido.nombre}
                </td>
 
                <td>
                    ${partido.siglas}
                </td>
 
                <td>
                    ${partido.ideologia}
                </td>
 
                <td>
                    ${partido.fechaFundacion}
                </td>
 
                <td>
                    ${partido.sede}
                </td>
 
                <td>
                    ${partido.sitioWeb}
                </td>
 
                <td>
                    ${partido.numMilitantes}
                </td>
 
                <td>
                    ${partido.liderActual}
                </td>
 
                <td>
                    ${partido.coloresRepresentativos}
                </td>
 
                <td>
                    ${partido.presenciaRegional}
                </td>
 
                <td>
                    ${partido.numeroDiputados}
                </td>
 
                <td>
                    ${partido.descripcion}
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