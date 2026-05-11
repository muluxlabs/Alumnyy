"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

interface MessageButtonProps {
  recipientId: string
  recipientName: string
}

export function MessageButton({ recipientId, recipientName }: MessageButtonProps) {
  return (
    <Button variant="outline" asChild>
      <Link href={`/messages?to=${recipientId}`}>
        <MessageSquare className="size-4 mr-2" />
        Message
      </Link>
    </Button>
  )
}
