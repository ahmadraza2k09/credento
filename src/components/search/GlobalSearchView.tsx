import React, { useState, useMemo } from "react"
import {
  Search,
  Users,
  Briefcase,
  FileText,
  Building,
  MapPin,
  Clock,
  ArrowRight,
  ExternalLink,
} from "lucide-react"
import { Opportunity, Post, StudentProfile } from "../../types"
import { OpportunityCategoryBadge } from "../common/Badge"

interface GlobalSearchViewProps {
  initialQuery: string
  initialCategory: string
  allStudents: StudentProfile[]
  allOpportunities: Opportunity[]
  allPosts: Post[]
  onSelectStudentProfile: (userId: string) => void
  onSelectOpportunity: (opportunity: Opportunity) => void
  onNavigateToTab: (tab: any) => void
}

export function GlobalSearchView({
  initialQuery,
  initialCategory,
  allStudents,
  allOpportunities,
  allPosts,
  onSelectStudentProfile,
  onSelectOpportunity,
  onNavigateToTab,
}: GlobalSearchViewProps) {
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] =
    useState<"all" | "students" | "opportunities" | "posts">(
      initialCategory as any || "all",
    )

  const normalizedQuery = query.toLowerCase().trim()

  // Matching students
  const matchingStudents = useMemo(() => {
    if (!normalizedQuery) return allStudents
    return allStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(normalizedQuery) ||
        s.headline.toLowerCase().includes(normalizedQuery) ||
        s.institution.toLowerCase().includes(normalizedQuery) ||
        s.location.toLowerCase().includes(normalizedQuery) ||
        s.skills?.some((sk) => sk.toLowerCase().includes(normalizedQuery)) ||
        s.interests?.some((i) => i.toLowerCase().includes(normalizedQuery)),
    )
  }, [allStudents, normalizedQuery])

  // Matching opportunities
  const matchingOpportunities = useMemo(() => {
    if (!normalizedQuery) return allOpportunities
    return allOpportunities.filter(
      (o) =>
        o.title.toLowerCase().includes(normalizedQuery) ||
        o.provider.toLowerCase().includes(normalizedQuery) ||
        o.description.toLowerCase().includes(normalizedQuery) ||
        o.location.toLowerCase().includes(normalizedQuery) ||
        o.category.toLowerCase().includes(normalizedQuery),
    )
  }, [allOpportunities, normalizedQuery])

  // Matching posts
  const matchingPosts = useMemo(() => {
    if (!normalizedQuery) return allPosts
    return allPosts.filter(
      (p) =>
        p.content.toLowerCase().includes(normalizedQuery) ||
        p.authorName.toLowerCase().includes(normalizedQuery) ||
        p.authorInstitution.toLowerCase().includes(normalizedQuery),
    )
  }, [allPosts, normalizedQuery])

  const totalResults =
    (category === "all" || category === "students"
      ? matchingStudents.length
      : 0) +
    (category === "all" || category === "opportunities"
      ? matchingOpportunities.length
      : 0) +
    (category === "all" || category === "posts" ? matchingPosts.length : 0)

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-5 py-5 sm:py-8 space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-[2px] border border-[#cbd3ce] p-5">
        <h1 className="text-xl font-bold text-[#173a35] tracking-tight mb-3">
          Global Academic Search
        </h1>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#728078] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search across students, research papers, and opportunities..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#f7f5ef] border border-[#cbd3ce] rounded-[2px] focus:outline-none focus:border-[#173a35] text-[#242b29]"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(["all", "students", "opportunities", "posts"] as const).map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`text-xs capitalize px-3 py-2 rounded-[2px] border font-medium transition-colors whitespace-nowrap ${
                    category === cat
                      ? "bg-[#173a35] text-white border-[#173a35]"
                      : "bg-[#f7f5ef] text-[#62736b] border-[#cbd3ce] hover:text-[#173a35]"
                  }`}
                >
                  {cat === "all" ? "All Results" : cat}
                </button>
              ),
            )}
          </div>
        </div>

        <p className="text-xs text-[#62736b] mt-3">
          Found{" "}
          <strong className="text-[#173a35] font-mono">{totalResults}</strong>{" "}
          result{totalResults === 1 ? "" : "s"}{" "}
          {query ? `for "${query}"` : "across Credento"}
        </p>
      </div>

      {totalResults === 0 ? (
        <div className="bg-white rounded-[2px] border border-[#cbd3ce] p-10 text-center text-[#62736b]">
          <Search className="w-8 h-8 text-[#87978f] mx-auto mb-2 opacity-50" />
          <p className="font-bold text-sm text-[#173a35]">
            No matching items found
          </p>
          <p className="text-xs mt-1 max-w-sm mx-auto">
            Try searching for broader keywords like "PyTorch", "Stanford",
            "Scholarship", or "Fellowship".
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Students section */}
          {(category === "all" || category === "students") &&
            matchingStudents.length > 0 && (
              <div className="bg-white rounded-[2px] border border-[#cbd3ce] p-5">
                <h2 className="font-bold text-xs uppercase tracking-wider text-[#173a35] mb-3 flex items-center justify-between">
                  <span>Students ({matchingStudents.length})</span>
                  {category === "all" && (
                    <button
                      type="button"
                      onClick={() => setCategory("students")}
                      className="text-[#c46b4b] hover:underline"
                    >
                      View all students →
                    </button>
                  )}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {matchingStudents
                    .slice(0, category === "all" ? 4 : 20)
                    .map((student) => (
                      <div
                        key={student.id}
                        onClick={() => onSelectStudentProfile(student.id)}
                        className="p-3 bg-[#f7f5ef] rounded-[2px] border border-[#e2e8e3] hover:border-[#173a35] cursor-pointer transition-colors flex items-start gap-3"
                      >
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-10 h-10 rounded-[2px] object-cover border border-[#cbd3ce] shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-xs text-[#173a35] truncate">
                            {student.name}
                          </p>
                          <p className="text-[11px] text-[#62736b] truncate mt-0.5">
                            {student.headline}
                          </p>
                          <p className="text-[10px] text-[#728078] mt-1 font-medium">
                            {student.institution}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

          {/* Opportunities section */}
          {(category === "all" || category === "opportunities") &&
            matchingOpportunities.length > 0 && (
              <div className="bg-white rounded-[2px] border border-[#cbd3ce] p-5">
                <h2 className="font-bold text-xs uppercase tracking-wider text-[#173a35] mb-3 flex items-center justify-between">
                  <span>Opportunities ({matchingOpportunities.length})</span>
                  {category === "all" && (
                    <button
                      type="button"
                      onClick={() => setCategory("opportunities")}
                      className="text-[#c46b4b] hover:underline"
                    >
                      View all opportunities →
                    </button>
                  )}
                </h2>

                <div className="space-y-3">
                  {matchingOpportunities
                    .slice(0, category === "all" ? 3 : 20)
                    .map((opp) => (
                      <div
                        key={opp.id}
                        onClick={() => onSelectOpportunity(opp)}
                        className="p-3.5 bg-[#f7f5ef] rounded-[2px] border border-[#e2e8e3] hover:border-[#173a35] cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <OpportunityCategoryBadge
                                category={opp.category}
                              />
                              <span className="text-[10px] font-mono text-[#62736b]">
                                {opp.mode}
                              </span>
                            </div>
                            <h3 className="font-bold text-xs sm:text-sm text-[#173a35]">
                              {opp.title}
                            </h3>
                            <p className="text-[11px] text-[#62736b] mt-0.5">
                              {opp.provider} • {opp.location}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] text-[#a33e32] font-mono block">
                              Deadline: {opp.deadline}
                            </span>
                            <span className="text-xs font-semibold text-[#173a35] hover:underline mt-1 inline-flex items-center gap-0.5">
                              <span>View Details</span>
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

          {/* Posts section */}
          {(category === "all" || category === "posts") &&
            matchingPosts.length > 0 && (
              <div className="bg-white rounded-[2px] border border-[#cbd3ce] p-5">
                <h2 className="font-bold text-xs uppercase tracking-wider text-[#173a35] mb-3 flex items-center justify-between">
                  <span>Posts & Discussions ({matchingPosts.length})</span>
                  {category === "all" && (
                    <button
                      type="button"
                      onClick={() => setCategory("posts")}
                      className="text-[#c46b4b] hover:underline"
                    >
                      View all posts →
                    </button>
                  )}
                </h2>

                <div className="space-y-3">
                  {matchingPosts
                    .slice(0, category === "all" ? 3 : 20)
                    .map((post) => (
                      <div
                        key={post.id}
                        className="p-3.5 bg-[#f7f5ef] rounded-[2px] border border-[#e2e8e3]"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <img
                            src={post.authorAvatar}
                            alt={post.authorName}
                            className="w-6 h-6 rounded-[2px] object-cover"
                          />
                          <span className="font-semibold text-xs text-[#173a35]">
                            {post.authorName}
                          </span>
                          <span className="text-[10px] text-[#728078]">
                            • {post.createdAt}
                          </span>
                        </div>
                        <p className="text-xs text-[#242b29] line-clamp-3 leading-relaxed">
                          {post.content}
                        </p>
                        <button
                          type="button"
                          onClick={() => onNavigateToTab("feed")}
                          className="mt-2 text-xs text-[#173a35] font-semibold hover:underline"
                        >
                          View on Home Feed →
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  )
}
