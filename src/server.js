const express = require('express');
const { v4: uuidv4 } = require('uuid');
const escrow = require('./escrow');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Create escrow transaction
app.post('/api/escrow/create', (req, res) => {
  try {
    const { buyer, seller, amount, description } = req.body;
    
    if (!buyer || !seller || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid input parameters' });
    }

    const transaction = escrow.createTransaction({
      id: uuidv4(),
      buyer,
      seller,
      amount,
      description,
      status: 'pending',
      createdAt: new Date()
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get transaction
app.get('/api/escrow/:transactionId', (req, res) => {
  try {
    const transaction = escrow.getTransaction(req.params.transactionId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Release funds to seller
app.post('/api/escrow/:transactionId/release', (req, res) => {
  try {
    const transaction = escrow.releaseFunds(req.params.transactionId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Refund funds to buyer
app.post('/api/escrow/:transactionId/refund', (req, res) => {
  try {
    const transaction = escrow.refundFunds(req.params.transactionId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all transactions
app.get('/api/escrow', (req, res) => {
  try {
    const transactions = escrow.getAllTransactions();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Escrow system running on http://localhost:${PORT}`);
});

module.exports = app;
