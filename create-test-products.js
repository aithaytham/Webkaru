// Script to create test products in Stripe for local development
require("dotenv").config();
const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY || "sk_test_[YOUR_SECRET_KEY_HERE]"
);

async function createTestProducts() {
  console.log("🚀 Creating test products in Stripe...");

  try {
    // Check if products already exist
    const existingProducts = await stripe.products.list({ limit: 10 });
    const existingKaruProducts = existingProducts.data.filter((p) =>
      p.name.includes("Karu Deck")
    );

    if (existingKaruProducts.length > 0) {
      console.log("✅ Found existing Karu products:");

      for (const product of existingKaruProducts) {
        const prices = await stripe.prices.list({ product: product.id });
        console.log(`📦 ${product.name}`);
        console.log(`   Product ID: ${product.id}`);
        if (prices.data.length > 0) {
          console.log(`   Price ID: ${prices.data[0].id}`);
          console.log(`   Amount: ${prices.data[0].unit_amount / 100}€`);
        }
        console.log("");
      }

      return;
    }

    // Create Standard Deck Product
    console.log("📦 Creating Karu Deck - Standard Edition...");
    const standardProduct = await stripe.products.create({
      name: "Karu Deck - Standard Edition",
      description: "100+ cartes anime, design exclusif, boîte de rangement",
      images: [],
      metadata: {
        type: "standard",
        category: "card-game",
        source: "karu-preorder",
      },
    });

    const standardPrice = await stripe.prices.create({
      unit_amount: 1499, // 14.99 EUR in cents
      currency: "eur",
      product: standardProduct.id,
      metadata: {
        type: "standard",
      },
    });

    console.log(`✅ Standard Product Created:`);
    console.log(`   Product ID: ${standardProduct.id}`);
    console.log(`   Price ID: ${standardPrice.id}`);
    console.log(`   Amount: 14.99€`);
    console.log("");

    // Create Competition Deck Product
    console.log("📦 Creating Karu Deck - Competition Edition...");
    const competitionProduct = await stripe.products.create({
      name: "Karu Deck - Competition Edition",
      description:
        "100+ cartes anime, boîte collector magnétique, cartes exclusives limitées",
      images: [],
      metadata: {
        type: "competition",
        category: "card-game",
        source: "karu-preorder",
      },
    });

    const competitionPrice = await stripe.prices.create({
      unit_amount: 1999, // 19.99 EUR in cents
      currency: "eur",
      product: competitionProduct.id,
      metadata: {
        type: "competition",
      },
    });

    console.log(`✅ Competition Product Created:`);
    console.log(`   Product ID: ${competitionProduct.id}`);
    console.log(`   Price ID: ${competitionPrice.id}`);
    console.log(`   Amount: 19.99€`);
    console.log("");

    // Generate updated stripe-config.js content
    console.log("🔧 Updated stripe-config.js content:");
    console.log("----------------------------------------");
    console.log(`
Update your stripe-config.js with these Price IDs:

products: {
    standard: {
        id: "karu-deck-standard",
        title: "Karu Deck - Standard Edition",
        price: 1499,
        currency: "eur",
        stripePriceId: "${standardPrice.id}",
        description: "100+ cartes anime, design exclusif, boîte de rangement",
        images: ["https://your-domain.com/assets/karu-deck-standard.jpg"],
    },
    competition: {
        id: "karu-deck-competition",
        title: "Karu Deck - Competition Edition",
        price: 1999,
        currency: "eur",
        stripePriceId: "${competitionPrice.id}",
        description: "100+ cartes anime, boîte collector magnétique, cartes exclusives limitées",
        images: ["https://your-domain.com/assets/karu-deck-competition.jpg"],
    },
},
        `);
    console.log("----------------------------------------");

    console.log("🎉 Test products created successfully!");
    console.log("🔧 Next steps:");
    console.log("1. Update stripe-config.js with the Price IDs above");
    console.log("2. Restart your server");
    console.log("3. Test the payment flow");
  } catch (error) {
    console.error("❌ Error creating test products:", error.message);
    if (error.type === "StripeAuthenticationError") {
      console.error("🔑 Please check your Stripe secret key is correct");
    }
  }
}

// Run the script
createTestProducts();
