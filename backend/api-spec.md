# Contact Form API Specification

## Overview
This document specifies the API endpoint for handling contact form submissions from the Deepak Dass portfolio website.

## Base URL
```
Production: https://yourdomain.com
Development: http://localhost:3000
```

---

## Endpoints

### Submit Contact Form

**Endpoint:** `POST /api/contact`

**Description:** Receives and processes contact form submissions from the portfolio website.

**Content-Type:** `application/json`

#### Request Body

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `name` | string | Yes | Min: 2 chars, Max: 100 chars | Sender's full name |
| `email` | string | Yes | Valid email format | Sender's email address |
| `subject` | string | Yes | Min: 5 chars, Max: 200 chars | Message subject line |
| `message` | string | Yes | Min: 10 chars, Max: 2000 chars | Message content |

#### Request Example

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "subject": "Collaboration Opportunity",
  "message": "Hi Deepak, I came across your portfolio and would like to discuss a sales operations opportunity at our company. Could we schedule a call?"
}
```

#### Success Response

**Status Code:** `200 OK`

**Response Body:**

```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "id": "msg_1234567890",
    "timestamp": "2025-11-22T00:48:00Z"
  }
}
```

#### Error Responses

**Validation Error**

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**Rate Limit Exceeded**

**Status Code:** `429 Too Many Requests`

```json
{
  "success": false,
  "message": "Too many requests. Please try again later.",
  "retryAfter": 3600
}
```

**Server Error**

**Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "An error occurred while processing your request. Please try again later."
}
```

---

## Validation Rules

### Name
- **Required:** Yes
- **Type:** String
- **Min Length:** 2 characters
- **Max Length:** 100 characters
- **Pattern:** Letters, spaces, hyphens, and apostrophes only
- **Example:** "John Doe", "Mary-Jane O'Connor"

### Email
- **Required:** Yes
- **Type:** String
- **Format:** Valid email address (RFC 5322)
- **Max Length:** 254 characters
- **Example:** "user@example.com"

### Subject
- **Required:** Yes
- **Type:** String
- **Min Length:** 5 characters
- **Max Length:** 200 characters
- **Example:** "Sales Operations Collaboration"

### Message
- **Required:** Yes
- **Type:** String
- **Min Length:** 10 characters
- **Max Length:** 2000 characters
- **Example:** "I would like to discuss..."

---

## Security Considerations

### Rate Limiting
- **Limit:** 5 requests per hour per IP address
- **Window:** Rolling 1-hour window
- **Response:** 429 status code when exceeded

### CORS (Cross-Origin Resource Sharing)
```
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### Input Sanitization
- Strip HTML tags from all input fields
- Encode special characters
- Prevent SQL injection and XSS attacks
- Trim whitespace from all fields

### Email Delivery
- Use transactional email service (SendGrid, AWS SES, etc.)
- Implement retry logic for failed sends
- Log all email attempts
- Send confirmation email to sender (optional)

---

## Implementation Notes

### Recommended Flow
1. Validate request body against schema
2. Sanitize all input fields
3. Check rate limiting for requester IP
4. Store message in database (optional)
5. Send email notification to Deepak Dass
6. Send confirmation email to sender (optional)
7. Return success response

### Database Schema (Optional)
If storing messages in a database:

```sql
CREATE TABLE contact_messages (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Email Template
Subject: `New Contact Form Submission: {subject}`

```
From: {name} <{email}>
Subject: {subject}

Message:
{message}

---
Sent via portfolio contact form
IP Address: {ip_address}
Date: {timestamp}
```

---

## Testing

### Test Cases

**Valid Submission:**
```bash
curl -X POST https://yourdomain.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Message",
    "message": "This is a test message from the contact form."
  }'
```

**Missing Required Field:**
```bash
curl -X POST https://yourdomain.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test"
  }'
```

**Invalid Email:**
```bash
curl -X POST https://yourdomain.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "invalid-email",
    "subject": "Test Message",
    "message": "This is a test message."
  }'
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-22 | Initial API specification |
