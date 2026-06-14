import type { Product } from "../../../types/product";
import {
    getCart,
    clearCart,
    minusOneCart,
    addToCart,
    deleteProduct,
    getCartCount,
    getAvailableStock,
} from "../../../utils/localStorage";



document.addEventListener("DOMContentLoaded", () => {



    let productJson = sessionStorage.getItem("selectedProduct");

    if (!productJson) {
        const container = document.getElementById("product-detail");
        if (container) container.innerHTML = "<p>No se encontró el producto seleccionado.</p>";
        return;
    }

    try {
        const product: Product = JSON.parse(productJson);
        const  availableStock = getAvailableStock(product); //consigue el stock disponible
        renderProductDetail(product, availableStock);

    } catch (e) {
        console.error("Error parseando producto:", e);
    }
});


function renderProductDetail(product: Product,  availableStock: number) {
    let amount = 1; //cantidad inicial de productos a comprar
    let productStock = product.stock; //stock inicial al cargar la pagina

    const container = document.getElementById("product-detail");
    if (!container) return;

    container.innerHTML = `
    <h1>${product.nombre}</h1>
    <div class="detail-img"><img src="${product.imagen}" alt="${product.nombre}" /></div>
    <p class="detail-category">${(product.categorias || []).map(c => c.nombre).join(", ")}</p>
    <p class="detail-desc">${product.descripcion}</p>
    <p class="detail-price">Precio: $${product.precio}</p>    
    <p class="detail-stock">Stock: ${availableStock}</p>   
    <p class="cart-amount"> 
    <a href="#" class="link-amount minus" data-id="${product.id}">-</a>
    Cantidad: ${amount}    
    <a href="#" class="link-amount plus" data-id="${product.id}">+</a>    
    </p>
    <button id="add-to-cart" data-id="${product.id}">Agregar al carrito</button>
    <a id="back-to-home" href="/src/pages/store/home/home.html" class="btn-back">Volver</a>
    `;
    
    const detailStockText = container.querySelector(".detail-stock") as HTMLElement;

    const updateStockText = () => {
        const newAvailableStock = getAvailableStock(product);
        detailStockText.innerHTML = `
        <p class="detail-stock">Stock: ${newAvailableStock}</p> 
        `;
    }

    const quantityElement = container.querySelector(".cart-amount") as HTMLElement;

    //renderiza cantidades
    const updateQuantityText = () => {
        quantityElement.innerHTML = `  
        <a href="#" class="link-amount minus" data-id="${product.id}">-</a>
        Cantidad: ${amount}
        <a href="#" class="link-amount plus" data-id="${product.id}">+</a>
    `;

        // bloqueo visual por el stock
        const minusLink = quantityElement.querySelector(".link-amount.minus") as HTMLAnchorElement;
        const plusLink = quantityElement.querySelector(".link-amount.plus") as HTMLAnchorElement;

        if (amount <= 1) {
            minusLink.style.color = "var(--color-borde)";
            minusLink.style.pointerEvents = "none";
        }
        if (amount >= product.stock) {
            plusLink.style.color = "var(--color-borde)";
            plusLink.style.pointerEvents = "none";
        }
    };
    updateQuantityText();

    // eventos para + y -
    quantityElement.addEventListener("click", (e) => {
        e.preventDefault();
        const target = e.target as HTMLElement;

        if (target.classList.contains("minus") && amount > 1) {
            amount--;
            updateQuantityText();
        }

        if (target.classList.contains("plus") && amount < product.stock) {
            amount++;
            updateQuantityText();
        }
    });



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
    // 
    const addBtn = document.getElementById("add-to-cart") as HTMLButtonElement | null;
    if (addBtn) {
        addBtn.addEventListener("click", () => {
            addToCart(product, amount);
            updateCartBadge();
            productStock -= amount;
            updateStockText();
            amount = 1;
            updateQuantityText();

        });
    }

}