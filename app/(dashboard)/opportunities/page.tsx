import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Plus, MapPin, Clock, DollarSign, Briefcase } from "lucide-react"
import { OpportunityFilters } from "@/components/opportunities/opportunity-filters"

interface SearchParams {
  type?: string
  country?: string
  industry?: string
}

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

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Build query
  let query = supabase
    .from("opportunities")
    .select(`
      *,
      creator:profiles!creator_id (
        id,
        first_name,
        last_name,
        avatar_url
      )
    `)
    .eq("status", "open")
    .order("created_at", { ascending: false })

  // Apply filters
  if (params.type) {
    query = query.eq("type", params.type)
  }
  if (params.country) {
    query = query.ilike("country", `%${params.country}%`)
  }
  if (params.industry) {
    query = query.eq("industry", params.industry)
  }

  const { data: opportunities } = await query.limit(50)

  // Get unique values for filters
  const { data: allOpportunities } = await supabase
    .from("opportunities")
    .select("country, industry")
    .eq("status", "open")

  const countries = [
    ...new Set(allOpportunities?.map((o) => o.country).filter(Boolean)),
  ]
  const industries = [
    ...new Set(allOpportunities?.map((o) => o.industry).filter(Boolean)),
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Opportunities</h1>
          <p className="text-muted-foreground mt-1">
            Discover jobs, partnerships, and projects worldwide
          </p>
        </div>
        <Button asChild>
          <Link href="/opportunities/new">
            <Plus className="size-4 mr-2" />
            Post Opportunity
          </Link>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <div className="w-full lg:w-64 shrink-0">
          <OpportunityFilters
            countries={countries as string[]}
            industries={industries as string[]}
            currentFilters={params}
          />
        </div>

        {/* Opportunities List */}
        <div className="flex-1 space-y-4">
          {opportunities && opportunities.length > 0 ? (
            opportunities.map((opportunity) => (
              <Card
                key={opportunity.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            TYPE_COLORS[opportunity.type] || "bg-muted"
                          }`}
                        >
                          {TYPE_LABELS[opportunity.type] || opportunity.type}
                        </span>
                      </div>
                      <CardTitle className="text-lg">
                        <Link
                          href={`/opportunities/${opportunity.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {opportunity.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Posted by{" "}
                        <Link
                          href={`/members/${opportunity.creator?.id}`}
                          className="text-primary hover:underline"
                        >
                          {opportunity.creator?.first_name}{" "}
                          {opportunity.creator?.last_name}
                        </Link>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {opportunity.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {opportunity.country && (
                      <div className="flex items-center gap-1">
                        <MapPin className="size-4" />
                        {opportunity.city
                          ? `${opportunity.city}, `
                          : ""}
                        {opportunity.country}
                      </div>
                    )}
                    {opportunity.industry && (
                      <div className="flex items-center gap-1">
                        <Briefcase className="size-4" />
                        {opportunity.industry}
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
                    {opportunity.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="size-4" />
                        {opportunity.duration}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/opportunities/${opportunity.id}`}>
                        View Details
                      </Link>
                    </Button>
                    {user && user.id !== opportunity.creator_id && (
                      <Button size="sm" asChild>
                        <Link href={`/opportunities/${opportunity.id}/apply`}>
                          Apply Now
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Briefcase className="size-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground">
                  No opportunities found
                </h3>
                <p className="text-muted-foreground text-center mt-1 mb-4">
                  Be the first to post an opportunity
                </p>
                <Button asChild>
                  <Link href="/opportunities/new">
                    <Plus className="size-4 mr-2" />
                    Post Opportunity
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
