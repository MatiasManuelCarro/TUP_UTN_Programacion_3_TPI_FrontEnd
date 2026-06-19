import type { IUser } from "../types/users";
import { getUsers } from "./fetch";
import { navigate } from "./navigate";

const ACTIVE_USER = "ACTIVE_USER";

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

// Usuarios sin password
export function getStoredUsersSafe(): IUser[] {
    const data = localStorage.getItem("users");
    return data ? (JSON.parse(data) as IUser[]) : [];
}



// Devuelve el usuario logeado en el momento
export function getActiveUser(): IUser | null {
    const data = localStorage.getItem(ACTIVE_USER);
    return data ? (JSON.parse(data) as IUser) : null;
}


export const logout = () => {
    localStorage.removeItem("ACTIVE_USER");
    navigate("/src/pages/auth/login/login.html");
};
