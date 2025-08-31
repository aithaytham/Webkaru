// Cart functionality
let cart = [];
let cartTotal = 0;

// Product data - Pure Stripe integration (no Shopify)
const products = {
  standard: {
    id: "prod_Sxs50E7A1qntTL", // Updated product ID
    title: "Karu Deck - Deck Standard",
    price: 15.99, // Updated price
    stripePriceId: "price_XXXX", // Will be set from stripe-config.js
    image: "assets/Card0.png",
    description: "100+ cartes anime, design exclusif, boîte de rangement",
  },
  competition: {
    id: "prod_SxvBGjAcP6CJI8", // Updated product ID
    title: "Karu Deck - Deck Compétition",
    price: 25.0, // Updated price
    stripePriceId: "price_XXXX", // Will be set from stripe-config.js
    image: "assets/Card1.png",
    description:
      "100+ cartes anime, boîte collector magnétique, cartes exclusives limitées",
  },
};

// Card images for showcase
const cardImages = [
  "assets/Card0.png",
  "assets/Card1.png",
  "assets/Card2.png",
  "assets/Card3.png",
];

// Initialize Stripe product data from configuration
function initStripeProducts() {
  console.log("🔍 Checking STRIPE_CONFIG availability...");
  if (typeof STRIPE_CONFIG === "undefined") {
    console.error(
      "❌ STRIPE_CONFIG is not defined! Make sure stripe-config.js is loaded."
    );
    return;
  }
  if (typeof STRIPE_CONFIG !== "undefined" && STRIPE_CONFIG.products) {
    // Sync Stripe Price IDs with local products
    if (STRIPE_CONFIG.products.standard) {
      products.standard.stripePriceId =
        STRIPE_CONFIG.products.standard.stripePriceId;
      products.standard.price = STRIPE_CONFIG.products.standard.price / 100; // Convert from cents
    }
    if (STRIPE_CONFIG.products.competition) {
      products.competition.stripePriceId =
        STRIPE_CONFIG.products.competition.stripePriceId;
      products.competition.price =
        STRIPE_CONFIG.products.competition.price / 100; // Convert from cents
    }

    console.log("Stripe products initialized:", products);
  } else {
    console.warn(
      "STRIPE_CONFIG not found. Product prices may not be accurate."
    );
  }
}

// DOM Elements
const cartSidebar = document.getElementById("cart-sidebar");
const cartOverlay = document.getElementById("cart-overlay");
const cartItems = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Stripe product data
  initStripeProducts();

  // Smooth scrolling for navigation links
  initSmoothScrolling();

  // Initialize FAQ functionality
  initFAQ();

  // Initialize animations on scroll
  initScrollAnimations();

  // Initialize cart from localStorage
  loadCartFromStorage();

  // Add mobile menu functionality
  initMobileMenu();

  // Initialize product showcase
  initProductShowcase();
});

// Smooth scrolling
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// FAQ functionality
function initFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => toggleFAQ(question));
  });
}

function toggleFAQ(button) {
  const faqItem = button.closest(".faq-item");
  const isActive = faqItem.classList.contains("active");

  // Close all FAQ items
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.classList.remove("active");
  });

  // Open clicked item if it wasn't active
  if (!isActive) {
    faqItem.classList.add("active");
  }
}

// Scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document
    .querySelectorAll(".feature-card, .pricing-card, .game-mode-card")
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });
}

