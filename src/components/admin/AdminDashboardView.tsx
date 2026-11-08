import React, { useState, useMemo } from "react"
import {
  AccessCenterOrganization,
  CenterStatus,
  OfficialAnnouncement,
  Opportunity,
  Post,
  ReportItem,
  ReportStatus,
  StudentProfile,
} from "../../types"
import {
  ShieldAlert,
  Users,
  Building,
  AlertTriangle,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart3,
  Search,
  Filter,
  Trash2,
  Lock,
  LogOut,
  Send,
  ExternalLink,
  ChevronRight,
  Eye,
  Check,
  X,
  FileText,
} from "lucide-react"

interface AdminDashboardViewProps {
  stats: {
    totalRegisteredUsers: number
    totalCompletedProfiles: number
    activeUsers: number
    suspendedUsers: number
    totalConnections: number
    totalPosts: number
    totalOpportunities: number
    totalAccessCenters: number
    pendingAccessCenters: number
    pendingReports: number
    totalServiceRequests: number
  }
  allUsers: StudentProfile[]
  allCenters: AccessCenterOrganization[]
  allReports: ReportItem[]
  allAnnouncements: OfficialAnnouncement[]
  posts: Post[]
  opportunities: Opportunity[]
  onSuspendUser: (userId: string, reason: string) => void
  onReactivateUser: (userId: string) => void
  onDeleteUser: (userId: string) => void
  onApproveCenter: (centerId: string, adminNotes?: string) => void
  onRejectCenter: (centerId: string, reason: string) => void
  onSuspendCenter: (centerId: string, reason?: string) => void
  onReactivateCenter: (centerId: string) => void
  onDeleteCenter: (centerId: string) => void
  onResolveReport: (
    reportId: string,
    status: ReportStatus,
    notes?: string,
  ) => void
  onDeletePost: (postId: string) => void
  onBroadcastAnnouncement: (params: {
    title: string
    content: string
    type: OfficialAnnouncement["type"]
    targetType: "all" | "user"
    targetUserId?: string
  }) => void
  onExitAdmin: () => void
  onSelectStudentProfile: (studentId: string) => void
}

