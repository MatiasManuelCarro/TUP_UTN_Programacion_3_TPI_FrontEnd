import type { Product } from "../../../types/product";
import {
    addToCart,
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
        const availableStock = getAvailableStock(product); //consigue el stock disponible
        renderProductDetail(product, availableStock);

    } catch (e) {
        console.error("Error parseando producto:", e);
    }
});


function renderProductDetail(product: Product, availableStock: number) {
    let amount = 1; //cantidad inicial de productos a comprar
    let productStock = product.stock; //stock inicial al cargar la pagina

    const isAvailable = availableStock === 0 ? "" : String(availableStock);
    const availableClass = availableStock === 0 ? "no" : "yes";
    const availableText = availableStock === 0 ? "Sin Stock" : "Stock disponible: ";
    const disabledClass = availableStock === 0 ? "disabled" : "";

    const container = document.getElementById("product-detail");
    if (!container) return;

    

    container.innerHTML = `
    <h1>${product.nombre}</h1>
    <div class="detail-img"><img src="${product.imagen}" alt="${product.nombre}" /></div>
    <p class="detail-category">${(product.categorias || []).map(c => c.nombre).join(", ")}</p>
    <p class="detail-desc">${product.descripcion}</p>
    <p class="detail-price">Precio: $${product.precio}</p>    
    <p class="detail-stock ${availableClass}">${availableText} ${isAvailable}</p>   
    <p class="cart-amount"> 
    <a href="#" class="link-amount minus" data-id="${product.id}">-</a>
    Cantidad: ${amount}    
    <a href="#" class="link-amount plus" data-id="${product.id}">+</a>    
    </p>
<div class="detail-buttons">
    <button id="add-to-cart" class="${disabledClass}" data-id="${product.id}">Agregar al carrito</button>
    <a id="back-to-home" href="/src/pages/store/home/home.html">Volver</a>
    </div>
    `;

    const detailStockText = container.querySelector(".detail-stock") as HTMLElement;

    const updateStockText = () => {
        const newAvailableStock = getAvailableStock(product);

        const isAvailable = newAvailableStock === 0 ? "" : String(newAvailableStock);
        const availableClass = newAvailableStock === 0 ? "no" : "yes";
        const availableText = newAvailableStock === 0 ? "Sin Stock" : "Stock disponible: "

        // detailStockText.innerHTML = `
        // <p class="detail-stock ${availableClass}">${availableText} ${isAvailable}</p> 
        // `;

        detailStockText.className = `detail-stock ${availableClass}`;
        detailStockText.textContent = `${availableText} ${isAvailable}`;
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

        const newAvailableStock = getAvailableStock(product);

        if (amount <= 1) {
            minusLink.style.color = "var(--color-borde)";
            minusLink.style.pointerEvents = "none";
        }
        if (amount >= newAvailableStock) {
            plusLink.style.color = "var(--color-borde)";
            plusLink.style.pointerEvents = "none";
        }
    };
    updateQuantityText();

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

    const modal = document.getElementById("modal") as HTMLElement;
    const modalImg = document.getElementById("modal-img") as HTMLElement;
    const cartMessage = document.getElementById("modal-message") as HTMLElement;
    const closeCart = document.getElementById("close-cart") as HTMLElement;
    const continueShopping = document.getElementById("btn-continue-shopping") as HTMLElement;

    const closeModal = (event: Event) => {
        event.preventDefault();
        modal.style.display = "none";
        cartMessage.textContent = "";
    };

    closeCart.addEventListener("click", closeModal);
    continueShopping.addEventListener("click", closeModal);

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
            cartMessage.textContent = "";
        }

    })

    const addBtn = document.getElementById("add-to-cart") as HTMLButtonElement | null;
        if (addBtn) {
            addBtn.addEventListener("click", () => {
                addToCart(product, amount);
                updateCartBadge();
                productStock -= amount;
                updateStockText();
                amount = 1;

                //actualiza cantidades y re-renderiza
                updateQuantityText();
                const newAvailableStock = getAvailableStock(product);
                renderProductDetail(product, newAvailableStock);

                modalImg.innerHTML = `<img src="${product.imagen}" alt="Imagen de ${product.nombre}"/>`;
                cartMessage.textContent = `Se agregó al carrito: ${product.nombre}`;
                modal.style.display = "block";

            });
        }

};