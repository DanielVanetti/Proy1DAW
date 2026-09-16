/*
==========================================
CRUD DE FIGURAS PÚBLICAS (Parte 1 - .txt)
==========================================
*/

document.addEventListener("DOMContentLoaded", iniciar);

function iniciar() {

    document.getElementById("btnGuardar").addEventListener("click", guardar);
    document.getElementById("btnModificar").addEventListener("click", modificar);
    document.getElementById("btnEliminar").addEventListener("click", eliminar);
    document.getElementById("btnConsultar").addEventListener("click", listar);
    document.getElementById("btnLimpiar").addEventListener("click", limpiar);

    listar();

}

function cabeceras() {

    return {
        "Content-Type": "application/json",
        "x-usuario": sessionStorage.getItem("usuario") || "desconocido"
    };

}

function obtenerFormulario() {

    return {
        codigo: document.getElementById("codigo").value.trim(),
        nombreCompleto: document.getElementById("nombreCompleto").value.trim(),
        cargoActual: document.getElementById("cargoActual").value.trim(),
        partido: document.getElementById("partido").value.trim(),
        fechaNacimiento: document.getElementById("fechaNacimiento").value
    };

}

async function guardar() {

    const figura = obtenerFormulario();

    const respuesta = await fetch("/figuras", {
        method: "POST",
        headers: cabeceras(),
        body: JSON.stringify(figura)
    });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);
    listar();

}

async function modificar() {

    const figura = obtenerFormulario();

    const respuesta = await fetch("/figuras", {
        method: "PUT",
        headers: cabeceras(),
        body: JSON.stringify(figura)
    });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);
    listar();

}

async function eliminar() {

    const codigo = document.getElementById("codigo").value.trim();

    if (codigo === "") {

        mostrarMensaje("Digite el código.");
        return;

    }

    const respuesta = await fetch("/figuras/" + codigo, {
        method: "DELETE",
        headers: cabeceras()
    });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);
    listar();
    limpiar();

}

async function listar() {

    const respuesta = await fetch("/figuras");

    const figuras = await respuesta.json();

    const tbody = document.querySelector("#tablaFiguras tbody");

    tbody.innerHTML = "";

    figuras.forEach(figura => {

        const fila =
            "<tr>" +
            "<td>" + figura.codigo + "</td>" +
            "<td>" + figura.nombreCompleto + "</td>" +
            "<td>" + figura.cargoActual + "</td>" +
            "<td>" + figura.partido + "</td>" +
            "<td>" + figura.fechaNacimiento + "</td>" +
            "</tr>";

        tbody.innerHTML += fila;

    });

}

function limpiar() {

    document.getElementById("codigo").value = "";
    document.getElementById("nombreCompleto").value = "";
    document.getElementById("cargoActual").value = "";
    document.getElementById("partido").value = "";
    document.getElementById("fechaNacimiento").value = "";

}

function mostrarMensaje(texto) {

    document.getElementById("mensaje").innerHTML = texto;

}
