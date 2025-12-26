# Workflow Execution Examples

## Example Data for Testing Workflows

### 📝 Meeting Notes / Transcript
```
Meeting: Weekly Team Sync
Date: December 26, 2024
Attendees: John Doe, Jane Smith, Bob Johnson

Agenda:
1. Project status updates
2. Q4 goals review
3. Resource allocation

Discussion:
- John reported that the frontend is 80% complete
- Jane mentioned delays in API integration due to third-party service issues
- Bob suggested we need 2 more developers for the next sprint

Decisions:
- Approved hiring 2 frontend developers
- Extended project deadline by 2 weeks
- Will use Azure DevOps for project tracking

Action Items:
- John: Complete frontend by Jan 15
- Jane: Resolve API integration issues by Jan 10
- Bob: Post job openings by Dec 30

Risks:
- Third-party API reliability concerns
- Potential resource constraints if hiring delayed
```

### 📧 Email Fields

**Email To:**
```
team@company.com
```
or
```
john.doe@company.com, jane.smith@company.com
```

**Email Subject:**
```
Weekly Team Sync - Meeting Minutes - December 26, 2024
```
or
```
Q4 Review Meeting - Action Items and Decisions
```

### 📅 Calendar Event Fields

**Event Title:**
```
Weekly Team Sync
```
or
```
Project Review Meeting
```

**Start Date & Time:**
```
2024-12-27T10:00
```
(Format: YYYY-MM-DDTHH:MM - Example: December 27, 2024 at 10:00 AM)

**End Date & Time:**
```
2024-12-27T11:00
```
(Format: YYYY-MM-DDTHH:MM - Example: December 27, 2024 at 11:00 AM)

### 💬 Microsoft Teams Fields

**Teams Team ID:**
```
19:meeting_abc123def456@thread.skype
```
or
```
19:team_xyz789@thread.tacv2
```

**Channel ID:**
```
19:channel_1234567890@thread.skype
```
or
```
19:channel_general@thread.tacv2
```

**Message:**
```
📋 Weekly Team Sync - Meeting Minutes

Key Highlights:
✅ Frontend progress: 80% complete
✅ Approved hiring 2 developers
⚠️ API integration delays identified

Action Items:
- John: Complete frontend by Jan 15
- Jane: Resolve API issues by Jan 10
- Bob: Post job openings by Dec 30

See full minutes in attached email.
```

## 🔍 How to Find Teams Team ID and Channel ID

### Method 1: From Teams URL
1. Open Microsoft Teams
2. Navigate to your team and channel
3. Look at the URL - it will contain the IDs:
   ```
   https://teams.microsoft.com/l/channel/19%3Achannel_abc123@thread.tacv2/...
   ```
   - Team ID is usually in the team URL
   - Channel ID is in the channel URL

### Method 2: Using Microsoft Graph Explorer
1. Go to https://developer.microsoft.com/graph/graph-explorer
2. Sign in with your Microsoft account
3. Use these queries:
   - Get teams: `GET https://graph.microsoft.com/v1.0/me/joinedTeams`
   - Get channels: `GET https://graph.microsoft.com/v1.0/teams/{team-id}/channels`

### Method 3: From Teams Desktop App
1. Right-click on the team/channel
2. Select "Get link to channel" (if available)
3. The link contains the channel ID

## 📋 Complete Example Workflow Execution

### Scenario: Generate MOM + Send Email + Create Calendar Event

**Meeting Notes:**
```
Project Kickoff Meeting
Date: December 26, 2024
Team: Development Team

Discussed project timeline and milestones.
Decided to use Agile methodology.
Next meeting scheduled for January 5, 2025.
```

**Email To:**
```
project-team@company.com
```

**Email Subject:**
```
Project Kickoff - Meeting Minutes
```

**Event Title:**
```
Project Kickoff Follow-up Meeting
```

**Start Date & Time:**
```
2025-01-05T14:00
```

**End Date & Time:**
```
2025-01-05T15:00
```

## ⚠️ Important Notes

1. **Date Format**: Use `YYYY-MM-DDTHH:MM` format (24-hour time)
   - Example: `2024-12-27T14:30` = December 27, 2024 at 2:30 PM

2. **Email**: Can be single or multiple addresses (comma-separated)

3. **Teams IDs**: These are typically long strings. You may need to extract them from Teams URLs or use Graph API.

4. **MOM Generation**: The AI will automatically format your raw notes into structured meeting minutes.

5. **Required Fields**: Only fill fields for actions that are in your workflow!

