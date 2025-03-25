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
  
    // Conversation selection
    const conversationItems = document.querySelectorAll(".conversation-item")
    conversationItems.forEach((item) => {
      item.addEventListener("click", function () {
        // Update active conversation
        conversationItems.forEach((conv) => conv.classList.remove("active"))
        this.classList.add("active")
  
        // Remove unread badge
        const badge = this.querySelector(".conversation-badge")
        if (badge) badge.remove()
  
        // Update chat header
        const conversationName = this.querySelector(".conversation-name").textContent
        const conversationAvatar = this.querySelector(".conversation-avatar img").src
        const isOnline = this.querySelector(".status-indicator").classList.contains("online")
  
        updateChatHeader(conversationName, conversationAvatar, isOnline)
  
        // Load conversation messages (simulated)
        loadConversation(this.getAttribute("data-conversation"))
      })
    })
  
    // Message input
    const messageInput = document.getElementById("message-input")
    const sendButton = document.querySelector(".btn-send")
  
    if (messageInput && sendButton) {
      // Send message on Enter key
      messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          sendMessage()
        }
      })
  
      // Send message on button click
      sendButton.addEventListener("click", sendMessage)
    }
  
    // Search conversations
    const searchInput = document.getElementById("search-conversations")
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase()
        const conversations = document.querySelectorAll(".conversation-item")
  
        conversations.forEach((conversation) => {
          const name = conversation.querySelector(".conversation-name").textContent.toLowerCase()
          const preview = conversation.querySelector(".conversation-preview").textContent.toLowerCase()
  
          if (name.includes(searchTerm) || preview.includes(searchTerm)) {
            conversation.style.display = "flex"
          } else {
            conversation.style.display = "none"
          }
        })
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
  
  // Update chat header
  function updateChatHeader(name, avatar, isOnline) {
    const chatUserName = document.querySelector(".chat-user-name")
    const chatAvatar = document.querySelector(".chat-avatar img")
    const chatUserStatus = document.querySelector(".chat-user-status")
    const statusIndicator = document.querySelector(".chat-avatar .status-indicator")
  
    if (chatUserName) chatUserName.textContent = name
    if (chatAvatar) chatAvatar.src = avatar
  
    if (chatUserStatus) {
      chatUserStatus.textContent = isOnline ? "Online" : "Offline"
    }
  
    if (statusIndicator) {
      statusIndicator.className = "status-indicator"
      statusIndicator.classList.add(isOnline ? "online" : "offline")
    }
  }
  
  // Load conversation (simulated)
  function loadConversation(conversationId) {
    // In a real app, this would fetch messages from an API
    // For this demo, we'll just use the existing messages
  
    // Scroll to bottom of messages
    const chatMessages = document.getElementById("chat-messages")
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight
    }
  }
  
  // Send message
  function sendMessage() {
    const messageInput = document.getElementById("message-input")
    const message = messageInput.value.trim()
  
    if (message) {
      // Create message element
      const messageElement = document.createElement("div")
      messageElement.className = "message sent"
  
      // Get current time
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      const timeString = `${hours}:${minutes}`
  
      messageElement.innerHTML = `
        <div class="message-content">
          <div class="message-bubble">
            <p>${message}</p>
          </div>
          <div class="message-info">
            <span class="message-time">${timeString}</span>
            <span class="message-status">
              <i class="fas fa-check"></i>
            </span>
          </div>
        </div>
      `
  
      // Add message to chat
      const chatMessages = document.getElementById("chat-messages")
      chatMessages.appendChild(messageElement)
  
      // Clear input
      messageInput.value = ""
  
      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight
  
      // In a real app, this would send the message to an API
      // For this demo, we'll simulate a response after a delay
      setTimeout(() => {
        // Update message status to delivered
        const statusIcon = messageElement.querySelector(".message-status i")
        statusIcon.className = "fas fa-check-double"
  
        // Simulate typing indicator
        const typingIndicator = document.createElement("div")
        typingIndicator.className = "typing-indicator"
        typingIndicator.innerHTML = `
          <div class="message-avatar">
            <img src="${document.querySelector(".chat-avatar img").src}" alt="User">
          </div>
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        `
  
        chatMessages.appendChild(typingIndicator)
        chatMessages.scrollTop = chatMessages.scrollHeight
  
        // Simulate response after typing
        setTimeout(() => {
          // Remove typing indicator
          typingIndicator.remove()
  
          // Add response message
          const responseElement = document.createElement("div")
          responseElement.className = "message received"
  
          responseElement.innerHTML = `
            <div class="message-avatar">
              <img src="${document.querySelector(".chat-avatar img").src}" alt="User">
            </div>
            <div class="message-content">
              <div class="message-bubble">
                <p>Sure, that works for me!</p>
              </div>
              <div class="message-info">
                <span class="message-time">${timeString}</span>
              </div>
            </div>
          `
  
          chatMessages.appendChild(responseElement)
          chatMessages.scrollTop = chatMessages.scrollHeight
        }, 2000)
      }, 1000)
    }
  }
  
  