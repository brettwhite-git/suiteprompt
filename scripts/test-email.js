/**
 * Test script to verify Resend email integration
 * Run with: node scripts/test-email.js
 */

require('dotenv').config({ path: '.env.local' })
const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

async function testEmail() {
  console.log('Testing Resend email integration...\n')

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@suiteprompt.dev',
      to: 'bwhite.mail@proton.me', // Your email for testing
      subject: '✅ Test: Prompt Submitted Successfully!',
      html: `
        <h2>Thank you for submitting to SuitePrompt!</h2>
        <p>Your prompt "<strong>Test Prompt Title</strong>" has been submitted for review.</p>

        <p><strong>Track your submission:</strong></p>
        <p><a href="https://github.com/brettwhite-git/netsuite-marketplace/pull/1" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Pull Request #1</a></p>

        <p>You'll be able to see when your submission is approved and merged. If there are any questions or issues, they'll be discussed in the PR comments.</p>

        <hr style="margin: 24px 0; border: none; border-top: 1px solid #eaeaea;">

        <p style="color: #666; font-size: 14px;">
          <strong>What happens next?</strong><br>
          • Your submission will be reviewed<br>
          • If approved, it will be merged and appear in the marketplace<br>
          • You can track progress via the PR link above
        </p>
      `,
    })

    if (error) {
      console.error('❌ Error sending email:', error)
      process.exit(1)
    }

    console.log('✅ Email sent successfully!')
    console.log('Email ID:', data.id)
    console.log('\nCheck your inbox at: bwhite.mail@proton.me')
  } catch (error) {
    console.error('❌ Failed to send email:', error)
    process.exit(1)
  }
}

testEmail()
