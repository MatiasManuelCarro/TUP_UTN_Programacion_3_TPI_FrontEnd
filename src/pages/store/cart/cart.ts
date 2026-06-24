import type { Product } from "../../../types/product";
import type { CartItem } from "../../../types/cartItem";
import {
    getCart,
    clearCart,
    minusOneCart,
    addToCart,
    deleteProduct,
    getCartCount,
} from "../../../utils/cartUtils";
import {
    getStoredProducts,
    getStoredCategories,
    reduceProductStock,
} from "../../../utils/productUtils";
import { guard } from "../../../main";
import { getActiveUser, logout } from "../../../utils/auth";
import { getDeliveryCost } from "../../../utils/config";
import type { IOrder } from "../../../types/orders";
import { addOrder, ordersCounter } from "../../../utils/ordersUtils";


export const loadCart = () => {
    const cartContainer = document.getElementById(
        "cart-container",
    ) as HTMLDivElement;
    const cartEmptyMessage = document.getElementById(
        "cart-message",
    ) as HTMLElement;
    cartContainer.innerHTML = "";

    const cart = getCart();
    const products = getStoredProducts(); // productos actualizados

    const loadCategories = getStoredCategories(); //carga categorias
    const enabledCategories = loadCategories.filter(c => !c.eliminado);


    let total = 0;
    for (const item of cart) {

        const currentProduct = products.find(p => p.id === item.product.id); //busca el item actualizado
        if (!currentProduct || !currentProduct.disponible) {  //verifica si no esta disponible, si no lo esta lo borra
            deleteProduct(item.product)
            continue;
        }

        //elimina los productos de la categoria inactiva

        const categoryEnabled = currentProduct.categorias.some(pc =>
            enabledCategories.some(ca => ca.id === pc.id)
        );
        if (!categoryEnabled) {
            deleteProduct(item.product);
            continue;
        }

        //muestra los productos activos con categoria activa 
        const productCard = renderCartItem(item);
        cartContainer.appendChild(productCard);
        cartListeners(productCard, item.product, item.quantity);
        total += item.product.precio * item.quantity;

    }
    renderCartMessage(cart, cartEmptyMessage);
    updateCartSummaryVisibility()
    updateCartSummary(total);
    updateBuyButtonState();
};

function renderCartMessage(cart: CartItem[], cartEmptyMessage: HTMLElement) {
    if (cart.length === 0) {
        cartEmptyMessage.innerHTML = "No hay ningún producto en el carrito.";
    } else {
        cartEmptyMessage.innerHTML = `
    <span class="cart-message-box">Total de productos en el carrito:
    <span class="cart-count">${getCartCount()}</span></span>
    `;
    }
    cartEmptyMessage.style.display = "block";
}

function renderCartItem(item: CartItem): HTMLElement {
    const { product, quantity } = item;
    const subTotal = product.precio * quantity;

    const productCard = document.createElement("article");
    productCard.classList.add("cart-products");
    productCard.innerHTML = `
    <div class="cart-img">
    <img src="${product.imagen}" alt="Imagen de ${product.nombre}" />
    </div>
    <h3 class="cart-name">${product.nombre}</h3>
    <p class="cart-description">${product.descripcion}</p>
    <p class="cart-price">Precio: $${product.precio}</p>
    <p class="cart-amount">
    <a href="#" class="link-amount minus" data-id="${product.id}">-</a>
    Cantidad: ${quantity}
    <a href="#" class="link-amount plus" data-id="${product.id}">+</a>
    </p>
    <p class="cart-subtotal">Subtotal: $${subTotal}</p>
    <div class="buttons">
    <button class="btn-cart delete" data-id="${product.id}">Eliminar</button>
    </div>`;
    return productCard;
}


function updateCartSummary(subtotal: number) {
    const summary = document.querySelector(".cart-summary h3");
    if (summary) {
        let total = 0;
        const envio = getDeliveryCost();
        if (subtotal === 0) {
            total = 0;
            summary.innerHTML = `
            <p><strong>Total: $${total}</strong></p>
        `;
        } else {
            total = subtotal + envio;
            summary.innerHTML = `
            <p>Subtotal: $${subtotal}</p>
            <p>Envío: $${envio}</p>
            <p><strong>Total: $${total}</strong></p>
        `;
        }
    }
}


