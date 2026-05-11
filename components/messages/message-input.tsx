"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { Send } from "lucide-react"

interface MessageInputProps {
  recipientId: string
  currentUserId: string
}

export function MessageInput({ recipientId, currentUserId }: MessageInputProps) {
  const [content, setContent] = useState("")
  const [sending, setSending] = useState(false)
  const router = useRouter()

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setSending(true)

    const supabase = createClient()
    const { error } = await supabase.from("messages").insert({
      sender_id: currentUserId,
      recipient_id: recipientId,
      content: content.trim(),
    })

    if (!error) {
      setContent("")
      router.refresh()
    }

    setSending(false)
  }

  return (
    <form onSubmit={handleSend} className="flex gap-2">
      <Input
        placeholder="Type a message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={sending}
        className="flex-1"
      />
      <Button type="submit" size="icon" disabled={sending || !content.trim()}>
        <Send className="size-4" />
      </Button>
    </form>
  )
}
