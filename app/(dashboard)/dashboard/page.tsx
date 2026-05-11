import { createClient } from "@/lib/supabase/server"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Users,
  Briefcase,
  MessageSquare,
  Lightbulb,
  Globe,
  ArrowRight,
} from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single()

  // Fetch stats
  const [
    { count: connectionsCount },
    { count: opportunitiesCount },
    { count: messagesCount },
    { count: mentorshipCount },
  ] = await Promise.all([
    supabase
      .from("connections")
      .select("*", { count: "exact", head: true })
      .or(`user_id.eq.${user?.id},connected_user_id.eq.${user?.id}`)
      .eq("status", "accepted"),
    supabase
      .from("opportunities")
      .select("*", { count: "exact", head: true })
      .eq("status", "open"),
    supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("recipient_id", user?.id)
      .eq("read", false),
    supabase
      .from("mentorship_requests")
      .select("*", { count: "exact", head: true })
      .or(`mentee_id.eq.${user?.id},mentor_id.eq.${user?.id}`)
      .eq("status", "pending"),
  ])

  const isProfileComplete =
    profile?.first_name &&
    profile?.last_name &&
    profile?.country &&
    profile?.industry

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back
          {profile?.first_name ? `, ${profile.first_name}` : ""}!
        </h1>
        <p className="text-muted-foreground mt-1">
          {"Here's what's happening in your network"}
        </p>
      </div>

      {/* Profile Completion Banner */}
      {!isProfileComplete && (
        <Card className="mb-8 border-primary/50 bg-primary/5">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Globe className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  Complete your profile
                </p>
                <p className="text-sm text-muted-foreground">
                  Add your location and expertise to connect with the right
                  people
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/profile/edit">
                Complete Profile
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Connections
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectionsCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Global professionals in your network
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Opportunities
            </CardTitle>
            <Briefcase className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{opportunitiesCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Open opportunities available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Messages
            </CardTitle>
            <MessageSquare className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messagesCount || 0}</div>
            <p className="text-xs text-muted-foreground">Unread messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mentorship
            </CardTitle>
            <Lightbulb className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mentorshipCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Pending mentorship requests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5 text-indigo-500" />
              Discover Members
            </CardTitle>
            <CardDescription>
              Find and connect with international professionals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link href="/members">
                Browse Members
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="size-5 text-teal-500" />
              Opportunities
            </CardTitle>
            <CardDescription>
              Explore jobs, partnerships, and projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link href="/opportunities">
                View Opportunities
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="size-5 text-amber-500" />
              Find a Mentor
            </CardTitle>
            <CardDescription>
              Connect with experienced professionals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link href="/mentorship">
                Explore Mentorship
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
