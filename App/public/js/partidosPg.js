// ==========================================
// PARTIDOS
// ==========================================

const formularioPartido = document.getElementById("formPartido");

const partidoIdInput = document.getElementById("partidoId");

const nombreInput = document.getElementById("nombre");

const siglasInput = document.getElementById("siglas");

const ideologiaInput = document.getElementById("ideologia");

const fechaFundacionInput = document.getElementById("fechaFundacion");

const sedeInput = document.getElementById("sede");

const sitioWebInput = document.getElementById("sitioWeb");

const numMilitantesInput = document.getElementById("numMilitantes");

const logoInput = document.getElementById("logo");

const tablaPartidos =
    document.getElementById("tablaPartidos");

const btnCancelarPartido =
    document.getElementById("btnCancelarPartido");


// ==========================================
// PROPUESTAS
// ==========================================

const formularioPropuesta = document.getElementById("formPropuesta");

const propuestaIdInput = document.getElementById("propuestaId");

const partidoIdPropuestaInput = document.getElementById("partidoIdPropuesta");

const tituloInput = document.getElementById("titulo");

const areaInput = document.getElementById("area");

const descripcionInput = document.getElementById("descripcion");

const fechaPresentacionInput = document.getElementById("fechaPresentacion");

const estadoInput = document.getElementById("estado");

const presupuestoEstimadoInput = document.getElementById("presupuestoEstimado");

const alcanceInput = document.getElementById("alcance");

const imagenPropuestaInput = document.getElementById("imagenPropuesta");

const tablaPropuestas =
    document.getElementById("tablaPropuestas");

const btnCancelarPropuesta =
    document.getElementById("btnCancelarPropuesta");


// ==========================================
// AGREGADO: SERIALIZAR IMAGEN (no está en S4)
// Lee el archivo seleccionado y lo convierte a texto
// base64 para enviarlo dentro del JSON al servidor
// ==========================================

function leerImagen(inputArchivo) {

    return new Promise((resolve, reject) => {

        const archivo = inputArchivo.files[0];

        if (!archivo) {

            resolve(null);

            return;

        }

        const lector = new FileReader();

        lector.onload = () => resolve(lector.result.split(",")[1]);

        lector.onerror = reject;

        lector.readAsDataURL(archivo);

    });

}


// ==========================================
// CONSULTAR PARTIDOS
// ==========================================

async function cargarPartidos() {

    try {

        const respuesta =
            await fetch("/api/partidos");

        const partidos =
            await respuesta.json();

        tablaPartidos.innerHTML = "";

        partidos.forEach(partido => {

            const fila =
                document.createElement("tr");

            // AGREGADO: el logo llega serializado en base64 y se muestra en un <img>
            // CAMBIO: el botón Editar solo envía el id (son 8 campos)

            fila.innerHTML = `

                <td>${partido.id}</td>

                <td>${partido.nombre}</td>

                <td>${partido.siglas}</td>

                <td>${partido.ideologia}</td>

                <td>${partido.fecha_fundacion}</td>

                <td>${partido.sede}</td>

                <td>${partido.sitio_web}</td>

                <td>${partido.num_militantes}</td>

                <td>
                    ${partido.logo ? `<img src="data:image/png;base64,${partido.logo}" width="60">` : "Sin logo"}
                </td>

                <td>

                    <button
                        class="btn-editar"
                        onclick="editarPartido(
                            ${partido.id}
                        )">

                        Editar

                    </button>


                    <button
                        class="btn-eliminar"
                        onclick="eliminarPartido(
                            ${partido.id}
                        )">

                        Eliminar

                    </button>

                </td>

            `;

            tablaPartidos.appendChild(fila);

        });

    } catch (error) {

        console.error(
            "Error al cargar partidos:",
            error
        );

    }

}


// ==========================================
// CREAR O ACTUALIZAR PARTIDO
// ==========================================

