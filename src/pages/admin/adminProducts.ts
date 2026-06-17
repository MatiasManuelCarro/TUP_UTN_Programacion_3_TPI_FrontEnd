import type { Product } from "../../types/product";
import { getProducts, getCategories } from "../../data/data";
import { getAvailableStock, getStoredProducts, disableProduct, enableProduct, updateProduct } from "../../utils/localStorage";
import { guard } from "../../main";



function renderProductsTable() {
  const tbody = document.getElementById("admin-products-body") as HTMLTableSectionElement;

  const products = getStoredProducts();

  // Render dinámico
  tbody.innerHTML = "";
  products.forEach((product) => {

    const availableStock = getAvailableStock(product);

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
        <td id="product-stock-${product.id}" class="admin-stock">${availableStock}</td>
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

//   } catch (err) {
//     console.error("Error cargando productos:", err);
//   }
// }


const loader = document.getElementById("loader") as HTMLDivElement;

if (guard("ADMIN")) {
document.addEventListener("DOMContentLoaded", () => {
    loader.classList.add("hidden"); //remueve el loader
  renderProductsTable();
})};


