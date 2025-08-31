const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.FRONTEND_PORT || 5500;

// Serve static files from current directory
app.use(express.static(__dirname));

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle other routes by serving index.html (for SPA behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌐 Frontend server running on http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${__dirname}`);
});