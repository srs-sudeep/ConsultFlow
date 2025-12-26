---
sidebar_position: 4
---

# Database Schema

ConsultFlow uses MongoDB with Mongoose ODM for data persistence.

## Collections Overview

| Collection | Purpose |
|------------|---------|
| `users` | User accounts and OAuth tokens |
| `workflows` | Workflow definitions |
| `executionlogs` | Workflow execution history |

## User Schema

Stores user information and Microsoft OAuth tokens.

```typescript
// src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  microsoftId: string
  email: string
  name: string
  accessToken?: string
  refreshToken?: string
  tokenExpiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    microsoftId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      select: false, // Not returned by default
    },
    refreshToken: {
      type: String,
      select: false,
    },
    tokenExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Adds createdAt, updatedAt
  }
)

export const User = mongoose.model<IUser>('User', UserSchema)
```

### User Document Example

```json
{
  "_id": "ObjectId('...')",
  "microsoftId": "abc123-...",
  "email": "john@company.com",
  "name": "John Smith",
  "tokenExpiresAt": "2024-12-27T00:00:00.000Z",
  "createdAt": "2024-12-20T10:00:00.000Z",
  "updatedAt": "2024-12-26T15:30:00.000Z"
}
```

## Workflow Schema

Stores workflow definitions with actions and canvas data.

```typescript
// src/models/Workflow.ts
import mongoose, { Document, Schema } from 'mongoose'

export type WorkflowAction =
  | 'generate_mom'
  | 'send_email'
  | 'create_calendar'
  | 'teams_post'
  | 'create_ppt'
  | 'ai_process'
  | 'save_data'
  | 'api_call'

export type WorkflowTrigger =
  | 'manual'
  | 'schedule'
  | 'webhook'
  | 'transcript'

export interface IWorkflow extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  trigger: WorkflowTrigger
  actions: WorkflowAction[]
  actionConfigs: Record<string, any>
  canvasData?: {
    nodes: any[]
    edges: any[]
  }
  createdAt: Date
  updatedAt: Date
}

const WorkflowSchema = new Schema<IWorkflow>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    trigger: {
      type: String,
      enum: ['manual', 'schedule', 'webhook', 'transcript'],
      default: 'manual',
    },
    actions: {
      type: [String],
      enum: [
        'generate_mom',
        'send_email',
        'create_calendar',
        'teams_post',
        'create_ppt',
        'ai_process',
        'save_data',
        'api_call',
      ],
      required: true,
    },
    actionConfigs: {
      type: Schema.Types.Mixed,
      default: {},
    },
    canvasData: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

export const Workflow = mongoose.model<IWorkflow>('Workflow', WorkflowSchema)
```

### Workflow Document Example

```json
{
  "_id": "ObjectId('...')",
  "userId": "ObjectId('...')",
  "name": "Meeting Follow-up Automation",
  "trigger": "manual",
  "actions": ["generate_mom", "send_email", "create_calendar"],
  "actionConfigs": {
    "send_email": {
      "to": "team@company.com",
      "subject": "Meeting Minutes"
    },
    "create_calendar": {
      "title": "Follow-up Meeting"
    }
  },
  "canvasData": {
    "nodes": [
      {
        "id": "trigger-1",
        "type": "trigger",
        "position": { "x": 100, "y": 100 },
        "data": { "label": "Manual Trigger", "actionType": "manual" }
      },
      {
        "id": "action-1",
        "type": "action",
        "position": { "x": 100, "y": 250 },
        "data": { "label": "Generate MOM", "actionType": "generate_mom" }
      }
    ],
    "edges": [
      {
        "id": "edge-1",
        "source": "trigger-1",
        "target": "action-1"
      }
    ]
  },
  "createdAt": "2024-12-26T10:00:00.000Z",
  "updatedAt": "2024-12-26T10:00:00.000Z"
}
```

## Execution Log Schema

Records workflow execution history.

```typescript
// src/models/ExecutionLog.ts
import mongoose, { Document, Schema } from 'mongoose'

export interface IExecutionLog extends Document {
  userId: mongoose.Types.ObjectId
  workflowId: mongoose.Types.ObjectId
  status: 'running' | 'completed' | 'failed'
  actionsExecuted: string[]
  error?: string
  executedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const ExecutionLogSchema = new Schema<IExecutionLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    workflowId: {
      type: Schema.Types.ObjectId,
      ref: 'Workflow',
      required: true,
    },
    status: {
      type: String,
      enum: ['running', 'completed', 'failed'],
      default: 'running',
    },
    actionsExecuted: {
      type: [String],
      default: [],
    },
    error: {
      type: String,
    },
    executedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

export const ExecutionLog = mongoose.model<IExecutionLog>(
  'ExecutionLog',
  ExecutionLogSchema
)
```

### Execution Log Document Example

```json
{
  "_id": "ObjectId('...')",
  "userId": "ObjectId('...')",
  "workflowId": "ObjectId('...')",
  "status": "completed",
  "actionsExecuted": ["generate_mom", "send_email"],
  "error": null,
  "executedAt": "2024-12-26T15:30:05.000Z",
  "createdAt": "2024-12-26T15:30:00.000Z",
  "updatedAt": "2024-12-26T15:30:05.000Z"
}
```

## Indexes

### User Indexes

```javascript
// Unique indexes
db.users.createIndex({ microsoftId: 1 }, { unique: true })
db.users.createIndex({ email: 1 }, { unique: true })
```

### Workflow Indexes

```javascript
// Query by user
db.workflows.createIndex({ userId: 1 })

// Sort by creation date
db.workflows.createIndex({ userId: 1, createdAt: -1 })
```

### Execution Log Indexes

```javascript
// Query by user
db.executionlogs.createIndex({ userId: 1 })

// Query by workflow
db.executionlogs.createIndex({ workflowId: 1 })

// Sort by execution date
db.executionlogs.createIndex({ userId: 1, executedAt: -1 })
```

## Database Connection

```typescript
// src/config/database.ts
import mongoose from 'mongoose'

export const connectDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI!
    
    await mongoose.connect(uri, {
      // Mongoose 8 uses these defaults
    })
    
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}
```

## Queries Examples

### Find User's Workflows

```typescript
const workflows = await Workflow.find({ userId: user._id })
  .sort({ createdAt: -1 })
  .lean()
```

### Get Execution Logs with Workflow Details

```typescript
const logs = await ExecutionLog.find({ userId: user._id })
  .populate('workflowId', 'name actions')
  .sort({ executedAt: -1 })
  .limit(50)
```

### Update User Tokens

```typescript
await User.findByIdAndUpdate(userId, {
  accessToken: newToken,
  refreshToken: newRefreshToken,
  tokenExpiresAt: expiresAt,
})
```

---

:::tip Learn More
See the [Authentication Flow](/docs/architecture/authentication) for token management details.
:::

