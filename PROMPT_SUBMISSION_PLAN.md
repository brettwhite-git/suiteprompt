# Prompt Submission Feature - Implementation Plan

## Overview

This document outlines the complete implementation plan for a user-submitted prompt feature on SuitePrompt. The feature allows users to submit prompts via a form, which creates a Pull Request to the GitHub repository for review and approval.

**Approach:** GitHub PR-Based Workflow
- Submissions create automated PRs
- Manual review and approval on GitHub
- Approved PRs auto-merge and update `marketplace.json`
- No database required initially (Git as source of truth)

---

## Architecture Diagram

```
User Form Submission
        ↓
    API Route (POST /api/prompts/submit)
        ↓
    Validation & Formatting
        ↓
    GitHub API (Octokit)
        ↓
    Create Branch: submissions/prompt-[id]
        ↓
    Create File: /data/submissions/prompt-[id].json
        ↓
    Create Pull Request
        ↓
    Manual Review on GitHub
        ↓
    [Approve & Merge] ——→ GitHub Action Triggered
        ↓
    Auto-update marketplace.json
        ↓
    Deploy to Vercel (auto)
        ↓
    Prompt appears on site
```

---

## Phase 1: UI Design & Components

### 1.1 New Pages to Create

#### `/app/marketplace/submit/page.tsx`
- **Purpose:** Public-facing prompt submission form
- **Layout:** Uses existing `MarketplaceLayout` wrapper
- **Authentication:** None required (open to public initially)
- **Success State:** Shows thank-you message with PR link

#### `/app/marketplace/submit/success/page.tsx`
- **Purpose:** Post-submission confirmation page
- **Content:**
  - Thank you message
  - Link to created GitHub PR
  - What happens next (review timeline)
  - Option to submit another prompt

### 1.2 New Components to Build

#### `/components/marketplace/PromptSubmissionForm.tsx`
**Main form component with the following sections:**

**Section 1: Basic Information**
```typescript
Fields:
- title: string (required, max 100 chars)
  - Input with character counter
  - Placeholder: "Customer Balance Lookup"

- description: string (required, max 200 chars)
  - Textarea (2-3 rows)
  - Character counter
  - Placeholder: "Find a customer and show their current balance"

- longDescription: string (optional, max 1000 chars)
  - Rich textarea (8-10 rows)
  - Markdown support indicator
  - Placeholder: "Provide detailed explanation of when and how to use this prompt..."
```

**Section 2: Prompt Content**
```typescript
Fields:
- content: string (required, min 50 chars)
  - Large textarea (12-15 rows)
  - Monospace font
  - Live variable detection (highlights [VARIABLE] or ${variable})
  - Placeholder: "Find customer \"[CUSTOMER_NAME]\" and show me their current balance..."

- inputVariables: string[] (auto-detected, editable)
  - Auto-populated from content
  - Pill-based UI to add/remove
  - Each variable shows example: [CUSTOMER_NAME] → "Acme Corp"
```

**Section 3: Classification**
```typescript
Fields:
- format: "mcp" | "skill" | "general" (required)
  - Radio group with icons
  - Help text for each option

- businessArea: string (required)
  - Select dropdown
  - Options: Accounting, Sales, Inventory, CRM, SuiteCloud, Admin

- targetPlatform: string[] (optional)
  - Multi-select checkboxes
  - Options: Text Enhance, Prompt Studio, Advisor, MCP, Claude, ChatGPT
```

**Section 4: Additional Details**
```typescript
Fields:
- tags: string[] (optional, max 10 tags)
  - Tag input with pill UI
  - Auto-suggestions from existing tags
  - Enter or comma to add tag

- usageExamples: string[] (optional, max 3)
  - Repeating textarea fields
  - Add/remove buttons
  - Placeholder: "Example: Use this when you need to quickly check if a customer has outstanding invoices"

- mcpTools: string[] (conditional - only if format === "mcp")
  - Text input with pill UI
  - Placeholder: "getCustomerDetails, getCustomerBalance"
```

**Section 5: Model Settings (Advanced - Collapsible)**
```typescript
Fields (all optional):
- temperature: number (0-1, step 0.1)
  - Slider with numeric input
  - Default: 0.7

- maxTokens: number (1-4096)
  - Numeric input
  - Default: 2048

- topP: number (0-1, step 0.1)
- topK: number (1-100)
- presencePenalty: number (-2 to 2, step 0.1)
- frequencyPenalty: number (-2 to 2, step 0.1)
```

