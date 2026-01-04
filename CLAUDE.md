# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SuitePrompt** is a dual-purpose Next.js 16 application serving as both a marketplace for NetSuite prompts/skills and an interactive learning platform for SuiteCloud development. The project uses Git as the single source of truth—all marketplace content is stored in static JSON files, and new submissions are handled via GitHub PR workflow.

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture Overview

### Core Technology Stack
- **Framework**: Next.js 16.1 with App Router and React 19.2
- **Styling**: Tailwind CSS 4 with PostCSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion 12.23
- **Type Safety**: TypeScript (strict mode)
- **Content**: MDX support for markdown pages
- **Editor**: Monaco Editor for interactive code playground
- **Theme**: next-themes for dark/light mode

### Data Architecture

**No Database**: All marketplace data lives in static JSON files under `/data/`:
- `marketplace.json` - All prompts and skills (685 lines)
- `learning-paths.json` - Learning module structure
- `taxonomy.json` - Business areas and categories
- `concepts.json` - Learning concept definitions
- `exercises.json` - Practice exercises

**Data Access Pattern**:
- Import JSON directly in components/pages
- Filter/sort functions in `lib/marketplace.ts`
- All filtering happens client-side for speed
- Related content uses tag/author/businessArea matching

### Type System

The marketplace revolves around strongly-typed interfaces in `types/marketplace.ts`:

```typescript
// Core marketplace item types
Prompt extends MarketplaceItem  // AI prompts with format, businessArea, mcpTools
Skill extends MarketplaceItem   // Skills with dependencies, metadata, skillContent

// Key enums
PromptFormat: "mcp" | "skill" | "general"
BusinessArea: "accounting" | "sales" | "inventory" | "crm" | "suitecloud" | "admin"
TargetPlatform: "text-enhance" | "prompt-studio" | "advisor" | "mcp" | "claude" | "chatgpt"
```

All prompts/skills share: id, title, description, content, author, rating, downloads, tags, timestamps.

### Navigation Structure

The app uses a collapsible sidebar (`components/app-sidebar.tsx`) with hierarchical organization:

**Business Area Categories**:
- **Finance**: Accounting, Forecasting
- **Operations**: Inventory, Manufacturing, Field Service
- **Sales**: Sales, CRM, Support
- **Platform**: SuiteCloud, Admin
- **Workforce & Global**: HR, Localization

Each category expands to show modules, which link to filtered marketplace views.

### Page Routes

```
/                              → Home redirect
/marketplace                   → Marketplace home (featured prompts/skills)
/marketplace/prompts           → All prompts grid with filters
/marketplace/prompts/[category]/[module] → Category-specific prompts
/marketplace/skills            → All skills grid
/marketplace/learning          → Learning center overview
/marketplace/learn/[path]/[module] → Module-specific learning content
/dashboard                     → Dashboard view
/playground                    → Interactive code editor
/rapid-101                     → Quick start guide
```

### Component Organization

**Marketplace Components** (`/components/marketplace/`):
- `PromptCard.tsx` / `SkillCard.tsx` - Card displays with rating/downloads
- `PromptDetailModal.tsx` / `SkillDetailModal.tsx` - Modal detail views
- `PromptContentTab.tsx` - Full prompt content viewer (largest component, 27KB)
- `PromptUsageTab.tsx` / `PromptRelatedTab.tsx` - Usage examples and related items
- `FilterBar.tsx` - Search, filter, and sort controls
- `MarketplaceLayout.tsx` - Shared layout wrapper

**Interactive Components** (`/components/interactive/`):
- `CodePlayground.tsx` - Monaco Editor integration
- `DeploymentSimulator.tsx` - Visual deployment workflow
- `SPAArchitecture.tsx` - Architecture visualization

**Animation Components** (`/components/animations/`):
- `AnimatedCardGrid.tsx` - Framer Motion card entrance animations
- `DeploymentFlow.tsx` - Animated flow diagrams

**UI Primitives** (`/components/ui/`):
- shadcn components: button, card, dialog, tabs, sidebar, etc.

### Important Patterns

**Client Components with Suspense**:
- Pages using `useSearchParams` require Suspense boundaries
- Pattern: Wrap the component that calls `useSearchParams` in `<Suspense>`
- See recent commits for examples of this fix

**Modal-Based Details**:
- Prompts and skills open in modals, not separate pages
- Keeps user context while browsing
- State managed via URL params or local state

**Path Aliases**:
- `@/*` maps to project root (configured in `tsconfig.json`)
- Always use `@/` for imports instead of relative paths
- Example: `import { Prompt } from "@/types/marketplace"`

**Theme Support**:
- All components must support dark/light mode
- Use Tailwind's dark: variants
- ThemeProvider wraps the entire app in root layout

## GitHub PR-Based Submission Workflow

New prompts/skills are submitted via a form that creates GitHub PRs (see `PROMPT_SUBMISSION_PLAN.md` for full details):

