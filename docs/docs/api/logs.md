---
sidebar_position: 4
---

# Logs API

Endpoints for workflow execution logs.

## Base URL

```
http://localhost:3001/logs
```

:::info Authentication Required
All log endpoints require authentication.
:::

## Endpoints

### Get All Logs

Returns execution logs for the authenticated user.

```http
GET /logs
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 50 | Max logs to return |
| `skip` | number | 0 | Number of logs to skip |

**Example:**
```
GET /logs?limit=10&skip=0
```

**Success Response (200):**
```json
{
  "logs": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "userId": "507f1f77bcf86cd799439011",
      "workflowId": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Meeting Follow-up",
        "actions": ["generate_mom", "send_email"]
      },
      "status": "completed",
      "actionsExecuted": ["generate_mom", "send_email"],
      "error": null,
      "executedAt": "2024-12-26T15:30:05.000Z",
      "createdAt": "2024-12-26T15:30:00.000Z",
      "updatedAt": "2024-12-26T15:30:05.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439014",
      "workflowId": {
        "_id": "507f1f77bcf86cd799439015",
        "name": "Weekly Report",
        "actions": ["generate_mom", "teams_post"]
      },
      "status": "failed",
      "actionsExecuted": ["generate_mom"],
      "error": "Missing required permissions: ChannelMessage.Send",
      "executedAt": "2024-12-26T14:00:05.000Z"
    }
  ],
  "total": 25,
  "limit": 10,
  "skip": 0
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `logs` | array | Array of log objects |
| `total` | number | Total number of logs |
| `limit` | number | Requested limit |
| `skip` | number | Number skipped |

---

### Get Single Log

Returns a specific execution log.

```http
GET /logs/:id
```

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Log ID |

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "userId": "507f1f77bcf86cd799439011",
  "workflowId": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Meeting Follow-up",
    "actions": ["generate_mom", "send_email"]
  },
  "status": "completed",
  "actionsExecuted": ["generate_mom", "send_email"],
  "error": null,
  "executedAt": "2024-12-26T15:30:05.000Z",
  "createdAt": "2024-12-26T15:30:00.000Z",
  "updatedAt": "2024-12-26T15:30:05.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Log not found"
}
```

---

## Log Object Schema

```typescript
interface ExecutionLog {
  _id: string
  userId: string
  workflowId: string | {
    _id: string
    name: string
    actions: string[]
  }
  status: 'running' | 'completed' | 'failed'
  actionsExecuted: string[]
  error?: string
  executedAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

---

## Status Values

| Status | Description | Visual |
|--------|-------------|--------|
| `running` | Execution in progress | 🔄 Yellow |
| `completed` | All actions succeeded | ✅ Green |
| `failed` | One or more actions failed | ❌ Red |

---

## Pagination Example

**First page:**
```
GET /logs?limit=10&skip=0
```

**Second page:**
```
GET /logs?limit=10&skip=10
```

**Third page:**
```
GET /logs?limit=10&skip=20
```

---

## Usage Examples

### JavaScript/TypeScript

```typescript
// Get recent logs
const response = await axios.get('/logs', {
  params: { limit: 10, skip: 0 },
  withCredentials: true
})

const { logs, total } = response.data
console.log(`Showing ${logs.length} of ${total} logs`)

// Get specific log
const log = await axios.get(`/logs/${logId}`, {
  withCredentials: true
})
console.log(log.data.status)
```

### cURL

```bash
# Get logs
curl -X GET "http://localhost:3001/logs?limit=10" \
  -H "Cookie: connect.sid=your-session-cookie"

# Get single log
curl -X GET "http://localhost:3001/logs/507f1f77bcf86cd799439013" \
  -H "Cookie: connect.sid=your-session-cookie"
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 401 | Not authenticated |
| 404 | Log not found |
| 500 | Server error |

