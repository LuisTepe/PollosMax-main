---
id: install-guide
title: Guía de Instalación
---

# Guía de Instalación del Proyecto

Esta guía te ayudará a configurar el entorno de desarrollo para el proyecto.

## Requisitos Previos

- [Node.js](https://nodejs.org/) (versión X.X.X o superior)
- Git

## Pasos para clonar el repositorio y configurar el entorno

1. Clona el repositorio desde GitHub:

    ```bash
    git clone https://github.com/LuisTepe/PollosMax
    ```

2. Instala las dependencias del proyecto:

    ```bash
    cd repositorio
    npm install
    ```

3. Configura las variables de entorno:

    Crea un archivo `.env` basado en el archivo de ejemplo `.env.example` y actualiza las variables según sea necesario.

4. Ejecuta el proyecto:

    ```bash
    npm start
    ```

### Problemas Comunes

- **Error al instalar dependencias**: Asegúrate de estar usando una versión compatible de Node.js.
- **Problemas con la base de datos**: Verifica la configuración de tu base de datos en el archivo `.env`.