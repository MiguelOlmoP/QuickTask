# QuickTask
QuickTask es una aplicación web diseñada para gestionar tareas de manera eficiente y visual. Permite a los usuarios añadir tareas con una descripción, prioridad (alta, media, baja), y una fecha y hora programadas. Además, los usuarios pueden registrarse e iniciar sesión, tanto mediante Google como con una cuenta propia, utilizando autenticación basada en JWT para asegurar sus datos y acceso.

### 📝 Características principales:

* **Creación de tareas:** Añade nuevas tareas con una descripción, prioridad y fecha personalizada.
* **Edición:** Modifica tareas existentes de manera sencilla.
* **Eliminación:** Confirma antes de eliminar una tarea con un modal interactivo.
* **Visualización intuitiva:** Muestra las tareas en tarjetas organizadas, con colores distintivos para cada nivel.
* **Gestión de usuarios:** Crea nuevos usuarios, tanto a través de Google como mediante un registro propio en la plataforma.


### 🔧 Tecnologías utilizadas:

* **React y Vite** para el desarrollo frontend.
* **DatePicker** para la selección de fechas y horas.
* **React-Select** para la elección de prioridades.
* **React-Bootstrap** para implementar modales interactivos.
* **React-Toastify** para notificaciones visuales.
* **Laravel** para el desarrollo backend.
* **JWT** para la gestión de autenticación de usuarios.
* **Autenticación con Google:** Integración con la API de Google para permitir el registro e inicio de sesión.

## 📌 Instalación y Configuración

<details>
<summary>⚙️ Ver configuración</summary>

  ### 🖥️ Configuración del __Backend__:

  ```
    1. Copia el archivo de configuración del ejemplo (.env.example) y renómbralo a (.env)

    2. En el archivo .env, completa los siguientes valores:

        -> DB_CONNECTION=mysql
        -> DB_HOST=127.0.0.1
        -> DB_PORT=3306
        -> DB_DATABASE=nombre_de_base_de_datos
        -> DB_USERNAME=root
        -> DB_PASSWORD=

        -> JWT_SECRET: Clave secreta para generar los tokens JWT. 
        -> JWT_ALGO: Algoritmo utilizado para firmar los tokens JWT (por defecto HS256).

        -> GOOGLE_CLIENT_ID: ID de cliente de Google obtenido en la consola de Google Cloud.
        -> GOOGLE_CLIENT_SECRET: Clave secreta del cliente de Google.
        -> GOOGLE_REDIRECT_URI: URL de redirección configurada en Google para la autenticación.

    3. Instalar y configurar JWT (si no está instalado)

        -> composer require tymon/jwt-auth  
        -> php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"  
        -> php artisan jwt:secret   

    4. Configuracion de Google

        -> Debes ir a la consola de Google Cloud y crear un proyecto.
        -> Habilita la API de autenticación de Google.
        -> Obtén el Client ID y Client Secret en la sección de Credenciales.
        -> Luego, agrega esos valores en el archivo .env bajo las variables GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET.
        -> Configurar la URL de redirección (GOOGLE_REDIRECT_URI) para que apunte a la ruta de tu aplicación donde recibirás la respuesta de Google después de la autenticación.
  ```

### 🎨 Configuración del __Frontend__:

  ``` 
    Debes modificar el archivo config.js con tus datos.
  ```

</details>
  
## 🔄 Cambios por versión

**Versión 1.0**

* Implementación básica de la aplicación con las funcionalidades principales:
    - Crear, editar y eliminar tareas.
    - Guardado de tareas en LocalStorage para garantizar persistencia entre sesiones.
    - Visualización de tareas organizadas en tarjetas con colores según la prioridad.
    - Validaciones:
        + La fecha de la tarea debe ser posterior a la fecha actual.
        + No se permite guardar tareas sin texto en el campo de descripción.

**Versión 2.0**

* Refactorización del proyecto: División del código en múltiples componentes para mejorar la organización y mantenibilidad.
* Modal interactivo: Uso de React-Bootstrap para añadir un modal de confirmación antes de eliminar tareas.
* Efectos visuales mejorados: Las tarjetas de tareas se elevan al pasar el cursor por encima, ofreciendo una experiencia de usuario más atractiva.


**Versión 3.0**

* **Integración de Laravel como backend**:
    - La aplicación ahora cuenta con un backend completo desarrollado con Laravel, que se comunica con React a través de una REST API.
    - Se han implementado endpoints para la gestión de tareas y usuarios.
* **Autenticación de usuarios**:
    - Se añadió la funcionalidad de registro e inicio de sesión de usuarios.
    - Se utiliza JWT (JSON Web Token) para gestionar la autenticación y proteger las rutas del backend.
* **Persistencia en base de datos**:
    - Todas las tareas y los usuarios se almacenan en una base de datos MySQL.
    - Las tareas ahora se guardan en el backend en lugar de LocalStorage.

**Versión 4.0**

* Implementación del inicio de sesión mediante Google para facilitar el registro e inicio de sesión.
* Se añadió el archivo "config.js" en el frontend para gestionar la URL base y el ID público de Google.
* Autenticación simplificada con JWT, eliminando la combinación con la sesión para mejorar la seguridad.