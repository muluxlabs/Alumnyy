"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { createClient } from "@/lib/supabase/client"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface MentorshipRequestActionsProps {
  requestId: string
  className?: string
}

export function MentorshipRequestActions({
  requestId,
  className,
}: MentorshipRequestActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<"accept" | "reject" | null>(null)

  const handleAction = async (action: "accept" | "reject") => {
    setLoading(action)

    const supabase = createClient()
    const { error } = await supabase
      .from("mentorship_requests")
      .update({
        status: action === "accept" ? "accepted" : "rejected",
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId)

    if (!error) {
      router.refresh()
    }

    setLoading(null)
  }

  return (
    <div className={cn("flex gap-2", className)}>
      <Button
        size="sm"
        onClick={() => handleAction("accept")}
        disabled={loading !== null}
      >
        {loading === "accept" ? (
          <Spinner size="sm" />
        ) : (
          <>
            <Check className="size-4 mr-1" />
            Accept
          </>
        )}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleAction("reject")}
        disabled={loading !== null}
      >
        {loading === "reject" ? (
          <Spinner size="sm" />
        ) : (
          <>
            <X className="size-4 mr-1" />
            Decline
          </>
        )}
      </Button>
    </div>
  )
}
