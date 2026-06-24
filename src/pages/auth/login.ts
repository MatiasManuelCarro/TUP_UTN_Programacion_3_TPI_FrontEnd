import { getStoredAuthUsers } from "../../utils/auth";
import { getUsers } from "../../utils/fetch";
import { initBaseData } from "../../utils/localStorage";
import { navigate } from "../../utils/navigate";

document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("login-form") as HTMLFormElement;
    const inputEmail = document.getElementById("email") as HTMLInputElement;
    const inputPassword = document.getElementById("password") as HTMLInputElement;
    const errorDiv = document.getElementById("error") as HTMLDivElement;

    await initBaseData();


    form.addEventListener("submit", handleLogin);


async function handleLogin(e: SubmitEvent) {
        e.preventDefault();

        const userEmail = inputEmail.value.trim().toLowerCase();
        const userPassword = inputPassword.value;

        errorDiv.textContent = "";
        errorDiv.style.display = "none";


        //busca primero usuarios en localstorage (creados en register)
        const authUsers = getStoredAuthUsers();
        let user = authUsers.find(u => u.mail.toLowerCase() === userEmail);

        //Si no está, usa fecth para el json
        if (!user) {
            const jsonUsers = await getUsers();
            user = jsonUsers.find(u => u.mail.toLowerCase() === userEmail);
        }

        if (!user) {
            errorDiv.textContent = "No existe un usuario con ese email.";
            errorDiv.style.display = "block";
            return;
        }

        if (user.password !== userPassword) {
            errorDiv.textContent = "Contraseña incorrecta.";
            errorDiv.style.display = "block";
            return;
        }

        // Guardar usuario logeado sin clave en "ACTIVE_USER"
        const { password: _, ...safeUser } = user;
        localStorage.setItem("ACTIVE_USER", JSON.stringify({ ...safeUser, loggedIn: true }));

        // Redirección por rol
        if (user.rol === "ADMIN") {
            navigate("/src/pages/admin/adminHome.html");
        } else if(user.rol === "USUARIO") {
            navigate("/src/pages/store/home/home.html");
        }
    }
});