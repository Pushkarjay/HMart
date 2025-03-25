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
  
    // Tab switching
    const tabButtons = document.querySelectorAll(".tab-btn")
    const tabContents = document.querySelectorAll(".tab-content")
  
    tabButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const tabName = this.getAttribute("data-tab")
  
        // Update active tab button
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        this.classList.add("active")
  
        // Show corresponding tab content
        tabContents.forEach((content) => {
          content.style.display = "none"
          if (content.id === `${tabName}-tab`) {
            content.style.display = "block"
          }
        })
      })
    })
  
    // Search functionality
    const searchInput = document.getElementById("search-listings")
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase()
        const listingCards = document.querySelectorAll(".listing-card")
  
        listingCards.forEach((card) => {
          const title = card.querySelector(".listing-title").textContent.toLowerCase()
  
          if (title.includes(searchTerm)) {
            card.style.display = "flex"
          } else {
            card.style.display = "none"
          }
        })
      })
    }
  
    // Filter dropdown toggle
    const filterButton = document.querySelector(".filter-dropdown button")
    const filterDropdownContent = document.querySelector(".filter-dropdown-content")
  
    if (filterButton && filterDropdownContent) {
      filterButton.addEventListener("click", () => {
        filterDropdownContent.classList.toggle("show")
      })
  
      // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (!filterButton.contains(e.target) && !filterDropdownContent.contains(e.target)) {
          filterDropdownContent.classList.remove("show")
        }
      })
    }
  
    // Apply filters
    const applyFiltersButton = document.getElementById("apply-filters")
    if (applyFiltersButton) {
      applyFiltersButton.addEventListener("click", () => {
        const categoryFilter = document.getElementById("category-filter").value
        const sortFilter = document.getElementById("sort-filter").value
  
        // Apply filters (simulated)
        filterListings(categoryFilter, sortFilter)
  
        // Close dropdown
        filterDropdownContent.classList.remove("show")
      })
    }
  
    // Reset filters
    const resetFiltersButton = document.getElementById("reset-filters")
    if (resetFiltersButton) {
      resetFiltersButton.addEventListener("click", () => {
        document.getElementById("category-filter").value = ""
        document.getElementById("sort-filter").value = "recent"
  
        // Reset filters
        filterListings("", "recent")
  
        // Close dropdown
        filterDropdownContent.classList.remove("show")
      })
    }
  
    // Listing actions
    setupListingActions()
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
  
  // Filter listings (simulated)
  function filterListings(category, sort) {
    const listingCards = document.querySelectorAll(".listing-card")
  
    // In a real application, this would filter based on API data
    // For this demo, we'll just simulate filtering
  
    if (category) {
      // Simulate category filtering
      showNotification(`Filtered by category: ${category}`, "info")
    }
  
    if (sort) {
      // Simulate sorting
      let sortMessage
      switch (sort) {
        case "recent":
          sortMessage = "Most Recent"
          break
        case "price-low":
          sortMessage = "Price: Low to High"
          break
        case "price-high":
          sortMessage = "Price: High to Low"
          break
        case "views":
          sortMessage = "Most Views"
          break
      }
  
      showNotification(`Sorted by: ${sortMessage}`, "info")
    }
  }
  
  // Setup listing actions
  function setupListingActions() {
    // Edit buttons
    const editButtons = document.querySelectorAll(".listing-actions a:nth-child(1)")
    editButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault()
        const listingTitle = this.closest(".listing-card").querySelector(".listing-title").textContent
        showNotification(`Editing listing: ${listingTitle}`, "info")
      })
    })
  
    // Mark as sold buttons
    const soldButtons = document.querySelectorAll(".listing-actions a:nth-child(2)")
    soldButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault()
        const listingCard = this.closest(".listing-card")
        const listingTitle = listingCard.querySelector(".listing-title").textContent
  
        // Confirm before marking as sold
        if (confirm(`Are you sure you want to mark "${listingTitle}" as sold?`)) {
          // In a real app, this would call an API
          listingCard.querySelector(".listing-badge").textContent = "Sold"
          listingCard.querySelector(".listing-badge").classList.add("sold")
  
          showNotification(`"${listingTitle}" marked as sold`, "success")
        }
      })
    })
  
    // Delete buttons
    const deleteButtons = document.querySelectorAll(".listing-actions a:nth-child(3)")
    deleteButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault()
        const listingCard = this.closest(".listing-card")
        const listingTitle = listingCard.querySelector(".listing-title").textContent
  
        // Confirm before deleting
        if (confirm(`Are you sure you want to delete "${listingTitle}"? This action cannot be undone.`)) {
          // In a real app, this would call an API
          listingCard.style.opacity = "0"
          setTimeout(() => {
            listingCard.remove()
  
            // Check if there are any listings left
            const remainingListings = document.querySelectorAll("#active-tab .listing-card")
            if (remainingListings.length === 0) {
              // Show empty state
              const emptyState = document.createElement("div")
              emptyState.className = "empty-state"
              emptyState.innerHTML = `
                <i class="fas fa-box-open"></i>
                <h3>No active listings</h3>
                <p>You don't have any active listings right now</p>
                <a href="sell.html" class="btn btn-primary">Add New Listing</a>
              `
              document.querySelector("#active-tab .listings-grid").appendChild(emptyState)
            }
          }, 300)
  
          showNotification(`"${listingTitle}" deleted`, "success")
        }
      })
    })
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
  
  