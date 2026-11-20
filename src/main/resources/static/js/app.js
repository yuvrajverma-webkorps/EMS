
const API_URL = "/api";

// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const message = document.getElementById("message");

        try {

            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error("Invalid email or password");
            }

            localStorage.setItem("jwtToken", data.token);
            localStorage.setItem("userEmail", data.email);
            localStorage.setItem("userRole", data.role);

            window.location.href = "/home";

        } catch (error) {

            message.textContent = error.message;
            message.className = "message error";

        }

    });

}


// REGISTRATION
const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const message = document.getElementById("message");

        try {

            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.text();

            if (!response.ok) {
                throw new Error(data || "Registration failed");
            }

            message.textContent = "Registration successful! Redirecting to login...";
            message.className = "message success";

            setTimeout(() => {
                window.location.href = "/login";
            }, 1500);

        } catch (error) {

            message.textContent = error.message;
            message.className = "message error";

        }

    });

}


// HOME DASHBOARD
const serverResponse = document.getElementById("serverResponse");

if (serverResponse) {

    const token = localStorage.getItem("jwtToken");

    if (!token) {
        window.location.href = "/login";
    } else {

        document.getElementById("userEmail").textContent =
            localStorage.getItem("userEmail") || "User";

        const role = localStorage.getItem("userRole") || "USER";

        document.getElementById("userRole").textContent = role;
        document.getElementById("roleDisplay").textContent = role;

        fetch(`${API_URL}/test/user`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(async response => {

                if (!response.ok) {
                    throw new Error("Authentication failed. Please login again.");
                }

                return response.text();

            })
            .then(data => {

                document.getElementById("authStatus").textContent =
                    "Authenticated";

                serverResponse.textContent = data;

            })
            .catch(error => {

                localStorage.removeItem("jwtToken");
                localStorage.removeItem("userEmail");
                localStorage.removeItem("userRole");

                alert(error.message);
                window.location.href = "/login";

            });

    }

}


// LOGOUT
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function() {

        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");

        window.location.href = "/login";

    });

}
