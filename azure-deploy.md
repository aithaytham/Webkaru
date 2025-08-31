# 🚀 Azure Web App Deployment Guide for Karu Stripe Server

## 📋 Prerequisites

1. **Azure Account** with active subscription
2. **Azure CLI** installed locally
3. **Node.js 18+** runtime
4. **Git** repository

## 🔧 Step 1: Prepare Your Application for Azure

### 1.1 Create web.config for Windows Azure App Service

Create `web.config` in the `web-preorder` folder:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="server-production.js" verb="*" modules="iisnode"/>
    </handlers>
    <rewrite>
      <rules>
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
          </conditions>
          <action type="Rewrite" url="server-production.js"/>
        </rule>
      </rules>
    </rewrite>
    <security>
      <requestFiltering>
        <hiddenSegments>
          <remove segment="bin"/>
        </hiddenSegments>
      </requestFiltering>
    </security>
    <httpErrors existingResponse="PassThrough" />
    <iisnode node_env="production" />
  </system.webServer>
</configuration>
```

### 1.2 Update package.json scripts

Ensure your `package.json` has the correct start script:

```json
{
  "scripts": {
    "start": "node server-production.js",
    "dev": "nodemon server-production.js"
  }
}
```

## 🌐 Step 2: Deploy to Azure Web App

### 2.1 Using Azure Portal (GUI Method)

1. **Create Web App:**

   - Go to [Azure Portal](https://portal.azure.com)
   - Click "Create a resource" → "Web App"
   - Fill in details:
     - **Subscription:** Your subscription
     - **Resource Group:** Create new "karu-stripe-rg"
     - **Name:** "karu-stripe-api" (must be globally unique)
     - **Runtime:** Node 18 LTS
     - **Operating System:** Windows or Linux
     - **Region:** West Europe (or closest to your users)
     - **Pricing:** Free F1 or Basic B1

2. **Configure Environment Variables:**

   - Go to your Web App → "Configuration" → "Application settings"
   - Add these variables:

   ```
   STRIPE_SECRET_KEY = sk_live_[YOUR_LIVE_SECRET_KEY_HERE]
   STRIPE_PUBLISHABLE_KEY = pk_live_YOUR_PUBLISHABLE_KEY_HERE
   STRIPE_WEBHOOK_SECRET = YTYT
   NODE_ENV = production
   PORT = 80
   FRONTEND_URL = https://your-frontend-domain.com
   BACKEND_URL = https://karu-stripe-api.azurewebsites.net
   RATE_LIMIT_WINDOW_MS = 900000
   RATE_LIMIT_MAX_REQUESTS = 100
   ```

3. **Deploy Code:**
   - Go to "Deployment Center"
   - Choose "GitHub" or "Local Git"
   - Connect your repository
   - Select branch: `main`
   - Auto-deployment: Enabled

### 2.2 Using Azure CLI (Command Line Method)

```bash
# Login to Azure
az login

# Create resource group
az group create --name karu-stripe-rg --location "West Europe"

# Create App Service plan
az appservice plan create --name karu-stripe-plan --resource-group karu-stripe-rg --sku B1 --is-linux

# Create Web App
az webapp create --resource-group karu-stripe-rg --plan karu-stripe-plan --name karu-stripe-api --runtime "NODE:18-lts"

# Configure environment variables
az webapp config appsettings set --resource-group karu-stripe-rg --name karu-stripe-api --settings \
  STRIPE_SECRET_KEY="sk_live_[YOUR_LIVE_SECRET_KEY_HERE]" \
  STRIPE_PUBLISHABLE_KEY="pk_live_YOUR_PUBLISHABLE_KEY_HERE" \
  STRIPE_WEBHOOK_SECRET="YTYT" \
  NODE_ENV="production" \
  FRONTEND_URL="https://your-frontend-domain.com" \
  BACKEND_URL="https://karu-stripe-api.azurewebsites.net"

