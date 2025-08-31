// Script to get Price IDs from Product IDs
require("dotenv").config();
const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY || "sk_test_[YOUR_SECRET_KEY_HERE]"
);

async function getPriceIds() {
  console.log("🔍 Getting Price IDs from Product IDs...");

  const productIds = [
    "prod_SxkOghpjBJUPNG", // Standard deck
    "prod_SxkOb1aiHhu2OD", // Competition deck
  ];

  try {
    for (const productId of productIds) {
      console.log(`\n📦 Product: ${productId}`);

      // Get product details
      const product = await stripe.products.retrieve(productId);
      console.log(`   Name: ${product.name}`);
      console.log(`   Description: ${product.description}`);

      // Get prices for this product
      const prices = await stripe.prices.list({
        product: productId,
        active: true,
      });

      if (prices.data.length > 0) {
        prices.data.forEach((price, index) => {
          console.log(`   Price ${index + 1}:`);
          console.log(`     ID: ${price.id}`);
          console.log(`     Amount: ${price.unit_amount / 100}€`);
          console.log(`     Currency: ${price.currency}`);
        });
      } else {
        console.log("   ❌ No prices found for this product");
      }
    }

    console.log("\n🔧 Configuration Update Needed:");
    console.log("=====================================");

    // Get the prices again for configuration
    const standardPrices = await stripe.prices.list({ product: productIds[0] });
    const competitionPrices = await stripe.prices.list({
      product: productIds[1],
    });

    const standardPriceId = standardPrices.data[0]?.id || "NOT_FOUND";
    const competitionPriceId = competitionPrices.data[0]?.id || "NOT_FOUND";

    console.log(`
Update your stripe-config.js with these PRICE IDs:

products: {
    standard: {
        id: "karu-deck-standard",
        title: "Karu Deck - Standard Edition",
        price: ${standardPrices.data[0]?.unit_amount || 1499},
        currency: "eur",
        stripePriceId: "${standardPriceId}",
        description: "100+ cartes anime, design exclusif, boîte de rangement",
        images: ["https://your-domain.com/assets/karu-deck-standard.jpg"],
    },
    competition: {
        id: "karu-deck-competition",
        title: "Karu Deck - Competition Edition",
        price: ${competitionPrices.data[0]?.unit_amount || 1999},
        currency: "eur",
        stripePriceId: "${competitionPriceId}",
        description: "100+ cartes anime, boîte collector magnétique, cartes exclusives limitées",
        images: ["https://your-domain.com/assets/karu-deck-competition.jpg"],
    },
},
        `);

    console.log("🎯 Quick Copy-Paste:");
    console.log(`Standard Price ID: ${standardPriceId}`);
    console.log(`Competition Price ID: ${competitionPriceId}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.type === "StripeAuthenticationError") {
      console.error("🔑 Please check your Stripe secret key");
    }
  }
}

// Set environment variables and run
process.env.STRIPE_SECRET_KEY = "sk_test_[YOUR_SECRET_KEY_HERE]";

getPriceIds();
