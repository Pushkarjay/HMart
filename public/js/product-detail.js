document.addEventListener("DOMContentLoaded", async () => {
    // Check if user is logged in
    const token = getToken();
    if (!token) {
      redirect("/login.html");
      return;
    }
  
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
  
    if (!productId) {
      showNotification("No product ID specified", "error");
      redirect("/products.html");
      return;
    }
  
    // Fetch product details
    try {
      const response = await fetch(`/api/products/${productId}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const product = await response.json();
  
      if (!response.ok) throw new Error(product.error || "Product not found");
  
      // Update UI
      document.getElementById("product-title").textContent = product.title;
      document.getElementById("product-description").textContent = product.description || "No description available";
      document.getElementById("product-price").textContent = `₹${product.price}`;
      document.getElementById("product-category").textContent = product.category;
      document.getElementById("seller-name").textContent = product.seller.name;
      document.getElementById("seller-hostel").textContent = `${product.seller.hostel}, Room ${product.room}`;
      if (product.imageUrl) {
        document.getElementById("product-image").src = product.imageUrl;
      }
    } catch (error) {
      showNotification(`Error: ${error.message}`, "error");
      setTimeout(() => redirect("/products.html"), 2000);
    }
  
    // Contact seller button
    const contactButton = document.getElementById("contact-seller");
    if (contactButton) {
      contactButton.addEventListener("click", () => {
        // Simulate starting a conversation (redirect to messages)
        showNotification("Starting conversation with seller...", "info");
        setTimeout(() => redirect(`/messages.html?conversation=${productId}`), 1000);
      });
    }
  });