**Section 6: Submitter Information**
```typescript
Fields:
- submitterName: string (required)
  - Text input
  - Becomes prompt author name

- submitterEmail: string (required)
  - Email input with validation
  - Used for follow-up communication only (not displayed publicly)

- agreeToTerms: boolean (required)
  - Checkbox
  - Text: "I agree to contribute this prompt under the MIT License and confirm this is my original work or I have rights to submit it"
```

**Section 7: Preview & Submit**
```typescript
Components:
- Live Preview Panel
  - Shows how prompt card will look
  - Rendered using existing PromptCard component
  - Updates in real-time as form is filled

- Validation Summary
  - Shows required fields still needed
  - Error messages for invalid fields

- Submit Button
  - Disabled until all required fields valid
  - Loading state during submission
  - Success/error feedback
```

#### Component File Structure:
```
/components/marketplace/
├── PromptSubmissionForm.tsx (main form)
├── PromptPreviewPanel.tsx (live preview)
├── VariableDetector.tsx (extracts and highlights variables)
├── TagInput.tsx (reusable tag input component)
└── FormSection.tsx (collapsible section wrapper)
```

### 1.3 Form Validation Rules

**Client-Side Validation:**
```typescript
interface ValidationRules {
  title: {
    required: true,
    minLength: 10,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-:]+$/ // alphanumeric, spaces, hyphens, colons
  },
  description: {
    required: true,
    minLength: 20,
    maxLength: 200
  },
  content: {
    required: true,
    minLength: 50,
    maxLength: 5000
  },
  format: {
    required: true,
    enum: ["mcp", "skill", "general"]
  },
  businessArea: {
    required: true,
    enum: ["accounting", "sales", "inventory", "crm", "suitecloud", "admin"]
  },
  submitterName: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  submitterEmail: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  agreeToTerms: {
    required: true,
    mustBeTrue: true
  },
  tags: {
    maxItems: 10,
    itemMaxLength: 20
  },
  usageExamples: {
    maxItems: 3,
    itemMaxLength: 500
  }
}
```

**Validation Library Options:**
- **Option A:** Zod (type-safe schema validation)
- **Option B:** Yup (popular validation library)
- **Option C:** React Hook Form + Zod (recommended for complex forms)

**Recommended Stack:**
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const promptSubmissionSchema = z.object({
  title: z.string().min(10).max(100),
  description: z.string().min(20).max(200),
  content: z.string().min(50).max(5000),
  // ... rest of schema
})

type PromptSubmissionForm = z.infer<typeof promptSubmissionSchema>
```

### 1.4 UI/UX Flow

**Step-by-Step User Journey:**

1. **Entry Point:**
   - Add "Submit Prompt" button to marketplace navbar
   - Add prominent CTA card on `/marketplace` page
   - Route: `/marketplace/submit`

2. **Form Page:**
   - Progress indicator (optional: "Basic Info → Content → Details → Review")
   - Sticky sidebar with live preview (desktop)
   - Mobile: Preview accessible via toggle button
   - Auto-save to localStorage every 30 seconds (recover if user leaves)

3. **Submission:**
   - Click "Submit Prompt"
   - Show loading spinner on button ("Creating submission...")
   - Disable form during submission

4. **Success State:**
   - Redirect to `/marketplace/submit/success?pr=[PR_NUMBER]`
   - Show animated success checkmark
   - Display PR link and review timeline
   - "Submit Another Prompt" button

5. **Error Handling:**
   - Network errors: Retry button with saved form data
   - Validation errors: Inline error messages with focus on first error
   - GitHub API errors: User-friendly error message with support contact

### 1.5 Design Specifications

**Visual Design:**
- Match existing marketplace aesthetic (dark/light theme support)
- Use existing components from `/components/ui/`
- Form width: max-w-4xl (centered)
- Preview panel: sticky on scroll (desktop)
- Spacing: Tailwind spacing scale (p-6, gap-4, etc.)

**Accessibility:**
- All form fields have proper `<label>` elements
- Required fields indicated with `aria-required="true"`
- Error messages use `aria-describedby`
- Keyboard navigation (tab order makes sense)
- Focus indicators on all interactive elements
- Color contrast meets WCAG AA standards

**Responsive Design:**
- Desktop (>1024px): Two-column layout (form + preview)
- Tablet (768-1024px): Single column, preview in modal
- Mobile (<768px): Single column, simplified preview

---

## Phase 2: Backend Implementation

### 2.1 API Route Structure

#### `/app/api/prompts/submit/route.ts`

**Endpoint:** `POST /api/prompts/submit`

**Request Body:**
```typescript
interface SubmitPromptRequest {
  // Form data
  title: string
  description: string
  longDescription?: string
  content: string
  format: "mcp" | "skill" | "general"
  businessArea: string
  targetPlatform?: string[]
  tags?: string[]
  usageExamples?: string[]
  inputVariables?: string[]
  mcpTools?: string[]
  modelSettings?: {
    temperature?: number
    topP?: number
    topK?: number
    maxTokens?: number
    presencePenalty?: number
    frequencyPenalty?: number
  }

