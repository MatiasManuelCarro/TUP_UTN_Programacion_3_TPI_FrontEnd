import { initProductsAndCategories, initSafeUsers, initOrders, getOrdersPending, getOrdersPreparation, getOrdersDelivered } from "../../../src/utils/localStorage";
import { getStoredUsersSafe, getStoredOrders } from "../../../src/utils/localStorage";
import { guard } from "../../main";


const loader = document.getElementById("loader") as HTMLDivElement;

if (guard("USUARIO")) {
    document.addEventListener("DOMContentLoaded", () => {
        loader.classList.add("hidden"); //remueve el loader
    })
};