formularioPartido.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const id = partidoIdInput.value;


        const datos = {

            nombre: nombreInput.value,

            siglas: siglasInput.value,

            ideologia: ideologiaInput.value,

            fecha_fundacion: fechaFundacionInput.value,

            sede: sedeInput.value,

            sitio_web: sitioWebInput.value,

            num_militantes: numMilitantesInput.value,

            // AGREGADO: imagen serializada en base64
            logo: await leerImagen(logoInput)

        };


        try {

            let respuesta;


            if (id === "") {

                // CREAR

                respuesta = await fetch(
                    "/api/partidos",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(datos)
                    }
                );

            } else {

                // ACTUALIZAR

                respuesta = await fetch(
                    `/api/partidos/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(datos)
                    }
                );

            }


            if (!respuesta.ok) {

                throw new Error(
                    "Error en la operación"
                );

            }


            limpiarFormularioPartido();

            cargarPartidos();


        } catch (error) {

            console.error(error);

            alert(
                "No fue posible realizar la operación"
            );

        }

    }
);


// ==========================================
// EDITAR PARTIDO
// CAMBIO: en S4 los datos se pasaban en el onclick;
// como son 8 campos se consultan con GET /api/partidos/:id
// ==========================================

async function editarPartido(id) {

    try {

        const respuesta =
            await fetch(`/api/partidos/${id}`);


        if (!respuesta.ok) {

            throw new Error(
                "Error al consultar"
            );

        }


        const partido =
            await respuesta.json();


        partidoIdInput.value = partido.id;

        nombreInput.value = partido.nombre;

        siglasInput.value = partido.siglas;

        ideologiaInput.value = partido.ideologia;

        fechaFundacionInput.value = partido.fecha_fundacion;

        sedeInput.value = partido.sede;

        sitioWebInput.value = partido.sitio_web;

        numMilitantesInput.value = partido.num_militantes;

        nombreInput.focus();


    } catch (error) {

        console.error(error);

        alert(
            "No fue posible consultar el partido"
        );

    }

}


// ==========================================
// ELIMINAR PARTIDO
// ==========================================

async function eliminarPartido(id) {

    const confirmar =
        confirm(
            "¿Desea eliminar este partido?"
        );


    if (!confirmar) {

        return;

    }


    try {

        const respuesta =
            await fetch(
                `/api/partidos/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!respuesta.ok) {

            throw new Error(
                "Error al eliminar"
            );

        }


        cargarPartidos();

        // AGREGADO: las propuestas del partido se eliminan en cascada
        cargarPropuestas();


    } catch (error) {

        console.error(error);

        alert(
            "No fue posible eliminar el partido"
        );

    }

}


// ==========================================
// CANCELAR / LIMPIAR PARTIDO
// ==========================================

btnCancelarPartido.addEventListener(
    "click",
    limpiarFormularioPartido
);


function limpiarFormularioPartido() {

    partidoIdInput.value = "";

    nombreInput.value = "";

    siglasInput.value = "";

    ideologiaInput.value = "";

    fechaFundacionInput.value = "";

    sedeInput.value = "";

    sitioWebInput.value = "";

    numMilitantesInput.value = "";

    logoInput.value = "";

}


// ==========================================
// CONSULTAR PROPUESTAS
// ==========================================

async function cargarPropuestas() {

    try {

        const respuesta =
            await fetch("/api/propuestas");

        const propuestas =
            await respuesta.json();

        tablaPropuestas.innerHTML = "";

        propuestas.forEach(propuesta => {

            const fila =
                document.createElement("tr");

            // AGREGADO: partido_nombre y partido_siglas vienen de la CARGA EAGER (JOIN)
            // AGREGADO: la imagen llega serializada en base64 y se muestra en un <img>
            // CAMBIO: el botón Editar solo envía el id (son 8 campos)

            fila.innerHTML = `

                <td>${propuesta.id}</td>

                <td>${propuesta.partido_id} - ${propuesta.partido_nombre} (${propuesta.partido_siglas})</td>

                <td>${propuesta.titulo}</td>

                <td>${propuesta.area}</td>

                <td>${propuesta.descripcion}</td>

                <td>${propuesta.fecha_presentacion}</td>

                <td>${propuesta.estado}</td>

                <td>${propuesta.presupuesto_estimado}</td>

                <td>${propuesta.alcance}</td>

                <td>
                    ${propuesta.imagen ? `<img src="data:image/png;base64,${propuesta.imagen}" width="60">` : "Sin imagen"}
                </td>

                <td>

                    <button
                        class="btn-editar"
                        onclick="editarPropuesta(
                            ${propuesta.id}
                        )">

                        Editar

                    </button>


                    <button
                        class="btn-eliminar"
                        onclick="eliminarPropuesta(
                            ${propuesta.id}
                        )">

                        Eliminar

                    </button>

                </td>

            `;

            tablaPropuestas.appendChild(fila);

        });

    } catch (error) {

        console.error(
            "Error al cargar propuestas:",
            error
        );

    }

}


