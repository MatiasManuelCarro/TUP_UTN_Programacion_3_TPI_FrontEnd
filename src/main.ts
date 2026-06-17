import type { IUser } from "./types/users";
import { getActiveUser } from "./utils/localStorage";
import { navigate } from "./utils/navigate";



// export function guard(requiredRole?: "ADMIN" | "USUARIO") {
//   const user: IUser | null = getActiveUser(); 

//   if (!user) {
//     // No hay sesión → al login
//     navigate("index.html");
//     return;
//   }

//   // Si se pide rol específico y no coincide
//   if (requiredRole && user.rol !== requiredRole) {
//     if (user.rol === "USUARIO") {
//       navigate("/src/pages/store/home/home.html");
//     } else if (user.rol === "ADMIN") {
//       navigate("/src/pages/admin/adminHome.html");
//     }
//   }
// }

export function guard(requiredRole?: "ADMIN" | "USUARIO"): boolean {
  const user = JSON.parse(localStorage.getItem("ACTIVE_USER") || "null");

  if (!user) {
    window.location.replace("/src/pages/auth/login/login.html");
    return false;
  }

  if (requiredRole && user.rol !== requiredRole) {
    if (user.rol === "USUARIO") {
      window.location.replace("/src/pages/store/home/home.html");
    } else if (user.rol === "ADMIN") {
      window.location.replace("/src/pages/admin/adminHome.html");
    }
    return false;
  }

  return true; // pasó el guard
}


