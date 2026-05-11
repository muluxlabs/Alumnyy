"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MapPin, Briefcase, UserPlus, Users } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Spinner } from "@/components/ui/spinner"

interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  headline: string | null
  country: string | null
  city: string | null
  industry: string | null
  profile_type: string | null
  expertise: string[] | null
}

interface MembersListProps {
  members: Profile[]
  currentUserId?: string
}

export function MembersList({ members, currentUserId }: MembersListProps) {
  const [connectingId, setConnectingId] = useState<string | null>(null)
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set())

  const handleConnect = async (memberId: string) => {
    if (!currentUserId) return

    setConnectingId(memberId)

    const supabase = createClient()
    const { error } = await supabase.from("connections").insert({
      user_id: currentUserId,
      connected_user_id: memberId,
      status: "pending",
    })

    if (!error) {
      setConnectedIds((prev) => new Set([...prev, memberId]))
    }

    setConnectingId(null)
  }

  if (members.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="size-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground">No members found</h3>
          <p className="text-muted-foreground text-center mt-1">
            Try adjusting your filters to find more members
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {members.map((member) => {
        const initials =
          member.first_name && member.last_name
            ? `${member.first_name[0]}${member.last_name[0]}`
            : "?"

        const isConnected = connectedIds.has(member.id)
        const isConnecting = connectingId === member.id

        return (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                <Avatar className="size-12">
                  <AvatarImage src={member.avatar_url || undefined} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base truncate">
                    <Link
                      href={`/members/${member.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {member.first_name} {member.last_name}
                    </Link>
                  </CardTitle>
                  <CardDescription className="truncate">
                    {member.headline || "Member"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                {member.country && (
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 shrink-0" />
                    <span className="truncate">
                      {member.city ? `${member.city}, ` : ""}
                      {member.country}
                    </span>
                  </div>
                )}
                {member.industry && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="size-4 shrink-0" />
                    <span className="truncate">{member.industry}</span>
                  </div>
                )}
              </div>

              {member.expertise && member.expertise.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {(member.expertise as string[]).slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {(member.expertise as string[]).length > 3 && (
                    <span className="px-2 py-0.5 text-muted-foreground text-xs">
                      +{(member.expertise as string[]).length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/members/${member.id}`}>View Profile</Link>
                </Button>
                <Button
                  size="sm"
                  disabled={isConnecting || isConnected}
                  onClick={() => handleConnect(member.id)}
                >
                  {isConnecting ? (
                    <Spinner size="sm" />
                  ) : isConnected ? (
                    "Requested"
                  ) : (
                    <>
                      <UserPlus className="size-4 mr-1" />
                      Connect
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
