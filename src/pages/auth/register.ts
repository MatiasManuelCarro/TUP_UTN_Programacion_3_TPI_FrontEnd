import type { IUser } from "../../types/users";
import { registerUser } from "../../utils/auth";

const form = document.getElementById("register-form") as HTMLFormElement;
const errorDiv = document.getElementById("error") as HTMLDivElement;

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = (document.getElementById("name") as HTMLInputElement).value.trim();
    const apellido = (document.getElementById("surname") as HTMLInputElement).value.trim();
    const mail = (document.getElementById("email") as HTMLInputElement).value.trim();
    const celular = (document.getElementById("phone") as HTMLInputElement).value.trim();
    const password = (document.getElementById("password") as HTMLInputElement).value.trim();

    if (!nombre || !apellido || !mail || !celular || !password) {
        errorDiv.textContent = "Todos los campos son obligatorios.";
        return;
    }

    const nuevoUsuario: IUser & { password: string } = {
        id: 0,
        nombre,
        apellido,
        mail,
        celular,
        password,
        rol: "USUARIO"
    };

    const error = await registerUser(nuevoUsuario);

    if (error) {
        errorDiv.textContent = error;
        return;
    }
    alert("Usuario creado correctamente");
    window.location.href = "/src/pages/auth/login.html";
});
