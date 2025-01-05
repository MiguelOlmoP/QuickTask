# QuickTask
QuickTask es una aplicación web diseñada para gestionar tareas de manera eficiente y visual. Permite a los usuarios añadir tareas con una descripción, prioridad (alta, media, baja), y una fecha y hora programadas.

**Características principales**:

* Creación de tareas: Añade nuevas tareas con una descripción, prioridad y fecha personalizada.
* Edición: Modifica tareas existentes de manera sencilla.
* Eliminación: Confirma antes de eliminar una tarea con un modal interactivo.
* Visualización intuitiva: Muestra las tareas en tarjetas organizadas, con colores distintivos para cada nivel.
* Validaciones:
    - Garantiza que las fechas seleccionadas sean posteriores a la actual.
    - Asegura que el campo de descripción no esté vacío antes de guardar una tarea.

> **Tecnologías utilizadas**:
>
> * React y Vite para el desarrollo frontend.
> * DatePicker para la selección de fechas y horas.
> * React-Select para la elección de prioridades.
> * React-Bootstrap: Usado para implementar modales interactivos.
> * React-Toastify para notificaciones visuales.
> * UUID para generar identificadores únicos.  

# Cambios por versión

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