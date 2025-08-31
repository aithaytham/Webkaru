// Stripe Configuration for Karu Deck Preorders
// Replace with your actual Stripe keys
const STRIPE_CONFIG = {
  // Your Stripe publishable key (starts with pk_)
  // ⚠️ IMPORTANT: Set your publishable key via environment variable in production
  // For development, you can use a test key here temporarily
  publishableKey: "pk_test_YOUR_PUBLISHABLE_KEY_HERE", // Replace with your publishable key
  // For testing, use your test publishable key from Stripe Dashboard

  // Backend API configuration
  apiBaseUrl:
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : window.location.origin, // Use same origin in production

  // Shipping configuration
  shippingRateId: "shr_1S1wPkAZn1zIIHOSu8Ly5BAx", // Livraison fees

  // Products configuration with Stripe Price IDs
  products: {
    standard: {
      id: "prod_Sxs50E7A1qntTL", // Updated product ID
      title: "Karu Deck - Standard Edition",
      price: 1599, // Price in cents (15.99 EUR)
      currency: "eur",
      stripePriceId: "price_1S1wLUAZn1zIIHOSDPcy58fB", // Updated standard deck price ID
      description: "100+ cartes anime, design exclusif, boîte de rangement",
      images: ["https://your-domain.com/assets/karu-deck-standard.jpg"],
    },
    competition: {
      id: "prod_SxvBGjAcP6CJI8", // Updated product ID
      title: "Karu Deck - Compétition Edition",
      price: 2500, // Price in cents (25.00 EUR)
      currency: "eur",
      stripePriceId: "price_1S1zLAAZn1zIIHOSWMOpUPpZ", // Updated competition deck price ID
      description:
        "100+ cartes anime, boîte collector magnétique, cartes exclusives limitées",
      images: ["https://your-domain.com/assets/karu-deck-competition.jpg"],
    },
  },

  // Stripe Checkout configuration
  checkout: {
    mode: "payment",
    currency: "eur",
    locale: "fr",

    // URLs for success and cancellation (replace with your domain)
    successUrl:
      "https://your-domain.com/success?session_id={CHECKOUT_SESSION_ID}",
    cancelUrl: "https://your-domain.com/cancel",

    // Shipping configuration
    shippingAddressCollection: {
      allowedCountries: ["FR", "BE", "CH", "LU", "MC"], // Adjust as needed
    },

    // Billing address collection
    billingAddressCollection: "required",

    // Custom fields for preorders
    customFields: [
      {
        key: "preorder_notification",
        label: {
          type: "custom",
          custom: "Notifications par email",
        },
        type: "dropdown",
        dropdown: {
          options: [
            {
              label: "Oui, je souhaite être informé",
              value: "yes",
            },
            {
              label: "Non merci",
              value: "no",
            },
          ],
        },
      },
    ],

    // Automatic tax calculation (if you have it configured in Stripe)
    automaticTax: {
      enabled: false, // Set to true if you have automatic tax configured
    },
  },
};

// Export configuration
if (typeof module !== "undefined" && module.exports) {
  module.exports = STRIPE_CONFIG;
} else {
  window.STRIPE_CONFIG = STRIPE_CONFIG;
  console.log("✅ STRIPE_CONFIG loaded successfully", STRIPE_CONFIG);
}
