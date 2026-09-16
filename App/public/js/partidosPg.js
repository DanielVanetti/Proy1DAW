/*
==========================================
CRUD DE PARTIDOS + PROPUESTAS (Parte 2 - PostgreSQL)
==========================================
*/

document.addEventListener("DOMContentLoaded", iniciar);

function iniciar() {

    document.getElementById("btnGuardarPartido").addEventListener("click", guardarPartido);
    document.getElementById("btnModificarPartido").addEventListener("click", modificarPartido);
    document.getElementById("btnEliminarPartido").addEventListener("click", eliminarPartido);
    document.getElementById("btnLimpiarPartido").addEventListener("click", limpiarPartido);

    document.getElementById("btnGuardarPropuesta").addEventListener("click", guardarPropuesta);
    document.getElementById("btnModificarPropuesta").addEventListener("click", modificarPropuesta);
    document.getElementById("btnEliminarPropuesta").addEventListener("click", eliminarPropuesta);
    document.getElementById("btnLimpiarPropuesta").addEventListener("click", limpiarPropuesta);

    listarPartidos();
    listarPropuestas();

}

function cabeceras() {

    return {
        "Content-Type": "application/json",
        "x-usuario": sessionStorage.getItem("usuario") || "desconocido"
    };

}

// Convierte un <input type="file"> a base64 (sin el prefijo "data:...;base64,")
// PENDIENTE: confirmar con el profesor si esta es la tecnica de serializacion vista en clase.
function archivoABase64(inputFile) {

    return new Promise((resolve) => {

        const archivo = inputFile.files[0];

        if (!archivo) {

            resolve(null);
            return;

        }

        const lector = new FileReader();

        lector.onload = () => {

            const resultado = lector.result;
            const base64 = resultado.split(",")[1];
            resolve(base64);

        };

        lector.readAsDataURL(archivo);

    });

}

function mostrarMensaje(texto) {

    document.getElementById("mensaje").innerHTML = texto;

}

// ================= PARTIDOS =================

async function obtenerFormularioPartido() {

    return {
        nombre: document.getElementById("nombre").value.trim(),
        siglas: document.getElementById("siglas").value.trim(),
        ideologia: document.getElementById("ideologia").value.trim(),
        fechaFundacion: document.getElementById("fechaFundacion").value,
        sede: document.getElementById("sede").value.trim(),
        sitioWeb: document.getElementById("sitioWeb").value.trim(),
        numMilitantes: Number(document.getElementById("numMilitantes").value),
        logoBase64: await archivoABase64(document.getElementById("logo"))
    };

}

async function guardarPartido() {

    const partido = await obtenerFormularioPartido();

    const respuesta = await fetch("/api/partidos-pg", {
        method: "POST",
        headers: cabeceras(),
        body: JSON.stringify(partido)
    });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);
    limpiarPartido();
    listarPartidos();

}

async function modificarPartido() {

    const id = document.getElementById("partidoId").value;

    if (!id) {

        mostrarMensaje("Seleccione un partido de la tabla para modificar.");
        return;

    }

    const partido = await obtenerFormularioPartido();

    const respuesta = await fetch("/api/partidos-pg/" + id, {
        method: "PUT",
        headers: cabeceras(),
        body: JSON.stringify(partido)
    });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);
    limpiarPartido();
    listarPartidos();
    listarPropuestas();

}

async function eliminarPartido() {

    const id = document.getElementById("partidoId").value;

    if (!id) {

        mostrarMensaje("Seleccione un partido de la tabla para eliminar.");
        return;

    }

    const respuesta = await fetch("/api/partidos-pg/" + id, {
        method: "DELETE",
        headers: cabeceras()
    });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);
    limpiarPartido();
    listarPartidos();
    listarPropuestas();

}

function limpiarPartido() {

    document.getElementById("partidoId").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("siglas").value = "";
    document.getElementById("ideologia").value = "";
    document.getElementById("fechaFundacion").value = "";
    document.getElementById("sede").value = "";
    document.getElementById("sitioWeb").value = "";
    document.getElementById("numMilitantes").value = "";
    document.getElementById("logo").value = "";

}

function editarPartido(partido) {

    document.getElementById("partidoId").value = partido.id;
    document.getElementById("nombre").value = partido.nombre;
    document.getElementById("siglas").value = partido.siglas;
    document.getElementById("ideologia").value = partido.ideologia;
    document.getElementById("fechaFundacion").value = (partido.fechaFundacion || "").substring(0, 10);
    document.getElementById("sede").value = partido.sede;
    document.getElementById("sitioWeb").value = partido.sitioWeb || "";
    document.getElementById("numMilitantes").value = partido.numMilitantes;

}

let partidosCache = [];

