// Express server setup
const express = require('express');
const dotenv = require('dotenv');
const escrow = require('./escrow');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Create escrow transaction
app.post('/api/escrow/create', (req, res) => {
  try {
    const { buyer, seller, amount, description } = req.body;
    const transaction = escrow.createTransaction(buyer, seller, amount, description);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get transaction details
app.get('/api/escrow/:transactionId', (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = escrow.getTransaction(transactionId);
    res.json(transaction);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Release funds to seller
app.post('/api/escrow/:transactionId/release', (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = escrow.releaseFunds(transactionId);
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Refund funds to buyer
app.post('/api/escrow/:transactionId/refund', (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = escrow.refundFunds(transactionId);
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user transaction history
app.get('/api/escrow/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = escrow.getUserTransactionHistory(userId);
    res.json(transactions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Escrow system running on http://localhost:${PORT}`);
});

module.exports = app;
