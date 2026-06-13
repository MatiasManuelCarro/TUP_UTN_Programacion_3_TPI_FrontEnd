import type { Product } from "../../../types/product";
import {
    getCart,
    clearCart,
    minusOneCart,
    addToCart,
    deleteProduct,
    getCartCount,
} from "../../../utils/localStorage";

document.addEventListener("DOMContentLoaded", () => {


    //bagde de cantidad de items en el carrito
    const updateCartBadge = () => {
        const cartCountElement = document.getElementById("cart-count");
        if (cartCountElement) {
            const count = getCartCount();
            cartCountElement.textContent = String(count);

            if (count === 0) {
                cartCountElement.style.visibility = "hidden";
            } else {
                cartCountElement.style.visibility = "visible";

                //animacion del badge
                cartCountElement.animate(
                    [
                        { transform: "scale(1)" },
                        { transform: "scale(1.2)" },
                        { transform: "scale(1)" },
                    ],
                    {
                        duration: 400,
                        easing: "ease",
                    },
                );
            }
        }
    };

    updateCartBadge();

    let productJson = sessionStorage.getItem("selectedProduct");

    // if (!productJson) {
    //     const params = new URLSearchParams(window.location.search);
    //     const encoded = params.get("product");
    //     if (encoded) {
    //         try {
    //             productJson = atob(decodeURIComponent(encoded));
    //         } catch (e) {
    //             console.error("Error decodificando producto desde query:", e);
    //         }
    //     }
    // }

    if (!productJson) {
        const container = document.getElementById("product-detail");
        if (container) container.innerHTML = "<p>No se encontró el producto seleccionado.</p>";
        return;
    }

    try {
        const product: Product = JSON.parse(productJson);
        renderProductDetail(product);
        // opcional: limpiar sessionStorage si no querés mantenerlo
        // sessionStorage.removeItem("selectedProduct");
    } catch (e) {
        console.error("Error parseando producto:", e);
    }
});

function renderProductDetail(product: Product) {
    const amount = 1;

    const container = document.getElementById("product-detail");
    if (!container) return;

    container.innerHTML = `
    <h1>${product.nombre}</h1>
    <div class="detail-img"><img src="${product.imagen}" alt="${product.nombre}" /></div>
    <p class="detail-category">${(product.categorias || []).map(c => c.nombre).join(", ")}</p>
    <p class="detail-desc">${product.descripcion}</p>
    <p class="detail-price">Precio: $${product.precio}</p>
    <p class="detail-stock">Stock: ${product.stock}</p>
    <p class="cart-amount">
    <a href="#" class="link-amount minus" data-id="${product.id}">-</a>
    Cantidad: ${amount}    
    <a href="#" class="link-amount plus" data-id="${product.id}">+</a>    
    </p>
    <button id="add-to-cart" data-id="${product.id}">Agregar al carrito</button>
    <a id="back-to-home" href="/src/pages/store/home/home.html" class="btn-back">Volver</a>
  `;
 
    // ejemplo: listener para agregar al carrito desde la página de detalle
    const addBtn = document.getElementById("add-to-cart") as HTMLButtonElement | null;
    if (addBtn) {
        addBtn.addEventListener("click", () => {

        });
    }

    const quantityElement = container.querySelector(".cart-amount") as HTMLElement;
    //renderiza cantidades
    const updateQuantityText = () => {
        quantityElement.innerHTML = `
    <a href="#" class="link-amount minus" data-id="${product.id}">-</a>
    Cantidad: ${amount}
    <a href="#" class="link-amount plus" data-id="${product.id}">+</a>
    `;
    };

    updateQuantityText();


    detailListeners(container, product, amount);
}




function detailListeners(
    container: HTMLElement,
    product: Product,
    amount: number,
) {
    const minusLink = container.querySelector(
        ".link-amount.minus",
    ) as HTMLAnchorElement;
    const plusLink = container.querySelector(
        ".link-amount.plus",
    ) as HTMLAnchorElement;

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
            updateQuantityText();

        }
    });

    plusLink.addEventListener("click", (e) => {
        e.preventDefault();
        if (amount < product.stock) {
            //desactiva la funcion del boton si ya alcanzo el limite de stock
            updateQuantityText();
        }
    });

}
