# Jiko Milele Restaurant ERP

A modern, comprehensive ERP system built specifically for Jiko Milele Restaurant, featuring microservices architecture with Django REST API backend and Next.js frontend.

## Overview

Jiko Milele ERP provides complete restaurant management capabilities including:
- Table Management & Reservations
- Point of Sale (POS) System
- Kitchen Display System (KDS)
- Inventory Management
- Analytics & Reporting
- M-PESA Payment Integration

## Technology Stack

- **Backend**: Django 5.0 + Django REST Framework
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Database**: PostgreSQL 15+
- **Cache/Queue**: Redis 7+
- **Development**: Docker Compose
- **Authentication**: JWT with role-based access control

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jiko-milele-erp
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

3. **Start development environment**
   ```bash
   docker-compose up -d
   ```

4. **Access the applications**
   - Frontend (Next.js): http://localhost:3000
   - Backend API (Django): http://localhost:8000
   - API Documentation: http://localhost:8000/api/docs/

### Initial Setup Commands

After starting the containers for the first time:

```bash
# Run database migrations
docker-compose exec backend python manage.py migrate

# Create superuser (optional)
docker-compose exec backend python manage.py createsuperuser

# Load initial data (when available)
docker-compose exec backend python manage.py loaddata initial_data.json
```

## Project Structure

```
jiko-milele-erp/
├── backend/                 # Django REST API
│   ├── jiko_backend/       # Main Django project
│   ├── apps/               # Django applications
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile         # Backend container
│   └── manage.py          # Django management
├── frontend/               # Next.js application
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── pages/         # Next.js pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript definitions
│   ├── public/            # Static assets
│   ├── package.json       # Node dependencies
│   └── Dockerfile         # Frontend container
├── docker-compose.yml      # Development environment
├── .env.example           # Environment variables template
└── README.md             # This file
```

## Development

### Backend Development
- Django runs with auto-reload in development
- API available at http://localhost:8000
- Django admin at http://localhost:8000/admin/
- API documentation at http://localhost:8000/api/docs/

### Frontend Development
- Next.js runs with hot-reload in development
- Application available at http://localhost:3000
- TypeScript checking and Tailwind CSS compilation included

### Database Access
```bash
# Connect to PostgreSQL database
docker-compose exec postgres psql -U jiko_user -d jiko_milele_db

# View logs
docker-compose logs backend
docker-compose logs frontend
```

## Environment Variables

See `.env.example` for all required environment variables. Key variables include:

- `DJANGO_SECRET_KEY`: Django secret key
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `CORS_ALLOWED_ORIGINS`: Frontend URL for CORS
- `JWT_SECRET_KEY`: JWT token signing key

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Private - Jiko Milele Restaurant ERP System