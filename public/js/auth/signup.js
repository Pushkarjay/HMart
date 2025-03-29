signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const fullName = document.getElementById("full-name").value;
  const hostel = hostelSelect.value === "other" ? document.getElementById("other-hostel").value : hostelSelect.value;
  const roomNumber = document.getElementById("room-number").value;
  const whatsappNumber = document.getElementById("whatsapp-number").value;
  const termsChecked = document.getElementById("terms").checked;

  if (!whatsappNumber || !termsChecked) {
    showError("Please complete all fields and agree to terms");
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
      showSuccess("Account created successfully! Redirecting...");
      setTimeout(() => redirect("/dashboard.html"), 2000);
    } else {
      showError(data.message || "Signup failed");
    }
  } catch (error) {
    showError("Signup failed: An unexpected error occurred.");
  }
});