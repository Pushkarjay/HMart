// Example for profile.js
document.addEventListener("DOMContentLoaded", async () => {
  const token = getToken();
  if (!token) {
    redirect("/login.html");
    return;
  }

  try {
    const response = await fetch("/api/user", {
      headers: { "Authorization": `Bearer ${token}` },
    });
    const data = await response.json();
    if (!data.success) throw new Error("Failed to fetch user data");
    const user = data.user;
    updateUserInfo(user);
    // Rest of the code...
  } catch (error) {
    showNotification(`Error: ${error.message}`, "error");
    redirect("/login.html");
  }
});