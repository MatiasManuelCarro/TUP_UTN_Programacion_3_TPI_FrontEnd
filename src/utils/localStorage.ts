import type { CartItem } from "../types/cartItem";
import type { Product } from "../types/product";
import type { ICategory } from "../types/category";
import { getProducts, getCategories } from "../data/data";

document.addEventListener("DOMContentLoaded", async () => {
    const productsStored = localStorage.getItem("products");
    const categoriesStored = localStorage.getItem("categories");

    if (!productsStored || !categoriesStored) {
        // Solo se ejecuta si no hay datos guardados
        await initProductsAndCategories();
    }
});

//funciones del carrito
export const getCart = (): CartItem[] => {
    const cart = localStorage.getItem("cart");
    return cart ? (JSON.parse(cart) as CartItem[]) : [];
};

// export const getCartCount = (): number => {
//     return getCart().reduce(
//         (count: number, item: CartItem) => count + item.quantity,
//         0
//     );
// };

// export const getCartCount = (): number => {
//     const cart = getCart();
//     const products = getStoredProducts();
//     const activeCategories = getActiveCategories();

//     return cart.reduce((count: number, item: CartItem) => {
//         const currentProduct = products.find((p) => p.id === item.product.id);
//         // solo suma si el producto existe y está disponible
//         if (currentProduct && currentProduct.disponible) {
//             return count + item.quantity;
//         }
//         return count;
//     }, 0);
// };

export const getCartCount = (): number => {
    const cart = getCart();
    const products = getStoredProducts();
    const activeCategories = getActiveCategories(); // solo activas

    return cart.reduce((count: number, item: CartItem) => {
        const currentProduct = products.find(p => p.id === item.product.id);

        if (currentProduct && currentProduct.disponible) {
            const categoryIsActive = currentProduct.categorias.some(pc =>
                activeCategories.some(ca => ca.id === pc.id)
            );

            if (categoryIsActive) {
                return count + item.quantity;
            }
        }
        return count;
    }, 0);
};

// export const addToCart = (product: Product): void => {
//     const cart = getCart();
//     const exists = cart.find(p => p.product.id === product.id)

//     if (exists) {
//         exists.quantity++;
//     } else {
//         cart.push({ product, quantity: 1 });
//     }

//     saveCart(cart);
// }

// export const addToCart = (product: Product, amount: number): void => {
//     const cart = getCart();
//     const exists = cart.find(p => p.product.id === product.id)

//     if (exists) {
//         exists.quantity += amount; //si existia el item lo suma
//     } else {
//         cart.push({ product, quantity: amount }); // si no estaba lo crea
//     }

//     saveCart(cart);
// }

export const addToCart = (product: Product, amount: number): void => {
    const cart = getCart();
    const exists = cart.find((p) => p.product.id === product.id);

    if (exists) {
        const newQuantity = exists.quantity + amount;
        exists.quantity = Math.min(newQuantity, product.stock); //elige el menor de los dos, si el stock es bajo pone lo que tien el stock
    } else {
        const initialQuantity = Math.min(amount, product.stock);
        cart.push({ product, quantity: initialQuantity });
    }

    saveCart(cart);
};

export const minusOneCart = (product: Product): void => {
    const cart = getCart();
    const exists = cart.find((p) => p.product.id === product.id);

    if (exists && exists.quantity > 1) {
        exists.quantity--;
    }

    saveCart(cart);
};

export const deleteProduct = (product: Product): void => {
    const cart = getCart();
    const exists = cart.find((p) => p.product.id === product.id);
    if (exists) {
        const newCart = cart.filter((p) => p.product.id !== product.id);
        saveCart(newCart);
    }
};

const saveCart = (cart: CartItem[]): void => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

export const clearCart = (): void => {
    localStorage.removeItem("cart");
};

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

// export async function initProductsAndCategories() {
//     try {
//         const rawProducts: any[] = await getProducts();
//         const rawCategories: any[] = await getCategories();

