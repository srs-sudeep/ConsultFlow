---
sidebar_position: 3
---

# Contributing

Guidelines for contributing to ConsultFlow.

## Getting Started

### 1. Fork the Repository

```bash
# Fork on GitHub, then clone
git clone https://github.com/YOUR-USERNAME/consultflow.git
cd consultflow
```

### 2. Set Up Development Environment

Follow the [Installation Guide](/docs/getting-started/installation) to set up:
- Backend with MongoDB
- Frontend with Next.js
- Azure AD configuration

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

## Development Workflow

### Running in Development

**Backend:**
```bash
cd backend
npm run dev  # Runs with tsx watch
```

**Frontend:**
```bash
cd frontend
npm run dev  # Runs Next.js dev server
```

**Documentation:**
```bash
cd docs
npm start    # Runs Docusaurus
```

### Code Style

**TypeScript:**
- Use strict mode
- Define types/interfaces for all data
- Avoid `any` where possible

**React:**
- Functional components with hooks
- Keep components focused (single responsibility)
- Extract reusable logic to custom hooks

**CSS:**
- Use Tailwind utilities primarily
- Custom CSS for animations only
- Follow dark theme color scheme

### Commit Messages

Follow conventional commits:

```
feat: add new workflow action type
fix: resolve token refresh issue
docs: update API reference
style: improve button animations
refactor: simplify workflow executor
test: add unit tests for MOM generator
```

## Pull Request Process

### 1. Before Submitting

- [ ] Code compiles without errors
- [ ] All existing functionality works
- [ ] New code follows existing patterns
- [ ] Documentation updated if needed

### 2. PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Screenshots
If applicable, add screenshots
```

### 3. Review Process

1. Create PR against `main` branch
2. Request review from maintainers
3. Address feedback
4. Squash and merge when approved

## Code Guidelines

### Adding New Actions

1. **Define action type** in `Workflow.ts`:
```typescript
export type WorkflowAction =
  | 'generate_mom'
  | 'send_email'
  | 'your_new_action'  // Add here
```

2. **Add to executor** in `workflowExecutor.ts`:
```typescript
case 'your_new_action':
  await this.executeYourAction(context)
  actionsExecuted.push('your_new_action')
  break
```

3. **Add to frontend** in `ActionSidebar.tsx`:
```typescript
const availableActions = [
  // ...existing actions
  {
    type: 'your_new_action',
    label: 'Your Action',
    icon: 'icon-name',
    description: 'What it does'
  }
]
```

4. **Add configuration UI** in execution page

5. **Update documentation**

### Adding API Endpoints

1. **Create controller** in `controllers/`:
```typescript
export const yourEndpoint = async (req: Request, res: Response) => {
  try {
    // Implementation
  } catch (error) {
    res.status(500).json({ error: 'Failed' })
  }
}
```

2. **Create route** in `routes/`:
```typescript
router.get('/your-endpoint', yourEndpoint)
```

3. **Register in** `index.ts`:
```typescript
app.use('/your-path', yourRoutes)
```

4. **Add to frontend** `api.ts`:
```typescript
export const yourApi = {
  getData: () => api.get('/your-path')
}
```

### Adding Components

```typescript
// components/YourComponent.tsx
'use client'

import { useState } from 'react'

interface YourComponentProps {
  prop1: string
  onAction: () => void
}

export default function YourComponent({ prop1, onAction }: YourComponentProps) {
  const [state, setState] = useState('')
  
  return (
    <div className="your-component">
      {/* Implementation */}
    </div>
  )
}
```

## Testing

### Manual Testing Checklist

Before submitting, test:

- [ ] Login/logout flow
- [ ] Create workflow
- [ ] Execute workflow with all actions
- [ ] Check logs display
- [ ] Error handling (invalid input)
- [ ] Responsive design (mobile)

### Future: Automated Testing

Planned testing setup:
- Jest for unit tests
- React Testing Library for components
- Supertest for API endpoints

## Documentation

### Updating Docs

1. Edit files in `docs/docs/`
2. Preview locally: `npm start`
3. Ensure links work
4. Check formatting

### Adding New Pages

1. Create `.md` file in appropriate folder
2. Add frontmatter:
```yaml
---
sidebar_position: 1
---
```
3. Update `sidebars.ts` if needed

## Getting Help

- **Issues:** Report bugs or request features
- **Discussions:** Ask questions or share ideas
- **Pull Requests:** Submit contributions

## Recognition

Contributors will be:
- Listed in project README
- Credited in release notes
- Part of the ConsultFlow community!

---

:::tip First Contribution?
Look for issues labeled `good first issue` - they're great starting points!
:::

