const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = async function (context, req) {
  // CORS headers
  context.res = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    },
  };

  if (req.method === "OPTIONS") {
    context.res.status = 200;
    return;
  }

  try {
    const {
      line_items,
      mode = "payment",
      success_url,
      cancel_url,
      metadata,
    } = req.body;

    const allowedPriceIds = [
      "price_1S1otEAZn1zIIHOSzPTUXzCW", // Standard
      "price_1S1zLAAZn1zIIHOSWMOpUPpZ", // Competition
    ];

    // Validation
    if (!line_items?.length) {
      context.res.status = 400;
      context.res.body = { error: "Invalid line_items" };
      return;
    }

    for (const item of line_items) {
      if (!allowedPriceIds.includes(item.price)) {
        context.res.status = 400;
        context.res.body = { error: "Invalid price ID" };
        return;
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode,
      success_url:
        success_url ||
        `${process.env.FRONTEND_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${process.env.FRONTEND_URL}/cancel.html`,
      metadata: metadata || {},
      invoice_creation: {
        enabled: true,
        invoice_data: {
          metadata: metadata || {},
          footer: "Merci pour votre commande Karu Deck! 🎴",
        },
      },
    });

    context.res.body = { sessionId: session.id };
  } catch (error) {
    context.log.error("Stripe error:", error);
    context.res.status = 500;
    context.res.body = { error: "Internal server error" };
  }
};
