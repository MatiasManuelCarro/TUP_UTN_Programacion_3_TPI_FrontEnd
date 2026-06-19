import type { IOrder } from "../types/orders";

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