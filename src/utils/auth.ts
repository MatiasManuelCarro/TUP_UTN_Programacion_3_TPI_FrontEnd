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



export function registerUser(newUser: IUser & { password: string }): string | null {
  const authUsers = getStoredAuthUsers();

  // Validar email único
  if (authUsers.some(u => u.mail.toLowerCase() === newUser.mail.toLowerCase())) {
    return "Ya existe un usuario con ese email.";
  }

  // Asignar ID incremental
  newUser.id = authUsers.length > 0 ? Math.max(...authUsers.map(u => u.id!)) + 1 : 1;

  // Guardar en authUsers (con password para poder utilizarlo con localstorage)
  authUsers.push(newUser);
  localStorage.setItem("authUsers", JSON.stringify(authUsers));

  // Guardar versión segura (sin password)
  const safeUsers = authUsers.map(({ password, ...rest }) => rest);
  localStorage.setItem("users", JSON.stringify(safeUsers));

  return null; // éxito
}


export const logout = () => {
    localStorage.removeItem("ACTIVE_USER");
    navigate("/src/pages/auth/login/login.html");
};
