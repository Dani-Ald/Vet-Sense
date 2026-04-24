// Importaciones
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

// Configuración (TU CÓDIGO)
const firebaseConfig = {
    apiKey: "AIzaSyB7kVIX9_h_2Jy5J8QAxkp0M8uKMkpiR64",
    authDomain: "vetsense-8c0bd.firebaseapp.com",
    projectId: "vetsense-8c0bd",
    storageBucket: "vetsense-8c0bd.firebasestorage.app",
    messagingSenderId: "538018140482",
    appId: "1:538018140482:web:fd8e24772800eafba0f8db",
    measurementId: "G-X0SYQFQZ4G"
};

// Inicializar
const app = initializeApp(firebaseConfig);

// Exportar para usar en otros archivos
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);