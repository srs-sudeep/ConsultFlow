---
sidebar_position: 3
---

# Backend Architecture

ConsultFlow's backend is a Node.js Express server written in TypeScript.

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x+ | Runtime environment |
| Express.js | 4.x | Web framework |
| TypeScript | 5.x | Type safety |
| Mongoose | 8.x | MongoDB ODM |
| MSAL Node | 2.x | Microsoft authentication |
| OpenAI SDK | 4.x | AI integration |
| Axios | 1.x | HTTP client for Graph API |

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Entry point, Express setup
│   ├── auth/
│   │   └── authService.ts    # Azure AD authentication
│   ├── controllers/
│   │   ├── authController.ts     # Auth route handlers
│   │   ├── workflowController.ts # Workflow CRUD + execution
│   │   ├── momController.ts      # MOM generation
│   │   └── logController.ts      # Execution logs
│   ├── middleware/
│   │   └── auth.ts           # Authentication middleware
│   ├── models/
│   │   ├── User.ts           # User schema
│   │   ├── Workflow.ts       # Workflow schema
│   │   └── ExecutionLog.ts   # Log schema
│   ├── routes/
│   │   ├── auth.ts           # /auth routes
│   │   ├── workflow.ts       # /workflow routes
│   │   ├── mom.ts            # /mom routes
│   │   └── logs.ts           # /logs routes
│   ├── services/
│   │   ├── ai/
│   │   │   └── momGenerator.ts   # OpenAI MOM generation
│   │   ├── graph/
│   │   │   └── graphClient.ts    # Microsoft Graph API
│   │   └── workflow/
│   │       └── workflowExecutor.ts # Workflow execution engine
│   ├── config/
│   │   └── database.ts       # MongoDB connection
│   └── types/
│       └── express-session.d.ts  # TypeScript declarations
├── package.json
└── tsconfig.json
```

## Core Components

### 1. Express Server Setup

```typescript
// src/index.ts
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import { connectDatabase } from './config/database'

const app = express()

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}))
app.use(express.json())
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}))

// Routes
app.use('/auth', authRoutes)
app.use('/workflow', workflowRoutes)
app.use('/mom', momRoutes)
app.use('/logs', logRoutes)

// Start server
connectDatabase().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
```

### 2. Authentication Service

```typescript
// src/auth/authService.ts
import { ConfidentialClientApplication } from '@azure/msal-node'

export class AuthService {
  private msalClient: ConfidentialClientApplication

