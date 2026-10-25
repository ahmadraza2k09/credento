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
  FileText,
  ThumbsUp,
  Sparkles,
  X,
} from "lucide-react"
import {
  EducationItem,
  PortfolioItem,
  PortfolioType,
  StudentProfile,
} from "../../types"
import { ProfileEditModal } from "./ProfileEditModal"
import { AddPortfolioItemModal } from "./AddPortfolioItemModal"
import { EditPortfolioItemModal } from "./EditPortfolioItemModal"
import { EducationModal } from "./EducationModal"
import { ExportCvModal } from "./ExportCvModal"
import { calculateProfileCompleteness } from "../../services/storage"

interface ProfileViewProps {
  profile: StudentProfile
  currentUser: StudentProfile
  isSelf: boolean
  onUpdateProfile: (updates: Partial<StudentProfile>) => void
  onAddPortfolioItem: (item: Omit<PortfolioItem, "id">) => void
  onUpdatePortfolioItem?: (
    itemId: string,
    updates: Partial<PortfolioItem>,
  ) => void
  onRemovePortfolioItem: (itemId: string) => void
  onAddEducation?: (edu: Omit<EducationItem, "id">) => void
  onUpdateEducation?: (eduId: string, updates: Partial<EducationItem>) => void
  onDeleteEducation?: (eduId: string) => void
  onAddSkill?: (skill: string) => void
  onRemoveSkill?: (skill: string) => void
  onAddInterest?: (interest: string) => void
  onRemoveInterest?: (interest: string) => void
  onConnect: (userId: string) => void
  onFollow: (userId: string) => void
  onStartMessage: (userId: string) => void
  onReport: (type: "user", targetId: string) => void
  onBlockUser: (userId: string) => void
  onEndorseSkill?: (userId: string, skill: string) => void
}

