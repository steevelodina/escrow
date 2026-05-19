// In-memory data store for escrow transactions
const transactions = new Map();

class Store {
  // Create a new transaction
  createTransaction(id, data) {
    transactions.set(id, {
      id,
      ...data,
      createdAt: new Date(),
      status: 'pending'
    });
    return transactions.get(id);
  }

  // Get transaction by ID
  getTransaction(id) {
    return transactions.get(id);
  }

  // Update transaction
  updateTransaction(id, data) {
    const transaction = transactions.get(id);
    if (!transaction) return null;
    
    const updated = { ...transaction, ...data };
    transactions.set(id, updated);
    return updated;
  }

  // Get all transactions
  getAllTransactions() {
    return Array.from(transactions.values());
  }

  // Get transactions by buyer or seller
  getTransactionsByUser(userId) {
    return Array.from(transactions.values()).filter(
      t => t.buyer === userId || t.seller === userId
    );
  }

  // Clear store (for testing)
  clear() {
    transactions.clear();
  }
}

module.exports = new Store();