//         // Normalizar categorías globales con eliminado siempre presente
//         const categories: ICategory[] = rawCategories.map((c: any) => ({
//             ...c,
//             eliminado: c.eliminado ?? false, // por defecto false
//         }));

//         // Normalizar productos y sus categorías
//         const products: Product[] = rawProducts.map((p: any) => ({
//             ...p,
//             categorias: Array.isArray(p.categorias)
//                 ? p.categorias.map((c: any) => ({
//                     ...c,
//                     eliminado: c.eliminado ?? false, // por defecto false
//                 }))
//                 : p.categoria
//                     ? [{ ...p.categoria, eliminado: p.categoria.eliminado ?? false }]
//                     : [],
//         }));

//         // Guardar en localStorage
//         localStorage.setItem("products", JSON.stringify(products));
//         localStorage.setItem("categories", JSON.stringify(categories));

//         // Logs para verificar
//     } catch (err) {
//         console.error("Error cargando datos:", err);
//     }
// }

// export async function initProductsAndCategories() {
//     try {
//         const rawProducts: any[] = await getProducts();
//         const rawCategories: any[] = await getCategories();

//         // Normalizar categorías globales con eliminado siempre presente
//         const categories: ICategory[] = rawCategories.map((c: any) => ({
//             ...c,
//             eliminado: c.eliminado ?? false, // por defecto false
//         }));

//         // Normalizar productos y sus categorías sincronizadas con globales
//         const products: Product[] = rawProducts.map((p: any) => {
//             let categorias: ICategory[] = [];

//             if (Array.isArray(p.categorias)) {
//                 categorias = p.categorias.map((c: any) => {
//                     const global = categories.find(cat => cat.id === c.id);
//                     return {
//                         ...c,
//                         eliminado: global ? global.eliminado : (c.eliminado ?? false),
//                     };
//                 });
//             } else if (p.categoria) {
//                 const global = categories.find(cat => cat.id === p.categoria.id);
//                 categorias = [{
//                     ...p.categoria,
//                     eliminado: global ? global.eliminado : (p.categoria.eliminado ?? false),
//                 }];
//             }

//             return { ...p, categorias };
//         });

//         // Guardar en localStorage
//         localStorage.setItem("products", JSON.stringify(products));
//         localStorage.setItem("categories", JSON.stringify(categories));

//     } catch (err) {
//         console.error("Error cargando datos:", err);
//     }
// }

// Recupera productos desde localStorage
export function getStoredProducts(): Product[] {
    const data = localStorage.getItem("products");
    return data ? (JSON.parse(data) as Product[]) : [];
}

// Recupera categorías desde localStorage
export function getStoredCategories(): ICategory[] {
    const data = localStorage.getItem("categories");
    return data ? (JSON.parse(data) as ICategory[]) : [];
}

export function getActiveCategories(): ICategory[] {
    const loadCategories: ICategory[] = getStoredCategories();
    const enabledCategories = loadCategories.filter((c) => !c.eliminado);
    return enabledCategories;
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

//funciones para categorias
export function disableCategory(id: number) {
    const categories = getStoredCategories();
    const updated = categories.map((c) =>
        c.id === id ? { ...c, eliminado: true } : c,
    );
    console.log(
        "disableCategory → guardando eliminado=true",
        updated.find((c) => c.id === id),
    );
    localStorage.setItem("categories", JSON.stringify(updated));
}

export function enableCategory(id: number) {
    const categories = getStoredCategories();
    const updated = categories.map((c) =>
        c.id === id ? { ...c, eliminado: false } : c,
    );
    console.log(
        "enableCategory → guardando eliminado=false",
        updated.find((c) => c.id === id),
    );
    localStorage.setItem("categories", JSON.stringify(updated));
}

export function updateCategory(id: number, updatedFields: Partial<ICategory>) {
    const categories = getStoredCategories();
    const updated = categories.map((c) =>
        c.id === id ? { ...c, ...updatedFields } : c,
    );
    localStorage.setItem("categories", JSON.stringify(updated));
}
