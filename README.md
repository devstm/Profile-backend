# Profolio Backend API

A modern Express.js backend API with TypeScript, Prisma ORM, and Vitest for testing.

## Features

- Express.js with TypeScript
- Prisma ORM for database operations
- Vitest for testing with coverage
- Health check endpoint
- Structured project architecture

## Project Structure

```
├── prisma/                # Prisma schema and migrations
├── src/
│   ├── controllers/       # Request handlers
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── middlewares/       # Express middlewares
│   ├── utils/             # Utility functions
│   ├── generated/         # Generated Prisma client
│   ├── server.ts          # Express app setup
│   └── index.ts           # Entry point
├── .env                   # Environment variables
├── tsconfig.json          # TypeScript configuration
├── vitest.config.ts       # Vitest configuration
└── package.json           # Project dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables in `.env` file
4. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
5. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

### Development

Start the development server:

```bash
npm run dev
```

### Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

### Building for Production

Build the project:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## API Endpoints

- `GET /api/health` - Health check endpoint

## License

ISC
# Profile-backend
