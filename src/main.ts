import { getActiveUser } from "./utils/auth";
import { navigate } from "./utils/navigate";

export function guard(requiredRole?: "ADMIN" | "USUARIO"): boolean {

  const user= getActiveUser();

  if (!user) {
    navigate(("/src/pages/auth/login/login.html"));
    return false;
  }

  if (requiredRole && user.rol !== requiredRole) {
    // Si el rol no coincide, lo mando a su home correcto
    if (user.rol === "USUARIO") {
      navigate("/src/pages/store/home/home.html");
    } else if (user.rol === "ADMIN") {
      navigate("/src/pages/admin/adminHome.html");
    }
    return false;
  }

  return true; // pasó el guard
}

