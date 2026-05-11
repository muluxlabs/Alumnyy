"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { createClient } from "@/lib/supabase/client"
import { UserPlus, Check, Clock } from "lucide-react"

interface Connection {
  id: string
  user_id: string
  connected_user_id: string
  status: string
}

interface ConnectButtonProps {
  targetUserId: string
  currentUserId?: string
  existingConnection: Connection | null
}

export function ConnectButton({
  targetUserId,
  currentUserId,
  existingConnection,
}: ConnectButtonProps) {
  const [loading, setLoading] = useState(false)
  const [connection, setConnection] = useState(existingConnection)

  const handleConnect = async () => {
    if (!currentUserId) return

    setLoading(true)

    const supabase = createClient()
    const { data, error } = await supabase
      .from("connections")
      .insert({
        user_id: currentUserId,
        connected_user_id: targetUserId,
        status: "pending",
      })
      .select()
      .single()

    if (!error && data) {
      setConnection(data)
    }

    setLoading(false)
  }

  const handleAccept = async () => {
    if (!connection) return

    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase
      .from("connections")
      .update({ status: "accepted" })
      .eq("id", connection.id)

    if (!error) {
      setConnection({ ...connection, status: "accepted" })
    }

    setLoading(false)
  }

  if (!currentUserId) {
    return null
  }

  // Already connected
  if (connection?.status === "accepted") {
    return (
      <Button variant="outline" disabled>
        <Check className="size-4 mr-2" />
        Connected
      </Button>
    )
  }

  // Pending - they sent request to us
  if (
    connection?.status === "pending" &&
    connection.user_id === targetUserId
  ) {
    return (
      <Button onClick={handleAccept} disabled={loading}>
        {loading ? (
          <Spinner size="sm" />
        ) : (
          <>
            <Check className="size-4 mr-2" />
            Accept Request
          </>
        )}
      </Button>
    )
  }

  // Pending - we sent request
  if (connection?.status === "pending") {
    return (
      <Button variant="outline" disabled>
        <Clock className="size-4 mr-2" />
        Request Sent
      </Button>
    )
  }

  // No connection - show connect button
  return (
    <Button onClick={handleConnect} disabled={loading}>
      {loading ? (
        <Spinner size="sm" />
      ) : (
        <>
          <UserPlus className="size-4 mr-2" />
          Connect
        </>
      )}
    </Button>
  )
}
