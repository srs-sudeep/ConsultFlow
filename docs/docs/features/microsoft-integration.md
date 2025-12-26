---
sidebar_position: 3
---

# Microsoft Integration

ConsultFlow integrates deeply with Microsoft 365 services via Microsoft Graph API.

## Supported Services

| Service | Capability | API |
|---------|------------|-----|
| Azure AD | Authentication | OAuth 2.0 |
| Outlook | Send emails | Mail.Send |
| Outlook Calendar | Create events | Calendars.ReadWrite |
| Microsoft Teams | Post messages | ChannelMessage.Send |

## Authentication

### Azure AD OAuth 2.0

ConsultFlow uses delegated permissions, meaning actions are performed on behalf of the signed-in user.

**Required Permissions:**

| Permission | Type | Purpose |
|------------|------|---------|
| User.Read | Delegated | Read user profile |
| Mail.Send | Delegated | Send emails |
| Calendars.ReadWrite | Delegated | Create calendar events |
| ChannelMessage.Send | Delegated | Post to Teams |
| offline_access | Delegated | Refresh tokens |

### Setting Up Azure AD

See [Azure Setup Guide](/docs/getting-started/azure-setup) for detailed instructions.

## Email Integration (Outlook)

### Sending Emails

ConsultFlow sends emails through Outlook using the signed-in user's account.

**Features:**
- HTML formatted emails
- Multiple recipients
- Pre-filled with MOM content

**Example:**
```typescript
await graphClient.sendEmail(
  "recipient@example.com",
  "Meeting Minutes - Project Status",
  "<h1>Meeting Minutes</h1><p>...</p>"
)
```

### Email API Request

```json
POST /me/sendMail
{
  "message": {
    "subject": "Meeting Minutes",
    "body": {
      "contentType": "HTML",
      "content": "<h1>Meeting Minutes</h1>..."
    },
    "toRecipients": [
      {
        "emailAddress": {
          "address": "recipient@example.com"
        }
      }
    ]
  }
}
```

### Multiple Recipients

Separate email addresses with commas in the UI:
```
john@example.com, sarah@example.com, mike@example.com
```

## Calendar Integration (Outlook)

### Creating Events

Schedule meetings directly to Outlook calendar.

**Features:**
- Set title, start/end times
- Add attendees (sends invites)
- Include event body/description

**Example:**
```typescript
await graphClient.createCalendarEvent(
  "Follow-up Meeting",
  "Discuss action items from previous meeting",
  "2024-12-27T14:00:00",
  "2024-12-27T15:00:00",
  ["john@example.com", "sarah@example.com"]
)
```

### Calendar API Request

```json
POST /me/events
{
  "subject": "Follow-up Meeting",
  "body": {
    "contentType": "HTML",
    "content": "Meeting description..."
  },
  "start": {
    "dateTime": "2024-12-27T14:00:00",
    "timeZone": "UTC"
  },
  "end": {
    "dateTime": "2024-12-27T15:00:00",
    "timeZone": "UTC"
  },
  "attendees": [
    {
      "emailAddress": {
        "address": "john@example.com"
      },
      "type": "required"
    }
  ]
}
```

### Time Zone Handling

- Events are created in UTC by default
- Consider user's timezone for accurate scheduling
- Use ISO 8601 format: `YYYY-MM-DDTHH:MM:SS`

## Teams Integration

### Posting to Channels

Share updates with your team via Teams channels.

**Requirements:**
- Team ID
- Channel ID
- User must be a member of the team

**Example:**
```typescript
await graphClient.postTeamsMessage(
  "team-id-here",
  "channel-id-here",
  "Meeting minutes have been shared..."
)
```

### Teams API Request

```json
POST /teams/{team-id}/channels/{channel-id}/messages
{
  "body": {
    "content": "<h1>Meeting Minutes</h1>..."
  }
}
```

### Finding Team and Channel IDs

**Via Graph Explorer:**
1. Go to [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer)
2. Sign in with your Microsoft account
3. Run: `GET https://graph.microsoft.com/v1.0/me/joinedTeams`
4. Find your team ID
5. Run: `GET https://graph.microsoft.com/v1.0/teams/{team-id}/channels`
6. Find your channel ID

**IDs Look Like:**
```
Team ID: 19:meeting_abc123...@thread.v2
Channel ID: 19:def456...@thread.tacv2
```

## Graph Client Implementation

```typescript
// src/services/graph/graphClient.ts
import axios from 'axios'

export class GraphClient {
  private client: AxiosInstance

  constructor(accessToken: string) {
    this.client = axios.create({
      baseURL: 'https://graph.microsoft.com/v1.0',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
  }

  async sendEmail(to: string, subject: string, body: string) {
    // Validate permissions first
    const scopeCheck = checkRequiredScopes(this.accessToken, ['Mail.Send'])
    if (!scopeCheck.hasAll) {
      throw new Error(`Missing permissions: ${scopeCheck.missing.join(', ')}`)
    }

    await this.client.post('/me/sendMail', {
      message: {
        subject,
        body: { contentType: 'HTML', content: body },
        toRecipients: [{ emailAddress: { address: to } }],
      },
    })
  }

  // Similar methods for calendar and teams...
}
```

## Error Handling

### Common Errors

| Error Code | Description | Solution |
|------------|-------------|----------|
| 401 | Unauthorized | Re-authenticate, check token |
| 403 | Forbidden | Missing permissions |
| 404 | Not Found | Invalid ID (team, channel) |
| 429 | Throttled | Too many requests, wait |

### Error Response Example

```json
{
  "error": {
    "code": "Authorization_RequestDenied",
    "message": "Insufficient privileges to complete the operation."
  }
}
```

### Handling in Code

```typescript
try {
  await graphClient.sendEmail(...)
} catch (error: any) {
  if (error.response?.status === 401) {
    // Token expired, refresh needed
  } else if (error.response?.status === 403) {
    // Missing permissions
  }
  throw error
}
```

## Troubleshooting

### "Insufficient privileges"

1. Check permissions in Azure Portal
2. Grant admin consent if required
3. Re-authenticate to get new token

### "Resource not found"

1. Verify Team ID and Channel ID
2. Ensure user is a member of the team
3. Check IDs don't have extra spaces

### "Token expired"

1. Token auto-refreshes if refresh token exists
2. Re-login if refresh fails
3. Check `tokenExpiresAt` in database

---

:::tip Testing
Use [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer) to test API calls with your account before implementing in the workflow.
:::

