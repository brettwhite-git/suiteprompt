"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FilterOptions, BusinessArea } from "@/types/marketplace"
import { cn } from "@/lib/utils"
import taxonomyData from "@/data/taxonomy.json"

interface FilterBarProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  availableBusinessAreas?: BusinessArea[]
  className?: string
}

export function FilterBar({ filters, onFiltersChange, availableBusinessAreas, className }: FilterBarProps) {
  const [searchValue, setSearchValue] = React.useState(filters.search || "")

  // Get business area display names from taxonomy
  const getBusinessAreaDisplayName = (area: BusinessArea): string => {
    const areaData = taxonomyData.businessAreas[area as keyof typeof taxonomyData.businessAreas]
    return areaData?.displayName || area.charAt(0).toUpperCase() + area.slice(1)
  }

  // Determine which business areas to show
  const businessAreasToShow = React.useMemo(() => {
    if (availableBusinessAreas && availableBusinessAreas.length > 0) {
      return availableBusinessAreas
    }
    // If no availableBusinessAreas provided, show all from taxonomy
    return Object.keys(taxonomyData.businessAreas) as BusinessArea[]
  }, [availableBusinessAreas])

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    onFiltersChange({ ...filters, search: value || undefined })
  }

  const handleBusinessAreaChange = (value: string) => {
    onFiltersChange({ ...filters, businessArea: value === "all" ? undefined : value as FilterOptions["businessArea"] })
  }

  const handleSortChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sortBy: value ? (value as FilterOptions["sortBy"]) : undefined,
    })
  }

  const handleMinRatingChange = (value: string) => {
    onFiltersChange({
      ...filters,
      minRating: value ? parseFloat(value) : undefined,
    })
  }

  const clearFilters = () => {
    setSearchValue("")
    onFiltersChange({})
  }

  const hasActiveFilters = Boolean(
    filters.businessArea || filters.minRating || filters.sortBy || filters.search
  )

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts and skills..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filters.businessArea || "all"} onValueChange={handleBusinessAreaChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Business Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {businessAreasToShow.map((area) => (
                <SelectItem key={area} value={area}>
                  {getBusinessAreaDisplayName(area)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.minRating?.toString() || ""}
            onValueChange={handleMinRatingChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4.5">4.5+ Stars</SelectItem>
              <SelectItem value="4.0">4.0+ Stars</SelectItem>
              <SelectItem value="3.5">3.5+ Stars</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.sortBy || ""} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="downloads">Downloads</SelectItem>
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button variant="outline" size="icon" onClick={clearFilters}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.businessArea && (
            <Badge variant="secondary" className="gap-1">
              Area: {getBusinessAreaDisplayName(filters.businessArea)}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleBusinessAreaChange("all")}
              />
            </Badge>
          )}
          {filters.minRating && (
            <Badge variant="secondary" className="gap-1">
              Rating: {filters.minRating}+
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleMinRatingChange("")}
              />
            </Badge>
          )}
          {filters.sortBy && (
            <Badge variant="secondary" className="gap-1">
              Sort: {filters.sortBy}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleSortChange("")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

