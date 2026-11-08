import { useEffect, useState, useSyncExternalStore } from "react"
import { Navbar, NavTab } from "./components/common/Navbar"
import { AuthScreen } from "./components/auth/AuthScreen"
import { FeedView } from "./components/feed/FeedView"
import { NetworkView } from "./components/network/NetworkView"
import { AccessCenterView } from "./components/access_center/AccessCenterView"
import { OpportunitiesView } from "./components/opportunities/OpportunitiesView"
import { MessagesView } from "./components/messages/MessagesView"
import { NotificationsView } from "./components/notifications/NotificationsView"
import { ProfileView } from "./components/profile/ProfileView"
import { GlobalSearchView } from "./components/search/GlobalSearchView"
import { AdminDashboardView } from "./components/admin/AdminDashboardView"
import { BlockedUsersModal } from "./components/safety/BlockedUsersModal"
import { ReportModal } from "./components/safety/ReportModal"
import { CommunityRulesModal } from "./components/safety/CommunityRulesModal"
import {
  AccessCenterOrganization,
  Opportunity,
  Post,
  StudentProfile,
} from "./types"
import {
  acceptConnectionRequest,
  addCenterService,
  addComment,
  addCommentReply,
  addEducation,
  addInterest,
  addPortfolioItem,
  addSkill,
  approveAccessCenter,
  blockUser,
  broadcastOfficialAnnouncement,
  createOpportunity,
  createPost,
  declineConnectionRequest,
  deleteAccessCenter,
  deleteCenterService,
  deleteComment,
  deleteEducation,
  deleteOpportunity,
  deletePost,
  deleteUserAccount,
  editComment,
  editPost,
  endorseSkill,
  getAdminPlatformStats,
  getAdminUserProfile,
  getAllAccessCenters,
  getAllServiceRequests,
  getAllUsers,
  getBlockedUserIds,
  getConversations,
  getCurrentUser,
  getCurrentUserId,
  getNotifications,
  getOfficialAnnouncements,
  getOpportunities,
  getOrCreateConversation,
  getPosts,
  getReports,
  getStudentWithNetworkStatus,
  getUserById,
  getUserServiceRequests,
  initializeStorage,
  isUserAdmin,
  markAllNotificationsAsRead,
  markConversationAsRead,
  markNotificationAsRead,
  reactivateAccessCenter,
  reactivateUser,
  rejectAccessCenter,
  removeConnection,
  removeInterest,
  removePortfolioItem,
  removeSkill,
  sendConnectionRequest,
  sendMessage,
  setAdminSession,
  setCurrentUserId,
  setPostReaction,
  sharePost,
  submitOrganizationApplication,
  submitReport,
  submitServiceRequest,
  subscribeToStore,
  suspendAccessCenter,
  suspendUser,
  toggleFollowUser,
  togglePostLike,
  toggleSaveOpportunity,
  toggleSavePost,
  unblockUser,
  updateApplicationStatus,
  updateCenterProfile,
  updateCenterService,
  updateCurrentUserProfile,
  updateEducation,
  updatePortfolioItem,
  updateReportStatus,
  updateServiceRequestStatus,
  votePostPoll,
  withdrawConnectionRequest,
} from "./services/storage"

