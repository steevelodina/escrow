// Core escrow business logic
const store = require('./store');
const { v4: uuidv4 } = require('uuid');

class Escrow {
  // Create a new escrow transaction
  createTransaction(buyer, seller, amount, description) {
    if (!buyer || !seller || !amount || amount <= 0) {
      throw new Error('Invalid transaction data');
    }

    if (buyer === seller) {
      throw new Error('Buyer and seller cannot be the same');
    }

    const transactionId = uuidv4();
    const transaction = store.createTransaction(transactionId, {
      buyer,
      seller,
      amount,
      description,
      status: 'pending',
      releasedAt: null,
      refundedAt: null
    });

    console.log(`Transaction created: ${transactionId}`);
    return transaction;
  }

  // Get transaction details
  getTransaction(transactionId) {
    const transaction = store.getTransaction(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return transaction;
  }

  // Release funds to seller
  releaseFunds(transactionId) {
    const transaction = store.getTransaction(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status !== 'pending') {
      throw new Error(`Cannot release funds. Transaction status is ${transaction.status}`);
    }

    const updated = store.updateTransaction(transactionId, {
      status: 'released',
      releasedAt: new Date()
    });

    console.log(`Funds released for transaction: ${transactionId}`);
    return updated;
  }

  // Refund funds to buyer
  refundFunds(transactionId) {
    const transaction = store.getTransaction(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status !== 'pending') {
      throw new Error(`Cannot refund funds. Transaction status is ${transaction.status}`);
    }

    const updated = store.updateTransaction(transactionId, {
      status: 'refunded',
      refundedAt: new Date()
    });

    console.log(`Funds refunded for transaction: ${transactionId}`);
    return updated;
  }

  // Get transaction history for a user
  getUserTransactionHistory(userId) {
    return store.getTransactionsByUser(userId);
  }
}

module.exports = new Escrow();