  // Submitter info
  submitterName: string
  submitterEmail: string
  agreeToTerms: boolean
}
```

**Response:**
```typescript
interface SubmitPromptResponse {
  success: boolean
  prUrl?: string
  prNumber?: number
  error?: string
}
```

**Implementation Flow:**
```typescript
export async function POST(request: Request) {
  try {
    // 1. Parse request body
    const body: SubmitPromptRequest = await request.json()

    // 2. Server-side validation (using Zod schema)
    const validated = promptSubmissionSchema.parse(body)

    // 3. Generate unique prompt ID
    const promptId = generatePromptId() // e.g., "submitted-1704123456789"

    // 4. Format as Prompt object
    const promptObject: Prompt = formatSubmissionAsPrompt(validated, promptId)

    // 5. Create GitHub PR via Octokit
    const pr = await createGitHubPR(promptObject, validated.submitterEmail)

    // 6. Return success with PR URL
    return Response.json({
      success: true,
      prUrl: pr.html_url,
      prNumber: pr.number
    })

  } catch (error) {
    // Error handling
    console.error("Submission error:", error)
    return Response.json(
      { success: false, error: "Failed to create submission" },
      { status: 500 }
    )
  }
}
```

### 2.2 Helper Functions

#### `/lib/github.ts` (New File)

**GitHub API Integration:**

```typescript
import { Octokit } from "@octokit/rest"

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
})

const REPO_OWNER = "brettwhite-git"
const REPO_NAME = "suiteprompt"
const BASE_BRANCH = "main"

export async function createGitHubPR(
  prompt: Prompt,
  submitterEmail: string
): Promise<{ html_url: string; number: number }> {

  // 1. Get the latest commit SHA from main branch
  const { data: ref } = await octokit.git.getRef({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    ref: `heads/${BASE_BRANCH}`
  })
  const mainSha = ref.object.sha

  // 2. Create new branch
  const branchName = `submissions/prompt-${prompt.id}`
  await octokit.git.createRef({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    ref: `refs/heads/${branchName}`,
    sha: mainSha
  })

  // 3. Create JSON file in new branch
  const filePath = `data/submissions/${prompt.id}.json`
  const fileContent = JSON.stringify(prompt, null, 2)

  await octokit.repos.createOrUpdateFileContents({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    path: filePath,
    message: `Add prompt submission: ${prompt.title}`,
    content: Buffer.from(fileContent).toString("base64"),
    branch: branchName
  })

  // 4. Create Pull Request
  const prBody = generatePRDescription(prompt, submitterEmail)

  const { data: pr } = await octokit.pulls.create({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    title: `📝 New Prompt: ${prompt.title}`,
    head: branchName,
    base: BASE_BRANCH,
    body: prBody
  })

  // 5. Add labels
  await octokit.issues.addLabels({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    issue_number: pr.number,
    labels: ["prompt-submission", "needs-review"]
  })

  return {
    html_url: pr.html_url,
    number: pr.number
  }
}

function generatePRDescription(prompt: Prompt, submitterEmail: string): string {
  return `
## New Prompt Submission

**Title:** ${prompt.title}

**Description:** ${prompt.description}

**Format:** ${prompt.format}

**Business Area:** ${prompt.businessArea}

**Submitted by:** ${prompt.author.name} (${submitterEmail})

---

### Prompt Content Preview

\`\`\`
${prompt.content.substring(0, 500)}${prompt.content.length > 500 ? "..." : ""}
\`\`\`

---

### Review Checklist

- [ ] Content is appropriate and follows guidelines
- [ ] No sensitive information included
- [ ] Variables are properly formatted
- [ ] Business area and tags are accurate
- [ ] Author attribution is correct

---

**Submitted at:** ${new Date().toISOString()}

**File:** \`data/submissions/${prompt.id}.json\`
  `.trim()
}
```

#### `/lib/prompt-helpers.ts` (New File)

**Utility Functions:**

```typescript
import type { Prompt } from "@/types/marketplace"
import type { SubmitPromptRequest } from "@/app/api/prompts/submit/route"

