/*
==========================================
CRUD DE FIGURAS PÚBLICAS
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
 
        nombreCompleto:
            document.getElementById("nombreCompleto").value.trim(),
 
        cargoActual:
            document.getElementById("cargoActual").value.trim(),
 
        partido:
            document.getElementById("partido").value.trim(),
 
        fechaNacimiento:
            document.getElementById("fechaNacimiento").value.trim()
 
    };
 
}
 
/*=========================================
    Guardar
=========================================*/
 
async function guardar() {
 
    const figura = obtenerFormulario();
 
    const respuesta = await fetch("/figuras", {
 
        method: "POST",
 
        headers: {
 
            "Content-Type": "application/json"
 
        },
 
        body: JSON.stringify(figura)
 
    });
 
    const datos = await respuesta.json();
 
    mostrarMensaje(datos.mensaje);
 
    listar();
 
}
 
/*=========================================
    Modificar
=========================================*/
 
async function modificar() {
 
    const figura = obtenerFormulario();
 
    const respuesta = await fetch("/figuras", {
 
        method: "PUT",
 
        headers: {
 
            "Content-Type": "application/json"
 
        },
 
        body: JSON.stringify(figura)
 
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
        await fetch("/figuras/" + codigo, {
 
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
        await fetch("/figuras");
 
    const figuras =
        await respuesta.json();
 
    const tbody =
        document.querySelector("#tablaFiguras tbody");
 
    tbody.innerHTML = "";
 
    figuras.forEach(fig => {
 
        const fila =
 
            "<tr>" +
 
            "<td>" + fig.codigo + "</td>" +
 
            "<td>" + fig.nombreCompleto + "</td>" +
 
            "<td>" + fig.cargoActual + "</td>" +
 
            "<td>" + fig.partido + "</td>" +
 
            "<td>" + fig.fechaNacimiento + "</td>" +
 
            "</tr>";
 
        tbody.innerHTML += fila;
 
    });
 
}
 
/*=========================================
    Limpiar
=========================================*/
 
function limpiar() {
 
    document.getElementById("codigo").value = "";
 
    document.getElementById("nombreCompleto").value = "";
 
    document.getElementById("cargoActual").value = "";
 
    document.getElementById("partido").value = "";
 
    document.getElementById("fechaNacimiento").value = "";
 
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