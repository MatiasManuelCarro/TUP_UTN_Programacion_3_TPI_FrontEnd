import type { Product } from "../../../types/product";
import type { CartItem } from "../../../types/cartItem";

import {
    getCart,
    clearCart,
    minusOneCart,
    addToCart,
    deleteProduct,
    getCartCount,
    getStoredProducts,
} from "../../../utils/localStorage";



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
    
    renderCartMessage(cart, cartEmptyMessage);

    let total = 0;
    for (const item of cart) {

        const currentProduct = products.find(p => p.id === item.product.id); //busca el item actualizado
        if (!currentProduct || !currentProduct.disponible) {  //verifica si no esta disponible, si no lo esta lo borra
            deleteProduct(item.product)  
            continue;
        }

        const productCard = renderCartItem(item);
        cartContainer.appendChild(productCard);
        cartListeners(productCard, item.product, item.quantity);
        total += item.product.precio * item.quantity;

    }

    updateCartSummary(total);
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

function updateCartSummary(total: number) {
    const summary = document.querySelector(".cart-summary h3");
    if (summary) {
        summary.textContent = `Total: $${total}`;
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
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadCart();
});

document.getElementById("clear-cart")?.addEventListener("click", () => {
    clearCart();
    loadCart();
});

document.addEventListener("DOMContentLoaded", () => {
    const toggleSidebar = document.getElementById("menu-toggle") as HTMLButtonElement;
    const sidebar = document.querySelector(".sidebar") as HTMLElement;
    //toggle de sidebar
    if (toggleSidebar && sidebar) {
        toggleSidebar.addEventListener("click", () => {
            sidebar.classList.toggle("active");
        });
    }

});