// ==========================================
// CREAR O ACTUALIZAR PROPUESTA
// ==========================================

formularioPropuesta.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const id = propuestaIdInput.value;


        const datos = {

            partido_id: partidoIdPropuestaInput.value,

            titulo: tituloInput.value,

            area: areaInput.value,

            descripcion: descripcionInput.value,

            fecha_presentacion: fechaPresentacionInput.value,

            estado: estadoInput.value,

            presupuesto_estimado: presupuestoEstimadoInput.value,

            alcance: alcanceInput.value,

            // AGREGADO: imagen serializada en base64
            imagen: await leerImagen(imagenPropuestaInput)

        };


        try {

            let respuesta;


            if (id === "") {

                // CREAR

                respuesta = await fetch(
                    "/api/propuestas",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(datos)
                    }
                );

            } else {

                // ACTUALIZAR

                respuesta = await fetch(
                    `/api/propuestas/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(datos)
                    }
                );

            }


            if (!respuesta.ok) {

                throw new Error(
                    "Error en la operación"
                );

            }


            limpiarFormularioPropuesta();

            cargarPropuestas();


        } catch (error) {

            console.error(error);

            alert(
                "No fue posible realizar la operación"
            );

        }

    }
);


// ==========================================
// EDITAR PROPUESTA
// CAMBIO: en S4 los datos se pasaban en el onclick;
// como son 8 campos se consultan con GET /api/propuestas/:id
// ==========================================

async function editarPropuesta(id) {

    try {

        const respuesta =
            await fetch(`/api/propuestas/${id}`);


        if (!respuesta.ok) {

            throw new Error(
                "Error al consultar"
            );

        }


        const propuesta =
            await respuesta.json();


        propuestaIdInput.value = propuesta.id;

        partidoIdPropuestaInput.value = propuesta.partido_id;

        tituloInput.value = propuesta.titulo;

        areaInput.value = propuesta.area;

        descripcionInput.value = propuesta.descripcion;

        fechaPresentacionInput.value = propuesta.fecha_presentacion;

        estadoInput.value = propuesta.estado;

        presupuestoEstimadoInput.value = propuesta.presupuesto_estimado;

        alcanceInput.value = propuesta.alcance;

        tituloInput.focus();


    } catch (error) {

        console.error(error);

        alert(
            "No fue posible consultar la propuesta"
        );

    }

}


// ==========================================
// ELIMINAR PROPUESTA
// ==========================================

async function eliminarPropuesta(id) {

    const confirmar =
        confirm(
            "¿Desea eliminar esta propuesta?"
        );


    if (!confirmar) {

        return;

    }


    try {

        const respuesta =
            await fetch(
                `/api/propuestas/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!respuesta.ok) {

            throw new Error(
                "Error al eliminar"
            );

        }


        cargarPropuestas();


    } catch (error) {

        console.error(error);

        alert(
            "No fue posible eliminar la propuesta"
        );

    }

}


// ==========================================
// CANCELAR / LIMPIAR PROPUESTA
// ==========================================

btnCancelarPropuesta.addEventListener(
    "click",
    limpiarFormularioPropuesta
);


function limpiarFormularioPropuesta() {

    propuestaIdInput.value = "";

    partidoIdPropuestaInput.value = "";

    tituloInput.value = "";

    areaInput.value = "";

    descripcionInput.value = "";

    fechaPresentacionInput.value = "";

    estadoInput.value = "";

    presupuestoEstimadoInput.value = "";

    alcanceInput.value = "";

    imagenPropuestaInput.value = "";

}


// ==========================================
// CARGAR AL INICIAR
// ==========================================

cargarPartidos();

cargarPropuestas();
