/*
==========================================
CRUD DE FIGURAS PÚBLICAS (Parte 3 - MongoDB)
==========================================
*/

const CAMPOS = [
    "nombreCompleto", "cargoActual", "partido", "fechaNacimiento", "nacionalidad",
    "nivelEducativo", "universidad", "profesion", "aniosExperiencia", "cargosAnteriores",
    "propuestasPrincipales", "redesSociales", "popularidadEstimada", "regionRepresentada",
    "fechaInicioCargo", "fechaFinCargo", "estadoCivil", "idiomas", "premiosReconocimientos",
    "controversias", "biografiaCorta", "sitioWebOficial", "numeroSeguidores", "afiliaciones"
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

    datos.fotoBase64 = await archivoABase64(document.getElementById("foto"));

    return datos;

}

async function guardar() {

    const figura = await obtenerFormulario();

    const respuesta = await fetch("/api/figuras-mongo", {
        method: "POST",
        headers: cabeceras(),
        body: JSON.stringify(figura)
    });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);
    limpiar();
    listar();

}

async function modificar() {

    const id = document.getElementById("mongoId").value;

    if (!id) {

        mostrarMensaje("Seleccione una figura (Ver / Editar) antes de modificar.");
        return;

    }

    const figura = await obtenerFormulario();

    const respuesta = await fetch("/api/figuras-mongo/" + id, {
        method: "PUT",
        headers: cabeceras(),
        body: JSON.stringify(figura)
    });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);
    limpiar();
    listar();

}

async function eliminar() {

    const id = document.getElementById("mongoId").value;

    if (!id) {

        mostrarMensaje("Seleccione una figura (Ver / Editar) antes de eliminar.");
        return;

    }

    const respuesta = await fetch("/api/figuras-mongo/" + id, {
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

    document.getElementById("foto").value = "";

    const preview = document.getElementById("fotoPreview");
    preview.style.display = "none";
    preview.src = "";

}

// CARGA LAZY: la lista solo trae campos livianos (sin fotoBase64).
async function listar() {

    const respuesta = await fetch("/api/figuras-mongo");

    const figuras = await respuesta.json();

    const tbody = document.querySelector("#tablaFiguras tbody");

    tbody.innerHTML = "";

    figuras.forEach(figura => {

        const fila = document.createElement("tr");

        fila.innerHTML =
            "<td>" + figura.nombreCompleto + "</td>" +
            "<td>" + figura.cargoActual + "</td>" +
            "<td>" + figura.partido + "</td>" +
            "<td>" + figura.regionRepresentada + "</td>" +
            "<td>" + figura.popularidadEstimada + "</td>" +
            "<td><button onclick='window.__verDetalle(\"" + figura._id + "\")'>Ver / Editar</button></td>";

        tbody.appendChild(fila);

    });

}

// CARGA LAZY: solo aquí, al pedir el detalle, se trae el documento completo (con imagen).
window.__verDetalle = async function (id) {

    const respuesta = await fetch("/api/figuras-mongo/" + id);

    const figura = await respuesta.json();

    document.getElementById("mongoId").value = figura._id;

    CAMPOS.forEach(campo => {

        document.getElementById(campo).value = figura[campo] || "";

    });

    const preview = document.getElementById("fotoPreview");

    if (figura.fotoBase64) {

        preview.src = "data:image/png;base64," + figura.fotoBase64;
        preview.style.display = "inline-block";

    }
    else {

        preview.style.display = "none";

    }

};
