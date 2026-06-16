import { disableCategory, enableCategory, getStoredCategories, updateCategory } from "../../utils/localStorage";
import type { ICategory } from "../../types/category";

function renderCategoriesTable() {
    const tbody = document.getElementById("admin-categories-body") as HTMLTableSectionElement;
    const categories = getStoredCategories();

    tbody.innerHTML = "";
    categories.forEach((category) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td class="admin-id">${category.id}</td>
        <td class="admin-nombre">${category.nombre}</td>
        <td class="admin-descripcion">${category.descripcion}</td>
        <td class="estado ${category.eliminado ? "no-disponible" : "disponible"}">
          ${category.eliminado ? "Eliminada" : "Activa"}
        </td>
    `;

        const accionesTd = document.createElement("td");
        accionesTd.classList.add("admin-acciones");

        // Link Editar
        const editLink = document.createElement("a");
        editLink.href = "#";
        editLink.dataset.id = String(category.id);
        editLink.classList.add("edit-link");
        editLink.textContent = "Editar";

        // Link Eliminar / Activar
        const deleteLink = document.createElement("a");
        deleteLink.href = "#";
        deleteLink.dataset.id = String(category.id);
        deleteLink.classList.add("delete-link");
        // coherente con la lógica: si está activa (eliminado=false) → botón "Eliminar"
        deleteLink.textContent = category.eliminado ? "Activar" : "Eliminar";

        deleteLink.addEventListener("click", (e) => {
            e.preventDefault();
            const id = Number(deleteLink.dataset.id);
            const currentCategory = categories.find(c => c.id === id);
            if (!currentCategory) return;


        currentCategory.eliminado ? enableCategory(id) : disableCategory(id);

            renderCategoriesTable();
        });

        accionesTd.appendChild(editLink);
        accionesTd.appendChild(document.createTextNode(" | "));
        accionesTd.appendChild(deleteLink);

        tr.appendChild(accionesTd);
        tbody.appendChild(tr);

        // Formulario de edición
        editLink.addEventListener("click", (e) => {
            e.preventDefault();
            const id = Number(editLink.dataset.id);

            const section = document.getElementById("edit-category-section");
            if (!section) return;

            section.innerHTML = `
        <form id="edit-category-form">
          <p class="category-modify">Modificando ${category.nombre}</p>
          <input type="text" id="edit-nombre" placeholder="Nuevo nombre" />
          <input type="text" id="edit-descripcion" placeholder="Nueva descripción" />
          <button type="submit">Guardar cambios</button>
        </form>
        `;

            const form = document.getElementById("edit-category-form") as HTMLFormElement;
            form.addEventListener("submit", (ev) => {
                ev.preventDefault();
                const nombreInput = (document.getElementById("edit-nombre") as HTMLInputElement).value.trim();
                const descripcionInput = (document.getElementById("edit-descripcion") as HTMLInputElement).value.trim();

                const updatedFields: Partial<ICategory> = {};
                if (nombreInput) updatedFields.nombre = nombreInput;
                if (descripcionInput) updatedFields.descripcion = descripcionInput;

                updateCategory(id, updatedFields);
                renderCategoriesTable();
                section.innerHTML = "";
            });
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderCategoriesTable();
});
