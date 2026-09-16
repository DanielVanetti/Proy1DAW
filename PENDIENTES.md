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
por esa exacta. Los puntos exactos a cambiar están marcados con el comentario
`PENDIENTE de confirmar técnica con el profesor` en:

- `App/views/partidosPg.html`, `App/views/figurasPg.html`
- `App/public/js/partidosPg.js`, `App/public/js/figurasPg.js`
- `App/views/partidosMongo.html`, `App/views/figurasMongo.html`
- `App/public/js/partidosMongo.js`, `App/public/js/figurasMongo.js`

## 2. Carga Eager (Parte 2 - PostgreSQL, Semana 4)

Semana 4 no usa ORM (es `pg.Pool` con SQL directo), por lo que no existe un
método `include`/`eager` como en Sequelize. Se interpretó "Carga Eager" como:
**una única consulta SQL con `JOIN`** que trae de una sola vez la tabla
padre y la tabla relacionada (en vez de hacer una consulta separada por
cada fila, que sería la alternativa "perezosa"). Está implementado en:

- `App/dao/postgres/propuestaPgDAO.js` → función `listarConPartido()`
- `App/dao/postgres/cargoHistoricoPgDAO.js` → función `listarConFigura()`

**Qué confirmar:** si el profesor espera que "Carga Eager" se demuestre de
otra forma en un contexto sin ORM, ajustar esa interpretación.

## 3. Carga Lazy (Parte 3 - MongoDB, Semana 5)

Se interpretó "Carga Lazy" como: el listado general **no trae el campo de
imagen** (se excluye con `.project({ campoImagen: 0 })`), y el documento
completo (incluida la imagen) solo se consulta cuando el usuario pide el
detalle de un registro específico (botón "Ver / Editar"). Implementado en:

- `App/dao/mongo/partidoMongoDAO.js`
- `App/dao/mongo/figuraMongoDAO.js`

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
en `App/dao/mongo/partidoMongoDAO.js` y `App/dao/mongo/figuraMongoDAO.js`.

## 5. Autenticación sin sesión de servidor

Ninguno de los 3 proyectos de clase usa `express-session` ni cookies de
sesión. Por eso, tras un login correcto, la aplicación redirige al menú
pero **no protege las rutas del servidor** contra acceso directo sin haber
iniciado sesión (el usuario activo solo se recuerda en el navegador con
`sessionStorage`, para mostrarlo en pantalla y registrar quién hizo cada
acción en el log). Esto reproduce fielmente la limitación que ya tenía
S2-SW. Si el profesor exige protección real de rutas, habría que preguntar
si se vio algún mecanismo de sesión en clases no incluidas en el material
revisado.
