# Blue Bull - Task Manager

## Descripción

Blue Bull - Task Manager es una aplicación web diseñada para proporcionar una solución integral a la gestión de tareas y proyectos, permitiendo a los usuarios crear, organizar y gestionar proyectos, tareas y anotaciones de manera eficiente.

## Características

- **Sistema de Autenticación y Login**: Permite a los usuarios iniciar sesión y redirige según el rol.
- **Registro de Usuarios**: Los usuarios pueden registrarse en la plataforma.
- **Gestión de Perfiles de Usuario**: Edición y actualización de datos de usuario.
- **Gestión de Usuarios por el Administrador**: Operaciones CRUD sobre los perfiles de usuario.
- **Creación de Anotaciones**: Similar a Post-it, los usuarios pueden crear y gestionar anotaciones.
- **Creación y Gestión de Tareas y Proyectos**: Los usuarios pueden crear, editar y eliminar tareas y proyectos.
- **Reorganización de Tareas**: Funcionalidad intuitiva para reorganizar el estado de las tareas del proyecto.
- **Administración Completa**: Los administradores pueden realizar operaciones CRUD sobre anotaciones, tareas y proyectos.

## Tecnologías Utilizadas

- **Frontend**: Angular
- **Backend**: Spring
- **Estilo**: CSS y Librería de Bootstrap
- **Base de Datos**: MySQL
- **Autenticación**: JSON Web Tokens (JWT)
- **Herramientas de Desarrollo**: Git y GitHub
- **Herramientas para el Despliegue**: AWS

## Esquema E-R y Descripción de Entidades

![ER Diagram](/docs/images-readme/5.png)

### Entidades Principales

- **Usuarios**
  - id, apellidos, contrasena, email, nombre
- **Usuario_rol**
  - usuario_id, rol
- **Proyectos**
  - id, descripcion, fecha_creacion, nombre, ultima_fecha_modificacion
- **Tareas**
  - id, descripcion, estado, fecha_vencimiento, nombre, proyecto_id
- **Anotaciones**
  - id, contenido, titulo, usuario_id
- **Usuario_proyecto**
  - usuario_id, proyecto_id

## Despliegue
Para mas información ver la documentación

### En AWS

1. **Configuración de EC2**: Crear y configurar instancias EC2 para alojar el backend.
2. **Base de Datos**: Configurar una instancia de Amazon RDS para MySQL.
3. **Almacenamiento S3**: Utilizar Amazon S3 para almacenar y servir contenido estático.

### En Local

1. **Requisitos Previos**: Tener Java y MySQL instalados.
2. **Clonar el Repositorio**: `git clone https://github.com/RicardoFgX/Proyecto-Final`
3. **Configurar Base de Datos**: Editar las propiedades en `Proyecto-Final/src-api/src/main/resources/application.properties`.
4. **Desplegar Backend**: `java -jar proyectoFinal-0.0.1-SNAPSHOT.jar`
5. **Verificar Despliegue**: Utilizar Postman para probar los endpoints de la API.

## Prototipo de la Aplicación Web

El prototipo de la aplicación se encuentra disponible en Figma: [Enlace al Figma](https://www.figma.com/design/0pT3Rlh9RoYocCwsvtkTLE/Untitled?node-id=0-1&t=yFs9hJkM2Qt74EBs-1)

## Documentación de API

- **Swagger-UI**: `http://localhost:8080/swagger-ui/index.html` o `http://ec2-44-204-237-104.compute-1.amazonaws.com:8080/swagger-ui/index.html`
- **Postman**: El fichero con todos los métodos se encuentra en [docs/postman](https://github.com/RicardoFgX/Proyecto-Final/tree/main/docs/postman)

## Conclusiones del Proyecto

El proyecto ha sido un éxito en términos de desarrollo y aprendizaje. Con algunas mejoras, tiene el potencial de convertirse en una herramienta valiosa en el mercado de gestión de tareas y proyectos.

## Contacto

Para más información, puedes contactar al autor:
- **Nombre**: Ricardo Fernández Guzmán
- **Correo**: ricardofg2000@gmail.com