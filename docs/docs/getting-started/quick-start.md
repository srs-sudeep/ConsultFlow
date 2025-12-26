---
sidebar_position: 4
---

# Quick Start

Create your first workflow in under 5 minutes!

## Step 1: Log In

1. Open `http://localhost:3000`
2. Click **"Get Started"** or **"Sign In"**
3. Click **"Continue with Microsoft"**
4. Complete the Microsoft login flow
5. Grant the requested permissions

You should now be on the **Dashboard**.

## Step 2: Create Your First Workflow

### 2.1 Open Workflow Builder

1. Click **"Create Workflow"** card or **"New Workflow"** in the sidebar
2. You'll see the visual workflow builder canvas

### 2.2 Name Your Workflow

1. Click the workflow name input at the top
2. Enter: `Meeting Follow-up Automation`

### 2.3 Add Workflow Nodes

From the right sidebar, drag nodes onto the canvas:

1. **Add Trigger:**
   - Drag **"Manual Trigger"** to the canvas

2. **Add MOM Generator:**
   - Drag **"Generate MOM"** below the trigger
   - Connect the trigger to MOM generator

3. **Add Email Action:**
   - Drag **"Send Email"** next to MOM generator
   - Connect MOM generator to Email

4. **Add Calendar Action (optional):**
   - Drag **"Create Calendar Event"**
   - Connect from MOM generator

### 2.4 Save the Workflow

1. Click **"Save Workflow"** button
2. You'll be redirected to the dashboard

## Step 3: Execute the Workflow

### 3.1 Open Workflow Execution

1. From the dashboard, find your workflow
2. Click **"Run"** button

### 3.2 Enter Meeting Notes

In the **"Meeting Transcript"** section, paste your meeting notes:

```
Project Status Meeting - December 26, 2024

Attendees: John Smith, Sarah Johnson, Mike Brown

Discussion:
- John presented Q4 results showing 15% growth
- Sarah discussed the new client onboarding process
- Mike raised concerns about timeline for Project Alpha

Action Items:
- John to prepare Q1 forecast by January 5
- Sarah to finalize onboarding documentation
- Mike to schedule follow-up with Alpha team

Next Meeting: January 3, 2025 at 2:00 PM
```

### 3.3 Generate MOM

1. Click **"Generate MOM"** button
2. Wait for AI to process (10-30 seconds)
3. Review the generated Meeting Minutes in the preview panel

### 3.4 Configure Email

1. Click **"Step 2: Send Email"** in the progress bar
2. Fill in the email details:
   - **To:** recipient@example.com
   - **Subject:** Meeting Minutes - Project Status (auto-filled)
   - **Body:** Pre-filled with generated MOM

### 3.5 Configure Calendar (Optional)

1. Click **"Step 3: Calendar Event"**
2. Set event details:
   - **Title:** Follow-up Meeting
   - **Start Time:** Select date/time
   - **End Time:** Select date/time

### 3.6 Execute Workflow

1. Click **"Execute Workflow"** button
2. Watch the progress as each action executes
3. Success! Your workflow completed

## Step 4: Check Results

### View Execution Logs

1. Go to **"Execution Logs"** in the sidebar
2. Find your latest execution
3. See status, actions executed, and any errors

### Verify Email

1. Check the recipient's inbox
2. The email should contain the formatted MOM

### Verify Calendar Event

1. Check your Outlook calendar
2. The event should be created

## What's Next?

Now that you've created your first workflow:

1. **[Explore the Workflow Builder](/docs/features/workflow-builder)** - Learn about all available nodes and features
2. **[Understand MOM Generation](/docs/features/mom-generator)** - Customize AI output format
3. **[Configure Microsoft Integration](/docs/features/microsoft-integration)** - Set up Teams posting

## Example Use Cases

### Daily Standup Summary

```
Workflow: Daily Standup → Generate MOM → Post to Teams
```

### Client Meeting Follow-up

```
Workflow: Meeting Notes → Generate MOM → Send Email → Create Follow-up Event
```

### Project Kickoff

```
Workflow: Kickoff Notes → Generate MOM → Send Email to Team → Post to Project Channel → Create Milestone Events
```

---

:::tip Pro Tip
You can access the standalone **MOM Generator** from the sidebar to quickly generate meeting minutes without creating a full workflow.
:::

