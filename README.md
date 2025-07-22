# ⚔️ ByteBattle — Plataforma de Retos de Programación Competitiva

[![Angular](https://img.shields.io/badge/Built%20with-Angular%2020-red?style=for-the-badge&logo=angular)](https://angular.io/)
[![Status](https://img.shields.io/badge/Estado-En%20Desarrollo-blue?style=for-the-badge)]()
[![License](https://img.shields.io/badge/Licencia-GPL%203.0-brightgreen?style=for-the-badge)](https://www.gnu.org/licenses/gpl-3.0.html)

---
## 🎯 Descripción General

**ByteBattle** es una plataforma personal y colaborativa diseñada para fomentar la competencia amistosa entre programadores a través de desafíos seleccionados al azar desde [aceptaelreto.com](https://aceptaelreto.com). Cada reto representa una batalla por el honor… y por un pequeño pozo acumulado. Los participantes deben pagar una cuota simbólica antes de poder registrar su participación. Solo tras la validación del pago por parte del administrador, el sistema permite el ingreso del puntaje obtenido.

Esta aplicación corresponde al **frontend** del sistema, desarrollado en **Angular 20**, e interactúa con una API REST personalizada que gestiona usuarios, retos, participaciones y notificaciones en tiempo real.

---
## ✨ Características Principales

- 🎲 **Retos aleatorios**: Los desafíos son seleccionados de forma aleatoria desde una lista de retos preestablecidos provenientes de aceptaelreto.com.
- 🧑‍💻 **Participaciones con validación de pago**: Cada intento de participación requiere una confirmación previa del pago por parte del administrador.
- 🏅 **Registro de puntajes y clasificación**: Los usuarios pueden registrar su puntaje y código fuente solo si el pago ha sido aprobado.
- 📩 **Sistema de notificaciones**: Tanto los usuarios como los administradores reciben notificaciones sobre pagos, confirmaciones y resultados.
- 🔐 **Autenticación y gestión de usuarios**:
  - Registro, login y verificación de email.
  - Visualización y edición del perfil.
  - Asignación de roles (usuario / administrador).
  - Bloqueo de cuentas por mal comportamiento.
- 👑 **Panel administrativo**:
  - Confirmación o rechazo de pagos.
  - Gestión de retos y visualización de participaciones.
  - Asignación de ganadores y actualización automática de ganancias.

---
## 💻 Tecnologías Utilizadas

- **Frontend**: Angular 20 (con rutas protegidas y módulos personalizados)
- **Lenguaje**: TypeScript, HTML5, SCSS
- **Estilos**: Bootstrap
- **Backend vinculado**: Node.js + Firebase (repositorio aparte)
- **Autenticación y sesiones**: JWT (con expiración automática en frontend)
- **Notificaciones**: Push internas por módulo propio en Angular

---
## 📂 Estructura del Repositorio

```
ByteBattleFront/
│
├── src/
│   ├── app/
│   │   ├── components/              # Componentes UI
│   │   │   ├── auth/                # Login, registro, verificación
│   │   │   ├── challenge/           # Listado y detalles de retos
│   │   │   ├── participation/       # Envío de puntaje y código
│   │   │   ├── admin/               # Panel de administración (oculto)
│   │   │   ├── notification/        # Gestión y visualización de notificaciones
│   │   │   └── shared/              # Header, mensajes, etc.
│   │   ├── services/                # Servicios lógicos
│   │   │   ├── auth.ts             # Lógica de autenticación y sesiones
│   │   │   ├── challenge.ts        # Gestión de retos
│   │   │   ├── participation.ts    # Registro y envío de resultados
│   │   │   ├── notification.ts     # Notificaciones push
│   │   │   ├── admin-notification.ts # Envíos especiales para admin
│   │   │   └── profile.ts          # Perfil del usuario
│   │   ├── guards/                 # Protección de rutas
│   │   ├── interfaces/             # Modelos de datos
│   │   ├── app.routes.ts           # Definición de rutas (incluye rutas ocultas)
│   │   ├── app.config.ts
│   │   ├── app.html
│   │   ├── app.scss
│   │   └── app.ts
│   └── assets/                     # Imágenes, íconos, etc.
│
├── environments/                   # Configuración de entorno
├── .gitignore
└── README.md
```

---
## 🚀 Instrucciones de Ejecución

### Requisitos

- Node.js (versión compatible con Angular 20)
- Angular CLI
- Git
- API Backend de ByteBattle en ejecución (consultar repositorio separado)

### Pasos

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/SebastianVega4/ByteBattleFront.git
   cd ByteBattleFront
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar entorno**:
   Crear archivo \environment.ts\ en \src/environments/\ con la URL de la API:
   ```ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3000/api'
   };
   ```

4. **Ejecutar localmente**:
   ```bash
   ng serve
   ```

5. **Acceder**:
   Navegar a \http://localhost:4200/.  
   Para el panel admin, acceder a la ruta oculta (una vez autenticado como administrador).

---
## 👨‍🎓 Autor

Desarrollado por **Sebastián Vega**  
📧 *Sebastian.vegar2015@gmail.com*  
🔗 [LinkedIn - Johan Sebastián Vega Ruiz](https://www.linkedin.com/in/johan-sebastian-vega-ruiz-b1292011b/)

---
## 📜 Licencia

Este proyecto está bajo la licencia **GPL 3.0**.

**Permisos:**

- Uso comercial
- Modificación
- Distribución
- Uso privado
- 
---
Ingeniería de Sistemas 🧩  
🏫   
📍 Duitama, Boyacá 📍

© 2025 — Sebastián Vega
