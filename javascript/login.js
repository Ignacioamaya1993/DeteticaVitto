import app from "../javascript/firebaseConfig.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

const auth = getAuth(app);

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

function resetCustomValidity(input) {
    input.setCustomValidity(""); 
    input.reportValidity(); 
}

emailInput.addEventListener("input", () => resetCustomValidity(emailInput));
passwordInput.addEventListener("input", () => resetCustomValidity(passwordInput));

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email) {
        emailInput.setCustomValidity("Por favor, completa este campo.");
        emailInput.reportValidity();
        return;
    }

    if (!password) {
        passwordInput.setCustomValidity("Por favor, completa este campo.");
        passwordInput.reportValidity();
        return;
    }

    resetCustomValidity(emailInput);
    resetCustomValidity(passwordInput);

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
            await auth.signOut();
            Swal.fire({
                icon: "warning",
                title: "Correo no verificado",
                text: "Por favor, verifica tu correo antes de iniciar sesión.",
                confirmButtonColor: "#6f42c1",
                customClass: {
                    popup: 'custom-popup',
                },
            });
            return;
        }

        // Guardar datos mínimos del usuario
        const currentUser = {
            isLoggedIn: true,
            email: user.email,
            uid: user.uid,
        };
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        window.location.href = "mi-cuenta.html";

    } catch (error) {
        console.error("Error al iniciar sesión:", error);

        let errorMessage = "Ocurrió un error desconocido. Por favor, inténtalo de nuevo.";

        switch (error.code) {
            case "auth/invalid-credential":
                errorMessage = "Las credenciales proporcionadas son incorrectas.";
                break;
            case "auth/user-not-found":
                errorMessage = `No existe una cuenta registrada con el correo: ${email}`;
                break;
            case "auth/wrong-password":
                errorMessage = "La contraseña es incorrecta.";
                break;
            default:
                console.warn("Error no controlado:", error.code);
        }

        Swal.fire({
            icon: "error",
            title: "Error al Iniciar Sesión",
            text: errorMessage,
            confirmButtonColor: "#6f42c1",
            customClass: {
                popup: 'custom-popup',
                title: 'custom-title',
                content: 'custom-content',
            },
        });
    }
});

// Mostrar/ocultar contraseña
function togglePasswordVisibility() {
    const passwordType = passwordInput.getAttribute("type");
    passwordInput.setAttribute(
        "type",
        passwordType === "password" ? "text" : "password"
    );

    const toggleIcon = document.querySelector(".toggle-password i");
    toggleIcon.classList.toggle("fa-eye");
    toggleIcon.classList.toggle("fa-eye-slash");
}

window.togglePasswordVisibility = togglePasswordVisibility;

// Recuperación de contraseña
const forgotPasswordLink = document.getElementById("forgotPassword");

forgotPasswordLink.addEventListener("click", async () => {
    const { value: email } = await Swal.fire({
        title: "Recuperar contraseña",
        input: "email",
        inputLabel: "Ingresa tu correo electrónico",
        inputPlaceholder: "ejemplo@correo.com",
        confirmButtonText: "Enviar",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        inputValidator: (value) => {
            if (!value) {
                return "¡Debes ingresar un correo!";
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return "Por favor, ingresa un correo válido.";
            }
        },
        customClass: {
            popup: 'custom-popup',
        },
    });

    if (email) {
        try {
            await sendPasswordResetEmail(auth, email);
            Swal.fire({
                icon: "success",
                title: "Correo enviado",
                html: `<p class="swal-text">Hemos enviado un enlace para recuperar tu contraseña. Revisa tu bandeja de entrada.</p>`,
                confirmButtonColor: "#6f42c1",
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    content: 'custom-content',
                },
            });
        } catch (error) {
            console.error("Error al enviar el correo de recuperación:", error);
            let message = "Hubo un problema al procesar tu solicitud. Intenta nuevamente más tarde.";
            if (error.code === "auth/user-not-found") {
                message = `No existe una cuenta registrada con el correo: ${email}`;
            }
            Swal.fire({
                icon: "error",
                title: "Error",
                text: message,
                confirmButtonColor: "#6f42c1",
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    content: 'custom-content',
                },
            });
        }
    }
});
