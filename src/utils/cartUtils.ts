import type { CartItem } from "../types/cartItem";
import type { Product } from "../types/product";
import { getActiveUser } from "./auth";
import { getActiveCategories } from "./categoriesUtils";
import { getStoredProducts } from "./productUtils";



function getCartKey(): string {
    const activeUser = getActiveUser();
    if (!activeUser) {
        throw new Error("No hay usuario autenticado"); 
    }
    return `cart_${activeUser.id}`;
}

export function getCart(): CartItem[] {
    try {
        const raw = localStorage.getItem(getCartKey());
        const parsed = JSON.parse(raw || "[]");
        if (!Array.isArray(parsed)) return [];
        return parsed;
    } catch {
        return [];
    }
}

const saveCart = (cart: CartItem[]): void => {
    localStorage.setItem(getCartKey(), JSON.stringify(cart));
};

export const clearCart = (): void => {
    localStorage.removeItem(getCartKey());
};

export const getCartCount = (): number => {
    const cart = getCart();
    const products = getStoredProducts();
    const activeCategories = getActiveCategories(); // solo activas

    return cart.reduce((count: number, item: CartItem) => {
        const currentProduct = products.find((p) => p.id === item.product.id);

        if (currentProduct && currentProduct.disponible) {
            const categoryIsActive = currentProduct.categorias.some((pc) =>
                activeCategories.some((ca) => ca.id === pc.id),
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

