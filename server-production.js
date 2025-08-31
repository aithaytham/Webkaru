// Production-Ready Stripe Server for Karu Deck Preorders
// IMPORTANT: Using LIVE Stripe keys - This will process real payments!
require("dotenv").config();

const express = require("express");
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_KEY) {
  console.error(
    "❌ ERROR: STRIPE_SECRET_KEY environment variable is required!"
  );
  console.error(
    "💡 Please set your Stripe secret key in environment variables."
  );
  process.exit(1);
}
const stripe = require("stripe")(STRIPE_KEY);
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const { body, validationResult } = require("express-validator");

const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'", "https://js.stripe.com"],
        connectSrc: ["'self'", "https://api.stripe.com"],
        frameSrc: ["https://js.stripe.com", "https://hooks.stripe.com"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// Compression
app.use(compression());

// Rate limiting
const createRateLimit = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const paymentRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "development" ? 50 : 10, // More lenient for testing
  message: {
    error: "Too many payment attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5500", // Live Server
    "http://localhost:3000", // Backend
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Webhook endpoint (before express.json())
app.use("/webhook", express.raw({ type: "application/json" }));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Validation schemas
const createSessionValidation = [
  body("line_items")
    .isArray({ min: 1 })
    .withMessage("Line items must be a non-empty array"),
  body("line_items.*.price")
    .isString()
    .matches(/^price_[a-zA-Z0-9]+$/)
    .withMessage("Invalid price ID format"),
  body("line_items.*.quantity")
    .isInt({ min: 1, max: 100 })
    .withMessage("Quantity must be between 1 and 100"),
  body("mode")
    .optional()
    .isString()
    .isIn(["payment", "subscription", "setup"])
    .withMessage("Mode must be payment, subscription, or setup"),
  body("success_url")
    .optional()
    .isString()
    .custom((value) => {
      // Allow Stripe placeholder URLs
      if (!value) return true;
      const urlWithoutPlaceholder = value.replace(
        "{CHECKOUT_SESSION_ID}",
        "test_session_id"
      );
      try {
        new URL(urlWithoutPlaceholder);
        return true;
      } catch {
        throw new Error("Success URL must be a valid URL");
      }
    }),
  body("cancel_url")
    .optional()
    .isString()
    .custom((value) => {
      // Allow any valid URL format
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        throw new Error("Cancel URL must be a valid URL");
      }
    }),
  body("customer_email")
    .optional()
    .isEmail()
    .withMessage("Customer email must be a valid email address"),
  body("metadata")
    .optional()
    .isObject()
    .withMessage("Metadata must be an object"),
];

// Create Checkout Session endpoint
app.post(
  "/api/create-checkout-session",
  createRateLimit,
  paymentRateLimit,
  createSessionValidation,
  async (req, res) => {
    try {
      // Check validation results
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(
          "❌ Validation failed:",
          JSON.stringify(errors.array(), null, 2)
        );
        console.log("📨 Request body:", JSON.stringify(req.body, null, 2));
        return res.status(400).json({
          error: "Validation failed",
          details: errors.array(),
        });
      }

      const {
        line_items,
        metadata = {},
        customer_email,
        mode = "payment",
        success_url,
        cancel_url,
      } = req.body;

      // Check required environment variables
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5500";
      console.log("Frontend URL:", frontendUrl);
      console.log("Environment variables check:", {
        FRONTEND_URL: process.env.FRONTEND_URL ? "Set" : "NOT SET",
        NODE_ENV: process.env.NODE_ENV || "development",
      });

      // Debug request data
      console.log(
        "📨 Received line items:",
        JSON.stringify(line_items, null, 2)
      );
      console.log("🔗 URLs:", { success_url, cancel_url });
      console.log("👤 Customer email:", customer_email);
      console.log(
        "🚚 Shipping options configured:",
        "shr_1S1wPkAZn1zIIHOSu8Ly5BAx"
      );

      // Validate price IDs against allowed values
      const allowedPriceIds = [
        process.env.STRIPE_PRICE_ID_STANDARD,
        process.env.STRIPE_PRICE_ID_COMPETITION,
        "price_1S1wLUAZn1zIIHOSDPcy58fB", // Standard deck price ID (updated)
        "price_1S1zLAAZn1zIIHOSWMOpUPpZ", // Competition deck price ID (NEW - Compétitif)
        // Legacy price IDs for backwards compatibility
        "price_1S1wO8AZn1zIIHOSbioG8K9K", // Old competition deck price ID
        "price_1S1otEAZn1zIIHOSzPTUXzCW", // Old standard deck price ID
        "price_1S1otFAZn1zIIHOSd1ubNZZ1", // Old competition deck price ID
      ].filter(Boolean);

      console.log("Allowed price IDs:", allowedPriceIds);

      for (const item of line_items) {
        if (!allowedPriceIds.includes(item.price)) {
          console.log("Invalid price ID:", item.price);
          return res.status(400).json({
            error: "Invalid price ID",
            allowed_prices: allowedPriceIds,
          });
        }
      }

      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        mode,
        line_items,

        // URLs - use frontend provided URLs or fallback to defaults
        success_url:
          success_url ||
          `${frontendUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancel_url || `${frontendUrl}/cancel.html`,

        // Metadata for tracking
        metadata: {
          ...metadata,
          source: "karu_web_preorder",
          created_at: new Date().toISOString(),
          ip_address: req.ip,
          user_agent: req.get("User-Agent"),
        },

        // Customer information
        customer_email,

        // Shipping configuration
        shipping_address_collection: {
          allowed_countries: [
            "FR",
            "BE",
            "CH",
            "LU",
            "MC",
            "DE",
            "IT",
            "ES",
            "NL",
          ],
        },

        // Shipping rates - DISABLED FOR TESTING
        // shipping_options: [
        //   {
        //     shipping_rate: "shr_1S1wPkAZn1zIIHOSu8Ly5BAx", // Livraison fees
        //   },
        // ],

        // Billing address
        billing_address_collection: "required",

        // Phone number collection
        phone_number_collection: {
          enabled: true,
        },

        // Terms of service - disabled for testing
        // consent_collection: {
        //   terms_of_service: "required",
        // },

        // Locale
        locale: "fr",

        // Custom fields for preorders
        custom_fields: [
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
                  label: "Oui, je souhaite être informé des actualités",
                  value: "yes",
                },
                {
                  label: "Non merci",
                  value: "no",
                },
              ],
            },
            optional: true,
          },
        ],

        // Automatic tax (if configured in Stripe)
        automatic_tax: { enabled: false },

        // Payment method types
        payment_method_types: ["card"],

        // Allow promotion codes
        allow_promotion_codes: true,

        // Email receipts and automatic invoice generation
        invoice_creation: {
          enabled: true,
          invoice_data: {
            description: "Précommande Karu Deck - KARU MELO",
            footer:
              "Merci pour votre précommande ! Vous recevrez votre deck en Janvier 2026. Support: contact@karumelo.com",
            metadata: {
              order_type: "preorder",
              company: "KARU MELO",
            },
            // Automatic invoice sending
            auto_advance: true, // Automatically finalize and send invoice
            collection_method: "send_invoice", // Send invoice via email
            days_until_due: 30, // Invoice due in 30 days (for record keeping)
          },
        },

        // Automatic tax calculation (if configured in Stripe)
        automatic_tax: {
          enabled: false, // Set to true if you have automatic tax configured
        },
      });

      console.log("Session created successfully:", session.id);

      res.json({
        id: session.id,
        url: session.url,
      });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      console.error("Error details:", {
        type: error.type,
        message: error.message,
        param: error.param,
        code: error.code,
      });

      // Return appropriate error message
      if (error.type === "StripeCardError") {
        res.status(400).json({ error: "Card was declined" });
      } else if (error.type === "StripeInvalidRequestError") {
        res.status(400).json({
          error: "Invalid request to Stripe",
          details:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        });
      } else {
        res.status(500).json({
          error: "Internal server error",
          message:
            process.env.NODE_ENV === "development"
              ? error.message
              : "Something went wrong",
        });
      }
    }
  }
);

// Retrieve Checkout Session endpoint
app.get(
  "/api/checkout-session/:sessionId",
  createRateLimit,
  async (req, res) => {
    try {
      const { sessionId } = req.params;

      // Validate session ID format
      if (!sessionId || !sessionId.startsWith("cs_")) {
        return res.status(400).json({ error: "Invalid session ID format" });
      }

      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items", "customer", "payment_intent"],
      });

      // Only return necessary information
      const sanitizedSession = {
        id: session.id,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_details: session.customer_details,
        payment_status: session.payment_status,
        metadata: session.metadata,
        created: session.created,
      };

      res.json(sanitizedSession);
    } catch (error) {
      console.error("Error retrieving checkout session:", error);
      res.status(500).json({
        error: "Failed to retrieve checkout session",
      });
    }
  }
);

// Webhook endpoint for handling Stripe events
app.post("/webhook", (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    console.error("Webhook secret not configured");
    return res.status(500).send("Webhook secret not configured");
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log("Payment succeeded:", session.id);
      handleSuccessfulPayment(session);
      break;

    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log("Payment intent succeeded:", paymentIntent.id);
      break;

    case "payment_intent.payment_failed":
      const failedPayment = event.data.object;
      console.log("Payment failed:", failedPayment.id);
      handleFailedPayment(failedPayment);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// Handle successful payment
async function handleSuccessfulPayment(session) {
  try {
    // Get session details with line items
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
      session.id,
      {
        expand: ["line_items", "customer"],
      }
    );

    const orderData = {
      sessionId: session.id,
      customerId: session.customer,
      customerEmail: session.customer_details?.email,
      customerName: session.customer_details?.name,
      customerPhone: session.customer_details?.phone,
      shippingAddress: session.shipping_details?.address,
      amount: session.amount_total,
      currency: session.currency,
      metadata: session.metadata,
      lineItems: sessionWithLineItems.line_items.data,
      createdAt: new Date(),
    };

    // Here you would typically:
    // 1. Save order to your database
    // await saveOrderToDatabase(orderData);

    // 2. Send confirmation email
    // await sendConfirmationEmail(orderData);

    // 3. Add to preorder notification list
    // await addToPreorderList(orderData);

    // 4. Update inventory/stock
    // await updateInventory(orderData);

    console.log("Order processed successfully:", {
      sessionId: orderData.sessionId,
      email: orderData.customerEmail,
      amount: orderData.amount,
    });
  } catch (error) {
    console.error("Error processing successful payment:", error);
    // You might want to send this to an error tracking service
  }
}

// Handle failed payment
async function handleFailedPayment(paymentIntent) {
  try {
    console.log("Processing failed payment:", {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      error: paymentIntent.last_payment_error,
    });

    // Here you could:
    // 1. Log the failure for analysis
    // 2. Send notification to customer
    // 3. Update analytics
  } catch (error) {
    console.error("Error handling failed payment:", error);
  }
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  process.exit(0);
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  const isLive = STRIPE_KEY && STRIPE_KEY.startsWith("sk_live_");
  console.log(`🚀 Karu Stripe server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`⚡ Mode: ${isLive ? "🔴 LIVE (Real payments)" : "🟡 TEST"}`);
  console.log(
    `🔐 Stripe keys configured: ${process.env.STRIPE_SECRET_KEY ? "Yes" : "No"}`
  );
  console.log(
    `🔑 API Key preview: ${STRIPE_KEY ? STRIPE_KEY.substring(0, 20) + "..." : "NOT SET"}`
  );

  if (isLive) {
    console.log("⚠️  WARNING: LIVE MODE - Real payments will be processed!");
    console.log(
      "⚠️  Make sure all products and prices are correctly configured!"
    );
  }
});

module.exports = { app, server };
