# Reporte de estado — Proyecto 1, Grupo 5 (Política y Figuras Públicas)

Documento vivo para seguimiento del grupo. Se actualiza conforme avanza el trabajo.

- **Última actualización:** 21 de septiembre de 2026 (tercera revisión)
- **Commit base:** `57f53cd` ("Parte 2: alinear controllers y rutas con el codigo de S4-SW")
- **Contraste:** enunciado `Proyecto-DAW.pdf` + código de referencia de clase (S2, S4-SW, S5-SW)

## Cómo usar este documento

Cada hallazgo tiene un **responsable** y un **estado**. Al resolver uno, cambiar el estado
a `RESUELTO` y dejar la línea (no borrarla) para que el resto vea qué se movió.

Estados: `ABIERTO` · `EN CURSO` · `RESUELTO` · `A CONFIRMAR CON EL PROFESOR`

## Reparto de responsabilidades

| Parte | Responsable | Tecnología | Puntos |
|-------|-------------|------------|--------|
| Parte 1 | Alejandro | Archivos planos `.txt` (Semana 2) | 20 pts |
| Parte 2 | Daniel | PostgreSQL (Semana 4) | 40 pts |
| Parte 3 | Josué | MongoDB (Semana 5) | 40 pts |
| Parte 4 | los tres | Manejo de errores dentro de cada parte | — |

---

## Estado general

La aplicación **arranca y corre sin errores**. Verificado el 20/09/2026: servidor en el
puerto 3000, las 16 rutas documentadas responden, CRUD de PostgreSQL probado de punta a
punta contra la base real.

MongoDB no estaba levantado durante la verificación, así que la Parte 3 **no se pudo
probar funcionalmente**. Josué debe correrla con `mongod` activo y confirmar.

> El enunciado indica fecha de entrega **17 de septiembre de 2026**. Los últimos commits
> son de ese día. Confirmar en qué estado quedó la entrega y si la presentación de 10
> minutos en clase sigue pendiente (vale 35 puntos si no se presenta).

---

## Parte 2 — PostgreSQL (Daniel)

### Cumplimiento del enunciado

Verificado campo por campo contra el PDF:

| Requisito del enunciado | Estado |
|---|---|
| Base de datos llamada `BDPostgreSQL` | ✅ `PG_DATABASE=BDPostgreSQL` |
| 2 vistas, cada una con 2 tablas relacionadas con llaves y joins | ✅ |
| **8 campos por tabla**, sin contar llaves ni relaciones | ✅ las 4 tablas tienen exactamente 8 |
| Campos de la vista B **diferentes** a los de la vista A | ✅ cero nombres repetidos |
| Campo de imagen binaria en **cada** tabla | ✅ `BYTEA` en las 4 |
| Imágenes manejadas de forma serializada desde la vista | ✅ round-trip verificado |
| Carga Eager señalada puntualmente | ✅ comentarios `CARGA EAGER` |
| Manejo de errores (Parte 4) | ✅ `try/catch` + log en las 5 operaciones |

Detalle de las tablas:

| Tabla | Campos de datos | Llaves | Campo imagen |
|---|---|---|---|
| `partidos_pg` | 8 | `id` | `logo` |
| `propuestas_pg` | 8 | `id`, `partido_id` | `imagen` |
| `figuras_pg` | 8 | `id` | `foto` |
| `cargos_historicos_pg` | 8 | `id`, `figura_id` | `imagen_evento` |

### Pruebas funcionales ejecutadas (20/09/2026)

Contra la base PostgreSQL real, ciclo completo sobre `/api/partidos`:

- `POST` con logo → `GET` por id: la imagen vuelve **byte por byte idéntica**.
- `PUT` sin enviar logo: el `COALESCE($8, logo)` **conserva** la imagen anterior.
- Fechas: `2020-01-15` entra y sale igual, sin corrimiento de zona horaria.
- `DELETE`: elimina y responde correctamente.
- Los dos JOIN devuelven los campos del padre (`partido_nombre`/`partido_siglas`,
  `figura_nombre`/`figura_cargo_actual`).