export function generatePromptId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 7)
  return `submitted-${timestamp}-${random}`
}

export function extractVariables(content: string): string[] {
  // Match [VARIABLE] and ${VARIABLE} patterns
  const bracketVars = content.match(/\[([A-Z_]+)\]/g) || []
  const dollarVars = content.match(/\$\{([A-Za-z_]+)\}/g) || []

  const allVars = [
    ...bracketVars.map(v => v.slice(1, -1)),
    ...dollarVars.map(v => v.slice(2, -1))
  ]

  return [...new Set(allVars)] // Remove duplicates
}

export function formatSubmissionAsPrompt(
  submission: SubmitPromptRequest,
  promptId: string
): Prompt {
  const now = new Date().toISOString()

  return {
    id: promptId,
    title: submission.title,
    description: submission.description,
    longDescription: submission.longDescription,
    content: submission.content,
    format: submission.format,
    businessArea: submission.businessArea as any,
    targetPlatform: submission.targetPlatform as any,
    mcpTools: submission.mcpTools,
    usageExamples: submission.usageExamples,
    inputVariables: submission.inputVariables || extractVariables(submission.content),
    compatibility: [],
    modelSettings: submission.modelSettings,
    author: {
      id: `submitted-${Date.now()}`,
      name: submission.submitterName,
      avatar: "" // Could integrate Gravatar API using email
    },
    rating: {
      average: 0,
      count: 0
    },
    downloads: 0,
    tags: submission.tags || [],
    createdAt: now,
    updatedAt: now
  }
}

export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .trim()
}
```

### 2.3 Environment Variables

**Required in `.env.local`:**

```bash
# GitHub Integration
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_REPO_OWNER=brettwhite-git
GITHUB_REPO_NAME=suiteprompt

# Optional: Rate Limiting
RATE_LIMIT_MAX_REQUESTS=10
RATE_LIMIT_WINDOW_MS=3600000  # 1 hour

# Optional: Email Notifications (future)
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxx
```

**GitHub Token Scopes Required:**
- `repo` (full repository access)
- `workflow` (update GitHub Actions workflows if needed)

**How to Create GitHub Token:**
1. Go to GitHub Settings → Developer Settings → Personal Access Tokens
2. Generate new token (classic)
3. Select scopes: `repo`, `workflow`
4. Copy token and add to `.env.local`

### 2.4 Rate Limiting (Optional but Recommended)

**Prevent spam submissions:**

```typescript
// lib/rate-limit.ts
import { LRUCache } from "lru-cache"

const ratelimit = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 60 // 1 hour
})

export function checkRateLimit(identifier: string): boolean {
  const count = (ratelimit.get(identifier) as number) || 0

  if (count >= 10) {
    return false // Rate limited
  }

  ratelimit.set(identifier, count + 1)
  return true
}

// Usage in API route:
const identifier = request.headers.get("x-forwarded-for") || "unknown"
if (!checkRateLimit(identifier)) {
  return Response.json(
    { error: "Too many submissions. Please try again later." },
    { status: 429 }
  )
}
```

### 2.5 Error Handling & Logging

**Error Types:**
```typescript
class SubmissionError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message)
    this.name = "SubmissionError"
  }
}

// Usage:
throw new SubmissionError(
  "GitHub API rate limit exceeded",
  "GITHUB_RATE_LIMIT",
  429
)
```

**Logging (use existing Next.js console or add structured logging):**
```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${message}`, meta)
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error)
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${message}`, meta)
  }
}

// Usage:
logger.info("Prompt submission received", { promptId, submitterEmail })
logger.error("GitHub PR creation failed", { error, promptId })
```

---

## Phase 3: GitHub Actions & Automation

### 3.1 GitHub Labels Setup

**Create these labels in your repo:**

```bash
# Via GitHub UI or gh CLI:
gh label create "prompt-submission" --color "0E8A16" --description "User-submitted prompt"
gh label create "needs-review" --color "FBCA04" --description "Awaiting review"
gh label create "approved" --color "0E8A16" --description "Approved for merge"
gh label create "rejected" --color "D93F0B" --description "Submission rejected"
```

### 3.2 GitHub Action: Auto-Merge Approved Submissions

**File:** `.github/workflows/merge-approved-submission.yml`

```yaml
name: Merge Approved Prompt Submission

