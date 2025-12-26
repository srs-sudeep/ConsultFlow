---
sidebar_position: 1
---

# Architecture Overview

ConsultFlow follows a modern full-stack architecture with clear separation of concerns.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 14)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   App Router │  │  React Flow  │  │  Tailwind CSS        │  │
│  │   (Pages)    │  │  (Canvas)    │  │  (Styling)           │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼ HTTP/REST
┌─────────────────────────────────────────────────────────────────┐
│                     Backend (Express.js)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Auth       │  │  Workflow    │  │  Graph Client        │  │
│  │   Service    │  │  Executor    │  │  (Microsoft API)     │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │   MOM        │  │  Controllers │                            │
│  │   Generator  │  │  & Routes    │                            │
│  └──────────────┘  └──────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
                          │                        │
                          ▼                        ▼
┌─────────────────────────┐        ┌──────────────────────────────┐
│      MongoDB            │        │    External Services         │
│  ┌──────────────┐       │        │  ┌────────────────────────┐  │
│  │    Users     │       │        │  │   Azure AD (Auth)      │  │
│  ├──────────────┤       │        │  ├────────────────────────┤  │
│  │  Workflows   │       │        │  │   Microsoft Graph API  │  │
│  ├──────────────┤       │        │  ├────────────────────────┤  │
│  │   Logs       │       │        │  │   OpenAI API           │  │
│  └──────────────┘       │        │  └────────────────────────┘  │
└─────────────────────────┘        └──────────────────────────────┘
```

## Data Flow

### 1. Authentication Flow

```
User → Login Page → Azure AD → Callback → Store Tokens → Dashboard
```

1. User clicks "Sign in with Microsoft"
2. Redirect to Azure AD authorization endpoint
3. User authenticates and consents
4. Azure AD redirects back with authorization code
5. Backend exchanges code for access/refresh tokens
6. Tokens stored in MongoDB (encrypted)
7. Session cookie set for user

### 2. Workflow Execution Flow

```
User → Execute Page → Input Data → Backend → Execute Actions → Log Results
```

1. User selects workflow and enters data
2. Frontend sends execution request to backend
3. Backend validates user and workflow
4. Workflow Executor processes each action sequentially
5. Results logged to ExecutionLog collection
6. Response sent to frontend

### 3. MOM Generation Flow

```
Meeting Notes → Backend → OpenAI API → Structured MOM → Frontend Display
```

1. User pastes meeting transcript
2. Backend sends to OpenAI with structured prompt
3. AI generates formatted Markdown MOM
4. Backend parses and returns structured data
5. Frontend renders with ReactMarkdown

## Design Principles

### 1. Separation of Concerns

- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Models**: Define data structures
- **Routes**: Map URLs to controllers

### 2. Security First

- OAuth 2.0 with PKCE for authentication
- Tokens encrypted at rest
- Session-based authentication with secure cookies
- CORS configured for specific origins

### 3. Extensibility

- Modular action system (easy to add new actions)
- Plugin-style service architecture
- React Flow for extensible visual builder

### 4. Developer Experience

- TypeScript throughout for type safety
- Hot reload in development
- Comprehensive error handling
- Detailed logging

## Technology Choices

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Frontend Framework | Next.js 14 | App Router, React Server Components, excellent DX |
| UI Library | React 18 | Component-based, huge ecosystem |
| Styling | Tailwind CSS | Utility-first, rapid development |
| Visual Builder | React Flow | Mature, customizable node-based editor |
| Backend Runtime | Node.js | JavaScript ecosystem, async I/O |
| API Framework | Express.js | Minimal, flexible, well-documented |
| Database | MongoDB | Flexible schema, great for documents |
| ODM | Mongoose | Schema validation, middleware support |
| Authentication | MSAL Node | Official Microsoft library |
| AI | OpenAI SDK | Best-in-class language models |

## Scalability Considerations

### Current Architecture (MVP)

- Single server deployment
- In-process workflow execution
- Session-based authentication

### Future Improvements

- **Queue-based execution**: Redis/Bull for background jobs
- **Horizontal scaling**: Stateless API servers
- **Caching**: Redis for frequently accessed data
- **CDN**: Static assets via CloudFlare/Vercel Edge

---

:::info Learn More
Explore detailed documentation for each layer:
- [Frontend Architecture](/docs/architecture/frontend)
- [Backend Architecture](/docs/architecture/backend)
- [Database Schema](/docs/architecture/database)
:::