- Todas las acciones quedaron registradas en `logs/acciones.txt`.

### Dónde está cada cosa (para la presentación)

| Qué | Archivo y línea |
|---|---|
| Pool de conexión | `App/db/database.js` |
| Carga Eager — propuestas | `App/controllers/propuestaPgController.js:22` y `:39` |
| Carga Eager — cargos | `App/controllers/cargoPgController.js:22` y `:39` |
| Serialización BYTEA → base64 | `serializarImagen()` al inicio de cada controller Pg |
| Serialización base64 → BYTEA | `Buffer.from(campo, "base64")` en create y update |
| Lectura de imagen en el cliente | función `leerImagen` en `public/js/partidosPg.js` y `figurasPg.js` |
| Scripts SQL | `PostgreSQL/ScriptCrearBaseDatos.sql` y `ScriptPopularBaseDatos.sql` |

---

## Hallazgos abiertos

### 1. `ALTO` · El estilo del código de la Parte 2 no coincide con S4-SW — *Daniel* · `RESUELTO`

El enunciado exige "usar **exclusivamente** el código de la semana 4" y advierte que de no
hacerlo "queda nulo con nota cero (0), o el profesor puede asignar la nota a discreción".
Los controllers de la Parte 2 funcionaban bien pero se apartaban del estilo de la
referencia en cuatro puntos. **Ya corregidos:**

| Aspecto | S4-SW (referencia) | Antes | Ahora |
|---|---|---|---|
| Exportación | `const x = ...` + `module.exports = {...}` al final | `exports.getAllPartidos = ...` | `const obtenerPartidos = ...` + `module.exports` |
| Nombres | español (`crearProducto`) | inglés (`createPartido`) | español (`crearPartido`) |
| Clave de error | `{ mensaje: "..." }` | `{ error: "..." }` | `{ mensaje: "..." }` |
| Mensaje de borrado | `{ mensaje: "... eliminado correctamente" }` | `{ message: "... eliminado exitosamente" }` | `{ mensaje: "... eliminado correctamente" }` |

Nombres finales, siguiendo el patrón de `productoController.js`:

| S4-SW | Parte 2 (ejemplo con partidos) |
|---|---|
| `obtenerProductos` | `obtenerPartidos` |
| `obtenerProductoPorId` | `obtenerPartidoPorId` |
| `crearProducto` | `crearPartido` |
| `actualizarProducto` | `actualizarPartido` |
| `eliminarProducto` | `eliminarPartido` |

Mismo patrón en `propuestas`, `figuras` y `cargos`. Los 4 routers se actualizaron para
importar los nombres nuevos. El JavaScript del cliente **no requirió cambios**: nunca leía
la clave de error del cuerpo de la respuesta, solo usa `catch` local.

Alcance: 8 archivos, +132 / −96 líneas. Solo Parte 2.

### 2. `INFO` · El refactor de la Parte 2 fue correcto — *Josué* · `RESUELTO`

El commit `5291698` eliminó `dao/postgres/*` y `services/*PgService.js`, dejando los
controllers hablando directo contra el pool. **Esto estuvo bien.** El código de referencia
S4-SW no tiene capa de `services` ni `dao`: su estructura es exactamente
`routes → controllers → db/database.js`. El refactor acercó la Parte 2 a la referencia.

> Corrección: en una revisión previa se sugirió que este refactor podía ser un problema
> por "perder las capas". Tras leer S4-SW, es lo contrario. **No revertirlo.**

### 3. `MEDIO` · Requires con mayúsculas inconsistentes en la Parte 3 — *Josué* · `ABIERTO`

Cuatro archivos de MongoDB hacen `require` de un nombre con mayúscula distinta a la del
archivo real:

