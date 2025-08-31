# 🔐 Karu Deck - Secure Setup Guide

## ⚠️ IMPORTANT: API Key Security

This repository has been cleaned of all hardcoded API keys to comply with GitHub security policies. You MUST configure your Stripe keys as environment variables.

## 🚀 Quick Setup

### 1. Clone & Install

```bash
git clone https://github.com/aithaytham/Webkaru.git
cd Webkaru
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp env.example .env
```

Edit `.env` with your actual Stripe keys:

```env
# Required: Your Stripe API keys

STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY_HERE

# Application settings
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://yourdomain.com
```

### 3. Update Frontend Configuration

Edit `stripe-config.js`:

```javascript
publishableKey: "pk_live_YOUR_PUBLISHABLE_KEY_HERE";
```

### 4. Test Locally

```bash
npm start
```

### 5. Deploy to Azure

1. **Create Azure Web App**
2. **Configure Environment Variables** in Azure portal
3. **Deploy** via GitHub integration or ZIP upload

## 🔑 Your Stripe Keys

**⚠️ IMPORTANT: Get your keys from Stripe Dashboard**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable key** (starts with `pk_live_`)
3. Copy your **Secret key** (starts with `sk_live_`)
4. Use these keys in your `.env` file and `stripe-config.js`

## 🛡️ Security Checklist

- [ ] ✅ API keys removed from code
- [ ] ✅ `.env` file in `.gitignore`
- [ ] ✅ Environment variables configured
- [ ] ✅ HTTPS enabled in production
- [ ] ✅ Webhook secrets configured

## 📝 Next Steps

1. Set up your environment variables
2. Test the application locally
3. Deploy to Azure with proper environment configuration
4. Configure webhook endpoints in Stripe dashboard

---

**🔐 Never commit API keys to Git again!** Always use environment variables.
