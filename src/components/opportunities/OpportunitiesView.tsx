import React, { useState, useMemo } from "react"
import {
  Briefcase,
  Search,
  Filter,
  Bookmark,
  Calendar,
  MapPin,
  Building,
  Plus,
  ExternalLink,
  Clock,
  ArrowRight,
  CheckCircle,
} from "lucide-react"
import {
  ApplicationStatus,
  Opportunity,
  OpportunityCategory,
  StudentProfile,
} from "../../types"
import { OpportunityCategoryBadge } from "../common/Badge"
import { OpportunityDetailModal } from "./OpportunityDetailModal"
import { PostOpportunityModal } from "./PostOpportunityModal"

interface OpportunitiesViewProps {
  opportunities: Opportunity[]
  currentUser: StudentProfile
  onToggleSave: (oppId: string) => void
  onAddOpportunity: (opp: Omit<Opportunity, "id" | "createdAt">) => void
  onUpdateApplicationStatus?: (
    oppId: string,
    status: ApplicationStatus,
    notes?: string,
  ) => void
}

export function OpportunitiesView({
  opportunities,
  currentUser,
  onToggleSave,
  onAddOpportunity,
  onUpdateApplicationStatus,
}: OpportunitiesViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<"all" | "saved" | "applied">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMode, setSelectedMode] = useState<string>("all")
  const [closingSoonOnly, setClosingSoonOnly] = useState(false)
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null)
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)

  interface CategoryOption {
    id: string
    label: string
  }

  const categories: CategoryOption[] = [
    { id: "all", label: "All Categories" },
    { id: "scholarship", label: "Scholarships & Grants" },
    { id: "internship", label: "Internships & Research" },
    { id: "fellowship", label: "Fellowships" },
    { id: "competition", label: "Competitions & Hackathons" },
    { id: "course", label: "Courses & Certifications" },
    { id: "volunteer", label: "Volunteering & Delegations" },
  ]

  // Filter logic
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      // Saved filter
      if (activeTab === "saved" && !opp.isSaved) return false

      // Applied filter
      if (activeTab === "applied" && !opp.applicationStatus) return false

      // Category filter
      if (selectedCategory !== "all" && opp.category !== selectedCategory)
        return false

      // Mode filter
      if (selectedMode !== "all" && opp.mode !== selectedMode) return false

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesTitle = opp.title.toLowerCase().includes(q)
        const matchesProvider = opp.provider.toLowerCase().includes(q)
        const matchesDesc = opp.description.toLowerCase().includes(q)
        const matchesLocation = opp.location.toLowerCase().includes(q)
        if (
          !matchesTitle &&
          !matchesProvider &&
          !matchesDesc &&
          !matchesLocation
        )
          return false
      }

      // Closing soon (within 60 days of current date or early deadlines)
      if (closingSoonOnly) {
        const deadlineDate = new Date(opp.deadline)
        const now = new Date()
        const diffDays = Math.ceil(
          (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        )
        if (diffDays > 60 || diffDays < 0) return false
      }

      return true
    })
  }, [
    opportunities,
    activeTab,
    selectedCategory,
    selectedMode,
    searchQuery,
    closingSoonOnly,
  ])

  const savedCount = opportunities.filter((o) => o.isSaved).length
  const appliedCount = opportunities.filter((o) =>
    Boolean(o.applicationStatus),
  ).length

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-5 py-5 sm:py-8 space-y-6">
      {/* Top Header Card */}
      <div className="card-linkedin p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#173a35] tracking-tight">
              Student Opportunity Directory
            </h1>
            <p className="text-xs sm:text-sm text-[#62736b] mt-1">
              Curated global scholarships, undergraduate lab internships,
              fellowships, and research grants
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsPostModalOpen(true)}
            className="btn-3d-primary flex items-center gap-1.5 px-4 py-2 text-xs font-semibold shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post Opportunity</span>
          </button>
        </div>

        {/* Top-Level Tabs: All vs Saved */}
        <div className="flex items-center gap-2 mt-5 pt-5 border-t border-black/[0.05]">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`text-xs px-4 py-2 rounded-full font-semibold transition-all cursor-pointer ${
              activeTab === "all"
                ? "btn-3d-primary text-white"
                : "bg-[#f4f6f5] text-[#62736b] hover:bg-white hover:shadow-sm"
            }`}
          >
            All Opportunities ({opportunities.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("saved")}
            className={`text-xs px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "saved"
                ? "btn-3d-primary text-white"
                : "bg-[#f4f6f5] text-[#62736b] hover:bg-white hover:shadow-sm"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Bookmarks ({savedCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("applied")}
            className={`text-xs px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "applied"
                ? "btn-3d-primary text-white"
                : "bg-[#f4f6f5] text-[#62736b] hover:bg-white hover:shadow-sm"
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>My Applications ({appliedCount})</span>
          </button>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3.5 border-t border-black/[0.04] mt-3.5 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#173a35] text-white font-semibold shadow-xs"
                  : "bg-[#f4f6f5] text-[#62736b] hover:bg-white hover:shadow-xs"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card-linkedin p-3.5 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#728078] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search opportunities by title, provider, field, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#f4f6f5] border border-black/10 rounded-full focus:outline-none focus:border-[#173a35] focus:bg-white text-[#242b29] shadow-inner transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Delivery Mode Filter */}
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="text-xs bg-[#f4f6f5] border border-black/10 rounded-full px-3.5 py-2 text-[#242b29] focus:outline-none cursor-pointer shadow-xs"
          >
            <option value="all">All Delivery Modes</option>
            <option value="Remote">Remote Only</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>

          {/* Closing soon checkbox button */}
          <button
            type="button"
            onClick={() => setClosingSoonOnly(!closingSoonOnly)}
            className={`text-xs px-3.5 py-2 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              closingSoonOnly
                ? "btn-3d-copper text-white font-semibold"
                : "bg-[#f4f6f5] text-[#62736b] hover:bg-white hover:shadow-xs"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Closing Soon</span>
          </button>
        </div>
      </div>

      {/* OPPORTUNITIES GRID */}
      {filteredOpportunities.length === 0 ? (
        <div className="card-linkedin p-12 text-center text-[#62736b]">
          <Briefcase className="w-10 h-10 text-[#87978f] mx-auto mb-2.5" />
          <p className="font-bold text-base text-[#173a35]">
            No opportunities match your current filters.
          </p>
          <p className="text-xs mt-1">
            Try resetting your search query or selecting a different category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all")
              setSelectedMode("all")
              setSearchQuery("")
              setClosingSoonOnly(false)
              setActiveTab("all")
            }}
            className="btn-3d-primary mt-4 px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="card-linkedin card-linkedin-hover p-5 sm:p-6 flex flex-col justify-between overflow-hidden group cursor-pointer"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <OpportunityCategoryBadge category={opp.category} />
                    <span className="text-[10px] font-mono px-2.5 py-0.5 bg-[#f4f6f5] rounded-full text-[#4d5b54] font-medium shadow-2xs">
                      {opp.mode}
                    </span>
                    {opp.compensation && (
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 bg-[#edf6f0] text-[#155738] rounded-full shadow-2xs">
                        {opp.compensation}
                      </span>
                    )}
                    {opp.applicationStatus && (
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 bg-[#173a35] text-white rounded-full shadow-2xs capitalize">
                        {opp.applicationStatus.replace("_", " ")}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleSave(opp.id)
                    }}
                    className={`p-2 rounded-full transition-all cursor-pointer ${
                      opp.isSaved
                        ? "text-[#c46b4b] bg-[#faf0eb] shadow-xs"
                        : "text-[#62736b] hover:text-[#173a35] hover:bg-black/5"
                    }`}
                    title={
                      opp.isSaved ? "Remove from saved" : "Save opportunity"
                    }
                  >
                    <Bookmark
                      className={`w-4 h-4 ${opp.isSaved ? "fill-current" : ""}`}
                    />
                  </button>
                </div>

                {/* Title & Provider */}
                <h3
                  onClick={() => setSelectedOpp(opp)}
                  className="font-bold text-base text-[#173a35] group-hover:text-[#c46b4b] transition-colors leading-snug line-clamp-2"
                >
                  {opp.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-[#62736b] mt-2">
                  <div className="flex items-center gap-1 font-semibold text-[#242b29]">
                    <Building className="w-3.5 h-3.5 text-[#173a35]" />
                    <span>{opp.provider}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-[#728078]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{opp.location}</span>
                  </div>
                </div>

                {/* Description snippet */}
                <p className="text-xs text-[#242b29] mt-3 line-clamp-3 leading-relaxed">
                  {opp.description}
                </p>

                {/* Eligibility preview */}
                {opp.eligibility && opp.eligibility.length > 0 && (
                  <div className="mt-3.5 p-3 bg-[#f8faf9] rounded-2xl border border-black/[0.04] text-[11px] text-[#4d5b54]">
                    <span className="font-semibold text-[#173a35] block mb-1">
                      Key Eligibility Criteria:
                    </span>
                    <ul className="space-y-0.5 list-disc list-inside">
                      {opp.eligibility.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="line-clamp-1">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom footer: Deadline & View Action */}
              <div className="mt-5 pt-3.5 border-t border-black/[0.04] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[11px] text-[#a33e32] font-mono font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Deadline: {opp.deadline}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedOpp(opp)}
                  className="btn-3d-primary flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold cursor-pointer"
                >
                  <span>Details & Apply</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <OpportunityDetailModal
        isOpen={Boolean(selectedOpp)}
        onClose={() => setSelectedOpp(null)}
        opportunity={selectedOpp}
        isSaved={Boolean(selectedOpp?.isSaved)}
        onToggleSave={onToggleSave}
        onUpdateStatus={onUpdateApplicationStatus}
      />

      {/* Post Opportunity Modal */}
      <PostOpportunityModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onAdd={onAddOpportunity}
        userName={currentUser.name}
      />
    </div>
  )
}
