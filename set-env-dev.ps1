# Development Environment Variables for Karu Stripe API
# Run this script to set environment variables for local development

Write-Host "🔧 Setting up development environment variables..." -ForegroundColor Cyan

# Stripe Configuration (TEST KEYS)
$env:STRIPE_SECRET_KEY = "sk_test_[YOUR_SECRET_KEY_HERE]"

$env:STRIPE_PUBLISHABLE_KEY = "pk_test_[YOUR_PUBLISHABLE_KEY_HERE]"
$env:STRIPE_WEBHOOK_SECRET = "YTYT"

# Server Configuration
$env:NODE_ENV = "development"
$env:PORT = "3000"
$env:FRONTEND_URL = "http://localhost:5500"  # Live Server default port
$env:BACKEND_URL = "http://localhost:3000"

# Rate Limiting (more relaxed for development)
$env:RATE_LIMIT_WINDOW_MS = "60000"  # 1 minute
$env:RATE_LIMIT_MAX_REQUESTS = "1000"  # Higher limit for testing

Write-Host "✅ Environment variables set!" -ForegroundColor Green
Write-Host "🔑 Webhook Secret: YTYT" -ForegroundColor Yellow
Write-Host "🌐 Backend URL: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🖥️ Frontend URL: http://localhost:5500" -ForegroundColor Cyan

Write-Host "`n🚀 Ready to start development server!" -ForegroundColor Green
Write-Host "Run: node server-production.js" -ForegroundColor White
Write-Host "Or use VS Code debugger (F5)" -ForegroundColor White
