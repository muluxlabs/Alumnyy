import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Clock,
  DollarSign,
  ArrowLeft,
  Calendar,
} from "lucide-react"

const TYPE_LABELS: Record<string, string> = {
  job: "Job",
  internship: "Internship",
  project: "Project",
  partnership: "Partnership",
  consulting: "Consulting",
}

const TYPE_COLORS: Record<string, string> = {
  job: "bg-indigo-500/10 text-indigo-600",
  internship: "bg-teal-500/10 text-teal-600",
  project: "bg-amber-500/10 text-amber-600",
  partnership: "bg-purple-500/10 text-purple-600",
  consulting: "bg-rose-500/10 text-rose-600",
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: opportunity } = await supabase
    .from("opportunities")
    .select(`
      *,
      creator:profiles!creator_id (
        id,
        first_name,
        last_name,
        avatar_url,
        headline
      )
    `)
    .eq("id", id)
    .single()

  if (!opportunity) {
    notFound()
  }

  // Check if user has already applied
  const { data: existingApplication } = user
    ? await supabase
        .from("applications")
        .select("*")
        .eq("opportunity_id", id)
        .eq("applicant_id", user.id)
        .single()
    : { data: null }

  const creatorInitials =
    opportunity.creator?.first_name && opportunity.creator?.last_name
      ? `${opportunity.creator.first_name[0]}${opportunity.creator.last_name[0]}`
      : "?"

  const isCreator = user?.id === opportunity.creator_id

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/opportunities"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Opportunities
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    TYPE_COLORS[opportunity.type] || "bg-muted"
                  }`}
                >
                  {TYPE_LABELS[opportunity.type] || opportunity.type}
                </span>
                {opportunity.status !== "open" && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground">
                    {opportunity.status === "closed" ? "Closed" : "Filled"}
                  </span>
                )}
              </div>
              <CardTitle className="text-2xl">{opportunity.title}</CardTitle>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-4">
                {opportunity.country && (
                  <div className="flex items-center gap-1">
                    <MapPin className="size-4" />
                    {opportunity.city ? `${opportunity.city}, ` : ""}
                    {opportunity.country}
                  </div>
                )}
                {opportunity.industry && (
                  <div className="flex items-center gap-1">
                    <Briefcase className="size-4" />
                    {opportunity.industry}
                  </div>
                )}
                {opportunity.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="size-4" />
                    {opportunity.duration}
                  </div>
                )}
                {opportunity.salary_range && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="size-4" />
                    {opportunity.salary_range}
                    {opportunity.salary_currency &&
                      ` ${opportunity.salary_currency}`}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {opportunity.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Apply Section */}
          {opportunity.status === "open" && !isCreator && (
            <Card>
              <CardHeader>
                <CardTitle>Interested in this opportunity?</CardTitle>
                <CardDescription>
                  {existingApplication
                    ? `You applied on ${new Date(existingApplication.created_at).toLocaleDateString()}`
                    : "Submit your application to express your interest"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {existingApplication ? (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium capitalize">
                      {existingApplication.status}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Application submitted
                    </span>
                  </div>
                ) : (
                  <Button asChild>
                    <Link href={`/opportunities/${id}/apply`}>
                      Apply Now
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Posted By */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Posted By</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/members/${opportunity.creator?.id}`}
                className="flex items-center gap-3 hover:bg-accent rounded-lg p-2 -m-2 transition-colors"
              >
                <Avatar className="size-12">
                  <AvatarImage
                    src={opportunity.creator?.avatar_url || undefined}
                  />
                  <AvatarFallback>{creatorInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">
                    {opportunity.creator?.first_name}{" "}
                    {opportunity.creator?.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {opportunity.creator?.headline || "Member"}
                  </p>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Posted:</span>
                <span className="text-foreground">
                  {new Date(opportunity.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Type:</span>
                <span className="text-foreground capitalize">
                  {opportunity.type}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Status:</span>
                <span className="text-foreground capitalize">
                  {opportunity.status}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
