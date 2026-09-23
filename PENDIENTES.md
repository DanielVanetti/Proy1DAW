# Pendientes por confirmar con el profesor

> Última actualización: 23 de septiembre de 2026. Los comentarios `AGREGADO:`
> y `CAMBIO:` que marcaban estos puntos en el código ya se limpiaron (ver
> `REPORTE-COMENTARIOS.md`), así que este documento es ahora la única
> referencia escrita de qué se apartó del código de clase.

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
- **MongoDB:** a diferencia de lo que se pensó al principio, sí se usa el
  tipo binario nativo de Mongo (`Binary`/`BinData`), de forma equivalente al
  `BYTEA` de PostgreSQL: el servidor convierte el base64 a binario con
  `Buffer.from(base64, "base64")` antes de guardarlo en el campo `logo`
  (partidos) o `foto` (figuras), y al leer hace `buffer.toString("base64")`
  para devolverlo en el JSON. No existe un campo `logoBase64`/`fotoBase64`
  con el texto plano, como se pensó en una primera versión de este documento.

**Qué confirmar:** si el profesor mostró una técnica distinta en clase para
guardar binarios (por ejemplo, otra forma de usar `Buffer`/`BYTEA`, o el uso
de una librería específica), hay que reemplazar esta implementación por esa
exacta. Está implementado en:

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

Además, se agregó un segundo mecanismo de Carga Lazy: la lista ya no trae
los 60/120 documentos de una sola vez, sino en tandas de 10 (`skip`/`limit`
en la consulta a Mongo), con un botón "Ver más" que pide la siguiente
tanda. Implementado en:

- `App/dao/PartidoMongoDAO.js` y `FiguraMongoDAO.js` → `obtenerTodos(saltar, limite)`
- `App/public/js/partidosMongo.js` y `figurasMongo.js` → `verMas()` y `cargarMongo()`

**Qué confirmar:** si el profesor no espera paginación (solo la exclusión
del campo de imagen), se puede quitar el botón "Ver más" y volver a traer
todos los documentos de una vez sin tocar el resto de la Carga Lazy.

> Bug conocido, sin arreglar todavía: el botón "Ver más" no se oculta en la
> última página cuando el total es múltiplo exacto de 10 (que es el caso de
> los 60 partidos y las 120 figuras) — hace falta un clic extra que trae 0
> resultados para que recién ahí desaparezca. No pierde ni duplica datos.

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

## 6. Diferencias con el código de clase

El código de cada parte se copió de su proyecto de referencia
(Parte 1 = PROYECTOESTUDIANTES/S2-SW, Parte 2 = S4-SW, Parte 3 = S5-SW) con
la misma estructura, formato, comentarios, `console.log` y mensajes de
error. Todo lo que no es exactamente igual a la referencia quedó marcado en
el código con comentarios `AGREGADO:` / `CAMBIO:` mientras se desarrollaba,
pero esos comentarios **ya se revisaron y se limpiaron** (quedan cero en las
3 partes) — este documento es el que queda como mapa de esas diferencias:

- **Agregado** (no existe en la referencia): el log de acciones, el menú
  lateral con sidebar, las imágenes serializadas de Parte 2 y 3, la Carga
  Eager (JOIN) de Parte 2, la Carga Lazy (exclusión de imagen + paginación)
  de Parte 3, y el campo `tipo` de Mongo.
- **Cambiado** respecto a la referencia: `db/database.js` lee los datos de
  conexión del `.env` en vez de tenerlos hardcodeados, el login redirige a
  `/menu` en vez de ir directo a la vista de la entidad, y el botón Editar
  de Parte 2 consulta por ID en vez de pasar todos los campos por `onclick`
  (porque son 8 campos, no 2 como en la referencia).
