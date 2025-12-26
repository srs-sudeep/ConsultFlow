---
sidebar_position: 1
---

# Technology Stack

A comprehensive overview of the technologies powering ConsultFlow.

## Frontend Stack

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.x | React framework with App Router |
| **React** | 18.x | UI component library |
| **TypeScript** | 5.x | Static type checking |

**Why Next.js 14?**
- App Router for modern routing patterns
- Server Components for performance
- Built-in API routes (not used, separate backend)
- Excellent developer experience
- Image and font optimization

### Styling

| Technology | Purpose |
|------------|---------|
| **Tailwind CSS** | Utility-first CSS framework |
| **Custom CSS** | Animations and special effects |

**Design Decisions:**
- Dark theme primary (`#0a0a1a`, `#16162a`)
- Orange-to-pink gradient accent
- CSS animations for polish
- No external component library (custom UI)

### UI Libraries

| Library | Purpose |
|---------|---------|
| **React Flow** | Node-based visual workflow builder |
| **Lucide React** | Icon library (consistent, customizable) |
| **React Markdown** | Render MOM output |

**Why React Flow?**
- Mature, well-documented
- Customizable node types
- Built-in controls and minimap
- Handles connections elegantly

### HTTP Client

| Library | Purpose |
|---------|---------|
| **Axios** | HTTP requests to backend |

Configured with:
- Base URL from environment
- Credentials included (cookies)
- JSON content type

## Backend Stack

### Runtime & Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18.x+ | JavaScript runtime |
| **Express.js** | 4.x | Web framework |
| **TypeScript** | 5.x | Type safety |

**Why Express?**
- Minimal and flexible
- Huge middleware ecosystem
- Well-understood patterns
- Easy to extend

### Database

| Technology | Version | Purpose |
|------------|---------|---------|
| **MongoDB** | 6.x+ | Document database |
| **Mongoose** | 8.x | ODM with schema validation |

**Why MongoDB?**
- Flexible schema for workflows
- JSON-like documents (natural fit)
- Easy to scale
- Great developer experience

### Authentication

| Technology | Purpose |
|------------|---------|
| **MSAL Node** | Microsoft Authentication Library |
| **express-session** | Session management |

**Why MSAL?**
- Official Microsoft library
- Handles token refresh
- OAuth 2.0 implementation
- Azure AD integration

### AI Integration

| Technology | Purpose |
|------------|---------|
| **OpenAI SDK** | GPT model access |

Supports:
- Standard OpenAI API
- Azure OpenAI Service
- Configurable model selection

### HTTP Client

| Library | Purpose |
|---------|---------|
| **Axios** | Microsoft Graph API calls |

With interceptors for:
- Request/response logging
- Error handling
- Token injection

## External Services

### Microsoft 365

| Service | API | Purpose |
|---------|-----|---------|
| **Azure AD** | OAuth 2.0 | Authentication |
| **Outlook** | Graph API | Email sending |
| **Calendar** | Graph API | Event creation |
| **Teams** | Graph API | Channel messaging |

### AI Services

| Service | Purpose |
|---------|---------|
| **OpenAI** | GPT-3.5/4 for MOM generation |
| **Azure OpenAI** | Enterprise alternative |

## Development Tools

### Build & Dev

| Tool | Purpose |
|------|---------|
| **tsx** | TypeScript execution (dev) |
| **tsc** | TypeScript compilation |
| **npm** | Package management |

### Code Quality

| Tool | Purpose |
|------|---------|
| **TypeScript** | Type checking |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |

## Version Summary

```json
{
  "frontend": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "reactflow": "^11.10.0",
    "axios": "^1.6.0",
    "lucide-react": "^0.300.0"
  },
  "backend": {
    "express": "^4.18.0",
    "mongoose": "^8.0.0",
    "@azure/msal-node": "^2.6.0",
    "openai": "^4.20.0",
    "axios": "^1.6.0"
  }
}
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                    Frontend                         │
│  Next.js 14 + React 18 + TypeScript + Tailwind     │
│  React Flow (Canvas) + Lucide (Icons)              │
└─────────────────────────────────────────────────────┘
                         │
                         │ HTTP/REST (Axios)
                         │ Session Cookie
                         ▼
┌─────────────────────────────────────────────────────┐
│                    Backend                          │
│  Express.js + TypeScript + Mongoose                │
│  MSAL (Auth) + OpenAI SDK (AI)                     │
└─────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
┌─────────────────┐        ┌─────────────────────────┐
│    MongoDB      │        │   External Services     │
│    Database     │        │  - Azure AD             │
│                 │        │  - Microsoft Graph      │
│                 │        │  - OpenAI               │
└─────────────────┘        └─────────────────────────┘
```

