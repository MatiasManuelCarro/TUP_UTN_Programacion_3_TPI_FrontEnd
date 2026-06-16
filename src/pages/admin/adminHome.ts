import { 
  getStoredOrders, 
  getOrdersPending, 
  getOrdersPreparation, 
  getOrdersDelivered, 
  getStoredUsersSafe 
} from "../../utils/localStorage";
import type { Product } from "../../../src/types/product";
import type { ICategory } from "../../../src/types/category";

document.addEventListener("DOMContentLoaded", () => {
  // Cargar datos desde localStorage
  const categories: ICategory[] = JSON.parse(localStorage.getItem("categories") || "[]");
  const products: Product[] = JSON.parse(localStorage.getItem("products") || "[]");
  const orders = getStoredOrders();

  // Tarjetas de estadísticas
  (document.getElementById("categories") as HTMLElement).textContent = categories.length.toString();
  (document.getElementById("total-productos") as HTMLElement).textContent = products.length.toString();
  (document.getElementById("total-orders") as HTMLElement).textContent = orders.length.toString();
  (document.getElementById("available-products") as HTMLElement).textContent = products.filter(p => p.disponible).length.toString();

  // Resumen detallado
  const activeCategories = document.getElementById("active-categories") as HTMLElement;
  activeCategories.innerHTML = categories.filter(c => !c.eliminado)
    .map(c => `<li>${c.nombre}</li>`).join("");

      const InactiveCategories = document.getElementById("inactive-categories") as HTMLElement;
  InactiveCategories.innerHTML = categories.filter(c => c.eliminado)
    .map(c => `<li>${c.nombre}</li>`).join("");

  (document.getElementById("enable-products") as HTMLElement).textContent = `Activos: ${products.filter(p => p.disponible).length}`;
  (document.getElementById("disabled-products") as HTMLElement).textContent = `Inactivos: ${products.filter(p => !p.disponible).length}`;

  const orderStatus = document.getElementById("order-status") as HTMLElement;
  orderStatus.innerHTML = `
    <li>Pendientes: ${getOrdersPending().length}</li>
    <li>En preparación: ${getOrdersPreparation().length}</li>
    <li>Entregados: ${getOrdersDelivered().length}</li>
  `;
});