export function ProfileView({
  profile,
  currentUser,
  isSelf,
  onUpdateProfile,
  onAddPortfolioItem,
  onUpdatePortfolioItem,
  onRemovePortfolioItem,
  onAddEducation,
  onUpdateEducation,
  onDeleteEducation,
  onAddSkill,
  onRemoveSkill,
  onAddInterest,
  onRemoveInterest,
  onConnect,
  onFollow,
  onStartMessage,
  onReport,
  onBlockUser,
  onEndorseSkill,
}: ProfileViewProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddPortfolioOpen, setIsAddPortfolioOpen] = useState(false)
  const [isExportCvOpen, setIsExportCvOpen] = useState(false)
  const [isEduModalOpen, setIsEduModalOpen] = useState(false)
  const [selectedEduToEdit, setSelectedEduToEdit] =
    useState<EducationItem | null>(null)
  const [isEditPortfolioOpen, setIsEditPortfolioOpen] = useState(false)
  const [selectedPortfolioToEdit, setSelectedPortfolioToEdit] =
    useState<PortfolioItem | null>(null)

  const [newSkillInput, setNewSkillInput] = useState("")
  const [showAddSkillInput, setShowAddSkillInput] = useState(false)
  const [newInterestInput, setNewInterestInput] = useState("")
  const [showAddInterestInput, setShowAddInterestInput] = useState(false)

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
    <div className="max-w-5xl mx-auto px-3 sm:px-5 py-5 sm:py-8 space-y-6">
      {/* 1. PROFILE HEADER CARD */}
      <div className="card-linkedin overflow-hidden">
        {/* Banner Cover Image - Solid Archival Evergreen Cover */}
        <div className="h-44 sm:h-60 bg-gradient-to-r from-[#173a35] to-[#102d29] relative">
          {profile.coverImage && (
            <img
              src={profile.coverImage}
              alt="Profile Cover"
              className="w-full h-full object-cover opacity-75"
            />
          )}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {profile.isPublic ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-xs text-[#173a35] text-[11px] font-semibold rounded-full shadow-sm">
                <Globe className="w-3 h-3 text-[#173a35]" />
                <span>Public Profile</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-xs text-[#9f5138] text-[11px] font-semibold rounded-full shadow-sm">
                <Lock className="w-3 h-3 text-[#9f5138]" />
                <span>Connections Only</span>
              </span>
            )}
          </div>
        </div>

        {/* Avatar & Main Credentials Header */}
        <div className="px-6 sm:px-9 pb-7 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-16 sm:-mt-22 mb-4">
            <div className="relative inline-block">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-28 sm:w-36 h-28 sm:h-36 rounded-full object-cover border-4 border-white shadow-xl bg-white"
              />
              <span
                className="absolute bottom-1.5 right-1.5 w-7 h-7 bg-[#173a35] text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                title="Verified University Student"
              >
                <ShieldCheck className="w-4 h-4 text-[#dce8df]" />
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {isSelf ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="btn-3d-primary flex items-center gap-1.5 px-4.5 py-2 text-xs font-semibold cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddPortfolioOpen(true)}
                    className="btn-3d-secondary flex items-center gap-1.5 px-4 py-2 text-xs font-semibold cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsExportCvOpen(true)}
                    className="btn-3d-secondary flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold cursor-pointer"
                    title="Export Academic CV"
                  >
                    <FileText className="w-4 h-4 text-[#173a35]" />
                    <span>Export CV</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="btn-3d-secondary flex items-center gap-1.5 px-3 py-2 text-xs cursor-pointer"
                    title="Share profile"
                  >
                    {copiedLink ? (
                      <Check className="w-4 h-4 text-[#173a35]" />
                    ) : (
                      <Share2 className="w-4 h-4 text-[#62736b]" />
                    )}
                  </button>
                </>
              ) : (
                <>
                  {isConnected ? (
                    <button
                      type="button"
                      onClick={() => onStartMessage(profile.id)}
                      className="btn-3d-primary flex items-center gap-1.5 px-4.5 py-2 text-xs font-semibold cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Message</span>
                    </button>
                  ) : isPendingSent ? (
                    <span className="flex items-center gap-1.5 px-4 py-2 bg-[#f4f6f5] text-[#62736b] rounded-xl text-xs font-semibold shadow-xs">
                      <Clock className="w-4 h-4" />
                      <span>Request Sent</span>
                    </span>
                  ) : isPendingReceived ? (
                    <button
                      type="button"
                      onClick={() => onConnect(profile.id)}
                      className="btn-3d-primary flex items-center gap-1.5 px-4.5 py-2 text-xs font-semibold cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Accept Request</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onConnect(profile.id)}
                      className="btn-3d-primary flex items-center gap-1.5 px-4.5 py-2 text-xs font-semibold cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Connect</span>
                    </button>
                  )}

                  {/* Follow / Unfollow */}
                  <button
                    type="button"
                    onClick={() => onFollow(profile.id)}
                    className={`btn-3d-secondary flex items-center gap-1.5 px-4 py-2 text-xs font-semibold cursor-pointer ${
                      profile.isFollowing ? "text-[#173a35] font-bold" : ""
                    }`}
                  >
                    <span>{profile.isFollowing ? "Following" : "Follow"}</span>
                  </button>

                  {/* Direct message if not connected */}
                  {!isConnected && (
                    <button
                      type="button"
                      onClick={() => onStartMessage(profile.id)}
                      className="btn-3d-secondary p-2.5 text-xs cursor-pointer"
                      title="Send message"
                    >
                      <MessageSquare className="w-4 h-4 text-[#62736b]" />
                    </button>
                  )}

                  {/* Export CV button for peers */}
                  <button
                    type="button"
                    onClick={() => setIsExportCvOpen(true)}
                    className="btn-3d-secondary flex items-center gap-1.5 px-3 py-2 text-xs font-semibold cursor-pointer"
                    title="View Academic CV"
                  >
                    <FileText className="w-4 h-4 text-[#173a35]" />
                    <span>CV</span>
                  </button>

                  {/* Report / Block options */}
                  <button
                    type="button"
                    onClick={() => onReport("user", profile.id)}
                    className="btn-3d-secondary p-2.5 text-xs cursor-pointer hover:text-[#a33e32]"
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
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#173a35] tracking-tight">
                {profile.name}
              </h1>
              <span className="text-xs bg-[#f4f6f5] text-[#4d5b54] px-2.5 py-0.5 rounded-full font-mono font-medium shadow-2xs">
                Class of {profile.graduationYear}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#242b29] font-medium mt-1 leading-snug">
              {profile.headline}
            </p>

            {/* Open To Badges */}
            {profile.openToBadges && profile.openToBadges.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                {profile.openToBadges.includes("research") && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#edf6f0] text-[#155738] border border-[#b8dec4] text-[11px] font-semibold rounded-full shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#1b6b47] animate-pulse" />
                    <span>Open to Research Collaboration</span>
                  </span>
                )}
                {profile.openToBadges.includes("internships") && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fef3eb] text-[#9f5138] border border-[#fbd3bc] text-[11px] font-semibold rounded-full shadow-2xs">
                    <Briefcase className="w-3 h-3 text-[#c46b4b]" />
                    <span>Seeking Summer / Fall Internships</span>
                  </span>
                )}
                {profile.openToBadges.includes("tutoring") && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f0f4fe] text-[#2563eb] border border-[#c7d9fe] text-[11px] font-semibold rounded-full shadow-2xs">
                    <BookOpen className="w-3 h-3 text-[#2563eb]" />
                    <span>Available for Peer Tutoring</span>
                  </span>
                )}
              </div>
            )}

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
            <div className="flex items-center gap-4 text-xs text-[#62736b] mt-3.5 pt-3.5 border-t border-black/[0.04]">
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
            <div className="mt-5 p-4 sm:p-5 bg-[#f8faf9] border border-black/[0.04] rounded-2xl shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-[#173a35]">
                  Profile Completeness Indicator
                </span>
                <span className="text-xs font-mono font-bold text-[#c46b4b]">
                  {completeness.percentage}%
                </span>
              </div>
              <div className="w-full bg-[#d8ddd8] rounded-full h-2 overflow-hidden mb-2.5 shadow-inner">
                <div
                  className="bg-gradient-to-r from-[#c46b4b] to-[#df805e] h-2 rounded-full transition-all duration-300"
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
                  className="text-xs text-[#c46b4b] font-bold hover:underline cursor-pointer"
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
        <div className="card-linkedin p-10 text-center">
          <Lock className="w-10 h-10 text-[#9f5138] mx-auto mb-2.5" />
          <h3 className="font-bold text-base text-[#173a35]">
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
            className="btn-3d-primary px-5 py-2.5 text-xs font-semibold cursor-pointer"
          >
            Connect to View Full Profile
          </button>
        </div>
      ) : (
        <>
          {/* 2. ABOUT SECTION */}
          <div className="card-linkedin p-6 sm:p-7">
            <div className="flex items-center justify-between mb-3.5 border-b border-black/[0.04] pb-2.5">
              <h2 className="font-semibold text-sm text-[#173a35]">
                About & Research Focus
              </h2>
              {isSelf && (
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-xs text-[#62736b] hover:text-[#173a35] p-1.5 rounded-full hover:bg-black/5 cursor-pointer"
                  title="Edit about statement"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-sm text-[#242b29] leading-relaxed whitespace-pre-line">
              {profile.about || "No personal statement provided yet."}
            </p>
          </div>

          {/* 3. EDUCATION & ACADEMIC CREDENTIALS */}
          <div className="card-linkedin p-6 sm:p-7">
            <div className="flex items-center justify-between mb-4 border-b border-black/[0.04] pb-2.5">
              <h2 className="font-semibold text-sm text-[#173a35]">
                Education & Academic Qualifications
              </h2>
              {isSelf && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEduToEdit(null)
                    setIsEduModalOpen(true)
                  }}
                  className="btn-3d-secondary flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Education</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {profile.education && profile.education.length > 0 ? (
                profile.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="flex items-start justify-between gap-4 pb-4 border-b border-black/[0.04] last:border-0 last:pb-0"
                  >
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      <div className="w-11 h-11 rounded-2xl bg-[#dce8df] text-[#173a35] flex items-center justify-center shrink-0 shadow-xs">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm sm:text-base text-[#173a35]">
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
                          <p className="text-xs text-[#4d5b54] mt-2.5 leading-relaxed bg-[#f8faf9] p-3 rounded-2xl border border-black/[0.04]">
                            <strong className="text-[#173a35]">
                              Activities & Societies:
                            </strong>{" "}
                            {edu.activities}
                          </p>
                        )}
                      </div>
                    </div>

                    {isSelf && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedEduToEdit(edu)
                            setIsEduModalOpen(true)
                          }}
                          className="p-1.5 text-[#62736b] hover:text-[#173a35] hover:bg-black/5 rounded-lg cursor-pointer"
                          title="Edit education"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteEducation?.(edu.id)}
                          className="p-1.5 text-[#62736b] hover:text-[#a33e32] hover:bg-black/5 rounded-lg cursor-pointer"
                          title="Delete education"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#62736b]">No education listed.</p>
              )}
            </div>
          </div>

          {/* 4. STUDENT PORTFOLIO, PROJECTS & ACCOMPLISHMENTS */}
          <div className="card-linkedin p-6 sm:p-7">
            <div className="flex items-center justify-between mb-4 border-b border-black/[0.04] pb-2.5">
              <div>
                <h2 className="font-semibold text-sm text-[#173a35]">
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
                  className="btn-3d-primary flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Work</span>
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-4 border-b border-black/[0.04] scrollbar-none">
              {portfolioTabOptions.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActivePortfolioTab(tab.id)}
                  className={`text-xs px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap font-medium cursor-pointer ${
                    activePortfolioTab === tab.id
                      ? "btn-3d-primary text-white"
                      : "bg-[#f4f6f5] text-[#62736b] hover:bg-white hover:shadow-xs"
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
              <div className="p-8 text-center bg-[#f8faf9] rounded-2xl border border-black/[0.04] text-xs text-[#62736b]">
                <p className="font-semibold text-[#173a35]">
                  No items listed under this category.
                </p>
                {isSelf && (
                  <button
                    type="button"
                    onClick={() => setIsAddPortfolioOpen(true)}
                    className="mt-2 text-[#c46b4b] font-bold hover:underline cursor-pointer"
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
                    className="p-4 sm:p-5 bg-[#f8faf9] rounded-2xl border border-black/[0.04] shadow-xs hover:shadow-md transition-all relative group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-white border border-black/[0.06] shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                          {getPortfolioIcon(item.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-sm text-[#173a35]">
                              {item.title}
                            </h3>
                            <span className="text-[11px] capitalize px-2.5 py-0.5 rounded-full bg-white border border-black/[0.06] text-[#62736b] shadow-2xs">
                              {item.type}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-[#62736b] mt-1">
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

                      {/* Remove / Edit item buttons for self */}
                      {isSelf && (
                        <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPortfolioToEdit(item)
                              setIsEditPortfolioOpen(true)
                            }}
                            className="text-[#62736b] hover:text-[#173a35] p-1.5 rounded-full hover:bg-black/5 cursor-pointer"
                            title="Edit work"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemovePortfolioItem(item.id)}
                            className="text-[#62736b] hover:text-[#a33e32] p-1.5 rounded-full hover:bg-black/5 cursor-pointer"
                            title="Delete item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-[#242b29] mt-3 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Skills pills */}
                    {item.skills && item.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {item.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2.5 py-0.5 bg-white rounded-full text-[#4d5b54] font-medium shadow-2xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* External Link */}
                    {item.linkUrl && (
                      <div className="mt-3.5 pt-2.5 border-t border-black/[0.04]">
                        <a
                          href={item.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-[#c46b4b] hover:underline font-semibold cursor-pointer"
                        >
                          <span>View Official Repository / Publication</span>
                          <ExternalLink className="w-3.5 h-3.5" />
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
            <div className="card-linkedin p-6">
              <h2 className="font-semibold text-sm text-[#173a35] mb-3.5 flex items-center justify-between">
                <span>
                  Skills & Endorsements ({profile.skills?.length || 0})
                </span>
                <span className="text-[10px] text-[#728078] font-normal">
                  Peer verified
                </span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, i) => {
                    const endorsements =
                      profile.skillEndorsements?.[skill] || []
                    const isEndorsedByMe = endorsements.includes(currentUser.id)

                    return (
                      <div
                        key={i}
                        className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-[#f4f6f5] rounded-full text-xs text-[#242b29] font-medium shadow-2xs border border-black/[0.04]"
                      >
                        <span>{skill}</span>
                        {endorsements.length > 0 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-white rounded-full text-[#173a35] font-bold shadow-2xs">
                            {endorsements.length}
                          </span>
                        )}
                        {!isSelf && onEndorseSkill && (
                          <button
                            type="button"
                            onClick={() => onEndorseSkill(profile.id, skill)}
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold transition-colors cursor-pointer ml-0.5 ${
                              isEndorsedByMe
                                ? "bg-[#173a35] text-white"
                                : "bg-white text-[#62736b] hover:text-[#173a35] hover:bg-[#edf2ee]"
                            }`}
                            title={
                              isEndorsedByMe
                                ? "Remove endorsement"
                                : "Endorse skill"
                            }
                          >
                            {isEndorsedByMe ? "✓ Endorsed" : "+ Endorse"}
                          </button>
                        )}
                        {isSelf && onRemoveSkill && (
                          <button
                            type="button"
                            onClick={() => onRemoveSkill(skill)}
                            className="text-[#87978f] hover:text-[#a33e32] ml-1 text-sm font-bold leading-none cursor-pointer"
                            title="Remove skill"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <p className="text-xs text-[#62736b]">No skills added.</p>
                )}

                {isSelf &&
                  onAddSkill &&
                  (showAddSkillInput ? (
                    <div className="flex items-center gap-1 bg-white border border-[#cbd3ce] rounded-full px-2.5 py-1 shadow-2xs">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Add skill..."
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newSkillInput.trim()) {
                            onAddSkill(newSkillInput.trim())
                            setNewSkillInput("")
                            setShowAddSkillInput(false)
                          }
                        }}
                        className="text-xs focus:outline-none w-24 bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newSkillInput.trim())
                            onAddSkill(newSkillInput.trim())
                          setNewSkillInput("")
                          setShowAddSkillInput(false)
                        }}
                        className="text-xs font-bold text-[#173a35] cursor-pointer"
                      >
                        ✓
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNewSkillInput("")
                          setShowAddSkillInput(false)
                        }}
                        className="text-xs font-bold text-[#62736b] cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowAddSkillInput(true)}
                      className="text-xs px-3 py-1 rounded-full border border-dashed border-[#cbd3ce] text-[#62736b] hover:text-[#173a35] hover:border-[#173a35] cursor-pointer"
                    >
                      + Add Skill
                    </button>
                  ))}
              </div>
            </div>

            {/* Academic Interests */}
            <div className="card-linkedin p-6">
              <h2 className="font-semibold text-sm text-[#173a35] mb-3.5 flex items-center justify-between">
                <span>Academic & Research Interests</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.interests && profile.interests.length > 0 ? (
                  profile.interests.map((interest, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#dce8df] text-[#173a35] rounded-full text-xs font-medium shadow-2xs"
                    >
                      <span>#{interest}</span>
                      {isSelf && onRemoveInterest && (
                        <button
                          type="button"
                          onClick={() => onRemoveInterest(interest)}
                          className="text-[#62736b] hover:text-[#a33e32] ml-1 text-sm font-bold leading-none cursor-pointer"
                          title="Remove interest"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-[#62736b]">No interests added.</p>
                )}

                {isSelf &&
                  onAddInterest &&
                  (showAddInterestInput ? (
                    <div className="flex items-center gap-1 bg-white border border-[#cbd3ce] rounded-full px-2.5 py-1 shadow-2xs">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Add topic..."
                        value={newInterestInput}
                        onChange={(e) => setNewInterestInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newInterestInput.trim()) {
                            onAddInterest(newInterestInput.trim())
                            setNewInterestInput("")
                            setShowAddInterestInput(false)
                          }
                        }}
                        className="text-xs focus:outline-none w-24 bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newInterestInput.trim())
                            onAddInterest(newInterestInput.trim())
                          setNewInterestInput("")
                          setShowAddInterestInput(false)
                        }}
                        className="text-xs font-bold text-[#173a35] cursor-pointer"
                      >
                        ✓
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNewInterestInput("")
                          setShowAddInterestInput(false)
                        }}
                        className="text-xs font-bold text-[#62736b] cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowAddInterestInput(true)}
                      className="text-xs px-3 py-1 rounded-full border border-dashed border-[#cbd3ce] text-[#62736b] hover:text-[#173a35] hover:border-[#173a35] cursor-pointer"
                    >
                      + Add Interest
                    </button>
                  ))}
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

      <EditPortfolioItemModal
        isOpen={isEditPortfolioOpen}
        onClose={() => {
          setIsEditPortfolioOpen(false)
          setSelectedPortfolioToEdit(null)
        }}
        item={selectedPortfolioToEdit}
        onSave={(itemId, updates) => {
          if (onUpdatePortfolioItem) {
            onUpdatePortfolioItem(itemId, updates)
          }
        }}
      />

      <EducationModal
        isOpen={isEduModalOpen}
        onClose={() => {
          setIsEduModalOpen(false)
          setSelectedEduToEdit(null)
        }}
        initialData={selectedEduToEdit}
        onSave={(edu, editId) => {
          if (editId && onUpdateEducation) {
            onUpdateEducation(editId, edu)
          } else if (onAddEducation) {
            onAddEducation(edu)
          }
        }}
        onDelete={onDeleteEducation}
      />

      <ExportCvModal
        isOpen={isExportCvOpen}
        onClose={() => setIsExportCvOpen(false)}
        profile={profile}
      />
    </div>
  )
}
