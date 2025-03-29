document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (data.success && data.token) {
          setToken(data.token);
          redirect("/dashboard.html");
        } else {
          document.getElementById("error-message").style.display = "block";
          document.getElementById("error-text").textContent = data.message || "Login failed";
        }
      } catch (error) {
        console.error("Error:", error);
        document.getElementById("error-message").style.display = "block";
        document.getElementById("error-text").textContent = "Login failed: An unexpected error occurred.";
      }
    });

    document.querySelectorAll(".password-toggle").forEach(button => {
      button.addEventListener("click", () => {
        const input = button.previousElementSibling;
        if (input.type === "password") {
          input.type = "text";
          button.innerHTML = '<i class="far fa-eye-slash"></i>';
        } else {
          input.type = "password";
          button.innerHTML = '<i class="far fa-eye"></i>';
        }
      });
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const fullName = document.getElementById("full-name").value;
      const email = document.getElementById("email").value;
      const hostel = document.getElementById("hostel-select").value;
      const roomNumber = document.getElementById("room-number").value;
      const whatsappNumber = document.getElementById("whatsapp-number").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      if (password !== confirmPassword) {
        document.getElementById("error-message").style.display = "block";
        document.getElementById("error-text").textContent = "Passwords do not match";
        return;
      }

      try {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name: fullName, hostel, roomNumber, whatsappNumber }),
        });
        const data = await response.json();
        if (data.success && data.token) {
          setToken(data.token);
          redirect("/dashboard.html");
        } else {
          document.getElementById("error-message").style.display = "block";
          document.getElementById("error-text").textContent = data.message || "Signup failed";
        }
      } catch (error) {
        console.error("Error:", error);
        document.getElementById("error-message").style.display = "block";
        document.getElementById("error-text").textContent = "Signup failed: An unexpected error occurred.";
      }
    });

    document.querySelectorAll(".password-toggle").forEach(button => {
      button.addEventListener("click", () => {
        const input = button.previousElementSibling;
        if (input.type === "password") {
          input.type = "text";
          button.innerHTML = '<i class="far fa-eye-slash"></i>';
        } else {
          input.type = "password";
          button.innerHTML = '<i class="far fa-eye"></i>';
        }
      });
    });
  }
});