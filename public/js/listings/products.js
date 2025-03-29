document.addEventListener("DOMContentLoaded", async () => {
    const token = getToken();
    const productsGrid = document.getElementById("products-grid");
    const searchInput = document.getElementById("search-products");
    const filterButton = document.querySelector(".filter-dropdown button");
    const filterDropdownContent = document.querySelector(".filter-dropdown-content");
    const applyFiltersButton = document.getElementById("apply-filters");
    const resetFiltersButton = document.getElementById("reset-filters");
  
    // Load initial products
    await loadProducts();
  
    // Search functionality
    if (searchInput) {
      searchInput.addEventListener("input", async () => {
        const query = searchInput.value.trim();
        await loadProducts(query ? `/api/products/search?query=${encodeURIComponent(query)}` : "/api/products");
      });
    }
  
    // Filter dropdown toggle
    if (filterButton && filterDropdownContent) {
      filterButton.addEventListener("click", () => {
        filterDropdownContent.classList.toggle("show");
      });
  
      document.addEventListener("click", (e) => {
        if (!filterButton.contains(e.target) && !filterDropdownContent.contains(e.target)) {
          filterDropdownContent.classList.remove("show");
        }
      });
    }
  
    // Apply filters
    if (applyFiltersButton) {
      applyFiltersButton.addEventListener("click", async () => {
        const category = document.getElementById("category-filter").value;
        const hostel = document.getElementById("hostel-filter").value;
        let url = "/api/products";
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (hostel) params.append("hostel", hostel);
        if (params.toString()) url += `?${params.toString()}`;
        await loadProducts(url);
        filterDropdownContent.classList.remove("show");
      });
    }
  
    // Reset filters
    if (resetFiltersButton) {
      resetFiltersButton.addEventListener("click", async () => {
        document.getElementById("category-filter").value = "";
        document.getElementById("hostel-filter").value = "";
        searchInput.value = "";
        await loadProducts();
        filterDropdownContent.classList.remove("show");
      });
    }
  
    async function loadProducts(url = "/api/products") {
      try {
        const response = await fetch(url, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const data = await response.json();
  
        if (!response.ok) throw new Error(data.error || "Failed to load products");
  
        productsGrid.innerHTML = "";
        if (data.products.length === 0) {
          productsGrid.innerHTML = `
            <div class="empty-state">
              <i class="fas fa-box-open"></i>
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          `;
          return;
        }
  
        data.products.forEach((product) => {
          const card = document.createElement("div");
          card.className = "product-card";
          card.innerHTML = `
            <img src="${product.imageUrl || 'https://via.placeholder.com/150'}" alt="${product.title}">
            <div class="product-info">
              <h3 class="product-title">${product.title}</h3>
              <p class="product-price">₹${product.price}</p>
              <p class="product-seller">Seller: ${product.seller.name}</p>
              <a href="/product-detail.html?id=${product.id}" class="btn btn-primary">View Details</a>
            </div>
          `;
          productsGrid.appendChild(card);
        });
      } catch (error) {
        showNotification(`Error: ${error.message}`, "error");
      }
    }
  });