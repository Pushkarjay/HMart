document.addEventListener("DOMContentLoaded", () => {
    // Form elements
    const signupForm = document.getElementById("signup-form")
    const errorMessage = document.getElementById("error-message")
    const errorText = document.getElementById("error-text")
    const successMessage = document.getElementById("success-message")
    const successText = document.getElementById("success-text")
    const passwordToggles = document.querySelectorAll(".password-toggle")
  
    // Step navigation buttons
    const nextStep1Button = document.getElementById("next-step-1")
    const nextStep2Button = document.getElementById("next-step-2")
    const prevStep2Button = document.getElementById("prev-step-2")
    const prevStep3Button = document.getElementById("prev-step-3")
    const completeSignupButton = document.getElementById("complete-signup")
  
    // Step containers
    const step1 = document.getElementById("step-1")
    const step2 = document.getElementById("step-2")
    const step3 = document.getElementById("step-3")
  
    // Progress steps
    const progressSteps = document.querySelectorAll(".progress-step")
  
    // Password strength elements
    const passwordInput = document.getElementById("password")
    const confirmPasswordInput = document.getElementById("confirm-password")
    const strengthBar = document.getElementById("strength-bar")
    const strengthText = document.getElementById("strength-text")
    const passwordMatchValidation = document.getElementById("password-match-validation")
  
    // Hostel selection
    const hostelSelect = document.getElementById("hostel-select")
    const otherHostelGroup = document.getElementById("other-hostel-group")
  
    // Profile picture preview
    const profilePictureInput = document.getElementById("profile-picture-input")
    const profilePreview = document.getElementById("profile-preview")
  
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
  
    // Password strength checker
    passwordInput.addEventListener("input", function () {
      const password = this.value
      const strength = checkPasswordStrength(password)
  
      // Update strength bar
      strengthBar.style.width = `${strength.score * 25}%`
      strengthBar.className = "strength-bar"
      strengthBar.classList.add(`strength-${strength.level}`)
  
      // Update strength text
      strengthText.textContent = `Password strength: ${strength.message}`
      strengthText.className = "strength-text"
      strengthText.classList.add(`text-${strength.level}`)
  
      // Check if passwords match
      if (confirmPasswordInput.value) {
        checkPasswordsMatch()
      }
    })
  
    // Password match checker
    confirmPasswordInput.addEventListener("input", checkPasswordsMatch)
  
    function checkPasswordsMatch() {
      if (passwordInput.value === confirmPasswordInput.value) {
        passwordMatchValidation.textContent = "Passwords match"
        passwordMatchValidation.className = "validation-message text-success"
        return true
      } else {
        passwordMatchValidation.textContent = "Passwords do not match"
        passwordMatchValidation.className = "validation-message text-error"
        return false
      }
    }
  
    // Hostel selection change
    hostelSelect.addEventListener("change", function () {
      if (this.value === "other") {
        otherHostelGroup.style.display = "block"
      } else {
        otherHostelGroup.style.display = "none"
      }
    })
  
    // Profile picture upload
    profilePictureInput.addEventListener("change", function () {
      const file = this.files[0]
  
      if (file) {
        const reader = new FileReader()
  
        reader.onload = (e) => {
          profilePreview.innerHTML = `<img src="${e.target.result}" alt="Profile Preview">`
        }
  
        reader.readAsDataURL(file)
      }
    })
  
    // Step navigation
    nextStep1Button.addEventListener("click", () => {
      // Validate step 1
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const confirmPassword = document.getElementById("confirm-password").value
  
      if (!email || !password || !confirmPassword) {
        showError("Please fill in all fields")
        return
      }
  
      if (!validateEmail(email)) {
        showError("Please enter a valid email address")
        return
      }
  
      const passwordStrength = checkPasswordStrength(password)
      if (passwordStrength.score < 2) {
        showError("Please choose a stronger password")
        return
      }
  
      if (password !== confirmPassword) {
        showError("Passwords do not match")
        return
      }
  
      // Move to step 2
      step1.style.display = "none"
      step2.style.display = "block"
      updateProgressStep(2)
    })
  
    prevStep2Button.addEventListener("click", () => {
      step2.style.display = "none"
      step1.style.display = "block"
      updateProgressStep(1)
    })
  
    nextStep2Button.addEventListener("click", () => {
      // Validate step 2
      const fullName = document.getElementById("full-name").value
      const hostel = hostelSelect.value
      const otherHostel = document.getElementById("other-hostel").value
      const roomNumber = document.getElementById("room-number").value
  
      if (!fullName || !roomNumber) {
        showError("Please fill in all required fields")
        return
      }
  
      if (hostel === "") {
        showError("Please select your hostel")
        return
      }
  
      if (hostel === "other" && !otherHostel) {
        showError("Please specify your hostel")
        return
      }
  
      // Move to step 3
      step2.style.display = "none"
      step3.style.display = "block"
      updateProgressStep(3)
    })
  
    prevStep3Button.addEventListener("click", () => {
      step3.style.display = "none"
      step2.style.display = "block"
      updateProgressStep(2)
    })
  
    // Form submission
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault()
  
      // Validate step 3
      const whatsappNumber = document.getElementById("whatsapp-number").value
      const termsChecked = document.getElementById("terms").checked
  
      if (!whatsappNumber) {
        showError("Please enter your WhatsApp number")
        return
      }
  
      if (!termsChecked) {
        showError("You must agree to the Terms of Service and Privacy Policy")
        return
      }
  
      // Simulate signup API call
      showSuccess("Account created successfully! Redirecting to login...")
  
      // Redirect to login page after successful signup
      setTimeout(() => {
        window.location.href = "login.html"
      }, 2000)
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
  
    function checkPasswordStrength(password) {
      let score = 0
  
      // Length check
      if (password.length >= 8) score++
      if (password.length >= 12) score++
  
      // Complexity checks
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
      if (/\d/.test(password)) score++
      if (/[^a-zA-Z0-9]/.test(password)) score++
  
      // Determine strength level and message
      let level, message
  
      switch (score) {
        case 0:
        case 1:
          level = "weak"
          message = "Weak"
          break
        case 2:
          level = "medium"
          message = "Medium"
          break
        case 3:
          level = "good"
          message = "Good"
          break
        case 4:
        case 5:
          level = "strong"
          message = "Strong"
          break
      }
  
      return {
        score: score,
        level: level,
        message: message,
      }
    }
  
    function updateProgressStep(step) {
      progressSteps.forEach((progressStep) => {
        const stepNumber = Number.parseInt(progressStep.getAttribute("data-step"))
  
        if (stepNumber === step) {
          progressStep.classList.add("active")
        } else if (stepNumber < step) {
          progressStep.classList.add("completed")
          progressStep.classList.remove("active")
        } else {
          progressStep.classList.remove("active", "completed")
        }
      })
    }
  })
  
  