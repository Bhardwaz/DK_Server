# 💕 LoveConnect - DateKarle App Backend

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101" alt="Socket.io" />
</div>

<div align="center">
  <h3>🚀 A modern, scalable backend API for connecting hearts</h3>
  <p>Built with Node.js, Express, and MongoDB - designed for love at scale</p>
</div>

---

## ✨ Features

### 🔐 **Authentication & Security**
- JWT-based authentication with refresh tokens
- OAuth integration (Google, Facebook, Apple)
- Phone number verification via SMS
- Password hashing with bcrypt
- Rate limiting and request validation
- CORS protection and security headers

### 👤 **User Management**
- Comprehensive user profiles with photo uploads
- Location-based services with geospatial queries
- Preference settings and matching criteria
- Account verification and moderation tools
- Privacy controls and blocking functionality

### 💝 **Matching & Discovery**
- Intelligent matching algorithm based on preferences
- Swipe functionality (like/pass) with undo options
- Advanced filtering (age, distance, interests)
- Boost and super-like premium features
- Discovery settings and visibility controls

### 💬 **Real-time Communication**
- WebSocket-powered instant messaging
- Message encryption for privacy
- Photo and media sharing
- Read receipts and typing indicators
- Video call integration ready

### 📊 **Analytics & Insights**
- User engagement tracking
- Match success rate analytics
- Revenue tracking for premium features
- Admin dashboard data endpoints
- Performance monitoring

### 🎁 **Premium Features**
- Subscription management with Stripe
- Premium badges and profile boosts
- Advanced search filters
- Unlimited likes and super likes
- Read receipts and message priority

---

## 🏗️ Architecture

```
src/
├── controllers/         # Request handlers
├── models/             # Database schemas
├── routes/             # API route definitions
├── middleware/         # Custom middleware
├── services/           # Business logic
├── utils/              # Helper functions
├── config/             # Configuration files
├── uploads/            # File upload directory
└── tests/              # Test suites
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (v5.0+)
- **Redis** (for session management)
- **AWS S3** (for file storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/loveconnect-backend.git
   cd loveconnect-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

---

## 🔧 Configuration

### Environment Variables

```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# Database
MONGODB_URI=mongodb://localhost:27017/loveconnect
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# AWS Services
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=your-s3-bucket-name
AWS_REGION=us-east-1

# Payment Processing
STRIPE_SECRET_KEY=sk_test_your-stripe-secret
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Communication
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
SENDGRID_API_KEY=your-sendgrid-key

# Geolocation
GOOGLE_MAPS_API_KEY=your-google-maps-key
```

---

## 📚 API Documentation

### Base URL
```
https://api.loveconnect.com/v1
```

### Authentication
All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Key Endpoints

#### 🔐 Authentication
```http
POST   /auth/register           # User registration
POST   /auth/login              # User login
POST   /auth/refresh            # Refresh JWT token
POST   /auth/logout             # User logout
POST   /auth/verify-phone       # Phone verification
POST   /auth/forgot-password    # Password reset
```

#### 👤 User Management
```http
GET    /users/profile           # Get user profile
PUT    /users/profile           # Update profile
POST   /users/photos            # Upload photos
DELETE /users/photos/:id        # Delete photo
GET    /users/settings          # Get user settings
PUT    /users/settings          # Update settings
```

#### 💝 Matching & Discovery
```http
GET    /discover               # Get potential matches
POST   /matches/like           # Like a user
POST   /matches/pass           # Pass on a user
GET    /matches                # Get mutual matches
POST   /matches/super-like     # Super like a user
POST   /matches/undo           # Undo last action
```

#### 💬 Messaging
```http
GET    /conversations          # Get all conversations
POST   /conversations          # Start new conversation
GET    /conversations/:id/messages  # Get messages
POST   /conversations/:id/messages  # Send message
PUT    /conversations/:id/read      # Mark as read
```

#### 💳 Subscriptions
```http
GET    /subscriptions/plans    # Get available plans
POST   /subscriptions/subscribe    # Create subscription
PUT    /subscriptions/cancel   # Cancel subscription
GET    /subscriptions/status   # Get subscription status
```

---

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run specific test suite
npm run test -- --grep "Authentication"
```

### Test Structure
```
tests/
├── unit/               # Unit tests
├── integration/        # Integration tests
├── fixtures/           # Test data
└── helpers/            # Test utilities
```

---

## 🚀 Deployment

### Docker Deployment
```bash
# Build image
docker build -t loveconnect-backend .

# Run container
docker run -p 3000:3000 loveconnect-backend
```

### Docker Compose
```bash
docker-compose up -d
```

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates installed
- [ ] Monitoring setup (PM2, New Relic)
- [ ] Backup strategy implemented
- [ ] CDN configured for static assets
- [ ] Rate limiting configured
- [ ] Security headers implemented

---

## 📊 Monitoring & Logging

### Health Check
```http
GET /health
```

### Metrics Endpoint
```http
GET /metrics
```

### Log Levels
- `ERROR`: System errors and exceptions
- `WARN`: Warning messages
- `INFO`: General information
- `DEBUG`: Detailed debugging information

---

## 🤝 Contributing

We love contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Include tests for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/username.png" width="100px;" alt=""/>
      <br />
      <sub><b>Your Name</b></sub>
      <br />
      <sub>Lead Developer</sub>
    </td>
    <td align="center">
      <img src="https://github.com/username2.png" width="100px;" alt=""/>
      <br />
      <sub><b>Team Member</b></sub>
      <br />
      <sub>Backend Developer</sub>
    </td>
  </tr>
</table>

---

## 🆘 Support

- 📖 [Documentation](https://docs.loveconnect.com)
- 🐛 [Issue Tracker](https://github.com/yourusername/loveconnect-backend/issues)
- 💬 [Discord Community](https://discord.gg/loveconnect)
- 📧 Email: support@loveconnect.com

---

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Inspired by modern dating platforms and user experience research
- Built with love for the open-source community

---

<div align="center">
  <p>Made with ❤️ for bringing people together</p>
  <p>
    <a href="https://github.com/yourusername/loveconnect-backend">⭐ Star this repository</a> if you found it helpful!
  </p>
</div>