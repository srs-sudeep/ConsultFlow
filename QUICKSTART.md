# ConsultFlow Quick Start

Get ConsultFlow running in 5 minutes!

## Prerequisites Check

- [ ] Node.js 18+ installed (`node --version`)
- [ ] MongoDB running (local or Atlas)
- [ ] Azure AD app registered (see SETUP.md)
- [ ] OpenAI API key OR Azure OpenAI endpoint

## Quick Setup

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend** - Create `backend/.env`:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/consultflow
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-secret
AZURE_TENANT_ID=your-tenant-id
AZURE_REDIRECT_URI=http://localhost:3001/auth/callback
OPENAI_API_KEY=sk-your-key
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=change-this-secret
```

**Frontend** - Create `frontend/.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_AZURE_CLIENT_ID=your-client-id
NEXT_PUBLIC_AZURE_TENANT_ID=your-tenant-id
NEXT_PUBLIC_AZURE_REDIRECT_URI=http://localhost:3000
```

### 3. Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Access Application

Open `http://localhost:3000` in your browser and sign in with Microsoft!

## Common Issues

**"Cannot connect to MongoDB"**
- Make sure MongoDB is running: `mongod` or check Docker container

**"Azure AD login fails"**
- Verify redirect URI matches exactly: `http://localhost:3001/auth/callback`
- Check API permissions are granted with admin consent

**"OpenAI API error"**
- Verify API key is correct
- Check you have credits/quota available

## Next Steps

- Read [SETUP.md](./SETUP.md) for detailed configuration
- Read [README.md](./README.md) for architecture overview
- Create your first workflow!
- Generate your first MOM!

