import React, { useState, useMemo } from "react"
import {
  MapPin,
  GraduationCap,
  Building,
  Calendar,
  ExternalLink,
  Edit3,
  Plus,
  Share2,
  Lock,
  Globe,
  UserPlus,
  UserCheck,
  Clock,
  MessageSquare,
  Award,
  BookOpen,
  Briefcase,
  FolderGit2,
  ShieldCheck,
  Check,
  Flag,
  UserX,
  Trash2,
} from "lucide-react"
import { PortfolioItem, PortfolioType, StudentProfile } from "../../types"
import { ProfileEditModal } from "./ProfileEditModal"
import { AddPortfolioItemModal } from "./AddPortfolioItemModal"
import { calculateProfileCompleteness } from "../../services/storage"

interface ProfileViewProps {
  profile: StudentProfile
  currentUser: StudentProfile
  isSelf: boolean
  onUpdateProfile: (updates: Partial<StudentProfile>) => void
  onAddPortfolioItem: (item: Omit<PortfolioItem, "id">) => void
  onRemovePortfolioItem: (itemId: string) => void
  onConnect: (userId: string) => void
  onFollow: (userId: string) => void
  onStartMessage: (userId: string) => void
  onReport: (type: "user", targetId: string) => void
  onBlockUser: (userId: string) => void
}

