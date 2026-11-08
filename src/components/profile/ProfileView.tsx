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
  Eye,
  Link as LinkIcon,
  Code,
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
  onRemoveConnection?: (userId: string) => void
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
  onRemoveConnection,
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

  // Preview Mode: Allows user to preview their profile as external viewers see it
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const [newSkillInput, setNewSkillInput] = useState("")
  const [showAddSkillInput, setShowAddSkillInput] = useState(false)
  const [newInterestInput, setNewInterestInput] = useState("")
  const [showAddInterestInput, setShowAddInterestInput] = useState(false)

  const [activePortfolioTab, setActivePortfolioTab] = useState<string>("all")
  const [copiedLink, setCopiedLink] = useState(false)

  const effectiveIsSelf = isSelf && !isPreviewMode

  const completeness = useMemo(
    () => calculateProfileCompleteness(profile),
    [profile],
  )

  const isConnected = profile.connectionStatus === "connected"
  const isPendingSent = profile.connectionStatus === "pending_sent"
  const isPendingReceived = profile.connectionStatus === "pending_received"

  // Visibility check: If not public and not self and not connected
  const isRestricted =
    !profile.isPublic && !isSelf && !isConnected && !isPreviewMode

  const profileUrl = `${window.location.origin}/p/${profile.username || profile.id}`

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(profileUrl)
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
    {
      id: "work",
      label: "Experience",
      count:
        profile.portfolioItems?.filter((p) => p.type === "work").length || 0,
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
      case "work":
        return <Building className="w-4 h-4 text-[#173a35]" />
      default:
        return <ShieldCheck className="w-4 h-4 text-[#0369a1]" />
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-5 py-5 sm:py-8 space-y-6">
      {/* PREVIEW MODE BANNER */}
      {isSelf && (
        <div className="flex items-center justify-between p-3 px-4 bg-white border border-[#cbd3ce] rounded-2xl shadow-sm text-xs">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#173a35]" />
            <span className="font-semibold text-[#173a35]">
              {isPreviewMode
                ? "Preview Mode Active — You are viewing your profile exactly as external students see it."
                : "Author Mode — You can edit credentials, projects, and visibility settings."}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="btn-3d-secondary px-3.5 py-1 text-xs font-semibold cursor-pointer"
          >
            {isPreviewMode ? "Return to Edit Mode" : "Preview Public View"}
          </button>
        </div>
      )}

      {/* 1. PROFILE HEADER CARD */}
      <div className="card-linkedin overflow-hidden">
        {/* Banner Cover Image */}
        <div className="h-44 sm:h-60 bg-gradient-to-r from-[#173a35] to-[#102d29] relative">
          {profile.coverImage && (
            <img
              src={profile.coverImage}
              alt="Profile Cover"
              className="w-full h-full object-cover opacity-80"
            />
          )}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {profile.isPublic ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur-xs text-[#173a35] text-[11px] font-semibold rounded-full shadow-sm">
                <Globe className="w-3 h-3 text-[#173a35]" />
                <span>Public Profile</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur-xs text-[#9f5138] text-[11px] font-semibold rounded-full shadow-sm">
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
                title="Verified Student Scholar"
              >
                <ShieldCheck className="w-4 h-4 text-[#dce8df]" />
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {effectiveIsSelf ? (
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
                    title="Share profile link"
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
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onStartMessage(profile.id)}
                        className="btn-3d-primary flex items-center gap-1.5 px-4.5 py-2 text-xs font-semibold cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Message</span>
                      </button>
                      {onRemoveConnection && (
                        <button
                          type="button"
                          onClick={() => onRemoveConnection(profile.id)}
                          className="px-3 py-2 text-xs text-[#a33e32] hover:bg-[#fdf3f2] rounded-xl border border-[#f1c5c0] cursor-pointer"
                          title="Remove connection"
                        >
                          Disconnect
                        </button>
                      )}
                    </div>
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

                  {/* Direct message shortcut if not connected */}
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

                  {/* Export CV button */}
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
                    className="p-2 text-[#62736b] hover:text-[#a33e32] hover:bg-black/5 rounded-xl cursor-pointer"
                    title="Report profile"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Student Name & Handles */}
          <div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#173a35]">
                {profile.name}
              </h1>
              {profile.username && (
                <span className="text-xs text-[#728078] font-mono font-medium">
                  @{profile.username}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#242b29] font-medium mt-1 leading-snug">
              {profile.headline || `Student @ ${profile.institution}`}
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
            <div className="flex items-center gap-4 text-xs text-[#62736b] mt-3.5 pt-3.5 border-t border-black/[0.04]">
              <div>
                <strong className="text-[#173a35] font-mono">
                  {profile.connectionsCount || 0}
                </strong>{" "}
                connections
              </div>
              <div>
                <strong className="text-[#173a35] font-mono">
                  {profile.followersCount || 0}
                </strong>{" "}
                followers
              </div>
              {profile.username && (
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="text-[11px] text-[#c46b4b] hover:underline font-mono ml-auto"
                >
                  {copiedLink
                    ? "✓ Link Copied"
                    : `credento.org/p/${profile.username}`}
                </button>
              )}
            </div>

            {/* Social Links Row */}
            {profile.socialLinks && (
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-black/[0.04]">
                {profile.socialLinks.website && (
                  <a
                    href={profile.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f4f6f5] hover:bg-[#eef2f0] text-[11px] text-[#173a35] font-medium"
                  >
                    <ExternalLink className="w-3 h-3 text-[#62736b]" />
                    <span>Portfolio</span>
                  </a>
                )}
                {profile.socialLinks.github && (
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f4f6f5] hover:bg-[#eef2f0] text-[11px] text-[#173a35] font-medium"
                  >
                    <Code className="w-3 h-3 text-[#62736b]" />
                    <span>GitHub</span>
                  </a>
                )}
                {profile.socialLinks.linkedin && (
                  <a
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f4f6f5] hover:bg-[#eef2f0] text-[11px] text-[#173a35] font-medium"
                  >
                    <ExternalLink className="w-3 h-3 text-[#0369a1]" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {profile.socialLinks.scholar && (
                  <a
                    href={profile.socialLinks.scholar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f4f6f5] hover:bg-[#eef2f0] text-[11px] text-[#173a35] font-medium"
                  >
                    <BookOpen className="w-3 h-3 text-[#c46b4b]" />
                    <span>Google Scholar</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Profile Completeness Recommendation Bar (Self only in Edit Mode) */}
          {effectiveIsSelf && completeness.percentage < 100 && (
            <div className="mt-5 p-4 sm:p-5 bg-[#f8faf9] border border-black/[0.04] rounded-2xl shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-[#173a35]">
                  Profile Completion Guidance
                </span>
                <span className="text-xs font-mono font-bold text-[#c46b4b]">
                  {completeness.percentage}% Complete
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
                  Complete your profile to build credibility. Missing:{" "}
                  <strong>{completeness.missingFields.join(", ")}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-xs text-[#c46b4b] font-bold hover:underline cursor-pointer"
                >
                  Complete Profile →
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
          {/* 2. ABOUT / STATEMENT OF PURPOSE */}
          <div className="card-linkedin p-6 sm:p-7">
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="font-semibold text-sm text-[#173a35]">About</h2>
              {effectiveIsSelf && (
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-1 text-[#62736b] hover:text-[#173a35] cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {profile.about ? (
              <p className="text-xs sm:text-sm text-[#3b4742] leading-relaxed whitespace-pre-line">
                {profile.about}
              </p>
            ) : (
              <div className="p-4 bg-[#f8faf9] rounded-xl text-center text-xs text-[#62736b]">
                <p>No biography added yet.</p>
                {effectiveIsSelf && (
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-[#c46b4b] font-semibold hover:underline mt-1 block mx-auto"
                  >
                    + Write about your academic focus
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 3. EDUCATION SECTION */}
          <div className="card-linkedin p-6 sm:p-7">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm text-[#173a35]">
                Education
              </h2>
              {effectiveIsSelf && onAddEducation && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEduToEdit(null)
                    setIsEduModalOpen(true)
                  }}
                  className="btn-3d-secondary flex items-center gap-1 px-3 py-1 text-xs font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add School</span>
                </button>
              )}
            </div>

            {profile.education && profile.education.length > 0 ? (
              <div className="space-y-4">
                {profile.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="flex items-start justify-between gap-3 pb-4 border-b border-black/[0.04] last:border-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#eef2f0] flex items-center justify-center text-[#173a35] shrink-0 mt-0.5">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div className="text-xs">
                        <h3 className="font-bold text-sm text-[#173a35]">
                          {edu.institution}
                        </h3>
                        <p className="font-medium text-[#242b29] mt-0.5">
                          {edu.degree} — {edu.fieldOfStudy}
                        </p>
                        <p className="text-[11px] text-[#728078] mt-0.5">
                          {edu.startYear} – {edu.endYear}
                          {edu.gradeOrGpa && ` • ${edu.gradeOrGpa}`}
                        </p>
                        {edu.activities && (
                          <p className="text-[#62736b] mt-1.5 leading-relaxed text-[11px]">
                            {edu.activities}
                          </p>
                        )}
                      </div>
                    </div>

                    {effectiveIsSelf && onUpdateEducation && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedEduToEdit(edu)
                            setIsEduModalOpen(true)
                          }}
                          className="p-1.5 text-[#62736b] hover:text-[#173a35] cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-[#f8faf9] rounded-2xl text-center text-xs text-[#62736b]">
                <GraduationCap className="w-8 h-8 text-[#173a35]/40 mx-auto mb-2" />
                <p className="font-semibold text-[#173a35]">
                  No education history recorded yet.
                </p>
                <p className="text-[11px] mt-0.5">
                  Add your current university and previous institutions.
                </p>
                {effectiveIsSelf && onAddEducation && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedEduToEdit(null)
                      setIsEduModalOpen(true)
                    }}
                    className="btn-3d-secondary mt-3 px-4 py-1.5 text-xs font-semibold"
                  >
                    + Add University or Degree
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 4. ACADEMIC & PROFESSIONAL ACCOMPLISHMENTS (PORTFOLIO) */}
          <div className="card-linkedin p-6 sm:p-7">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h2 className="font-semibold text-sm text-[#173a35]">
                  Scholarly Accomplishments & Portfolio
                </h2>
                <p className="text-[11px] text-[#728078] mt-0.5">
                  Verified projects, published papers, awards, certificates, and
                  leadership roles.
                </p>
              </div>

              {effectiveIsSelf && (
                <button
                  type="button"
                  onClick={() => setIsAddPortfolioOpen(true)}
                  className="btn-3d-primary flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 pb-4 border-b border-black/[0.04]">
              {portfolioTabOptions.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActivePortfolioTab(tab.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    activePortfolioTab === tab.id
                      ? "bg-[#173a35] text-white"
                      : "bg-[#f4f6f5] text-[#62736b] hover:text-[#173a35]"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`ml-1.5 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                        activePortfolioTab === tab.id
                          ? "bg-white/20 text-white"
                          : "bg-white text-[#173a35]"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* List */}
            {filteredPortfolio.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {filteredPortfolio.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#f8faf9] border border-black/[0.04] hover:bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 text-xs text-[#62736b]">
                          {getPortfolioIcon(item.type)}
                          <span className="capitalize font-semibold text-[11px] text-[#173a35]">
                            {item.type}
                          </span>
                          <span>•</span>
                          <span className="text-[10px]">{item.date}</span>
                        </div>

                        {effectiveIsSelf && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPortfolioToEdit(item)
                                setIsEditPortfolioOpen(true)
                              }}
                              className="p-1 text-[#62736b] hover:text-[#173a35] cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onRemovePortfolioItem(item.id)}
                              className="p-1 text-[#62736b] hover:text-[#a33e32] cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      <h3 className="font-bold text-xs sm:text-sm text-[#173a35]">
                        {item.title}
                      </h3>
                      {item.organization && (
                        <p className="text-[11px] text-[#c46b4b] font-medium mt-0.5">
                          {item.organization}
                        </p>
                      )}
                      <p className="text-xs text-[#4d5b54] mt-2 leading-relaxed">
                        {item.description}
                      </p>

                      {item.credentialId && (
                        <div className="mt-2 text-[10px] font-mono text-[#728078] bg-white p-1.5 rounded-lg border border-black/5">
                          Credential ID: {item.credentialId}
                        </div>
                      )}

                      {/* Skills */}
                      {item.skills && item.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {item.skills.map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-white text-[10px] text-[#173a35] font-medium border border-black/5"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {item.linkUrl && (
                      <div className="pt-3 mt-3 border-t border-black/[0.04]">
                        <a
                          href={item.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[#c46b4b] font-bold hover:underline"
                        >
                          <span>View Official Link / Repository</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-[#62736b]">
                <FolderGit2 className="w-8 h-8 text-[#173a35]/40 mx-auto mb-2" />
                <p className="font-semibold text-[#173a35]">
                  {activePortfolioTab === "all"
                    ? "Your portfolio is ready to build."
                    : `No ${activePortfolioTab} items recorded yet.`}
                </p>
                <p className="text-[11px] mt-0.5">
                  Publish research preprints, technical projects, and awards to
                  showcase your academic journey.
                </p>
                {effectiveIsSelf && (
                  <button
                    type="button"
                    onClick={() => setIsAddPortfolioOpen(true)}
                    className="btn-3d-secondary mt-3 px-4 py-1.5 text-xs font-semibold"
                  >
                    + Add First Project or Award
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 5. SKILLS & INTERESTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills with Endorsements */}
            <div className="card-linkedin p-6">
              <h2 className="font-semibold text-sm text-[#173a35] mb-3.5 flex items-center justify-between">
                <span>Core Competencies & Skills</span>
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
                          >
                            {isEndorsedByMe ? "✓ Endorsed" : "+ Endorse"}
                          </button>
                        )}
                        {effectiveIsSelf && onRemoveSkill && (
                          <button
                            type="button"
                            onClick={() => onRemoveSkill(skill)}
                            className="text-[#87978f] hover:text-[#a33e32] ml-1 text-sm font-bold leading-none cursor-pointer"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <p className="text-xs text-[#62736b]">No skills added yet.</p>
                )}

                {effectiveIsSelf &&
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
                      {effectiveIsSelf && onRemoveInterest && (
                        <button
                          type="button"
                          onClick={() => onRemoveInterest(interest)}
                          className="text-[#62736b] hover:text-[#a33e32] ml-1 text-sm font-bold leading-none cursor-pointer"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-[#62736b]">
                    No interests added yet.
                  </p>
                )}

                {effectiveIsSelf &&
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