export default function App() {
  // Direct Session State ensuring instantaneous UI loading upon student signup/login
  const [sessionUserId, setSessionUserId] = useState<string | null>(() =>
    getCurrentUserId(),
  )
  const [adminSessionState, setAdminSessionState] = useState<boolean>(() =>
    isUserAdmin(),
  )

  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>("feed")

  // Selected student profile to inspect (if null, views self)
  const [inspectedStudentId, setInspectedStudentId] = useState<string | null>(
    null,
  )

  // Direct active conversation in messaging
  const [activeConversationId, setActiveConversationId] =
    useState<string | undefined>(undefined)

  // Global search parameters
  const [searchParams, setSearchParams] = useState({
    query: "",
    category: "all",
  })

  // Safety Modals state
  const [blockedModalOpen, setBlockedModalOpen] = useState(false)
  const [rulesModalOpen, setRulesModalOpen] = useState(false)
  const [reportState, setReportState] = useState<{
    isOpen: boolean
    targetType: "user" | "post" | "comment" | "opportunity" | "access_center"
    targetId: string
  }>({
    isOpen: false,
    targetType: "post",
    targetId: "",
  })

  // Ensure storage is initialized
  useEffect(() => {
    initializeStorage()
    document.title = "Credento — Student Academic Network & Access Center"
  }, [])

  // Keep session state in sync with local storage updates
  useEffect(() => {
    return subscribeToStore(() => {
      setSessionUserId(getCurrentUserId())
      setAdminSessionState(isUserAdmin())
    })
  }, [])

  // Subscribe to storage store for real-time reactivity
  useSyncExternalStore(
    subscribeToStore,
    () => {
      return (
        (localStorage.getItem("credento_posts")?.length || 0) +
        "_" +
        (localStorage.getItem("credento_users")?.length || 0) +
        "_" +
        (localStorage.getItem("credento_connections")?.length || 0) +
        "_" +
        (localStorage.getItem("credento_access_centers")?.length || 0) +
        "_" +
        (localStorage.getItem("credento_service_requests")?.length || 0) +
        "_" +
        (localStorage.getItem("credento_conversations")?.length || 0) +
        "_" +
        (localStorage.getItem("credento_notifications")?.length || 0) +
        "_" +
        (localStorage.getItem("credento_current_user_id") || "none") +
        "_" +
        (sessionStorage.getItem("credento_admin_session") || "off")
      )
    },
    () => "initial",
  )

  // Current session & user data
  const currentUser = sessionUserId
    ? getUserById(sessionUserId) || getCurrentUser()
    : getCurrentUser()
  const isAdmin = adminSessionState || isUserAdmin()
  const rawUsers = getAllUsers()
  const rawPosts = getPosts()
  const opportunities = getOpportunities()
  const accessCenters = getAllAccessCenters()
  const serviceRequests = getAllServiceRequests()
  const conversations = getConversations()
  const notifications = getNotifications()
  const blockedUserIds = getBlockedUserIds()
  const adminStats = getAdminPlatformStats()
  const reports = getReports()
  const announcements = getOfficialAnnouncements()

  // Map users with relational network status relative to currentUser
  const allUsers = rawUsers.map((u) =>
    getStudentWithNetworkStatus(u, currentUser?.id),
  )

  // Filter blocked users
  const visiblePosts = rawPosts.filter(
    (p) => !blockedUserIds.includes(p.authorId),
  )
  const visibleStudents = allUsers.filter((u) => !blockedUserIds.includes(u.id))

  // Badge counters
  const unreadMessagesCount = conversations.reduce(
    (acc, c) => acc + (c.unreadCount || 0),
    0,
  )
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length
  const pendingRequestsCount = visibleStudents.filter(
    (s) => s.connectionStatus === "pending_received",
  ).length

  // User service requests (for current logged in user)
  const myServiceRequests = currentUser
    ? getUserServiceRequests(currentUser.id)
    : []

  // Handlers
  const handleLoginSuccess = (user: StudentProfile) => {
    setCurrentUserId(user.id)
    setSessionUserId(user.id)
    setInspectedStudentId(null)
    if (
      user.email?.toLowerCase() === "team@credento.world" ||
      user.role === "admin"
    ) {
      setAdminSession(true)
      setAdminSessionState(true)
      setCurrentTab("admin")
    } else {
      setAdminSessionState(false)
      setCurrentTab("feed")
    }
  }

  const handleAdminLoginSuccess = () => {
    setAdminSession(true)
    setAdminSessionState(true)
    const adminUser = getAdminUserProfile()
    setCurrentUserId(adminUser.id)
    setSessionUserId(adminUser.id)
    setInspectedStudentId(null)
    setCurrentTab("admin")
  }

  const handleSignOut = () => {
    setCurrentUserId(null)
    setSessionUserId(null)
    setAdminSession(false)
    setAdminSessionState(false)
    setInspectedStudentId(null)
  }

  const handleSelectStudentProfile = (studentId: string) => {
    setInspectedStudentId(studentId)
    setCurrentTab("profile")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleStartMessageWithStudent = (studentId: string) => {
    if (!currentUser) return
    const conv = getOrCreateConversation(studentId)
    setActiveConversationId(conv.id)
    setCurrentTab("messages")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleGlobalSearch = (query: string, category: string) => {
    setSearchParams({ query, category })
    setCurrentTab("search")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Active student profile being displayed (either self or inspected peer)
  const displayedProfile = inspectedStudentId
    ? visibleStudents.find((u) => u.id === inspectedStudentId) || currentUser
    : currentUser

  const isViewingSelf = currentUser
    ? displayedProfile?.id === currentUser.id
    : false

  // If no user is authenticated and not in admin mode, render authentic AuthScreen
  if (!currentUser && !isAdmin) {
    return (
      <AuthScreen
        onLoginSuccess={handleLoginSuccess}
        onAdminLoginSuccess={handleAdminLoginSuccess}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#242b29] flex flex-col font-sans pb-16 lg:pb-0">
      {/* Universal Responsive Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === "profile") {
            setInspectedStudentId(null) // Reset to view own profile
          }
          setCurrentTab(tab)
          window.scrollTo({ top: 0, behavior: "smooth" })
        }}
        currentUser={currentUser}
        allUsers={visibleStudents}
        isAdmin={isAdmin}
        onSignOut={handleSignOut}
        onOpenBlockedModal={() => setBlockedModalOpen(true)}
        onOpenRulesModal={() => setRulesModalOpen(true)}
        unreadMessagesCount={unreadMessagesCount}
        unreadNotificationsCount={unreadNotificationsCount}
        pendingRequestsCount={pendingRequestsCount}
        onSearchSubmit={handleGlobalSearch}
        onSelectStudentProfile={handleSelectStudentProfile}
      />

      {/* Main Tab Views */}
      <main className="flex-1">
        {/* 1. ACADEMIC FEED */}
        {currentTab === "feed" && currentUser && (
          <FeedView
            currentUser={currentUser}
            posts={visiblePosts}
            students={visibleStudents}
            opportunities={opportunities}
            onToggleLike={togglePostLike}
            onSetReaction={setPostReaction}
            onAddComment={addComment}
            onAddReply={addCommentReply}
            onCreatePost={createPost}
            onSharePost={sharePost}
            onEditPost={editPost}
            onDeletePost={deletePost}
            onConnectStudent={sendConnectionRequest}
            onSelectStudentProfile={handleSelectStudentProfile}
            onSelectOpportunity={() => {
              setCurrentTab("opportunities")
            }}
            onNavigateToTab={(tab) => {
              setCurrentTab(tab)
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            onReport={(type, targetId) =>
              setReportState({ isOpen: true, targetType: type, targetId })
            }
            onBlockUser={blockUser}
            onVotePoll={votePostPoll}
            onToggleSavePost={toggleSavePost}
            onEditComment={editComment}
            onDeleteComment={deleteComment}
          />
        )}

        {/* 2. REAL NETWORKING */}
        {currentTab === "network" && currentUser && (
          <NetworkView
            currentUser={currentUser}
            allStudents={visibleStudents}
            onConnect={sendConnectionRequest}
            onAcceptConnection={acceptConnectionRequest}
            onDeclineConnection={declineConnectionRequest}
            onWithdrawConnection={withdrawConnectionRequest}
            onRemoveConnection={removeConnection}
            onToggleFollow={toggleFollowUser}
            onStartMessage={handleStartMessageWithStudent}
            onSelectStudentProfile={handleSelectStudentProfile}
          />
        )}

        {/* 3. CREDENTO ACCESS CENTER (CORE FEATURE) */}
        {currentTab === "access_center" && (
          <AccessCenterView
            currentUser={currentUser}
            centers={accessCenters}
            userRequests={myServiceRequests}
            onSubmitApplication={submitOrganizationApplication}
            onSubmitServiceRequest={submitServiceRequest}
            onUpdateCenter={updateCenterProfile}
            onAddService={addCenterService}
            onUpdateService={updateCenterService}
            onDeleteService={deleteCenterService}
            onUpdateRequestStatus={updateServiceRequestStatus}
          />
        )}

        {/* 4. OPPORTUNITIES & FELLOWSHIPS */}
        {currentTab === "opportunities" && (
          <OpportunitiesView
            opportunities={opportunities}
            currentUser={
              currentUser || {
                id: "admin",
                name: "Admin Staff",
                headline: "Staff",
                institution: "Credento",
                facultyOrDepartment: "",
                degree: "",
                graduationYear: 2026,
                location: "",
                avatar: "",
                coverImage: "",
                about: "",
                isPublic: true,
                skills: [],
                interests: [],
                education: [],
                portfolioItems: [],
                connectionsCount: 0,
                followersCount: 0,
              }
            }
            onToggleSave={toggleSaveOpportunity}
            onAddOpportunity={createOpportunity}
            onUpdateApplicationStatus={updateApplicationStatus}
          />
        )}

        {/* 5. USER-TO-USER MESSAGING */}
        {currentTab === "messages" && currentUser && (
          <MessagesView
            conversations={conversations}
            currentUser={currentUser}
            onSendMessage={sendMessage}
            onMarkAsRead={markConversationAsRead}
            onSelectStudentProfile={handleSelectStudentProfile}
            initialActiveConversationId={activeConversationId}
          />
        )}

        {/* 6. NOTIFICATIONS */}
        {currentTab === "notifications" && (
          <NotificationsView
            notifications={notifications}
            onMarkAsRead={markNotificationAsRead}
            onMarkAllAsRead={markAllNotificationsAsRead}
            onAcceptConnection={acceptConnectionRequest}
            onDeclineConnection={declineConnectionRequest}
            onNavigateToTab={(tab) => {
              setCurrentTab(tab)
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            onSelectStudentProfile={handleSelectStudentProfile}
          />
        )}

        {/* 7. REAL STUDENT PROFILE */}
        {currentTab === "profile" && displayedProfile && currentUser && (
          <ProfileView
            profile={displayedProfile}
            currentUser={currentUser}
            isSelf={isViewingSelf}
            onUpdateProfile={updateCurrentUserProfile}
            onAddPortfolioItem={addPortfolioItem}
            onUpdatePortfolioItem={updatePortfolioItem}
            onRemovePortfolioItem={removePortfolioItem}
            onAddEducation={addEducation}
            onUpdateEducation={updateEducation}
            onDeleteEducation={deleteEducation}
            onAddSkill={addSkill}
            onRemoveSkill={removeSkill}
            onAddInterest={addInterest}
            onRemoveInterest={removeInterest}
            onConnect={sendConnectionRequest}
            onRemoveConnection={removeConnection}
            onFollow={toggleFollowUser}
            onStartMessage={handleStartMessageWithStudent}
            onReport={(type, targetId) =>
              setReportState({ isOpen: true, targetType: type, targetId })
            }
            onBlockUser={blockUser}
            onEndorseSkill={endorseSkill}
          />
        )}

        {/* 8. GLOBAL ACADEMIC SEARCH */}
        {currentTab === "search" && (
          <GlobalSearchView
            initialQuery={searchParams.query}
            initialCategory={searchParams.category}
            allStudents={visibleStudents}
            allOpportunities={opportunities}
            allPosts={visiblePosts}
            allCenters={accessCenters}
            onSelectStudentProfile={handleSelectStudentProfile}
            onSelectOpportunity={() => {
              setCurrentTab("opportunities")
            }}
            onSelectAccessCenter={() => {
              setCurrentTab("access_center")
            }}
            onNavigateToTab={(tab) => {
              setCurrentTab(tab)
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
          />
        )}

        {/* 9. CREDENTO ADMIN DASHBOARD */}
        {currentTab === "admin" && (
          <AdminDashboardView
            stats={adminStats}
            allUsers={rawUsers}
            allCenters={accessCenters}
            allReports={reports}
            allAnnouncements={announcements}
            posts={rawPosts}
            opportunities={opportunities}
            onSuspendUser={suspendUser}
            onReactivateUser={reactivateUser}
            onDeleteUser={deleteUserAccount}
            onApproveCenter={approveAccessCenter}
            onRejectCenter={rejectAccessCenter}
            onSuspendCenter={suspendAccessCenter}
            onReactivateCenter={reactivateAccessCenter}
            onDeleteCenter={deleteAccessCenter}
            onResolveReport={updateReportStatus}
            onDeletePost={deletePost}
            onBroadcastAnnouncement={broadcastOfficialAnnouncement}
            onExitAdmin={() => {
              setAdminSession(false)
              if (currentUser) {
                setCurrentTab("feed")
              }
            }}
            onSelectStudentProfile={handleSelectStudentProfile}
          />
        )}
      </main>

      {/* Safety & Moderation Modals */}
      <BlockedUsersModal
        isOpen={blockedModalOpen}
        onClose={() => setBlockedModalOpen(false)}
        blockedUserIds={blockedUserIds}
        allStudents={rawUsers}
        onUnblockUser={unblockUser}
      />

      <CommunityRulesModal
        isOpen={rulesModalOpen}
        onClose={() => setRulesModalOpen(false)}
      />

      <ReportModal
        isOpen={reportState.isOpen}
        onClose={() =>
          setReportState({ isOpen: false, targetType: "post", targetId: "" })
        }
        targetType={reportState.targetType as any}
        targetId={reportState.targetId}
        onSubmitReport={(reason, details) =>
          submitReport({
            targetType: reportState.targetType as any,
            targetId: reportState.targetId,
            reason,
            details,
          })
        }
      />

      {/* Structured WordPress-style Editorial Footer */}
      <footer className="hidden lg:block border-t border-[#cbd3ce] bg-[#f7f5ef] py-6 text-xs text-[#62736b]">
        <div className="max-w-7xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#173a35]">Credento</span>
            <span>•</span>
            <span>The Student Academic Network & Access Center</span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <button
              type="button"
              onClick={() => {
                setCurrentTab("feed")
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              className="hover:text-[#173a35] cursor-pointer"
            >
              Academic Feed
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentTab("network")
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              className="hover:text-[#173a35] cursor-pointer"
            >
              Collegiate Network
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentTab("access_center")
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              className="hover:text-[#173a35] font-semibold text-[#173a35] cursor-pointer"
            >
              Access Center
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentTab("opportunities")
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              className="hover:text-[#173a35] cursor-pointer"
            >
              Scholarships & Grants
            </button>
            <button
              type="button"
              onClick={() => setRulesModalOpen(true)}
              className="hover:text-[#173a35] cursor-pointer"
            >
              Community Standards
            </button>
            <button
              type="button"
              onClick={() => setBlockedModalOpen(true)}
              className="hover:text-[#173a35] cursor-pointer"
            >
              Safety & Moderation
            </button>
          </div>

          <div className="text-[11px] text-[#728078] font-mono">
            Verified Student Merit • Zero Fake Profiles
          </div>
        </div>
      </footer>
    </div>
  )
}
