import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

// ─── Elementos ─────────────────────────────────────────
const loginForm      = document.getElementById("loginForm");
const resetForm      = document.getElementById("resetForm");
const vistaLogin     = document.getElementById("vistaLogin");
const vistaReset     = document.getElementById("vistaReset");
const btnShowReset   = document.getElementById("btnShowReset");
const btnBackToLogin = document.getElementById("btnBackToLogin");
const togglePw       = document.getElementById("togglePw");
const loginError     = document.getElementById("loginError");
const resetError     = document.getElementById("resetError");
const resetSuccess   = document.getElementById("resetSuccess");

// ─── Toggle contraseña visible ─────────────────────────
togglePw.addEventListener("click", () => {
    const input = document.getElementById("loginPassword");
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    togglePw.setAttribute("aria-label", isHidden ? "Ocultar contraseña" : "Mostrar contraseña");
});

// ─── Cambio de vista ───────────────────────────────────
btnShowReset.addEventListener("click", () => {
    vistaLogin.style.display = "none";
    vistaReset.style.display = "block";
    loginError.hidden = true;
});

btnBackToLogin.addEventListener("click", () => {
    vistaReset.style.display = "none";
    vistaLogin.style.display = "block";
    resetError.hidden = true;
    resetSuccess.hidden = true;
});

// ─── Mensajes de error legibles ────────────────────────
function errorMsg(code) {
    const map = {
        "auth/user-not-found": "No existe una cuenta con ese correo.",
        "auth/wrong-password": "Contraseña incorrecta.",
        "auth/invalid-credential": "Credenciales incorrectas. Verifica tu correo y contraseña.",
        "auth/invalid-email": "El formato del correo no es válido.",
        "auth/too-many-requests": "Demasiados intentos. Intenta de nuevo más tarde.",
        "auth/user-disabled": "Esta cuenta ha sido deshabilitada.",
        "auth/missing-password": "Ingresa tu contraseña.",
    };
    return map[code] || "Error al iniciar sesión. Intenta de nuevo.";
}

// ─── Login ─────────────────────────────────────────────
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.hidden = true;

    const email    = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const submitBtn = document.getElementById("loginSubmitBtn");

    submitBtn.disabled = true;
    submitBtn.textContent = "Verificando…";

    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);

        if (!userCred.user.emailVerified) {
            loginError.textContent = "Tu correo aún no está verificado. Revisa tu bandeja de entrada o Spam.";
            loginError.hidden = false;
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span class="btn__dot" aria-hidden="true"></span> Acceder al Monitoreo';
            return;
        }

        // ✓ Login exitoso → redirigir
        window.location.href = "Monitoreo.html";

    } catch (error) {
        loginError.textContent = errorMsg(error.code);
        loginError.hidden = false;
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="btn__dot" aria-hidden="true"></span> Acceder al Monitoreo';
    }
});

// ─── Restablecer contraseña ────────────────────────────
resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    resetError.hidden = true;
    resetSuccess.hidden = true;

    const email = document.getElementById("resetEmail").value.trim();

    try {
        await sendPasswordResetEmail(auth, email);
        resetSuccess.textContent = "✓ Enlace enviado. Revisa tu bandeja de entrada.";
        resetSuccess.hidden = false;
    } catch (error) {
        const map = {
            "auth/user-not-found": "No existe una cuenta con ese correo.",
            "auth/invalid-email": "El formato del correo no es válido.",
            "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
        };
        resetError.textContent = map[error.code] || "Error al enviar el enlace. Intenta de nuevo.";
        resetError.hidden = false;
    }
});