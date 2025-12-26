---
sidebar_position: 1
---

# Authentication API

Endpoints for user authentication via Azure AD OAuth 2.0.

## Base URL

```
http://localhost:3001/auth
```

## Endpoints

### Login

Initiates the OAuth 2.0 authorization flow.

```http
GET /auth/login
```

**Response:** Redirects to Microsoft login page.

**Usage:**
```javascript
// Frontend redirect
window.location.href = 'http://localhost:3001/auth/login'
```

---

### Callback

OAuth callback handler. Receives authorization code from Azure AD.

```http
GET /auth/callback?code={authorization_code}
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `code` | string | Authorization code from Azure AD |

**Success Response:** Redirects to `{FRONTEND_URL}/dashboard`

**Error Response:** Redirects to `{FRONTEND_URL}/login?error={error_type}`

---

### Logout

Ends the user session.

```http
POST /auth/logout
```

**Headers:**
```
Cookie: connect.sid={session_cookie}
```

**Success Response:**
```json
{
  "success": true
}
```

**Error Response:**
```json
{
  "error": "Logout failed"
}
```

---

### Get Current User

Returns the authenticated user's profile.

```http
GET /auth/me
```

**Headers:**
```
Cookie: connect.sid={session_cookie}
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "microsoftId": "abc123...",
  "email": "john@company.com",
  "name": "John Smith",
  "createdAt": "2024-12-20T10:00:00.000Z",
  "updatedAt": "2024-12-26T15:30:00.000Z"
}
```

**Error Response (401):**
```json
{
  "error": "Unauthorized"
}
```

---

### Test Token

Debug endpoint to test token validity.

```http
GET /auth/test-token
```

**Headers:**
```
Cookie: connect.sid={session_cookie}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token is valid",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@company.com",
    "name": "John Smith",
    "tokenExpiresAt": "2024-12-26T16:00:00.000Z",
    "tokenIsExpired": false
  },
  "tokenClaims": {
    "scp": "User.Read Mail.Send Calendars.ReadWrite",
    "aud": "https://graph.microsoft.com",
    "exp": "2024-12-26T16:00:00.000Z"
  },
  "graphProfile": {
    "id": "abc123...",
    "displayName": "John Smith",
    "mail": "john@company.com"
  }
}
```

---

## Authentication Flow

```
1. Frontend calls GET /auth/login
2. User redirected to Microsoft login
3. User authenticates and consents
4. Microsoft redirects to GET /auth/callback?code=xxx
5. Backend exchanges code for tokens
6. Session created, user redirected to dashboard
```

## Session Cookie

All authenticated endpoints require the session cookie:

```
Cookie: connect.sid=s%3A...
```

The cookie is:
- HTTPOnly (not accessible via JavaScript)
- Secure in production (HTTPS only)
- SameSite=Lax (CSRF protection)

## Error Codes

| Code | Description |
|------|-------------|
| 401 | Not authenticated or session expired |
| 403 | Authenticated but insufficient permissions |
| 500 | Server error |

