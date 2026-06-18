// import type { IUser } from "./types/users";
// import { getActiveUser } from "./utils/localStorage";

import { getActiveUser } from "./utils/localStorage";
import { navigate } from "./utils/navigate";





// export function guard(requiredRole?: "ADMIN" | "USUARIO"): boolean {
//   // const user = JSON.parse(localStorage.getItem("ACTIVE_USER") || "null");
//   const user= getActiveUser();

//   if (!user) {
//     // window.location.replace("/src/pages/auth/login/login.html");
//     navigate(("/src/pages/auth/login/login.html"));
//     return false;
//   }

//   if (requiredRole && user.rol !== requiredRole) {
//     // Si el rol no coincide, lo mando a SU home correcto
//     if (user.rol === "USUARIO") {
//       // window.location.replace("/src/pages/store/home/home.html");
//       navigate("/src/pages/store/home/home.html");
//     } else if (user.rol === "ADMIN") {
//       // window.location.replace("/src/pages/admin/adminHome.html");
//       navigate("/src/pages/admin/adminHome.html");
//     }
//     return false;
//   }

//   return true; // pasó el guard
// }

export function guard(requiredRole?: "ADMIN" | "USUARIO"): boolean {
  const user = getActiveUser();

  if (!user) {
    navigate("/src/pages/auth/login/login.html");
    return false;
  }

  if (requiredRole && user.rol !== requiredRole) {

    // USUARIO intentando entrar a ADMIN
    if (requiredRole === "ADMIN" && user.rol === "USUARIO") {
      navigate("/src/pages/store/home/home.html");
      return false;
    }

    // ADMIN intentando entrar a algo exclusivo de USUARIO 
    if (requiredRole === "USUARIO" && user.rol === "ADMIN") {
      navigate("/src/pages/admin/adminHome/adminHome.html");
      return false;
    }
  }

  return true;
}