# ConsultFlow - Consulting Automation Copilot

A production-quality MVP platform for automating consulting workflows with Microsoft 365 integration and AI-powered meeting minutes generation.

## 🏗️ Architecture

- **Frontend**: Next.js 14 + Tailwind CSS + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB (Mongoose)
- **Authentication**: Azure AD OAuth2 (Microsoft Identity Platform)
- **APIs**: Microsoft Graph API
- **AI**: Azure OpenAI / OpenAI API

## 🚀 Quick Start

> **New to ConsultFlow?** Start with [QUICKSTART.md](./QUICKSTART.md) for a 5-minute setup guide!

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or cloud instance)
- Azure AD App Registration
- OpenAI API key or Azure OpenAI endpoint

For detailed setup instructions, see [SETUP.md](./SETUP.md).

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

Backend runs on `http://localhost:3001`

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
```

Frontend runs on `http://localhost:3000`

## 🔐 Azure AD Configuration

### Step 1: Register Application in Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Name: `ConsultFlow`
5. Supported account types: **Accounts in any organizational directory and personal Microsoft accounts**
6. Redirect URI: `http://localhost:3001/auth/callback` (Web)
7. Click **Register**

### Step 2: Configure API Permissions

1. Go to **API permissions**
2. Click **Add a permission** > **Microsoft Graph** > **Delegated permissions**
3. Add the following permissions:
   - `User.Read`
   - `Mail.Send`
   - `Calendars.ReadWrite`
   - `ChannelMessage.Send`
4. Click **Add permissions**
5. Click **Grant admin consent** (if you have admin rights)

### Step 3: Create Client Secret

1. Go to **Certificates & secrets**
2. Click **New client secret**
3. Description: `ConsultFlow Secret`
4. Expires: Choose appropriate duration
5. Click **Add**
6. **Copy the secret value immediately** (you won't see it again)

### Step 4: Update Environment Variables

**Backend `.env`:**
```
AZURE_CLIENT_ID=<Application (client) ID>
AZURE_CLIENT_SECRET=<Client secret value>
AZURE_TENANT_ID=<Directory (tenant) ID>
AZURE_REDIRECT_URI=http://localhost:3001/auth/callback
```

**Frontend `.env.local`:**
```
NEXT_PUBLIC_AZURE_CLIENT_ID=<Application (client) ID>
NEXT_PUBLIC_AZURE_TENANT_ID=<Directory (tenant) ID>
NEXT_PUBLIC_AZURE_REDIRECT_URI=http://localhost:3000
```

## 📦 Environment Variables

### Backend (.env)

```env
PORT=3001
NODE_ENV=development
SESSION_SECRET=your-session-secret-change-in-production
MONGODB_URI=mongodb://localhost:27017/consultflow

AZURE_CLIENT_ID=your-azure-client-id
AZURE_CLIENT_SECRET=your-azure-client-secret
AZURE_TENANT_ID=your-azure-tenant-id
AZURE_REDIRECT_URI=http://localhost:3001/auth/callback

# Use either OpenAI or Azure OpenAI
OPENAI_API_KEY=your-openai-api-key
# OR
AZURE_OPENAI_ENDPOINT=your-azure-openai-endpoint
AZURE_OPENAI_API_KEY=your-azure-openai-api-key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4

FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_AZURE_CLIENT_ID=your-azure-client-id
NEXT_PUBLIC_AZURE_TENANT_ID=your-azure-tenant-id
NEXT_PUBLIC_AZURE_REDIRECT_URI=http://localhost:3000
```

## 🎯 Features

- ✅ Azure AD Authentication
- ✅ Workflow Creation & Execution
- ✅ AI-Powered Meeting Minutes Generation
- ✅ Outlook Email Sending
- ✅ Calendar Event Creation
- ✅ Microsoft Teams Channel Messaging
- ✅ Execution Logs

## 📁 Project Structure

```
consultflow/
├── backend/
│   ├── src/
│   │   ├── auth/          # Authentication logic
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Route controllers
│   │   ├── services/      # Business logic
│   │   │   ├── graph/     # Microsoft Graph API
│   │   │   ├── ai/        # OpenAI integration
│   │   │   └── workflow/  # Workflow engine
│   │   ├── models/        # MongoDB models
│   │   └── index.ts       # Entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── lib/               # Utilities
│   └── package.json
└── README.md
```

## 🚢 Deployment

### Vercel (Frontend)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Render / Railway (Backend)

1. Connect GitHub repository
2. Set environment variables
3. Build command: `npm install && npm run build`
4. Start command: `npm start`

## 📝 License

MIT