export function AdminDashboardView({
  stats,
  allUsers,
  allCenters,
  allReports,
  allAnnouncements,
  posts,
  opportunities,
  onSuspendUser,
  onReactivateUser,
  onDeleteUser,
  onApproveCenter,
  onRejectCenter,
  onSuspendCenter,
  onReactivateCenter,
  onDeleteCenter,
  onResolveReport,
  onDeletePost,
  onBroadcastAnnouncement,
  onExitAdmin,
  onSelectStudentProfile,
}: AdminDashboardViewProps) {
  const [activeTab, setActiveTab] =
    useState<"overview" | "users" | "centers" | "announcements" | "reports">(
      "overview",
    )

  // User management state
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [selectedUserToSuspend, setSelectedUserToSuspend] =
    useState<StudentProfile | null>(null)
  const [suspendReason, setSuspendReason] = useState("")
  const [userToDelete, setUserToDelete] = useState<StudentProfile | null>(null)

  // Centers state
  const [centerStatusFilter, setCenterStatusFilter] =
    useState<CenterStatus | "all">("all")
  const [selectedCenterToReject, setSelectedCenterToReject] =
    useState<AccessCenterOrganization | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  // Official messages state
  const [announcementTitle, setAnnouncementTitle] = useState("")
  const [announcementContent, setAnnouncementContent] = useState("")
  const [announcementType, setAnnouncementType] =
    useState<OfficialAnnouncement["type"]>("announcement")
  const [announcementTargetType, setAnnouncementTargetType] =
    useState<"all" | "user">("all")
  const [announcementTargetUserId, setAnnouncementTargetUserId] = useState("")
  const [broadcastSent, setBroadcastSent] = useState(false)

  // Reports state
  const [reportStatusFilter, setReportStatusFilter] =
    useState<ReportStatus | "all">("all")
  const [selectedReportToResolve, setSelectedReportToResolve] =
    useState<ReportItem | null>(null)
  const [resolutionNotes, setResolutionNotes] = useState("")

  // Filtered users
  const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      if (!userSearchQuery.trim()) return true
      const q = userSearchQuery.toLowerCase()
      return (
        u.name.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q) ||
        u.institution.toLowerCase().includes(q)
      )
    })
  }, [allUsers, userSearchQuery])

  // Filtered centers
  const filteredCenters = useMemo(() => {
    return allCenters.filter((c) => {
      if (centerStatusFilter === "all") return true
      return c.status === centerStatusFilter
    })
  }, [allCenters, centerStatusFilter])

  // Filtered reports
  const filteredReports = useMemo(() => {
    return allReports.filter((r) => {
      if (reportStatusFilter === "all") return true
      return r.status === reportStatusFilter
    })
  }, [allReports, reportStatusFilter])

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!announcementTitle.trim() || !announcementContent.trim()) return

    onBroadcastAnnouncement({
      title: announcementTitle.trim(),
      content: announcementContent.trim(),
      type: announcementType,
      targetType: announcementTargetType,
      targetUserId:
        announcementTargetType === "user"
          ? announcementTargetUserId
          : undefined,
    })

    setBroadcastSent(true)
    setTimeout(() => {
      setBroadcastSent(false)
      setAnnouncementTitle("")
      setAnnouncementContent("")
    }, 2500)
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-5 py-5 sm:py-8 space-y-6">
      {/* Top Header */}
      <div className="card-linkedin p-6 sm:p-7 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#173a35] text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldAlert className="w-6 h-6 text-[#c46b4b]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#173a35]">
                  Credento Administration & Operations
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#edf6f0] text-[#155738] font-mono text-[10px] font-bold border border-[#b8dec4]">
                  Secure Staff Session
                </span>
              </div>
              <p className="text-xs text-[#62736b] mt-0.5">
                Global platform oversight, user moderation, Access Center
                verification, and official communications.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onExitAdmin}
            className="btn-3d-secondary flex items-center gap-1.5 px-4 py-2 text-xs font-semibold cursor-pointer text-[#a33e32] hover:bg-[#fdf3f2]"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit Admin Mode</span>
          </button>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-black/[0.06]">
          {[
            { id: "overview", label: "Platform Overview", icon: BarChart3 },
            {
              id: "users",
              label: `Scholars & Profiles (${allUsers.length})`,
              icon: Users,
            },
            {
              id: "centers",
              label: `Access Centers (${stats.pendingAccessCenters} Pending)`,
              icon: Building,
              badge: stats.pendingAccessCenters,
            },
            {
              id: "announcements",
              label: "Official Credento Communications",
              icon: MessageSquare,
            },
            {
              id: "reports",
              label: `Moderation & Safety (${stats.pendingReports} Pending)`,
              icon: AlertTriangle,
              badge: stats.pendingReports,
            },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#173a35] text-white shadow-sm"
                    : "bg-[#f4f6f5] text-[#62736b] hover:bg-[#eef2f0] hover:text-[#173a35]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? "bg-[#c46b4b] text-white"
                        : "bg-[#c46b4b] text-white"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 1. OVERVIEW & METRICS */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-black/[0.06] shadow-xs">
              <span className="text-[11px] font-bold text-[#62736b] uppercase tracking-wider block mb-1">
                Registered Students
              </span>
              <p className="text-2xl font-bold font-mono text-[#173a35]">
                {stats.totalRegisteredUsers}
              </p>
              <p className="text-[10px] text-[#728078] mt-1">
                {stats.activeUsers} active • {stats.suspendedUsers} suspended
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-black/[0.06] shadow-xs">
              <span className="text-[11px] font-bold text-[#62736b] uppercase tracking-wider block mb-1">
                Completed Profiles
              </span>
              <p className="text-2xl font-bold font-mono text-[#1b6b47]">
                {stats.totalCompletedProfiles}
              </p>
              <p className="text-[10px] text-[#728078] mt-1">
                ≥70% profile completeness
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-black/[0.06] shadow-xs">
              <span className="text-[11px] font-bold text-[#62736b] uppercase tracking-wider block mb-1">
                Established Connections
              </span>
              <p className="text-2xl font-bold font-mono text-[#173a35]">
                {stats.totalConnections}
              </p>
              <p className="text-[10px] text-[#728078] mt-1">
                Relational student pairs
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-black/[0.06] shadow-xs">
              <span className="text-[11px] font-bold text-[#62736b] uppercase tracking-wider block mb-1">
                Academic Posts
              </span>
              <p className="text-2xl font-bold font-mono text-[#173a35]">
                {stats.totalPosts}
              </p>
              <p className="text-[10px] text-[#728078] mt-1">
                Live feed updates
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-black/[0.06] shadow-xs">
              <span className="text-[11px] font-bold text-[#62736b] uppercase tracking-wider block mb-1">
                Access Centers (Approved)
              </span>
              <p className="text-2xl font-bold font-mono text-[#173a35]">
                {stats.totalAccessCenters}
              </p>
              <p className="text-[10px] text-[#728078] mt-1">
                {stats.pendingAccessCenters} pending review
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-black/[0.06] shadow-xs">
              <span className="text-[11px] font-bold text-[#62736b] uppercase tracking-wider block mb-1">
                Service Requests
              </span>
              <p className="text-2xl font-bold font-mono text-[#0369a1]">
                {stats.totalServiceRequests}
              </p>
              <p className="text-[10px] text-[#728078] mt-1">
                Free services requested
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-black/[0.06] shadow-xs">
              <span className="text-[11px] font-bold text-[#62736b] uppercase tracking-wider block mb-1">
                Opportunities
              </span>
              <p className="text-2xl font-bold font-mono text-[#173a35]">
                {stats.totalOpportunities}
              </p>
              <p className="text-[10px] text-[#728078] mt-1">
                Scholarships & grants
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-black/[0.06] shadow-xs">
              <span className="text-[11px] font-bold text-[#62736b] uppercase tracking-wider block mb-1">
                Pending Reports
              </span>
              <p className="text-2xl font-bold font-mono text-[#a33e32]">
                {stats.pendingReports}
              </p>
              <p className="text-[10px] text-[#728078] mt-1">
                Requires moderator action
              </p>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="card-linkedin p-5 space-y-2">
              <h3 className="font-bold text-sm text-[#173a35] flex items-center gap-1.5">
                <Building className="w-4 h-4 text-[#c46b4b]" />
                <span>Pending Access Center Reviews</span>
              </h3>
              <p className="text-xs text-[#62736b]">
                {stats.pendingAccessCenters} organization applications await
                verification.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCenterStatusFilter("pending")
                  setActiveTab("centers")
                }}
                className="btn-3d-secondary mt-2 w-full py-2 text-xs font-semibold"
              >
                Review Organizations →
              </button>
            </div>

            <div className="card-linkedin p-5 space-y-2">
              <h3 className="font-bold text-sm text-[#173a35] flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#173a35]" />
                <span>Credento Team Broadcast</span>
              </h3>
              <p className="text-xs text-[#62736b]">
                Issue platform alerts, safety notices, and academic guidelines
                to all members.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("announcements")}
                className="btn-3d-secondary mt-2 w-full py-2 text-xs font-semibold"
              >
                Draft Announcement →
              </button>
            </div>

            <div className="card-linkedin p-5 space-y-2">
              <h3 className="font-bold text-sm text-[#173a35] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#a33e32]" />
                <span>Safety & Moderation Inbox</span>
              </h3>
              <p className="text-xs text-[#62736b]">
                {stats.pendingReports} items flagged by scholars for community
                standards review.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("reports")}
                className="btn-3d-secondary mt-2 w-full py-2 text-xs font-semibold"
              >
                Review Reports ({stats.pendingReports}) →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. USER & PROFILE MANAGEMENT */}
      {activeTab === "users" && (
        <div className="card-linkedin p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="font-bold text-base text-[#173a35]">
                Registered Student Accounts ({allUsers.length})
              </h2>
              <p className="text-xs text-[#62736b]">
                Inspect student credentials, review reports, and manage account
                statuses.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#62736b] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name, email, university..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#f8faf9] rounded-xl text-xs border border-black/10 focus:outline-none focus:border-[#173a35]"
              />
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#62736b]">
              No student accounts found matching your query.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-black/[0.06] text-[#62736b]">
                    <th className="py-2.5 font-bold">Student</th>
                    <th className="py-2.5 font-bold">University & Major</th>
                    <th className="py-2.5 font-bold">Status</th>
                    <th className="py-2.5 font-bold">Connections</th>
                    <th className="py-2.5 font-bold text-right">
                      Moderation Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04]">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#f8faf9]">
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <button
                              type="button"
                              onClick={() => onSelectStudentProfile(u.id)}
                              className="font-bold text-[#173a35] hover:underline block text-left"
                            >
                              {u.name}
                            </button>
                            <span className="text-[10px] text-[#728078] font-mono">
                              @{u.username || "student"} • {u.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 pr-2 text-[#4d5b54]">
                        <p className="font-semibold text-[#173a35] truncate max-w-[200px]">
                          {u.institution}
                        </p>
                        <p className="text-[10px] text-[#728078] truncate max-w-[200px]">
                          {u.degree}
                        </p>
                      </td>

                      <td className="py-3 pr-2">
                        {u.isSuspended ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fee2e2] text-[#b91c1c]">
                            Suspended
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#edf6f0] text-[#155738]">
                            Active
                          </span>
                        )}
                      </td>

                      <td className="py-3 pr-2 font-mono text-[#62736b]">
                        {u.connectionsCount || 0}
                      </td>

                      <td className="py-3 text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectStudentProfile(u.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-[#173a35] hover:bg-[#eef2f0] rounded-lg cursor-pointer"
                        >
                          View Profile
                        </button>

                        {u.isSuspended ? (
                          <button
                            type="button"
                            onClick={() => onReactivateUser(u.id)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-[#1b6b47] hover:bg-[#edf6f0] rounded-lg cursor-pointer"
                          >
                            Reactivate
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUserToSuspend(u)
                              setSuspendReason("")
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold text-[#a33e32] hover:bg-[#fdf3f2] rounded-lg cursor-pointer"
                          >
                            Suspend
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setUserToDelete(u)}
                          className="px-2 py-1 text-[11px] text-[#728078] hover:text-[#a33e32] rounded-lg cursor-pointer"
                          title="Delete account permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Suspend User Modal */}
          {selectedUserToSuspend && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-xs">
                <h3 className="font-bold text-sm text-[#173a35]">
                  Suspend Scholar Account: {selectedUserToSuspend.name}
                </h3>
                <p className="text-[#62736b]">
                  Suspended accounts are locked from login, posting, and
                  networking.
                </p>
                <div>
                  <label className="block font-bold text-[#173a35] mb-1">
                    Suspension Reason *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Violation of Academic Standards, fraudulent profile claims, or harassment..."
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                    className="w-full p-2.5 bg-white border border-black/10 rounded-xl"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedUserToSuspend(null)}
                    className="px-4 py-2 font-semibold text-[#62736b]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSuspendUser(
                        selectedUserToSuspend.id,
                        suspendReason.trim() ||
                          "Violation of Credento Community Standards.",
                      )
                      setSelectedUserToSuspend(null)
                    }}
                    className="px-4 py-2 bg-[#a33e32] text-white font-semibold rounded-xl"
                  >
                    Confirm Suspension
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete User Modal */}
          {userToDelete && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-xs">
                <h3 className="font-bold text-sm text-[#a33e32]">
                  Permanently Delete Account?
                </h3>
                <p className="text-[#62736b] leading-relaxed">
                  Are you sure you want to permanently delete{" "}
                  <strong>{userToDelete.name}</strong> (@
                  {userToDelete.username || userToDelete.id})? This will
                  eradicate all profile items, posts, and connections. This
                  action cannot be undone.
                </p>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setUserToDelete(null)}
                    className="px-4 py-2 font-semibold text-[#62736b]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteUser(userToDelete.id)
                      setUserToDelete(null)
                    }}
                    className="px-4 py-2 bg-[#a33e32] text-white font-semibold rounded-xl"
                  >
                    Yes, Delete Permanently
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. ACCESS CENTERS & APPLICATIONS */}
      {activeTab === "centers" && (
        <div className="card-linkedin p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="font-bold text-base text-[#173a35]">
                Access Center Applications & Approvals
              </h2>
              <p className="text-xs text-[#62736b]">
                Review incoming applications from NGOs, schools, and healthcare
                groups. Only approved centers are published publicly.
              </p>
            </div>

            <div className="flex gap-1.5">
              {([
                "all",
                "pending",
                "approved",
                "rejected",
                "suspended",
              ] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setCenterStatusFilter(status)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize cursor-pointer ${
                    centerStatusFilter === status
                      ? "bg-[#173a35] text-white"
                      : "bg-[#f4f6f5] text-[#62736b] hover:bg-[#eef2f0]"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredCenters.map((center) => (
              <div
                key={center.id}
                className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={center.logo}
                      alt={center.name}
                      className="w-12 h-12 rounded-xl object-cover p-1 bg-white border border-black/10 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-[#173a35]">
                          {center.name}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                            center.status === "approved"
                              ? "bg-[#edf6f0] text-[#155738]"
                              : center.status === "pending"
                                ? "bg-[#fef3c7] text-[#b45309]"
                                : center.status === "suspended"
                                  ? "bg-[#f3e8ff] text-[#7e22ce]"
                                  : "bg-[#fee2e2] text-[#b91c1c]"
                          }`}
                        >
                          {center.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#c46b4b] font-medium mt-0.5">
                        {center.tagline}
                      </p>
                      <p className="text-[11px] text-[#728078] mt-0.5">
                        Type:{" "}
                        <span className="capitalize">
                          {center.type.replace("_", " ")}
                        </span>{" "}
                        • Contact: {center.email} • {center.website}
                      </p>
                    </div>
                  </div>

                  {/* Actions based on center status */}
                  <div className="flex flex-wrap items-center gap-2 sm:self-start">
                    {center.status === "pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() => onApproveCenter(center.id)}
                          className="btn-3d-primary px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Publish</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCenterToReject(center)
                            setRejectionReason("")
                          }}
                          className="btn-3d-secondary px-3 py-1.5 text-xs font-semibold text-[#a33e32]"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {center.status === "approved" && (
                      <button
                        type="button"
                        onClick={() => onSuspendCenter(center.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-[#b45309] hover:bg-[#fef3c7] rounded-xl border border-[#fde68a]"
                      >
                        Suspend Center
                      </button>
                    )}

                    {center.status === "suspended" && (
                      <button
                        type="button"
                        onClick={() => onReactivateCenter(center.id)}
                        className="btn-3d-primary px-3.5 py-1.5 text-xs font-semibold"
                      >
                        Reactivate Center
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDeleteCenter(center.id)}
                      className="p-1.5 text-[#728078] hover:text-[#a33e32] rounded-lg"
                      title="Remove center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#f8faf9] rounded-xl text-xs text-[#4d5b54] space-y-1">
                  <p>
                    <strong>Mission:</strong> "{center.mission}"
                  </p>
                  <p className="text-[11px] text-[#62736b]">
                    {center.description}
                  </p>
                  {center.applicantName && (
                    <p className="text-[11px] text-[#728078]">
                      Applicant: {center.applicantName} ({center.applicantEmail}
                      )
                    </p>
                  )}
                  {center.rejectionReason && (
                    <p className="text-[11px] text-[#a33e32]">
                      Rejection Reason: {center.rejectionReason}
                    </p>
                  )}
                </div>

                {/* Services summary */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="font-bold text-[#173a35] text-[11px]">
                    Services Offered ({center.services.length}):
                  </span>
                  {center.services.map((s) => (
                    <span
                      key={s.id}
                      className="px-2 py-0.5 bg-[#f0f4f2] text-[#173a35] rounded-md text-[10px] font-medium"
                    >
                      {s.title} ({s.leadTime})
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Reject Modal */}
          {selectedCenterToReject && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-xs">
                <h3 className="font-bold text-sm text-[#173a35]">
                  Decline Access Center Application:{" "}
                  {selectedCenterToReject.name}
                </h3>
                <p className="text-[#62736b]">
                  Please specify why this organization does not meet Credento
                  Access Center requirements:
                </p>
                <textarea
                  rows={3}
                  placeholder="e.g. Unverified organizational credentials or services not provided at zero cost..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-2.5 bg-white border border-black/10 rounded-xl"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCenterToReject(null)}
                    className="px-4 py-2 font-semibold text-[#62736b]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onRejectCenter(
                        selectedCenterToReject.id,
                        rejectionReason.trim() ||
                          "Does not meet verification standards.",
                      )
                      setSelectedCenterToReject(null)
                    }}
                    className="px-4 py-2 bg-[#a33e32] text-white font-semibold rounded-xl"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. OFFICIAL CREDENTO COMMUNICATIONS */}
      {activeTab === "announcements" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compose Form */}
          <div className="card-linkedin p-6 space-y-4">
            <div>
              <h2 className="font-bold text-base text-[#173a35]">
                Broadcast Official Credento Team Message
              </h2>
              <p className="text-xs text-[#62736b]">
                Communications sent from here appear prominently under the
                official <strong>"Credento Team"</strong> banner and generate
                instant platform notifications.
              </p>
            </div>

            {broadcastSent && (
              <div className="p-3 bg-[#edf6f0] border border-[#b8dec4] rounded-xl text-xs text-[#155738]">
                ✓ Official Credento Team communication broadcasted successfully!
              </div>
            )}

            <form
              onSubmit={handleBroadcastSubmit}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-[#173a35] mb-1">
                  Message Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Community Standards Update & Academic Integrity Policy"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  className="w-full p-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#173a35] mb-1">
                    Announcement Category
                  </label>
                  <select
                    value={announcementType}
                    onChange={(e) => setAnnouncementType(e.target.value as any)}
                    className="w-full p-2.5 bg-white rounded-xl border border-black/10"
                  >
                    <option value="announcement">Platform Announcement</option>
                    <option value="community_guidelines">
                      Community Guidelines
                    </option>
                    <option value="safety_notice">
                      Safety & Security Notice
                    </option>
                    <option value="access_center_announcement">
                      Access Center News
                    </option>
                    <option value="platform_update">System Update</option>
                    <option value="account_notice">
                      Direct Account Notice
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#173a35] mb-1">
                    Audience Target
                  </label>
                  <select
                    value={announcementTargetType}
                    onChange={(e) =>
                      setAnnouncementTargetType(e.target.value as any)
                    }
                    className="w-full p-2.5 bg-white rounded-xl border border-black/10"
                  >
                    <option value="all">All Registered Students</option>
                    <option value="user">Specific Scholar</option>
                  </select>
                </div>
              </div>

              {announcementTargetType === "user" && (
                <div>
                  <label className="block font-bold text-[#173a35] mb-1">
                    Select Target Student
                  </label>
                  <select
                    value={announcementTargetUserId}
                    onChange={(e) =>
                      setAnnouncementTargetUserId(e.target.value)
                    }
                    className="w-full p-2.5 bg-white rounded-xl border border-black/10"
                    required
                  >
                    <option value="">Select a student...</option>
                    {allUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email || u.institution})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-[#173a35] mb-1">
                  Official Communication Body *
                </label>
                <textarea
                  rows={5}
                  placeholder="Write clear, professional instructions or platform notice from Credento Team..."
                  value={announcementContent}
                  onChange={(e) => setAnnouncementContent(e.target.value)}
                  className="w-full p-3 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35] leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-3d-primary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast as Credento Team</span>
              </button>
            </form>
          </div>

          {/* Past Broadcasts */}
          <div className="card-linkedin p-6 space-y-4">
            <h2 className="font-bold text-base text-[#173a35]">
              Dispatched Team Communications ({allAnnouncements.length})
            </h2>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {allAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-4 rounded-xl bg-[#f8faf9] border border-black/[0.04] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#c46b4b] uppercase font-bold tracking-wider">
                      {ann.type.replace("_", " ")}
                    </span>
                    <span className="text-[10px] text-[#728078]">
                      {ann.createdAt}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-[#173a35]">
                    {ann.title}
                  </h4>
                  <p className="text-xs text-[#4d5b54] leading-relaxed">
                    {ann.content}
                  </p>
                  <div className="text-[10px] text-[#728078] pt-1">
                    Target:{" "}
                    {ann.targetType === "all" ? "All Scholars" : "Direct User"}{" "}
                    • Sender: {ann.authorTitle}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. REPORTS & MODERATION */}
      {activeTab === "reports" && (
        <div className="card-linkedin p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="font-bold text-base text-[#173a35]">
                Content & Safety Reports ({allReports.length})
              </h2>
              <p className="text-xs text-[#62736b]">
                Investigate user submissions regarding fraudulent profiles, hate
                speech, inappropriate content, or misleading organizations.
              </p>
            </div>

            <div className="flex gap-1.5">
              {([
                "all",
                "pending",
                "under_review",
                "resolved",
                "dismissed",
              ] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setReportStatusFilter(status)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize cursor-pointer ${
                    reportStatusFilter === status
                      ? "bg-[#173a35] text-white"
                      : "bg-[#f4f6f5] text-[#62736b] hover:bg-[#eef2f0]"
                  }`}
                >
                  {status.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {filteredReports.length === 0 ? (
            <div className="p-10 text-center text-xs text-[#62736b] bg-[#f8faf9] rounded-2xl">
              <CheckCircle2 className="w-8 h-8 text-[#1b6b47] mx-auto mb-2" />
              <p className="font-bold text-sm text-[#173a35]">
                No reports in this queue.
              </p>
              <p className="text-[11px] text-[#728078] mt-1">
                The community is adhering to Credento Standards.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-xl bg-white border border-black/[0.06] shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#a33e32]">
                          Reason: {rep.reason}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/5 text-[#4d5b54]">
                          Target: {rep.targetType} ({rep.targetId})
                        </span>
                      </div>
                      <p className="text-[11px] text-[#62736b] mt-0.5">
                        Reported by:{" "}
                        <strong>{rep.reporterName || rep.reporterId}</strong> •{" "}
                        {new Date(rep.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <span className="capitalize font-mono font-bold text-[10px] px-2.5 py-1 rounded-full bg-[#eef2f0] text-[#173a35]">
                      {rep.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="p-2.5 bg-[#f8faf9] rounded-lg text-xs text-[#3b4742] leading-relaxed">
                    <strong>Details:</strong> {rep.details}
                  </div>

                  {rep.resolutionNotes && (
                    <div className="p-2 bg-[#edf6f0] rounded text-[11px] text-[#155738]">
                      <strong>Resolution Note:</strong> {rep.resolutionNotes}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-black/[0.04]">
                    <div className="flex items-center gap-2">
                      {rep.targetType === "post" && (
                        <button
                          type="button"
                          onClick={() => {
                            onDeletePost(rep.targetId)
                            onResolveReport(
                              rep.id,
                              "resolved",
                              "Content deleted by moderator.",
                            )
                          }}
                          className="px-2.5 py-1 text-xs text-[#a33e32] hover:bg-[#fdf3f2] rounded-lg font-semibold"
                        >
                          Delete Reported Post
                        </button>
                      )}
                      {rep.targetType === "user" && (
                        <button
                          type="button"
                          onClick={() => {
                            onSuspendUser(
                              rep.targetId,
                              "Suspended due to substantiated user report.",
                            )
                            onResolveReport(
                              rep.id,
                              "resolved",
                              "Reported user suspended.",
                            )
                          }}
                          className="px-2.5 py-1 text-xs text-[#a33e32] hover:bg-[#fdf3f2] rounded-lg font-semibold"
                        >
                          Suspend User
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          onResolveReport(
                            rep.id,
                            "dismissed",
                            "Dismissed after moderator review.",
                          )
                        }
                        className="px-3 py-1 text-xs font-semibold text-[#62736b] hover:bg-black/5 rounded-lg"
                      >
                        Dismiss
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onResolveReport(
                            rep.id,
                            "resolved",
                            "Resolved by administration.",
                          )
                        }
                        className="btn-3d-primary px-3 py-1 text-xs font-semibold"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
