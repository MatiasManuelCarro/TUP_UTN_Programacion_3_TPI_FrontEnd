import { guard } from "../../main";
import type { ICategory } from "../../types/category";
import type { Product } from "../../types/product";
import { getStoredProducts, getAvailableStock, disableProduct, enableProduct, updateProduct, addProduct, getStoredCategories, getProductNextId } from "../../utils/productUtils";



function renderProductsTable() {
  const tbody = document.getElementById("admin-products-body") as HTMLTableSectionElement;

  const products = getStoredProducts();

  // Render 
  tbody.innerHTML = "";
  products.forEach((product) => {

  const availableStock = getAvailableStock(product);
  const productStock = availableStock === 0 ? "Sin Stock" : String(availableStock);
  const stockClass = availableStock === 0 ? "admin-stock no-stock" : "admin-stock";
  



    const tr = document.createElement("tr");
    tr.innerHTML = tr.innerHTML = `
        <td id="product-id-${product.id}" class="admin-id">${product.id}</td>
        <td id="product-img-${product.id}" class="admin-img">
        <img src="${product.imagen}" alt="${product.nombre}" width="50" height="50"/>
        </td>
        <td id="product-nombre-${product.id}" class="admin-nombre">${product.nombre}</td>
        <td id="product-descripcion-${product.id}" class="admin-descripcion">${product.descripcion}</td>
        <td id="product-precio-${product.id}" class="admin-precio">$${product.precio}</td>
        <td id="product-categoria-${product.id}" class="admin-categoria">${product.categorias.map(c => c.nombre).join(", ")}</td>
        <td id="product-stock-${product.id}" class="${stockClass}">${productStock}</td>
        <td id="product-estado-${product.id}" class="estado ${product.disponible ? "disponible" : "no-disponible"}">
        ${product.disponible ? "Disponible" : "No disponible"}
        </td>`;


    const accionesTd = document.createElement("td");
    accionesTd.classList.add("admin-acciones");

    // Crear link Editar
    const editLink = document.createElement("a");
    editLink.href = "#";
    editLink.dataset.id = String(product.id);
    editLink.classList.add("edit-link");
    editLink.textContent = "Editar";

    // Crear link Eliminar / activar

    const deleteLink = document.createElement("a");
    deleteLink.href = "#";
    deleteLink.dataset.id = String(product.id);
    deleteLink.classList.add("delete-link");
    deleteLink.textContent = product.disponible ? "Eliminar" : "Activar"


    // Evento eliminar → marcar como eliminado en localStorage
    deleteLink.addEventListener("click", (e) => {
      e.preventDefault();
      const id = Number(deleteLink.dataset.id);

      const products = getStoredProducts();
      const currentProduct = products.find(p => p.id === id);

      if (!currentProduct) return;

      //if para activar o desactivar
      currentProduct.disponible ? (disableProduct(id)) : (enableProduct(id));
      renderProductsTable(); // refresca la tabla
    });

    // Añadir a la celda
    accionesTd.appendChild(editLink);
    accionesTd.appendChild(document.createTextNode(" | "));
    accionesTd.appendChild(deleteLink);

    tr.appendChild(accionesTd);

    tbody.appendChild(tr);

    // const deleteLink = tr.querySelectorAll<HTMLAnchorElement>(".delete-link");

    //FORMULARIO DE EDICION DE OBJETO
    editLink.addEventListener("click", (e) => {
      e.preventDefault();
      const id = Number(editLink.dataset.id);

      const section = document.getElementById("edit-product-section");
      if (!section) return;

      section.innerHTML = `
  <form id="edit-form">
    <p class=product-modify>Modificando ${product.nombre}</p>
    <input type="text" id="edit-nombre" placeholder="Nuevo nombre" />
    <input type="number" id="edit-precio" placeholder="Nuevo precio" min="0" />
    <input type="text" id="edit-descripcion" placeholder="Nueva descripción" />
    <input type="number" id="edit-stock" placeholder="Nuevo stock" min="0" />
    <button type="submit">Guardar cambios</button>
  </form>
`;

      const form = document.getElementById("edit-form") as HTMLFormElement;
      form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        const nombreInput = (document.getElementById("edit-nombre") as HTMLInputElement).value;
        const precioInput = (document.getElementById("edit-precio") as HTMLInputElement).value;
        const descripcionInput = (document.getElementById("edit-descripcion") as HTMLInputElement).value;
        const stockInput = (document.getElementById("edit-stock") as HTMLInputElement).value;

        // Se verifica que sea un numero lo ingresado por el usuario
        // el form se encarga de esto, es una redundancia por seguridad
        let precio: number | undefined;
        if (precioInput.trim() !== "") {
          precio = Number(precioInput);
        }

        let stock: number | undefined;
        if (stockInput.trim() !== "") {
          stock = Number(stockInput);
        }

        if ((precio !== undefined && precio < 0) || (stock !== undefined && stock < 0)) {
          alert("Precio y stock no pueden ser negativos.");
          //el form se encarga de esto, pero es una redundancia para cubrir en caso de problemas
          return;
        }

        //objeto con campos parciales (solo los completados, si no mantiene los anteriores)
        const updatedFields: Partial<Product> = {};

        if (nombreInput) updatedFields.nombre = nombreInput;
        if (precio !== undefined) updatedFields.precio = precio;
        if (descripcionInput) updatedFields.descripcion = descripcionInput;
        if (stock !== undefined) updatedFields.stock = stock;

        updateProduct(id, updatedFields);

        renderProductsTable();
        section.innerHTML = "";
      });
    });

  });
}


