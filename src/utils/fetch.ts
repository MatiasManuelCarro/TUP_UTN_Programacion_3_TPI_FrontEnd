import type { Product } from "../../src/types/product";
import type { ICategory } from "../../src/types/category";
import type { IOrder } from "../../src/types/orders";
import type { IUser } from "../../src/types/users";


// Función que carga  los JSON
async function loadJSON<T>(path: string): Promise<T> {
    const res = await fetch(path);
    if (!res.ok) {
        throw new Error(`Error al cargar ${path}: ${res.status}`);
    }
    return res.json();
}

//aca se realizan TODOS los fetch
export async function getCategories(): Promise<ICategory[]> {
    const categorias = await loadJSON<ICategory[]>("/data/categorias.json");
    return categorias.filter(c => !c.eliminado);
}

export async function getProducts(): Promise<Product[]> {
    const productos = await loadJSON<Product[]>("/data/productos.json");
    return productos.filter(p => !p.eliminado);
}


export async function getOrders(): Promise<IOrder[]> {
    const pedidos = await loadJSON<IOrder[]>("/data/pedidos.json");
    return pedidos;
}

export async function getUsers(): Promise<IUser[]> {
    const usuarios = await loadJSON<IUser[]>("/data/usuarios.json");
    return usuarios;
}