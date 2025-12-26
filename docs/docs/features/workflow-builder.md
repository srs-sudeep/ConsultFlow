---
sidebar_position: 1
---

# Workflow Builder

The visual workflow builder is the heart of ConsultFlow, allowing you to create powerful automations without code.

## Overview

The workflow builder uses a node-based interface inspired by tools like n8n. You can:

- **Drag and drop** nodes from the sidebar
- **Connect nodes** to create execution flows
- **Configure each node** with specific settings
- **Save and execute** workflows with one click

## Interface Components

### 1. Canvas Area

The main workspace where you build workflows:

- **Grid background** for alignment
- **Zoom controls** (bottom left)
- **Mini map** (bottom right)
- **Pan** by dragging empty space
- **Select** nodes by clicking

### 2. Node Sidebar

Available nodes categorized by type:

**Triggers:**
- Manual Trigger - Start workflow manually
- Transcript Input - Start with meeting transcript
- Schedule Trigger - Run on schedule (coming soon)
- Webhook Trigger - Start via API (coming soon)

**Actions:**
- Generate MOM - AI meeting minutes
- Send Email - Outlook email
- Create Calendar Event - Outlook calendar
- Post Teams Message - Teams channel
- Create PPT - PowerPoint (coming soon)
- AI Process - Custom AI task
- Save Data - Store data
- API Call - External API

### 3. Header Bar

- **Workflow name** input
- **Cancel** button - Discard changes
- **Save Workflow** button - Save to database

## Creating a Workflow

### Step 1: Add a Trigger

Every workflow needs a trigger. Drag one from the sidebar:

```
1. Find "Triggers" section in sidebar
2. Drag "Manual Trigger" to canvas
3. Position it at the top of your flow
```

### Step 2: Add Actions

Add the actions you want to automate:

```
1. Find "Actions" section in sidebar
2. Drag "Generate MOM" below the trigger
3. Drag "Send Email" next to it
4. Position nodes as desired
```

### Step 3: Connect Nodes

Create the execution flow by connecting nodes:

```
1. Click the output handle (bottom) of trigger
2. Drag to input handle (top) of MOM node
3. Connect MOM output to Email input
```

### Step 4: Configure Nodes (Optional)

Click on any node to open configuration:

```
1. Click on "Send Email" node
2. Sidebar opens with configuration form
3. Set default recipients, subject, etc.
4. Click "Save" to apply
```

### Step 5: Name and Save

```
1. Enter workflow name in header
2. Click "Save Workflow"
3. Redirects to dashboard
```

## Node Types

### Trigger Nodes

| Node | Description | Output |
|------|-------------|--------|
| Manual Trigger | User-initiated execution | Starts flow |
| Transcript Input | Paste meeting notes | Text content |

### Action Nodes

| Node | Description | Input | Output |
|------|-------------|-------|--------|
| Generate MOM | AI meeting minutes | Meeting notes | Formatted MOM |
| Send Email | Outlook email | Recipient, subject, body | Success/fail |
| Create Calendar | Outlook event | Title, time, attendees | Event created |
| Teams Post | Teams message | Team ID, channel ID, message | Message posted |

## Connection Rules

- **One output** can connect to **multiple inputs** (parallel execution)
- **Multiple outputs** can connect to **one input** (merge)
- **Triggers** can only have outputs (no inputs)
- **Actions** can have both inputs and outputs

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Delete` / `Backspace` | Delete selected node |
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + Shift + Z` | Redo |
| `Cmd/Ctrl + A` | Select all |
| `Escape` | Deselect |

## Tips & Best Practices

### 1. Plan Your Flow

Before building, outline:
- What triggers the workflow?
- What actions need to happen?
- What data flows between actions?

### 2. Use Meaningful Names

Name your workflows descriptively:
- ✅ "Client Meeting Follow-up - Acme Corp"
- ❌ "Workflow 1"

### 3. Test Incrementally

Build and test in stages:
1. Add trigger + one action
2. Execute and verify
3. Add more actions
4. Test again

### 4. Configure Defaults

Set default values in node config:
- Default email recipients
- Standard subject line templates
- Common calendar duration

## Troubleshooting

### Nodes Won't Connect

- Ensure you're dragging from output to input
- Check that source node has output handle
- Check that target node has input handle

### Can't Save Workflow

- Workflow name is required
- At least one node must exist
- Check for console errors

### Canvas Not Responding

- Try refreshing the page
- Clear browser cache
- Check browser console for errors

---

:::tip Pro Tip
Use the mini map (bottom right) to navigate large workflows quickly!
:::