//Agregar un producto 

function addProductForm() {
  const section = document.getElementById("edit-product-section");
  if (!section) return;

  const categorias = getStoredCategories();

  // construir opciones del select
  const options = categorias.map(c => 
    `<option value="${c.id}">${c.nombre}</option>`
  ).join("");

  section.innerHTML = `
    <form id="add-form">
      <p class="product-modify">Nuevo producto</p>
      <input type="text" id="add-nombre" placeholder="Nombre" required />
      <input type="number" id="add-precio" placeholder="Precio" min="0" required />
      <input type="text" id="add-descripcion" placeholder="Descripción" required />
      <input type="number" id="add-stock" placeholder="Stock" min="0" required />
      <input type="text" id="add-imagen" placeholder="URL de imagen" required />
      <select id="add-categoria" required>
        <option value="">Seleccione categoría</option>
        ${options}
      </select>
      <button type="submit">Guardar producto</button>
    </form>
  `;

  const form = document.getElementById("add-form") as HTMLFormElement;
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();

    const nombre = (document.getElementById("add-nombre") as HTMLInputElement).value.trim();
    const precio = Number((document.getElementById("add-precio") as HTMLInputElement).value);
    const descripcion = (document.getElementById("add-descripcion") as HTMLInputElement).value.trim();
    const stock = Number((document.getElementById("add-stock") as HTMLInputElement).value);
    const imagen = (document.getElementById("add-imagen") as HTMLInputElement).value.trim();
    const categoriaId = Number((document.getElementById("add-categoria") as HTMLSelectElement).value);

    if (!nombre || !descripcion || !imagen || precio < 0 || stock < 0 || !categoriaId) {
      alert("Todos los campos son obligatorios y deben ser válidos.");
      return;
    }

    // buscar la categoría seleccionada
    const categoriaSeleccionada = categorias.find(c => c.id === categoriaId);
    if (!categoriaSeleccionada) {
      alert("Categoría inválida.");
      return;
    }

    const nuevoProducto: Product = {
      id: getProductNextId(),
      eliminado: false,
      createdAt: new Date().toISOString(),
      nombre,
      precio,
      descripcion,
      stock,
      imagen,
      disponible: true,
      categorias: [categoriaSeleccionada] // 👈 se guarda la categoría elegida
    };

    addProduct(nuevoProducto);
    renderProductsTable();
    section.innerHTML = ""; // limpiar el formulario
  });
}

const addBtn = document.getElementById("add-product-btn") as HTMLButtonElement;
addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addProductForm();
});


const loader = document.getElementById("loader") as HTMLDivElement;

if (guard("ADMIN")) {
document.addEventListener("DOMContentLoaded", () => {
    loader.classList.add("hidden"); //remueve el loader
  renderProductsTable();
})};