# Deploy from local Git
az webapp deployment source config-local-git --resource-group karu-stripe-rg --name karu-stripe-api

# Get deployment URL
az webapp deployment list-publishing-credentials --resource-group karu-stripe-rg --name karu-stripe-api --query scmUri --output tsv
```

## 📦 Step 3: Deploy Your Code

### 3.1 Using Git Deployment

```bash
# Add Azure remote
git remote add azure https://<deployment-username>@karu-stripe-api.scm.azurewebsites.net/karu-stripe-api.git

# Deploy
git add .
git commit -m "Deploy Karu Stripe API to Azure"
git push azure main
```

### 3.2 Using ZIP Deployment

```bash
# Create deployment package
cd web-preorder
zip -r ../karu-stripe-deploy.zip . -x "node_modules/*" ".env" "*.log"

# Deploy using Azure CLI
az webapp deployment source config-zip --resource-group karu-stripe-rg --name karu-stripe-api --src ../karu-stripe-deploy.zip
```

## 🔗 Step 4: Configure Stripe Webhooks

1. **Update Stripe Webhook URL:**

   - Go to [Stripe Dashboard](https://dashboard.stripe.com) → Webhooks
   - Edit your webhook endpoint
   - URL: `https://karu-stripe-api.azurewebsites.net/webhook`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`

2. **Test Webhook:**
   - Use Stripe CLI: `stripe listen --forward-to https://karu-stripe-api.azurewebsites.net/webhook`

## 🔒 Step 5: Configure SSL and Security

### 5.1 Custom Domain (Optional)

```bash
# Map custom domain
az webapp config hostname add --resource-group karu-stripe-rg --webapp-name karu-stripe-api --hostname api.karu-melo.com

# Configure SSL
az webapp config ssl upload --resource-group karu-stripe-rg --name karu-stripe-api --certificate-file cert.pfx --certificate-password password
```

### 5.2 Update CORS Settings

```bash
# Configure CORS for your frontend domain
az webapp cors add --resource-group karu-stripe-rg --name karu-stripe-api --allowed-origins https://your-frontend-domain.com
```

## 📊 Step 6: Monitor and Logs

### 6.1 Enable Application Insights

```bash
# Create Application Insights
az monitor app-insights component create --app karu-stripe-insights --location "West Europe" --resource-group karu-stripe-rg

# Link to Web App
az webapp config appsettings set --resource-group karu-stripe-rg --name karu-stripe-api --settings APPINSIGHTS_INSTRUMENTATIONKEY="your-instrumentation-key"
```

### 6.2 View Logs

```bash
# Stream logs
az webapp log tail --resource-group karu-stripe-rg --name karu-stripe-api

# Download logs
az webapp log download --resource-group karu-stripe-rg --name karu-stripe-api
```

## 🧪 Step 7: Test Your Deployment

### 7.1 Health Check

```bash
curl https://karu-stripe-api.azurewebsites.net/health
```

### 7.2 Test Payment Flow

1. Update your frontend to point to: `https://karu-stripe-api.azurewebsites.net`
2. Test a payment with Stripe test cards
3. Verify webhook events in Stripe Dashboard

## 🚀 Final Configuration Summary

**Your Azure Web App will be available at:**

- **API URL:** `https://karu-stripe-api.azurewebsites.net`
- **Health Check:** `https://karu-stripe-api.azurewebsites.net/health`
- **Webhook URL:** `https://karu-stripe-api.azurewebsites.net/webhook`

**Environment Variables Set:**

- ✅ STRIPE_SECRET_KEY (your live key)
- ✅ STRIPE_WEBHOOK_SECRET = "YTYT"
- ✅ NODE_ENV = production
- ✅ All other configuration variables

**Next Steps:**

1. Update your frontend `stripe-config.js` to point to Azure API
2. Test payments end-to-end
3. Monitor logs and performance
4. Set up auto-scaling if needed

Your Karu Stripe API is now ready for production! 🎉
