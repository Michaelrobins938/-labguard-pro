#!/bin/bash

# LabGuard Pro Production Deployment Script
# This script handles the complete production deployment process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="labguard-pro"
DEPLOYMENT_ENV="production"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/backups"
LOG_DIR="/logs"
DOCKER_REGISTRY="your-registry.com"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root"
    fi
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed"
    fi
    
    # Check if .env.production exists
    if [ ! -f ".env.production" ]; then
        error ".env.production file not found"
    fi
    
    log "Prerequisites check passed"
}

# Create backup
create_backup() {
    log "Creating database backup..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Database backup
    docker-compose exec -T postgres pg_dump -U labguard_user labguard_production > "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"
    
    # File backup
    tar -czf "$BACKUP_DIR/files_backup_$TIMESTAMP.tar.gz" -C ./uploads .
    
    # Clean old backups (keep last 7 days)
    find "$BACKUP_DIR" -name "*.sql" -mtime +7 -delete
    find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete
    
    log "Backup completed"
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."
    
    # Generate Prisma client
    docker-compose exec -T api npm run db:generate
    
    # Run migrations
    docker-compose exec -T api npm run db:migrate
    
    log "Database migrations completed"
}

# Build and deploy services
deploy_services() {
    log "Building and deploying services..."
    
    # Pull latest images
    docker-compose pull
    
    # Build services
    docker-compose -f docker-compose.prod.yml build --no-cache
    
    # Deploy with zero downtime
    docker-compose -f docker-compose.prod.yml up -d --remove-orphans
    
    log "Services deployed successfully"
}

# Health checks
health_checks() {
    log "Running health checks..."
    
    # Wait for services to be ready
    sleep 30
    
    # Check API health
    if ! curl -f http://localhost:3001/health > /dev/null 2>&1; then
        error "API health check failed"
    fi
    
    # Check web app health
    if ! curl -f http://localhost:3000 > /dev/null 2>&1; then
        error "Web app health check failed"
    fi
    
    # Check database connection
    if ! docker-compose exec -T postgres pg_isready -U labguard_user > /dev/null 2>&1; then
        error "Database health check failed"
    fi
    
    # Check Redis connection
    if ! docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
        error "Redis health check failed"
    fi
    
    log "All health checks passed"
}

# Update SSL certificates
update_ssl() {
    log "Updating SSL certificates..."
    
    # Check if certbot is available
    if command -v certbot &> /dev/null; then
        # Renew certificates
        certbot renew --quiet
        
        # Reload nginx
        docker-compose exec nginx nginx -s reload
    else
        warn "Certbot not found, skipping SSL renewal"
    fi
}

# Monitor deployment
monitor_deployment() {
    log "Monitoring deployment..."
    
    # Check service status
    docker-compose -f docker-compose.prod.yml ps
    
    # Check logs for errors
    log "Checking for errors in logs..."
    if docker-compose -f docker-compose.prod.yml logs --tail=50 | grep -i error; then
        warn "Errors found in logs"
    fi
    
    # Check resource usage
    log "Resource usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
}

# Run tests
run_tests() {
    log "Running post-deployment tests..."
    
    # API tests
    docker-compose exec -T api npm test -- --passWithNoTests
    
    # Web app tests
    docker-compose exec -T web npm test -- --passWithNoTests
    
    log "Tests completed"
}

# Send notifications
send_notifications() {
    log "Sending deployment notifications..."
    
    # Slack notification
    if [ ! -z "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚀 LabGuard Pro deployment completed successfully at $(date)\"}" \
            "$SLACK_WEBHOOK_URL"
    fi
    
    # Email notification
    if [ ! -z "$ALERT_EMAIL" ]; then
        echo "LabGuard Pro deployment completed successfully at $(date)" | \
        mail -s "Deployment Success - LabGuard Pro" "$ALERT_EMAIL"
    fi
}

# Rollback function
rollback() {
    error "Deployment failed, initiating rollback..."
    
    # Stop new containers
    docker-compose -f docker-compose.prod.yml down
    
    # Start previous version
    docker-compose up -d
    
    # Restore database if needed
    if [ -f "$BACKUP_DIR/db_backup_$TIMESTAMP.sql" ]; then
        docker-compose exec -T postgres psql -U labguard_user -d labguard_production < "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"
    fi
    
    error "Rollback completed"
}

# Main deployment function
main() {
    log "Starting LabGuard Pro production deployment..."
    
    # Set up error handling
    trap rollback ERR
    
    # Run deployment steps
    check_root
    check_prerequisites
    create_backup
    run_migrations
    deploy_services
    health_checks
    update_ssl
    run_tests
    monitor_deployment
    send_notifications
    
    log "Deployment completed successfully!"
    
    # Remove error trap
    trap - ERR
}

# Parse command line arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [OPTIONS]"
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --backup-only  Only create backup"
        echo "  --migrate-only Only run migrations"
        echo "  --test-only    Only run tests"
        exit 0
        ;;
    --backup-only)
        check_prerequisites
        create_backup
        exit 0
        ;;
    --migrate-only)
        check_prerequisites
        run_migrations
        exit 0
        ;;
    --test-only)
        check_prerequisites
        run_tests
        exit 0
        ;;
    "")
        main
        ;;
    *)
        error "Unknown option: $1"
        ;;
esac 