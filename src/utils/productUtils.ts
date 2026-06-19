import type { ICategory } from "../types/category";
import type { Product } from "../types/product";
import { getCart } from "./cartUtils";
import { getCategories, getProducts } from "./fetch";

export function getAvailableStock(product: Product): number {
    const cart = getCart();
    // const item = cart.find(ci => ci.product.id === product.id);
    const item = cart.find((ci) => Number(ci.product.id) === Number(product.id));

    if (item) {
        // stock menos lo que ya está en el carrito - elige el mayor
        return Math.max(product.stock - item.quantity, 0);
    }

    return product.stock;
}

// Inicializa productos y categorías en localStorage
export async function initProductsAndCategories() {
    try {
        const rawProducts: any[] = await getProducts();
        const categories = await getCategories();

        const products: Product[] = rawProducts.map((p: any) => ({
            ...p,
            categorias: Array.isArray(p.categorias)
                ? p.categorias
                : p.categoria
                    ? [p.categoria]
                    : [],
        }));

        // Guardar en localStorage
        localStorage.setItem("products", JSON.stringify(products));
        localStorage.setItem("categories", JSON.stringify(categories));
    } catch (err) {
        console.error("Error cargando datos:", err);
    }
}

//llama los datos desde localstorage

export function getStoredProducts(): Product[] {
    const data = localStorage.getItem("products");
    return data ? (JSON.parse(data) as Product[]) : [];
}

export function getStoredCategories(): ICategory[] {
    const data = localStorage.getItem("categories");
    return data ? (JSON.parse(data) as ICategory[]) : [];
}


//funciones para productos
export function disableProduct(id: number) {
    const products = getStoredProducts();

    const updated = products.map((p) =>
        p.id === id ? { ...p, disponible: false } : p,
    );

    localStorage.setItem("products", JSON.stringify(updated));
}

export function enableProduct(id: number) {
    const products = getStoredProducts();

    const updated = products.map((p) =>
        p.id === id ? { ...p, disponible: true } : p,
    );

    localStorage.setItem("products", JSON.stringify(updated));
}

export function updateProduct(id: number, updatedFields: Partial<Product>) {
    const products = getStoredProducts();

    const updated = products.map((p) =>
        p.id === id ? { ...p, ...updatedFields } : p,
    );

    localStorage.setItem("products", JSON.stringify(updated));
}
