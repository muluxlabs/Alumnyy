import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MessageList } from "@/components/messages/message-list"
import { ConversationList } from "@/components/messages/conversation-list"
import { MessageInput } from "@/components/messages/message-input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

interface SearchParams {
  to?: string
}

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get all conversations (unique users the current user has messaged with)
  const { data: sentMessages } = await supabase
    .from("messages")
    .select(`
      recipient_id,
      recipient:profiles!recipient_id (
        id,
        first_name,
        last_name,
        avatar_url
      )
    `)
    .eq("sender_id", user.id)
    .order("created_at", { ascending: false })

  const { data: receivedMessages } = await supabase
    .from("messages")
    .select(`
      sender_id,
      sender:profiles!sender_id (
        id,
        first_name,
        last_name,
        avatar_url
      )
    `)
    .eq("recipient_id", user.id)
    .order("created_at", { ascending: false })

  // Get unique conversation partners
  const conversationMap = new Map()
  sentMessages?.forEach((msg) => {
    if (msg.recipient && !conversationMap.has(msg.recipient_id)) {
      conversationMap.set(msg.recipient_id, msg.recipient)
    }
  })
  receivedMessages?.forEach((msg) => {
    if (msg.sender && !conversationMap.has(msg.sender_id)) {
      conversationMap.set(msg.sender_id, msg.sender)
    }
  })

  const conversations = Array.from(conversationMap.values())

  // If there's a "to" param, fetch that user's profile
  let selectedConversation = null
  if (params.to) {
    const { data: toUser } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, avatar_url")
      .eq("id", params.to)
      .single()

    selectedConversation = toUser
  }

  // Get messages for selected conversation
  let messages: any[] = []
  if (selectedConversation) {
    const { data: conversationMessages } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${user.id},recipient_id.eq.${selectedConversation.id}),and(sender_id.eq.${selectedConversation.id},recipient_id.eq.${user.id})`
      )
      .order("created_at", { ascending: true })

    messages = conversationMessages || []

    // Mark messages as read
    await supabase
      .from("messages")
      .update({ read: true })
      .eq("sender_id", selectedConversation.id)
      .eq("recipient_id", user.id)
      .eq("read", false)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground mt-1">
          Connect with your network
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-250px)] min-h-[500px]">
        {/* Conversations List */}
        <Card className="md:col-span-1 overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="text-base">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto h-[calc(100%-60px)]">
            <ConversationList
              conversations={conversations}
              selectedId={selectedConversation?.id}
              currentUserId={user.id}
            />
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="md:col-span-2 overflow-hidden flex flex-col">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b shrink-0">
                <CardTitle className="text-base">
                  {selectedConversation.first_name}{" "}
                  {selectedConversation.last_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
                <div className="flex-1 overflow-y-auto p-4">
                  <MessageList
                    messages={messages}
                    currentUserId={user.id}
                    otherUser={selectedConversation}
                  />
                </div>
                <div className="border-t p-4 shrink-0">
                  <MessageInput
                    recipientId={selectedConversation.id}
                    currentUserId={user.id}
                  />
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex-1 flex flex-col items-center justify-center">
              <MessageSquare className="size-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground">
                Select a conversation
              </h3>
              <p className="text-muted-foreground text-center mt-1">
                Choose a conversation from the list or start a new one from a
                member&apos;s profile
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
