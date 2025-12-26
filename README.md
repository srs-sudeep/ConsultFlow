# ConsultFlow 🚀

**AI-Powered Workflow Automation for Consulting Teams**

[![Built with ❤️](https://img.shields.io/badge/Built%20with-%E2%9D%A4%EF%B8%8F-red)](https://github.com/srs-sudeep)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

ConsultFlow transforms meeting transcripts into structured minutes, automates email delivery, creates calendar events, and posts to Microsoft Teams - all through an intuitive drag-and-drop workflow builder.

![ConsultFlow Dashboard](docs/static/img/logo.svg)

## ✨ Features

- **🎨 Visual Workflow Builder** - Build automations with drag-and-drop, no coding required
- **🤖 AI-Powered MOM Generation** - Transform meeting notes into structured minutes using GPT
- **📧 Outlook Email Integration** - Send emails automatically via Microsoft Graph
- **📅 Calendar Event Creation** - Schedule follow-up meetings with extracted dates
- **💬 Teams Channel Posting** - Share updates with your team automatically
- **📊 Execution Logs** - Track and monitor all workflow runs
- **🔐 Azure AD Authentication** - Secure single sign-on with Microsoft

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS, React Flow |
| **Backend** | Node.js, Express, TypeScript, Mongoose |
| **Database** | MongoDB |
| **Auth** | Azure AD OAuth 2.0, MSAL Node |
| **AI** | OpenAI GPT-3.5/4 |
| **APIs** | Microsoft Graph API |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 6+
- Azure AD App Registration
- OpenAI API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/srs-sudeep/consultflow.git
cd consultflow

# Backend setup
cd backend
npm install
cp .env.example .env  # Configure your environment
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev

# Documentation (optional)
cd docs
npm install
npm start
```

### Environment Variables

**Backend (.env):**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/consultflow
AZURE_AD_CLIENT_ID=your-client-id
AZURE_AD_CLIENT_SECRET=your-client-secret
AZURE_AD_TENANT_ID=your-tenant-id
AZURE_AD_REDIRECT_URI=http://localhost:3001/auth/callback
SESSION_SECRET=your-session-secret
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=your-openai-key
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

## 📖 Documentation

Full documentation is available in the `/docs` folder, powered by Docusaurus:

- [Getting Started](docs/docs/getting-started/installation.md)
- [Architecture](docs/docs/architecture/overview.md)
- [Features](docs/docs/features/workflow-builder.md)
- [API Reference](docs/docs/api/authentication.md)
- [Contributing](docs/docs/development/contributing.md)

### Run Documentation Locally

```bash
cd docs
npm install
npm start
```

Then open http://localhost:3000/consultflow/

## 📁 Project Structure

```
consultflow/
├── backend/              # Express.js API server
│   ├── src/
│   │   ├── auth/        # Azure AD authentication
│   │   ├── controllers/ # Route handlers
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # API routes
│   │   └── services/    # Business logic
│   └── package.json
├── frontend/             # Next.js application
│   ├── app/             # App Router pages
│   ├── components/      # React components
│   ├── lib/             # Utilities
│   └── package.json
└── docs/                 # Docusaurus documentation
```

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | GET | Initiate OAuth login |
| `/auth/callback` | GET | OAuth callback |
| `/auth/me` | GET | Get current user |
| `/workflow` | GET/POST | Workflow CRUD |
| `/workflow/run/:id` | POST | Execute workflow |
| `/mom/generate` | POST | Generate meeting minutes |
| `/logs` | GET | Get execution logs |

## 🎯 Roadmap

- [x] Visual workflow builder
- [x] AI MOM generation
- [x] Email integration
- [x] Calendar integration
- [x] Teams integration
- [ ] Scheduled triggers
- [ ] PowerPoint generation
- [ ] Webhook triggers
- [ ] Team collaboration

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](docs/docs/development/contributing.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sudeep SRS** - [@srs-sudeep](https://github.com/srs-sudeep)

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/srs-sudeep">@srs-sudeep</a>
</p>
