import type { IUserDto } from "../types/orders";
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


// Obtiene usuarios con password (solo usuarios registrador por register - almacenados en localtorage)
export function getStoredAuthUsers(): IUser[] {
    const data = localStorage.getItem("authUsers");
    return data ? (JSON.parse(data) as IUser[]) : [];
}

// Obtiene Usuarios sin password
export function getStoredUsersSafe(): IUser[] {
    const data = localStorage.getItem("users");
    return data ? (JSON.parse(data) as IUser[]) : [];
}


// Devuelve el usuario logeado en el momento
export function getActiveUser(): IUser | null {
    const data = localStorage.getItem(ACTIVE_USER);
    return data ? (JSON.parse(data) as IUser) : null;
}

//devuelve el usuario activo con el IUserDto (sin requerir contraseña)
//se utiliza para los pedidos realizados
export function getActiveUserDto(): IUserDto | null {
    const data = localStorage.getItem(ACTIVE_USER);
    if (!data) return null;

    const user = JSON.parse(data) as IUser;

    return {
        id: user.id!,
        nombre: user.nombre!,
        apellido: user.apellido!,
        mail: user.mail!,
        celular: user.celular!,
        rol: "USUARIO"
    };
}




export async function registerUser(newUser: IUser & { password: string }): Promise<string | null> {
    // Obtiene authUsers actuales (usuarios con password en localstorage pero no los del json)
    const stored = localStorage.getItem("authUsers");
    const authUsers: (IUser & { password: string })[] = stored ? JSON.parse(stored) : [];

    //valida email duplicado en authusers
    const exists = authUsers.some(u => u.mail.toLowerCase() === newUser.mail.toLowerCase());
    if (exists) {
        return "Ya existe un usuario registrado con ese email.";
    }

   // Valida user duplicado en JSON
    const jsonUsers = await getUsers();
    const existsJson = jsonUsers.some(u => u.mail.toLowerCase() === newUser.mail.toLowerCase());
    if (existsJson) {
        return "Ese email ya está registrado en el sistema.";
    }

    //Asigna ID incremental
    newUser.id = authUsers.length > 0 ? authUsers[authUsers.length - 1].id + 1 : 1;

    // Guarda en authUsers (con password)
    authUsers.push(newUser);
    localStorage.setItem("authUsers", JSON.stringify(authUsers));

    //Guardar en SafeUsers (sin password)
    const safeUsers = authUsers.map(({ password, ...rest }) => rest);
    localStorage.setItem("users", JSON.stringify(safeUsers));

    return null; 
}

export const logout = () => {
    localStorage.removeItem("ACTIVE_USER");
    navigate("/src/pages/auth/login/login.html");
};
