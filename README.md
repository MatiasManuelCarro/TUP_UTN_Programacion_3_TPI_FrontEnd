# 🍔 Food Store – TPI Programación III – UTN TUPaD

## Alumno: Matias Manuel Carro

Aplicación frontend desarrollada como Trabajo Práctico Integrador para la materia **Programación III** de la **Tecnicatura Universitaria en Programación – UTN**.

El proyecto implementa un sistema completo de tienda online con:

- Autenticación y roles (Usuario / Administrador)
- Catálogo dinámico de productos
- Carrito de compras con persistencia
- Gestión de pedidos
- Panel de administración (categorías, productos y pedidos)
- Renderizado dinámico con TypeScript
- Uso de localStorage para persistencia
- Carga inicial desde archivos JSON

---

## Link al video del proyecto:

https://youtu.be/0o0vLaEKT-o

---


## ✨ 1. Funcionalidades Principales

## 1.1 Autenticación y Roles
- Login con validación contra:
  - Usuarios del JSON (`usuarios.json`)
  - Usuarios registrados en localStorage
- Registro de nuevos usuarios (solo rol USUARIO)
- Persistencia de sesión mediante `ACTIVE_USER`
- Roles:
  - **ADMIN**: acceso al panel de administración
  - **USUARIO**: acceso al catálogo, carrito y pedidos propios
- Guards en todas las páginas sensibles

---

## 1.2 Catálogo de Productos
- Render dinámico desde localStorage
- Búsqueda por nombre
- Ordenamiento:
  - Nombre A–Z / Z–A
  - Precio ascendente / descendente
- Filtrado por categorías activas
- Ocultamiento automático de productos sin stock o categoría inactiva
- Modal de confirmación al agregar al carrito

---

#### 1.2.1 Búsqueda de productos

- Campo de búsqueda visible en el catálogo  
- Coincidencias parciales por nombre  
- Resultados dinámicos mientras se escribe  
- Mensaje si no hay coincidencias  
- Solo muestra productos con stock  

---

#### 1.2.2 Filtrado por categorías

- Menú lateral con categorías dinámicas  
- Al hacer clic:
  - Se muestran solo los productos de esa categoría  
  - Se actualiza el título  
  - Se limpia la búsqueda  
- Opción “Ver todas las categorías”  

---

#### 1.2.3 Renderizado dinámico

- Productos generados desde `data.ts`  
- Categorías generadas desde `getCategories()`  
- Tarjetas creadas con TypeScript  
- Modal de confirmación al agregar al carrito  

---


## 🔍 1.3 Detalle de Producto
- Carga del producto mediante `sessionStorage`
- Control de stock dinámico
- Botones + y – con límites
- Botón de compra deshabilitado si:
  - No hay stock
  - El producto no está disponible
  - El usuario es ADMIN
- Modal de confirmación al agregar al carrito

---

## 🛒 1.4 Carrito con persistencia

- Agregar productos desde el catálogo  
- Incrementar cantidad si el producto ya existe  
- Guardado automático en `localStorage`
- Persistencia por usuario  
- Vista del carrito con:
  - Nombre  
  - Precio  
  - Cantidad  
  - Subtotal  
  - Total general  
- Operaciones:
  - ➕ aumentar cantidad  
  - ➖ disminuir cantidad  
  - ❌ eliminar producto  
  - 🧹 limpiar carrito  
- Cálculo automático de:
  - Subtotal
  - Envío
  - Total
- Validación de stock y categorías activas
- Checkout:
  - Teléfono
  - Forma de pago
- Generación de pedido en localStorage

---

## 📚 1.5 Pedidos del Cliente
- Listado de pedidos del usuario activo
- Ordenados por fecha
- Resumen de productos
- Modal con detalle completo:
  - Productos
  - Subtotal
  - Envío
  - Total
  - Estado del pedido
- Mensaje contextual según estado (pendiente, preparación, entregado, cancelado)

---

## 📊 1.6 Panel de Administración

#### 1.6.1 Categorías
- Listado completo
- Activar / desactivar
- Edición de nombre y descripción
- Sincronización automática con productos

### 1.6.2 Productos
- Listado completo
- Activar / desactivar
- Edición de:
  - Nombre
  - Precio
  - Descripción
  - Stock
- Alta de nuevos productos
- Sincronización con categorías

### 1.6.3 Pedidos
- Listado completo
- Filtro por estado
- Cambio de estado persistente
- Modal con detalle del pedido

