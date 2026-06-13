# 🍔 Food Store – UTN-TUPaD - Programación 3 - Primer Parcial 

## Alumno: Matias Manuel Carro

Aplicación frontend desarrollada para la materia **Programación III** de la **Tecnicatura Universitaria en Programación – UTN**.

El objetivo del proyecto es evolucionar el catálogo de productos trabajado en los TPs previos, incorporando:

- Carrito de compras con persistencia  
- Búsqueda dinámica  
- Filtrado por categorías  
- Renderizado dinámico con TypeScript  
- Manipulación del DOM  
- Uso de localStorage  

---

## Link al video del proyecto:

https://youtu.be/8NvW8U4Kt4I

---


## ✨ Funcionalidades Principales

### 🛒 1. Carrito con persistencia

- Agregar productos desde el catálogo  
- Incrementar cantidad si el producto ya existe  
- Guardado automático en `localStorage`  
- Vista del carrito con:
  - Nombre  
  - Precio  
  - Cantidad  
  - Subtotal  
  - Total general  
- Botones:
  - ➕ aumentar cantidad  
  - ➖ disminuir cantidad  
  - ❌ eliminar producto  
  - 🧹 limpiar carrito  

---

### 🔍 2. Búsqueda de productos

- Campo de búsqueda visible en el catálogo  
- Coincidencias parciales por nombre  
- Resultados dinámicos mientras se escribe  
- Mensaje si no hay coincidencias  
- Solo muestra productos con stock  

---

### 🍽️ 3. Filtrado por categorías

- Menú lateral con categorías dinámicas  
- Al hacer clic:
  - Se muestran solo los productos de esa categoría  
  - Se actualiza el título  
  - Se limpia la búsqueda  
- Opción “Ver todas las categorías”  

---

### 🧩 4. Renderizado dinámico

- Productos generados desde `data.ts`  
- Categorías generadas desde `getCategories()`  
- Tarjetas creadas con TypeScript  
- Modal de confirmación al agregar al carrito  

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
│   └── store/
│       ├── home/
│       │   ├── home.html    # Catálogo
│       │   └── home.ts      # Lógica: render, búsqueda, filtros
│       │
│       └── cart/
│           ├── cart.html    # Vista del carrito
│           └── cart.ts      # Lógica del carrito
│
├── types/
│   ├── product.ts           # Interface Product
│   └── category.ts          # Interface Categoria
│ 
├── data/
│   └── data.ts              # Productos y categorías
│
└── vite.config.ts           # Registro de páginas
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

Esto generará la carpeta dist/ con los archivos empaquetados.