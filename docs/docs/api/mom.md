---
sidebar_position: 3
---

# MOM Generation API

Endpoint for AI-powered meeting minutes generation.

## Base URL

```
http://localhost:3001/mom
```

:::info Authentication Required
The MOM endpoint requires authentication.
:::

## Endpoints

### Generate MOM

Generates structured meeting minutes from notes.

```http
POST /mom/generate
```

**Headers:**
```
Content-Type: application/json
Cookie: connect.sid={session_cookie}
```

**Request Body:**
```json
{
  "meetingNotes": "Project Status Meeting - December 26, 2024\n\nAttendees: John Smith, Sarah Johnson\n\nDiscussion:\n- John presented Q4 results\n- Sarah discussed new features\n\nAction Items:\n- John to prepare forecast by Jan 5\n- Sarah to complete testing by Dec 30"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `meetingNotes` | string | Yes | Raw meeting notes or transcript |

**Success Response (200):**
```json
{
  "mom": "# Meeting Minutes\n\n## Overview\nThe project status meeting covered Q4 results and upcoming feature releases...\n\n## Discussion Items\n**John Smith:**\n- Presented Q4 results showing positive growth\n\n**Sarah Johnson:**\n- Discussed new feature implementation\n\n## Action Items\n| Action Item | Assignee Name | Due Date |\n|-------------|---------------|----------|\n| Prepare Q1 forecast | John Smith | 01/05 & Sun |\n| Complete testing | Sarah Johnson | 12/30 & Mon |\n\n...",
  "structured": {
    "meetingTitle": "Project Status Meeting",
    "dateTime": "December 26, 2024",
    "location": "TBD",
    "attendees": ["John Smith", "Sarah Johnson"],
    "agenda": ["Q4 Results Review", "New Feature Discussion"],
    "discussionItems": {
      "John Smith": ["Presented Q4 results showing positive growth"],
      "Sarah Johnson": ["Discussed new feature implementation"]
    },
    "actionItems": [
      {
        "task": "Prepare Q1 forecast",
        "assignee": "John Smith",
        "dueDate": "January 5"
      },
      {
        "task": "Complete testing",
        "assignee": "Sarah Johnson",
        "dueDate": "December 30"
      }
    ],
    "decisions": [],
    "nextMeeting": {
      "dateTime": "TBD",
      "location": "TBD",
      "attendees": []
    }
  }
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `mom` | string | Full formatted MOM in Markdown |
| `structured` | object | Parsed structured data |
| `structured.meetingTitle` | string | Extracted meeting title |
| `structured.dateTime` | string | Meeting date/time |
| `structured.attendees` | string[] | List of attendees |
| `structured.actionItems` | array | Parsed action items |
| `structured.nextMeeting` | object | Next meeting details |

**Error Response (400):**
```json
{
  "error": "Meeting notes are required"
}
```

**Error Response (500):**
```json
{
  "error": "Failed to generate MOM: Rate limit exceeded"
}
```

---

## Output Format

The generated MOM follows this Markdown structure:

```markdown
# Meeting Minutes

## Overview
[80-word summary]

## Discussion Items
[Speaker Name]:
- Point 1
- Point 2

## Action Items
| Action Item | Assignee Name | Due Date |
|-------------|---------------|----------|
| Task | Name | MM/DD & Day |

## Date and Time
[Extracted date]

## Location
[Location or Virtual]

## Meeting Title
[Title]

## Attendees
- Name 1
- Name 2

## Materials Used
[Documents mentioned]

## Agenda
• Item 1
• Item 2

## Decisions
[Decisions made]

## Detailed Minutes
### Project Progress Report
[Details]

### Confirmation of Issues/To Do Status
[Status]

### Other Contact Items
[Other items]

## Next Meeting
- **Date and Time:** [Date]
- **Location:** [Location]
- **Attendees:** [List]
```

---

## AI Configuration

The MOM generator uses these OpenAI settings:

```typescript
{
  model: "gpt-3.5-turbo", // or gpt-4
  temperature: 0.3,       // Lower = more focused
  max_tokens: 2000        // Max output length
}
```

---

## Best Practices

### Input Format

For best results, structure input like:

```
[Meeting Name] - [Date]

Attendees: [Names]

Discussion:
[Speaker]: [What they said]
[Speaker]: [What they said]

Action Items:
- [Task] by [Person] by [Date]
- [Task] by [Person] by [Date]

Next Meeting: [Date] at [Time]
```

### Common Use Cases

**1. Direct Transcript:**
```json
{
  "meetingNotes": "John: I think we should prioritize the dashboard.\nSarah: Agreed, let's do that first.\nJohn: Great, I'll create tickets by Friday."
}
```

**2. Summary Notes:**
```json
{
  "meetingNotes": "Sprint Planning - Dec 26\nTopics: Dashboard priority, Q1 roadmap\nDecided to focus on dashboard first\nJohn owns ticket creation (due Friday)"
}
```

---

## Error Handling

### Rate Limiting

If OpenAI rate limits are hit:
```json
{
  "error": "Failed to generate MOM: Rate limit exceeded"
}
```

**Solution:** Wait and retry, or upgrade OpenAI plan.

### Token Limits

Very long transcripts may exceed token limits:
```json
{
  "error": "Failed to generate MOM: maximum context length exceeded"
}
```

**Solution:** Summarize or split the transcript.

