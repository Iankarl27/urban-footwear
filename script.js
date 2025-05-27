// Global variables
let cart = JSON.parse(localStorage.getItem("cart")) || []
let currentSlide = 0
const slides = document.querySelectorAll(".hero-slides img")
const dots = document.querySelectorAll(".hero-dot")

// DOM elements
const cartIcon = document.getElementById("cart-icon")
const cartModal = document.getElementById("cartModal")
const cartItems = document.getElementById("cartItems")
const cartTotal = document.getElementById("cartTotal")
const cartCountElement = document.querySelector(".cart-count")
const closeBtn = document.querySelector(".close-btn")
const clearCartBtn = document.getElementById("clearCart")
const addToCartButtons = document.querySelectorAll(".add-to-cart")
const mobileMenuBtn = document.getElementById("mobileMenuBtn")
const mobileNav = document.getElementById("mobileNav")
const profileIcon = document.getElementById("profileIcon")

// Filter elements
const searchInput = document.getElementById("searchInput")
const categoryFilter = document.getElementById("categoryFilter")
const priceFilter = document.getElementById("priceFilter")
const sortFilter = document.getElementById("sortFilter")
const heroSearch = document.getElementById("heroSearch")
const searchBtn = document.querySelector(".search-btn")

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initializeEventListeners()
  updateCartDisplay()
  updateCartCount()
  initializeHeroSlider()
  checkLoginStatus()
})

// Event Listeners
function initializeEventListeners() {
  // Cart functionality
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", handleAddToCart)
  })

  cartIcon.addEventListener("click", toggleCartModal)
  closeBtn.addEventListener("click", closeCartModal)
  clearCartBtn.addEventListener("click", clearCart)

  // Mobile menu
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleMobileMenu)
  }

  // Filter functionality
  if (searchInput) searchInput.addEventListener("input", filterProducts)
  if (categoryFilter) categoryFilter.addEventListener("change", filterProducts)
  if (priceFilter) priceFilter.addEventListener("change", filterProducts)
  if (sortFilter) sortFilter.addEventListener("change", filterProducts)

  // Hero search
  if (searchBtn) searchBtn.addEventListener("click", handleHeroSearch)
  if (heroSearch) heroSearch.addEventListener("change", handleHeroSearch)

  // Hero slider dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => goToSlide(index))
  })

  // Wishlist buttons
  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", handleWishlist)
  })

  // Quick view buttons
  document.querySelectorAll(".quick-view").forEach((btn) => {
    btn.addEventListener("click", handleQuickView)
  })

  // Close modal when clicking outside
  cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) {
      closeCartModal()
    }
  })

  // Newsletter subscription
  const newsletterForm = document.querySelector(".newsletter")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", handleNewsletterSubscription)
  }

  // Contact form
  const contactForm = document.querySelector(".contact-form-fields")
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactForm)
  }

  // Load more button
  const loadMoreBtn = document.querySelector(".load-more-btn")
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", handleLoadMore)
  }
}

// Login Status Check
function checkLoginStatus() {
  if (localStorage.getItem("isLoggedIn") === "true") {
    profileIcon.textContent = "🚪"
    profileIcon.title = "Logout"
    profileIcon.addEventListener("click", handleLogout)
  } else {
    profileIcon.textContent = "👤"
    profileIcon.title = "Login"
    profileIcon.addEventListener("click", () => {
      showNotification("Login feature coming soon!", "info")
    })
  }
}

function handleLogout() {
  localStorage.removeItem("isLoggedIn")
  localStorage.removeItem("username")
  showNotification("Logged out successfully!", "success")
  checkLoginStatus()
}

// Cart Functions
function handleAddToCart(event) {
  const card = event.target.closest(".card")
  const id = card.dataset.id
  const price = Number.parseFloat(card.dataset.price)
  const name = card.dataset.name || card.querySelector("h3").textContent
  const category = card.dataset.category
  const sizeSelect = card.querySelector(".size-select")
  const size = sizeSelect.value
  const img = card.querySelector("img").src

  if (!size) {
    showNotification("Please select a size", "error")
    return
  }

  const existingItem = cart.find((item) => item.id === id && item.size === size)

  if (existingItem) {
    existingItem.qty += 1
  } else {
    cart.push({
      id,
      name,
      price,
      size,
      img,
      category,
      qty: 1,
    })
  }

  updateCartDisplay()
  updateCartCount()
  saveCartToStorage()
  showNotification(`${name} added to cart!`, "success")

  // Reset size selection
  sizeSelect.value = ""
}

