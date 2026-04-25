import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "./Login.html";
        return;
    }

    // ── Mostrar nombre en navbar ──
    const nombre = user.displayName || user.email.split("@")[0];

    const welcomeEl = document.getElementById("navWelcome");
    if (welcomeEl) {
        welcomeEl.textContent = "Hola, " + nombre;
    }

    // ── Actualizar título principal del panel ──
    const titleEl = document.getElementById("welcomeTitle");
    if (titleEl) {
        titleEl.innerHTML = "Bienvenido al Panel, <em>" + nombre + "</em>";
    }
});

// ── Cerrar sesión ──
const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = "./Login.html";
    });
}