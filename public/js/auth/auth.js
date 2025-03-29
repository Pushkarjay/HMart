// E:\HMart\public\js\auth\auth.js
function setToken(token) {
  localStorage.setItem("hmart_token", token);
}

function getToken() {
  return localStorage.getItem("hmart_token");
}

function removeToken() {
  localStorage.removeItem("hmart_token");
}

async function loginUser(email, password) {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log("Login response status:", response.status); // Debug
    const data = await response.json();
    console.log("Login response data:", data); // Debug

    if (response.ok && data.success && data.token) {
      setToken(data.token);
      return { success: true, token: data.token };
    } else {
      throw new Error(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

async function signupUser(fullName, email, hostel, roomNumber, whatsappNumber, password, confirmPassword) {
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  try {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name: fullName, hostel, roomNumber, whatsappNumber }),
    });

    console.log("Signup response status:", response.status); // Debug
    const data = await response.json();
    console.log("Signup response data:", data); // Debug

    if (response.ok && data.success && data.token) {
      setToken(data.token);
      return { success: true, token: data.token };
    } else {
      throw new Error(data.message || "Signup failed");
    }
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}

// Export for global use in inline scripts
window.setToken = setToken;
window.getToken = getToken;
window.removeToken = removeToken;
window.loginUser = loginUser;
window.signupUser = signupUser;