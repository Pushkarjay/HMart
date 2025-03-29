loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const rememberMe = document.getElementById("remember-me").checked;

  if (!email || !password || !validateEmail(email)) {
    showError("Please enter a valid email and password");
    return;
  }

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.success && data.token) {
      setToken(data.token);
      if (rememberMe) {
        localStorage.setItem("hmart_email", email);
        localStorage.setItem("hmart_remember_me", "true");
      } else {
        localStorage.removeItem("hmart_email");
        localStorage.removeItem("hmart_remember_me");
      }
      redirect("/dashboard.html");
    } else {
      showError(data.message || "Login failed");
    }
  } catch (error) {
    showError("Login failed: An unexpected error occurred.");
  }
});