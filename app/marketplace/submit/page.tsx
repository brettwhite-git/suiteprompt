import { Suspense } from "react"
import { PromptSubmissionForm } from "@/components/marketplace/PromptSubmissionForm"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Submit a Prompt | SuitePrompt",
  description: "Submit your NetSuite prompt to the marketplace",
}

function FormLoader() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export default function SubmitPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Submit a Prompt</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Share your NetSuite prompt with the community. All submissions are
          reviewed before publishing.
        </p>
      </div>

      <Suspense fallback={<FormLoader />}>
        <PromptSubmissionForm />
      </Suspense>
    </div>
  )
}
