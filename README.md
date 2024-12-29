#  Bio-Blog 🌏

![Figma ](https://github.com/user-attachments/assets/b9adcc7d-bedf-44ad-8e2a-95a9f31ec5c9)


## Descripción del Proyecto
Bio-Blog es un blog ecológico enfocado en publicaciones relacionadas con una nutrición sostenible. Permite a los usuarios registrarse, iniciar sesión y participar en publicaciones mediante "likes". Además, existen dos roles de usuario: `admin` y `user`, con permisos específicos para la gestión del contenido. Los administradores pueden crear, editar y eliminar publicaciones, así como modificar roles de usuario. El proyecto está dividido en frontend (JavaScript) y backend (TypeScript) que se comunican mediante una API REST, respaldada por una base de datos MySQL.

## Características del Proyecto
- **Roles de Usuario**: `admin` y `user`, con permisos específicos.
- **Autenticación JWT**: Seguridad y acceso controlado a través de tokens.
- **Gestión de Posts**: CRUD completo para publicaciones con subida de imágenes.
- **Likes**: Los usuarios pueden dar y quitar "likes" a las publicaciones.
- **Comentarios**: Los usuarios pueden agregar comentarios a las publicaciones, creando una interacción más dinámica entre los usuarios y el contenido.
- **Validaciones**: Validación de datos con `express-validator`.
- **Testeo**: Tests en frontend con Mocks y en backend para verificar la funcionalidad.
- **Estado Global**: Manejo de estado global con Zustand en el frontend.
- **Estilos**: Diseño responsivo usando Tailwind CSS.
- **Conexión HTTP**: La comunicación frontend-backend se realiza con Axios.

---

## Comentarios en las Publicaciones

Ahora, los usuarios pueden interactuar aún más con las publicaciones añadiendo comentarios. Cada publicación tiene asociada una sección de comentarios donde los usuarios registrados pueden escribir su opinión o pregunta. Los comentarios se almacenan en la base de datos y están vinculados a cada publicación.

### Implementación de los Comentarios:
- **Frontend**: Se ha añadido un formulario para permitir que los usuarios dejen comentarios en el componente `CommentForm.jsx`, el cual se encuentra en la página de detalles de cada publicación (`PostDetail.jsx`). Los comentarios son visualizados en la sección `CommentSection.jsx`.
  
- **Backend**: Se ha implementado un controlador de comentarios (`commentController.ts`) que maneja la creación y obtención de comentarios para cada publicación. Los comentarios están gestionados en la base de datos con el modelo `commentModel.ts`.

### API para los Comentarios:

| Endpoint   | Descripción                                 |
|------------|---------------------------------------------|
| `/comments`| Crear y obtener comentarios de las publicaciones. |


# Estructura de Carpetas

```plaintext
BIO-BLOG/
├── .gitignore
├── README.md
├── client-frontend/
│   ├── index.html
│   ├── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── postcss.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── jest.config.js
│   └── src/
│       ├── assets/
│       │   ├── about-img/
│       │   ├── content-footer/
│       │   ├── home-vid/
│       │   ├── home-video/
│       │   ├── icons/
│       │   ├── nav-bar/
│       │   ├── news/
│       │   └── construccion.png
│       ├── components/
│       │   ├── AuthForm.jsx
│       │   ├── ButtonIcon.jsx
│       │   ├── Carousel.jsx
│       │   ├── CommentForm.jsx
│       │   ├── CommentSection.jsx
│       │   ├── ContactForm.jsx
│       │   ├── Footer.jsx
│       │   ├── IconCreate.jsx
│       │   ├── LoginForm.jsx
│       │   ├── Navbar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── RegisterForm.jsx
│       │   ├── Search.jsx
│       │   └── VoicesAssistButton.jsx
│       ├── layout/
│       │   └── Layout.jsx
│       ├── pages/
│       │   ├── AboutUs.jsx
│       │   ├── AdminPage.jsx
│       │   ├── Blog.jsx
│       │   ├── CreatePost.jsx
│       │   ├── EditPost.jsx
│       │   ├── GetInTouch.jsx
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── PostDetail.jsx
│       │   ├── Profile.jsx
│       │   ├── RecoverPassword.jsx
│       │   ├── Register.jsx
│       │   └── UnderConstruction.jsx
│       ├── router/
│       │   └── Router.jsx
│       ├── services/
│       │   ├── commentServices.jsx
│       │   ├── likeServices.jsx
│       │   └── services.jsx
│       ├── store/
│       │   └── store.js
│       └── utils/
│           └── index.js
│   └── public/
│       ├── .vite
│       └── Mocks/
└── server-backend/
    ├── jest.config.js
    ├── package-lock.json
    ├── package.json
    ├── tsconfig.json
    ├── .env
    ├── node_modules/
    └── src/
        ├── controllers/
        │   ├── commentController.ts
        │   ├── likeController.ts
        │   ├── postController.ts
        │   ├── roleController.ts
        │   └── userController.ts
        ├── database/
        │   └── db.ts
        ├── interfaces/
        │   ├── commentInterface.ts
        │   └── postInterface.ts
        ├── middleware/
        │   ├── authMiddleware.ts
        │   └── multer.ts
        ├── models/
        │   ├── commentModel.ts
        │   ├── likeModel.ts
        │   ├── postModel.ts
        │   └── userModel.ts
        ├── routes/
        │   ├── authRoutes.ts
        │   ├── commentRoutes.ts
        │   ├── likesRoutes.ts
        │   ├── postRoutes.ts
        │   ├── roleRoutes.ts
        │   └── userRoutes.ts
        ├── tests/
        │   └── controllerTest.ts
        ├── uploads/
        ├── validations/
        │   └── blogValidation.ts
        ├── app.ts
        └── config.ts
```

        


---



![diagrama-eco](https://github.com/user-attachments/assets/fbcd671d-b8eb-4d14-9b58-d30de21472d3)

## Tecnologías Utilizadas
- **Frontend**: React, JavaScript, Zustand, Tailwind CSS
- **Backend**: TypeScript, Express, JWT, bcrypt, Multer, MySQL
- **Base de Datos**: MySQL
- **Validación**: express-validator
- **Pruebas**: Tests en frontend y backend

## Base de Datos
El proyecto utiliza una base de datos SQL con tres tablas principales:
- `users`: Información de los usuarios (ID, email, contraseña, rol).
- `posts`: Información de las publicaciones (ID, nombre, tipo, descripción, imagen).
- `likes`: Relación entre usuarios y publicaciones para gestionar los "likes".

## Arquitectura

### Backend
1. **app.ts**: Configura el servidor y lanza el servicio, define rutas y middleware globales.
2. **Controllers**: Manejan la lógica del negocio:
   - **userController**: Registro, inicio de sesión y autenticación.
   - **postController**: CRUD de publicaciones.
   - **likeController**: Manejo de likes en las publicaciones.
   - **roleController**: Gestión de roles de usuarios.
3. **Database**: `db.ts` establece la conexión con MySQL usando un pool de conexiones.
4. **Middleware**:
   - **authMiddleware.ts**: Verifica tokens JWT para rutas protegidas.
   - **multer.ts**: Configura Multer para la subida de imágenes.
5. **Models**:
   - **likeModel.ts**: Modelo de likes con métodos para añadir, verificar y eliminar "likes".
   - **postModel.ts** y **userModel.ts**: Interfaces para Posts y Usuarios.
6. **Routes**: Define las rutas del backend:
   - **authRoutes.ts**: Autenticación y perfil de usuario.
   - **likeRoutes.ts**: Rutas para gestionar "likes".
   - **postRoutes.ts**: CRUD de publicaciones.
   - **roleRoutes.ts**: Modificación de roles de usuarios (solo `admin`).
   - **userRoutes.ts**: Registro, login y listado de usuarios.

### Frontend
1. **Componentes Principales**:
   - **Navbar** y **Footer**: Componentes de navegación y diseño persistente.
   - **CreatePost**: Componente de creación y edición de posts.
   - **ButtonIcon**: Botón reutilizable con íconos.
2. **Páginas**:
   - **Home**: Página de inicio del blog.
   - **AboutUs**: Información sobre el blog.
   - **Blog**: Listado de publicaciones.
   - **PostDetail**: Detalle de una publicación específica.
   - **EditPost**: Edición de publicaciones.
   - **GetInTouch**: Formulario de contacto.
   - **Login** y **Register**: Páginas de autenticación.
   - **RecoverPassword**: Recuperación de contraseña.
   - **Profile**: Información de perfil del usuario.
   - **AdminPage**: Gestión de roles y permisos de usuarios (solo `admin`).
3. **Gestión del Estado**:
   - Zustand: Manejo del estado global para autenticación, roles y "likes".
4. **Servicios**:
   - `services.jsx` y `likeServices.jsx`: Interacciones con la API para gestionar publicaciones y "likes".
5. **Rutas**:
   - `Router.jsx`: Configuración de rutas principales y protegidas.
6. **Estilos**:
   - Tailwind CSS: Diseño y estilo responsivo de componentes.

## Instalación y Ejecución

### Requisitos Previos
- Node.js y npm
- MySQL (configurar la base de datos)
- Variables de entorno (.env para configurar el acceso a MySQL y JWT)

### Configuración Inicial

1. **Clonar el Repositorio**:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd bio-blog

## Instalación y Ejecución

### Instalar Dependencias:

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd ../frontend
npm install
````
## Configurar la Base de Datos:
Crear una base de datos MySQL.
Configurar las variables en .env en el backend para la conexión con la base de datos y JWT.
### Ejecutar el Proyecto:
```bash
cd backend
npm run dev

cd frontend
npm start
````
## Rutas del Backend (API)

| Endpoint | Descripción |
|----------|-------------|
| `/auth`  | Registro e inicio de sesión de usuarios. |
| `/posts` | CRUD de publicaciones. |
| `/likes` | Gestión de "likes" en publicaciones. |
| `/roles` | Modificación de roles de usuario (admin). |
| `/users` | Información y gestión de usuarios. |

## Funcionalidades por Rol

### Usuario (user):
- Registro e inicio de sesión.
- Visualizar y dar "like" a publicaciones.
- Acceso a secciones limitadas como "Blog", "Nosotros", y "Contacto".

### Administrador (admin):
- Acceso completo a todas las funciones del usuario.
- Crear, editar y eliminar publicaciones.
- Cambiar roles de usuarios.
- Acceso a "AdminPage" para gestionar usuarios.

## Navegación y Uso de la Aplicación
- Al ingresar, el usuario verá la página de Inicio con un Navbar y opciones de navegación como "Blog", "Nosotros" y "Contacto".
- Para interactuar con el blog, los usuarios deben registrarse o iniciar sesión.
- Los usuarios registrados pueden dar "like" a publicaciones y ver sus nombres en el Navbar.
- Los administradores tienen acceso a la página "AdminPage" donde pueden gestionar publicaciones y roles de usuario.
- 

## Funcionamiento del Formulario de Contacto: ContactForm Component - Bio Blog

Este documento explica los pasos necesarios para configurar e instalar el componente `ContactForm` en el proyecto Bio Blog. Asegúrate de seguir todas las instrucciones para habilitar el envío de correos electrónicos a través del formulario, utilizando EmailJS y el archivo `.env`.

### Requisitos
- Una cuenta en [EmailJS](https://www.emailjs.com/)
- Una cuenta de Gmail (para usar como servicio de correo)
- Node.js y npm instalados en tu sistema

### Pasos para configurar y usar el componente ContactForm

#### 1. Registro en EmailJS
- Regístrate en [EmailJS](https://www.emailjs.com/) y verifica tu cuenta.
- Una vez registrado, accede al panel de EmailJS.

#### 2. Configurar el servicio de correo en EmailJS
- En el panel de EmailJS, haz clic en **Add Service** y selecciona Gmail como proveedor.
- Sigue las instrucciones para autorizar tu cuenta de Gmail y generar un **Service ID**.
- Copia el **Service ID** que aparece, ya que lo necesitarás para la configuración.

#### 3. Crear una plantilla de correo electrónico en EmailJS
- En el panel de EmailJS, dirígete a la sección **Email Templates** y selecciona **Create New Template**.
- Personaliza la plantilla según el formulario de contacto, usando variables como `{{nombre}}`, `{{email}}`, y `{{mensaje}}` para que el contenido del formulario se muestre en el correo.
- Guarda la plantilla y copia el **Template ID**.

#### 4. Obtener tu Public Key de EmailJS
- En el panel de EmailJS, ve a la sección **Account** y luego a **API Keys**.
- Copia tu **Public Key**, que se utilizará para autenticar el envío de correos.

#### 5. Configurar el archivo `.env`
Para mantener segura la información sensible, configura un archivo `.env` en la raíz de tu proyecto y agrega las siguientes variables de entorno:

- Crea un archivo llamado `.env` en la raíz del proyecto Bio Blog.
- Agrega las siguientes variables, reemplazando `your_service_id`, `your_template_id`, y `your_public_key` con los valores obtenidos de EmailJS:

```plaintext
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### Configuración del archivo `.env`

Agrega las siguientes variables al archivo `.env` en la raíz del proyecto:

- `VITE_EMAILJS_SERVICE_ID`: El **Service ID** que copiaste de EmailJS.
- `VITE_EMAILJS_TEMPLATE_ID`: El **Template ID** de tu plantilla en EmailJS.
- `VITE_EMAILJS_PUBLIC_KEY`: Tu **Public Key** de EmailJS.

> **Nota:** El archivo `.env` está incluido en el `.gitignore`, por lo que no se subirá a GitHub. Cada colaborador deberá crear su propio archivo `.env` en su entorno local para que el componente funcione correctamente.

### 6. Instalación de dependencias

Asegúrate de que todas las dependencias del proyecto estén instaladas. Ejecuta el siguiente comando en la raíz del proyecto:

```bash
npm install
````


### 7. Ejecutar el proyecto

Con el archivo `.env` configurado y las dependencias instaladas, puedes ejecutar el proyecto usando el siguiente comando:

```bash
npm run dev
````
---

## ¡Gracias por tu interés! 🙏

Gracias por tomarte el tiempo de explorar **Bio-Blog** 🌱. Si tienes alguna sugerencia, duda o quieres aportar mejoras, ¡no dudes en abrir un *issue* o enviar un *pull request*! 🚀



### Contribuciones 🛠️
¡Las contribuciones son bienvenidas! Si encuentras un bug o tienes una idea para mejorar el proyecto, puedes abrir un *issue* o realizar un *pull request*. Cada pequeña ayuda hace la diferencia. ❤️

---


        