| Archivo | Línea | Dice | Archivo real |
|---|---|---|---|
| `controllers/figuraMongoController.js` | 2 | `../services/FiguraMongoService` | `figuraMongoService.js` |
| `controllers/partidoMongoController.js` | 2 | `../services/PartidoMongoService` | `partidoMongoService.js` |
| `routes/figuraMongoRoutes.js` | 6 | `../controllers/FiguraMongoController` | `figuraMongoController.js` |
| `routes/partidoMongoRoutes.js` | 6 | `../controllers/PartidoMongoController` | `partidoMongoController.js` |

En Windows funciona porque el sistema de archivos ignora mayúsculas. En Linux o macOS la
aplicación **no arranca**. Si el profesor evalúa en otra máquina es un cero por
"la aplicación no funciona".

Los dos requires de los DAO (`FiguraMongoDAO`, `PartidoMongoDAO`) **sí** están bien: esos
archivos se llaman con mayúscula.

> Se corrigió y luego se revirtió, para que Josué lo revise y lo aplique él. Son 4 líneas.

### 4. `MEDIO` · Datos de ejemplo mínimos y sin imágenes — *Daniel* · `ABIERTO`

`ScriptPopularBaseDatos.sql` carga 4 partidos, 5 propuestas, 4 figuras y 4 cargos, con
**todos los campos de imagen en NULL**. Para la presentación conviene cargar algunas
imágenes desde la vista, que es justamente lo que demuestra el requisito de serialización.

### 5. `ALTO` · Puntos a confirmar con el profesor — *los tres* · `A CONFIRMAR CON EL PROFESOR`

Detallados en `PENDIENTES.md`. Los dos que más pesan:

- **Carga Eager** (Parte 2): S4 no usa ORM, así que no hay `include`. Se interpretó como
  una sola consulta con `INNER JOIN`. El enunciado pide "señale puntualmente dónde y cómo
  la usó", lo cual la interpretación cumple, pero conviene validarla.
- **Serialización de imágenes** (Partes 2 y 3): el enunciado dice "debe investigar cómo
  implementarlo", así que probablemente hay margen. Se usó `BYTEA` + `Buffer` en Postgres
  y string base64 en Mongo.

### 6. `INFO` · Conteo de campos de Mongo — *Josué* · `A CONFIRMAR CON EL PROFESOR`

Los archivos tienen 60 y 120 documentos como pide el enunciado, pero con **16 y 26 claves**
en vez de 15 y 25. La clave extra es `tipo` (`"partido"` / `"figura"`), que se agregó para
separar ambos conjuntos dentro de la única colección `CollMongoDB`. Confirmar si el
profesor cuenta `tipo` como campo.

### 7. `ALTO` · Entregables que no existen todavía — *los tres* · `ABIERTO`

- `Grupo-#-Explicacion.pdf` — nombres completos, cédulas, descripción del funcionamiento y
  **screenshots de cada opción ejecutándose**. Vale 15 puntos.
- Los 3 ZIP con los nombres exactos: `ProyectoP4-App-Grupo-#.zip`,
  `ProyectoP4-PostgreSQL-Grupo-#.zip`, `ProyectoP4-MongoDB-Grupo-#.zip`. Nombre o
  contenido incorrecto: 15 puntos menos.
- Falta confirmar el **número de grupo** para reemplazar el `#`.

### 8. `BAJO` · Quedan 161 comentarios `AGREGADO:` / `CAMBIO:` — *los tres* · `EN CURSO`

Conteo al 21/09/2026 (archivos `.js` y `.html` de `App/`):

| Parte | Comentarios | Dónde |
|---|---|---|
| Parte 2 | 107 | 73 en los 4 controllers Pg, 22 en `partidosPg.js`/`figurasPg.js`, 10 en las 2 vistas, 2 en `db/database.js` |
| Parte 3 | 11 | Josué ya limpió la mayoría |
| Parte 1 y archivos compartidos | 43 | `app.js`, login, logger, menú y las vistas de archivos `.txt` |

