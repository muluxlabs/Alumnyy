"use client"

import { useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  sender_id: string
  recipient_id: string
  content: string
  created_at: string
  read: boolean
}

interface OtherUser {
  id: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
}

interface MessageListProps {
  messages: Message[]
  currentUserId: string
  otherUser: OtherUser
}

export function MessageList({
  messages,
  currentUserId,
  otherUser,
}: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const otherInitials =
    otherUser.first_name && otherUser.last_name
      ? `${otherUser.first_name[0]}${otherUser.last_name[0]}`
      : "?"

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground text-sm">No messages yet</p>
        <p className="text-muted-foreground text-xs mt-1">
          Send the first message!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isSent = message.sender_id === currentUserId

        return (
          <div
            key={message.id}
            className={cn("flex gap-3", isSent && "flex-row-reverse")}
          >
            {!isSent && (
              <Avatar className="size-8 shrink-0">
                <AvatarImage src={otherUser.avatar_url || undefined} />
                <AvatarFallback className="text-xs">{otherInitials}</AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                "max-w-[70%] rounded-2xl px-4 py-2",
                isSent
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p
                className={cn(
                  "text-xs mt-1",
                  isSent ? "text-primary-foreground/70" : "text-muted-foreground"
                )}
              >
                {new Date(message.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        )
      })}
      <div ref={endRef} />
    </div>
  )
}