on:
  pull_request:
    types: [closed]
    branches:
      - main

jobs:
  process-submission:
    # Only run if PR was merged (not just closed)
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest

    steps:
      - name: Check if this is a submission PR
        id: check_submission
        run: |
          LABELS="${{ join(github.event.pull_request.labels.*.name, ',') }}"
          if [[ "$LABELS" == *"prompt-submission"* ]]; then
            echo "is_submission=true" >> $GITHUB_OUTPUT
          else
            echo "is_submission=false" >> $GITHUB_OUTPUT
          fi

      - name: Checkout repository
        if: steps.check_submission.outputs.is_submission == 'true'
        uses: actions/checkout@v4
        with:
          ref: main
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup Node.js
        if: steps.check_submission.outputs.is_submission == 'true'
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Find and merge submission file
        if: steps.check_submission.outputs.is_submission == 'true'
        id: merge_submission
        run: |
          # Find the submitted JSON file
          SUBMISSION_FILE=$(find data/submissions -name "submitted-*.json" -type f | head -n 1)

          if [ -z "$SUBMISSION_FILE" ]; then
            echo "No submission file found"
            exit 0
          fi

          echo "Found submission: $SUBMISSION_FILE"
          echo "submission_file=$SUBMISSION_FILE" >> $GITHUB_OUTPUT

          # Run the merge script (we'll create this)
          node scripts/merge-submission.js "$SUBMISSION_FILE"

      - name: Commit updated marketplace.json
        if: steps.check_submission.outputs.is_submission == 'true'
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"

          git add data/marketplace.json
          git commit -m "Add approved prompt from PR #${{ github.event.pull_request.number }}"
          git push

      - name: Delete submission file
        if: steps.check_submission.outputs.is_submission == 'true'
        run: |
          SUBMISSION_FILE="${{ steps.merge_submission.outputs.submission_file }}"
          if [ -n "$SUBMISSION_FILE" ] && [ -f "$SUBMISSION_FILE" ]; then
            git rm "$SUBMISSION_FILE"
            git commit -m "Clean up processed submission file"
            git push
          fi

      - name: Comment on PR
        if: steps.check_submission.outputs.is_submission == 'true'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.payload.pull_request.number,
              body: '✅ **Prompt successfully added to marketplace!**\n\nThe prompt has been merged into `marketplace.json` and will be live on the site shortly.\n\nThank you for your contribution! 🎉'
            })
```

### 3.3 Merge Script

**File:** `scripts/merge-submission.js`

```javascript
#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

function mergeSubmission(submissionFilePath) {
  // 1. Read the submission file
  const submissionPath = path.join(process.cwd(), submissionFilePath)
  const submission = JSON.parse(fs.readFileSync(submissionPath, 'utf8'))

  console.log(`Processing submission: ${submission.title}`)

  // 2. Read marketplace.json
  const marketplacePath = path.join(process.cwd(), 'data/marketplace.json')
  const marketplace = JSON.parse(fs.readFileSync(marketplacePath, 'utf8'))

  // 3. Check for duplicate IDs (shouldn't happen, but be safe)
  const existingIds = marketplace.prompts.map(p => p.id)
  if (existingIds.includes(submission.id)) {
    console.error(`ERROR: Duplicate prompt ID: ${submission.id}`)
    process.exit(1)
  }

  // 4. Add submission to prompts array
  marketplace.prompts.push(submission)

  // 5. Sort by createdAt (newest first)
  marketplace.prompts.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  // 6. Write back to marketplace.json
  fs.writeFileSync(
    marketplacePath,
    JSON.stringify(marketplace, null, 2) + '\n', // Keep trailing newline
    'utf8'
  )

  console.log(`✅ Successfully added "${submission.title}" to marketplace`)
  console.log(`   Total prompts: ${marketplace.prompts.length}`)
}

// Get file path from command line argument
const submissionFile = process.argv[2]

if (!submissionFile) {
  console.error('Usage: node merge-submission.js <path-to-submission.json>')
  process.exit(1)
}

mergeSubmission(submissionFile)
```

**Make script executable:**
```bash
chmod +x scripts/merge-submission.js
```

### 3.4 GitHub Action: Notify Submitter (Optional)

**File:** `.github/workflows/notify-submitter.yml`

```yaml
name: Notify Submitter on Status Change

