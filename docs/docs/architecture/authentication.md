---
sidebar_position: 5
---

# Authentication

ConsultFlow uses Azure AD OAuth 2.0 with MSAL (Microsoft Authentication Library).

## Authentication Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │     │   Backend    │     │   Azure AD   │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │ 1. Click Login     │                    │
       │───────────────────>│                    │
       │                    │                    │
       │ 2. Redirect URL    │                    │
       │<───────────────────│                    │
       │                    │                    │
       │ 3. Redirect to Azure AD                 │
       │────────────────────────────────────────>│
       │                    │                    │
       │ 4. User authenticates                   │
       │                    │                    │
       │ 5. Redirect with auth code              │
       │<────────────────────────────────────────│
       │                    │                    │
       │ 6. Send auth code  │                    │
       │───────────────────>│                    │
       │                    │                    │
       │                    │ 7. Exchange code   │
       │                    │───────────────────>│
       │                    │                    │
       │                    │ 8. Access + Refresh│
       │                    │<───────────────────│
       │                    │                    │
       │ 9. Set session     │                    │
       │<───────────────────│                    │
       │                    │                    │
       │ 10. Redirect to dashboard               │
       │                    │                    │
```

## Implementation Details

### 1. Login Initiation

```typescript
// Backend: GET /auth/login
export const login = async (req: Request, res: Response) => {
  const authService = new AuthService()
  const authUrl = await authService.getAuthCodeUrl()
  res.redirect(authUrl)
}
```

### 2. Auth URL Generation

```typescript
// AuthService.getAuthCodeUrl()
async getAuthCodeUrl(): Promise<string> {
  return this.msalClient.getAuthCodeUrl({
    scopes: [
      'User.Read',
      'Mail.Send', 
      'Calendars.ReadWrite',
      'ChannelMessage.Send',
      'offline_access', // Required for refresh tokens
    ],
    redirectUri: process.env.AZURE_AD_REDIRECT_URI!,
    prompt: 'select_account', // Allow account selection
  })
}
```

### 3. Callback Handler

```typescript
// Backend: GET /auth/callback
export const callback = async (req: Request, res: Response) => {
  const { code } = req.query
  
  if (!code) {
    return res.redirect(`${FRONTEND_URL}/login?error=no_code`)
  }

  try {
    const authService = new AuthService()
    const tokenResponse = await authService.acquireTokenByCode(code as string)

    // Create or update user
    const user = await User.findOneAndUpdate(
      { microsoftId: tokenResponse.account!.homeAccountId },
      {
        microsoftId: tokenResponse.account!.homeAccountId,
        email: tokenResponse.account!.username,
        name: tokenResponse.account!.name || 'User',
        accessToken: tokenResponse.accessToken,
        refreshToken: tokenResponse.refreshToken,
        tokenExpiresAt: tokenResponse.expiresOn,
      },
      { upsert: true, new: true }
    )

    // Set session
    req.session.userId = user._id.toString()

    res.redirect(`${FRONTEND_URL}/dashboard`)
  } catch (error) {
    console.error('Auth callback error:', error)
    res.redirect(`${FRONTEND_URL}/login?error=auth_failed`)
  }
}
```

### 4. Token Exchange

```typescript
// AuthService.acquireTokenByCode()
async acquireTokenByCode(code: string) {
  return this.msalClient.acquireTokenByCode({
    code,
    scopes: [
      'User.Read',
      'Mail.Send',
      'Calendars.ReadWrite', 
      'ChannelMessage.Send',
      'offline_access',
    ],
    redirectUri: process.env.AZURE_AD_REDIRECT_URI!,
  })
}
```

## Token Management

### Access Token Storage

Tokens are stored in the User document (encrypted at application level in production):

```typescript
{
  accessToken: "eyJ0eXAiOiJKV1Qi...",
  refreshToken: "0.AVEA...",
  tokenExpiresAt: ISODate("2024-12-26T16:00:00.000Z")
}
```

### Token Refresh

```typescript
// middleware/auth.ts
export const requireAuth = async (req, res, next) => {
  const user = await User.findById(req.session.userId)
    .select('+accessToken +refreshToken')

  // Check if token is expired
  if (user.tokenExpiresAt && user.tokenExpiresAt < new Date()) {
    if (user.refreshToken) {
      try {
        const authService = new AuthService()
        const newToken = await authService.acquireTokenByRefreshToken(
          user.refreshToken
        )
        
        user.accessToken = newToken.accessToken
        user.refreshToken = newToken.refreshToken || user.refreshToken
        user.tokenExpiresAt = newToken.expiresOn
        await user.save()
      } catch (error) {
        return res.status(401).json({ error: 'Token refresh failed' })
      }
    } else {
      return res.status(401).json({ error: 'Token expired' })
    }
  }

  req.user = user
  next()
}
```

### Refresh Token Implementation

```typescript
// AuthService.acquireTokenByRefreshToken()
async acquireTokenByRefreshToken(refreshToken: string) {
  return this.msalClient.acquireTokenByRefreshToken({
    refreshToken,
    scopes: [
      'User.Read',
      'Mail.Send',
      'Calendars.ReadWrite',
      'ChannelMessage.Send',
      'offline_access',
    ],
  })
}
```

## Session Management

### Session Configuration

```typescript
// src/index.ts
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    httpOnly: true, // Prevents XSS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax', // CSRF protection
  },
}))
```

### Session Storage

By default, sessions are stored in memory. For production, use a session store:

```typescript
import MongoStore from 'connect-mongo'

app.use(session({
  // ...other options
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60, // 24 hours
  }),
}))
```

## Logout

```typescript
// Backend: POST /auth/logout
export const logout = async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' })
    }
    res.clearCookie('connect.sid')
    res.json({ success: true })
  })
}
```

## Security Considerations

### 1. Token Security

- Access tokens stored with `select: false` in schema
- Never exposed to frontend
- Refresh tokens enable long-lived sessions

### 2. Session Security

- HTTPOnly cookies (no JavaScript access)
- Secure flag in production (HTTPS only)
- SameSite protection against CSRF

### 3. CORS Configuration

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL, // Specific origin only
  credentials: true, // Allow cookies
}))
```

### 4. Permission Scopes

Only request necessary permissions:
- `User.Read`: User profile
- `Mail.Send`: Send emails (not read)
- `Calendars.ReadWrite`: Create events
- `ChannelMessage.Send`: Post messages

## Troubleshooting

### "Token expired" errors

1. Check `tokenExpiresAt` in database
2. Verify refresh token exists
3. Test token refresh manually

### Session not persisting

1. Check cookie settings
2. Verify `credentials: true` in CORS
3. Check `withCredentials: true` in Axios

### Permission denied from Graph API

1. Verify scopes in Azure AD
2. Grant admin consent if required
3. Re-authenticate to get new token with scopes

---

:::tip Learn More
See the [API Reference](/docs/api/authentication) for endpoint documentation.
:::

