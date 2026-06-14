import type { CartItem } from "../types/cartItem";
import type { Product } from "../types/product";
import type { ICategory } from "../types/category";
import { getCategories } from "../data/data";

// localStorage.removeItem("cart");

//funciones del carrito
export const getCart = (): CartItem[] => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) as CartItem[] : [];
};


export const getCartCount = (): number => {
    return getCart().reduce(
        (count: number, item: CartItem) => count + item.quantity,
        0
    );
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
    const exists = cart.find(p => p.product.id === product.id)


    if (exists) {
        const newQuantity = exists.quantity + amount;
        exists.quantity = Math.min(newQuantity, product.stock); //elige el menor de los dos, si el stock es bajo pone lo que tien el stock
    } else {
        const initialQuantity = Math.min(amount, product.stock);
        cart.push({ product, quantity: initialQuantity });
    }

    saveCart(cart);
}

export const minusOneCart = (product: Product): void => {
    const cart = getCart();
    const exists = cart.find(p => p.product.id === product.id)

    if (exists && exists.quantity > 1) {
        exists.quantity--;
    }

    saveCart(cart);
}

export const deleteProduct = (product: Product): void => {
    const cart = getCart();
    const exists = cart.find(p => p.product.id === product.id)
    if (exists) {
        const newCart = cart.filter(p => p.product.id !== product.id);
        saveCart(newCart);
    }
}

const saveCart = (cart: CartItem[]): void => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

export const clearCart = (): void => {
    localStorage.removeItem("cart");
};

export function getAvailableStock(product: Product): number {
    const cart = getCart(); 
    const item = cart.find(ci => ci.product.id === product.id);

    if (item) {
        // stock menos lo que ya está en el carrito - elige el mayor
        return Math.max(product.stock - item.quantity, 0);
    }

    return product.stock;
}