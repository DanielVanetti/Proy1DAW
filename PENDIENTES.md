# Pendientes por confirmar con el profesor

Este documento resume las decisiones que se tomaron en el código para que la
aplicación quedara funcional, pero que **no están respaldadas por un ejemplo
literal visto en clase** (Semana 2, 4 o 5). El enunciado exige usar
"exclusivamente" el código visto en clase, así que antes de entregar el
proyecto hay que confirmar estos puntos con el profesor y ajustar si hace falta.

## 1. Serialización de imágenes binarias (Parte 2 - PostgreSQL y Parte 3 - MongoDB)

Ni S2-SW (Semana 2), ni S4-SW (Semana 4), ni S5-SW (Semana 5) incluyen código
que guarde imágenes como binario en la base de datos. El enunciado dice
literalmente "debe investigar cómo implementar[lo]", así que se investigó y
se implementó una técnica **funcional pero propuesta, no confirmada**:

- **Cliente:** el `<input type="file">` se lee con `FileReader.readAsDataURL()`
  (API estándar del navegador) y se envía al servidor como una cadena base64
  dentro del JSON (sin el prefijo `data:image/...;base64,`).
- **PostgreSQL:** la columna es de tipo `BYTEA`. El servidor convierte la
  cadena base64 a binario con `Buffer.from(base64, "base64")` y lo inserta
  como parámetro de la consulta parametrizada (mismo estilo de `pool.query`
  de Semana 4). Al leer, se hace `buffer.toString("base64")` para poder
  incluirlo en la respuesta JSON y mostrarlo en un `<img>`.
- **MongoDB:** se guarda directamente el string base64 en un campo del
  documento (`logoBase64` / `fotoBase64`), sin binario nativo de Mongo
  (`Binary`/`BinData`), porque ese tipo tampoco aparece en el código de
  Semana 5 revisado.

**Qué confirmar:** si el profesor mostró una técnica distinta en clase
(por ejemplo, `Buffer`/`bytea` de otra forma, o el tipo `Binary` de Mongo,
o el uso de una librería específica), hay que reemplazar esta implementación
por esa exacta. Los puntos a cambiar están marcados con comentarios
`AGREGADO: ... imagen ... serializada` en:

- `App/controllers/partidoPgController.js`, `propuestaPgController.js`,
  `figuraPgController.js`, `cargoPgController.js` (conversión base64 ↔ BYTEA)
- `App/views/partidosPg.html`, `App/views/figurasPg.html`
- `App/public/js/partidosPg.js`, `App/public/js/figurasPg.js` (función `leerImagen`)
- `App/dao/PartidoMongoDAO.js`, `App/dao/FiguraMongoDAO.js`
- `App/views/partidosMongo.html`, `App/views/figurasMongo.html`
- `App/public/js/partidosMongo.js`, `App/public/js/figurasMongo.js`
  (funciones `leerImagen` y `mostrarImagen`)

## 2. Carga Eager (Parte 2 - PostgreSQL, Semana 4)

Semana 4 no usa ORM (es `pg.Pool` con SQL directo), por lo que no existe un
método `include`/`eager` como en Sequelize. Se interpretó "Carga Eager" como:
**una única consulta SQL con `JOIN`** que trae de una sola vez la tabla
padre y la tabla relacionada (en vez de hacer una consulta separada por
cada fila, que sería la alternativa "perezosa"). Está implementado en:

- `App/controllers/propuestaPgController.js` → `getAllPropuestas` y
  `getPropuestaById` (`INNER JOIN partidos_pg`)
- `App/controllers/cargoPgController.js` → `getAllCargos` y `getCargoById`
  (`INNER JOIN figuras_pg`)

En la vista se ve en la columna "Partido" / "Figura pública" de la tabla
relacionada. Cada punto está marcado con el comentario `CARGA EAGER`.

**Qué confirmar:** si el profesor espera que "Carga Eager" se demuestre de
otra forma en un contexto sin ORM, ajustar esa interpretación.

## 3. Carga Lazy (Parte 3 - MongoDB, Semana 5)

Se interpretó "Carga Lazy" como: el listado general **no trae el campo de
imagen** (se excluye con `.project({ campoImagen: 0 })`), y el documento
completo (incluida la imagen) solo se consulta cuando el usuario pide el
detalle de un registro específico (botón "CONSULTAR" con el ObjectId).
"MOSTRAR TODOS" no trae la imagen. Implementado en (comentarios `CARGA LAZY`):

- `App/dao/PartidoMongoDAO.js` → `obtenerTodos()` (sin logo) y `obtenerPorId()` (con logo)
- `App/dao/FiguraMongoDAO.js` → `obtenerTodos()` (sin foto) y `obtenerPorId()` (con foto)
- `App/public/js/partidosMongo.js` y `figurasMongo.js` → `consultarMongo()` y `mostrarMongo()`

**Qué confirmar:** si el profesor mostró una técnica distinta de "Lazy" en
MongoDB (por ejemplo, paginación, cursores, o algo con Mongoose que no se
vio en S5-SW), ajustar esa interpretación.

## 4. Una sola colección "CollMongoDB" para las 2 vistas de Parte 3

El enunciado nombra la colección en singular ("usar colección llamada:
CollMongoDB"), pero pide 2 conjuntos de documentos con diferente cantidad de
campos (60 con 15 campos, 120 con 25 campos). Se interpretó que **ambos
conjuntos viven en la misma colección** `CollMongoDB`, diferenciados por un
campo `tipo: "partido"` / `tipo: "figura"`. Si el profesor esperaba **dos
colecciones separadas**, es un cambio pequeño: bastaría con usar
`db.collection("CollMongoDBPartidos")` y `db.collection("CollMongoDBFiguras")`
en `App/dao/PartidoMongoDAO.js` y `App/dao/FiguraMongoDAO.js`.

Nota: por ese campo `tipo`, cada documento de los JSON tiene 16 y 26 claves
(15 y 25 campos de datos + `tipo`). Confirmar si el profesor lo cuenta como campo.

## 5. Autenticación sin sesión de servidor

Ninguno de los 3 proyectos de clase usa `express-session` ni cookies de
sesión. Por eso, tras un login correcto, la aplicación redirige al menú
pero **no protege las rutas del servidor** contra acceso directo sin haber
iniciado sesión. Para registrar quién hizo cada acción en el log, el usuario
que inicia sesión se guarda en el servidor (`Logger.asignarUsuario` en
`App/controllers/authController.js`, ver `App/utils/logger.js`) y se limpia
al cerrar sesión. Esto reproduce la limitación que ya tenía
PROYECTOESTUDIANTES. Si el profesor exige protección real de rutas, habría
que preguntar si se vio algún mecanismo de sesión en clases no incluidas en
el material revisado.

## 6. Diferencias con el código de clase (marcadas en el código)

El código de cada parte se copió de su proyecto de referencia
(Parte 1 = PROYECTOESTUDIANTES, Parte 2 = S4-SW, Parte 3 = S5-SW) con la
misma estructura, formato, comentarios, `console.log` y mensajes de error.
Todo lo que no es exactamente igual está marcado con un comentario:

- `AGREGADO:` código que no existe en la referencia (log, menú lateral,
  imágenes serializadas, Carga Eager, Carga Lazy, campo `tipo`).
- `CAMBIO:` código de la referencia que se tuvo que modificar (por ejemplo,
  `db/database.js` lee los datos de conexión del `.env`, el login redirige a
  `/menu`, el botón Editar de S4 consulta por ID porque son 8 campos).

Buscar `AGREGADO:` y `CAMBIO:` en `App/` para revisarlos todos antes de la
presentación.
