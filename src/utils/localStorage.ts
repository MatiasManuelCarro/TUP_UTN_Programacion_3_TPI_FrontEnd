import type { IOrder } from "../types/orders";
import { initSafeUsers } from "./auth";
import { getOrders } from "./fetch";
import { initProductsAndCategories } from "./productUtils";

export async function initBaseData() {
    const productsStored = localStorage.getItem("products");
    const categoriesStored = localStorage.getItem("categories");
    const usersStored = localStorage.getItem("users");
    const ordersStored = localStorage.getItem("orders");

    if (!productsStored || !categoriesStored) {
        // Solo se ejecuta si no hay datos guardados
        await initProductsAndCategories();
    }

    // Usuarios (sin password)
    if (!usersStored) {
        await initSafeUsers();
    }

    // Pedidos
    if (!ordersStored) {
        await initOrders();
    }
}

// Inicializa pedidos en localStorage
export async function initOrders() {
    try {
        const orders: IOrder[] = await getOrders();
        localStorage.setItem("orders", JSON.stringify(orders));
    } catch (err) {
        console.error("Error cargando pedidos:", err);
    }
}