async function listarPartidos() {

    const respuesta = await fetch("/api/partidos-pg");

    partidosCache = await respuesta.json();

    const tbody = document.querySelector("#tablaPartidos tbody");

    tbody.innerHTML = "";

    const select = document.getElementById("propuestaPartidoId");
    select.innerHTML = "";

    partidosCache.forEach(partido => {

        const imgHtml = partido.logoBase64
            ? `<img class="miniatura" src="data:image/png;base64,${partido.logoBase64}">`
            : "(sin imagen)";

        const fila = document.createElement("tr");

        fila.innerHTML =
            "<td>" + partido.id + "</td>" +
            "<td>" + partido.nombre + "</td>" +
            "<td>" + partido.siglas + "</td>" +
            "<td>" + partido.ideologia + "</td>" +
            "<td>" + (partido.fechaFundacion || "").toString().substring(0, 10) + "</td>" +
            "<td>" + partido.sede + "</td>" +
            "<td>" + partido.numMilitantes + "</td>" +
            "<td>" + imgHtml + "</td>" +
            "<td><button onclick='window.__seleccionarPartido(" + partido.id + ")'>Seleccionar</button></td>";

        tbody.appendChild(fila);

        const opcion = document.createElement("option");
        opcion.value = partido.id;
        opcion.textContent = partido.nombre;
        select.appendChild(opcion);

    });

}

window.__seleccionarPartido = function (id) {

    const partido = partidosCache.find(p => p.id === id);

    if (partido) {

        editarPartido(partido);

    }

};

// ================= PROPUESTAS =================

async function obtenerFormularioPropuesta() {

    return {
        partidoId: Number(document.getElementById("propuestaPartidoId").value),
        titulo: document.getElementById("titulo").value.trim(),
        area: document.getElementById("area").value.trim(),
        descripcion: document.getElementById("descripcion").value.trim(),
        fechaPresentacion: document.getElementById("fechaPresentacion").value,
        estado: document.getElementById("estado").value.trim(),
        presupuestoEstimado: Number(document.getElementById("presupuestoEstimado").value) || 0,
        alcance: document.getElementById("alcance").value.trim(),
        imagenBase64: await archivoABase64(document.getElementById("imagenPropuesta"))
    };

}

async function guardarPropuesta() {

    const propuesta = await obtenerFormularioPropuesta();

    const respuesta = await fetch("/api/propuestas-pg", {
        method: "POST",
        headers: cabeceras(),
        body: JSON.stringify(propuesta)
    });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);
    limpiarPropuesta();
    listarPropuestas();

}

async function modificarPropuesta() {

    const id = document.getElementById("propuestaId").value;

    if (!id) {

        mostrarMensaje("Seleccione una propuesta de la tabla para modificar.");
        return;

    }

    const propuesta = await obtenerFormularioPropuesta();

    const respuesta = await fetch("/api/propuestas-pg/" + id, {
        method: "PUT",
        headers: cabeceras(),
        body: JSON.stringify(propuesta)
    });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);
    limpiarPropuesta();
    listarPropuestas();

}

async function eliminarPropuesta() {

    const id = document.getElementById("propuestaId").value;

    if (!id) {

        mostrarMensaje("Seleccione una propuesta de la tabla para eliminar.");
        return;

    }

    const respuesta = await fetch("/api/propuestas-pg/" + id, {
        method: "DELETE",
        headers: cabeceras()
    });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);
    limpiarPropuesta();
    listarPropuestas();

}

function limpiarPropuesta() {

    document.getElementById("propuestaId").value = "";
    document.getElementById("titulo").value = "";
    document.getElementById("area").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("fechaPresentacion").value = "";
    document.getElementById("estado").value = "";
    document.getElementById("presupuestoEstimado").value = "";
    document.getElementById("alcance").value = "";
    document.getElementById("imagenPropuesta").value = "";

}

let propuestasCache = [];

async function listarPropuestas() {

    const respuesta = await fetch("/api/propuestas-pg");

    propuestasCache = await respuesta.json();

    const tbody = document.querySelector("#tablaPropuestas tbody");

    tbody.innerHTML = "";

    propuestasCache.forEach(propuesta => {

        const imgHtml = propuesta.imagenBase64
            ? `<img class="miniatura" src="data:image/png;base64,${propuesta.imagenBase64}">`
            : "(sin imagen)";

        const fila = document.createElement("tr");

        fila.innerHTML =
            "<td>" + propuesta.id + "</td>" +
            "<td>" + propuesta.partidoNombre + "</td>" +
            "<td>" + propuesta.titulo + "</td>" +
            "<td>" + propuesta.area + "</td>" +
            "<td>" + propuesta.estado + "</td>" +
            "<td>" + propuesta.presupuestoEstimado + "</td>" +
            "<td>" + imgHtml + "</td>" +
            "<td><button onclick='window.__seleccionarPropuesta(" + propuesta.id + ")'>Seleccionar</button></td>";

        tbody.appendChild(fila);

    });

}

window.__seleccionarPropuesta = function (id) {

    const propuesta = propuestasCache.find(p => p.id === id);

    if (!propuesta) {

        return;

    }

    document.getElementById("propuestaId").value = propuesta.id;
    document.getElementById("propuestaPartidoId").value = propuesta.partidoId;
    document.getElementById("titulo").value = propuesta.titulo;
    document.getElementById("area").value = propuesta.area;
    document.getElementById("descripcion").value = propuesta.descripcion;
    document.getElementById("fechaPresentacion").value = (propuesta.fechaPresentacion || "").toString().substring(0, 10);
    document.getElementById("estado").value = propuesta.estado;
    document.getElementById("presupuestoEstimado").value = propuesta.presupuestoEstimado;
    document.getElementById("alcance").value = propuesta.alcance;

};
