---
sidebar_position: 1
---

# Installation

This guide will help you set up ConsultFlow on your local development machine.

## Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Purpose |
|-------------|---------|---------|
| Node.js | 18.x or higher | Runtime environment |
| npm | 9.x or higher | Package manager |
| MongoDB | 6.x or higher | Database |
| Git | Latest | Version control |

## Clone the Repository

```bash
git clone https://github.com/srs-sudeep/ConsultFlow.git
cd ConsultFlow
```

## Project Structure

```
consultflow/
├── backend/          # Express.js API server
│   ├── src/
│   │   ├── auth/          # Azure AD authentication
│   │   ├── controllers/   # Route handlers
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── index.ts       # Entry point
│   └── package.json
├── frontend/         # Next.js application
│   ├── app/              # App router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities & API client
│   └── package.json
└── docs/             # Docusaurus documentation
```

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

Create a `.env` file in the `backend` directory:

```env
# Server
PORT=3001
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/consultflow

# Azure AD Authentication
AZURE_AD_CLIENT_ID=your-client-id
AZURE_AD_CLIENT_SECRET=your-client-secret
AZURE_AD_TENANT_ID=your-tenant-id
AZURE_AD_REDIRECT_URI=http://localhost:3001/auth/callback

# OpenAI (for MOM generation)
OPENAI_API_KEY=your-openai-api-key
# Or use Azure OpenAI
# AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
# AZURE_OPENAI_API_KEY=your-azure-openai-key
# AZURE_OPENAI_DEPLOYMENT_NAME=gpt-35-turbo

# Session
SESSION_SECRET=your-super-secret-session-key-at-least-32-chars

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 4. Start MongoDB

Make sure MongoDB is running:

```bash
# macOS with Homebrew
brew services start mongodb-community

# Or start manually
mongod --dbpath /path/to/data/db
```

### 5. Start the Backend Server

```bash
# Development mode with hot reload
npm run dev

# Or build and run production
npm run build
npm start
```

The backend will be available at `http://localhost:3001`

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### 4. Start the Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Verify Installation

1. Open `http://localhost:3000` in your browser
2. You should see the ConsultFlow landing page
3. Click "Get Started" to navigate to the login page

:::tip Next Step
Before you can log in, you need to configure Azure AD. See the [Azure Setup Guide](/docs/getting-started/azure-setup).
:::

## Troubleshooting

### MongoDB Connection Failed

```
Error: MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:** Ensure MongoDB is running:
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
brew services start mongodb-community
```

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:** Kill the process using the port:
```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### Module Not Found

```
Error: Cannot find module 'xyz'
```

**Solution:** Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

:::info Need Help?
If you encounter any issues, check the [GitHub Issues](https://github.com/srs-sudeep/ConsultFlow/issues) or create a new one.
:::

