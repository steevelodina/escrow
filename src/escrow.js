const store = require('./store');

class Escrow {
  createTransaction(txData) {
    const transaction = {
      ...txData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    store.addTransaction(transaction);
    return transaction;
  }

  getTransaction(id) {
    return store.getTransaction(id);
  }

  getAllTransactions() {
    return store.getAllTransactions();
  }

  releaseFunds(id) {
    const transaction = store.getTransaction(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    if (transaction.status !== 'pending') {
      throw new Error(`Cannot release funds. Transaction status is ${transaction.status}`);
    }
    transaction.status = 'released';
    transaction.releasedAt = new Date().toISOString();
    return transaction;
  }

  refundFunds(id) {
    const transaction = store.getTransaction(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    if (transaction.status !== 'pending') {
      throw new Error(`Cannot refund. Transaction status is ${transaction.status}`);
    }
    transaction.status = 'refunded';
    transaction.refundedAt = new Date().toISOString();
    return transaction;
  }
}

module.exports = new Escrow();
