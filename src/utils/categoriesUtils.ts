import type { ICategory } from "../types/category";
import { getStoredCategories, getStoredProducts } from "./productUtils";

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

export function getActiveCategories(): ICategory[] {
    const loadCategories: ICategory[] = getStoredCategories();
    const enabledCategories = loadCategories.filter((c) => !c.eliminado);
    return enabledCategories;
}

//actualiza categoria y lo sincroniza con productos
export function updateCategory(id: number, updatedFields: Partial<ICategory>) {
    const categories = getStoredCategories();
    const updatedCategories = categories.map((c) =>
        c.id === id ? { ...c, ...updatedFields } : c,
    );
    localStorage.setItem("categories", JSON.stringify(updatedCategories));

    //sncronizar también en productos
    const products = getStoredProducts();
    const updatedProducts = products.map((p) => {
        const updatedCategorias = p.categorias.map((pc: ICategory) =>
            pc.id === id ? { ...pc, ...updatedFields } : pc,
        );
        return { ...p, categorias: updatedCategorias };
    });
    localStorage.setItem("products", JSON.stringify(updatedProducts));
}

export function createCategory(nombre: string, descripcion: string) {
    const categories = getStoredCategories();

    const newCategory: ICategory = {
        id: categories.length > 0 ? categories[categories.length - 1].id + 1 : 1,
        nombre,
        descripcion,
        eliminado: false,
        createdAt: new Date().toISOString()
    };

    categories.push(newCategory);
    localStorage.setItem("categories", JSON.stringify(categories));
}