export function ProfileView({
  profile,
  currentUser,
  isSelf,
  onUpdateProfile,
  onAddPortfolioItem,
  onRemovePortfolioItem,
  onConnect,
  onFollow,
  onStartMessage,
  onReport,
  onBlockUser,
}: ProfileViewProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddPortfolioOpen, setIsAddPortfolioOpen] = useState(false)
  const [activePortfolioTab, setActivePortfolioTab] = useState<string>("all")
  const [copiedLink, setCopiedLink] = useState(false)

  const completeness = useMemo(
    () => calculateProfileCompleteness(profile),
    [profile],
  )

  const isConnected = profile.connectionStatus === "connected"
  const isPendingSent = profile.connectionStatus === "pending_sent"
  const isPendingReceived = profile.connectionStatus === "pending_received"

  // Visibility check: If not public and not self and not connected
  const isRestricted = !profile.isPublic && !isSelf && !isConnected

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  // Filter portfolio items
  const filteredPortfolio = useMemo(() => {
    if (!profile.portfolioItems) return []
    if (activePortfolioTab === "all") return profile.portfolioItems
    return profile.portfolioItems.filter(
      (item) => item.type === activePortfolioTab,
    )
  }, [profile.portfolioItems, activePortfolioTab])

  interface PortfolioTabOption {
    id: string
    label: string
    count?: number
  }

  const portfolioTabOptions: PortfolioTabOption[] = [
    {
      id: "all",
      label: "All Accomplishments",
      count: profile.portfolioItems?.length || 0,
    },
    {
      id: "project",
      label: "Projects",
      count:
        profile.portfolioItems?.filter((p) => p.type === "project").length || 0,
    },
    {
      id: "publication",
      label: "Publications",
      count:
        profile.portfolioItems?.filter((p) => p.type === "publication")
          .length || 0,
    },
    {
      id: "award",
      label: "Awards & Honors",
      count:
        profile.portfolioItems?.filter((p) => p.type === "award").length || 0,
    },
    {
      id: "leadership",
      label: "Leadership & Service",
      count:
        profile.portfolioItems?.filter(
          (p) => p.type === "leadership" || p.type === "volunteer",
        ).length || 0,
    },
    {
      id: "certificate",
      label: "Certificates",
      count:
        profile.portfolioItems?.filter((p) => p.type === "certificate")
          .length || 0,
    },
  ]

  const getPortfolioIcon = (type: PortfolioType) => {
    switch (type) {
      case "project":
        return <FolderGit2 className="w-4 h-4 text-[#173a35]" />
      case "publication":
        return <BookOpen className="w-4 h-4 text-[#c46b4b]" />
      case "award":
        return <Award className="w-4 h-4 text-[#b45309]" />
      case "leadership":
      case "volunteer":
        return <Briefcase className="w-4 h-4 text-[#1b6b47]" />
      default:
        return <ShieldCheck className="w-4 h-4 text-[#0369a1]" />
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-5 py-5 sm:py-8 space-y-5">
      {/* 1. PROFILE HEADER CARD */}
      <div className="bg-white rounded-[2px] border border-[#cbd3ce] overflow-hidden">
        {/* Banner Cover Image - Solid Archival Evergreen Cover */}
        <div className="h-44 sm:h-56 bg-[#173a35] relative">
          {profile.coverImage && (
            <img
              src={profile.coverImage}
              alt="Profile Cover"
              className="w-full h-full object-cover opacity-75"
            />
          )}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {profile.isPublic ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-[#173a35] text-[11px] font-semibold rounded-[2px] border border-[#cbd3ce]">
                <Globe className="w-3 h-3 text-[#173a35]" />
                <span>Public Profile</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-[#9f5138] text-[11px] font-semibold rounded-[2px] border border-[#cbd3ce]">
                <Lock className="w-3 h-3 text-[#9f5138]" />
                <span>Connections Only</span>
              </span>
            )}
          </div>
        </div>

        {/* Avatar & Main Credentials Header */}
        <div className="px-5 sm:px-8 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            <div className="relative inline-block">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-28 sm:w-36 h-28 sm:h-36 rounded-[2px] object-cover border-2 border-white bg-white"
              />
              <span
                className="absolute bottom-1 right-1 w-6 h-6 bg-[#173a35] text-white rounded-[2px] flex items-center justify-center border border-white"
                title="Verified University Student"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#dce8df]" />
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {isSelf ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#173a35] text-white rounded-[2px] text-xs font-semibold hover:bg-[#0e2f2a] transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddPortfolioOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#cbd3ce] text-[#173a35] hover:bg-[#f7f5ef] rounded-[2px] text-xs font-semibold transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#cbd3ce] text-[#62736b] hover:text-[#173a35] rounded-[2px] text-xs transition-colors"
                    title="Share profile"
                  >
                    {copiedLink ? (
                      <Check className="w-4 h-4 text-[#173a35]" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>
                </>
              ) : (
                <>
                  {isConnected ? (
                    <button
                      type="button"
                      onClick={() => onStartMessage(profile.id)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#173a35] text-white rounded-[2px] text-xs font-semibold hover:bg-[#0e2f2a] transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Message</span>
                    </button>
                  ) : isPendingSent ? (
                    <span className="flex items-center gap-1.5 px-3.5 py-2 bg-[#eef2ef] text-[#62736b] rounded-[2px] text-xs font-semibold border border-[#d8ddd8]">
                      <Clock className="w-4 h-4" />
                      <span>Request Sent</span>
                    </span>
                  ) : isPendingReceived ? (
                    <button
                      type="button"
                      onClick={() => onConnect(profile.id)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#173a35] text-white rounded-[2px] text-xs font-semibold hover:bg-[#0e2f2a] transition-colors"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Accept Request</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onConnect(profile.id)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#173a35] text-white rounded-[2px] text-xs font-semibold hover:bg-[#0e2f2a] transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Connect</span>
                    </button>
                  )}

                  {/* Follow / Unfollow */}
                  <button
                    type="button"
                    onClick={() => onFollow(profile.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 border rounded-[2px] text-xs font-semibold transition-colors ${
                      profile.isFollowing
                        ? "bg-[#dce8df] text-[#173a35] border-[#173a35]"
                        : "bg-white text-[#242b29] border-[#cbd3ce] hover:bg-[#f7f5ef]"
                    }`}
                  >
                    <span>{profile.isFollowing ? "Following" : "Follow"}</span>
                  </button>

                  {/* Direct message if not connected */}
                  {!isConnected && (
                    <button
                      type="button"
                      onClick={() => onStartMessage(profile.id)}
                      className="p-2 border border-[#cbd3ce] rounded-[2px] text-[#62736b] hover:text-[#173a35] hover:bg-[#f7f5ef]"
                      title="Send message"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  )}

                  {/* Report / Block options */}
                  <button
                    type="button"
                    onClick={() => onReport("user", profile.id)}
                    className="p-2 border border-[#cbd3ce] rounded-[2px] text-[#62736b] hover:text-[#a33e32] hover:bg-[#fdf2f2]"
                    title="Report profile"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Name & Headline */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-[#173a35] tracking-tight">
                {profile.name}
              </h1>
              <span className="text-xs bg-[#eef2ef] text-[#4d5b54] px-2 py-0.5 rounded-[2px] font-mono border border-[#d8ddd8]">
                Class of {profile.graduationYear}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#242b29] font-medium mt-1 leading-snug">
              {profile.headline}
            </p>

            {/* Academic Institution & Location Meta */}
            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-[#62736b] mt-3">
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#173a35]" />
                <span className="font-semibold text-[#173a35]">
                  {profile.institution}
                </span>
              </div>
              {profile.facultyOrDepartment && (
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#728078]" />
                  <span>{profile.facultyOrDepartment}</span>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#728078]" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>

            {/* Connections & Followers count */}
            <div className="flex items-center gap-4 text-xs text-[#62736b] mt-3 pt-3 border-t border-[#eef2ef]">
              <div>
                <strong className="text-[#173a35] font-mono">
                  {profile.connectionsCount}
                </strong>{" "}
                connections
              </div>
              <div>
                <strong className="text-[#173a35] font-mono">
                  {profile.followersCount}
                </strong>{" "}
                followers
              </div>
            </div>
          </div>

          {/* Profile Completeness Recommendation Bar (Self only) */}
          {isSelf && completeness.percentage < 100 && (
            <div className="mt-5 p-4 bg-[#f7f5ef] border border-[#d8ddd8] rounded-[2px]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-[#173a35]">
                  Profile Completeness Indicator
                </span>
                <span className="text-xs font-mono font-bold text-[#c46b4b]">
                  {completeness.percentage}%
                </span>
              </div>
              <div className="w-full bg-[#d8ddd8] rounded-[2px] h-2 overflow-hidden mb-2">
                <div
                  className="bg-[#c46b4b] h-2 rounded-[2px] transition-all duration-300"
                  style={{ width: `${completeness.percentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-[11px] text-[#62736b]">
                  Improve your profile to reach full student credential status.
                  Missing: {completeness.missingFields.join(", ")}.
                </p>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-xs text-[#c46b4b] font-bold hover:underline"
                >
                  Complete Now →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RESTRICTED PROFILE NOTICE (If private and not connected) */}
      {isRestricted ? (
        <div className="bg-white rounded-[2px] border border-[#cbd3ce] p-8 text-center">
          <Lock className="w-8 h-8 text-[#9f5138] mx-auto mb-2" />
          <h3 className="font-bold text-sm text-[#173a35]">
            This Student Profile is Private
          </h3>
          <p className="text-xs text-[#62736b] max-w-md mx-auto mt-1 mb-4 leading-relaxed">
            {profile.name} has chosen to share their detailed research,
            projects, and educational credentials only with confirmed peer
            connections.
          </p>
          <button
            type="button"
            onClick={() => onConnect(profile.id)}
            className="px-4 py-2 bg-[#173a35] text-white rounded-[2px] text-xs font-semibold hover:bg-[#0e2f2a]"
          >
            Connect to View Full Profile
          </button>
        </div>
      ) : (
        <>
          {/* 2. ABOUT SECTION */}
          <div className="bg-white rounded-[2px] border border-[#cbd3ce] p-5 sm:p-6">
            <div className="flex items-center justify-between mb-3 border-b border-[#eef2ef] pb-2">
              <h2 className="font-bold text-sm text-[#173a35] uppercase tracking-wider">
                About & Research Focus
              </h2>
              {isSelf && (
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-xs text-[#62736b] hover:text-[#173a35]"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <p className="text-sm text-[#242b29] leading-relaxed whitespace-pre-line">
              {profile.about || "No personal statement provided yet."}
            </p>
          </div>

          {/* 3. EDUCATION & ACADEMIC CREDENTIALS */}
          <div className="bg-white rounded-[2px] border border-[#cbd3ce] p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4 border-b border-[#eef2ef] pb-2">
              <h2 className="font-bold text-sm text-[#173a35] uppercase tracking-wider">
                Education & Qualifications
              </h2>
            </div>

            <div className="space-y-4">
              {profile.education && profile.education.length > 0 ? (
                profile.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="flex items-start gap-3.5 pb-4 border-b border-[#eef2ef] last:border-0 last:pb-0"
                  >
                    <div className="w-10 h-10 rounded-[2px] bg-[#dce8df] text-[#173a35] flex items-center justify-center shrink-0 border border-[#cbd3ce]">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm text-[#173a35]">
                        {edu.institution}
                      </h3>
                      <p className="text-xs font-semibold text-[#242b29] mt-0.5">
                        {edu.degree} — {edu.fieldOfStudy}
                      </p>
                      <p className="text-[11px] text-[#62736b] mt-0.5">
                        {edu.startYear} – {edu.endYear}{" "}
                        {edu.gradeOrGpa ? `• ${edu.gradeOrGpa}` : ""}
                      </p>
                      {edu.activities && (
                        <p className="text-xs text-[#4d5b54] mt-2 leading-relaxed bg-[#f7f5ef] p-2.5 rounded-[2px] border border-[#e2e8e3]">
                          <strong className="text-[#173a35]">
                            Activities & Societies:
                          </strong>{" "}
                          {edu.activities}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#62736b]">No education listed.</p>
              )}
            </div>
          </div>

          {/* 4. STUDENT PORTFOLIO, PROJECTS & ACCOMPLISHMENTS */}
          <div className="bg-white rounded-[2px] border border-[#cbd3ce] p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4 border-b border-[#eef2ef] pb-2">
              <div>
                <h2 className="font-bold text-sm text-[#173a35] uppercase tracking-wider">
                  Portfolio & Accomplishments
                </h2>
                <p className="text-[11px] text-[#62736b] mt-0.5">
                  Verified research projects, publications, awards, and
                  certifications
                </p>
              </div>
              {isSelf && (
                <button
                  type="button"
                  onClick={() => setIsAddPortfolioOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#173a35] text-white rounded-[2px] text-xs font-semibold hover:bg-[#0e2f2a]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Work</span>
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 border-b border-[#eef2ef] scrollbar-none">
              {portfolioTabOptions.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActivePortfolioTab(tab.id)}
                  className={`text-xs px-3 py-1.5 rounded-[2px] border transition-colors whitespace-nowrap font-medium ${
                    activePortfolioTab === tab.id
                      ? "bg-[#173a35] text-white border-[#173a35]"
                      : "bg-[#f7f5ef] text-[#62736b] border-[#cbd3ce] hover:text-[#173a35]"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="ml-1.5 font-mono text-[10px] opacity-80">
                      ({tab.count})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Items list */}
            {filteredPortfolio.length === 0 ? (
              <div className="p-8 text-center bg-[#f7f5ef] rounded-[2px] border border-[#d8ddd8] text-xs text-[#62736b]">
                <p className="font-semibold text-[#173a35]">
                  No items listed under this category.
                </p>
                {isSelf && (
                  <button
                    type="button"
                    onClick={() => setIsAddPortfolioOpen(true)}
                    className="mt-2 text-[#c46b4b] font-bold hover:underline"
                  >
                    + Add your first{" "}
                    {activePortfolioTab === "all" ? "work" : activePortfolioTab}
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPortfolio.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-[#f0ede6] rounded-[2px] border border-[#cbd3ce] transition-all relative group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-[2px] bg-white border border-[#cbd3ce] flex items-center justify-center shrink-0 mt-0.5">
                          {getPortfolioIcon(item.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-sm text-[#173a35]">
                              {item.title}
                            </h3>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.2 rounded-[2px] bg-white border border-[#cbd3ce] text-[#62736b]">
                              {item.type}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-[#62736b] mt-0.5">
                            {item.organization && (
                              <span className="font-semibold text-[#242b29]">
                                {item.organization}
                              </span>
                            )}
                            {item.date && <span>• {item.date}</span>}
                            {item.credentialId && (
                              <span className="font-mono text-[#728078]">
                                ID: {item.credentialId}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Remove item button for self */}
                      {isSelf && (
                        <button
                          type="button"
                          onClick={() => onRemovePortfolioItem(item.id)}
                          className="text-[#62736b] hover:text-[#a33e32] p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-[#242b29] mt-2.5 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Skills pills */}
                    {item.skills && item.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {item.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 bg-white border border-[#cbd3ce] rounded-[2px] text-[#4d5b54] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* External Link */}
                    {item.linkUrl && (
                      <div className="mt-3 pt-2 border-t border-[#cbd3ce]">
                        <a
                          href={item.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[#c46b4b] hover:underline font-semibold"
                        >
                          <span>View Official Repository / Publication</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. SKILLS & INTERESTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Skills */}
            <div className="bg-white rounded-[2px] border border-[#cbd3ce] p-5">
              <h2 className="font-bold text-xs uppercase tracking-wider text-[#173a35] mb-3">
                Skills & Endorsements ({profile.skills?.length || 0})
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-[#f7f5ef] border border-[#cbd3ce] rounded-[2px] text-xs text-[#242b29] font-medium"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-[#62736b]">No skills added.</p>
                )}
              </div>
            </div>

            {/* Academic Interests */}
            <div className="bg-white rounded-[2px] border border-[#cbd3ce] p-5">
              <h2 className="font-bold text-xs uppercase tracking-wider text-[#173a35] mb-3">
                Academic & Research Interests
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {profile.interests && profile.interests.length > 0 ? (
                  profile.interests.map((interest, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-[#dce8df] border border-[#b8c9bd] rounded-[2px] text-xs text-[#173a35] font-medium"
                    >
                      #{interest}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-[#62736b]">No interests added.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onSave={onUpdateProfile}
      />

      <AddPortfolioItemModal
        isOpen={isAddPortfolioOpen}
        onClose={() => setIsAddPortfolioOpen(false)}
        onAdd={onAddPortfolioItem}
      />
    </div>
  )
}