function cartListeners(
    productCard: HTMLElement,
    product: Product,
    amount: number,
) {
    const minusLink = productCard.querySelector(
        ".link-amount.minus",
    ) as HTMLAnchorElement;
    const plusLink = productCard.querySelector(
        ".link-amount.plus",
    ) as HTMLAnchorElement;
    const deleteBtn = productCard.querySelector(
        ".btn-cart.delete",
    ) as HTMLButtonElement;

    // Bloqueo visual de botones
    if (amount >= product.stock) {
        plusLink.style.color = "var(--color-borde)";
        plusLink.style.cursor = "default";
    } else if (amount === 1) {
        minusLink.style.color = "var(--color-borde)";
        minusLink.style.cursor = "default";
    }

    // Listeners
    minusLink.addEventListener("click", (e) => {
        e.preventDefault();
        if (amount > 1) {
            //desactiva la funcion del boton si es 1
            minusOneCart(product);
            loadCart();
        }
    });

    plusLink.addEventListener("click", (e) => {
        e.preventDefault();
        if (amount < product.stock) {
            //desactiva la funcion del boton si ya alcanzo el limite de stock
            addToCart(product, 1);
            loadCart();
        }
    });

    deleteBtn.addEventListener("click", () => {
        deleteProduct(product);
        loadCart();

        //actualiza el mensaje
        const cart = getCart();
        const cartEmptyMessage = document.getElementById("cart-message") as HTMLElement;
        renderCartMessage(cart, cartEmptyMessage);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadCart();
});

document.getElementById("clear-cart")?.addEventListener("click", () => {
    clearCart();
    loadCart();

    //actualiza el mensaje
    const cartEmptyMessage = document.getElementById("cart-message") as HTMLElement;
    renderCartMessage([], cartEmptyMessage);
});

//boton de comprar
const buyButton = document.getElementById("buy-button") as HTMLButtonElement;

//estado del bton de compra
function updateBuyButtonState() {
    const cart = getCart();
    if (cart.length > 0) {
        buyButton.disabled = false;
        buyButton.classList.remove("btn-disabled");
        buyButton.classList.add("btn-cart");
    } else {
        buyButton.disabled = true;
        buyButton.classList.remove("btn-cart");
        buyButton.classList.add("btn-disabled");
    }
}


//confirma el pedido

document.getElementById("buy-button")!
    .addEventListener("click", confirmOrder);

function confirmOrder() {
    const cart = getCart();

    const telefono = (document.getElementById("checkout-phone") as HTMLInputElement).value;

    const formaPago = (document.getElementById("checkout-payment") as HTMLSelectElement)
        .value as "EFECTIVO" | "TARJETA" | "TRANSFERENCIA";


    if (!telefono || !formaPago) {
        alert("Debe completar teléfono y forma de pago.");
        return;
    }

    const subtotal = cart.reduce((acc, item) => acc + item.product.precio * item.quantity, 0);
    const envio = getDeliveryCost();
    const total = subtotal + envio;

    const activeUser = getActiveUser();
    if (!activeUser) {
        alert("No hay usuario autenticado.");
        return;
    }
    const newOrder: IOrder = {
        id: ordersCounter(),
        fecha: new Date().toISOString().split("T")[0], // Fecha en formato YYYY-MM-DD
        estado: "PENDIENTE",
        total,
        formaPago,
        detalles: cart.map(item => ({
            cantidad: item.quantity,
            subtotal: item.product.precio * item.quantity,
            producto: item.product
        })),
        usuarioDto: {
            id: activeUser.id,
            nombre: activeUser.nombre,
            apellido: activeUser.apellido,
            mail: activeUser.mail,
            celular: telefono,
            rol: activeUser.rol
        }
    };

    //reduce el stock
    cart.forEach(item => {
        reduceProductStock(item.product.id, item.quantity);
    });

    addOrder(newOrder);
    clearCart();
    loadCart();

    const orderModal = document.getElementById("order-modal") as HTMLDivElement;
    orderModal.classList.remove("hidden");

    const closeBtn = document.getElementById("close-order-modal") as HTMLButtonElement;
    closeBtn.addEventListener("click", () => {
        orderModal.classList.add("hidden");
    });
}


function updateCartSummaryVisibility() {
    const cart = getCart();
    const cartSummary = document.getElementById("cart-summary") as HTMLDivElement;

    if (cart.length > 0) {
        cartSummary.style.display = "block"; // se muestra
    } else {
        cartSummary.style.display = "none"; // se oculta
    }
}

const loader = document.getElementById("loader") as HTMLDivElement;

if (guard("USUARIO")) {
    document.addEventListener("DOMContentLoaded", () => {
        loader.classList.add("hidden"); //remueve el loader

        const toggleSidebar = document.getElementById("menu-toggle") as HTMLButtonElement;
        const sidebar = document.querySelector(".sidebar") as HTMLElement;
        //toggle de sidebar
        if (toggleSidebar && sidebar) {
            toggleSidebar.addEventListener("click", () => {
                sidebar.classList.toggle("active");
            });
        }

        const logoutBtn = document.getElementById("logout-btn");

        if (logoutBtn) {
            logoutBtn.addEventListener("click", (e) => {
                e.preventDefault();
                logout();
            });
        }

    })
};

