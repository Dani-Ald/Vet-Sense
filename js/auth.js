import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const form = document.getElementById("registroForm");
const seccionVerificacion = document.getElementById("seccion-verificacion");
const loginRapidoForm = document.getElementById("loginRapidoForm");
const titulo = document.querySelector(".registro-card h2");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;

        // 👤 Inyectar nombre en el perfil de Auth
        await updateProfile(user, { displayName: nombre });

        // 🔥 Guardar SOLO lo necesario
        await setDoc(doc(db, "usuarios", user.uid), {
            nombre: nombre,
            email: email.toLowerCase()
        });

        // 📧 Verificación de correo (ya incluye el nombre)
        await sendEmailVerification(user);

        // Mostrar sección de verificación
        form.style.display = "none";
        if (titulo) titulo.style.display = "none";
        seccionVerificacion.style.display = "block";
        document.getElementById("loginEmail").value = email;

    } catch (error) {
        alert(error.message);
    }
});

if (loginRapidoForm) {
    loginRapidoForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);

            if (!userCred.user.emailVerified) {
                alert("Por favor revisa tu bandeja de entrada o Spam y verifica tu correo electrónico antes de acceder.");
                return;
            }

            window.location.href = "Monitoreo.html";
        } catch (error) {
            alert("Credenciales incorrectas o error al iniciar sesión: " + error.message);
        }
    });
}