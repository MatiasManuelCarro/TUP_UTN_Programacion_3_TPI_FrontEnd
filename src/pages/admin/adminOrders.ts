import { guard } from "../../main";
import type { IOrder } from "../../types/orders";
import { getStoredOrders, getOrdersPending, getOrdersPreparation, getOrdersDelivered, getOrdersCancelled } from "../../utils/ordersUtils";

// Loader que oculta informacion hasta que pase el guard
const loader = document.getElementById("loader") as HTMLDivElement;

// function renderOrders(orders: IOrder[]) {
//     const container = document.getElementById("orders-container");
//     if (!container) return;

//     container.innerHTML = "";

//     const sorted = [...orders].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

//     sorted.forEach(order => {
//         const card = document.createElement("div");

//         let orderStatus = "";

//         switch (order.estado) {
//             case "PENDIENTE":
//                 orderStatus = "PENDIENTE";
//                 break;
//             case "EN_PREPARACION":
//                 orderStatus = "EN PREPARACION";
//                 break;
//             case "ENTREGADO":
//                 orderStatus = "ENTREGADO";
//                 break;
//             default:
//                 orderStatus = "";
//         }

//         card.className = "order-card";

//         card.innerHTML = `
//         <h4 class="order-header">
//             Pedido #${order.id} 
//             <span class="badge ${order.estado.toLowerCase()}">${orderStatus}</span>
//         </h4>
//         <p><strong>Cliente:</strong> ${order.usuarioDto.nombre} ${order.usuarioDto.apellido}</p>
//         <p><strong>Fecha:</strong> ${order.fecha}</p>
//         <div class="order-footer">
//             <span>Productos: ${order.detalles.reduce((acc, d) => acc + d.cantidad, 0)}</span>
//             <span class="order-total">Total: $${order.total}</span>
//         </div>
//         `;

//         container.appendChild(card);
//     });
// }

function renderOrders(orders: IOrder[]) {
  const container = document.getElementById("orders-container");
  if (!container) return;

  container.innerHTML = "";

  // Ordenar por fecha descendente
  const sorted = [...orders].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  sorted.forEach(order => {
    const card = document.createElement("div");
    card.className = "order-card";

    card.innerHTML = `
      <h4 class="order-header">
        Pedido #${order.id}
        <span class="badge ${order.estado.toLowerCase()}">${order.estado.replace("_", " ")}</span>
      </h4>
      <p><strong>Cliente:</strong> ${order.usuarioDto.nombre} ${order.usuarioDto.apellido}</p>
      <p><strong>Fecha:</strong> ${order.fecha}</p>
      <div class="order-footer">
        <span>Productos: ${order.detalles.reduce((acc, d) => acc + d.cantidad, 0)}</span>
        <span class="order-total">Total: $${order.total}</span>
      </div>
      <div class="order-actions">
        <label for="estado-${order.id}">Estado:</label>
        <select id="estado-${order.id}" class="order-select">
          <option value="PENDIENTE" ${order.estado === "PENDIENTE" ? "selected" : ""}>Pendiente</option>
          <option value="EN_PREPARACION" ${order.estado === "EN_PREPARACION" ? "selected" : ""}>En preparación</option>
          <option value="ENTREGADO" ${order.estado === "ENTREGADO" ? "selected" : ""}>Entregado</option>
          <option value="CANCELADO" ${order.estado === "CANCELADO" ? "selected" : ""}>Cancelado</option>
        </select>
        <button class="btn-order-details" data-id="${order.id}">Ver detalles</button>
      </div>
    `;

    // evento para actualizar estado en memoria
    const select = card.querySelector(`#estado-${order.id}`) as HTMLSelectElement;
    select.addEventListener("change", () => {
      order.estado = select.value as IOrder["estado"];

      // Actualizar en localStorage
      const allOrders = getStoredOrders();
      const idx = allOrders.findIndex(o => o.id === order.id);
      if (idx !== -1) {
        allOrders[idx].estado = order.estado;
        localStorage.setItem("orders", JSON.stringify(allOrders));
      }

      renderOrders(getStoredOrders()); // refresca vista con datos actualizados
    });

    const detailsBtn = card.querySelector(".btn-order-details") as HTMLButtonElement;
    detailsBtn.addEventListener("click", () => {
      const modal = document.getElementById("order-modal") as HTMLDivElement;
      const modalContent = document.getElementById("modal-content") as HTMLDivElement;

      // Inyectar detalles del pedido
      modalContent.innerHTML = `
    <h3>Pedido #${order.id}</h3>
    <p><strong>Cliente:</strong> ${order.usuarioDto.nombre} ${order.usuarioDto.apellido}</p>
    <p><strong>Fecha:</strong> ${order.fecha}</p>
    <ul class="modal-products">
      ${order.detalles.map(d => `
        <li class="modal-product-item">
          <span>${d.cantidad}× ${d.producto.nombre}</span>
          <span>$${d.subtotal}</span>
        </li>
      `).join("")}
    </ul>
    <p class="modal-total">Total: $${order.total}</p>
  `;

      // Mostrar modal
      modal.classList.add("open");
    });


    container.appendChild(card);
  });
}








if (guard("ADMIN")) {
  document.addEventListener("DOMContentLoaded", () => {
    loader.classList.add("hidden"); //remueve el loader

    const filterSelect = document.getElementById("order-filter") as HTMLSelectElement;

    // Render inicial (todos)
    renderOrders(getStoredOrders());

    // Cambio de filtro
    filterSelect.addEventListener("change", () => {
      switch (filterSelect.value) {
        case "PENDIENTE":
          renderOrders(getOrdersPending());
          break;
        case "EN_PREPARACION":
          renderOrders(getOrdersPreparation());
          break;
        case "ENTREGADO":
          renderOrders(getOrdersDelivered());
          break;
        case "CANCELADO":
          renderOrders(getOrdersCancelled());
          break;
        default:
          renderOrders(getStoredOrders());
      }
    });

    const modal = document.getElementById("order-modal") as HTMLDivElement;
    const closeBtn = document.getElementById("close-modal") as HTMLButtonElement;

    closeBtn.addEventListener("click", () => {
      modal.classList.remove("open");
    });

    // opcional: cerrar al hacer click fuera
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("open");
      }
    });

  })
};