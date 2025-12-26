---
slug: building-consultflow
title: Building ConsultFlow - The Journey
authors: [srs-sudeep]
tags: [consultflow, development, ai, automation]
---

# Building ConsultFlow: From Idea to Implementation

ConsultFlow started as a solution to a common problem: the tedious, repetitive work that follows every meeting in consulting environments.

<!-- truncate -->

## The Problem

As consultants, we spend countless hours on post-meeting tasks:
- Writing meeting minutes
- Sending follow-up emails
- Scheduling next meetings
- Updating team channels

These tasks are essential but repetitive. What if we could automate them?

## The Vision

I envisioned a platform that could:
1. **Transform meeting transcripts** into structured documents using AI
2. **Automate Microsoft 365 actions** like email, calendar, and Teams
3. **Provide a visual workflow builder** for non-technical users
4. **Execute workflows with one click**

## Technical Journey

### Choosing the Stack

**Frontend:** I chose Next.js 14 with the App Router for its modern patterns and excellent developer experience. Tailwind CSS handles styling with a custom dark theme inspired by modern tools like n8n and Linear.

**Backend:** Express.js with TypeScript provides a flexible, type-safe API layer. MongoDB stores workflows and execution logs as documents—a natural fit for the flexible schema needs.

**AI:** OpenAI's GPT models power the MOM generation. The structured prompting ensures consistent, professional output.

**Authentication:** Azure AD OAuth 2.0 enables seamless Microsoft integration. Users sign in once and access all Microsoft 365 services.

### The Workflow Builder

The visual workflow builder uses React Flow, a powerful library for node-based editors. Users can:
- Drag actions from a sidebar
- Connect nodes to create flows
- Configure each node with specific settings
- Save and execute with one click

### AI-Powered MOM Generation

The MOM generator uses a carefully crafted prompt that instructs GPT to:
- Extract key discussion points by speaker
- Identify action items with assignees and dates
- Summarize in a concise abstract
- Format everything in professional Markdown

### Microsoft Graph Integration

The trickiest part was integrating with Microsoft Graph API:
- Token management (access + refresh tokens)
- Permission scopes (Mail.Send, Calendars.ReadWrite, etc.)
- Error handling for various failure modes

## Lessons Learned

1. **Start with the user flow** - I designed the UI first, then built the backend to support it.

2. **AI needs structure** - Detailed prompts with specific formatting instructions produce consistent output.

3. **OAuth is complex** - Token refresh, scope management, and error handling require careful attention.

4. **Dark themes matter** - Users spend hours in these tools; a well-designed dark theme reduces eye strain.

## What's Next

ConsultFlow is just the beginning. Planned features include:
- Scheduled workflow triggers
- PowerPoint generation
- More AI-powered actions
- Team collaboration features

## Try It Yourself

ConsultFlow is open source! Check out the [documentation](/docs) to get started.

Built with ❤️ by [@srs-sudeep](https://github.com/srs-sudeep)

