import { Octokit } from "@octokit/rest"
import type { Prompt } from "@/types/marketplace"

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const REPO_OWNER = process.env.GITHUB_REPO_OWNER || "brettwhite-git"
const REPO_NAME = process.env.GITHUB_REPO_NAME || "netsuite-marketplace"
const BASE_BRANCH = "main"

export interface CreatePRResult {
  html_url: string
  number: number
}

export async function createSubmissionPR(
  prompt: Prompt,
  submitterName: string
): Promise<CreatePRResult> {
  try {
    // 1. Get the latest commit SHA from main branch
    const { data: ref } = await octokit.git.getRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: `heads/${BASE_BRANCH}`,
    })
    const mainSha = ref.object.sha

    // 2. Create new branch
    const branchName = `submissions/prompt-${prompt.id}`
    await octokit.git.createRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: `refs/heads/${branchName}`,
      sha: mainSha,
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
      branch: branchName,
    })

    // 4. Create Pull Request
    const prBody = generatePRDescription(prompt, submitterName)

    const { data: pr } = await octokit.pulls.create({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      title: `📝 New Prompt: ${prompt.title}`,
      head: branchName,
      base: BASE_BRANCH,
      body: prBody,
    })

    // 5. Add labels
    await octokit.issues.addLabels({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      issue_number: pr.number,
      labels: ["prompt-submission", "needs-review"],
    })

    return {
      html_url: pr.html_url,
      number: pr.number,
    }
  } catch (error) {
    console.error("GitHub PR creation error:", error)
    throw new Error(
      error instanceof Error ? error.message : "Failed to create GitHub PR"
    )
  }
}

function generatePRDescription(
  prompt: Prompt,
  submitterName: string
): string {
  return `## New Prompt Submission

**Title:** ${prompt.title}

**Description:** ${prompt.description}

**Format:** ${prompt.format}

**Category:** ${prompt.businessArea}

**Submitted by:** ${submitterName}

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
- [ ] Category and tags are accurate (matches prompt content)
- [ ] Author attribution is correct

---

**Submitted at:** ${new Date().toISOString()}

**File:** \`data/submissions/${prompt.id}.json\`

_Note: Submitter was notified via email with a link to track this PR._
  `.trim()
}
