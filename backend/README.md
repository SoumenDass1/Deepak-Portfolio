# Backend Implementation Guide

This document provides guidance for implementing the backend API for the Deepak Dass portfolio website.

---

## Overview

The portfolio website requires a backend API to handle contact form submissions. The frontend sends POST requests to `/api/contact` with user-submitted data.

**Key Requirements:**
- Handle contact form submissions
- Validate input data
- Send email notifications
- Implement security measures (rate limiting, input sanitization)
- Return appropriate responses

---

## API Specification

For detailed API specifications, see [api-spec.md](./api-spec.md).

**Endpoint:** `POST /api/contact`

---

## Technology Recommendations

### Option 1: Node.js with Express

**Pros:**
- JavaScript full-stack development
- Large ecosystem of packages
- Easy integration with email services
- Lightweight and fast

**Tech Stack:**
```
- Node.js (v18+)
- Express.js (web framework)
- express-validator (input validation)
- nodemailer or SendGrid (email)
- express-rate-limit (rate limiting)
- helmet (security headers)
- cors (CORS handling)
```

**Quick Start:**
```bash
npm init -y
npm install express express-validator nodemailer cors helmet express-rate-limit dotenv
```

**Example Implementation:**
```javascript
const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: 'https://yourdomain.com' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5
});

// Contact endpoint
app.post('/api/contact',
  limiter,
  [
    body('name').trim().isLength({ min: 2, max: 100 }),
    body('email').isEmail().normalizeEmail(),
    body('subject').trim().isLength({ min: 5, max: 200 }),
    body('message').trim().isLength({ min: 10, max: 2000 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { name, email, subject, message } = req.body;

    // Send email (configure transporter)
    try {
      // Email sending logic here
      
      res.json({
        success: true,
        message: 'Message sent successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error sending message'
      });
    }
  }
);

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

### Option 2: Python with Flask

**Pros:**
- Simple and elegant
- Good for data processing
- Easy email integration

**Tech Stack:**
```
- Python 3.8+
- Flask (web framework)
- Flask-CORS (CORS handling)
- Flask-Limiter (rate limiting)
- Flask-Mail or SendGrid Python SDK
```

**Quick Start:**
```bash
pip install flask flask-cors flask-limiter flask-mail python-dotenv
```

---

### Option 3: Serverless (AWS Lambda / Vercel / Netlify Functions)

**Pros:**
- No server management
- Auto-scaling
- Pay per use
- Easy deployment

**Recommended Services:**
- AWS Lambda + API Gateway
- Vercel Serverless Functions
- Netlify Functions
- Cloudflare Workers

---

## Email Service Integration

### Recommended Services

1. **SendGrid**
   - Free tier: 100 emails/day
   - Easy API integration
   - Great deliverability

2. **AWS SES (Simple Email Service)**
   - Very affordable
   - High deliverability
   - AWS ecosystem integration

3. **Nodemailer (SMTP)**
   - Works with Gmail, Outlook, etc.
   - Free but limited
   - Good for development

4. **Mailgun**
   - Developer-friendly
   - Good documentation
   - Free tier available

### Configuration Example (Nodemailer with Gmail)

```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: 'deepakdass110879@gmail.com',
  subject: `Portfolio Contact: ${subject}`,
  text: `From: ${name} <${email}>\n\n${message}`,
  html: `
    <h3>New Contact Form Submission</h3>
    <p><strong>From:</strong> ${name} (${email})</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `
};

await transporter.sendMail(mailOptions);
```

---

## Environment Variables

Create a `.env` file:

```env
# Server
PORT=3000
NODE_ENV=production

# CORS
ALLOWED_ORIGIN=https://yourdomain.com

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_TO=deepakdass110879@gmail.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=5
```

**Important:** Never commit `.env` file to version control. Add it to `.gitignore`.

---

## Security Best Practices

### 1. Input Validation
```javascript
- Validate all input fields
- Sanitize HTML to prevent XSS
- Check field lengths
- Verify email format
```

### 2. Rate Limiting
```javascript
- Limit requests per IP
- Use sliding window algorithm
- Return 429 status when exceeded
```

### 3. CORS Configuration
```javascript
- Only allow your domain
- Restrict allowed methods
- Set proper headers
```

### 4. Error Handling
```javascript
- Don't expose internal errors
- Log errors securely
- Return generic error messages
```

### 5. HTTPS Only
```javascript
- Always use HTTPS in production
- Redirect HTTP to HTTPS
- Use secure cookies if storing sessions
```

---

## Deployment Options

### Option 1: Traditional VPS (DigitalOcean, Linode, AWS EC2)
1. Set up server with Node.js/Python
2. Clone repository
3. Install dependencies
4. Configure environment variables
5. Use PM2 or systemd for process management
6. Set up Nginx as reverse proxy
7. Configure SSL with Let's Encrypt

### Option 2: Platform as a Service (Heroku, Render, Railway)
1. Connect GitHub repository
2. Configure environment variables
3. Deploy with one click
4. Auto-scaling and SSL included

### Option 3: Serverless (Vercel, Netlify, AWS Lambda)
1. Create serverless function
2. Configure deployment
3. Set environment variables
4. Deploy

---

## Testing

### Local Testing
```bash
# Start development server
npm run dev

# Test endpoint
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "This is a test message."
  }'
```

### Production Testing
- Test with real email addresses
- Verify rate limiting works
- Check error responses
- Test CORS from frontend domain
- Validate email delivery

---

## Monitoring & Logging

### Recommended Tools
- **Error Tracking:** Sentry, Rollbar
- **Logging:** Winston (Node.js), Python logging
- **Uptime Monitoring:** UptimeRobot, Pingdom
- **Analytics:** Google Analytics, Mixpanel

### What to Log
- All contact form submissions
- Validation errors
- Email sending success/failure
- Rate limit hits
- Server errors

---

## Cost Estimate

**Minimal Setup (Free Tier):**
- Hosting: Vercel/Netlify Functions (Free)
- Email: SendGrid Free (100 emails/day)
- **Total: $0/month**

**Production Setup:**
- Hosting: Render/Railway (~$7/month)
- Email: SendGrid Essentials ($19.95/month)
- Monitoring: Sentry Free tier
- **Total: ~$30/month**

---

## Next Steps

1. Choose your technology stack
2. Set up development environment
3. Implement the `/api/contact` endpoint
4. Configure email service
5. Add rate limiting and security measures
6. Test locally
7. Deploy to production
8. Update frontend with production API URL
9. Test end-to-end
10. Monitor and maintain

---

## Support

For questions or issues:
- Review [api-spec.md](./api-spec.md)
- Check framework documentation
- Test with curl or Postman
- Review server logs

---

## License

This implementation guide is part of the Deepak Dass portfolio project.

**Last Updated:** 2025-11-22
