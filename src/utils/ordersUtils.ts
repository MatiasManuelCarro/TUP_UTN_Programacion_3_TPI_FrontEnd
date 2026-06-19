import type { IOrder } from "../types/orders";


// FUNCIONES PARA PEDIDOS
export function getStoredOrders(): IOrder[] {
    const data = localStorage.getItem("orders");
    return data ? (JSON.parse(data) as IOrder[]) : [];
}

//pendientes
export function getOrdersPending(): IOrder[] {
    return getStoredOrders().filter((order) => order.estado === "PENDIENTE");
}

//en preparación
export function getOrdersPreparation(): IOrder[] {
    return getStoredOrders().filter((order) => order.estado === "EN_PREPARACION");
}

//entregadas
export function getOrdersDelivered(): IOrder[] {
    return getStoredOrders().filter((order) => order.estado === "ENTREGADO");
}

//canceladas
export function getOrdersCancelled(): IOrder[] {
    return getStoredOrders().filter((order) => order.estado === "CANCELADO");
}

export function addOrder(newOrder: IOrder) {
    const orders = getStoredOrders();
    const updatedOrders = [...orders, newOrder];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
}


export function ordersCounter(): number {
    const orders: IOrder[] = getStoredOrders(); // lee de localStorage las ordenes guardadas, ya se realizo el fetch
    if (orders.length === 0) return 1; // primer pedido
    return Math.max(...orders.map(o => o.id)) + 1;
}
