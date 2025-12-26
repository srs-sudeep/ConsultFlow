---
sidebar_position: 1
slug: /
---

# Introduction to ConsultFlow

**ConsultFlow** is an AI-powered workflow automation platform designed specifically for consulting teams. It transforms meeting transcripts into structured minutes, automates email delivery, creates calendar events, and posts to Microsoft Teams - all through an intuitive drag-and-drop interface.

## What is ConsultFlow?

ConsultFlow is a modern web application that helps consulting professionals automate repetitive tasks that typically follow meetings:

- 📝 **Generate Meeting Minutes (MOM)** - AI-powered extraction of key discussion points, action items, and decisions
- 📧 **Send Emails via Outlook** - Automatically distribute meeting minutes to attendees
- 📅 **Create Calendar Events** - Schedule follow-up meetings with extracted dates
- 💬 **Post to Microsoft Teams** - Share updates with your team channels

## Key Features

### 🎨 Visual Workflow Builder
Build automation workflows using an intuitive n8n-style drag-and-drop canvas. Connect nodes, configure actions, and create complex automation flows without writing code.

### 🤖 AI-Powered MOM Generation
Powered by OpenAI's GPT models, ConsultFlow extracts:
- Concise meeting summaries
- Discussion items by speaker
- Action items with assignees and due dates
- Key decisions and next steps

### 🔗 Microsoft 365 Integration
Deep integration with Microsoft Graph API enables:
- Azure AD single sign-on
- Outlook email sending
- Calendar event creation
- Teams channel posting

### 📊 Execution Logs
Track all workflow executions with detailed logs showing:
- Actions executed
- Success/failure status
- Error messages for debugging

## Who is it for?

ConsultFlow is designed for:

- **Consulting Firms** - Automate post-meeting documentation
- **Project Managers** - Track action items and follow-ups
- **Team Leads** - Keep stakeholders informed automatically
- **Anyone** - Who attends frequent meetings and needs structured documentation

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS, React Flow |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB with Mongoose |
| Auth | Azure AD OAuth 2.0, MSAL |
| AI | OpenAI GPT-3.5/GPT-4 |
| APIs | Microsoft Graph API |

## Getting Started

Ready to automate your consulting workflow?

1. **[Installation Guide](/docs/getting-started/installation)** - Set up the development environment
2. **[Azure Setup](/docs/getting-started/azure-setup)** - Configure Microsoft authentication
3. **[Quick Start](/docs/getting-started/quick-start)** - Create your first workflow

## Built By

ConsultFlow was created by **[@srs-sudeep](https://github.com/srs-sudeep)** as a comprehensive automation solution for consulting teams.

---

:::tip Ready to Start?
Check out the [Installation Guide](/docs/getting-started/installation) to set up ConsultFlow locally.
:::

