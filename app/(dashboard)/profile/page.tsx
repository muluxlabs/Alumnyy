import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
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
import {
  MapPin,
  Briefcase,
  Languages,
  Globe,
  Edit,
  CheckCircle,
} from "lucide-react"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Get connection count
  const { count: connectionCount } = await supabase
    .from("connections")
    .select("*", { count: "exact", head: true })
    .or(`user_id.eq.${user.id},connected_user_id.eq.${user.id}`)
    .eq("status", "accepted")

  const initials =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name[0]}${profile.last_name[0]}`
      : user.email?.[0]?.toUpperCase() || "U"

  const expertise = (profile?.expertise as string[]) || []
  const languages = (profile?.languages as string[]) || []

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="size-24">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between">
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
                <Button variant="outline" size="sm" asChild>
                  <Link href="/profile/edit">
                    <Edit className="size-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
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
                  <div className="text-xl font-bold text-foreground">
                    {connectionCount || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Connections</div>
                </div>
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
              <p className="text-muted-foreground italic">
                No bio added yet.{" "}
                <Link href="/profile/edit" className="text-primary hover:underline">
                  Add one now
                </Link>
              </p>
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
                No expertise added yet.{" "}
                <Link href="/profile/edit" className="text-primary hover:underline">
                  Add some now
                </Link>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Looking For */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="size-5" />
              What I&apos;m Looking For
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.seeking ? (
              <p className="text-muted-foreground">{profile.seeking}</p>
            ) : (
              <p className="text-muted-foreground italic">
                Not specified.{" "}
                <Link href="/profile/edit" className="text-primary hover:underline">
                  Tell others what you&apos;re looking for
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