Estos comentarios marcan **todo lo que se apartó del código de clase**, así que son el
mapa para la conversación con el profesor. Conviene borrarlos **después** de esa
conversación, no antes.

---

## Punto de contacto entre la Parte 2 y la Parte 3

Es el único lugar donde las partes de Daniel y Josué se tocan. En `App/app.js`:

```
app.use("/api/partidos", partidoMongoRoutes);   // Parte 3 — rutas /mongo y /mongo/:id
app.use("/api/figuras",  figuraMongoRoutes);    // Parte 3
app.use("/api/partidos", partidoPgRoutes);      // Parte 2 — rutas / y /:id
app.use("/api/figuras",  figuraPgRoutes);       // Parte 2
```

Ambas partes comparten los prefijos `/api/partidos` y `/api/figuras`. **Los routers de
Mongo deben ir antes que los de PostgreSQL**: si se invierte el orden, `/api/partidos/mongo`
queda capturado por la ruta `/:id` de PostgreSQL y la Parte 3 deja de funcionar.

No reordenar ese bloque sin avisar al grupo.

---

## Cambios aplicados en esta revisión

| Cambio | Archivo | Estado |
|---|---|---|
| Traídos 4 commits de `origin/main` | — | aplicado |
| **Parte 2 alineada con el estilo de S4-SW** (hallazgo 1) | 4 controllers + 4 routers Pg | commit `57f53cd` |
| Eliminado `package-lock.json` vacío de la raíz (el real está en `App/`) | `package-lock.json` | commit `57f53cd` |
| README: descripción de arquitectura corregida (Parte 2 sin capas, como S4-SW) | `README.md` | commit `57f53cd` |
| README: tabla de páginas corregida (`/partidos-pg`, no `/partidos-pg/pagina`) | `README.md` | commit `57f53cd` |
| README: rutas de API corregidas (`/api/partidos`, no `/api/partidos-pg`) | `README.md` | commit `57f53cd` |
| README: eliminado el paso "crear carpeta de logs" (ya es automático) | `README.md` | commit `57f53cd` |
| README: estructura de carpetas actualizada | `README.md` | commit `57f53cd` |
| Corrección de mayúsculas en requires de Mongo | 4 archivos de Parte 3 | **revertido** — lo aplica Josué (hallazgo 3) |

**Ningún archivo de código de la Parte 1 ni de la Parte 3 fue modificado.** Los únicos
archivos compartidos que se tocaron son `README.md` (documentación, describe las tres
partes) y este reporte.

Todo lo anterior quedó en el commit `57f53cd` y se subió a `origin/main` el 21/09/2026.

---

## Revisión del 21/09/2026 — Parte 2 contra S4-SW

Se volvió a comparar la Parte 2 con `SEMANA 3/S4-SW` después del commit `57f53cd`:

- Los 4 controllers y los 4 routers siguen el formato de `productoController.js` y
  `productoRoutes.js`: mismos nombres de funciones, `module.exports` al final y
  `{ mensaje }` en todas las respuestas de error.
- Los 20 endpoints cargan y cada uno apunta a la función correcta.
- `node --check` pasa en todos los controllers, las rutas y `app.js`.
- `App/.env` no está versionado (solo `.env.example`).

Quedan diferencias menores de estilo con S4-SW, de riesgo bajo y opcionales:

| S4-SW | Parte 2 |
|---|---|
| `resultado` / `error` | `result` / `err` |
| `const { id } = req.params` dentro del `try` | antes del `try` |
| columnas explícitas en `SELECT` y `RETURNING id` | `SELECT *` y `RETURNING *` |
| líneas en blanco entre bloques | formato compacto |

El hallazgo 3 (requires con mayúsculas en la Parte 3) sigue `ABIERTO`.
