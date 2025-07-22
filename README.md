# LabGuard Pro - Laboratory Compliance Automation Platform

A comprehensive, enterprise-grade laboratory management system designed to streamline equipment calibration, compliance tracking, and laboratory operations.

## 🚀 Live Demo

**Deployed on Vercel:** [LabGuard Pro Platform](https://labguard-pro.vercel.app)

## ✨ Features

### Core Laboratory Management
- **Equipment Management** - Complete lifecycle tracking with QR codes and labels
- **Calibration Scheduling** - Automated scheduling with AI-powered validation
- **Compliance Reporting** - Real-time compliance monitoring and reporting
- **Team Collaboration** - Role-based access control and team management

### Advanced Features (Phase 3)
- **Enterprise Analytics** - Business intelligence with predictive insights
- **Bulk Operations** - File-based batch processing for equipment and data
- **Data Management** - Import/export center with multiple format support
- **LIMS Integration** - Laboratory Information Management System connections
- **API Management** - RESTful API with key management and usage monitoring
- **Automation Workflows** - Custom workflow creation and management
- **Global Search** - Advanced search across all data types
- **System Administration** - Complete system management and monitoring

### Billing & Subscription
- **Subscription Management** - Flexible billing plans and usage tracking
- **Payment Processing** - Secure payment method management
- **Usage Analytics** - Detailed usage reporting and analytics
- **Invoice Management** - Automated invoice generation and tracking

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Hooks** - State management

### Backend
- **Express.js** - Node.js web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **JWT** - Authentication
- **Node.js** - Runtime environment

### Infrastructure
- **Vercel** - Frontend deployment
- **GitHub** - Version control
- **Docker** - Containerization
- **Turbo** - Monorepo build system

## 📦 Project Structure

```
products/
├── apps/
│   ├── web/                 # Next.js frontend application
│   │   ├── src/app/         # App Router pages
│   │   ├── src/components/  # React components
│   │   └── src/lib/         # Utilities and helpers
│   └── api/                 # Express.js backend API
│       ├── src/controllers/ # API controllers
│       ├── src/routes/      # API routes
│       └── src/middleware/  # Express middleware
├── packages/
│   ├── database/            # Database schema and migrations
│   └── shared/              # Shared utilities and types
└── backend/                 # Legacy backend (deprecated)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Michaelrobins938/-labguard-pro.git
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

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

### Development Commands

```bash
# Start all services
npm run dev

# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format
```

## 🌐 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository
   - Configure environment variables

2. **Environment Variables**
   ```env
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret
   API_BASE_URL=your_backend_api_url
   ```

3. **Deploy**
   - Vercel will automatically deploy on push to master
   - Custom domain can be configured in Vercel dashboard

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred hosting service**
   - Frontend: Deploy `apps/web` to Vercel, Netlify, or similar
   - Backend: Deploy `apps/api` to Railway, Heroku, or similar

## 📊 Features Overview

### Dashboard
- Real-time equipment status
- Calibration due dates
- Compliance score tracking
- Quick action buttons

### Equipment Management
- Equipment registration and tracking
- QR code generation
- Maintenance scheduling
- Calibration history
- Document management

### Calibration System
- Automated scheduling
- AI-powered validation
- Result tracking
- Compliance reporting

### Enterprise Analytics
- Revenue tracking
- User engagement metrics
- System performance monitoring
- Predictive insights

### System Administration
- User management
- Security monitoring
- Backup management
- System health tracking

## 🔐 Security

- JWT-based authentication
- Role-based access control
- Secure API endpoints
- Data encryption
- Audit logging

## 📈 Performance

- Server-side rendering with Next.js
- Optimized bundle sizes
- CDN integration
- Database query optimization
- Caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🗺 Roadmap

### Phase 4 (Planned)
- Mobile application
- Advanced AI features
- Multi-tenant architecture
- Advanced reporting
- Third-party integrations

### Phase 5 (Future)
- IoT device integration
- Machine learning predictions
- Advanced automation
- Global deployment

---

**LabGuard Pro** - Streamlining laboratory compliance and operations with modern technology. 