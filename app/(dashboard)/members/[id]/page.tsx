import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  MapPin,
  Briefcase,
  Languages,
  Globe,
  CheckCircle,
  MessageSquare,
  UserPlus,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { ConnectButton } from "@/components/members/connect-button"
import { MessageButton } from "@/components/members/message-button"

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single()

  if (!profile) {
    notFound()
  }

  // Check if already connected
  const { data: existingConnection } = await supabase
    .from("connections")
    .select("*")
    .or(
      `and(user_id.eq.${user?.id},connected_user_id.eq.${id}),and(user_id.eq.${id},connected_user_id.eq.${user?.id})`
    )
    .single()

  const initials =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name[0]}${profile.last_name[0]}`
      : "?"

  const expertise = (profile?.expertise as string[]) || []
  const languages = (profile?.languages as string[]) || []

  const isOwnProfile = user?.id === id

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/members"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Members
        </Link>
      </div>

      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="size-24">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-foreground">
                      {profile?.first_name} {profile?.last_name}
                    </h1>
                    {profile?.verified && (
                      <CheckCircle className="size-5 text-primary" />
                    )}
                  </div>
                  <p className="text-muted-foreground">{profile?.headline}</p>
                </div>

                {!isOwnProfile && (
                  <div className="flex gap-2">
                    <MessageButton
                      recipientId={id}
                      recipientName={`${profile.first_name} ${profile.last_name}`}
                    />
                    <ConnectButton
                      targetUserId={id}
                      currentUserId={user?.id}
                      existingConnection={existingConnection}
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                {profile?.city && profile?.country && (
                  <div className="flex items-center gap-1">
                    <MapPin className="size-4" />
                    {profile.city}, {profile.country}
                  </div>
                )}
                {profile?.industry && (
                  <div className="flex items-center gap-1">
                    <Briefcase className="size-4" />
                    {profile.industry}
                  </div>
                )}
                {languages.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Languages className="size-4" />
                    {languages.join(", ")}
                  </div>
                )}
              </div>

              <div className="flex gap-6 mt-4 pt-4 border-t">
                <div>
                  <div className="text-xl font-bold text-foreground capitalize">
                    {profile?.profile_type || "Member"}
                  </div>
                  <div className="text-sm text-muted-foreground">Member Type</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.bio ? (
              <p className="text-muted-foreground whitespace-pre-wrap">
                {profile.bio}
              </p>
            ) : (
              <p className="text-muted-foreground italic">No bio available.</p>
            )}
          </CardContent>
        </Card>

        {/* Expertise */}
        <Card>
          <CardHeader>
            <CardTitle>Expertise</CardTitle>
            <CardDescription>Skills and areas of knowledge</CardDescription>
          </CardHeader>
          <CardContent>
            {expertise.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {expertise.map((skill: string) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                No expertise listed.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Looking For */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="size-5" />
              What They&apos;re Looking For
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.seeking ? (
              <p className="text-muted-foreground">{profile.seeking}</p>
            ) : (
              <p className="text-muted-foreground italic">Not specified.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
