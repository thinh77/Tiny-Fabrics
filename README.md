# Tiny Fabrics API Server

Express.js + TypeScript + PostgreSQL + Drizzle ORM API for Tiny Fabrics e-commerce platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure database:
   - Create a PostgreSQL database
   - Update `.env` with your database credentials

3. Push database schema:
```bash
npm run db:push
```

4. Seed database:
```bash
npm run db:seed
```

## Development

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## Database Commands

- `npm run db:generate` - Generate migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:seed` - Seed database with sample data

## Build

```bash
npm run build
npm start
```

## API Endpoints

- `GET /` - API info
- `GET /api/health` - Health check
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## Tech Stack

- Express.js - Web framework
- TypeScript - Type safety
- PostgreSQL - Database
- Drizzle ORM - Database ORM
- dotenv - Environment variables

## Project Structure

```
src/
├── server.ts           # Main server file
├── db/
│   ├── index.ts       # Database connection
│   ├── schema.ts      # Database schema
│   ├── seed.ts        # Seed functions
│   └── seed-runner.ts # Seed runner
├── routes/            # API routes
│   └── products.ts
└── types/             # TypeScript types
    └── index.ts
```
