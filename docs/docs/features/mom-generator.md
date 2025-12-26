---
sidebar_position: 2
---

# MOM Generator

The AI-powered Meeting Minutes (MOM) generator transforms raw meeting notes into structured, professional documentation.

## Overview

ConsultFlow uses OpenAI's GPT models to:

- **Extract key information** from unstructured notes
- **Identify action items** with assignees and due dates
- **Summarize discussions** by speaker
- **Format output** in professional Markdown

## How It Works

```
Raw Meeting Notes → OpenAI GPT → Structured MOM → Markdown Output
```

1. User pastes meeting transcript or notes
2. AI processes with specialized prompt
3. Structured MOM generated in Markdown
4. Preview displayed with formatting

## Output Format

The generated MOM follows this structure:

```markdown
# Meeting Minutes

## Overview
[80-word abstract summary of the meeting]

## Discussion Items
[Speaker Name]:
- Point 1 discussed
- Point 2 discussed

[Another Speaker]:
- Their discussion points

## Action Items
| Action Item | Assignee Name | Due Date |
|-------------|---------------|----------|
| Task description | Person Name | 12/25 & Wed |

## Date and Time
[Extracted or TBD]

## Location
[Extracted, Virtual, or TBD]

## Meeting Title
[Extracted or generated]

## Attendees
- Name 1
- Name 2
- Name 3

## Materials Used
[Documents, presentations mentioned]

## Agenda
• Item 1
• Item 2

## Decisions
[Key decisions made]

## Detailed Minutes
### Project Progress Report
[Status updates]

### Confirmation of Issues/To Do Status
[Issue updates]

### Other Contact Items
[Additional discussion]

## Next Meeting
- **Date and Time:** [Extracted or TBD]
- **Location:** [Extracted or TBD]
- **Attendees:** [Expected attendees]
```

## Using the MOM Generator

### Standalone Mode

1. Go to **MOM Generator** from sidebar
2. Paste meeting notes in the text area
3. Click **"Generate MOM"**
4. Review the output
5. Copy or use in workflow

### In Workflow Execution

1. Execute a workflow with "Generate MOM" action
2. Paste notes in the transcript field
3. Click **"Generate MOM"**
4. MOM auto-fills email body
5. Continue with other actions

## Input Tips

### Good Input Example

```
Project Status Meeting - December 26, 2024
Attendees: John Smith (PM), Sarah Johnson (Dev), Mike Brown (QA)

Discussion:
John: Q4 results show 15% growth over Q3. We're on track for annual targets.
Sarah: The new feature deployment is complete. We had some minor bugs but they're fixed.
Mike: Testing is 90% complete. Found 3 critical bugs, all assigned to Sarah.

Action Items:
- John to prepare Q1 forecast by January 5
- Sarah to fix critical bugs by December 28
- Mike to complete final testing by December 30

Next meeting: January 3, 2025 at 2:00 PM
Location: Conference Room A
```

### Tips for Better Results

1. **Include attendee names** - Helps identify speakers
2. **Add dates** - For action item due dates
3. **Use clear structure** - Separate topics clearly
4. **Quote speakers** - "John said..." or "John: ..."
5. **List action items** - Even informally mentioned ones

## AI Configuration

### Environment Variables

```env
# Standard OpenAI
OPENAI_API_KEY=sk-your-api-key
OPENAI_MODEL=gpt-3.5-turbo  # or gpt-4

# Azure OpenAI (alternative)
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-35-turbo
```

### Model Comparison

| Model | Speed | Quality | Cost |
|-------|-------|---------|------|
| gpt-3.5-turbo | Fast | Good | Low |
| gpt-4 | Slower | Excellent | Higher |
| gpt-4-turbo | Medium | Excellent | Medium |

### Prompt Engineering

The system prompt instructs the AI to:

1. Extract meeting metadata
2. Summarize in 80 words max
3. Group discussion by speaker
4. Create action item table
5. Use professional language
6. Format as Markdown

## Pre-filling Workflow Data

When MOM is generated, ConsultFlow extracts:

### Email Pre-fill
- **To**: Extracted attendee emails
- **Subject**: "Meeting Minutes - [Meeting Title]"
- **Body**: Full MOM content

### Calendar Pre-fill
- **Title**: Next meeting title
- **Date/Time**: Extracted from "Next Meeting"
- **Attendees**: Meeting participants

## API Usage

### Generate MOM Endpoint

```bash
POST /mom/generate
Content-Type: application/json
Cookie: session_cookie

{
  "meetingNotes": "Your meeting transcript here..."
}
```

### Response

```json
{
  "mom": "# Meeting Minutes\n\n## Overview...",
  "structured": {
    "meetingTitle": "Project Status Meeting",
    "dateTime": "December 26, 2024",
    "attendees": ["John Smith", "Sarah Johnson"],
    "actionItems": [
      {
        "task": "Prepare Q1 forecast",
        "assignee": "John",
        "dueDate": "January 5"
      }
    ],
    "nextMeeting": {
      "dateTime": "January 3, 2025 at 2:00 PM",
      "location": "Conference Room A"
    }
  }
}
```

## Troubleshooting

### "Failed to generate MOM"

1. Check OpenAI API key is valid
2. Verify API key has sufficient credits
3. Check backend logs for specific error

### Poor Quality Output

1. Provide more structured input
2. Include clear speaker attributions
3. Try a better model (gpt-4)
4. Add more context to notes

### Missing Action Items

1. Explicitly list action items in input
2. Use phrases like "Action: John to..."
3. Include due dates where possible

---

:::tip Pro Tip
For best results, include speaker names with colons: "John: I think we should..." This helps the AI attribute discussion points correctly.
:::

