# Tarea 4 - Pruebas de Caja Negra: Dominios.GT 🇬🇹

Este repositorio contiene los scripts de automatización y el entorno de pruebas de caja negra diseñado para evaluar la nueva landing page del sistema de registro de Dominios.GT en un entorno de producción. 

La tarea fue desarrollada como parte del curso **Ingeniería de Software 2** de la Universidad del Valle de Guatemala

Al no tener acceso al código fuente, las pruebas se enfocan en verificar el comportamiento del frontend y backend exclusivamente a través de la interfaz web

## Equipo de Trabajo (Grupo)
*   **Pedro Caso** - 241286
*   **Diego Calderón** - 241263
*   **Hugo Méndez** - 241265
*   **Javier Alvarado** - 24546
*   **Miguel Rosas** - 241274

## Tecnologías y Herramientas
*   **[Node.js](https://nodejs.org/)**: Entorno de ejecución.
*   **[Playwright](https://playwright.dev/)**: Framework principal para la automatización de pruebas E2E (End-to-End) en navegadores Chromium, Firefox y WebKit.
*   **TypeScript**: Lenguaje utilizado para escribir los scripts de prueba.

## Requisitos Funcionales Evaluados
Se diseñaron un total de 33 casos de prueba (3 por cada requisito). Los scripts en este repositorio automatizan la verificación de los siguientes dominios funcionales:
*   **Contenido:** Información principal, Noticias (RF-1.1, RF-1.2) y Estadísticas (RF-1.3).
*   **Herramientas:** Buscador de dominios (RF-2.1), Consultas WHOIS (RF-2.2) y Traductor IDN (RF-2.3).
*   **Carrito y Compra:** Gestión de `localStorage` (RF-3.1) y restricciones de sesión (RF-3.2).
*   **Renovación y Configuración:** Renovación rápida (RF-4.1, RF-4.2) e Internacionalización (RF-5.1).

*(Nota: Algunos flujos complejos, como el login con Google o pagos reales, fueron ejecutados y documentados de forma manual según los lineamientos de la tarea)*.

## Configuración e Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Pxdro-410/Tarea4SW-G3.git