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
import { Plus, Globe, MapPin, Calendar, TrendingUp } from "lucide-react"

interface SearchParams {
  country?: string
  industry?: string
}

export default async function InsightsPage({
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
    .from("market_insights")
    .select(`
      *,
      creator:profiles!creator_id (
        id,
        first_name,
        last_name,
        avatar_url,
        country
      )
    `)
    .eq("visibility", "public")
    .order("created_at", { ascending: false })

  if (params.country) {
    query = query.ilike("country", `%${params.country}%`)
  }
  if (params.industry) {
    query = query.eq("industry", params.industry)
  }

  const { data: insights } = await query.limit(50)

  // Get unique countries for filter
  const { data: allInsights } = await supabase
    .from("market_insights")
    .select("country, industry")
    .eq("visibility", "public")

  const countries = [
    ...new Set(allInsights?.map((i) => i.country).filter(Boolean)),
  ]
  const industries = [
    ...new Set(allInsights?.map((i) => i.industry).filter(Boolean)),
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Market Insights</h1>
          <p className="text-muted-foreground mt-1">
            Local market intelligence from global professionals
          </p>
        </div>
        <Button asChild>
          <Link href="/insights/new">
            <Plus className="size-4 mr-2" />
            Share Insight
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <select
          className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
          defaultValue={params.country || ""}
          onChange={(e) => {
            const url = new URL(window.location.href)
            if (e.target.value) {
              url.searchParams.set("country", e.target.value)
            } else {
              url.searchParams.delete("country")
            }
            window.location.href = url.toString()
          }}
        >
          <option value="">All Countries</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <select
          className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
          defaultValue={params.industry || ""}
          onChange={(e) => {
            const url = new URL(window.location.href)
            if (e.target.value) {
              url.searchParams.set("industry", e.target.value)
            } else {
              url.searchParams.delete("industry")
            }
            window.location.href = url.toString()
          }}
        >
          <option value="">All Industries</option>
          {industries.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
      </div>

      {/* Insights Grid */}
      {insights && insights.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((insight) => {
            const creator = insight.creator
            const initials =
              creator?.first_name && creator?.last_name
                ? `${creator.first_name[0]}${creator.last_name[0]}`
                : "?"
            const tags = (insight.tags as string[]) || []

            return (
              <Card key={insight.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="size-4" />
                    {insight.country}
                    {insight.industry && (
                      <>
                        <span>•</span>
                        {insight.industry}
                      </>
                    )}
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    <Link
                      href={`/insights/${insight.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {insight.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {insight.content}
                  </p>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <Link
                      href={`/members/${creator?.id}`}
                      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                      <Avatar className="size-6">
                        <AvatarImage src={creator?.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        {creator?.first_name} {creator?.last_name}
                      </span>
                    </Link>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(insight.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TrendingUp className="size-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">
              No insights yet
            </h3>
            <p className="text-muted-foreground text-center mt-1 mb-4">
              Be the first to share market intelligence
            </p>
            <Button asChild>
              <Link href="/insights/new">
                <Plus className="size-4 mr-2" />
                Share Insight
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
