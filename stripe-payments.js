// Stripe Payment Integration for Karu Deck Preorders
class KaruStripePayments {
  constructor(config) {
    this.config = config;
    this.stripe = null;
    this.isInitialized = false;

    this.init();
  }

  // Initialize Stripe
  async init() {
    try {
      // Load Stripe.js if not already loaded
      if (!window.Stripe) {
        await this.loadStripeJS();
      }

      // Initialize Stripe with publishable key
      this.stripe = Stripe(this.config.publishableKey);
      this.isInitialized = true;

      console.log("Stripe initialized successfully");

      // Initialize payment buttons
      this.initPaymentButtons();
    } catch (error) {
      console.error("Failed to initialize Stripe:", error);
      this.showError("Erreur d'initialisation du système de paiement");
    }
  }

  // Load Stripe.js dynamically
  loadStripeJS() {
    return new Promise((resolve, reject) => {
      if (window.Stripe) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Initialize payment buttons
  initPaymentButtons() {
    // Add Stripe payment option to existing buttons
    const checkoutButtons = document.querySelectorAll(".checkout-btn");
    checkoutButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleCheckout();
      });
    });

    // Add individual product payment buttons
    const productButtons = document.querySelectorAll("[data-stripe-product]");
    productButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const productType = button.dataset.stripeProduct;
        this.buyNow(productType);
      });
    });
  }

  // Handle cart checkout
  async handleCheckout() {
    if (!this.isInitialized) {
      this.showError("Système de paiement non initialisé");
      return;
    }

    try {
      // Get cart items from the existing cart system
      const cartItems = this.getCartItems();

      if (cartItems.length === 0) {
        this.showError("Votre panier est vide");
        return;
      }

      // Show loading state
      this.setLoadingState(true);

      // Create Stripe checkout session
      const session = await this.createCheckoutSession(cartItems);

      // Redirect to Stripe Checkout
      const result = await this.stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      this.showError("Erreur lors du processus de paiement: " + error.message);
      this.setLoadingState(false);
    }
  }

  // Buy now for a single product
  async buyNow(productType, quantity = 1) {
    if (!this.isInitialized) {
      this.showError("Système de paiement non initialisé");
      return;
    }

    const product = this.config.products[productType];
    if (!product) {
      this.showError("Produit non trouvé");
      return;
    }

    try {
      this.setLoadingState(true);

      const lineItems = [
        {
          price: product.stripePriceId,
          quantity: quantity,
        },
      ];

      const session = await this.createCheckoutSession(lineItems, {
        mode: "payment",
        metadata: {
          product_type: productType,
          is_preorder: "true",
        },
      });

      // Redirect to Stripe Checkout
      const result = await this.stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error("Buy now error:", error);
      this.showError("Erreur lors du processus de paiement: " + error.message);
      this.setLoadingState(false);
    }
  }

  // Create Stripe Checkout Session
  async createCheckoutSession(lineItems, options = {}) {
    const sessionData = {
      ...this.config.checkout,
      line_items: lineItems,
      metadata: {
        source: "karu_web_preorder",
        timestamp: new Date().toISOString(),
        ...options.metadata,
      },
      ...options,
    };

    // Call your backend to create the session
    const apiUrl = `${this.config.apiBaseUrl}/create-checkout-session`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create checkout session");
    }

    return await response.json();
  }

  // Get cart items from existing cart system
  getCartItems() {
    // Convert cart items to Stripe line items format
    const cart = JSON.parse(localStorage.getItem("karuCart") || "[]");

    return cart.map((item) => {
      // If item has stripePriceId directly, use it
      if (item.stripePriceId) {
        return {
          price: item.stripePriceId,
          quantity: item.quantity,
        };
      }

      // Fallback to config lookup
      const product = this.config.products[item.type];
      if (!product) {
        console.error("Product not found in config:", item.type);
        throw new Error(`Product ${item.type} not found`);
      }

      return {
        price: product.stripePriceId,
        quantity: item.quantity,
      };
    });
  }

  // Show loading state
  setLoadingState(isLoading) {
    const buttons = document.querySelectorAll(
      ".checkout-btn, [data-stripe-product]"
    );
    buttons.forEach((button) => {
      if (isLoading) {
        button.disabled = true;
        button.classList.add("loading");
        const originalText = button.textContent;
        button.dataset.originalText = originalText;
        button.textContent = "Traitement...";
      } else {
        button.disabled = false;
        button.classList.remove("loading");
        button.textContent = button.dataset.originalText || button.textContent;
      }
    });
  }

  // Show error message
  showError(message) {
    // Use existing notification system if available
    if (typeof showNotification === "function") {
      showNotification(message, "error");
    } else {
      alert(message);
    }
  }

  // Show success message
  showSuccess(message) {
    if (typeof showNotification === "function") {
      showNotification(message, "success");
    } else {
      alert(message);
    }
  }

  // Handle successful payment (call this on success page)
  async handlePaymentSuccess(sessionId) {
    try {
      const apiUrl = `${this.config.apiBaseUrl}/api/checkout-session/${sessionId}`;
      const response = await fetch(apiUrl, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to retrieve session");
      }

      const session = await response.json();

      // Clear cart
      localStorage.removeItem("karuCart");

      // Show success message
      this.showSuccess(
        "Paiement réussi ! Vous recevrez un email de confirmation."
      );

      // Track conversion if analytics are available
      if (typeof gtag === "function") {
        gtag("event", "purchase", {
          transaction_id: session.id,
          value: session.amount_total / 100,
          currency: session.currency,
          items:
            session.line_items?.data?.map((item) => ({
              item_id: item.price.id,
              item_name: item.description,
              quantity: item.quantity,
              price: item.amount_total / 100,
            })) || [],
        });
      }

      return session;
    } catch (error) {
      console.error("Error handling payment success:", error);
      this.showError("Erreur lors de la validation du paiement");
    }
  }
}

// Initialize Stripe payments when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  if (typeof STRIPE_CONFIG !== "undefined") {
    window.karuStripePayments = new KaruStripePayments(STRIPE_CONFIG);
  } else {
    console.error("STRIPE_CONFIG not found. Please include stripe-config.js");
  }
});

// Global functions for external use
window.stripeCheckout = function () {
  if (window.karuStripePayments) {
    window.karuStripePayments.handleCheckout();
  }
};

window.stripeBuyNow = function (productType, quantity = 1) {
  if (window.karuStripePayments) {
    window.karuStripePayments.buyNow(productType, quantity);
  }
};
