# LabGuard Pro

Laboratory Compliance Automation Platform

## Overview

LabGuard Pro is a comprehensive SaaS platform that automates laboratory compliance management using AI-powered validation and real-time monitoring. Built with Next.js 14, Express.js, and PostgreSQL.

## Features

- **Equipment Management**: Complete lifecycle tracking for laboratory instruments
- **AI-Powered Calibration**: Automated compliance validation using OpenAI
- **Real-time Monitoring**: Live compliance status and alerts
- **Multi-tenant Architecture**: Support for multiple laboratories
- **Role-based Access**: Admin, Supervisor, Technician, and Viewer roles
- **Subscription Management**: Stripe integration for billing
- **Audit Trail**: Complete activity logging and reporting

## Tech Stack

### Frontend
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Radix UI Components
- React Hook Form with Zod validation
- NextAuth.js for authentication

### Backend
- Express.js with TypeScript
- Prisma ORM with PostgreSQL
- JWT authentication
- OpenAI API integration
- Stripe payment processing
- Winston logging

### Infrastructure
- Docker containerization
- Turbo monorepo
- PostgreSQL database
- Redis for caching

## Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd labguard-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the database**
   ```bash
   docker-compose up -d postgres redis
   ```

5. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

6. **Start development servers**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health check: http://localhost:3001/health

## Project Structure

```
labguard-pro/
├── apps/
│   ├── web/                    # Next.js frontend
│   └── api/                    # Express.js backend
├── packages/
│   ├── database/               # Prisma schema and migrations
│   └── shared/                 # Shared types and utilities
├── docker-compose.yml          # Development environment
├── turbo.json                  # Monorepo configuration
└── package.json                # Root workspace
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token

### Equipment Management
- `GET /api/equipment` - List equipment
- `POST /api/equipment` - Create equipment
- `GET /api/equipment/:id` - Get equipment details
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment

### Calibration
- `GET /api/calibration` - List calibrations
- `POST /api/calibration` - Create calibration record
- `POST /api/calibration/:id/validate` - AI-powered validation
- `GET /api/calibration/equipment/:id/history` - Calibration history

### Compliance
- `GET /api/compliance/templates` - List templates
- `POST /api/compliance/reports` - Generate reports
- `GET /api/compliance/status` - Overall compliance status

## Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `OPENAI_API_KEY` - OpenAI API key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

### Optional
- `NODE_ENV` - Environment (development/production)
- `PORT` - API server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start all services
npm run dev:web          # Start frontend only
npm run dev:api          # Start backend only

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database

# Building
npm run build            # Build all packages
npm run build:web        # Build frontend
npm run build:api        # Build backend

# Linting
npm run lint             # Lint all packages
npm run lint:fix         # Fix linting issues

# Testing
npm run test             # Run tests
```

### Database Management

```bash
# Generate Prisma client
cd packages/database && npx prisma generate

# Push schema changes
npx prisma db push

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed

# Open Prisma Studio
npx prisma studio
```

## Deployment

### Production Build

```bash
# Build all packages
npm run build

# Start production servers
npm run start:web
npm run start:api
```

### Docker Deployment

```bash
# Build containers
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions, please contact the development team. 