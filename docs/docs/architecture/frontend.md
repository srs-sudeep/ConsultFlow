---
sidebar_position: 2
---

# Frontend Architecture

ConsultFlow's frontend is built with Next.js 14 using the App Router.

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.x | React framework with App Router |
| React | 18.x | UI component library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Utility-first styling |
| React Flow | 11.x | Node-based visual editor |
| Lucide React | Latest | Icon library |
| Axios | 1.x | HTTP client |

## Project Structure

```
frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   ├── globals.css          # Global styles + animations
│   ├── login/
│   │   └── page.tsx         # Login page
│   ├── dashboard/
│   │   └── page.tsx         # Main dashboard
│   ├── workflow/
│   │   ├── create/
│   │   │   └── page.tsx     # Workflow builder
│   │   └── execute/
│   │       └── [id]/
│   │           └── page.tsx # Workflow execution
│   ├── mom/
│   │   └── page.tsx         # Standalone MOM generator
│   └── logs/
│       └── page.tsx         # Execution logs
├── components/
│   ├── Logo.tsx             # Animated logo component
│   ├── workflow/
│   │   ├── WorkflowCanvas.tsx    # React Flow canvas
│   │   ├── ActionSidebar.tsx     # Node palette
│   │   └── nodes/
│   │       ├── TriggerNode.tsx   # Trigger node component
│   │       └── ActionNode.tsx    # Action node component
│   └── ...
├── lib/
│   └── api.ts               # API client (Axios)
└── public/
    └── ...                  # Static assets
```

## Key Components

### 1. Logo Component

The animated ConsultFlow logo with workflow nodes:

```tsx
// components/Logo.tsx
export default function Logo({ size, showText, animated }) {
  // SVG with animated workflow nodes
  // Gradient colors: orange → pink → purple
  // Animated connecting lines
}

export function LoadingLogo({ message }) {
  // Full-page loading animation
  // Spinning outer ring
  // Bouncing dots
}

export function Attribution() {
  // "Built with ❤️ by @srs-sudeep"
}
```

### 2. Workflow Canvas

Visual workflow builder using React Flow:

```tsx
// components/workflow/WorkflowCanvas.tsx
export default function WorkflowCanvas({
  workflowName,
  onNameChange,
  initialNodes,
  initialEdges,
  onSave,
  onCancel,
}) {
  // React Flow provider
  // Custom node types (trigger, action)
  // Connection handlers
  // Drag & drop from sidebar
}
```

### 3. Action Nodes

Custom node components for the canvas:

```tsx
// components/workflow/nodes/ActionNode.tsx
export function ActionNode({ data }) {
  return (
    <div className="node-card">
      <Handle type="target" position={Position.Top} />
      <div className="node-icon">{getIcon(data.actionType)}</div>
      <div className="node-label">{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
```

## State Management

ConsultFlow uses React's built-in state management:

### Local State

```tsx
// Component-level state with useState
const [workflow, setWorkflow] = useState<Workflow | null>(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
```

### React Flow State

```tsx
// React Flow hooks for canvas state
const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
```

### Form State

```tsx
// Execution page form state
const [executionData, setExecutionData] = useState({
  meetingNotes: '',
  emailTo: '',
  emailSubject: '',
  emailBody: '',
  calendarTitle: '',
  calendarStart: '',
  calendarEnd: '',
  // ...
})
```

## API Integration

Centralized API client in `lib/api.ts`:

```tsx
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies
  headers: { 'Content-Type': 'application/json' },
})

export const authApi = {
  login: () => window.location.href = `${API_BASE_URL}/auth/login`,
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
}

export const workflowApi = {
  create: (data) => api.post('/workflow', data),
  getAll: () => api.get('/workflow'),
  getOne: (id) => api.get(`/workflow/${id}`),
  run: (id, data) => api.post(`/workflow/run/${id}`, data),
  delete: (id) => api.delete(`/workflow/${id}`),
}
```

## Styling System

### Tailwind Configuration

```ts
// tailwind.config.ts
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Custom dark theme colors
        background: '#0a0a1a',
        surface: '#16162a',
      },
    },
  },
}
```

### CSS Animations

Custom animations defined in `globals.css`:

```css
@keyframes shimmer {
  0% { transform: translateX(-100%) skewX(-12deg); }
  100% { transform: translateX(200%) skewX(-12deg); }
}

@keyframes flow {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}

@keyframes slideIn {
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

Usage in components:

```tsx
<div className="animate-[shimmer_2s_infinite]" />
<aside className="animate-[slideIn_0.5s_ease-out]" />
```

## Page Patterns

### Protected Page Pattern

```tsx
'use client'

export default function ProtectedPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authApi.getMe()
      } catch (error) {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])
  
  if (loading) return <LoadingLogo />
  
  return <div>Protected Content</div>
}
```

### Data Loading Pattern

```tsx
export default function DataPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    try {
      const res = await api.getData()
      setData(res.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) return <LoadingLogo />
  if (error) return <ErrorDisplay error={error} />
  
  return <DataDisplay data={data} />
}
```

## Performance Optimizations

1. **Code Splitting**: Automatic with Next.js App Router
2. **Image Optimization**: Next.js Image component
3. **Font Optimization**: Next.js font loader
4. **Lazy Loading**: React.lazy for heavy components
5. **Memoization**: useMemo/useCallback where needed

---

:::tip Learn More
See the [Backend Architecture](/docs/architecture/backend) for server-side details.
:::

