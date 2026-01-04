#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

function mergeSubmission(submissionFilePath) {
  try {
    // 1. Read the submission file
    const submissionPath = path.join(process.cwd(), submissionFilePath)

    if (!fs.existsSync(submissionPath)) {
      console.error(`ERROR: Submission file not found: ${submissionPath}`)
      process.exit(1)
    }

    const submission = JSON.parse(fs.readFileSync(submissionPath, 'utf8'))
    console.log(`Processing submission: ${submission.title}`)

    // 2. Read marketplace.json
    const marketplacePath = path.join(process.cwd(), 'data/marketplace.json')

    if (!fs.existsSync(marketplacePath)) {
      console.error(`ERROR: marketplace.json not found at ${marketplacePath}`)
      process.exit(1)
    }

    const marketplace = JSON.parse(fs.readFileSync(marketplacePath, 'utf8'))

    // 3. Check for duplicate IDs
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
      JSON.stringify(marketplace, null, 2) + '\n',
      'utf8'
    )

    console.log(`✅ Successfully added "${submission.title}" to marketplace`)
    console.log(`   Total prompts: ${marketplace.prompts.length}`)
  } catch (error) {
    console.error(`ERROR: Failed to merge submission`)
    console.error(error)
    process.exit(1)
  }
}

// Get file path from command line argument
const submissionFile = process.argv[2]

if (!submissionFile) {
  console.error('Usage: node merge-submission.js <path-to-submission.json>')
  process.exit(1)
}

mergeSubmission(submissionFile)
