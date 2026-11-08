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
  ShieldCheck,
  FolderGit2,
} from "lucide-react"
import {
  AccessCenterOrganization,
  Opportunity,
  Post,
  StudentProfile,
} from "../../types"
import { OpportunityCategoryBadge } from "../common/Badge"

interface GlobalSearchViewProps {
  initialQuery: string
  initialCategory: string
  allStudents: StudentProfile[]
  allOpportunities: Opportunity[]
  allPosts: Post[]
  allCenters?: AccessCenterOrganization[]
  onSelectStudentProfile: (userId: string) => void
  onSelectOpportunity: (opportunity: Opportunity) => void
  onSelectAccessCenter?: (center: AccessCenterOrganization) => void
  onNavigateToTab: (tab: any) => void
}

export function GlobalSearchView({
  initialQuery,
  initialCategory,
  allStudents,
  allOpportunities,
  allPosts,
  allCenters = [],
  onSelectStudentProfile,
  onSelectOpportunity,
  onSelectAccessCenter,
  onNavigateToTab,
}: GlobalSearchViewProps) {
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] =
    useState<"all" | "students" | "opportunities" | "centers" | "posts">(
      initialCategory as any || "all",
    )

  const normalizedQuery = query.toLowerCase().trim()

  // Matching students (respecting privacy: if private and not connected, headline/institution might still be public or filtered)
  const matchingStudents = useMemo(() => {
    if (!normalizedQuery) return allStudents
    return allStudents.filter(
      (s) =>
        (s.name || "").toLowerCase().includes(normalizedQuery) ||
        (s.username || "").toLowerCase().includes(normalizedQuery) ||
        (s.headline || "").toLowerCase().includes(normalizedQuery) ||
        (s.institution || "").toLowerCase().includes(normalizedQuery) ||
        (s.location || "").toLowerCase().includes(normalizedQuery) ||
        s.skills?.some((sk) =>
          (sk || "").toLowerCase().includes(normalizedQuery),
        ) ||
        s.interests?.some((i) =>
          (i || "").toLowerCase().includes(normalizedQuery),
        ) ||
        s.portfolioItems?.some((p) =>
          (p.title || "").toLowerCase().includes(normalizedQuery),
        ),
    )
  }, [allStudents, normalizedQuery])

  // Matching opportunities
  const matchingOpportunities = useMemo(() => {
    if (!normalizedQuery) return allOpportunities
    return allOpportunities.filter(
      (o) =>
        (o.title || "").toLowerCase().includes(normalizedQuery) ||
        (o.provider || "").toLowerCase().includes(normalizedQuery) ||
        (o.description || "").toLowerCase().includes(normalizedQuery) ||
        (o.location || "").toLowerCase().includes(normalizedQuery) ||
        (o.category || "").toLowerCase().includes(normalizedQuery),
    )
  }, [allOpportunities, normalizedQuery])

  // Matching access centers
  const matchingCenters = useMemo(() => {
    const approved = allCenters.filter((c) => c.status === "approved")
    if (!normalizedQuery) return approved
    return approved.filter(
      (c) =>
        (c.name || "").toLowerCase().includes(normalizedQuery) ||
        (c.tagline || "").toLowerCase().includes(normalizedQuery) ||
        (c.description || "").toLowerCase().includes(normalizedQuery) ||
        c.services?.some(
          (s) =>
            (s.title || "").toLowerCase().includes(normalizedQuery) ||
            (s.description || "").toLowerCase().includes(normalizedQuery),
        ),
    )
  }, [allCenters, normalizedQuery])

  // Matching posts
  const matchingPosts = useMemo(() => {
    if (!normalizedQuery) return allPosts
    return allPosts.filter(
      (p) =>
        (p.content || "").toLowerCase().includes(normalizedQuery) ||
        (p.authorName || "").toLowerCase().includes(normalizedQuery) ||
        (p.authorInstitution || "").toLowerCase().includes(normalizedQuery),
    )
  }, [allPosts, normalizedQuery])

  const totalResults =
    (category === "all" || category === "students"
      ? matchingStudents.length
      : 0) +
    (category === "all" || category === "opportunities"
      ? matchingOpportunities.length
      : 0) +
    (category === "all" || category === "centers"
      ? matchingCenters.length
      : 0) +
    (category === "all" || category === "posts" ? matchingPosts.length : 0)

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-5 py-5 sm:py-8 space-y-6">
      {/* Search Header */}
      <div className="card-linkedin p-6 sm:p-7">
        <h1 className="text-2xl font-bold text-[#173a35] tracking-tight mb-3.5">
          Global Academic Search
        </h1>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#62736b] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search students, skills, institutions, grants, Access Centers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#f8faf9] rounded-xl text-xs text-[#242b29] border border-black/[0.06] focus:outline-none focus:border-[#173a35] focus:bg-white transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full sm:w-auto px-3 py-2.5 bg-white border border-black/10 rounded-xl text-xs text-[#242b29] focus:outline-none focus:border-[#173a35]"
            >
              <option value="all">All Categories</option>
              <option value="students">Scholars & Students</option>
              <option value="centers">Access Centers & Services</option>
              <option value="opportunities">Opportunities & Grants</option>
              <option value="posts">Discussions & Posts</option>
            </select>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3.5 border-t border-black/[0.04]">
          {[
            { id: "all", label: "All Results", count: totalResults },
            {
              id: "students",
              label: "Scholars",
              count: matchingStudents.length,
            },
            {
              id: "centers",
              label: "Access Centers",
              count: matchingCenters.length,
            },
            {
              id: "opportunities",
              label: "Opportunities",
              count: matchingOpportunities.length,
            },
            { id: "posts", label: "Posts", count: matchingPosts.length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategory(tab.id as any)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                category === tab.id
                  ? "bg-[#173a35] text-white"
                  : "bg-[#f4f6f5] text-[#62736b] hover:bg-[#eef2f0] hover:text-[#173a35]"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* RESULTS LIST */}
      <div className="space-y-6">
        {/* STUDENTS SECTION */}
        {(category === "all" || category === "students") && (
          <div className="card-linkedin p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-black/[0.04] pb-3">
              <h2 className="font-bold text-sm text-[#173a35] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#173a35]" />
                <span>Scholars & Students ({matchingStudents.length})</span>
              </h2>
              {matchingStudents.length > 3 && (
                <button
                  type="button"
                  onClick={() => onNavigateToTab("network")}
                  className="text-xs text-[#c46b4b] hover:underline font-semibold"
                >
                  View in Network Directory →
                </button>
              )}
            </div>

            {matchingStudents.length === 0 ? (
              <p className="text-xs text-[#62736b] py-2">
                No scholars matched "{query}".
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {matchingStudents.slice(0, 6).map((student) => (
                  <div
                    key={student.id}
                    onClick={() => onSelectStudentProfile(student.id)}
                    className="p-3 bg-[#f8faf9] rounded-xl border border-black/[0.04] hover:bg-white hover:shadow-md transition-all cursor-pointer flex items-center gap-3"
                  >
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-[#173a35] truncate">
                        {student.name}
                      </p>
                      <p className="text-[10px] text-[#62736b] truncate">
                        {student.institution}
                      </p>
                      <p className="text-[10px] text-[#728078] truncate">
                        {student.headline}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ACCESS CENTERS SECTION */}
        {(category === "all" || category === "centers") && (
          <div className="card-linkedin p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-black/[0.04] pb-3">
              <h2 className="font-bold text-sm text-[#173a35] flex items-center gap-2">
                <Building className="w-4 h-4 text-[#173a35]" />
                <span>
                  Access Centers & Free Services ({matchingCenters.length})
                </span>
              </h2>
              <button
                type="button"
                onClick={() => onNavigateToTab("access_center")}
                className="text-xs text-[#c46b4b] hover:underline font-semibold"
              >
                Browse All Access Centers →
              </button>
            </div>

            {matchingCenters.length === 0 ? (
              <p className="text-xs text-[#62736b] py-2">
                No Access Centers matched "{query}".
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchingCenters.map((center) => (
                  <div
                    key={center.id}
                    onClick={() => {
                      if (onSelectAccessCenter) onSelectAccessCenter(center)
                      else onNavigateToTab("access_center")
                    }}
                    className="p-4 bg-[#f8faf9] rounded-xl border border-black/[0.04] hover:bg-white hover:shadow-md transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={center.logo}
                        alt={center.name}
                        className="w-9 h-9 rounded-lg object-cover p-0.5 bg-white border border-black/10"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-[#173a35] truncate">
                          {center.name}
                        </p>
                        <p className="text-[10px] text-[#c46b4b] truncate">
                          {center.tagline}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {center.services.slice(0, 2).map((s) => (
                        <span
                          key={s.id}
                          className="px-2 py-0.5 bg-white text-[10px] text-[#173a35] font-medium rounded border border-black/5"
                        >
                          Free: {s.title}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* OPPORTUNITIES SECTION */}
        {(category === "all" || category === "opportunities") && (
          <div className="card-linkedin p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-black/[0.04] pb-3">
              <h2 className="font-bold text-sm text-[#173a35] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#173a35]" />
                <span>
                  Opportunities & Fellowships ({matchingOpportunities.length})
                </span>
              </h2>
              <button
                type="button"
                onClick={() => onNavigateToTab("opportunities")}
                className="text-xs text-[#c46b4b] hover:underline font-semibold"
              >
                View Opportunities Portal →
              </button>
            </div>

            {matchingOpportunities.length === 0 ? (
              <p className="text-xs text-[#62736b] py-2">
                No opportunities matched "{query}".
              </p>
            ) : (
              <div className="space-y-2.5">
                {matchingOpportunities.slice(0, 4).map((opp) => (
                  <div
                    key={opp.id}
                    onClick={() => onSelectOpportunity(opp)}
                    className="p-3.5 bg-[#f8faf9] rounded-xl border border-black/[0.04] hover:bg-white hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-[#173a35]">
                          {opp.title}
                        </h4>
                        <OpportunityCategoryBadge category={opp.category} />
                      </div>
                      <p className="text-[11px] text-[#62736b] mt-0.5">
                        {opp.provider} • {opp.location} • Deadline:{" "}
                        {opp.deadline}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#62736b] shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* POSTS SECTION */}
        {(category === "all" || category === "posts") && (
          <div className="card-linkedin p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-black/[0.04] pb-3">
              <h2 className="font-bold text-sm text-[#173a35] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#173a35]" />
                <span>
                  Academic Posts & Discussions ({matchingPosts.length})
                </span>
              </h2>
              <button
                type="button"
                onClick={() => onNavigateToTab("feed")}
                className="text-xs text-[#c46b4b] hover:underline font-semibold"
              >
                Go to Academic Feed →
              </button>
            </div>

            {matchingPosts.length === 0 ? (
              <p className="text-xs text-[#62736b] py-2">
                No posts matched "{query}".
              </p>
            ) : (
              <div className="space-y-2.5">
                {matchingPosts.slice(0, 3).map((post) => (
                  <div
                    key={post.id}
                    onClick={() => onNavigateToTab("feed")}
                    className="p-3.5 bg-[#f8faf9] rounded-xl border border-black/[0.04] hover:bg-white hover:shadow-md transition-all cursor-pointer space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="font-bold text-xs text-[#173a35]">
                        {post.authorName}
                      </span>
                      <span className="text-[10px] text-[#728078]">
                        ({post.authorInstitution})
                      </span>
                    </div>
                    <p className="text-xs text-[#4d5b54] line-clamp-2">
                      {post.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
