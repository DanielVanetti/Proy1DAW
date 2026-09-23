# Reporte de comentarios largos/verbosos — Proyecto 1, Grupo 5

Documento de solo lectura: lista los comentarios que quedaron más largos de lo
necesario en las 3 partes, para compactarlos igual que se hizo con
`App/utils/logger.js`. Ningún comentario listado aquí fue modificado todavía —
son sugerencias para que cada responsable revise y decida.

- **Fecha:** 23 de septiembre de 2026
- **Criterio usado:** el mismo que se aplicó a mano en `App/utils/logger.js` —
  una sola idea por bloque/línea, sin explicar de más. Se excluyen los
  comentarios cortos que ya siguen el estilo minimalista del profesor (varios
  confirmados como copia textual de S2-SW / S4-SW / S5-SW) — esos no se listan.

## Reparto de responsabilidades

| Parte | Responsable | Candidatos encontrados |
|-------|-------------|------------------------|
| Parte 1 | Alejandro | 1 |
| Parte 2 | Daniel | 8 |
| Parte 3 | Josué | 5 (+ 2 duplicados sueltos) |

---

## Parte 1 — Archivos .txt (1 candidato)

### `App/controllers/authController.js:106-111`

Único header de Parte 1 que rompe el patrón de "una sola línea de título".

Actual:
```
/*=========================================
  Mostrar menú principal
  menú lateral que se muestra
  después de una autenticación correcta
  (requerimiento del proyecto)
=========================================*/
```

Sugerido:
```
/*=========================================
  Mostrar menú principal (requerimiento del proyecto)
=========================================*/
```

Todo lo demás en Parte 1 ya sigue el estilo compacto del profesor.

---

## Parte 2 — PostgreSQL (8 candidatos)

### 1. Comentario de BYTEA repetido en los 4 controllers

`controllers/partidoPgController.js:5-6` (y espejo en `propuestaPgController.js:5-6`,
`figuraPgController.js:5-6`, `cargoPgController.js:5-6`)

Actual:
```
// La columna "logo" es BYTEA: PostgreSQL la devuelve como binario (Buffer)
// y aquí se convierte a texto base64 para enviarla serializada a la vista.
```

Sugerido:
```
// "logo" es BYTEA (Buffer); se convierte a base64 para enviarla a la vista.
```

### 2. `// La imagen llega en base64 y se convierte a binario (BYTEA)` — repetida 8 veces

Aparece 2 veces por controller (crear y actualizar) en los 4 controllers Pg
(`partidoPgController.js:89,126`; `propuestaPgController.js:91,128`;
`figuraPgController.js:89,126`; `cargoPgController.js:91,129`).

Sugerido: dejarla solo en "crear" y en "actualizar" fusionarla con el
comentario de COALESCE que está justo debajo:
```
// Imagen en base64 -> binario; COALESCE conserva la actual si no se sube una nueva
```

### 3. `db/database.js:5-6`

Actual:
```
// Las columnas DATE se devuelven como texto "AAAA-MM-DD"
// para cargarlas en los <input type="date"> sin cambios de zona horaria
```

Sugerido:
```
// Las columnas DATE llegan como texto "AAAA-MM-DD" (evita corrimiento de zona horaria en <input type="date">)
```

### 4. Header de `serializarImagen` con prosa extra

`public/js/partidosPg.js:65-69` y `public/js/figurasPg.js:65-69` — único
header del archivo con explicación de varias líneas en vez de solo título.

Actual:
```
// ==========================================
// SERIALIZAR IMAGEN
// Lee el archivo seleccionado y lo convierte a texto
// base64 para enviarlo dentro del JSON al servidor
// ==========================================
```

Sugerido:
```
// ==========================================
// SERIALIZAR IMAGEN (archivo -> base64 para el JSON)
// ==========================================
```

### 5. Bloque de 2-3 líneas antes de renderizar cada fila

`partidosPg.js:119-120,471-473` y `figurasPg.js:119-120,471-473`.

Actual (ejemplo de propuestas/cargos):
```
// partido_nombre y partido_siglas vienen de la CARGA EAGER (JOIN)
// La imagen llega serializada en base64 y se muestra en un <img>
// El botón Editar solo envía el id, porque son 8 campos
```

