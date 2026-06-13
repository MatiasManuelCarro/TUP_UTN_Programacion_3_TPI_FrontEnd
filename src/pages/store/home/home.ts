import type { Product } from "../../../types/product";
import { getCategories, getProducts } from "../../../data/data";
import { addToCart, getCartCount } from "../../../utils/localStorage";
import type { ICategory } from "../../../types/category";




const searchNotification = document.getElementById("searchNotification") as HTMLElement;
//carga las tarjetas de productos
const loadProducts = (products: Product[]) => {
    const productsContainer = document.getElementById("products-container") as HTMLDivElement;
    productsContainer.innerHTML = "";

    //contador de productos disponibles
    let productsAvailable = 0;

    products.forEach((product) => {
        //verifica que el stock sea mayor a 0
        if (product.stock > 0) {
            productsAvailable += 1;
            const productsCard: HTMLElement = document.createElement("div");
            productsCard.classList.add("featured-products");
            productsCard.innerHTML = `
        <div class="featured-img">
        <img src="${product.imagen}" alt="Imagen de ${product.nombre}" /></div>
        <p class=product-category>${product.categorias.map(c => c.nombre)}</p>
        <h3 class=product-name>${product.nombre}</h3>
        <p class=product-description>${product.descripcion}</p>
        <p class=product-price>Precio: $${product.precio}</p>
        <div class="buttons">
        <button class=btn-cart data-id="${product.id}">Agregar al Carrito</button></div>
        `
            productsContainer.appendChild(productsCard);
        }
    });

    //informa la cantidad de productos total debajo de la busqueda
    searchNotification.style.display = "block";
    searchNotification.textContent = `Hay disponible ${productsAvailable} productos`;

}

// Render de categorias 
const loadCategories = (categories: ICategory[]) => {
    const categoriesList = document.getElementById("categories-list") as HTMLUListElement;

    if (!categoriesList) return;
    // limpiar antes de renderizar para evitar duplicados
    // categoriesList.innerHTML = "";


    categories.forEach((category) => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#">${category.nombre}</a>`;
        li.classList.add("categories");
        categoriesList.appendChild(li);
    })
};


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
                    { transform: "scale(1)" }
                ],
                {
                    duration: 400,
                    easing: "ease"
                }
            );
        }
    }
};


document.addEventListener("DOMContentLoaded", async () => {
    // Cargar y normalizar datos
    let products: Product[] = [];
    let categories: ICategory[] = [];

    try {
        // cargar y normalizar
        const rawProducts: any[] = await getProducts();
        categories = await getCategories();

        products = rawProducts.map((p: any) => ({
            ...p,
            categorias: Array.isArray(p.categorias) ? p.categorias : (p.categoria ? [p.categoria] : [])
        }));

        // carga inicial
        loadProducts(products);
        loadCategories(categories);
        updateCartBadge();

    } catch (err) {
        console.error("Error cargando datos:", err);
    }

    const productsContainer = document.getElementById("products-container") as HTMLDivElement;
    const cartMessage = document.getElementById("modal-message") as HTMLParagraphElement;
    const modalImg = document.getElementById("modal-img") as HTMLDivElement;
    const modal = document.getElementById("modal") as HTMLDivElement;
    const closeCart = document.getElementById("close-cart") as HTMLButtonElement;
    const continueShopping = document.getElementById("btn-continue-shopping") as HTMLButtonElement;
    const productsHeading = document.getElementById("products-heading") as HTMLElement;
    //busqueda por nombre 
    const inputSearch = document.getElementById("searchProduct") as HTMLInputElement
    //para sidebar en mobile
    const toggleSidebar = document.getElementById("menu-toggle") as HTMLButtonElement;
    const sidebar = document.querySelector(".sidebar") as HTMLElement;
    const overlay = document.getElementById("overlay") as HTMLDivElement;


    inputSearch.addEventListener("input", (e) => {
        const target = e.target as HTMLInputElement;
        const search = target.value.toLowerCase().trim(); //trim para eliminar los espacios al principio y final

        //limita la busqueda a productos con stock > 0
        const searchResults = products.filter((products) => {
            return (
                products.stock > 0 &&
                products.nombre.toLowerCase().includes(search)
            );
        });
        loadProducts(searchResults);

        if (search === "") {
            searchNotification.style.display = "block";
            // revisar
            searchNotification.textContent = "Ingrese un nombre para buscar";
            productsHeading.textContent = `Productos`
        } else if (searchResults.length > 0) {
            searchNotification.style.display = "block";
            searchNotification.textContent = `Se encontraron ${searchResults.length} productos`;
            productsHeading.textContent = `Productos`
        } else {
            searchNotification.style.display = "block";
            searchNotification.textContent = "No hay productos con ese nombre";
            productsHeading.textContent = `Productos`
        }

    });

    // Cargar productos
    if (productsContainer) {
        loadProducts(products);
        updateCartBadge();
    }
    //verifica que se encuentre dentro de home.html, si no no llama la funcion de modal, evita errores en cart.html
    // loadCategories(categories);
    //Filtrar por categorias
    const btnCategories = document.querySelectorAll<HTMLLIElement>(".categories");

    btnCategories.forEach((btn) => {
        btn.addEventListener("click", () => {
            //limpia el input de busqueda de texto primero
            inputSearch.value = "";
            const selectedCategory = btn.textContent?.trim();
            if (selectedCategory === "Ver todas las Categorias") {
                loadProducts(products);
                productsHeading.textContent = `Productos`
            } else {
                //busca categoria por nombre
                const findCategory = categories.find(
                    (category) => category.nombre.toLowerCase() === selectedCategory?.toLowerCase()
                );

                // Filtrar los productos por categoria
                const filterProduct = products.filter((product) =>
                    product.categorias.some((c) => c.id === findCategory?.id)
                );

                loadProducts(filterProduct);
                productsHeading.textContent = `Categoria: ${selectedCategory}`
            }
            //asigna el id activo al boton clickeado
            btnCategories.forEach((b) => b.removeAttribute("id"));
            btn.id = "category-active";
        });
    });


    //Evento de click en agregar al carrito (modal)
    productsContainer.addEventListener("click", (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const idProduct = target.dataset.id;;
        const product = products.find((p) => p.id === Number(idProduct));

        if (product) {
            modalImg.innerHTML = `<img src="${product.imagen}" alt="Imagen de ${product.nombre}"/>`
            cartMessage.textContent = `Se agrega al carrito: ${product.nombre}`;
            modal.style.display = "block";
            //agrega al carrito
            addToCart(product);
            //actualiza el badge del cart
            updateCartBadge();
        }

    });


    //funciones que cierran el modal del carrito

    const closeModal = (event: MouseEvent) => {
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
    });

    toggleSidebar.addEventListener("click", () => {
        sidebar.classList.toggle("active");
        overlay.classList.toggle("active");
    });

    overlay.addEventListener("click", () => {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
    });

});