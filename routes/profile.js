document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in
    const user = JSON.parse(sessionStorage.getItem("hmart_user"))
    if (!user) {
      window.location.href = "login.html"
      return
    }
  
    // Update user information
    updateUserInfo(user)
  
    // Logout button
    const logoutButton = document.getElementById("logout-button")
    if (logoutButton) {
      logoutButton.addEventListener("click", (e) => {
        e.preventDefault()
  
        // Clear session storage
        sessionStorage.removeItem("hmart_user")
  
        // Redirect to login page
        window.location.href = "login.html"
      })
    }
  
    // User menu toggle
    const userMenuToggle = document.querySelector(".user-menu-toggle")
    const userDropdown = document.querySelector(".user-dropdown")
  
    if (userMenuToggle && userDropdown) {
      userMenuToggle.addEventListener("click", () => {
        userDropdown.classList.toggle("active")
      })
  
      // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (!userMenuToggle.contains(e.target) && !userDropdown.contains(e.target)) {
          userDropdown.classList.remove("active")
        }
      })
    }
  
    // Profile form
    const profileForm = document.getElementById("profile-form")
    const saveProfileButton = document.getElementById("save-profile")
    const cancelEditButton = document.getElementById("cancel-edit")
  
    // Avatar upload
    const avatarUpload = document.getElementById("avatar-upload")
  
    if (avatarUpload) {
      avatarUpload.addEventListener("change", function () {
        const file = this.files[0]
  
        if (file) {
          const reader = new FileReader()
  
          reader.onload = (e) => {
            // Update avatar previews
            const sidebarUserAvatar = document.getElementById("sidebar-user-avatar")
            const headerUserAvatar = document.getElementById("header-user-avatar")
  
            if (sidebarUserAvatar) sidebarUserAvatar.src = e.target.result
            if (headerUserAvatar) headerUserAvatar.src = e.target.result
  
            // Save to session storage
            user.avatar = e.target.result
            sessionStorage.setItem("hmart_user", JSON.stringify(user))
          }
  
          reader.readAsDataURL(file)
        }
      })
    }
  
    // Save profile changes
    if (saveProfileButton) {
      saveProfileButton.addEventListener("click", () => {
        // Get form values
        const fullName = document.getElementById("full-name").value
        const hostel = document.getElementById("hostel-select").value
        const roomNumber = document.getElementById("room-number").value
        const whatsappNumber = document.getElementById("whatsapp-number").value
        const bio = document.getElementById("bio").value
  
        // Validate form
        if (!fullName || !hostel || !roomNumber || !whatsappNumber) {
          showNotification("Please fill in all required fields", "error")
          return
        }
  
        // Update user object
        user.name = fullName
        user.hostel = hostel
        user.room = roomNumber
        user.whatsapp = whatsappNumber
        user.bio = bio
  
        // Save to session storage
        sessionStorage.setItem("hmart_user", JSON.stringify(user))
  
        // Update UI
        updateUserInfo(user)
  
        // Show success notification
        showNotification("Profile updated successfully", "success")
      })
    }
  
    // Cancel edit
    if (cancelEditButton) {
      cancelEditButton.addEventListener("click", () => {
        // Reset form to original values
        document.getElementById("full-name").value = user.name || ""
        document.getElementById("hostel-select").value = user.hostel || ""
        document.getElementById("room-number").value = user.room || ""
        document.getElementById("whatsapp-number").value = user.whatsapp || ""
        document.getElementById("bio").value = user.bio || ""
  
        showNotification("Changes discarded", "info")
      })
    }
  })
  
  // Update user information across the page
  function updateUserInfo(user) {
    // Header user info
    const headerUserName = document.getElementById("header-user-name")
    const headerUserAvatar = document.getElementById("header-user-avatar")
  
    if (headerUserName) headerUserName.textContent = user.name
    if (headerUserAvatar) headerUserAvatar.src = user.avatar
  
    // Sidebar user info
    const sidebarUserName = document.getElementById("sidebar-user-name")
    const sidebarUserAvatar = document.getElementById("sidebar-user-avatar")
    const userHostel = document.getElementById("user-hostel")
  
    if (sidebarUserName) sidebarUserName.textContent = user.name
    if (sidebarUserAvatar) sidebarUserAvatar.src = user.avatar
    if (userHostel) userHostel.textContent = `${user.hostel}, Room ${user.room}`
  
    // Update user stats
    updateUserStats({
      listings: 5,
      sales: 12,
      rating: 4.8,
    })
  }
  
  // Update user stats
  function updateUserStats(data) {
    const listingsCount = document.getElementById("listings-count")
    const salesCount = document.getElementById("sales-count")
    const ratingValue = document.getElementById("rating-value")
  
    if (listingsCount) listingsCount.textContent = data.listings
    if (salesCount) salesCount.textContent = data.sales
    if (ratingValue) ratingValue.textContent = data.rating
  }
  
  // Show notification
  function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
  
    // Create icon based on type
    let icon
    switch (type) {
      case "success":
        icon = "fa-check-circle"
        break
      case "error":
        icon = "fa-exclamation-circle"
        break
      case "info":
        icon = "fa-info-circle"
        break
      default:
        icon = "fa-bell"
    }
  
    // Set notification content
    notification.innerHTML = `
      <i class="fas ${icon}"></i>
      <span>${message}</span>
      <button class="notification-close"><i class="fas fa-times"></i></button>
    `
  
    // Add to document
    document.body.appendChild(notification)
  
    // Show notification
    setTimeout(() => {
      notification.classList.add("show")
    }, 10)
  
    // Close button
    const closeButton = notification.querySelector(".notification-close")
    closeButton.addEventListener("click", () => {
      notification.classList.remove("show")
      setTimeout(() => {
        notification.remove()
      }, 300)
    })
  
    // Auto close after 5 seconds
    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        notification.remove()
      }, 300)
    }, 5000)
  }
  
  