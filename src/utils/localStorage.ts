import type { CartItem } from "../types/cartItem";
import type { Product } from "../types/product";
import type { ICategory } from "../types/category";
import { getProducts, getCategories, getUsers, getOrders } from "../data/data";
import type { IUser } from "../types/users";
import type { IOrder } from "../types/orders";

const ACTIVE_USER = "ACTIVE_USER";

//primera carga -> carga todos los datos de los json a localstorage 
document.addEventListener("DOMContentLoaded", async () => {
    const productsStored = localStorage.getItem("products");
    const categoriesStored = localStorage.getItem("categories");
    const usersStored = localStorage.getItem("users"); //safe users
    const authUsersStored = localStorage.getItem("authUsers"); //users con passwords
    const ordersStored = localStorage.getItem("orders");

    if (!productsStored || !categoriesStored) {
        // Solo se ejecuta si no hay datos guardados
        await initProductsAndCategories();
    }
    // Usuarios (sin password)
    if (!usersStored) {
        await initSafeUsers();
    }

    // Usuarios (con password, para login)
    if (!authUsersStored) {
        await initAuthUsers();
    }

    // Pedidos
    if (!ordersStored) {
        await initOrders();
    }

});

//funciones del carrito
export const getCart = (): CartItem[] => {
    const cart = localStorage.getItem("cart");
    return cart ? (JSON.parse(cart) as CartItem[]) : [];
};


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

// Inicializa usuarios en localStorage - evita guardar la contraseña
export async function initSafeUsers() {
    try {
        const users: IUser[] = await getUsers();

        // Guardar usuarios sin password en localStorage
        const safeUsers = users.map(({ password, ...rest }) => rest);
        localStorage.setItem("users", JSON.stringify(safeUsers));
    } catch (err) {
        console.error("Error cargando usuarios:", err);
    }
}

// Inicializa usuarios con password (solo para login)
export async function initAuthUsers() {
    try {
        const users: IUser[] = await getUsers();
        localStorage.setItem("authUsers", JSON.stringify(users));
    } catch (err) {
        console.error("Error cargando usuarios:", err);
    }
}

// Obtiene usuarios con password (para validación de login)
export function getStoredAuthUsers(): IUser[] {
    const data = localStorage.getItem("authUsers");
    return data ? (JSON.parse(data) as IUser[]) : [];
}

// Devuelve el usuario logeado en el momento
export function getActiveUser(): IUser | null {
    const data = localStorage.getItem(ACTIVE_USER);
    return data ? (JSON.parse(data) as IUser) : null;
}

// Inicializa pedidos en localStorage
export async function initOrders() {
    try {
        const orders: IOrder[] = await getOrders();
        localStorage.setItem("orders", JSON.stringify(orders));
    } catch (err) {
        console.error("Error cargando pedidos:", err);
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

// Usuarios sin password
export function getStoredUsersSafe(): IUser[] {
    const data = localStorage.getItem("users");
    return data ? (JSON.parse(data) as IUser[]) : [];
}


// FUNCIONES PARA PEDIDOS
export function getStoredOrders(): IOrder[] {
    const data = localStorage.getItem("orders");
    return data ? (JSON.parse(data) as IOrder[]) : [];
}

// Órdenes pendientes
export function getOrdersPending(): IOrder[] {
    return getStoredOrders().filter(order => order.estado === "PENDIENTE");
}

// Órdenes en preparación
export function getOrdersPreparation(): IOrder[] {
    return getStoredOrders().filter(order => order.estado === "EN_PREPARACION");
}

// Órdenes entregadas
export function getOrdersDelivered(): IOrder[] {
    return getStoredOrders().filter(order => order.estado === "ENTREGADO");
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
    localStorage.setItem("categories", JSON.stringify(updated));
}

export function enableCategory(id: number) {
    const categories = getStoredCategories();
    const updated = categories.map((c) =>
        c.id === id ? { ...c, eliminado: false } : c,
    );
    localStorage.setItem("categories", JSON.stringify(updated));
}

// export function updateCategory(id: number, updatedFields: Partial<ICategory>) {
//     const categories = getStoredCategories();
//     const updated = categories.map((c) =>
//         c.id === id ? { ...c, ...updatedFields } : c,
//     );
//     localStorage.setItem("categories", JSON.stringify(updated));
// }

//actualiza categoria y lo sincroniza con productos
export function updateCategory(id: number, updatedFields: Partial<ICategory>) {
    const categories = getStoredCategories();
    const updatedCategories = categories.map((c) =>
        c.id === id ? { ...c, ...updatedFields } : c
    );
    localStorage.setItem("categories", JSON.stringify(updatedCategories));

    //sncronizar también en productos
    const products = getStoredProducts();
    const updatedProducts = products.map((p) => {
        const updatedCategorias = p.categorias.map((pc: ICategory) =>
            pc.id === id ? { ...pc, ...updatedFields } : pc
        );
        return { ...p, categorias: updatedCategorias };
    });
    localStorage.setItem("products", JSON.stringify(updatedProducts));
}