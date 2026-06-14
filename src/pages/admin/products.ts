import type { Product } from "../../types/product";
import { getProducts, getCategories } from "../../data/data";
import { getAvailableStock, getStoredProducts, disableProduct, enableProduct } from "../../utils/localStorage";



function renderProductsTable() {
  const tbody = document.getElementById("admin-products-body") as HTMLTableSectionElement;
  // const products = getStoredProducts().filter(p => !p.eliminado); // opcional: ocultar eliminados

  const products = getStoredProducts();

  // Render dinámico
  tbody.innerHTML = "";
  products.forEach((product) => {
    // const estado = product.disponible ? "Disponible" : "No disponible";

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

    // <td id="product-acciones-${product.id}" class="admin-acciones">
    //   <a href="#" id="edit-${product.id}" data-id="${product.id}" class="edit-link">Editar</a> |
    //   <a href="#" id="delete-${product.id}" data-id="${product.id}" class="delete-link">Eliminar</a>
    // </td>
    // Crear celda de acciones
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

  });
}

//   } catch (err) {
//     console.error("Error cargando productos:", err);
//   }
// }

document.addEventListener("DOMContentLoaded", () => {
  renderProductsTable();
});


