function updateUserInfo(user) {
  const headerUserName = document.getElementById("header-user-name");
  const headerUserAvatar = document.getElementById("header-user-avatar");
  const sidebarUserName = document.getElementById("sidebar-user-name");
  const sidebarUserAvatar = document.getElementById("sidebar-user-avatar");
  const userHostel = document.getElementById("user-hostel");

  if (headerUserName) headerUserName.textContent = user.name;
  if (headerUserAvatar) headerUserAvatar.src = user.avatar;
  if (sidebarUserName) sidebarUserName.textContent = user.name;
  if (sidebarUserAvatar) sidebarUserAvatar.src = user.avatar;
  if (userHostel) userHostel.textContent = `${user.hostel}, Room ${user.room}`;

  updateUserStats({ listings: 5, sales: 12, rating: 4.8 });
}

function updateUserStats(data) {
  const listingsCount = document.getElementById("listings-count");
  const salesCount = document.getElementById("sales-count");
  const ratingValue = document.getElementById("rating-value");

  if (listingsCount) listingsCount.textContent = data.listings;
  if (salesCount) salesCount.textContent = data.sales;
  if (ratingValue) ratingValue.textContent = data.rating;
}

function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;

  let icon;
  switch (type) {
    case "success": icon = "fa-check-circle"; break;
    case "error": icon = "fa-exclamation-circle"; break;
    case "info": icon = "fa-info-circle"; break;
    default: icon = "fa-bell";
  }

  notification.innerHTML = `
    <i class="fas ${icon}"></i>
    <span>${message}</span>
    <button class="notification-close"><i class="fas fa-times"></i></button>
  `;

  document.body.appendChild(notification);
  setTimeout(() => notification.classList.add("show"), 10);

  const closeButton = notification.querySelector(".notification-close");
  closeButton.addEventListener("click", () => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  });

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}