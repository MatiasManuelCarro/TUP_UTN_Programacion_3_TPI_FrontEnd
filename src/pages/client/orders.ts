// import { initProductsAndCategories, initSafeUsers, initOrders, getOrdersPending, getOrdersPreparation, getOrdersDelivered } from "../../../src/utils/localStorage";
// import { getStoredUsersSafe, getStoredOrders } from "../../../src/utils/localStorage";
import { guard } from "../../main";
import type { IOrder } from "../../types/orders";
import { getActiveUser, getStoredOrders, logout } from "../../utils/localStorage";


function getOrdersByActiveUser(): IOrder[] {
    const user = getActiveUser();
    if (!user) return [];

    const allOrders = getStoredOrders();
    return allOrders.filter(order => order.usuarioDto.id === user.id);
}

function getOrderStatusBadge(estado: string): string {
    switch (estado) {
        case "PENDIENTE": return "⏳ Pendiente";
        case "EN_PREPARACION": return "🍳 En preparación";
        case "ENTREGADO": return "✅ Entregado";
        case "CANCELADO": return "❌ Cancelado";
        default: return estado;
    }
}


function getOrderMessage(estado: string): string {
    switch (estado) {
        case "PENDIENTE": return "Tu pedido está pendiente de confirmación.";
        case "EN_PREPARACION": return "Estamos preparando tu pedido.";
        case "ENTREGADO": return "Tu pedido fue entregado. ¡Gracias por tu compra!";
        case "CANCELADO": return "Este pedido fue cancelado.";
        default: return "";
    }
}


function renderOrders(orders: IOrder[]) {
    const container = document.getElementById("orders-container") as HTMLDivElement;
    container.innerHTML = "";

    if (orders.length === 0) {
        container.innerHTML = `
            <p class="empty-orders">No tenés pedidos todavía.</p>
        `;
        return;
    }

    orders.forEach(order => {
        const firstThree = order.detalles.slice(0, 3);
        const remaining = order.detalles.length - 3;

        const resumen = firstThree
            .map(d => `${d.cantidad}× ${d.producto.nombre}`)
            .join(", ");

        const extra = remaining > 0 ? ` +${remaining} más` : "";

        const estadoBadge = getOrderStatusBadge(order.estado);

        const card = document.createElement("div");
        card.classList.add("order-card");
        card.dataset.id = String(order.id);

        card.innerHTML = `
            <div class="order-header">
                <h3>Pedido #${order.id}</h3>
                <span class="order-status ${order.estado.toLowerCase()}">${estadoBadge}</span>
            </div>

            <p class="order-date">${order.fecha}</p>
            <p class="order-summary">${resumen}${extra}</p>
            <p class="order-total">Total: $${order.total}</p>
        `;

        container.appendChild(card);
    });
}


function buildOrderDetail(order: IOrder): string {
    const productos = order.detalles
        .map(d => `
            <li class="modal-product-item">
                <img src="${d.producto.imagen}" class="modal-img">
                <span>${d.cantidad} x ${d.producto.nombre}</span>
                <span>$${d.subtotal}</span>
            </li>
        `)
        .join("");

    const estadoBadge = getOrderStatusBadge(order.estado);

    return `
        <h2>Pedido #${order.id}</h2>
        <p class="modal-status">${estadoBadge}</p>

        <h3>Productos</h3>
        <ul class="modal-products">${productos}</ul>

        <h3>Costos</h3>
        <p>Subtotal:  $${order.total - 600}</p>
        <p>Envío:  $600</p>
        <p class="modal-total">Total: $${order.total}</p>

        <p class="modal-message">${getOrderMessage(order.estado)}</p>
    `;
}


function setupOrderModal(orders: IOrder[]) {
    const container = document.getElementById("orders-container") as HTMLDivElement;
    const modal = document.getElementById("order-modal") as HTMLDivElement;
    const modalContent = document.getElementById("modal-content") as HTMLDivElement;
    const closeBtn = document.getElementById("close-modal") as HTMLButtonElement;

    container.addEventListener("click", (e) => {
        const card = (e.target as HTMLElement).closest(".order-card") as HTMLDivElement;
        if (!card) return;

        const id = Number(card.dataset.id);
        const order = orders.find(o => o.id === id);
        if (!order) return;

        modalContent.innerHTML = buildOrderDetail(order);
        modal.style.display = "flex";
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });
}


const loader = document.getElementById("loader") as HTMLDivElement;

if (guard("USUARIO")) {
    document.addEventListener("DOMContentLoaded", () => {
        loader.classList.add("hidden"); //remueve el loader

        const orders = getOrdersByActiveUser();
    renderOrders(orders);
    setupOrderModal(orders);
    })

    const logoutBtn = document.getElementById("logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            logout();
        });
    }
};
