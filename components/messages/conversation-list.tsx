"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { MessageSquare } from "lucide-react"

interface Conversation {
  id: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
}

interface ConversationListProps {
  conversations: Conversation[]
  selectedId?: string
  currentUserId: string
}

export function ConversationList({
  conversations,
  selectedId,
  currentUserId,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <MessageSquare className="size-10 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground text-center">
          No conversations yet
        </p>
        <p className="text-xs text-muted-foreground text-center mt-1">
          Start a conversation from a member&apos;s profile
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y">
      {conversations.map((conversation) => {
        const initials =
          conversation.first_name && conversation.last_name
            ? `${conversation.first_name[0]}${conversation.last_name[0]}`
            : "?"

        const isSelected = selectedId === conversation.id

        return (
          <Link
            key={conversation.id}
            href={`/messages?to=${conversation.id}`}
            className={cn(
              "flex items-center gap-3 p-4 hover:bg-accent transition-colors",
              isSelected && "bg-accent"
            )}
          >
            <Avatar className="size-10">
              <AvatarImage src={conversation.avatar_url || undefined} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm truncate">
                {conversation.first_name} {conversation.last_name}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