// Mobile menu functionality
function initMobileMenu() {
  // Add mobile menu toggle if needed
  const navLinks = document.querySelector(".nav-links");
  const navContainer = document.querySelector(".nav-container");

  if (window.innerWidth <= 768) {
    // Create mobile menu button
    const mobileMenuBtn = document.createElement("button");
    mobileMenuBtn.className = "mobile-menu-btn";
    mobileMenuBtn.innerHTML = "☰";
    mobileMenuBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            display: block;
        `;

    navContainer.appendChild(mobileMenuBtn);

    mobileMenuBtn.addEventListener("click", () => {
      navLinks.style.display =
        navLinks.style.display === "flex" ? "none" : "flex";
      navLinks.style.position = "absolute";
      navLinks.style.top = "100%";
      navLinks.style.left = "0";
      navLinks.style.right = "0";
      navLinks.style.background = "rgba(26, 26, 46, 0.95)";
      navLinks.style.flexDirection = "column";
      navLinks.style.padding = "1rem";
    });
  }
}

// Product showcase functionality
function initProductShowcase() {
  const thumbnails = document.querySelectorAll(".thumbnail");
  const cardPreview = document.querySelector(".card-preview");

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => {
      // Remove active class from all thumbnails
      thumbnails.forEach((t) => t.classList.remove("active"));
      // Add active class to clicked thumbnail
      thumbnail.classList.add("active");

      // Change card preview to show selected image
      if (cardImages[index]) {
        cardPreview.style.backgroundImage = `url('${cardImages[index]}')`;
      }
    });
  });
}

// Cart functionality
function addToCart(productKey) {
  const product = products[productKey];
  if (!product) {
    console.error("Product not found:", productKey);
    return;
  }

  // Check if Stripe Price ID is available
  if (!product.stripePriceId || product.stripePriceId === "price_XXXX") {
    showNotification("Produit non disponible. Stripe non configuré.", "error");
    return;
  }

  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      type: productKey, // Important: Store the product key for Stripe mapping
      title: product.title,
      price: product.price,
      stripePriceId: product.stripePriceId,
      image: product.image,
      description: product.description,
      quantity: 1,
    });
  }

  updateCartDisplay();
  saveCartToStorage();
  openCart();

  // Show success notification
  showNotification(`${product.title} ajouté au panier !`, "success");
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCartDisplay();
  saveCartToStorage();
}

// Clear cart function
function clearCart() {
  cart = [];
  updateCartDisplay();
  updateCartCount();
  saveCartToStorage();
  console.log("🗑️ Cart cleared successfully");
}

function updateQuantity(productId, quantity) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity = Math.max(0, quantity);
    if (item.quantity === 0) {
      removeFromCart(productId);
    } else {
      updateCartDisplay();
      saveCartToStorage();
    }
  }
}

function updateCartDisplay() {
  cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  cartTotalElement.textContent = `${cartTotal.toFixed(2)}€`;

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p style="color: rgba(255,255,255,0.7); text-align: center; padding: 2rem;">Votre panier est vide</p>';
    return;
  }

  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.style.cssText = `
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        `;

    const itemTotal = (item.price * item.quantity).toFixed(2);

    cartItem.innerHTML = `
            <div class="cart-item-info" style="flex: 1;">
                <h4 style="color: white; font-size: 0.9rem; margin-bottom: 0.5rem;">${item.title}</h4>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})"
                                style="background: #00A6FB; border: none; color: white; width: 25px; height: 25px; border-radius: 50%; cursor: pointer;">-</button>
                        <span style="color: white; min-width: 20px; text-align: center;">${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})"
                                style="background: #00A6FB; border: none; color: white; width: 25px; height: 25px; border-radius: 50%; cursor: pointer;">+</button>
                    </div>
                    <span style="color: #00A6FB; font-weight: bold;">${itemTotal}€</span>
                </div>
            </div>
            <button onclick="removeFromCart('${item.id}')"
                    style="background: #FF2E63; border: none; color: white; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">×</button>
        `;

    cartItems.appendChild(cartItem);
  });
}

function openCart() {
  cartSidebar.classList.add("open");
  cartOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartSidebar.classList.remove("open");
  cartOverlay.classList.remove("open");
  document.body.style.overflow = "auto";
}

// Local storage functions
function saveCartToStorage() {
  localStorage.setItem("karuCart", JSON.stringify(cart));
}

function loadCartFromStorage() {
  const savedCart = localStorage.getItem("karuCart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartDisplay();
  }
}

// Notification system
function showNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #00A6FB, #FF2E63);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 166, 251, 0.3);
    `;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Animate out and remove
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Pure Stripe Checkout Integration
async function proceedToCheckout() {
  if (cart.length === 0) {
    showNotification("Votre panier est vide !", "error");
    return;
  }

  // Check if Stripe is initialized
  if (!window.karuStripePayments || !window.karuStripePayments.isInitialized) {
    showNotification(
      "Système de paiement non initialisé. Veuillez recharger la page.",
      "error"
    );
    return;
  }

  try {
    // Debug: Log cart contents and products
    console.log("🛒 Cart contents:", cart);
    console.log("📦 Products object:", products);

    // Show loading state
    const checkoutBtn = document.querySelector(".cart-checkout");
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = "Préparation du paiement...";
    }

    // Convert cart items to Stripe line items
    const lineItems = cart.map((item) => {
      // If item has stripePriceId directly, use it
      if (item.stripePriceId) {
        return {
          price: item.stripePriceId,
          quantity: item.quantity,
        };
      }

      // Fallback to products lookup
      const product = products[item.type];
      if (!product || !product.stripePriceId) {
        console.error(
          "Product not found or missing stripePriceId:",
          item.type,
          product
        );
        throw new Error(`Produit ${item.type} non configuré pour le paiement`);
      }

      return {
        price: product.stripePriceId,
        quantity: item.quantity,
      };
    });

    // Debug cart and line items
    console.log("🛒 Final cart contents for checkout:", cart);
    console.log("💳 Line items being sent:", lineItems);
    console.log("🌐 Current window.location.origin:", window.location.origin);
    console.log("🌐 Full window.location:", window.location.href);

    // Ensure we use the frontend server URL, not backend
    const frontendOrigin = window.location.origin.includes(":3000")
      ? "http://localhost:5500"
      : window.location.origin;

    console.log("🔄 Using frontend origin:", frontendOrigin);

    // Create Stripe checkout session
    const sessionData = {
      line_items: lineItems,
      mode: "payment",
      success_url:
        frontendOrigin + "/success.html?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: frontendOrigin + "/cancel.html",
      metadata: {
        source: "karu_web_preorder_cart",
        cart_items: cart
          .map((item) => `${item.type}:${item.quantity}`)
          .join(","), // Compact format: "standard:1,competition:2"
        cart_total: cart
          .reduce((total, item) => total + item.price * item.quantity, 0)
          .toFixed(2),
        timestamp: new Date().toISOString(),
      },
    };

    // Debug: Log what we're sending to the server
    console.log("📤 Sending to server:", JSON.stringify(sessionData, null, 2));

    // Call backend to create checkout session
    const apiUrl = `${window.STRIPE_CONFIG.apiBaseUrl}/api/create-checkout-session`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log("❌ Server error response:", errorData);

      // Show validation details if available
      if (errorData.details && Array.isArray(errorData.details)) {
        console.log("🔍 Validation details:", errorData.details);
      }

      throw new Error(
        errorData.error ||
          "Erreur lors de la création de la session de paiement"
      );
    }

    const session = await response.json();

    // Redirect to Stripe Checkout
    const stripe = Stripe(window.STRIPE_CONFIG.publishableKey);
    const result = await stripe.redirectToCheckout({
      sessionId: session.sessionId,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error("Checkout error:", error);
    showNotification(
      "Erreur lors du processus de paiement: " + error.message,
      "error"
    );

    // Reset button state
    const checkoutBtn = document.querySelector(".cart-checkout");
    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.textContent = "Procéder au paiement";
    }
  }
}

