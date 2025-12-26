---
sidebar_position: 2
---

# Configuration

This guide covers all configuration options for ConsultFlow.

## Environment Variables

### Backend Configuration

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | No | Server port (default: 3001) | `3001` |
| `NODE_ENV` | No | Environment mode | `development` / `production` |
| `MONGODB_URI` | Yes | MongoDB connection string | `mongodb://localhost:27017/consultflow` |
| `AZURE_AD_CLIENT_ID` | Yes | Azure AD App Client ID | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `AZURE_AD_CLIENT_SECRET` | Yes | Azure AD App Client Secret | `your-secret` |
| `AZURE_AD_TENANT_ID` | Yes | Azure AD Tenant ID | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `AZURE_AD_REDIRECT_URI` | Yes | OAuth callback URL | `http://localhost:3001/auth/callback` |
| `SESSION_SECRET` | Yes | Session encryption key (32+ chars) | `super-secret-key-here` |
| `FRONTEND_URL` | Yes | Frontend URL for CORS | `http://localhost:3000` |
| `OPENAI_API_KEY` | Yes* | OpenAI API key | `sk-...` |
| `OPENAI_MODEL` | No | OpenAI model name (default: gpt-3.5-turbo) | `gpt-4` |

*Either `OPENAI_API_KEY` or Azure OpenAI configuration is required.

### Azure OpenAI Configuration (Alternative)

| Variable | Required | Description |
|----------|----------|-------------|
| `AZURE_OPENAI_ENDPOINT` | Yes | Azure OpenAI endpoint URL |
| `AZURE_OPENAI_API_KEY` | Yes | Azure OpenAI API key |
| `AZURE_OPENAI_DEPLOYMENT_NAME` | No | Deployment name (default: gpt-35-turbo) |

### Frontend Configuration

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | Yes | Backend API URL | `http://localhost:3001` |

## Complete Backend `.env` Example

```env
# ===========================================
# ConsultFlow Backend Configuration
# ===========================================

# Server Configuration
PORT=3001
NODE_ENV=development

# MongoDB Database
MONGODB_URI=mongodb://localhost:27017/consultflow

# Azure AD Authentication
# Get these from Azure Portal > App Registrations
AZURE_AD_CLIENT_ID=your-azure-ad-client-id
AZURE_AD_CLIENT_SECRET=your-azure-ad-client-secret
AZURE_AD_TENANT_ID=your-azure-ad-tenant-id
AZURE_AD_REDIRECT_URI=http://localhost:3001/auth/callback

# Session Management
# Generate a secure random string (32+ characters)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# OpenAI Configuration (Option 1: Standard OpenAI)
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-3.5-turbo

# Azure OpenAI Configuration (Option 2: Azure OpenAI)
# Uncomment these and comment out OPENAI_API_KEY to use Azure OpenAI
# AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
# AZURE_OPENAI_API_KEY=your-azure-openai-api-key
# AZURE_OPENAI_DEPLOYMENT_NAME=gpt-35-turbo
```

## Production Configuration

For production deployments, ensure:

### 1. Secure Session Secret

Generate a cryptographically secure session secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Use Production MongoDB

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/consultflow?retryWrites=true&w=majority
```

### 3. Update Azure AD Redirect URI

Update your Azure AD app registration with the production callback URL:

```env
AZURE_AD_REDIRECT_URI=https://your-domain.com/auth/callback
```

### 4. Set Production Frontend URL

```env
FRONTEND_URL=https://your-domain.com
```

### 5. Enable HTTPS

Ensure your production server uses HTTPS for secure cookie transmission.

## Microsoft Graph API Scopes

ConsultFlow requests the following Microsoft Graph permissions:

| Scope | Type | Purpose |
|-------|------|---------|
| `User.Read` | Delegated | Read user profile |
| `Mail.Send` | Delegated | Send emails via Outlook |
| `Calendars.ReadWrite` | Delegated | Create calendar events |
| `ChannelMessage.Send` | Delegated | Post to Teams channels |
| `offline_access` | Delegated | Refresh tokens |

These are configured in your Azure AD app registration.

## Troubleshooting Configuration

### Check Environment Variables

```bash
# Backend - Print loaded configuration
node -e "require('dotenv').config(); console.log(process.env)"

# Verify specific variable
node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI)"
```

### Common Issues

1. **"Azure AD configuration is missing"**
   - Ensure all `AZURE_AD_*` variables are set
   - Check for typos in variable names

2. **"Either OPENAI_API_KEY or AZURE_OPENAI_* must be set"**
   - Configure either OpenAI or Azure OpenAI
   - Not both, not neither

3. **"Session secret too short"**
   - `SESSION_SECRET` must be at least 32 characters

---

:::tip Next Step
Continue to [Azure Setup](/docs/getting-started/azure-setup) to configure Microsoft authentication.
:::

