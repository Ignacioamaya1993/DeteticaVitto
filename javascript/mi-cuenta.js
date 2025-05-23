import app from "../javascript/firebaseConfig.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    const datosUsuarioDiv = document.getElementById("datos-usuario");
    const seccionPedidosDiv = document.getElementById("mis-pedidos");

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const { email, uid } = user;
            const docRef = doc(db, "usuarios", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                const nombreCompleto = `${data.nombre || ""} ${data.apellido || ""}`.trim();
                const direccion = data.direccion || "";

                datosUsuarioDiv.innerHTML = `
                    <h2>Mis datos</h2>
                    <p><strong>Nombre:</strong> ${nombreCompleto}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <label for="direccion-input"><strong>Dirección:</strong></label>
                    <div class="direccion-editable">
                        <input type="text" id="direccion-input" value="${direccion}" readonly />
                        <i class="fas fa-pen edit-icon" title="Editar dirección"></i>
                        <i class="fas fa-times cancel-icon" title="Cancelar edición" style="display:none; margin-left: 8px;"></i>
                    </div>
                    <div style="margin-top: 1rem;">
                        <button id="guardar-cambios" style="display:none;">Guardar</button>
                    </div>
                `;

                const direccionInput = document.getElementById("direccion-input");
                const editIcon = document.querySelector(".edit-icon");
                const cancelIcon = document.querySelector(".cancel-icon");
                const guardarBtn = document.getElementById("guardar-cambios");

                let direccionOriginal = direccion;

                editIcon.addEventListener("click", () => {
                    direccionInput.removeAttribute("readonly");
                    direccionInput.focus();
                    guardarBtn.style.display = "inline-block";
                    cancelIcon.style.display = "inline-block";
                });

                cancelIcon.addEventListener("click", () => {
                    direccionInput.value = direccionOriginal;
                    direccionInput.setAttribute("readonly", true);
                    guardarBtn.style.display = "none";
                    cancelIcon.style.display = "none";
                });

                guardarBtn.addEventListener("click", async () => {
                    const nuevaDireccion = direccionInput.value.trim();

                    if (!nuevaDireccion) {
                        mostrarMensaje("Por favor ingresa una dirección válida.", "error");
                        return;
                    }

                    try {
                        await updateDoc(docRef, { direccion: nuevaDireccion });

                        direccionOriginal = nuevaDireccion;
                        direccionInput.setAttribute("readonly", true);
                        guardarBtn.style.display = "none";
                        cancelIcon.style.display = "none";

                        mostrarMensaje("Dirección actualizada correctamente.", "success");
                    } catch (error) {
                        console.error("Error al actualizar dirección:", error);
                        mostrarMensaje("Hubo un error al actualizar la dirección. Intenta de nuevo.", "error");
                    }
                });
            } else {
                mostrarMensaje("No se encontraron datos del usuario.", "error");
            }

            seccionPedidosDiv.innerHTML = `
                <h2>Mis pedidos</h2>
                <p>(Aquí se listarán tus pedidos)</p>
            `;
        } else {
            window.location.href = "login.html";
        }
    });
});

function mostrarMensaje(texto, tipo) {
    Swal.fire({
        icon: tipo,
        title: tipo === "success" ? "Éxito" : "Error",
        text: texto,
        confirmButtonText: "Aceptar",
        customClass: {
            popup: "custom-popup",
            title: "custom-title",
            content: "custom-content",
        },
    });
}

/*
const cerrarSesionLink = document.getElementById("cerrar-sesion-link");

if (cerrarSesionLink) {
  cerrarSesionLink.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await auth.signOut();
      window.location.href = "login.html";
    } catch (error) {
      mostrarMensaje("No se pudo cerrar sesión. Intenta nuevamente.", "error");
    }
  });
}*/
