# Ifybugsy Backend Deployment Guide

Complete guide for deploying the Ifybugsy backend to production.

## Pre-deployment Checklist

- [ ] All environment variables configured
- [ ] MongoDB Atlas cluster created
- [ ] Redis instance available (optional)
- [ ] Stripe account set up
- [ ] Email service configured
- [ ] Domain name set up
- [ ] SSL certificate ready
- [ ] All tests passing

## Deployment Options

### Option 1: Heroku Deployment

1. **Install Heroku CLI**
```bash
npm install -g heroku
heroku login
```

2. **Create Heroku App**
```bash
heroku create ifybugsy-api
```

3. **Configure Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_secure_secret_key
heroku config:set STRIPE_SECRET_KEY=your_stripe_key
# Add other variables as needed
```

4. **Deploy**
```bash
git push heroku main
```

5. **View Logs**
```bash
heroku logs --tail
```

### Option 2: AWS EC2 Deployment

1. **Launch EC2 Instance**
   - Choose Node.js AMI
   - Select t3.micro or larger
   - Configure security groups for ports 5000, 80, 443

2. **Connect and Setup**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
sudo apt install -y mongodb

# Install PM2 for process management
sudo npm install -g pm2
```

3. **Clone and Setup**
```bash
git clone your-repo.git
cd backend
npm install
```

4. **Configure Environment**
```bash
nano .env
# Add all environment variables
```

5. **Start with PM2**
```bash
pm2 start src/index.js --name "ifybugsy-api"
pm2 startup
pm2 save
```

### Option 3: Docker Deployment

1. **Create Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/

EXPOSE 5000

CMD ["node", "src/index.js"]
```

2. **Create docker-compose.yml**
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://mongo:27017/ifybugsy
      REDIS_HOST: redis
    depends_on:
      - mongo
      - redis
  
  mongo:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
  
  redis:
    image: redis:7
    ports:
      - "6379:6379"

volumes:
  mongo_data:
```

3. **Deploy**
```bash
docker-compose up -d
```

### Option 4: DigitalOcean App Platform

1. **Push to GitHub**
```bash
git push origin main
```

2. **Connect to DigitalOcean**
   - Go to App Platform
   - Click "Create App"
   - Select repository
   - Configure build command: `npm install`
   - Configure run command: `node src/index.js`

3. **Set Environment Variables**
   - Go to App settings
   - Add all required environment variables
   - Deploy

## Production Configuration

### 1. Environment Variables (Production)

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://yourdomain.com

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ifybugsy

# Security
JWT_SECRET=generate_a_strong_random_key
JWT_EXPIRE=24h

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key

# Payment
STRIPE_SECRET_KEY=sk_live_your_live_key

# Logging
LOG_LEVEL=info
```

### 2. MongoDB Atlas Setup

1. Create cluster at mongodb.com
2. Add IP whitelist
3. Create database user
4. Get connection string
5. Update MONGODB_URI

### 3. HTTPS/SSL Certificate

```bash
# Using Let's Encrypt with nginx
sudo certbot certonly --standalone -d api.yourdomain.com
```

### 4. Nginx Reverse Proxy

```nginx
upstream nodejs_backend {
    server 127.0.0.1:5000;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://nodejs_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## Monitoring and Logging

### PM2 Monitoring
```bash
pm2 monit
pm2 logs
pm2 save
```

### Application Monitoring (Optional)
- Set up monitoring with New Relic, DataDog, or similar
- Monitor response times, error rates, CPU, memory
- Set up alerts for issues

### Logging Service
```bash
# Winston logging example
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Backup Strategy

### Database Backups
```bash
# MongoDB Atlas - Automated backups
# Go to Backup section in Atlas
# Enable daily backups

# Manual backup
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/ifybugsy"
```

### Application Backups
- Use Git for version control
- Tag releases: `git tag -a v1.0.0`
- Push to backup service

## Scaling Considerations

### Load Balancing
- Use AWS ELB, DigitalOcean LB, or Nginx
- Scale horizontally by running multiple instances
- Use sticky sessions for WebSocket connections

### Database Scaling
- MongoDB sharding for large datasets
- Read replicas for read-heavy operations
- Connection pooling (MongoDB connection pools)

### Caching
- Redis for session storage
- Cache API responses
- Use CDN for static assets

## Security Hardening

### API Security
```javascript
// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// HELMET for security headers
const helmet = require('helmet');
app.use(helmet());
```

### CORS Configuration
```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Input Validation
- Always validate and sanitize input
- Use Joi or similar validation libraries
- Prevent SQL/NoSQL injection

## Maintenance Tasks

### Weekly
- Review logs for errors
- Check server resource usage
- Verify backups are running

### Monthly
- Update dependencies: `npm audit fix`
- Review security vulnerabilities
- Analyze performance metrics

### Quarterly
- Load testing
- Disaster recovery drill
- Security audit

## Troubleshooting

### High CPU Usage
```bash
pm2 monit
# Check specific process
node --inspect=9229 src/index.js
# Use Chrome DevTools for profiling
```

### Memory Leaks
```bash
# Enable memory snapshots
node --max-old-space-size=4096 src/index.js
# Use clinic.js for detection
npx clinic doctor -- node src/index.js
```

### Database Connection Issues
```bash
# Test connection
mongo "mongodb+srv://user:pass@cluster.mongodb.net/test"

# Check connection string format
# mongodb+srv://username:password@cluster.mongodb.net/dbname
```

## Rollback Procedure

```bash
# Tag current version
git tag -a v1.0.1 -m "Production release"

# If needed, rollback to previous version
git checkout v1.0.0
npm install
pm2 restart ifybugsy-api
```

## Performance Optimization

### Response Times
- Target: < 200ms for API responses
- Use monitoring to track actual times
- Optimize database queries with indexes

### Throughput
- Target: 1000+ requests/second
- Load test before production
- Scale horizontally if needed

## Success Metrics

Monitor these KPIs:
- Uptime: Target 99.9%+
- Response time: Target < 200ms
- Error rate: Target < 0.1%
- CPU usage: Target < 70%
- Memory usage: Target < 80%

## Post-Deployment

1. Update frontend API URL to production backend
2. Test all features in production
3. Monitor logs and metrics
4. Gather user feedback
5. Iterate and improve

---

**Backend is now production-ready!**