  constructor() {
    this.msalClient = new ConfidentialClientApplication({
      auth: {
        clientId: process.env.AZURE_AD_CLIENT_ID!,
        clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
        authority: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}`,
      },
    })
  }

  async getAuthCodeUrl(): Promise<string> {
    return this.msalClient.getAuthCodeUrl({
      scopes: [
        'User.Read',
        'Mail.Send',
        'Calendars.ReadWrite',
        'ChannelMessage.Send',
        'offline_access',
      ],
      redirectUri: process.env.AZURE_AD_REDIRECT_URI!,
    })
  }

  async acquireTokenByCode(code: string) {
    return this.msalClient.acquireTokenByCode({
      code,
      scopes: [...],
      redirectUri: process.env.AZURE_AD_REDIRECT_URI!,
    })
  }
}
```

### 3. Graph Client

```typescript
// src/services/graph/graphClient.ts
import axios from 'axios'

export class GraphClient {
  private client: AxiosInstance
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
    this.client = axios.create({
      baseURL: 'https://graph.microsoft.com/v1.0',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
  }

  async sendEmail(to: string, subject: string, body: string) {
    await this.client.post('/me/sendMail', {
      message: {
        subject,
        body: { contentType: 'HTML', content: body },
        toRecipients: [{ emailAddress: { address: to } }],
      },
    })
  }

  async createCalendarEvent(subject: string, start: string, end: string, attendees: string[]) {
    await this.client.post('/me/events', {
      subject,
      start: { dateTime: start, timeZone: 'UTC' },
      end: { dateTime: end, timeZone: 'UTC' },
      attendees: attendees.map(email => ({
        emailAddress: { address: email },
        type: 'required',
      })),
    })
  }

  async postTeamsMessage(teamId: string, channelId: string, message: string) {
    await this.client.post(
      `/teams/${teamId}/channels/${channelId}/messages`,
      { body: { content: message } }
    )
  }
}
```

### 4. MOM Generator

```typescript
// src/services/ai/momGenerator.ts
import OpenAI from 'openai'

export class MOMGenerator {
  private client: OpenAI

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  async generateMOM(meetingNotes: string): Promise<string> {
    const systemPrompt = `You are a professional consulting assistant...`
    
    const completion = await this.client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: meetingNotes },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })

    return completion.choices[0]?.message?.content || ''
  }
}
```

### 5. Workflow Executor

```typescript
// src/services/workflow/workflowExecutor.ts
export class WorkflowExecutor {
  private graphClient: GraphClient
  private momGenerator: MOMGenerator

  constructor(accessToken: string) {
    this.graphClient = new GraphClient(accessToken)
    this.momGenerator = new MOMGenerator()
  }

  async execute(context: WorkflowExecutionContext) {
    const actionsExecuted: string[] = []
    let generatedMOM: string | undefined

    // Execute actions sequentially
    for (const action of context.workflow.actions) {
      switch (action) {
        case 'generate_mom':
          generatedMOM = await this.momGenerator.generateMOM(context.momContent!)
          actionsExecuted.push('generate_mom')
          break

        case 'send_email':
          await this.graphClient.sendEmail(
            context.emailTo!,
            context.emailSubject!,
            context.emailBody || generatedMOM!
          )
          actionsExecuted.push('send_email')
          break

        case 'create_calendar':
          await this.graphClient.createCalendarEvent(
            context.calendarTitle!,
            context.calendarStart!,
            context.calendarEnd!,
            context.calendarAttendees || []
          )
          actionsExecuted.push('create_calendar')
          break

        case 'teams_post':
          await this.graphClient.postTeamsMessage(
            context.teamsTeamId!,
            context.teamsChannelId!,
            context.teamsMessage || generatedMOM!
          )
          actionsExecuted.push('teams_post')
          break
      }
    }

    return { success: true, actionsExecuted }
  }
}
```

## Middleware

### Authentication Middleware

```typescript
// src/middleware/auth.ts
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const user = await User.findById(req.session.userId)
  if (!user) {
    return res.status(401).json({ error: 'User not found' })
  }

  // Check token expiry and refresh if needed
  if (user.tokenExpiresAt && user.tokenExpiresAt < new Date()) {
    // Refresh token logic...
  }

  req.user = user
  next()
}
```

## API Routes

### Route Registration

```typescript
// src/routes/workflow.ts
import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import * as controller from '../controllers/workflowController'

const router = Router()

router.use(requireAuth) // Protect all routes

router.post('/', controller.createWorkflow)
router.get('/', controller.getWorkflows)
router.get('/:id', controller.getWorkflow)
router.post('/run/:id', controller.runWorkflow)
router.delete('/:id', controller.deleteWorkflow)

export default router
```

## Error Handling

### Controller Error Pattern

```typescript
export const createWorkflow = async (req: Request, res: Response) => {
  try {
    const { name, actions } = req.body

    if (!name || !actions?.length) {
      return res.status(400).json({ error: 'Name and actions required' })
    }

    const workflow = await Workflow.create({
      userId: req.user!._id,
      name,
      actions,
    })

    res.status(201).json(workflow)
  } catch (error: any) {
    console.error('Create workflow error:', error)
    res.status(500).json({ error: 'Failed to create workflow' })
  }
}
```

## Security Measures

1. **Session Security**: HTTPOnly, Secure cookies
2. **CORS**: Restricted to frontend origin
3. **Token Storage**: Encrypted in database
4. **Input Validation**: Required fields checked
5. **Error Handling**: No stack traces in production

---

:::tip Learn More
See the [Database Schema](/docs/architecture/database) for data model details.
:::