---


## 🛠️ Tecnologías utilizadas

- **HTML5**  
- **CSS3**  
- **JavaScript**  
- **TypeScript**  
- **Vite**  


---

## 📁 Estructura del Proyecto

```bash
src/
│
├── pages/
│   ├── auth/                    #Login y Registro
│   │   ├── login.html / login.ts
│   │   └── register.html / register.ts
│   │
│   ├── store/
│   │   ├── home/               # Catálogo
│   │   ├── cart/                #Carrito de compras
│   │   └── productDetail/
│   │
│   ├── client/
│   │   └── orders/             #Ordenes del cliente
│   │
│   └── admin/                  #Paginas de administracion
│       ├── adminHome/          #Home del admin
│       ├── adminCategories/    #Administracion de Categorias
│       ├── adminProducts/      #Administracion de Producto
│       └── adminOrders/        #Administracion de ordenes
│
├── utils/                      #Helpers y Utilidades
│   ├── auth.ts   
│   ├── cartUtils.ts
│   ├── productUtils.ts
│   ├── categoriesUtils.ts
│   ├── ordersUtils.ts
│   ├── fetch.ts
│   └── localStorage.ts
│
└── types/                      #Interfaces
    ├── users.ts
    ├── product.ts
    ├── category.ts
    └── orders.ts

public
└── data/                 # Productos, categorías, usuarios y pedidos
    ├── productos.json
    ├── categorias.json
    ├── usuarios.json
    └── pedidos.json
```



---

## 🚀 Instalación y Uso

Se recomienda usar `pnpm` como gestor de paquetes para mayor eficiencia en el manejo de dependencias.

### 1. Instalar pnpm

Si no tienes `pnpm` instalado, puedes hacerlo fácilmente a través de `npm` (que viene con Node.js) ejecutando el siguiente comando en tu terminal:

```bash
npm install -g pnpm
```

### 2. Instalar Dependencias del Proyecto

Una vez en la carpeta raíz del proyecto, instala las dependencias necesarias con `pnpm`:

```bash
pnpm install
```

### 3. Ejecutar el Proyecto

Para iniciar el servidor de desarrollo de Vite, ejecuta:

```bash
pnpm dev
```

La aplicación estará disponible en la URL que aparezca en la terminal (generalmente `http://localhost:5173`).

---

### 4. Build (Demostración de Compilación)

Se incluye para demostrar que el proyecto es capaz de compilar correctamente y generar el paquete de dist listo para producción.

```bash
pnpm build
```

#### Resultado:
```bash
vite v7.3.1 building client environment for production...
✓ 18 modules transformed.
dist/index.html                           0.36 kB │ gzip: 0.25 kB
dist/src/pages/store/cart/cart.html       3.66 kB │ gzip: 1.30 kB
dist/src/pages/store/home/home.html       3.97 kB │ gzip: 1.34 kB
dist/assets/storeCart-BmgjAO86.css        4.45 kB │ gzip: 1.13 kB
dist/assets/storeHome-Clw7NUwi.css        4.75 kB │ gzip: 1.30 kB
dist/assets/categoriesUtils-trSb2Aqv.css  7.03 kB │ gzip: 1.75 kB
dist/assets/categoriesUtils-R8yU8TrM.js   2.57 kB │ gzip: 1.15 kB
dist/assets/storeCart-CAqdMxL5.js         4.55 kB │ gzip: 1.78 kB
dist/assets/storeHome-904_-R_U.js         5.02 kB │ gzip: 1.89 kB
✓ built in 314ms
```

Esto genera la carpeta dist/ con los archivos empaquetados.


---

### 5. Inicialización de Datos

Al cargar la aplicación por primera vez:

- Se ejecuta `initBaseData()`
- Se cargan productos, categorías, usuarios y pedidos desde JSON
- Se guardan en localStorage
- Los usuarios del JSON se guardan sin contraseña

---

### 6. Flujo de Autenticación

1. Usuario ingresa email y contraseña  
2. Se busca primero en `authUsers` (usuarios registrados)  
3. Si no existe, se busca en `usuarios.json`  
4. Si coincide:
   - Se guarda `ACTIVE_USER`
   - Se redirige según rol  
5. Si falla:
   - Mensaje de error

---

# 7. Autor

**Matías Manuel Carro**  
Email: *matiasmanuelcarro@gmail.com*  
Año 2026 – UTN TUPaD