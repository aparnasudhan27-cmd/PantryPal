/* =========================================
   PantryPal - Member 4: login-aware nav + auth forms
   Add <script src="auth.js"></script> before </body> on every page.
========================================= */

(async function setupNav() {
    const nav = document.querySelector(".nav-links");
    if (!nav) return;

    let session = { loggedIn: false };

    try {
        const response = await fetch("session_status.php");
        session = await response.json();
    } catch (error) {
        console.error("Could not check login status:", error);
    }

    function addLink(text, href, className) {
        const link = document.createElement("a");
        link.textContent = text;
        link.href = href;
        if (className) link.className = className;
        nav.appendChild(link);
    }

    if (session.loggedIn) {
        addLink("My Recipes", "my-recipes.html");
        if (session.role === "admin") addLink("Admin", "admin.html");
        addLink("Log out (" + session.username + ")", "logout.php", "nav-logout");
    } else {
        addLink("Login", "login.html");
        addLink("Register", "register.html");
    }

    // Add Recipe page: logged-out visitors see a prompt instead of the form
    const addForm = document.querySelector('.add-recipe form[action="add_recipe.php"]');

    if (addForm && !session.loggedIn) {
        const notice = document.createElement("p");
        notice.className = "login-required";
        notice.append("Log in to add your own recipes. ");

        const login = document.createElement("a");
        login.href = "login.html";
        login.textContent = "Log in";

        const register = document.createElement("a");
        register.href = "register.html";
        register.textContent = "create an account";

        notice.append(login, " or ", register, ".");
        addForm.replaceWith(notice);
    }
})();

/* Forms with data-endpoint (login, register, edit recipe) submit with fetch
   and show the server's message under the form. */
document.querySelectorAll("form[data-endpoint]").forEach(form => {
    form.addEventListener("submit", async event => {
        event.preventDefault();

        const message = document.getElementById("formMessage");
        const button = form.querySelector('button[type="submit"]');

        message.textContent = "";
        message.className = "auth-message";
        button.disabled = true;

        try {
            const response = await fetch(form.dataset.endpoint, {
                method: "POST",
                body: new FormData(form)
            });
            const data = await response.json();

            message.textContent = data.message;

            if (data.ok) {
                message.className = "auth-message success";
                setTimeout(() => { window.location.href = form.dataset.redirect; }, 800);
                return;
            }

            message.className = "auth-message error";
        } catch (error) {
            message.textContent = "Could not reach the server. Please try again.";
            message.className = "auth-message error";
        }

        button.disabled = false;
    });
});
