document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form")
    const errorMessage = document.getElementById("error-message")
    const errorText = document.getElementById("error-text")
    const successMessage = document.getElementById("success-message")
    const successText = document.getElementById("success-text")
    const passwordToggles = document.querySelectorAll(".password-toggle")
    const rememberMeCheckbox = document.getElementById("remember-me")
  
    // Password visibility toggle
    passwordToggles.forEach((toggle) => {
      toggle.addEventListener("click", function () {
        const passwordInput = this.previousElementSibling
        const icon = this.querySelector("i")
  
        if (passwordInput.type === "password") {
          passwordInput.type = "text"
          icon.classList.remove("fa-eye")
          icon.classList.add("fa-eye-slash")
        } else {
          passwordInput.type = "password"
          icon.classList.remove("fa-eye-slash")
          icon.classList.add("fa-eye")
        }
      })
    })
  
    // Check for saved credentials
    function checkSavedCredentials() {
      const savedEmail = localStorage.getItem("hmart_email")
      const savedRememberMe = localStorage.getItem("hmart_remember_me")
  
      if (savedEmail && savedRememberMe === "true") {
        document.getElementById("email").value = savedEmail
        document.getElementById("remember-me").checked = true
      }
    }
  
    checkSavedCredentials()
  
    // Form submission
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
  
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const rememberMe = document.getElementById("remember-me").checked
  
      // Basic validation
      if (!email || !password) {
        showError("Please fill in all fields")
        return
      }
  
      // Email validation
      if (!validateEmail(email)) {
        showError("Please enter a valid email address")
        return
      }
  
      // Save credentials if remember me is checked
      if (rememberMe) {
        localStorage.setItem("hmart_email", email)
        localStorage.setItem("hmart_remember_me", "true")
      } else {
        localStorage.removeItem("hmart_email")
        localStorage.removeItem("hmart_remember_me")
      }
  
      // Simulate login API call
      showSuccess("Login successful! Redirecting...")
  
      // Simulate successful login and redirect
      setTimeout(() => {
        // Save user session
        sessionStorage.setItem(
          "hmart_user",
          JSON.stringify({
            id: "123456",
            name: "John Doe",
            email: email,
            avatar: "https://via.placeholder.com/100",
            hostel: "KP-1",
            room: "302",
          }),
        )
  
        window.location.href = "dashboard.html"
      }, 1500)
    })
  
    // Helper functions
    function showError(message) {
      errorText.textContent = message
      errorMessage.style.display = "flex"
      successMessage.style.display = "none"
  
      // Auto hide after 5 seconds
      setTimeout(() => {
        errorMessage.style.display = "none"
      }, 5000)
    }
  
    function showSuccess(message) {
      successText.textContent = message
      successMessage.style.display = "flex"
      errorMessage.style.display = "none"
    }
  
    function validateEmail(email) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(email).toLowerCase())
    }
  })
  
  