on:
  pull_request:
    types: [labeled, closed]

jobs:
  send-notification:
    runs-on: ubuntu-latest
    steps:
      - name: Extract submitter email from PR
        id: get_email
        uses: actions/github-script@v7
        with:
          script: |
            const prBody = context.payload.pull_request.body || ''
            const emailMatch = prBody.match(/\(([^@]+@[^)]+)\)/)
            return emailMatch ? emailMatch[1] : null

      - name: Send approval notification
        if: contains(github.event.pull_request.labels.*.name, 'approved')
        run: |
          # This would integrate with an email service
          # For now, just log
          echo "Would send approval email to: ${{ steps.get_email.outputs.result }}"

      - name: Send rejection notification
        if: |
          github.event.pull_request.state == 'closed' &&
          !github.event.pull_request.merged &&
          contains(github.event.pull_request.labels.*.name, 'prompt-submission')
        run: |
          echo "Would send rejection email to: ${{ steps.get_email.outputs.result }}"
```

### 3.5 PR Template for Submissions

**File:** `.github/PULL_REQUEST_TEMPLATE/prompt_submission.md`

```markdown
## Prompt Submission Review

**DO NOT EDIT** - This PR was automatically generated from a user submission.

---

### Submission Details

**Title:** <!-- AUTO-FILLED -->

**Submitted by:** <!-- AUTO-FILLED -->

**Business Area:** <!-- AUTO-FILLED -->

**Format:** <!-- AUTO-FILLED -->

---

### Review Checklist

Before merging, verify:

- [ ] **Content Quality:** Prompt is clear, well-written, and useful
- [ ] **No Sensitive Data:** No API keys, passwords, or private information
- [ ] **Proper Formatting:** Variables use `[VARIABLE]` or `${variable}` format
- [ ] **Appropriate Tags:** Tags accurately describe the prompt
- [ ] **Business Area:** Correctly categorized
- [ ] **No Spam:** Legitimate submission, not spam or test data
- [ ] **Author Attribution:** Submitter name and email are valid

---

### Actions

**To Approve:**
1. Review the JSON file in `data/submissions/`
2. Add label: `approved`
3. Merge this PR
4. GitHub Action will automatically add to `marketplace.json`

**To Reject:**
1. Add label: `rejected`
2. Leave a comment explaining why (optional but recommended)
3. Close PR without merging
4. Submitter will be notified (if email workflow enabled)

**To Request Changes:**
1. Leave review comments
2. Close PR with explanation
3. Ask submitter to resubmit with changes

---

**Submission File:** `data/submissions/[ID].json`

**Submitted at:** <!-- AUTO-FILLED -->
```

### 3.6 Repository Settings

**Required GitHub Settings:**

1. **Branch Protection Rules for `main`:**
   - ✅ Require pull request reviews (optional - you can self-merge)
   - ✅ Allow force pushes (admins only)
   - ✅ Require status checks to pass

2. **Actions Permissions:**
   - Settings → Actions → General
   - Workflow permissions: **Read and write permissions**
   - Allow GitHub Actions to create and approve pull requests: **Yes**

3. **Create `/data/submissions/` directory:**
   ```bash
   mkdir -p data/submissions
   echo "# Submission Files" > data/submissions/README.md
   git add data/submissions/README.md
   git commit -m "Add submissions directory"
   git push
   ```

---

## Phase 4: Testing & Quality Assurance

### 4.1 Local Testing Checklist

**Before Deploying:**

- [ ] Form validation works for all required fields
- [ ] Client-side validation shows helpful error messages
- [ ] Form auto-saves to localStorage
- [ ] Live preview updates correctly
- [ ] Variable detection highlights `[VARS]` and `${vars}`
- [ ] Tag input allows adding/removing tags
- [ ] Model settings sliders work correctly
- [ ] Submit button disabled until form is valid
- [ ] Loading state shows during submission
- [ ] Success page displays with PR link

### 4.2 API Testing

**Test Cases:**

```bash
# Test valid submission
curl -X POST http://localhost:3000/api/prompts/submit \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Prompt",
    "description": "This is a test prompt for validation",
    "content": "Find customer [CUSTOMER_NAME] and show balance",
    "format": "general",
    "businessArea": "accounting",
    "submitterName": "Test User",
    "submitterEmail": "test@example.com",
    "agreeToTerms": true
  }'

