"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { createClient } from "@/lib/supabase/client"
import { LogOut } from "lucide-react"

export function SignOutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <Button variant="destructive" onClick={handleSignOut} disabled={loading}>
      {loading ? (
        <Spinner size="sm" />
      ) : (
        <>
          <LogOut className="size-4 mr-2" />
          Sign Out
        </>
      )}
    </Button>
  )
}
