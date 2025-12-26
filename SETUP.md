# ConsultFlow Setup Guide

This guide will walk you through setting up ConsultFlow from scratch.

## Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** (local installation or MongoDB Atlas account)
- **Azure AD** account with admin access (for app registration)
- **OpenAI API key** OR **Azure OpenAI** endpoint

## Step 1: Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Step 2: Set Up MongoDB

### Option A: Local MongoDB

1. Install MongoDB locally or use Docker:
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. Connection string: `mongodb://localhost:27017/consultflow`

### Option B: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/consultflow`)

## Step 3: Register Azure AD Application

### 3.1 Create App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in:
   - **Name**: `ConsultFlow`
   - **Supported account types**: `Accounts in any organizational directory and personal Microsoft accounts`
   - **Redirect URI**: 
     - Type: `Web`
     - URI: `http://localhost:3001/auth/callback`
5. Click **Register**

### 3.2 Configure API Permissions

1. In your app registration, go to **API permissions**
2. Click **Add a permission** > **Microsoft Graph** > **Delegated permissions**
3. Add these permissions:
   - `User.Read`
   - `Mail.Send`
   - `Calendars.ReadWrite`
   - `ChannelMessage.Send`
4. Click **Add permissions**
5. **Important**: Click **Grant admin consent for [Your Organization]** (if you have admin rights)

### 3.3 Create Client Secret

1. Go to **Certificates & secrets**
2. Click **New client secret**
3. Description: `ConsultFlow Secret`
4. Expires: Choose appropriate duration (24 months recommended for development)
5. Click **Add**
6. **IMPORTANT**: Copy the **Value** immediately (you won't see it again!)

### 3.4 Get Application IDs

From the **Overview** page, copy:
- **Application (client) ID**
- **Directory (tenant) ID**

## Step 4: Configure OpenAI

### Option A: OpenAI API

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create account and get API key
3. Use in backend `.env`: `OPENAI_API_KEY=sk-...`

### Option B: Azure OpenAI

1. Create Azure OpenAI resource in Azure Portal
2. Deploy a model (e.g., `gpt-4`)
3. Get:
   - Endpoint URL
   - API Key
   - Deployment name

## Step 5: Configure Environment Variables

### Backend Configuration

Create `backend/.env`:

```env
# Server
PORT=3001
NODE_ENV=development
SESSION_SECRET=your-random-secret-string-change-this

# MongoDB
MONGODB_URI=mongodb+srv://srs:1234@cluster0.rzi1vth.mongodb.net/?appName=Cluster0

# Azure AD
AZURE_CLIENT_ID=your-application-client-id
AZURE_CLIENT_SECRET=your-client-secret-value
AZURE_TENANT_ID=your-tenant-id
AZURE_REDIRECT_URI=http://localhost:3001/auth/callback

# OpenAI (choose one)
OPENAI_API_KEY=sk-your-openai-api-key
# OR Azure OpenAI:
# AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
# AZURE_OPENAI_API_KEY=your-azure-openai-key
# AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Frontend Configuration

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_AZURE_CLIENT_ID=your-application-client-id
NEXT_PUBLIC_AZURE_TENANT_ID=your-tenant-id
NEXT_PUBLIC_AZURE_REDIRECT_URI=http://localhost:3000
```

## Step 6: Run the Application

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

Backend should start on `http://localhost:3001`

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Frontend should start on `http://localhost:3000`

## Step 7: Test the Application

1. Open `http://localhost:3000` in your browser
2. You should be redirected to login page
3. Click "Sign in with Microsoft"
4. Complete Azure AD authentication
5. You should be redirected to the dashboard

## Troubleshooting

### Authentication Issues

- **"Invalid redirect URI"**: Make sure the redirect URI in Azure AD matches exactly: `http://localhost:3001/auth/callback`
- **"Insufficient permissions"**: Make sure you granted admin consent for all API permissions
- **"Token expired"**: The app will automatically refresh tokens, but if it fails, logout and login again

### MongoDB Connection Issues

- **"Connection refused"**: Make sure MongoDB is running
- **"Authentication failed"**: Check your MongoDB connection string credentials

### OpenAI Issues

- **"API key invalid"**: Verify your OpenAI API key is correct
- **"Rate limit exceeded"**: You may need to upgrade your OpenAI plan or add retry logic

### CORS Issues

- Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check browser console for CORS errors

## Production Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables (same as `.env.local`)
4. Update `AZURE_REDIRECT_URI` to your production URL
5. Deploy

### Backend (Render/Railway)

1. Connect GitHub repository
2. Set environment variables
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Update Azure AD redirect URI to production backend URL

### Azure AD Production Setup

1. Add production redirect URI in Azure AD app registration
2. Update environment variables with production URLs
3. Consider using separate app registration for production

## Security Notes

- Never commit `.env` files to version control
- Use strong `SESSION_SECRET` in production
- Rotate client secrets regularly
- Use HTTPS in production
- Consider using Azure Key Vault for secrets in production

## Next Steps

- Customize workflows for your use case
- Add more actions to workflows
- Integrate with additional Microsoft 365 services
- Add webhook triggers (beyond MVP scope)

