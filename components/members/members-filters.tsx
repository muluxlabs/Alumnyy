"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, X } from "lucide-react"
import { useState, useCallback } from "react"

interface MembersFiltersProps {
  countries: string[]
  industries: string[]
  currentFilters: {
    country?: string
    industry?: string
    type?: string
    search?: string
  }
}

const PROFILE_TYPES = [
  { value: "", label: "All Types" },
  { value: "student", label: "Student" },
  { value: "graduate", label: "Graduate" },
  { value: "professional", label: "Professional" },
  { value: "business", label: "Business Owner" },
]

export function MembersFilters({
  countries,
  industries,
  currentFilters,
}: MembersFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(currentFilters.search || "")

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`/members?${params.toString()}`)
    },
    [router, searchParams]
  )

  const handleSearch = () => {
    updateFilter("search", search)
  }

  const clearFilters = () => {
    router.push("/members")
    setSearch("")
  }

  const hasFilters =
    currentFilters.country ||
    currentFilters.industry ||
    currentFilters.type ||
    currentFilters.search

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="flex gap-2">
            <Input
              id="search"
              placeholder="Name or headline..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button size="icon" variant="outline" onClick={handleSearch}>
              <Search className="size-4" />
            </Button>
          </div>
        </div>

        {/* Country */}
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <select
            id="country"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={currentFilters.country || ""}
            onChange={(e) => updateFilter("country", e.target.value)}
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Industry */}
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <select
            id="industry"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={currentFilters.industry || ""}
            onChange={(e) => updateFilter("industry", e.target.value)}
          >
            <option value="">All Industries</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        {/* Profile Type */}
        <div className="space-y-2">
          <Label htmlFor="type">Member Type</Label>
          <select
            id="type"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={currentFilters.type || ""}
            onChange={(e) => updateFilter("type", e.target.value)}
          >
            {PROFILE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {hasFilters && (
          <Button
            variant="outline"
            className="w-full"
            onClick={clearFilters}
          >
            <X className="size-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
