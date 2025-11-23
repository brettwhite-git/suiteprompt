"use client"

import * as React from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FilterOptions } from "@/types/marketplace"
import { cn } from "@/lib/utils"

interface FilterBarProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  className?: string
}

export function FilterBar({ filters, onFiltersChange, className }: FilterBarProps) {
  const [searchValue, setSearchValue] = React.useState(filters.search || "")

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    onFiltersChange({ ...filters, search: value || undefined })
  }

  const handleCategoryChange = (value: string) => {
    onFiltersChange({ ...filters, category: value === "all" ? undefined : value })
  }

  const handleSortChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sortBy: value as FilterOptions["sortBy"],
    })
  }

  const handleMinRatingChange = (value: string) => {
    onFiltersChange({
      ...filters,
      minRating: value === "all" ? undefined : parseFloat(value),
    })
  }

  const clearFilters = () => {
    setSearchValue("")
    onFiltersChange({})
  }

  const hasActiveFilters = Boolean(
    filters.category || filters.minRating || filters.sortBy || filters.search
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
          <Select value={filters.category || "all"} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="prompt-studio">Prompt Studio</SelectItem>
              <SelectItem value="advisor">Advisor</SelectItem>
              <SelectItem value="mcp">MCP</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.minRating?.toString() || "all"}
            onValueChange={handleMinRatingChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="4.5">4.5+ Stars</SelectItem>
              <SelectItem value="4.0">4.0+ Stars</SelectItem>
              <SelectItem value="3.5">3.5+ Stars</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.sortBy || "popularity"} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularity</SelectItem>
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
          {filters.category && (
            <Badge variant="secondary" className="gap-1">
              Category: {filters.category}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleCategoryChange("all")}
              />
            </Badge>
          )}
          {filters.minRating && (
            <Badge variant="secondary" className="gap-1">
              Rating: {filters.minRating}+
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleMinRatingChange("all")}
              />
            </Badge>
          )}
          {filters.sortBy && (
            <Badge variant="secondary" className="gap-1">
              Sort: {filters.sortBy}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleSortChange("popularity")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

