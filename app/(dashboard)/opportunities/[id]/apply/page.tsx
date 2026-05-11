"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { ArrowLeft } from "lucide-react"

interface Opportunity {
  id: string
  title: string
  type: string
  creator_id: string
}

export default function ApplyPage() {
  const router = useRouter()
  const params = useParams()
  const opportunityId = params.id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null)
  const [coverLetter, setCoverLetter] = useState("")

  useEffect(() => {
    const loadOpportunity = async () => {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data } = await supabase
        .from("opportunities")
        .select("id, title, type, creator_id")
        .eq("id", opportunityId)
        .single()

      if (!data) {
        router.push("/opportunities")
        return
      }

      // Check if user has already applied
      const { data: existingApplication } = await supabase
        .from("applications")
        .select("id")
        .eq("opportunity_id", opportunityId)
        .eq("applicant_id", user.id)
        .single()

      if (existingApplication) {
        router.push(`/opportunities/${opportunityId}`)
        return
      }

      // Can't apply to own opportunity
      if (data.creator_id === user.id) {
        router.push(`/opportunities/${opportunityId}`)
        return
      }

      setOpportunity(data)
      setLoading(false)
    }

    loadOpportunity()
  }, [opportunityId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    const { error: insertError } = await supabase.from("applications").insert({
      opportunity_id: opportunityId,
      applicant_id: user.id,
      cover_letter: coverLetter || null,
      status: "applied",
    })

    if (insertError) {
      setError(insertError.message)
      setSubmitting(false)
    } else {
      router.push(`/opportunities/${opportunityId}`)
      router.refresh()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href={`/opportunities/${opportunityId}`}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Opportunity
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Apply for: {opportunity?.title}</CardTitle>
          <CardDescription>
            Share why you&apos;re interested in this opportunity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter / Message</Label>
              <textarea
                id="coverLetter"
                className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Introduce yourself and explain why you're a great fit for this opportunity..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Your profile information will be shared with the opportunity poster
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={submitting}>
                {submitting ? <Spinner size="sm" /> : "Submit Application"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href={`/opportunities/${opportunityId}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
