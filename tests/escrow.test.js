const escrow = require('../src/escrow');
const store = require('../src/store');

describe('Escrow System', () => {
  beforeEach(() => {
    store.clear();
  });

  test('should create a transaction', () => {
    const transaction = escrow.createTransaction('buyer1', 'seller1', 100, 'Test item');
    
    expect(transaction).toBeDefined();
    expect(transaction.buyer).toBe('buyer1');
    expect(transaction.seller).toBe('seller1');
    expect(transaction.amount).toBe(100);
    expect(transaction.status).toBe('pending');
  });

  test('should reject transaction with invalid data', () => {
    expect(() => {
      escrow.createTransaction('', 'seller1', 100, 'Test');
    }).toThrow();
  });

  test('should reject transaction where buyer and seller are the same', () => {
    expect(() => {
      escrow.createTransaction('user1', 'user1', 100, 'Test');
    }).toThrow();
  });

  test('should get transaction', () => {
    const created = escrow.createTransaction('buyer1', 'seller1', 100, 'Test item');
    const retrieved = escrow.getTransaction(created.id);
    
    expect(retrieved).toEqual(created);
  });

  test('should release funds', () => {
    const transaction = escrow.createTransaction('buyer1', 'seller1', 100, 'Test item');
    const released = escrow.releaseFunds(transaction.id);
    
    expect(released.status).toBe('released');
    expect(released.releasedAt).toBeDefined();
  });

  test('should refund funds', () => {
    const transaction = escrow.createTransaction('buyer1', 'seller1', 100, 'Test item');
    const refunded = escrow.refundFunds(transaction.id);
    
    expect(refunded.status).toBe('refunded');
    expect(refunded.refundedAt).toBeDefined();
  });

  test('should not release funds twice', () => {
    const transaction = escrow.createTransaction('buyer1', 'seller1', 100, 'Test item');
    escrow.releaseFunds(transaction.id);
    
    expect(() => {
      escrow.releaseFunds(transaction.id);
    }).toThrow();
  });

  test('should get user transaction history', () => {
    escrow.createTransaction('buyer1', 'seller1', 100, 'Test 1');
    escrow.createTransaction('buyer1', 'seller2', 200, 'Test 2');
    escrow.createTransaction('buyer2', 'seller1', 150, 'Test 3');
    
    const history = escrow.getUserTransactionHistory('buyer1');
    expect(history).toHaveLength(2);
  });
});
