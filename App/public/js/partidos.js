/*
==========================================
CRUD DE PARTIDOS POLÍTICOS (Parte 1 - .txt)
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
        nombre: document.getElementById("nombre").value.trim(),
        siglas: document.getElementById("siglas").value.trim(),
        ideologia: document.getElementById("ideologia").value.trim(),
        fechaFundacion: document.getElementById("fechaFundacion").value
    };

}

async function guardar() {

    const partido = obtenerFormulario();

    const respuesta = await fetch("/partidos", {
        method: "POST",
        headers: cabeceras(),
        body: JSON.stringify(partido)
    });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);
    listar();

}

async function modificar() {

    const partido = obtenerFormulario();

    const respuesta = await fetch("/partidos", {
        method: "PUT",
        headers: cabeceras(),
        body: JSON.stringify(partido)
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

    const respuesta = await fetch("/partidos/" + codigo, {
        method: "DELETE",
        headers: cabeceras()
    });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);
    listar();
    limpiar();

}

async function listar() {

    const respuesta = await fetch("/partidos");

    const partidos = await respuesta.json();

    const tbody = document.querySelector("#tablaPartidos tbody");

    tbody.innerHTML = "";

    partidos.forEach(partido => {

        const fila =
            "<tr>" +
            "<td>" + partido.codigo + "</td>" +
            "<td>" + partido.nombre + "</td>" +
            "<td>" + partido.siglas + "</td>" +
            "<td>" + partido.ideologia + "</td>" +
            "<td>" + partido.fechaFundacion + "</td>" +
            "</tr>";

        tbody.innerHTML += fila;

    });

}

function limpiar() {

    document.getElementById("codigo").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("siglas").value = "";
    document.getElementById("ideologia").value = "";
    document.getElementById("fechaFundacion").value = "";

}

function mostrarMensaje(texto) {

    document.getElementById("mensaje").innerHTML = texto;

}
