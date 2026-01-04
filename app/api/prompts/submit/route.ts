import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { Resend } from "resend"
import { createSubmissionPR } from "@/lib/github"
import {
  generatePromptId,
  formatSubmissionAsPrompt,
  sanitizeInput,
  type SubmitPromptRequest,
} from "@/lib/prompt-helpers"
import taxonomyData from "@/data/taxonomy.json"

const resend = new Resend(process.env.RESEND_API_KEY)

// Extract valid category IDs from submission categories
const validPromptCategoryIds = Object.keys(taxonomyData.submissionCategories.prompts)
const validSkillCategoryIds = Object.keys(taxonomyData.submissionCategories.skills)

// Zod validation schema
const promptSubmissionSchema = z.object({
  // Basic info
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters")
    .transform(sanitizeInput),
  format: z.enum(["general", "prompt-studio", "mcp", "skill"]),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters")
    .transform(sanitizeInput),

  // General & MCP: Content
  content: z.string().max(5000).optional(),
  inputVariables: z.array(z.string()).optional(),

  // Prompt Studio: System prompt and model settings
  systemPrompt: z.string().max(5000).optional(),
  temperature: z.number().min(0).max(1).optional(),
  maxTokens: z.number().min(1).max(4096).optional(),

  // Skill: Skill content
  skillContent: z.string().max(10000).optional(),

  // Classification (category ID from submission categories)
  businessArea: z
    .string()
    .min(1, "Category is required")
    .refine(
      (val) =>
        validPromptCategoryIds.includes(val) || validSkillCategoryIds.includes(val),
      {
        message:
          "Invalid category. Must be a valid category from the submission form.",
      }
    ),
  targetPlatform: z
    .array(
      z.enum([
        "text-enhance",
        "prompt-studio",
        "advisor",
        "mcp",
      ])
    )
    .optional(),
  mcpTools: z.array(z.string()).optional(),

  // Metadata
  tags: z.array(z.string()).max(5, "Maximum 5 tags allowed").optional(),

  // Submitter (email kept separate, not in submission JSON)
  submitterName: z
    .string()
    .min(1, "Name is required")
    .transform(sanitizeInput),
  submitterEmail: z
    .string()
    .email("Valid email required")
    .min(1, "Email is required"),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms",
  }),

  // CAPTCHA token
  turnstileToken: z.string().min(1, "CAPTCHA verification required"),
}).superRefine((data, ctx) => {
  // Validate businessArea matches the format type
  if (data.format === "skill") {
    // For skills, businessArea must be a skill category ID
    if (!validSkillCategoryIds.includes(data.businessArea)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "For skills, you must select a valid skill category",
        path: ["businessArea"],
      })
    }
  } else {
    // For general, prompt-studio, and mcp, businessArea must be a prompt category ID
    if (!validPromptCategoryIds.includes(data.businessArea)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "For this format, you must select a valid prompt category",
        path: ["businessArea"],
      })
    }
  }
})

/**
 * Verify Turnstile token with Cloudflare
 */
async function verifyTurnstile(token: string): Promise<boolean> {
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    }
  )

  const data = await response.json()
  return data.success === true
}

export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    const body = await request.json()

    // 2. Validate with Zod
    const validated = promptSubmissionSchema.parse(body)

    // 3. Verify Turnstile CAPTCHA
    const captchaValid = await verifyTurnstile(validated.turnstileToken)
    if (!captchaValid) {
      return NextResponse.json(
        { success: false, error: "CAPTCHA verification failed" },
        { status: 400 }
      )
    }

    // 4. Generate unique prompt ID
    const promptId = generatePromptId()

    // 5. Extract email (keep separate, don't include in submission JSON)
    const { submitterEmail, ...submissionData } = validated

    // 6. Format as Prompt object (without email)
    const promptObject = formatSubmissionAsPrompt(
      submissionData as SubmitPromptRequest,
      promptId
    )

    // 7. Create GitHub PR (without email - privacy!)
    const pr = await createSubmissionPR(
      promptObject,
      validated.submitterName
    )

    // 8. Send confirmation email to submitter
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "noreply@suiteprompt.dev",
        to: submitterEmail,
        subject: "✅ Prompt Submitted Successfully!",
        html: `
          <h2>Thank you for submitting to SuitePrompt!</h2>
          <p>Your prompt "<strong>${promptObject.title}</strong>" has been submitted for review.</p>

          <p><strong>Track your submission:</strong></p>
          <p><a href="${pr.html_url}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Pull Request #${pr.number}</a></p>

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
    } catch (emailError) {
      // Log email error but don't fail the submission
      console.error("Failed to send confirmation email:", emailError)
      // Continue - PR was created successfully
    }

    // 9. Return success with PR URL
    return NextResponse.json({
      success: true,
      prUrl: pr.html_url,
      prNumber: pr.number,
      message: "Submission successful! Your prompt is now under review.",
    })
  } catch (error) {
    console.error("Submission error:", error)

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.issues,
        },
        { status: 400 }
      )
    }

    // Handle GitHub API errors
    if (error instanceof Error) {
      // Check for timeout or network errors
      if (
        error.message.includes("timeout") ||
        error.message.includes("ETIMEDOUT")
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Request timed out. Please try again. Your data has been preserved.",
          },
          { status: 504 }
        )
      }

      // GitHub rate limit
      if (error.message.includes("rate limit")) {
        return NextResponse.json(
          {
            success: false,
            error:
              "GitHub API rate limit exceeded. Please try again in a few minutes.",
          },
          { status: 429 }
        )
      }
    }

    // Generic error
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create submission. Please try again.",
      },
      { status: 500 }
    )
  }
}
