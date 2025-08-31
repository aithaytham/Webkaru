# Azure Deployment Script for Karu Stripe API
# Run this script to deploy your Stripe server to Azure Web App

param(
    [Parameter(Mandatory = $true)]
    [string]$ResourceGroupName = "karu-stripe-rg",

    [Parameter(Mandatory = $true)]
    [string]$WebAppName = "karu-stripe-api",

    [Parameter(Mandatory = $false)]
    [string]$Location = "West Europe",

    [Parameter(Mandatory = $false)]
    [string]$PricingTier = "B1"
)

Write-Host "🚀 Deploying Karu Stripe API to Azure..." -ForegroundColor Cyan

# Check if Azure CLI is installed
if (!(Get-Command "az" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Azure CLI not found. Please install Azure CLI first." -ForegroundColor Red
    Write-Host "Download from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli" -ForegroundColor Yellow
    exit 1
}

# Login to Azure
Write-Host "🔐 Logging into Azure..." -ForegroundColor Yellow
az login

# Create Resource Group
Write-Host "📦 Creating resource group: $ResourceGroupName..." -ForegroundColor Yellow
az group create --name $ResourceGroupName --location $Location

# Create App Service Plan
Write-Host "🏗️ Creating App Service Plan..." -ForegroundColor Yellow
az appservice plan create --name "$WebAppName-plan" --resource-group $ResourceGroupName --sku $PricingTier --is-linux

# Create Web App
Write-Host "🌐 Creating Web App: $WebAppName..." -ForegroundColor Yellow
az webapp create --resource-group $ResourceGroupName --plan "$WebAppName-plan" --name $WebAppName --runtime "NODE:18-lts"

# Configure Environment Variables
Write-Host "⚙️ Configuring environment variables..." -ForegroundColor Yellow
az webapp config appsettings set --resource-group $ResourceGroupName --name $WebAppName --settings `
    STRIPE_SECRET_KEY="sk_live_[YOUR_LIVE_SECRET_KEY_HERE]" `
    STRIPE_PUBLISHABLE_KEY="pk_live_YOUR_PUBLISHABLE_KEY_HERE" `
    STRIPE_WEBHOOK_SECRET="YTYT" `
    NODE_ENV="production" `
    FRONTEND_URL="https://your-frontend-domain.com" `
    BACKEND_URL="https://$WebAppName.azurewebsites.net" `
    RATE_LIMIT_WINDOW_MS="900000" `
    RATE_LIMIT_MAX_REQUESTS="100"

# Enable local git deployment
Write-Host "📂 Setting up Git deployment..." -ForegroundColor Yellow
az webapp deployment source config-local-git --resource-group $ResourceGroupName --name $WebAppName

# Get deployment credentials
Write-Host "🔑 Getting deployment credentials..." -ForegroundColor Yellow
$deploymentUrl = az webapp deployment list-publishing-credentials --resource-group $ResourceGroupName --name $WebAppName --query scmUri --output tsv

# Create ZIP package for deployment
Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow
$tempZip = "karu-stripe-deploy.zip"
if (Test-Path $tempZip) {
    Remove-Item $tempZip -Force
}

# Create zip excluding unnecessary files
$excludeFiles = @("node_modules", ".env", "*.log", ".git", "deploy-azure.ps1")
Compress-Archive -Path "." -DestinationPath $tempZip -CompressionLevel Optimal

# Deploy using ZIP
Write-Host "🚀 Deploying application..." -ForegroundColor Yellow
az webapp deployment source config-zip --resource-group $ResourceGroupName --name $WebAppName --src $tempZip

# Clean up
Remove-Item $tempZip -Force

# Get Web App URL
$webAppUrl = "https://$WebAppName.azurewebsites.net"

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host "🌐 Your API is available at: $webAppUrl" -ForegroundColor Cyan
Write-Host "🔍 Health check: $webAppUrl/health" -ForegroundColor Cyan
Write-Host "🎣 Webhook URL: $webAppUrl/webhook" -ForegroundColor Cyan

Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Update your Stripe webhook URL to: $webAppUrl/webhook" -ForegroundColor White
Write-Host "2. Update your frontend stripe-config.js to point to: $webAppUrl" -ForegroundColor White
Write-Host "3. Test the health endpoint: $webAppUrl/health" -ForegroundColor White
Write-Host "4. Test a payment flow end-to-end" -ForegroundColor White

Write-Host "`n🔧 Useful Commands:" -ForegroundColor Yellow
Write-Host "View logs: az webapp log tail --resource-group $ResourceGroupName --name $WebAppName" -ForegroundColor White
Write-Host "Restart app: az webapp restart --resource-group $ResourceGroupName --name $WebAppName" -ForegroundColor White
Write-Host "Delete app: az group delete --name $ResourceGroupName" -ForegroundColor White
