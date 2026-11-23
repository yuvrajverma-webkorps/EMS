
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






// --------------------------------------------------------------------
// EMPLOYEE CRUD

const employeeForm = document.getElementById("employeeForm");
const employeeFormContainer = document.getElementById("employeeFormContainer");
const employeeTableBody = document.getElementById("employeeTableBody");
const employeeMessage = document.getElementById("employeeMessage");
const addEmployeeBtn = document.getElementById("addEmployeeBtn");
const cancelEmployeeBtn = document.getElementById("cancelEmployeeBtn");

function getToken() {
    return localStorage.getItem("jwtToken");
}

function showEmployeeMessage(message, isError = false) {
    if (!employeeMessage) return;

    employeeMessage.textContent = message;
    employeeMessage.style.color = isError ? "red" : "green";
}

function resetEmployeeForm() {
    if (!employeeForm) return;

    employeeForm.reset();
    document.getElementById("employeeId").value = "";
    document.getElementById("employeeFormTitle").textContent = "Add Employee";
}

function showEmployeeForm() {
    employeeFormContainer.classList.remove("hidden");
}

function hideEmployeeForm() {
    employeeFormContainer.classList.add("hidden");
    resetEmployeeForm();
}

async function loadEmployees() {
    if (!employeeTableBody) return;

    try {
        const response = await fetch(`${API_URL}/employees`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch employees");
        }

        const employees = await response.json();

        employeeTableBody.innerHTML = "";

        if (employees.length === 0) {
            employeeTableBody.innerHTML = `
                <tr>
                    <td colspan="6">No employees found.</td>
                </tr>`;
            return;
        }

        employees.forEach(employee => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${employee.id}</td>
                <td>${escapeHTML(employee.name)}</td>
                <td>${escapeHTML(employee.email)}</td>
                <td>${escapeHTML(employee.department)}</td>
                <td>${employee.salary}</td>
                <td>
                    <button class="edit-btn" data-id="${employee.id}">Edit</button>
                    <button class="delete-btn" data-id="${employee.id}">Delete</button>
                </td>
            `;

            employeeTableBody.appendChild(row);
        });

    } catch (error) {
        showEmployeeMessage(error.message, true);
    }
}

// Protect against HTML injection when displaying user-entered data
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[character]));
}

// Open Add Employee form
if (addEmployeeBtn) {
    addEmployeeBtn.addEventListener("click", () => {
        resetEmployeeForm();
        showEmployeeForm();
    });
}

// Cancel form
if (cancelEmployeeBtn) {
    cancelEmployeeBtn.addEventListener("click", hideEmployeeForm);
}

// Create and Update
if (employeeForm) {
    employeeForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const id = document.getElementById("employeeId").value;

        const employee = {
            name: document.getElementById("employeeName").value.trim(),
            email: document.getElementById("employeeEmail").value.trim(),
            department: document.getElementById("employeeDepartment").value.trim(),
            salary: Number(document.getElementById("employeeSalary").value)
        };

        const url = id
            ? `${API_URL}/employees/${id}`
            : `${API_URL}/employees`;

        const method = id ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                body: JSON.stringify(employee)
            });

            if (!response.ok) {
                throw new Error("Unable to save employee");
            }

            showEmployeeMessage(id
                ? "Employee updated successfully."
                : "Employee created successfully.");

            hideEmployeeForm();
            await loadEmployees();

        } catch (error) {
            showEmployeeMessage(error.message, true);
        }
    });
}

// Edit / Delete buttons
if (employeeTableBody) {
    employeeTableBody.addEventListener("click", async (event) => {

        const id = event.target.dataset.id;

        // Edit
        if (event.target.classList.contains("edit-btn")) {
            try {
                const response = await fetch(`${API_URL}/employees/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${getToken()}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Unable to retrieve employee");
                }

                const employee = await response.json();

                document.getElementById("employeeId").value = employee.id;
                document.getElementById("employeeName").value = employee.name;
                document.getElementById("employeeEmail").value = employee.email;
                document.getElementById("employeeDepartment").value = employee.department;
                document.getElementById("employeeSalary").value = employee.salary;

                document.getElementById("employeeFormTitle").textContent = "Edit Employee";

                showEmployeeForm();

            } catch (error) {
                showEmployeeMessage(error.message, true);
            }
        }

        // Delete
        if (event.target.classList.contains("delete-btn")) {
            const confirmed = confirm("Are you sure you want to delete this employee?");

            if (!confirmed) return;

            try {
                const response = await fetch(`${API_URL}/employees/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${getToken()}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Unable to delete employee");
                }

                showEmployeeMessage("Employee deleted successfully.");
                await loadEmployees();

            } catch (error) {
                showEmployeeMessage(error.message, true);
            }
        }
    });
}

// Load employees when the dashboard loads
if (employeeTableBody) {
    loadEmployees();
}