1. User fills form at `/marketplace/submit` (planned, not yet implemented)
2. API route `POST /api/prompts/submit` creates a branch and PR via GitHub API
3. PR contains JSON file in `/data/submissions/`
4. Manual review on GitHub, then merge
5. GitHub Action auto-updates `marketplace.json` and deploys

**Environment Variables Required**:
```bash
GITHUB_TOKEN=ghp_...           # Personal access token with repo scope
GITHUB_REPO_OWNER=brettwhite-git
GITHUB_REPO_NAME=netsuite-marketplace
```

## Code Style and Conventions

**TypeScript**:
- Strict mode enabled
- Use interfaces for data models, types for unions/utility types
- Avoid `any` - use proper types or `unknown`

**React**:
- Functional components with hooks
- "use client" directive when needed (interactivity, browser APIs, hooks like useSearchParams)
- Server components by default
- Prefer composition over prop drilling

**Styling**:
- Tailwind utility classes only (no custom CSS unless absolutely necessary)
- Use CVA (class-variance-authority) for component variants
- Mobile-first responsive design
- Dark mode via `dark:` prefix

**File Naming**:
- Components: PascalCase.tsx (e.g., `PromptCard.tsx`)
- Utilities: kebab-case.ts (e.g., `marketplace.ts`)
- Types: kebab-case.ts (e.g., `marketplace.ts`)
- Pages: lowercase with Next.js conventions (`page.tsx`, `layout.tsx`)

## Common Tasks

**Adding a New Prompt to Marketplace**:
1. Edit `/data/marketplace.json`
2. Add to `prompts` array following the `Prompt` interface
3. Ensure unique ID (convention: `"prompt-{descriptive-name}"`)
4. Include all required fields: title, description, content, format, businessArea
5. Run `npm run dev` to verify it appears correctly

**Adding a New UI Component**:
1. If using shadcn: Use existing components in `/components/ui/`
2. For custom components: Create in appropriate directory (`/components/marketplace/`, etc.)
3. Export from the component file
4. Import using `@/components/...` path alias

**Updating Sidebar Navigation**:
1. Edit `/components/app-sidebar.tsx`
2. Update the items array in the NavMain component
3. Use existing icon set from lucide-react

**Creating a New Page Route**:
1. Create file: `/app/[route]/page.tsx`
2. Follow Next.js 14+ App Router conventions
3. Add layout if needed: `/app/[route]/layout.tsx`
4. Use TypeScript for all page props

## Debugging Tips

**Common Issues**:

1. **Hydration Mismatch**: Often due to `useSearchParams` without Suspense
   - Solution: Wrap component in `<Suspense fallback={...}>`

2. **Import Errors**: Check path aliases are using `@/`
   - Wrong: `import { Prompt } from "../../types/marketplace"`
   - Right: `import { Prompt } from "@/types/marketplace"`

3. **Theme Flashing**: Ensure ThemeProvider is in root layout
   - Already configured, but verify if adding new layouts

4. **Type Errors in marketplace.json**:
   - Validate against `Prompt` or `Skill` interface
   - Use proper enum values for format, businessArea, targetPlatform

## File Structure Reference

```
/app/                      # Next.js App Router pages
  /marketplace/            # Main marketplace section
    /prompts/              # Prompt browsing pages
    /skills/               # Skills browsing pages
    /learn/                # Learning paths
    page.tsx               # Marketplace home
    layout.tsx             # Marketplace layout with sidebar
  /dashboard/              # Dashboard page
  /playground/             # Code playground
  layout.tsx               # Root layout (ThemeProvider)
  page.tsx                 # Home page

/components/
  /marketplace/            # Marketplace-specific components
  /learning/               # Learning platform components
  /interactive/            # Interactive visualizations
  /animations/             # Framer Motion animations
  /ui/                     # shadcn/ui primitives
  /theme/                  # Theme provider and toggle
  app-sidebar.tsx          # Main navigation sidebar

/data/                     # Static JSON data (source of truth)
  marketplace.json         # All prompts and skills
  learning-paths.json
  taxonomy.json
  concepts.json
  exercises.json
  /submissions/            # User-submitted prompts (via PR workflow)

/lib/                      # Utilities and helpers
  marketplace.ts           # Data filtering, sorting, search functions
  utils.ts                 # General utilities (cn, clsx)
  mdx-loader.ts            # MDX content loading

/types/
  marketplace.ts           # Core type definitions (Prompt, Skill, etc.)
  index.ts                 # Type exports

/hooks/                    # Custom React hooks
  use-mobile.ts            # Mobile detection hook
  use-navigation-state.ts  # Navigation state management

/public/                   # Static assets
/content/                  # MDX content files
```

## Related Documentation

- Full submission workflow: See `PROMPT_SUBMISSION_PLAN.md`
- Project overview: See `README.md`
- Latest changes: Check recent commits for context
