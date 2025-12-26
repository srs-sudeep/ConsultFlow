---
sidebar_position: 4
---

# Execution Logs

Track and monitor all workflow executions with detailed logging.

## Overview

Every workflow execution is logged with:
- Timestamp
- Status (running, completed, failed)
- Actions executed
- Error messages (if any)

## Viewing Logs

### Dashboard Quick View

The dashboard shows the 5 most recent executions:

```
Recent Activity
─────────────────────────────
✓ Meeting Follow-up     2 min ago
✓ Weekly Report         1 hour ago
✗ Client Update         3 hours ago
```

### Logs Page

Navigate to **Execution Logs** for the full history:

```
All Executions
─────────────────────────────
| Workflow       | Status    | Actions              | Time      |
|----------------|-----------|----------------------|-----------|
| Meeting F/U    | Completed | MOM, Email, Calendar | 2 min ago |
| Weekly Report  | Completed | MOM, Teams           | 1 hr ago  |
| Client Update  | Failed    | MOM                  | 3 hr ago  |
```

## Log Details

### Successful Execution

```json
{
  "_id": "log-123",
  "workflowId": "workflow-456",
  "status": "completed",
  "actionsExecuted": [
    "generate_mom",
    "send_email",
    "create_calendar"
  ],
  "error": null,
  "executedAt": "2024-12-26T15:30:05.000Z"
}
```

### Failed Execution

```json
{
  "_id": "log-789",
  "workflowId": "workflow-456",
  "status": "failed",
  "actionsExecuted": [
    "generate_mom"
  ],
  "error": "Missing required permissions: Mail.Send",
  "executedAt": "2024-12-26T15:30:05.000Z"
}
```

## Status Types

| Status | Description | Icon |
|--------|-------------|------|
| `running` | Execution in progress | 🔄 Spinner |
| `completed` | All actions successful | ✅ Green check |
| `failed` | One or more actions failed | ❌ Red X |

## Filtering & Pagination

### Current Features

- View up to 50 logs
- Sort by execution date (newest first)
- See workflow name (via population)

### Planned Features

- Filter by status
- Filter by date range
- Search by workflow name
- Export logs to CSV

## API Endpoints

### Get All Logs

```bash
GET /logs?limit=50&skip=0

Response:
{
  "logs": [...],
  "total": 100,
  "limit": 50,
  "skip": 0
}
```

### Get Single Log

```bash
GET /logs/:id

Response:
{
  "_id": "log-123",
  "workflowId": {
    "_id": "workflow-456",
    "name": "Meeting Follow-up"
  },
  "status": "completed",
  "actionsExecuted": ["generate_mom", "send_email"],
  "executedAt": "2024-12-26T15:30:05.000Z"
}
```

## Log Lifecycle

```
1. Workflow Triggered
   └── Log created with status: "running"
   
2. Actions Execute
   └── actionsExecuted updated as each completes
   
3. Execution Complete
   └── Status updated to "completed" or "failed"
   └── Error message added if failed
   └── executedAt timestamp set
```

## Implementation Details

### Creating a Log

```typescript
// When workflow execution starts
const log = await ExecutionLog.create({
  userId: req.user._id,
  workflowId: workflow._id,
  status: 'running',
  actionsExecuted: [],
})
```

### Updating a Log

```typescript
// As actions complete
log.actionsExecuted.push('generate_mom')
await log.save()

// On completion
log.status = 'completed'
log.executedAt = new Date()
await log.save()

// On failure
log.status = 'failed'
log.error = error.message
log.executedAt = new Date()
await log.save()
```

## Debugging Failed Executions

### 1. Check Error Message

The error field contains the failure reason:
- "Missing required permissions" → Re-authenticate
- "Token expired" → Refresh token failed
- "Invalid email address" → Check recipient format

### 2. Check Actions Executed

See which actions ran before failure:
- If empty: Trigger issue
- If partial: Find the failed action

### 3. Review Input Data

Check what data was passed to the workflow:
- Meeting notes format
- Email addresses
- Calendar times

## Best Practices

### 1. Monitor Regularly

Check logs after new workflow deployments:
- First-time execution testing
- After configuration changes
- After authentication updates

### 2. Clean Up Old Logs

Implement log rotation (planned feature):
```javascript
// Delete logs older than 30 days
await ExecutionLog.deleteMany({
  createdAt: { $lt: thirtyDaysAgo }
})
```

### 3. Set Up Alerts (Future)

Planned feature: Email/Teams notification on failure

---

:::tip Quick Debug
For failed executions, check the error message first - it usually tells you exactly what went wrong!
:::