# Test missing required field
curl -X POST http://localhost:3000/api/prompts/submit \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test",
    "description": "Missing content field"
  }'

# Test invalid email
curl -X POST http://localhost:3000/api/prompts/submit \
  -H "Content-Type: application/json" \
  -d '{
    "submitterEmail": "not-an-email"
  }'
```

### 4.3 GitHub Integration Testing

**Manual Test Flow:**

1. Fill out form on `/marketplace/submit`
2. Click submit
3. Verify PR created on GitHub:
   - Branch name: `submissions/prompt-[id]`
   - File exists: `data/submissions/submitted-[id].json`
   - PR has labels: `prompt-submission`, `needs-review`
   - PR body contains submission details
4. Review PR on GitHub
5. Add label: `approved`
6. Merge PR
7. Verify GitHub Action runs:
   - Check Actions tab for workflow run
   - Verify `marketplace.json` updated
   - Verify submission file deleted
8. Verify prompt appears on site (after deployment)

### 4.4 Error Scenarios to Test

- [ ] GitHub API rate limit exceeded
- [ ] Invalid GitHub token
- [ ] Network timeout during PR creation
- [ ] Duplicate prompt ID (edge case)
- [ ] Malformed JSON in submission
- [ ] XSS attempt in form fields
- [ ] Very long input (>10000 chars)
- [ ] Empty required fields
- [ ] Invalid email format

---

## Phase 5: Deployment

### 5.1 Environment Setup

**Vercel Environment Variables:**

```
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_REPO_OWNER=brettwhite-git
GITHUB_REPO_NAME=suiteprompt
```

**Add via Vercel Dashboard:**
1. Go to Project Settings → Environment Variables
2. Add each variable for Production, Preview, and Development
3. Redeploy after adding variables

### 5.2 Deployment Checklist

**Before Going Live:**

- [ ] All environment variables set in Vercel
- [ ] GitHub token has correct scopes
- [ ] Branch protection rules configured
- [ ] GitHub Actions workflows tested
- [ ] Submission form tested in preview deployment
- [ ] Error handling works correctly
- [ ] Rate limiting enabled (optional)
- [ ] Form validation catches all edge cases
- [ ] Success/error states display properly
- [ ] Mobile responsive design verified

### 5.3 Monitoring

**What to Monitor:**

- GitHub Action workflow runs (check for failures)
- Vercel function logs (API route errors)
- GitHub rate limit usage (5000 requests/hour)
- Number of PRs created per day
- Submission success rate

**GitHub Rate Limit Check:**
```bash
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/rate_limit
```

---

## Phase 6: Post-Launch

### 6.1 Documentation for Users

**Add to site:**

**New Page:** `/app/marketplace/submit/guidelines/page.tsx`

**Content:**
- What makes a good prompt
- Formatting guidelines for variables
- Business area descriptions
- Example prompts
- Review timeline expectations
- FAQ

### 6.2 Admin Workflow Documentation

**For Your Reference:**

**Daily Review Process:**
1. Check GitHub for new PRs with `needs-review` label
2. Review submission file in `data/submissions/`
3. Test prompt if complex
4. Add `approved` or `rejected` label
5. Merge approved PRs
6. Leave feedback on rejected PRs

**Weekly Maintenance:**
1. Review GitHub Action logs for failures
2. Check rate limit usage
3. Monitor for spam submissions
4. Update guidelines based on common issues

### 6.3 Future Enhancements

**Phase 2 Features (Optional):**

- [ ] User authentication (track submission history)
- [ ] Email notifications on approval/rejection
- [ ] Admin dashboard for quick review
- [ ] Upvote/downvote on submitted prompts
- [ ] Automated quality scoring
- [ ] Duplicate detection (similar prompts)
- [ ] Bulk approval interface
- [ ] Analytics on submission trends
- [ ] Featured/promoted submissions
- [ ] Submission categories/collections

---

## Implementation Timeline

### Week 1: UI Foundation
- Day 1-2: Create form component structure
- Day 3-4: Build validation and error handling
- Day 5: Add live preview panel
- Day 6-7: Styling and responsive design

### Week 2: Backend Integration
- Day 1-2: Create API route with validation
- Day 3-4: Implement GitHub API integration
- Day 5: Add rate limiting and error handling
- Day 6-7: Testing and debugging

### Week 3: GitHub Actions & Polish
- Day 1-2: Create GitHub workflows
- Day 3: Write merge script
- Day 4: Test full flow end-to-end
- Day 5: Fix bugs and edge cases
- Day 6-7: Documentation and deployment

### Week 4: Launch & Monitor
- Day 1: Deploy to production
- Day 2-7: Monitor submissions, fix issues, gather feedback

---

## File Changes Summary

### New Files to Create

```
/app/
├── api/
│   └── prompts/
│       └── submit/
│           └── route.ts (API endpoint)
├── marketplace/
│   └── submit/
│       ├── page.tsx (form page)
│       ├── success/
│       │   └── page.tsx (success page)
│       └── guidelines/
│           └── page.tsx (submission guidelines)

