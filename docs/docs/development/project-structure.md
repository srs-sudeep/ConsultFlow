---
sidebar_position: 2
---

# Project Structure

Detailed breakdown of the ConsultFlow codebase.

## Repository Layout

```
consultflow/
├── backend/              # Express.js API server
├── frontend/             # Next.js application
├── docs/                 # Docusaurus documentation
├── .gitignore
└── README.md
```

## Frontend Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (fonts, metadata)
│   ├── page.tsx                 # Landing page (/)
│   ├── globals.css              # Global styles + animations
│   │
│   ├── login/
│   │   └── page.tsx             # Login page (/login)
│   │
│   ├── dashboard/
│   │   └── page.tsx             # Dashboard (/dashboard)
│   │
│   ├── workflow/
│   │   ├── create/
│   │   │   └── page.tsx         # Workflow builder (/workflow/create)
│   │   └── execute/
│   │       └── [id]/
│   │           └── page.tsx     # Execution page (/workflow/execute/:id)
│   │
│   ├── mom/
│   │   └── page.tsx             # MOM generator (/mom)
│   │
│   └── logs/
│       └── page.tsx             # Execution logs (/logs)
│
├── components/
│   ├── Logo.tsx                 # Animated logo + LoadingLogo + Attribution
│   │
│   └── workflow/
│       ├── WorkflowCanvas.tsx   # React Flow canvas wrapper
│       ├── ActionSidebar.tsx    # Node palette + config panel
│       └── nodes/
│           ├── TriggerNode.tsx  # Custom trigger node
│           └── ActionNode.tsx   # Custom action node
│
├── lib/
│   └── api.ts                   # Axios API client
│
├── public/                      # Static assets
│
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Key Frontend Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout with fonts and global providers |
| `app/globals.css` | Tailwind imports + custom animations |
| `lib/api.ts` | Centralized API client for all endpoints |
| `components/Logo.tsx` | Reusable logo with animations |
| `components/workflow/WorkflowCanvas.tsx` | React Flow integration |

## Backend Structure

```
backend/
├── src/
│   ├── index.ts                 # Entry point, Express setup
│   │
│   ├── auth/
│   │   └── authService.ts       # Azure AD OAuth logic
│   │
│   ├── config/
│   │   └── database.ts          # MongoDB connection
│   │
│   ├── controllers/
│   │   ├── authController.ts    # /auth route handlers
│   │   ├── workflowController.ts # /workflow handlers
│   │   ├── momController.ts     # /mom handlers
│   │   └── logController.ts     # /logs handlers
│   │
│   ├── middleware/
│   │   └── auth.ts              # Authentication middleware
│   │
│   ├── models/
│   │   ├── User.ts              # User schema
│   │   ├── Workflow.ts          # Workflow schema
│   │   └── ExecutionLog.ts      # Log schema
│   │
│   ├── routes/
│   │   ├── auth.ts              # /auth routes
│   │   ├── workflow.ts          # /workflow routes
│   │   ├── mom.ts               # /mom routes
│   │   └── logs.ts              # /logs routes
│   │
│   ├── services/
│   │   ├── ai/
│   │   │   └── momGenerator.ts  # OpenAI MOM generation
│   │   ├── graph/
│   │   │   └── graphClient.ts   # Microsoft Graph API
│   │   └── workflow/
│   │       └── workflowExecutor.ts # Workflow execution
│   │
│   └── types/
│       └── express-session.d.ts # TypeScript declarations
│
├── .env                         # Environment variables (not committed)
├── tsconfig.json
└── package.json
```

### Key Backend Files

| File | Purpose |
|------|---------|
| `src/index.ts` | Express app setup, middleware, routes |
| `src/auth/authService.ts` | MSAL client, token operations |
| `src/services/graph/graphClient.ts` | Microsoft Graph API wrapper |
| `src/services/ai/momGenerator.ts` | OpenAI integration |
| `src/services/workflow/workflowExecutor.ts` | Action execution engine |

## Documentation Structure

```
docs/
├── docs/
│   ├── intro.md                 # Introduction
│   ├── getting-started/
│   │   ├── installation.md
│   │   ├── configuration.md
│   │   ├── azure-setup.md
│   │   └── quick-start.md
│   ├── architecture/
│   │   ├── overview.md
│   │   ├── frontend.md
│   │   ├── backend.md
│   │   ├── database.md
│   │   └── authentication.md
│   ├── features/
│   │   ├── workflow-builder.md
│   │   ├── mom-generator.md
│   │   ├── microsoft-integration.md
│   │   └── execution-logs.md
│   ├── api/
│   │   ├── authentication.md
│   │   ├── workflows.md
│   │   ├── mom.md
│   │   └── logs.md
│   └── development/
│       ├── tech-stack.md
│       ├── project-structure.md
│       └── contributing.md
├── src/
│   ├── pages/
│   │   └── index.tsx            # Docusaurus home page
│   └── css/
│       └── custom.css           # Custom styling
├── static/
│   └── img/
│       └── logo.svg
├── docusaurus.config.ts
├── sidebars.ts
└── package.json
```

## Code Organization Patterns

### Controller Pattern

```typescript
// controllers/workflowController.ts
export const createWorkflow = async (req: Request, res: Response) => {
  try {
    // Validation
    // Business logic
    // Response
  } catch (error) {
    // Error handling
  }
}
```

### Service Pattern

```typescript
// services/graph/graphClient.ts
export class GraphClient {
  private client: AxiosInstance
  
  constructor(accessToken: string) {
    // Initialize
  }
  
  async sendEmail(...) {
    // Implementation
  }
}
```

### Route Pattern

```typescript
// routes/workflow.ts
const router = Router()
router.use(requireAuth)
router.post('/', createWorkflow)
router.get('/', getWorkflows)
export default router
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | camelCase | `authService.ts` |
| Components | PascalCase | `WorkflowCanvas.tsx` |
| Functions | camelCase | `handleSubmit` |
| Constants | UPPER_SNAKE | `API_BASE_URL` |
| Types/Interfaces | PascalCase | `IWorkflow` |
| CSS Classes | kebab-case | `workflow-canvas` |

