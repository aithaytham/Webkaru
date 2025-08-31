// Backend Example for Stripe Integration (Node.js/Express)
// This is an example of how your backend should handle Stripe payments

const express = require("express");
const stripe = require("stripe")(
  "sk_test_[YOUR_SECRET_KEY_HERE]"
); // Replace with your secret key
const app = express();

app.use(express.json());

// CORS configuration (adjust for your domain)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://your-domain.com");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  next();
});

// Create Checkout Session endpoint
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const {
      line_items,
      mode = "payment",
      success_url,
      cancel_url,
      metadata = {},
      shipping_address_collection,
      billing_address_collection,
      custom_fields,
      automatic_tax,
    } = req.body;

    // Validate required fields
    if (!line_items || line_items.length === 0) {
      return res.status(400).json({ error: "Line items are required" });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items,
      success_url:
        success_url ||
        "https://your-domain.com/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: cancel_url || "https://your-domain.com/cancel",

      // Metadata for tracking
      metadata: {
        ...metadata,
        source: "karu_web_preorder",
        created_at: new Date().toISOString(),
      },

      // Shipping configuration
      shipping_address_collection: shipping_address_collection || {
        allowed_countries: ["FR", "BE", "CH", "LU", "MC"],
      },

      // Billing address
      billing_address_collection: billing_address_collection || "required",

      // Custom fields
      custom_fields: custom_fields || [
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

      // Automatic tax (if configured)
      automatic_tax: automatic_tax || { enabled: false },

      // Customer email collection
      customer_email: req.body.customer_email,

      // Phone number collection
      phone_number_collection: {
        enabled: true,
      },

      // Terms of service acceptance
      consent_collection: {
        terms_of_service: "required",
      },

      // Locale
      locale: "fr",
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({
      error: "Failed to create checkout session",
      details: error.message,
    });
  }
});

// Retrieve Checkout Session endpoint (for success page)
app.get("/api/checkout-session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer"],
    });

    res.json(session);
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    res.status(500).json({
      error: "Failed to retrieve checkout session",
      details: error.message,
    });
  }
});

// Webhook endpoint for handling Stripe events
app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = "whsec_XXXX"; // Replace with your webhook secret

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log("Payment succeeded:", session.id);

      // Here you would:
      // 1. Save order to your database
      // 2. Send confirmation email
      // 3. Update inventory
      // 4. Add customer to preorder list
      handleSuccessfulPayment(session);
      break;

    case "payment_intent.payment_failed":
      const paymentIntent = event.data.object;
      console.log("Payment failed:", paymentIntent.id);

      // Handle failed payment
      handleFailedPayment(paymentIntent);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
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

    // Extract order information
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
    };

    // Save to database (implement your database logic here)
    // await saveOrderToDatabase(orderData);

    // Send confirmation email (implement your email logic here)
    // await sendConfirmationEmail(orderData);

    // Add to preorder notification list
    // await addToPreorderList(orderData);

    console.log("Order processed successfully:", orderData);
  } catch (error) {
    console.error("Error processing successful payment:", error);
  }
}

// Handle failed payment
async function handleFailedPayment(paymentIntent) {
  try {
    // Log failed payment for analysis
    console.log("Payment failed:", {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      last_payment_error: paymentIntent.last_payment_error,
    });

    // You could send an email to the customer about the failed payment
    // await sendPaymentFailedEmail(paymentIntent);
  } catch (error) {
    console.error("Error handling failed payment:", error);
  }
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for testing
module.exports = app;
