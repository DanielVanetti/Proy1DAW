# Cómo ejecutar el proyecto (Grupo 6 - Política y Figuras Públicas)

## 1. Instalar dependencias

```
cd App
npm install
```

## 2. Configurar variables de entorno

```
cd App
copy .env.example .env
```

Editar `.env` y poner el password real de PostgreSQL (`PG_PASSWORD`).

## 3. PostgreSQL (Parte 2)

1. Crear la base de datos `BDPostgreSQL` (con pgAdmin o `psql`).
2. Ejecutar, en este orden, contra `BDPostgreSQL`:
   - `PostgreSQL/ScriptCrearBaseDatos.sql`
   - `PostgreSQL/ScriptPopularBaseDatos.sql`

## 4. MongoDB (Parte 3)

1. Tener MongoDB corriendo localmente (`mongod`, puerto 27017 por defecto, o el que se
   configure en `MONGO_URI`).
2. Importar los 180 documentos (60 partidos + 120 figuras) a la colección `CollMongoDB`,
   en la base indicada por `MONGO_DATABASE` del `.env`. Con `mongoimport`:

```
mongoimport --db proyecto1_politica --collection CollMongoDB --file "MongoDB/Script-60-MONGO.JSON" --jsonArray
mongoimport --db proyecto1_politica --collection CollMongoDB --file "MongoDB/Script-120-MONGO.JSON" --jsonArray
```

(También se puede importar arrastrando los dos archivos desde MongoDB Compass.)

## 5. Ejecutar la aplicación

```
cd App
npm start
```

Abrir `http://localhost:3000`.

## 6. Usuarios de prueba (login)

Definidos en `App/data/usuarios.txt`:

- `admin` / `admin123`
- `grupo6` / `politica2026`

## 7. Antes de entregar

- Poner los nombres completos y cédulas del grupo en el PDF
  `Grupo-#-Explicacion.pdf` (el login quedó igual al de PROYECTOESTUDIANTES).
- Revisar **`PENDIENTES.md`** (en la raíz de este proyecto) y confirmar con el
  profesor los puntos marcados como "propuesta pendiente de confirmar"
  (serialización de imágenes, Carga Eager, Carga Lazy, una sola colección Mongo).
- Revisar los comentarios `AGREGADO:` y `CAMBIO:` del código: marcan todo lo que
  no es exactamente igual a PROYECTOESTUDIANTES (Parte 1), S4-SW (Parte 2) y
  S5-SW (Parte 3).
- Empacar los 3 ZIP con los nombres exactos que pide el enunciado
  (`ProyectoP4-App-Grupo-#.zip` con el contenido de `App/`,
  `ProyectoP4-PostgreSQL-Grupo-#.zip` con el contenido de `PostgreSQL/`,
  `ProyectoP4-MongoDB-Grupo-#.zip` con el contenido de `MongoDB/`) y el PDF
  `Grupo-#-Explicacion.pdf`.

## Verificación ya realizada

Esta aplicación fue probada de punta a punta en este entorno: arranque del
servidor, login correcto/incorrecto con log en `.txt`, CRUD de las 2 vistas
de Semana 2, CRUD con JOIN (carga eager) de las 2 vistas de Semana 4 contra
una base `BDPostgreSQL` real, y CRUD con carga lazy de las 2 vistas de
Semana 5 contra una base MongoDB real con los 180 documentos importados.
