# Fly Away · Frontend

Laboratorio CS2031, semana 14. React, TypeScript, Vite y Axios.

## Requisitos

Node.js 20.19+ o 22.12+ y JDK 26 para ejecutar el backend.

## Ejecutar

Desde la carpeta `backend`, inicia la API:

```powershell
.\mvnw.cmd spring-boot:run
```

En otra terminal, desde `frontend`:

```powershell
npm install
npm run dev
```

Abre la dirección que indique Vite (por defecto http://127.0.0.1:5173).
El backend debe estar disponible en http://localhost:8080.
Para cambiar la dirección de la API, copia `.env.example` como `.env.local`, edita `VITE_API_URL` y reinicia Vite.

Cuenta de prueba: `ana.garcia@utec.edu.pe` / `Password1`.

## Funcionalidades

Registro, login con JWT, nombre del usuario, búsqueda por vuelo/aerolínea/fechas, reservas, detalle, Mis reservas, cierre de sesión y rutas protegidas.

Las referencias de reservas se guardan por cuenta en este navegador. H2 se reinicia al detener el backend. Las referencias verifican usuario, vuelo y fecha para detectar IDs reutilizados; los errores temporales conservan los datos locales.

## Compilar

```powershell
npm run build
```
