Nota: Aún en desarrollo. Se irá desarrollando a medida que se vaya avanzando el proyecto.

## ÍNDICE

  - [Propuesta del proyecto](#propuesta-del-proyecto)
    - [Título del Proyecto](#título-del-proyecto)
    - [Descripción del Proyecto](#descripción-del-proyecto)
    - [Motivación](#motivación)
    - [Stack Tecnológico Utilizado](#stack-tecnológico-utilizado)
  - [Requisitos Funcionales](#requisitos-funcionales)
  - [Requisitos Adicionales](#requisitos-adicionales)
  - [Entregable 1 (Fecha: 08/04)](#entregable-1-fecha-0804)
    - [Objetivos](#objetivos)
    - [Estructuración del proyecto](#estructuración-del-proyecto)
    - [Base de Datos](#base-de-datos)
    - [Evolución y puntualidades](#evolución-y-puntualidades)

#### Propuesta del proyecto

##### Título del Proyecto

AR-Task Manager - Gestor de Tareas y Proyectos (o AR-Task para abreviar)

##### Descripción del Proyecto

AR-Task es una aplicación web completa diseñada para la gestión eficiente de tareas y proyectos. Ofrece una plataforma intuitiva y colaborativa para usuarios individuales y equipos, permitiendo la creación de grupos de usuarios. Además de la gestión básica de tareas y proyectos, se pretende implementar características avanzadas como fechas límite, recordatorios, categorías y colaboración en tiempo real.

##### Motivación

Como estudiante interesado por la informática y el desarrollo de software, me encontré enfrentando un desafío recurrente en mi vida académica y sobre todo a la hora de enfrentar trabajos o llevar simplemente un listado de todo lo que tenía que hacer para x día o simplemente para llevar organizado todo.

Puede que sea el único que no utilice herramientas de este tipo ya, ya sea con google o porque simplemente no me siento cómodo usando ninguna de estas y acabo realizando lo que para muchos puede ser lo más sencillo (como en mi caso por ejemplo), que es llevarlo todo a cabo en un bloc de notas un listado de todas las cosas que voy haciendo o me quedan por hacer. Dejo de ejemplo dos imágenes:

![ImgMotivacion1](/docs/images-readme/1.png)
![ImgMotivacion2](/docs/images-readme/2.png)

Y no ha sido hasta que me ha tocado pensar en la idea sobre la que hacer el proyecto que no he caído en la necesidad, por ejemplo en mi caso, de una herramienta que me permita hacer todas estas cosas

Motivado por todo esto es que empecé a maquinar en mi cabeza la idea de AR-Task . Una aplicación web que integre todas estas características y algunas adicionales que me parecían curiosas. Pero en las que aún me tengo que informar/formar para ver cómo implementarlas en un proyecto real. Es el caso de Socket.io, una biblioteca de JavaScript que permite la comunicación en tiempo real entre clientes web y servidores. Es especialmente útil para construir aplicaciones web interactivas y colaborativas donde la actualización instantánea de información es crucial.

##### Stack Tecnológico Utilizado

- **Frontend:** Angular
- **Backend:** Spring
- **Estilo:** CSS
- **Base de Datos:** Inicialmente H2, luego se migrará a MySql
- **Autenticación:** JSON Web Tokens (JWT)
- **Herramientas de Desarrollo:** Git para control de versiones, GitHub para colaboración
- **Colaboración en Tiempo Real:** (A determinar) Socket.io
- **Herramientas para el Despliegue:** AWS o Docker (Por determinar)

#### Requisitos Funcionales

**RF01 - Sistema de Autenticación y login:**

- Implementar un sistema de autenticación seguro para que los usuarios accedan a sus cuentas.
- Posible integración con otras plataformas de login (Google, GitHub, etc.).

**RF02 - Registro de Usuarios:**

- Permite a los usuarios nuevos crear cuentas en la aplicación.

**RF03 - Gestión de Perfiles de Usuario:**

- Los usuarios pueden editar y actualizar sus perfiles, incluyendo nombre, foto de perfil y preferencias personales.

**RF04 - Gestión de Usuarios por parte del Administrador:**

- El administrador puede realizar operaciones CRUD sobre los perfiles de usuario, incluyendo crear, editar, desactivar y eliminar cuentas de usuario.

#### Requisitos Adicionales

**RF05 - Creación de Tareas:**

- Los usuarios pueden crear nuevas tareas, incluyendo detalles como título, descripción, fechas y categorías.

**RF06 - Creación de Proyectos:**

- Los usuarios pueden crear proyectos, estableciendo detalles como nombre, descripción, fechas, categorías y miembros del proyecto.

**RF07 - Organización de Tareas y Proyectos:**

- Capacidades para organizar tareas y proyectos mediante asignación de categorías y etiquetas.

**RF08 - Búsqueda y Filtrado:**

- Funcionalidad de búsqueda y filtrado para encontrar rápidamente tareas y proyectos específicos.

**RF09 - Eliminación de Tareas y Proyectos:**

- Opción para eliminar tareas y proyectos, con posibilidad de recuperación.

#### Entregable 1 (Fecha: 08/04)

##### Objetivos

- Establecer repositorios en GitHub para el frontend y backend del proyecto.

##### Estructuración del proyecto

- [Backend](https://github.com/RicardoFgX/Proyecto-Final/tree/main/src-api)
![ImgMotivacion1](/docs/images-readme/3.png)

- [Frontend](https://github.com/RicardoFgX/Proyecto-Final/tree/main/src-frontend)
![ImgMotivacion1](/docs/images-readme/4.png)

##### Base de Datos

- El diseño inicial de la base de datos, aún abierto a futuras mejoras que se tengan que hacer para llevar a cabo el proyecto es el siguiente:
![ImgMotivacion1](/docs/images-readme/5.png)

- Algunas puntualidades que se pueden comentar son los enumerados que se han utilizado en algunas tablas. Empezando por la tabla “usuarios”, el campo “rol” es un enumerado que va a variar según el rol del usuario en cuestión.
  
![ImgMotivacion1](/docs/images-readme/6.png)

- Al igual ocurre con la tabla “tareas”, que hace referencia a los hitos dentro de un proyecto, donde el campo estado variará según, valga la redundancia, el estado del mismo.
  
![ImgMotivacion1](/docs/images-readme/7.png)

##### Evolución y puntualidades

- Esta primera entrega ha sido la más lenta en cuanto a desarrollo y trabajo plasmado en el proyecto como tal pues, a pesar de tener ya elaborado la propuesta del mismo, tan solo se tenía unas pequeñas pautas y la idea del mismo, por lo que una gran parte de este primer “spring” ha sido concretar y tomar decisiones reales en cuanto al desarrollo.

  En esta primera entrega se ha creado el proyecto para el frontend, aún sin desarrollar ya que se hará tomando de referencia el modelo en Figma y por otro lado la creación del proyecto para el backend, donde se ha trabajo principalmente.

  La estructura inicial del backend es la siguiente:

  ![ImgMotivacion1](/docs/images-readme/8.png)

- Se han desarrollado ya tanto los modelos de los objetos con los que va a trabajar la aplicación, que corresponden con los de la base de datos, como las clases para los repositorios, servicios y la implementación de estos

![ImgMotivacion1](/docs/images-readme/9.png)