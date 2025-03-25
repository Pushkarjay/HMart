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
  
    // Mobile menu toggle
    const menuToggle = document.querySelector(".menu-toggle")
    const navLinks = document.querySelector(".nav-links")
  
    if (menuToggle && navLinks) {
      menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active")
      })
    }
  
    // Dashboard data
    fetchDashboardData()
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
  }
  
  // Fetch dashboard data (simulated)
  function fetchDashboardData() {
    // Simulate API call to get dashboard data
    setTimeout(() => {
      // Update overview cards
      updateOverviewCards({
        activeListings: 5,
        totalSales: "₹2,450",
        newMessages: 5,
        profileViews: 42,
      })
  
      // Update user stats
      updateUserStats({
        listings: 5,
        sales: 12,
        rating: 4.8,
      })
  
      // Update recent activity (would normally come from API)
      // Already hardcoded in HTML
  
      // Update recent listings (would normally come from API)
      // Already hardcoded in HTML
    }, 500)
  }
  
  // Update overview cards with data
  function updateOverviewCards(data) {
    const activeListings = document.getElementById("active-listings")
    const totalSales = document.getElementById("total-sales")
    const newMessages = document.getElementById("new-messages")
    const profileViews = document.getElementById("profile-views")
  
    if (activeListings) activeListings.textContent = data.activeListings
    if (totalSales) totalSales.textContent = data.totalSales
    if (newMessages) newMessages.textContent = data.newMessages
    if (profileViews) profileViews.textContent = data.profileViews
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
  
  