/components/
├── marketplace/
│   ├── PromptSubmissionForm.tsx (main form)
│   ├── PromptPreviewPanel.tsx (live preview)
│   ├── VariableDetector.tsx (variable extraction)
│   ├── TagInput.tsx (tag input component)
│   └── FormSection.tsx (collapsible section)

/lib/
├── github.ts (GitHub API wrapper)
├── prompt-helpers.ts (formatting utilities)
├── rate-limit.ts (rate limiting)
└── logger.ts (structured logging)

/scripts/
└── merge-submission.js (GitHub Action script)

/.github/
├── workflows/
│   ├── merge-approved-submission.yml
│   └── notify-submitter.yml (optional)
└── PULL_REQUEST_TEMPLATE/
    └── prompt_submission.md

/data/
└── submissions/
    └── README.md (placeholder)
```

### Modified Files

```
/data/
└── marketplace.json (updated by GitHub Action)

/app/marketplace/
└── layout.tsx (add "Submit Prompt" nav link)

/package.json (add dependencies)
```

### Dependencies to Add

```bash
npm install @octokit/rest zod react-hook-form @hookform/resolvers/zod lru-cache
npm install -D @types/node
```

---

## Security Considerations

### 1. Input Sanitization
- Sanitize all user inputs to prevent XSS
- Validate email format strictly
- Strip HTML tags from text inputs
- Limit file/content size

### 2. Rate Limiting
- Limit submissions per IP address
- Limit submissions per email
- Monitor for spam patterns
- Implement CAPTCHA if needed (hCaptcha, reCAPTCHA)

### 3. GitHub Token Security
- Never commit token to repository
- Use environment variables only
- Rotate token periodically
- Minimum required scopes only
- Consider using GitHub App instead of PAT

### 4. Content Moderation
- Manual review before publishing
- Check for offensive content
- Verify no sensitive data
- Validate business logic
- Test prompts before approval

### 5. API Security
- Validate all inputs server-side
- Use Zod schemas for type safety
- Handle errors gracefully
- Log suspicious activity
- Monitor for abuse

---

## Success Metrics

**Track These Metrics:**

- Number of submissions per week
- Approval rate (approved / total)
- Average review time
- Number of active contributors
- Most popular submission categories
- Time from submission to live
- User feedback on submission process

**Goals:**
- Review submissions within 48 hours
- >70% approval rate (indicates good guidelines)
- <5% spam rate
- Increasing unique contributors over time

---

## Support & Troubleshooting

### Common Issues

**Issue:** PR creation fails with 403 error
- **Solution:** Check GitHub token has `repo` scope

**Issue:** GitHub Action doesn't trigger
- **Solution:** Verify workflow permissions in repo settings

**Issue:** Rate limit exceeded
- **Solution:** Implement caching, reduce API calls, or upgrade GitHub plan

**Issue:** Duplicate prompt IDs
- **Solution:** Ensure timestamp + random in ID generation

**Issue:** Form data lost on page refresh
- **Solution:** Implement localStorage auto-save

---

## Conclusion

This plan provides a complete GitHub PR-based workflow for user-submitted prompts. The implementation is:

- **Simple:** No database required
- **Scalable:** Can handle moderate submission volume
- **Maintainable:** Review via familiar GitHub interface
- **Automated:** GitHub Actions handle the merge process
- **Type-safe:** Full TypeScript coverage
- **Secure:** Input validation and rate limiting

**Next Steps:**
1. Review this plan
2. Set up GitHub token
3. Create submission form UI
4. Implement API route
5. Test locally
6. Deploy to Vercel
7. Monitor and iterate

**Questions to Answer Before Starting:**
- What's your expected submission volume?
- Do you want email notifications?
- Should submissions be public or private during review?
- Do you want CAPTCHA to prevent spam?
- What's your target review turnaround time?
