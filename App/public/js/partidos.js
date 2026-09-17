/*
==========================================
CRUD DE PARTIDOS
==========================================
*/
 
document.addEventListener("DOMContentLoaded", iniciar);
 
function iniciar() {
 
    document
        .getElementById("btnGuardar")
        .addEventListener("click", guardar);
 
    document
        .getElementById("btnModificar")
        .addEventListener("click", modificar);
 
    document
        .getElementById("btnEliminar")
        .addEventListener("click", eliminar);
 
    document
        .getElementById("btnConsultar")
        .addEventListener("click", listar);
 
    document
        .getElementById("btnLimpiar")
        .addEventListener("click", limpiar);
 
    document
        .getElementById("btnSalir")
        .addEventListener("click", salir);
 
    listar();
}
 
/*=========================================
    Obtener datos del formulario
=========================================*/
 
function obtenerFormulario() {
 
    return {
 
        codigo:
            document.getElementById("codigo").value.trim(),
 
        nombre:
            document.getElementById("nombre").value.trim(),
 
        siglas:
            document.getElementById("siglas").value.trim(),
 
        ideologia:
            document.getElementById("ideologia").value.trim(),
 
        fechaFundacion:
            document.getElementById("fechaFundacion").value.trim()
 
    };
 
}
 
/*=========================================
    Guardar
=========================================*/
 
async function guardar() {
 
    const partido = obtenerFormulario();
 
    const respuesta = await fetch("/partidos", {
 
        method: "POST",
 
        headers: {
 
            "Content-Type": "application/json"
 
        },
 
        body: JSON.stringify(partido)
 
    });
 
    const datos = await respuesta.json();
 
    mostrarMensaje(datos.mensaje);
 
    listar();
 
}
 
/*=========================================
    Modificar
=========================================*/
 
async function modificar() {
 
    const partido = obtenerFormulario();
 
    const respuesta = await fetch("/partidos", {
 
        method: "PUT",
 
        headers: {
 
            "Content-Type": "application/json"
 
        },
 
        body: JSON.stringify(partido)
 
    });
 
    const datos = await respuesta.json();
 
    mostrarMensaje(datos.mensaje);
 
    listar();
 
}
 
/*=========================================
    Eliminar
=========================================*/
 
async function eliminar() {
 
    const codigo =
        document.getElementById("codigo").value.trim();
 
    if (codigo === "") {
 
        mostrarMensaje("Digite el código.");
 
        return;
 
    }
 
    const respuesta =
        await fetch("/partidos/" + codigo, {
 
            method: "DELETE"
 
        });
 
    const datos = await respuesta.json();
 
    mostrarMensaje(datos.mensaje);
 
    listar();
 
    limpiar();
 
}
 
/*=========================================
    Consultar todos
=========================================*/
 
async function listar() {
 
    const respuesta =
        await fetch("/partidos");
 
    const partidos =
        await respuesta.json();
 
    const tbody =
        document.querySelector("#tablaPartidos tbody");
 
    tbody.innerHTML = "";
 
    partidos.forEach(par => {
 
        const fila =
 
            "<tr>" +
 
            "<td>" + par.codigo + "</td>" +
 
            "<td>" + par.nombre + "</td>" +
 
            "<td>" + par.siglas + "</td>" +
 
            "<td>" + par.ideologia + "</td>" +
 
            "<td>" + par.fechaFundacion + "</td>" +
 
            "</tr>";
 
        tbody.innerHTML += fila;
 
    });
 
}
 
/*=========================================
    Limpiar
=========================================*/
 
function limpiar() {
 
    document.getElementById("codigo").value = "";
 
    document.getElementById("nombre").value = "";
 
    document.getElementById("siglas").value = "";
 
    document.getElementById("ideologia").value = "";
 
    document.getElementById("fechaFundacion").value = "";
 
}
 
/*=========================================
    Salir
=========================================*/
 
function salir() {
 
    window.location.href = "/logout";
 
}
 
/*=========================================
    Mostrar mensaje
=========================================*/
 
function mostrarMensaje(texto) {
 
    document
        .getElementById("mensaje")
        .innerHTML = texto;
 
}