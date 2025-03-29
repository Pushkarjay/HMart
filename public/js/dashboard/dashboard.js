document.addEventListener("DOMContentLoaded", async () => {
  const token = getToken();
  const welcome = document.getElementById("welcome");
  const logoutBtn = document.getElementById("logout");

  if (!token) {
    redirect("/index.html");
    return;
  }

  try {
    const response = await fetch("/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (data.success) {
      welcome.textContent = `Welcome, ${data.user.name}! (Email: ${data.user.email})`;
    } else {
      removeToken();
      redirect("/index.html");
    }
  } catch (error) {
    removeToken();
    redirect("/index.html");
  }

  logoutBtn.addEventListener("click", () => {
    removeToken();
    redirect("/index.html");
  });
});