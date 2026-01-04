# Submissions Directory

This directory temporarily holds user-submitted prompts during the review process.

## How it works

1. User submits a prompt via the web form at `/marketplace/submit`
2. API creates a new branch and places the submission JSON file here
3. A Pull Request is automatically created for review
4. Upon PR merge, a GitHub Action:
   - Copies the prompt to `marketplace.json`
   - Deletes the submission file from this directory
   - Deploys the updated marketplace

## File naming

Submission files follow the pattern: `submitted-{timestamp}-{random}.json`

Example: `submitted-1704123456789-x3k7p.json`

## Note

This directory should remain mostly empty. Files here indicate pending review PRs.
