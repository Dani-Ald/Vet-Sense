// Importar la instancia de Firestore desde la configuración central
import { db } from "./firebase-config.js";

// Importar las funciones necesarias de Firestore desde el CDN modular
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

// Seleccionar el formulario del DOM
const formulario = document.getElementById("contactoForm");

// Escuchar el evento submit
formulario.addEventListener("submit", async (e) => {
    // Evitar la recarga de la página
    e.preventDefault();

    // Capturar los valores de los 4 campos
    const nombre  = document.getElementById("contactoNombre").value.trim();
    const email   = document.getElementById("contactoEmail").value.trim();
    const opcion  = document.getElementById("contactoOpcion").value;
    const mensaje = document.getElementById("contactoMensaje").value.trim();

    try {
        // Guardar el documento en la colección "mensajes_contacto"
        await addDoc(collection(db, "mensajes_contacto"), {
            nombre,
            email,
            opcion,
            mensaje,
            fecha: new Date()
        });

        // Confirmación al usuario
        alert("¡Gracias por tu interés! Hemos recibido tu mensaje y el equipo de VetSense te contactará pronto.");

        // Limpiar el formulario
        formulario.reset();

    } catch (error) {
        // Informar al usuario si hubo un fallo
        alert("Hubo un error al enviar tu mensaje: " + error.message);
    }
});
