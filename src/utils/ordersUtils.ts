import type { IOrder } from "../types/orders";
import { getOrders } from "./fetch";

// FUNCIONES PARA PEDIDOS
export function getStoredOrders(): IOrder[] {
    const data = localStorage.getItem("orders");
    return data ? (JSON.parse(data) as IOrder[]) : [];
}

// Órdenes pendientes
export function getOrdersPending(): IOrder[] {
    return getStoredOrders().filter((order) => order.estado === "PENDIENTE");
}

// Órdenes en preparación
export function getOrdersPreparation(): IOrder[] {
    return getStoredOrders().filter((order) => order.estado === "EN_PREPARACION");
}

// Órdenes entregadas
export function getOrdersDelivered(): IOrder[] {
    return getStoredOrders().filter((order) => order.estado === "ENTREGADO");
}

export function addOrder(newOrder: IOrder) {
    const orders = getStoredOrders();
    const updatedOrders = [...orders, newOrder];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
}

// export async function ordersCounter(): Promise<number> {
//   const orders: IOrder[] = await getOrders(); // lee pedidos.json
//   if (orders.length === 0) return 1; // primer pedido
//     return Math.max(...orders.map(o => o.id)) + 1;
// }

export function ordersCounter(): number {
    const orders: IOrder[] = getStoredOrders(); // ✅ lee localStorage
    if (orders.length === 0) return 1; // primer pedido
    return Math.max(...orders.map(o => o.id)) + 1;
}