function updateCartDisplay() {
  cartItems.innerHTML = ""

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p class="empty-cart" style="text-align: center; color: #6b7280; padding: 2rem;">Your cart is empty</p>'
    return
  }

  let total = 0

  cart.forEach((item, index) => {
    const cartItem = document.createElement("div")
    cartItem.className = "cart-item"
    cartItem.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>Size: ${item.size}</p>
        <p class="cart-item-price">₱${item.price.toFixed(2)}</p>
        <div class="quantity-controls">
          <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.qty - 1})">-</button>
          <span style="padding: 0 0.5rem;">${item.qty}</span>
          <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.qty + 1})">+</button>
          <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
        </div>
      </div>
    `
    cartItems.appendChild(cartItem)
    total += item.price * item.qty
  })

  cartTotal.textContent = total.toFixed(2)
}

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.qty, 0)
  cartCountElement.textContent = count
}

function updateQuantity(index, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(index)
  } else {
    cart[index].qty = newQuantity
    updateCartDisplay()
    updateCartCount()
    saveCartToStorage()
  }
}

function removeFromCart(index) {
  cart.splice(index, 1)
  updateCartDisplay()
  updateCartCount()
  saveCartToStorage()
  showNotification("Item removed from cart", "success")
}

function clearCart() {
  cart = []
  updateCartDisplay()
  updateCartCount()
  saveCartToStorage()
  showNotification("Cart cleared", "success")
}

function toggleCartModal() {
  cartModal.classList.toggle("hidden")
  updateCartDisplay()
}

function closeCartModal() {
  cartModal.classList.add("hidden")
}

function saveCartToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart))
}

// Mobile Menu Functions
function toggleMobileMenu() {
  mobileNav.style.display = mobileNav.style.display === "flex" ? "none" : "flex"
}

// Filter Functions
function filterProducts() {
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : ""
  const selectedCategory = categoryFilter ? categoryFilter.value : ""
  const selectedPriceRange = priceFilter ? priceFilter.value : ""
  const sortBy = sortFilter ? sortFilter.value : ""
  const cards = Array.from(document.querySelectorAll(".card"))

  const filteredCards = cards.filter((card) => {
    const name = card.dataset.name.toLowerCase()
    const category = card.dataset.category
    const price = Number.parseFloat(card.dataset.price)

    let showCard = true

    // Search filter
    if (searchTerm && !name.includes(searchTerm)) {
      showCard = false
    }

    // Category filter
    if (selectedCategory && category !== selectedCategory) {
      showCard = false
    }

    // Price filter
    if (selectedPriceRange) {
      if (selectedPriceRange === "0-2000" && price > 2000) showCard = false
      if (selectedPriceRange === "2000-4000" && (price < 2000 || price > 4000)) showCard = false
      if (selectedPriceRange === "4000-6000" && (price < 4000 || price > 6000)) showCard = false
      if (selectedPriceRange === "6000+" && price < 6000) showCard = false
    }

    return showCard
  })

  // Sort products
  if (sortBy) {
    filteredCards.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return Number.parseFloat(a.dataset.price) - Number.parseFloat(b.dataset.price)
        case "price-high":
          return Number.parseFloat(b.dataset.price) - Number.parseFloat(a.dataset.price)
        case "name":
          return a.dataset.name.localeCompare(b.dataset.name)
        default:
          return 0
      }
    })
  }

  // Show/hide cards
  cards.forEach((card) => {
    card.style.display = filteredCards.includes(card) ? "block" : "none"
  })

  // Update products grid order
  const productsGrid = document.querySelector(".products-grid")
  if (productsGrid) {
    filteredCards.forEach((card) => {
      productsGrid.appendChild(card)
    })
  }
}

function handleHeroSearch() {
  const selectedCategory = heroSearch ? heroSearch.value : ""
  if (selectedCategory && categoryFilter) {
    categoryFilter.value = selectedCategory
    filterProducts()

    // Scroll to products section
    const shopSection = document.getElementById("shop")
    if (shopSection) {
      shopSection.scrollIntoView({
        behavior: "smooth",
      })
    }
  }
}

// Hero Slider Functions
function initializeHeroSlider() {
  setInterval(nextSlide, 5000) // Auto-advance every 5 seconds
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length
  updateSlider()
}

function goToSlide(index) {
  currentSlide = index
  updateSlider()
}

function updateSlider() {
  // Update dots
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide)
  })
}

// Wishlist Functions
function handleWishlist(event) {
  event.preventDefault()
  const btn = event.target
  const isWishlisted = btn.textContent === "♥"

  btn.textContent = isWishlisted ? "♡" : "♥"
  btn.style.color = isWishlisted ? "#6b7280" : "#ef4444"

  const productName = btn.closest(".card").querySelector("h3").textContent
  const message = isWishlisted ? `${productName} removed from wishlist` : `${productName} added to wishlist`

  showNotification(message, "success")
}

// Quick View Functions
function handleQuickView(event) {
  event.preventDefault()
  const card = event.target.closest(".card")
  const productName = card.querySelector("h3").textContent

  // This would typically open a modal with product details
  showNotification(`Quick view for ${productName} - Feature coming soon!`, "info")
}

// Load More Function
function handleLoadMore() {
  showNotification("Loading more products...", "info")

  // Simulate loading delay
  setTimeout(() => {
    showNotification("More products loaded!", "success")
  }, 1000)
}

// Form Handlers
function handleNewsletterSubscription(event) {
  event.preventDefault()
  const email = event.target.querySelector('input[type="email"]').value

  if (email) {
    showNotification("Thank you for subscribing to our newsletter!", "success")
    event.target.querySelector('input[type="email"]').value = ""
  }
}

function handleContactForm(event) {
  event.preventDefault()

  // Let the form submit naturally to FormSubmit
  showNotification("Thank you for your message! We'll get back to you soon.", "success")

  // Reset form after a short delay
  setTimeout(() => {
    event.target.reset()
  }, 1000)
}

// Notification System
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  // Style the notification
  Object.assign(notification.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "1rem 1.5rem",
    borderRadius: "0.5rem",
    color: "white",
    fontWeight: "600",
    zIndex: "9999",
    transform: "translateX(100%)",
    transition: "transform 0.3s ease",
    maxWidth: "300px",
  })

  // Set background color based on type
  switch (type) {
    case "success":
      notification.style.backgroundColor = "#059669"
      break
    case "error":
      notification.style.backgroundColor = "#dc2626"
      break
    case "info":
      notification.style.backgroundColor = "#2563eb"
      break
    default:
      notification.style.backgroundColor = "#6b7280"
  }

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in")
    }
  })
}, observerOptions)

// Observe elements for animation
document.querySelectorAll(".card, .offer-card, .about-content, .contact-content").forEach((el) => {
  observer.observe(el)
})

// Keyboard navigation for accessibility
document.addEventListener("keydown", (e) => {
  // Close modal with Escape key
  if (e.key === "Escape" && !cartModal.classList.contains("hidden")) {
    closeCartModal()
  }

  // Close mobile menu with Escape key
  if (e.key === "Escape" && mobileNav && mobileNav.style.display === "flex") {
    toggleMobileMenu()
  }
})

// Handle window resize
window.addEventListener("resize", () => {
  // Close mobile menu on desktop
  if (window.innerWidth > 768 && mobileNav) {
    mobileNav.style.display = "none"
  }
})

// Product card click animations
const productCards = document.querySelectorAll(".card")

productCards.forEach((card) => {
  card.addEventListener("click", (e) => {
    // Don't trigger if clicking on buttons
    if (e.target.tagName === "BUTTON" || e.target.tagName === "SELECT") {
      return
    }

    card.classList.add("clicked")
    setTimeout(() => {
      card.classList.remove("clicked")
    }, 400)
  })
})

// Initialize cart from localStorage on page load
window.addEventListener("load", () => {
  updateCartDisplay()
  updateCartCount()
})

// Save cart before page unload
window.addEventListener("beforeunload", saveCartToStorage)
