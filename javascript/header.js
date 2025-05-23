import app from "../javascript/firebaseConfig.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  const cerrarSesion = document.getElementById("cerrar-sesion-link");
  const cuentaItem = document.querySelector(".menu-cuenta");

  if (cerrarSesion) {
    cerrarSesion.addEventListener("click", async (e) => {
      e.preventDefault();
      console.log("Clic en cerrar sesión");
      try {
        await signOut(auth);
        console.log("Sesión cerrada correctamente");
        window.location.href = "login.html";
      } catch (error) {
        console.error("Error al cerrar sesión", error);
        alert("Error al cerrar sesión.");
      }
    });
  }

  onAuthStateChanged(auth, user => {
    if (!user && cuentaItem) {
      cuentaItem.remove();
    }
  });
});