import { createClient } from "@/lib/supabase/server"
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
import { Lightbulb, Users, Clock, Check, X } from "lucide-react"
import { MentorshipRequestActions } from "@/components/mentorship/request-actions"

export default async function MentorshipPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch mentorship requests where user is mentor or mentee
  const { data: askedRequests } = await supabase
    .from("mentorship_requests")
    .select(`
      *,
      mentor:profiles!mentor_id (
        id,
        first_name,
        last_name,
        avatar_url,
        headline,
        country
      )
    `)
    .eq("mentee_id", user?.id)
    .order("created_at", { ascending: false })

  const { data: receivedRequests } = await supabase
    .from("mentorship_requests")
    .select(`
      *,
      mentee:profiles!mentee_id (
        id,
        first_name,
        last_name,
        avatar_url,
        headline,
        country
      )
    `)
    .eq("mentor_id", user?.id)
    .order("created_at", { ascending: false })

  // Get potential mentors (professionals with expertise)
  const { data: potentialMentors } = await supabase
    .from("profiles")
    .select("*")
    .neq("id", user?.id)
    .in("profile_type", ["professional", "business"])
    .eq("visibility", "public")
    .not("expertise", "eq", "[]")
    .limit(6)

  const pendingReceived =
    receivedRequests?.filter((r) => r.status === "pending") || []
  const activeRequests = [
    ...(askedRequests?.filter((r) => r.status === "accepted") || []),
    ...(receivedRequests?.filter((r) => r.status === "accepted") || []),
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Mentorship Hub</h1>
        <p className="text-muted-foreground mt-1">
          Connect with experienced professionals for guidance and growth
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Pending Requests (as Mentor) */}
          {pendingReceived.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="size-5 text-amber-500" />
                  Mentorship Requests
                </CardTitle>
                <CardDescription>
                  People who want you as their mentor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingReceived.map((request) => {
                  const mentee = request.mentee
                  const initials =
                    mentee?.first_name && mentee?.last_name
                      ? `${mentee.first_name[0]}${mentee.last_name[0]}`
                      : "?"

                  return (
                    <div
                      key={request.id}
                      className="flex items-start gap-4 p-4 rounded-lg border bg-card"
                    >
                      <Avatar className="size-12">
                        <AvatarImage src={mentee?.avatar_url || undefined} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Link
                          href={`/members/${mentee?.id}`}
                          className="font-medium text-foreground hover:text-primary"
                        >
                          {mentee?.first_name} {mentee?.last_name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {mentee?.headline || "Member"}
                        </p>
                        <p className="text-sm mt-2">
                          <span className="font-medium">Topic:</span>{" "}
                          {request.topic}
                        </p>
                        {request.message && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {request.message}
                          </p>
                        )}
                        <MentorshipRequestActions
                          requestId={request.id}
                          className="mt-3"
                        />
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}

          {/* Active Mentorships */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-5 text-teal-500" />
                Active Mentorships
              </CardTitle>
              <CardDescription>
                Your ongoing mentorship connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeRequests.length > 0 ? (
                <div className="space-y-4">
                  {activeRequests.map((request) => {
                    const isMentor = request.mentor_id === user?.id
                    const otherPerson = isMentor ? request.mentee : request.mentor
                    const initials =
                      otherPerson?.first_name && otherPerson?.last_name
                        ? `${otherPerson.first_name[0]}${otherPerson.last_name[0]}`
                        : "?"

                    return (
                      <div
                        key={request.id}
                        className="flex items-center gap-4 p-4 rounded-lg border"
                      >
                        <Avatar className="size-12">
                          <AvatarImage
                            src={otherPerson?.avatar_url || undefined}
                          />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Link
                            href={`/members/${otherPerson?.id}`}
                            className="font-medium text-foreground hover:text-primary"
                          >
                            {otherPerson?.first_name} {otherPerson?.last_name}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {isMentor ? "Your mentee" : "Your mentor"}
                          </p>
                          <p className="text-sm mt-1">
                            <span className="font-medium">Topic:</span>{" "}
                            {request.topic}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/messages?to=${otherPerson?.id}`}>
                            Message
                          </Link>
                        </Button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lightbulb className="size-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No active mentorships yet
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Request mentorship from experienced professionals below
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Requests */}
          {askedRequests && askedRequests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>My Mentorship Requests</CardTitle>
                <CardDescription>
                  Requests you&apos;ve sent to potential mentors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {askedRequests
                  .filter((r) => r.status !== "accepted")
                  .map((request) => {
                    const mentor = request.mentor
                    const initials =
                      mentor?.first_name && mentor?.last_name
                        ? `${mentor.first_name[0]}${mentor.last_name[0]}`
                        : "?"

                    return (
                      <div
                        key={request.id}
                        className="flex items-center gap-4 p-4 rounded-lg border"
                      >
                        <Avatar className="size-10">
                          <AvatarImage src={mentor?.avatar_url || undefined} />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Link
                            href={`/members/${mentor?.id}`}
                            className="font-medium text-foreground hover:text-primary"
                          >
                            {mentor?.first_name} {mentor?.last_name}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            Topic: {request.topic}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            request.status === "pending"
                              ? "bg-amber-500/10 text-amber-600"
                              : request.status === "rejected"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
                    )
                  })}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Find Mentors */}
        <div>
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
            <CardContent className="space-y-4">
              {potentialMentors && potentialMentors.length > 0 ? (
                potentialMentors.map((mentor) => {
                  const initials =
                    mentor.first_name && mentor.last_name
                      ? `${mentor.first_name[0]}${mentor.last_name[0]}`
                      : "?"
                  const expertise = (mentor.expertise as string[]) || []

                  return (
                    <div
                      key={mentor.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <Avatar className="size-10">
                        <AvatarImage src={mentor.avatar_url || undefined} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/members/${mentor.id}`}
                          className="font-medium text-foreground hover:text-primary text-sm"
                        >
                          {mentor.first_name} {mentor.last_name}
                        </Link>
                        <p className="text-xs text-muted-foreground truncate">
                          {mentor.headline || mentor.country || "Professional"}
                        </p>
                        {expertise.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {expertise.slice(0, 2).map((skill) => (
                              <span
                                key={skill}
                                className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No mentors available yet
                </p>
              )}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/members?type=professional">
                  Browse All Professionals
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
