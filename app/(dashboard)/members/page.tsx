import { createClient } from "@/lib/supabase/server"
import { MembersList } from "@/components/members/members-list"
import { MembersFilters } from "@/components/members/members-filters"

interface SearchParams {
  country?: string
  industry?: string
  type?: string
  search?: string
}

export default async function MembersPage({
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
    .from("profiles")
    .select("*")
    .eq("visibility", "public")
    .neq("id", user?.id)
    .order("created_at", { ascending: false })

  // Apply filters
  if (params.country) {
    query = query.ilike("country", `%${params.country}%`)
  }
  if (params.industry) {
    query = query.eq("industry", params.industry)
  }
  if (params.type) {
    query = query.eq("profile_type", params.type)
  }
  if (params.search) {
    query = query.or(
      `first_name.ilike.%${params.search}%,last_name.ilike.%${params.search}%,headline.ilike.%${params.search}%`
    )
  }

  const { data: members } = await query.limit(50)

  // Get unique countries and industries for filters
  const { data: allProfiles } = await supabase
    .from("profiles")
    .select("country, industry")
    .eq("visibility", "public")

  const countries = [...new Set(allProfiles?.map((p) => p.country).filter(Boolean))]
  const industries = [...new Set(allProfiles?.map((p) => p.industry).filter(Boolean))]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Discover Members</h1>
        <p className="text-muted-foreground mt-1">
          Connect with international professionals from around the world
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <MembersFilters
            countries={countries as string[]}
            industries={industries as string[]}
            currentFilters={params}
          />
        </div>

        {/* Members Grid */}
        <div className="flex-1">
          <MembersList members={members || []} currentUserId={user?.id} />
        </div>
      </div>
    </div>
  )
}
