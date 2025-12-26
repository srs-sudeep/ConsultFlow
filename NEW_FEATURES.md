# New Features - Drag & Drop Workflow Builder

## 🎨 Major UI Updates

### 1. Drag & Drop Workflow Builder
- **Visual workflow creation** with drag-and-drop interface
- **Icons for each action** (📝 MOM, 📧 Email, 📅 Calendar, 💬 Teams)
- **Reorder actions** by dragging them up/down
- **Numbered steps** showing execution order
- **Sidebar with available actions** - click to add to workflow

### 2. Sidebar Configuration Forms
- **Click any action** to open configuration sidebar
- **Pre-filled data** from MOM when available
- **Editable fields** for each action type:
  - **Email**: To, Subject, Body (pre-filled from MOM)
  - **Calendar**: Title, Start/End, Attendees (pre-filled from MOM)
  - **Teams**: Team ID, Channel ID, Message
- **Save configuration** per action

### 3. Structured MOM Format
The MOM generator now creates minutes in this exact format:

```
# Meeting Minutes

## Date and Time
[Extracted from notes]

## Location
[Extracted or "Virtual"]

## Meeting Title
[Extracted or generated]

## Attendees
(Random order, titles omitted)
- [List of attendees]

## Materials Used
- [Materials mentioned]

## Agenda
• [Agenda items]

## Decisions
[Table or list with decision details]

## ToDos
[Table or list with action items, owners, due dates]

## Detailed Minutes
### Project Progress Report
[Details]

### Confirmation of Issues/To Do Status
[Details]

### Other Contact Items
[Details]

## Next Meeting
- Date and Time: [Extracted]
- Location: [Extracted]
- Attendees: [List]
```

### 4. Smart Data Extraction
The system automatically extracts from MOM:
- **Attendees** → Pre-fills email recipients
- **Meeting Title** → Pre-fills email subject
- **Date & Time** → Pre-fills calendar start time
- **Next Meeting** → Pre-fills calendar event details
- **Action Items** → Can be used for deliverables tracking

### 5. Enhanced Workflow Execution
- **Pre-filled forms** based on MOM data
- **Editable before execution** - all fields can be modified
- **Real-time MOM preview** alongside execution form
- **Action cards** showing configured values
- **Edit button** on each action to modify configuration

## 📁 New File Structure

```
frontend/
├── components/
│   ├── WorkflowBuilder.tsx      # Drag & drop builder
│   ├── ActionConfigSidebar.tsx   # Configuration sidebar
│   └── MOMDisplay.tsx            # Structured MOM display
├── app/
│   ├── workflow/
│   │   ├── create/
│   │   │   └── page.tsx          # New drag & drop builder
│   │   ├── execute/
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Enhanced execution page
│   │   └── [id]/
│   │       └── page.tsx          # Workflow detail view
│   └── mom/
│       └── page.tsx              # Updated MOM generator
```

## 🚀 How to Use

### Creating a Workflow
1. Go to Dashboard → Create Workflow
2. Enter workflow name
3. **Drag actions** from sidebar or click to add
4. **Reorder** by dragging actions
5. **Click settings icon** on any action to configure
6. **Fill in sidebar form** with pre-filled or custom values
7. Save workflow

### Executing a Workflow
1. Go to Dashboard → Click "Execute" on a workflow
2. **Enter meeting notes** (if MOM action is included)
3. **Click "Generate MOM"** to create structured minutes
4. **Review pre-filled data** in action cards
5. **Click "Edit"** on any action to modify configuration
6. **Make final edits** in sidebar forms
7. **Click "Execute Workflow"**

### MOM Generation
1. Go to MOM Generator page
2. Paste meeting notes/transcript
3. Click "Generate MOM"
4. View structured output with extracted data
5. Use "Use in Workflow" to create workflow with pre-filled data

## 🔧 Technical Details

### New Dependencies
- `@dnd-kit/core` - Drag and drop functionality
- `@dnd-kit/sortable` - Sortable lists
- `@dnd-kit/utilities` - DnD utilities
- `lucide-react` - Icons
- `react-markdown` - Markdown rendering

### Backend Updates
- **MOM parser** extracts structured data from generated MOM
- **Action configs** stored in workflow model
- **Enhanced execution context** with more fields
- **Pre-filled data** passed from frontend to backend

### Data Flow
1. User generates MOM → Backend returns structured data
2. Structured data → Pre-fills workflow execution forms
3. User edits → Configuration saved per action
4. Execution → All data sent to backend
5. Backend → Uses pre-filled or custom values

## ✨ Key Features

✅ **Drag & Drop** - Visual workflow building
✅ **Icons & Descriptions** - Clear action identification
✅ **Sidebar Forms** - Easy configuration
✅ **Structured MOM** - Exact format as specified
✅ **Smart Pre-filling** - Automatic data extraction
✅ **Editable Before Execution** - Full control
✅ **Real-time Preview** - See MOM while configuring
✅ **Action Cards** - Visual configuration display

## 📝 Next Steps

1. **Install dependencies**: `cd frontend && npm install`
2. **Test the new UI**: Create a workflow with drag & drop
3. **Generate MOM**: Use the new structured format
4. **Execute workflow**: See pre-filled data in action

The system is now much more user-friendly with visual workflow building and smart data extraction!

