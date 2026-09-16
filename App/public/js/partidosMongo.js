/*
==========================================
CRUD DE PARTIDOS (Parte 3 - MongoDB)
==========================================
*/

const CAMPOS = [
    "nombre", "siglas", "ideologia", "fechaFundacion", "sede", "sitioWeb",
    "numMilitantes", "liderActual", "coloresRepresentativos", "presenciaRegional",
    "redesSociales", "numeroDiputados", "estadoLegal", "descripcion"
];

document.addEventListener("DOMContentLoaded", iniciar);

function iniciar() {

    document.getElementById("btnGuardar").addEventListener("click", guardar);
    document.getElementById("btnModificar").addEventListener("click", modificar);
    document.getElementById("btnEliminar").addEventListener("click", eliminar);
    document.getElementById("btnLimpiar").addEventListener("click", limpiar);

    listar();

}

function cabeceras() {

    return {
        "Content-Type": "application/json",
        "x-usuario": sessionStorage.getItem("usuario") || "desconocido"
    };

}

function archivoABase64(inputFile) {

    return new Promise((resolve) => {

        const archivo = inputFile.files[0];

        if (!archivo) {

            resolve(null);
            return;

        }

        const lector = new FileReader();

        lector.onload = () => resolve(lector.result.split(",")[1]);

        lector.readAsDataURL(archivo);

    });

}

function mostrarMensaje(texto) {

    document.getElementById("mensaje").innerHTML = texto;

}

async function obtenerFormulario() {

    const datos = {};

    CAMPOS.forEach(campo => {

        const el = document.getElementById(campo);

        datos[campo] = (el.type === "number") ? Number(el.value) || 0 : el.value.trim();

    });

    datos.logoBase64 = await archivoABase64(document.getElementById("logo"));

    return datos;

}

async function guardar() {

    const partido = await obtenerFormulario();

    const respuesta = await fetch("/api/partidos-mongo", {
        method: "POST",
        headers: cabeceras(),
        body: JSON.stringify(partido)
    });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);
    limpiar();
    listar();

}

async function modificar() {

    const id = document.getElementById("mongoId").value;

    if (!id) {

        mostrarMensaje("Seleccione un partido (Ver / Editar) antes de modificar.");
        return;

    }

    const partido = await obtenerFormulario();

    const respuesta = await fetch("/api/partidos-mongo/" + id, {
        method: "PUT",
        headers: cabeceras(),
        body: JSON.stringify(partido)
    });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);
    limpiar();
    listar();

}

async function eliminar() {

    const id = document.getElementById("mongoId").value;

    if (!id) {

        mostrarMensaje("Seleccione un partido (Ver / Editar) antes de eliminar.");
        return;

    }

    const respuesta = await fetch("/api/partidos-mongo/" + id, {
        method: "DELETE",
        headers: cabeceras()
    });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);
    limpiar();
    listar();

}

function limpiar() {

    document.getElementById("mongoId").value = "";

    CAMPOS.forEach(campo => {

        document.getElementById(campo).value = "";

    });

    document.getElementById("logo").value = "";

    const preview = document.getElementById("logoPreview");
    preview.style.display = "none";
    preview.src = "";

}

// CARGA LAZY: la lista solo trae campos livianos (sin logoBase64).
async function listar() {

    const respuesta = await fetch("/api/partidos-mongo");

    const partidos = await respuesta.json();

    const tbody = document.querySelector("#tablaPartidos tbody");

    tbody.innerHTML = "";

    partidos.forEach(partido => {

        const fila = document.createElement("tr");

        fila.innerHTML =
            "<td>" + partido.nombre + "</td>" +
            "<td>" + partido.siglas + "</td>" +
            "<td>" + partido.ideologia + "</td>" +
            "<td>" + partido.liderActual + "</td>" +
            "<td>" + partido.numeroDiputados + "</td>" +
            "<td><button onclick='window.__verDetalle(\"" + partido._id + "\")'>Ver / Editar</button></td>";

        tbody.appendChild(fila);

    });

}

// CARGA LAZY: solo aquí, al pedir el detalle, se trae el documento completo (con imagen).
window.__verDetalle = async function (id) {

    const respuesta = await fetch("/api/partidos-mongo/" + id);

    const partido = await respuesta.json();

    document.getElementById("mongoId").value = partido._id;

    CAMPOS.forEach(campo => {

        document.getElementById(campo).value = partido[campo] || "";

    });

    const preview = document.getElementById("logoPreview");

    if (partido.logoBase64) {

        preview.src = "data:image/png;base64," + partido.logoBase64;
        preview.style.display = "inline-block";

    }
    else {

        preview.style.display = "none";

    }

};
