import { initProductsAndCategories, initSafeUsers, initOrders, getOrdersPending, getOrdersPreparation, getOrdersDelivered } from "../../../src/utils/localStorage";
import { getStoredUsersSafe, getStoredOrders } from "../../../src/utils/localStorage";

  // Una vez inicializado, ya podés usar los getters
  console.log("Usuarios:", getStoredUsersSafe());
  console.log("Todas:", getStoredOrders());
  console.log("Pendientes:", getOrdersPending());
  console.log("En preparación:", getOrdersPreparation());
  console.log("Entregadas:", getOrdersDelivered());


