document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in
    const token = getToken();
    if (!token) {
      redirect("/login.html");
      return;
    }
  
    const sellForm = document.getElementById("sell-form");
    const imageUpload = document.getElementById("image-upload");
    const imagePreview = document.getElementById("image-preview");
  
    // Image upload preview
    if (imageUpload) {
      imageUpload.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Product Preview">`;
          };
          reader.readAsDataURL(file);
        }
      });
    }
  
    // Form submission
    if (sellForm) {
      sellForm.addEventListener("submit", async (e) => {
        e.preventDefault();
  
        const title = document.getElementById("product-title").value;
        const description = document.getElementById("product-description").value;
        const price = document.getElementById("product-price").value;
        const category = document.getElementById("category-select").value;
        const hostel = document.getElementById("hostel-select").value;
        const file = imageUpload.files[0];
  
        // Validation
        if (!title || !price || !category || !hostel) {
          showNotification("Please fill in all required fields", "error");
          return;
        }
  
        if (isNaN(price) || parseFloat(price) <= 0) {
          showNotification("Please enter a valid price", "error");
          return;
        }
  
        try {
          // Upload image if provided
          let imageUrl = "";
          if (file) {
            const formData = new FormData();
            formData.append("image", file);
  
            const uploadResponse = await fetch("/api/products/upload-image", {
              method: "POST",
              headers: { "Authorization": `Bearer ${token}` },
              body: formData,
            });
            const uploadData = await uploadResponse.json();
            if (!uploadResponse.ok) throw new Error(uploadData.error || "Image upload failed");
            imageUrl = uploadData.imageUrl;
          }
  
          // Submit product
          const productData = {
            title,
            description,
            price: parseFloat(price),
            imageUrl,
            category,
            hostel,
          };
  
          const response = await fetch("/api/products", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
          });
  
          const data = await response.json();
          if (response.ok) {
            showNotification("Product listed successfully!", "success");
            setTimeout(() => redirect("/my-listings.html"), 1500);
          } else {
            throw new Error(data.error || "Failed to list product");
          }
        } catch (error) {
          showNotification(`Error: ${error.message}`, "error");
        }
      });
    }
  });