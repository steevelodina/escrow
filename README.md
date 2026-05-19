# Escrow System MVP

A minimal viable product for an escrow payment system built for Facebook.

## Features

- Create escrow transactions
- Hold funds safely
- Release funds to seller
- Refund funds to buyer
- Transaction history and status tracking

## Quick Start

```bash
npm install
npm start
```

Server runs on `http://localhost:3000`

## API Endpoints

### Create Transaction
```
POST /api/escrow/create
Body: { buyer, seller, amount, description }
```

### Get Transaction
```
GET /api/escrow/:transactionId
```

### Release Funds
```
POST /api/escrow/:transactionId/release
```

### Refund Funds
```
POST /api/escrow/:transactionId/refund
```

## Architecture

- `src/server.js` - Express server setup
- `src/escrow.js` - Core escrow logic
- `src/store.js` - In-memory data store
