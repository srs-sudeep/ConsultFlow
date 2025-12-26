---
sidebar_position: 2
---

# Workflows API

Endpoints for workflow CRUD operations and execution.

## Base URL

```
http://localhost:3001/workflow
```

:::info Authentication Required
All workflow endpoints require authentication. Include the session cookie in requests.
:::

## Endpoints

### Create Workflow

Creates a new workflow.

```http
POST /workflow
```

**Headers:**
```
Content-Type: application/json
Cookie: connect.sid={session_cookie}
```

**Request Body:**
```json
{
  "name": "Meeting Follow-up Automation",
  "actions": ["generate_mom", "send_email", "create_calendar"],
  "actionConfigs": {
    "send_email": {
      "to": "team@company.com",
      "subject": "Meeting Minutes"
    }
  },
  "canvasData": {
    "nodes": [
      {
        "id": "node-1",
        "type": "trigger",
        "position": { "x": 100, "y": 100 },
        "data": { "label": "Manual Trigger" }
      }
    ],
    "edges": []
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Workflow name |
| `actions` | string[] | Yes | Array of action types |
| `actionConfigs` | object | No | Default configs for actions |
| `canvasData` | object | No | React Flow canvas state |

**Success Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439012",
  "name": "Meeting Follow-up Automation",
  "trigger": "manual",
  "actions": ["generate_mom", "send_email", "create_calendar"],
  "actionConfigs": {...},
  "canvasData": {...},
  "createdAt": "2024-12-26T10:00:00.000Z",
  "updatedAt": "2024-12-26T10:00:00.000Z"
}
```

**Error Response (400):**
```json
{
  "error": "Name and actions are required"
}
```

---

### Get All Workflows

Returns all workflows for the authenticated user.

```http
GET /workflow
```

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Meeting Follow-up",
    "trigger": "manual",
    "actions": ["generate_mom", "send_email"],
    "createdAt": "2024-12-26T10:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Weekly Report",
    "trigger": "manual",
    "actions": ["generate_mom", "teams_post"],
    "createdAt": "2024-12-25T09:00:00.000Z"
  }
]
```

---

### Get Single Workflow

Returns a specific workflow by ID.

```http
GET /workflow/:id
```

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Workflow ID |

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439012",
  "name": "Meeting Follow-up Automation",
  "trigger": "manual",
  "actions": ["generate_mom", "send_email", "create_calendar"],
  "actionConfigs": {
    "send_email": {
      "to": "team@company.com"
    }
  },
  "canvasData": {
    "nodes": [...],
    "edges": [...]
  },
  "createdAt": "2024-12-26T10:00:00.000Z",
  "updatedAt": "2024-12-26T10:00:00.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Workflow not found"
}
```

---

### Execute Workflow

Executes a workflow with provided data.

```http
POST /workflow/run/:id
```

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Workflow ID |

**Request Body:**
```json
{
  "momContent": "Meeting notes to process...",
  "emailTo": "recipient@example.com",
  "emailSubject": "Meeting Minutes",
  "emailBody": "Optional custom body",
  "calendarTitle": "Follow-up Meeting",
  "calendarStart": "2024-12-27T14:00:00",
  "calendarEnd": "2024-12-27T15:00:00",
  "calendarAttendees": ["john@example.com", "sarah@example.com"],
  "teamsTeamId": "team-id",
  "teamsChannelId": "channel-id",
  "teamsMessage": "Optional custom message"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `momContent` | string | For MOM action | Meeting notes |
| `emailTo` | string | For email action | Recipient email(s) |
| `emailSubject` | string | For email action | Email subject |
| `emailBody` | string | No | Custom email body |
| `calendarTitle` | string | For calendar | Event title |
| `calendarStart` | string | For calendar | ISO 8601 datetime |
| `calendarEnd` | string | For calendar | ISO 8601 datetime |
| `calendarAttendees` | string[] | No | Attendee emails |
| `teamsTeamId` | string | For Teams | Team ID |
| `teamsChannelId` | string | For Teams | Channel ID |
| `teamsMessage` | string | No | Custom message |

**Success Response (200):**
```json
{
  "success": true,
  "logId": "507f1f77bcf86cd799439013",
  "actionsExecuted": ["generate_mom", "send_email", "create_calendar"]
}
```

**Partial Success Response (200):**
```json
{
  "success": false,
  "logId": "507f1f77bcf86cd799439013",
  "actionsExecuted": ["generate_mom"],
  "error": "Missing required permissions: Mail.Send"
}
```

**Error Response (404):**
```json
{
  "error": "Workflow not found"
}
```

---

### Delete Workflow

Deletes a workflow.

```http
DELETE /workflow/:id
```

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Workflow ID |

**Success Response (200):**
```json
{
  "success": true
}
```

**Error Response (404):**
```json
{
  "error": "Workflow not found"
}
```

---

## Action Types

Available actions for workflows:

| Action | Description | Required Fields |
|--------|-------------|-----------------|
| `generate_mom` | Generate meeting minutes | `momContent` |
| `send_email` | Send Outlook email | `emailTo`, `emailSubject` |
| `create_calendar` | Create calendar event | `calendarTitle`, `calendarStart`, `calendarEnd` |
| `teams_post` | Post to Teams channel | `teamsTeamId`, `teamsChannelId` |
| `create_ppt` | Create PowerPoint | (Coming soon) |
| `ai_process` | Custom AI processing | (Coming soon) |
| `save_data` | Save data | (Coming soon) |
| `api_call` | External API call | (Coming soon) |

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad request (validation failed) |
| 401 | Not authenticated |
| 404 | Workflow not found |
| 500 | Server error |

