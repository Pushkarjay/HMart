document.addEventListener("DOMContentLoaded", async () => {
  const token = getToken();
  const welcome = document.getElementById("welcome");
  const logoutBtn = document.getElementById("logout");

  if (!token) {
    redirect("/index.html");
    return;
  }

  welcome.textContent = "Loading your dashboard...";
  try {
    const response = await fetch("/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (data.success) {
      welcome.textContent = `Welcome, ${data.user.name}! (Email: ${data.user.email})`;
    } else {
      removeToken();
      showNotification("Session expired. Please log in again.", "error");
      setTimeout(() => redirect("/index.html"), 2000);
    }
  } catch (error) {
    removeToken();
    showNotification("Failed to load dashboard. Redirecting...", "error");
    setTimeout(() => redirect("/index.html"), 2000);
  }

  logoutBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to log out?")) {
      removeToken();
      showNotification("Logged out successfully!", "success");
      setTimeout(() => redirect("/index.html"), 1000);
    }
  });

  function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === "success" ? "check-circle" : "exclamation-circle"}"></i>
      <span>${message}</span>
      <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add("show"), 10);
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
});