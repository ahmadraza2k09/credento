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
import { Opportunity, OpportunityCategory, StudentProfile } from "../../types"
import { OpportunityCategoryBadge } from "../common/Badge"
import { OpportunityDetailModal } from "./OpportunityDetailModal"
import { PostOpportunityModal } from "./PostOpportunityModal"

interface OpportunitiesViewProps {
  opportunities: Opportunity[]
  currentUser: StudentProfile
  onToggleSave: (oppId: string) => void
  onAddOpportunity: (opp: Omit<Opportunity, "id" | "createdAt">) => void
}

export function OpportunitiesView({
  opportunities,
  currentUser,
  onToggleSave,
  onAddOpportunity,
}: OpportunitiesViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<"all" | "saved">("all")
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

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-5 py-5 sm:py-8 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-[2px] border border-[#cbd3ce] p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#173a35] tracking-tight">
              Student Opportunity Directory
            </h1>
            <p className="text-xs text-[#62736b] mt-1">
              Curated global scholarships, undergraduate lab internships,
              fellowships, and research grants
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsPostModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#173a35] text-white rounded-[2px] text-xs font-semibold hover:bg-[#0e2f2a] transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Post Opportunity</span>
          </button>
        </div>

        {/* Top-Level Tabs: All vs Saved */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#eef2ef]">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`text-xs px-3.5 py-1.5 rounded-[2px] font-semibold transition-colors ${
              activeTab === "all"
                ? "bg-[#173a35] text-white"
                : "bg-[#f7f5ef] text-[#62736b] hover:text-[#173a35]"
            }`}
          >
            All Opportunities ({opportunities.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("saved")}
            className={`text-xs px-3.5 py-1.5 rounded-[2px] font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === "saved"
                ? "bg-[#173a35] text-white"
                : "bg-[#f7f5ef] text-[#62736b] hover:text-[#173a35]"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Bookmarks ({savedCount})</span>
          </button>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 border-t border-[#eef2ef] mt-3 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs px-3 py-1 rounded-[2px] border transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-[#dce8df] text-[#173a35] border-[#173a35] font-semibold"
                  : "bg-white text-[#62736b] border-[#cbd3ce] hover:bg-[#f7f5ef]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-[2px] border border-[#cbd3ce] p-3 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#728078] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search opportunities by title, provider, field, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f7f5ef] border border-[#cbd3ce] rounded-[2px] focus:outline-none focus:border-[#173a35] text-[#242b29]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Delivery Mode Filter */}
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="text-xs bg-[#f7f5ef] border border-[#cbd3ce] rounded-[2px] px-2.5 py-1.5 text-[#242b29] focus:outline-none cursor-pointer"
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
            className={`text-xs px-3 py-1.5 rounded-[2px] border transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              closingSoonOnly
                ? "bg-[#c46b4b] text-white border-[#c46b4b] font-semibold"
                : "bg-[#f7f5ef] text-[#62736b] border-[#cbd3ce]"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Closing Soon</span>
          </button>
        </div>
      </div>

      {/* OPPORTUNITIES GRID */}
      {filteredOpportunities.length === 0 ? (
        <div className="bg-white rounded-[2px] border border-[#cbd3ce] p-10 text-center text-[#62736b]">
          <Briefcase className="w-8 h-8 text-[#87978f] mx-auto mb-2" />
          <p className="font-bold text-sm text-[#173a35]">
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
            className="mt-3 px-3 py-1.5 bg-[#173a35] text-white text-xs font-semibold rounded-[2px]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-[2px] border border-[#cbd3ce] p-4 sm:p-5 flex flex-col justify-between hover:border-[#173a35] transition-all group"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <OpportunityCategoryBadge category={opp.category} />
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#f7f5ef] border border-[#d8ddd8] rounded-[2px] text-[#4d5b54]">
                      {opp.mode}
                    </span>
                    {opp.compensation && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#edf6f0] text-[#155738] border border-[#b8dec4] rounded-[2px]">
                        {opp.compensation}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleSave(opp.id)}
                    className={`p-1.5 rounded-[2px] transition-colors ${
                      opp.isSaved
                        ? "text-[#c46b4b] bg-[#faf0eb] border border-[#e8cdc2]"
                        : "text-[#62736b] hover:text-[#173a35] hover:bg-[#f7f5ef]"
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
                  className="font-bold text-sm sm:text-base text-[#173a35] group-hover:text-[#0e2f2a] cursor-pointer leading-snug line-clamp-2"
                >
                  {opp.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-[#62736b] mt-1.5">
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
                <p className="text-xs text-[#242b29] mt-2.5 line-clamp-3 leading-relaxed">
                  {opp.description}
                </p>

                {/* Eligibility preview */}
                {opp.eligibility && opp.eligibility.length > 0 && (
                  <div className="mt-3 p-2.5 bg-[#f7f5ef] rounded-[2px] border border-[#e2e8e3] text-[11px] text-[#4d5b54]">
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
              <div className="mt-4 pt-3 border-t border-[#eef2ef] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[11px] text-[#a33e32] font-mono font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Deadline: {opp.deadline}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedOpp(opp)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#173a35] text-white rounded-[2px] text-xs font-semibold hover:bg-[#0e2f2a] transition-colors"
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