Sugerido (mantener la línea de CARGA EAGER porque es específica de cada
entidad; fusionar las otras dos):
```
// partido_nombre y partido_siglas vienen de la CARGA EAGER (JOIN)
// Imagen en base64 para el <img>; Editar solo manda el id (son 8 campos)
```

Para partidos/figuras (sin línea de JOIN), quedaría en una sola línea:
```
// Imagen en base64 para el <img>; Editar solo manda el id (son 8 campos)
```

### 6. Comentario de imagen en las vistas — 4 ocurrencias

`views/partidosPg.html:126-127,260-261` y `views/figurasPg.html:126-127,260-261`

Actual:
```html
<!-- Imagen que se guarda como binario (BYTEA)
     y viaja serializada en base64 desde la vista -->
```

Sugerido:
```html
<!-- Imagen: se guarda como BYTEA, viaja en base64 desde la vista -->
```

### 7. Divisor de "TABLA 2" con una línea de más

`views/partidosPg.html:191-194` y `views/figurasPg.html:191-194` — su
hermano "TABLA 1" solo trae el título, este trae una línea extra.

Actual (ejemplo `partidosPg.html`):
```html
<!-- =========================================
     TABLA 2: PROPUESTAS
     (relacionada con partidos por partido_id)
========================================== -->
```

Sugerido:
```html
<!-- =========================================
     TABLA 2: PROPUESTAS (relacionada con partidos por partido_id)
========================================== -->
```

(mismo cambio en `figurasPg.html` con "CARGOS HISTÓRICOS (relacionada con
figuras por figura_id)")

### 8. `<h1>` viejo comentado — código muerto, no un comentario explicativo

`views/partidosPg.html:57` y `views/figurasPg.html:57`.

No es candidato a "acortar": es candidato a **borrar directamente**. Dato
aparte: ya venía así en el propio `S4-SW` original, no lo agregó el equipo.

---

## Parte 3 — MongoDB (5 candidatos + 2 duplicados sueltos)

### 1. `public/js/partidosMongo.js:9-10` y `public/js/figurasMongo.js:9-10`

Actual:
```
// CARGA LAZY: los documentos se piden de 10 en 10.
// saltarMongo: lleva la cuenta de los que ya se cargaron.
```

Sugerido:
```
// CARGA LAZY: los documentos se piden de 10 en 10 (saltarMongo lleva la cuenta)
```

### 2. `public/js/partidosMongo.js:350-351`

Actual:
```
// CARGA LAZY: el logo solo llega al consultar
// un documento específico, no en MOSTRAR TODOS
```

Sugerido:
```
// CARGA LAZY: el logo solo llega al consultar un documento específico
```

### 3. `public/js/figurasMongo.js:459-460`

Actual:
```
// CARGA LAZY: la foto solo llega al consultar
// un documento específico, no en MOSTRAR TODOS
```

Sugerido:
```
// CARGA LAZY: la foto solo llega al consultar un documento específico
```

### 4. (menor) `dao/PartidoMongoDAO.js:86` y `dao/FiguraMongoDAO.js:109`

Ya son una sola línea, pero empaquetan dos ideas.

Actual:
```
// CARGA LAZY : aquí se trae solo la lista de documentos sin la imagen y con paginación
```

Sugerido:
```
// CARGA LAZY: lista sin imagen, paginada
```

### 5. (menor) `public/js/partidosMongo.js:510` y `public/js/figurasMongo.js:619`

Actual:
```
// CARGA LAZY: trae solo la siguiente tanda de documentos, saltando los que ya estan en la tabla
```

Sugerido:
```
// CARGA LAZY: trae la siguiente tanda, saltando los que ya están cargados
```

### Duplicados sueltos (no es verbosidad, es repetición literal)

- `public/js/partidosMongo.js:109-110` — el título `// SERIALIZAR IMAGEN`
  aparece dos veces seguidas dentro del mismo header. En `figurasMongo.js`
  aparece correctamente una sola vez.
- `views/partidosMongo.html:205-206` — el comentario
  `<!-- Imagen serializada en base64 dentro del documento -->` está
  duplicado línea por línea. En `figurasMongo.html` aparece una sola vez.

---

## Confirmado, sin acción necesaria

El resto de comentarios de las 3 partes ya sigue el estilo minimalista del
profesor (headers de una sola línea, comentarios cortos de una idea), y en
varios casos se confirmó que son copia textual de S2-SW / S4-SW / S5-SW. No
se listan todos individualmente porque no requieren cambios.
