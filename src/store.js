const transactions = new Map();

const store = {
  addTransaction(transaction) {
    transactions.set(transaction.id, transaction);
  },

  getTransaction(id) {
    return transactions.get(id);
  },

  getAllTransactions() {
    return Array.from(transactions.values());
  },

  clear() {
    transactions.clear();
  }
};

module.exports = store;