// Add checkout event listener
document.addEventListener("DOMContentLoaded", function () {
  const checkoutBtn = document.querySelector(".cart-checkout");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", proceedToCheckout);
  }
});

// Header scroll effect
window.addEventListener("scroll", function () {
  const header = document.querySelector(".header");
  if (window.scrollY > 100) {
    header.style.background = "rgba(26, 26, 46, 0.98)";
  } else {
    header.style.background = "rgba(26, 26, 46, 0.95)";
  }
});

// Parallax effect for hero section
window.addEventListener("scroll", function () {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll(".float-element");

  parallaxElements.forEach((element, index) => {
    const speed = 0.5 + index * 0.1;
    element.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// Newsletter modal functionality
function openNewsletter() {
  const modal = document.getElementById("newsletter-modal");
  const overlay = document.getElementById("newsletter-overlay");

  modal.classList.add("open");
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeNewsletter() {
  const modal = document.getElementById("newsletter-modal");
  const overlay = document.getElementById("newsletter-overlay");

  modal.classList.remove("open");
  overlay.classList.remove("open");
  document.body.style.overflow = "auto";
}

function submitNewsletter(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const email = formData.get("email");
  const name = formData.get("name");
  const updates = formData.get("updates") === "on";

  // Here you would typically send this data to your email service
  console.log("Newsletter subscription:", {
    email,
    name,
    updates,
    timestamp: new Date().toISOString(),
  });

  // Show success message
  showNotification("Merci ! Vous serez averti dès la sortie du Karu Deck 🎉");

  // Close modal
  closeNewsletter();

  // Reset form
  event.target.reset();

  // Track the subscription
  trackEvent("newsletter_subscription", {
    email: email,
    has_name: !!name,
    wants_updates: updates,
  });
}

// Email subscription (for newsletter/updates)
function subscribeToNewsletter(email) {
  // Integrate with your email service (Mailchimp, Klaviyo, etc.)
  console.log("Subscribing email:", email);
  showNotification("Merci pour votre inscription !");
}

// Add newsletter form if needed
function createNewsletterForm() {
  const newsletter = document.createElement("div");
  newsletter.style.cssText = `
        background: rgba(37, 42, 52, 0.8);
        padding: 2rem;
        border-radius: 15px;
        text-align: center;
        margin: 2rem 0;
        border: 1px solid rgba(0, 166, 251, 0.2);
    `;

  newsletter.innerHTML = `
        <h3 style="color: white; margin-bottom: 1rem;">Restez informé</h3>
        <p style="color: rgba(255,255,255,0.8); margin-bottom: 1.5rem;">
            Recevez les dernières nouvelles sur le Karu Deck
        </p>
        <div style="display: flex; gap: 1rem; max-width: 400px; margin: 0 auto;">
            <input type="email" placeholder="Votre email"
                   style="flex: 1; padding: 0.75rem; border-radius: 25px; border: none; background: rgba(255,255,255,0.1); color: white;"
                   id="newsletter-email">
            <button onclick="subscribeToNewsletter(document.getElementById('newsletter-email').value)"
                    style="padding: 0.75rem 1.5rem; border-radius: 25px; border: none; background: linear-gradient(135deg, #00A6FB, #FF2E63); color: white; cursor: pointer;">
                S'inscrire
            </button>
        </div>
    `;

  return newsletter;
}

// Performance optimization
function optimizeImages() {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.loading = "lazy";
  });
}

// Call optimization functions
document.addEventListener("DOMContentLoaded", optimizeImages);

// Analytics tracking (replace with your analytics service)
function trackEvent(eventName, eventData) {
  // Google Analytics 4 example
  if (typeof gtag !== "undefined") {
    gtag("event", eventName, eventData);
  }

  // Console log for development
  console.log("Event tracked:", eventName, eventData);
}

// Track button clicks
document.addEventListener("click", function (e) {
  if (e.target.matches(".btn-primary")) {
    trackEvent("button_click", {
      button_text: e.target.textContent.trim(),
      button_location: e.target.closest("section")?.id || "unknown",
    });
  }
});

// Track game mode interactions
document.addEventListener("click", function (e) {
  if (e.target.closest(".game-mode-card")) {
    const modeCard = e.target.closest(".game-mode-card");
    const modeTitle = modeCard.querySelector(".mode-title")?.textContent;
    trackEvent("game_mode_viewed", {
      mode: modeTitle,
    });
  }
});

// Error handling
window.addEventListener("error", function (e) {
  console.error("JavaScript error:", e.error);
  // You might want to send this to an error tracking service
});

// Service Worker registration removed - we don't need PWA features for now
// If you want to add PWA features later, create sw.js and uncomment this:
/*
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/sw.js")
      .then(function (registration) {
        console.log("SW registered: ", registration);
      })
      .catch(function (registrationError) {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
*/
