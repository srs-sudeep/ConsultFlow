---
sidebar_position: 3
---

# Azure AD Setup

This guide walks you through setting up Azure Active Directory authentication for ConsultFlow.

## Prerequisites

- An Azure account (free tier works)
- Access to Azure Portal

## Step 1: Create Azure AD App Registration

### 1.1 Navigate to Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Sign in with your Microsoft account

### 1.2 Create App Registration

1. Search for **"App registrations"** in the search bar
2. Click **"New registration"**
3. Fill in the details:

| Field | Value |
|-------|-------|
| Name | `ConsultFlow` |
| Supported account types | Select based on your needs (see below) |
| Redirect URI | `Web` → `http://localhost:3001/auth/callback` |

**Account Types:**
- **Single tenant**: Only users from your organization
- **Multitenant**: Users from any Azure AD
- **Multitenant + personal**: Any Microsoft account (recommended for testing)

4. Click **"Register"**

### 1.3 Note Your Application IDs

After registration, you'll see the **Overview** page. Note these values:

```
Application (client) ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  → AZURE_AD_CLIENT_ID
Directory (tenant) ID:   xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  → AZURE_AD_TENANT_ID
```

## Step 2: Create Client Secret

1. In your app registration, go to **"Certificates & secrets"**
2. Click **"New client secret"**
3. Add a description: `ConsultFlow Dev Secret`
4. Select expiration (24 months recommended)
5. Click **"Add"**
6. **Immediately copy the secret value** (you won't see it again!)

```
Secret Value: your-secret-value → AZURE_AD_CLIENT_SECRET
```

:::warning Important
Copy the secret value immediately after creation. Once you navigate away, it will be hidden and you'll need to create a new one.
:::

## Step 3: Configure API Permissions

### 3.1 Add Microsoft Graph Permissions

1. Go to **"API permissions"**
2. Click **"Add a permission"**
3. Select **"Microsoft Graph"**
4. Select **"Delegated permissions"**
5. Add the following permissions:

| Permission | Purpose |
|------------|---------|
| `User.Read` | Read user profile |
| `Mail.Send` | Send emails via Outlook |
| `Calendars.ReadWrite` | Create calendar events |
| `ChannelMessage.Send` | Post to Teams channels |
| `offline_access` | Refresh tokens |

6. Click **"Add permissions"**

### 3.2 Grant Admin Consent (Optional)

If you're an admin, click **"Grant admin consent for [Your Org]"** to pre-approve permissions for all users.

If not an admin, users will be prompted to consent when they first log in.

## Step 4: Configure Authentication

1. Go to **"Authentication"**
2. Under **"Platform configurations"**, ensure **Web** is configured
3. Add Redirect URIs:
   - `http://localhost:3001/auth/callback` (development)
   - `https://your-domain.com/auth/callback` (production)

4. Under **"Implicit grant and hybrid flows"**:
   - ✅ Access tokens
   - ✅ ID tokens

5. Under **"Advanced settings"**:
   - Allow public client flows: **No**

6. Click **"Save"**

## Step 5: Update Environment Variables

Update your `backend/.env` file with the values from Azure:

```env
# Azure AD Authentication
AZURE_AD_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
AZURE_AD_CLIENT_SECRET=your-client-secret-value
AZURE_AD_TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
AZURE_AD_REDIRECT_URI=http://localhost:3001/auth/callback
```

## Step 6: Test Authentication

1. Start the backend server:
   ```bash
   cd backend && npm run dev
   ```

2. Start the frontend:
   ```bash
   cd frontend && npm run dev
   ```

3. Navigate to `http://localhost:3000`
4. Click **"Sign In"** → **"Continue with Microsoft"**
5. You should be redirected to Microsoft login

## Configuration Summary

Your Azure AD app should have:

| Setting | Value |
|---------|-------|
| **Type** | Web Application |
| **Redirect URIs** | `http://localhost:3001/auth/callback` |
| **Permissions** | User.Read, Mail.Send, Calendars.ReadWrite, ChannelMessage.Send, offline_access |
| **Token Configuration** | Access tokens, ID tokens enabled |

## Troubleshooting

### "AADSTS50011: Reply URL does not match"

The redirect URI doesn't match what's configured in Azure.

**Solution:**
1. Check the exact URI in your `.env` file
2. Ensure it matches exactly in Azure (including trailing slashes)

### "AADSTS700016: Application not found"

The client ID is incorrect or the app doesn't exist.

**Solution:**
1. Verify `AZURE_AD_CLIENT_ID` matches the Application ID in Azure
2. Ensure you're in the correct Azure directory

### "AADSTS7000215: Invalid client secret"

The client secret is incorrect or expired.

**Solution:**
1. Create a new client secret in Azure
2. Update `AZURE_AD_CLIENT_SECRET` in your `.env`

### "Insufficient privileges"

The user doesn't have required permissions.

**Solution:**
1. Grant admin consent for the permissions
2. Or have users consent when prompted

### Personal Microsoft Account Issues

If using a personal `@outlook.com` or `@gmail.com` account:

1. Ensure your app registration allows **"Personal Microsoft accounts"**
2. Use `common` as tenant ID, or update to support consumer accounts

```env
# For multi-tenant + personal accounts
AZURE_AD_TENANT_ID=common
```

---

:::tip Next Step
Ready to create your first workflow? Continue to [Quick Start](/docs/getting-started/quick-start).
:::

