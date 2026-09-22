# Proy1DAW — Partidos Políticos y Figuras Públicas

Proyecto 1 del curso Aplicaciones Basadas en Web (Grupo 5).

Aplicación web Node.js + Express con tres fuentes de datos.

Las Partes 1 y 3 siguen el esquema en capas `routes → controllers → services → dao → models`.
La Parte 2 (PostgreSQL) sigue el estilo de Semana 4: los controllers ejecutan el SQL
directamente contra el pool de `App/db/database.js`, sin capa de services ni DAO.

| Parte | Persistencia | Vistas |
|-------|--------------|--------|
| Parte 1 (Semana 2) | Archivos `.txt` | Partidos Políticos, Figuras Públicas |
| Parte 2 (Semana 4) | PostgreSQL (carga eager, con JOIN) | Partidos y Propuestas, Figuras y Cargos |
| Parte 3 (Semana 5) | MongoDB (carga lazy) | Partidos (60 docs), Figuras (120 docs) |

Todas las acciones quedan registradas en `App/logs/acciones.txt` con el formato
`Fecha - Hora / "Acción Realizada" / Usuario`.

## Requisitos

- **Node.js 18 o superior** (probado con Node 22). Express 5 y `node --watch` lo requieren.
- **PostgreSQL** (para la Parte 2).
- **MongoDB** corriendo localmente (para la Parte 3).

Las Partes 2 y 3 solo se necesitan para sus propias vistas; la Parte 1 funciona sin bases de datos.

## Instalación

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/DanielVanetti/Proy1DAW.git
cd Proy1DAW/App
npm install
```

### 2. Configurar variables de entorno

```bash
# desde la carpeta App/
copy .env.example .env      # Windows
cp .env.example .env        # macOS / Linux
```

Editar `App/.env` con los datos reales:

```
PORT=3000

PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=BDPostgreSQL
PG_USER=postgres
PG_PASSWORD=tu_password_aqui

MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DATABASE=proyecto1_politica
```

El archivo `.env` está en `.gitignore`: nunca se sube al repositorio.

### 3. Preparar PostgreSQL (Parte 2)

1. Crear la base de datos `BDPostgreSQL` (pgAdmin o `psql`).
2. Ejecutar contra esa base, **en este orden**:
   - `PostgreSQL/ScriptCrearBaseDatos.sql`
   - `PostgreSQL/ScriptPopularBaseDatos.sql`

Con `psql`:

```bash
psql -U postgres -c "CREATE DATABASE \"BDPostgreSQL\";"
psql -U postgres -d BDPostgreSQL -f PostgreSQL/ScriptCrearBaseDatos.sql
psql -U postgres -d BDPostgreSQL -f PostgreSQL/ScriptPopularBaseDatos.sql
```

### 4. Preparar MongoDB (Parte 3)

Con MongoDB corriendo (`mongod`, puerto 27017 por defecto), importar los 180 documentos
(60 partidos + 120 figuras) a la colección `CollMongoDB`:

```bash
mongoimport --db proyecto1_politica --collection CollMongoDB --file "MongoDB/Script-60-MONGO.JSON" --jsonArray
mongoimport --db proyecto1_politica --collection CollMongoDB --file "MongoDB/Script-120-MONGO.JSON" --jsonArray
```

También se pueden importar arrastrando ambos archivos desde MongoDB Compass.

## Ejecución

```bash
cd App
npm start          # producción: node app.js
npm run dev        # desarrollo: node --watch app.js (recarga al guardar)
```

Abrir <http://localhost:3000> (o el puerto definido en `PORT`).

### Usuarios de prueba

Definidos en `App/data/usuarios.txt`:

| Usuario  | Contraseña      |
|----------|-----------------|
| `admin`  | `admin123`      |
| `grupo5` | `politica2026`  |

## Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Login |
| `/menu` | Menú principal |
| `/partidos/pagina` | Partidos Políticos (`.txt`) |
| `/figuras/pagina` | Figuras Públicas (`.txt`) |
| `/partidos-pg` | Partidos y Propuestas (PostgreSQL) |
| `/figuras-pg` | Figuras y Cargos (PostgreSQL) |
| `/partidos-mongo` | Partidos (MongoDB) |
| `/figuras-mongo` | Figuras (MongoDB) |

## API REST

Cada entidad expone CRUD completo:

- **Parte 1:** `GET|POST|PUT /partidos`, `DELETE /partidos/:codigo` y
  `GET|POST|PUT /figuras`, `DELETE /figuras/:codigo`
- **Parte 2:** `/api/partidos`, `/api/propuestas`, `/api/figuras`, `/api/cargos`
  (`GET`, `GET /:id`, `POST`, `PUT /:id`, `DELETE /:id`)
- **Parte 3:** `/api/partidos/mongo`, `/api/figuras/mongo`
  (`GET`, `GET /:id`, `POST`, `PUT /:id`, `DELETE /:id`)

Las Partes 2 y 3 comparten los prefijos `/api/partidos` y `/api/figuras`. En `app.js` los
routers de Mongo se registran **antes** que los de PostgreSQL, porque si no `/api/partidos/mongo`
sería capturado por la ruta `/:id` de PostgreSQL. No cambiar ese orden.

## Estructura del proyecto

```
App/
  app.js            Punto de entrada y registro de rutas
  config/mongodb.js Conexión a MongoDB
  db/database.js    Pool de conexión a PostgreSQL
  routes/           Definición de endpoints
  controllers/      Request/response (y el SQL de la Parte 2)
  services/         Lógica de negocio de las Partes 1 y 3
  dao/              Acceso a datos: .txt (Parte 1) y MongoDB (Parte 3)
  models/           Modelos de dominio (Parte 1)
  views/            HTML de cada vista
  public/           CSS y JavaScript del cliente
  data/             Archivos .txt de la Parte 1
  utils/logger.js   Registro de acciones
PostgreSQL/         Scripts de creación y poblado
MongoDB/            Documentos JSON para importar
```

## Documentación adicional

- [`INSTRUCCIONES.md`](INSTRUCCIONES.md) — pasos de ejecución y checklist de entrega.
- [`PENDIENTES.md`](PENDIENTES.md) — puntos pendientes de confirmar con el profesor.
- [`REPORTE.md`](REPORTE.md) — estado del proyecto y hallazgos abiertos por responsable.
