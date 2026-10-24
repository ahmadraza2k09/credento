import { useEffect, useState, useSyncExternalStore } from "react"
import { Navbar, NavTab } from "./components/common/Navbar"
import { AuthScreen } from "./components/auth/AuthScreen"
import { FeedView } from "./components/feed/FeedView"
import { NetworkView } from "./components/network/NetworkView"
import { OpportunitiesView } from "./components/opportunities/OpportunitiesView"
import { MessagesView } from "./components/messages/MessagesView"
import { NotificationsView } from "./components/notifications/NotificationsView"
import { ProfileView } from "./components/profile/ProfileView"
import { GlobalSearchView } from "./components/search/GlobalSearchView"
import { BlockedUsersModal } from "./components/safety/BlockedUsersModal"
import { ReportModal } from "./components/safety/ReportModal"
import { Opportunity, Post, StudentProfile } from "./types"
import {
  acceptConnectionRequest,
  addComment,
  addCommentReply,
  addPortfolioItem,
  blockUser,
  createOpportunity,
  createPost,
  declineConnectionRequest,
  deletePost,
  editPost,
  getAllUsers,
  getBlockedUserIds,
  getConversations,
  getCurrentUser,
  getNotifications,
  getOpportunities,
  getOrCreateConversation,
  getPosts,
  getUserById,
  initializeStorage,
  markAllNotificationsAsRead,
  markConversationAsRead,
  markNotificationAsRead,
  registerStudent,
  removePortfolioItem,
  sendConnectionRequest,
  sendMessage,
  setCurrentUserId,
  sharePost,
  submitReport,
  subscribeToStore,
  toggleFollowUser,
  togglePostLike,
  toggleSaveOpportunity,
  unblockUser,
  updateCurrentUserProfile,
  withdrawConnectionRequest,
} from "./services/storage"

const SESSION_KEY = "credento-demo-name"

export default function App() {
  // Session check
  const [sessionName, setSessionName] = useState<string>(
    () => sessionStorage.getItem(SESSION_KEY) ?? "",
  )

  // Current active navigation tab
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

  // Modals state
  const [blockedModalOpen, setBlockedModalOpen] = useState(false)
  const [reportState, setReportState] = useState<{
    isOpen: boolean
    targetType: "user" | "post" | "comment" | "opportunity"
    targetId: string
  }>({
    isOpen: false,
    targetType: "post",
    targetId: "",
  })

  // Ensure storage is initialized
  useEffect(() => {
    initializeStorage()
    document.title = "Credento — Student Credential & Networking Platform"
  }, [])

  // Subscribe to storage store for real-time reactivity
  const storeVersion = useSyncExternalStore(
    subscribeToStore,
    () => {
      // Return a lightweight snapshot hash of storage
      return (
        localStorage.getItem("credento_posts")?.length +
        "_" +
        localStorage.getItem("credento_users")?.length +
        "_" +
        localStorage.getItem("credento_saved_opportunities") +
        "_" +
        localStorage.getItem("credento_conversations")?.length +
        "_" +
        localStorage.getItem("credento_notifications")?.length +
        "_" +
        localStorage.getItem("credento_current_user_id")
      )
    },
    () => "initial",
  )

  // Data queries from storage
  const currentUser = getCurrentUser()
  const allUsers = getAllUsers()
  const posts = getPosts()
  const opportunities = getOpportunities()
  const conversations = getConversations()
  const notifications = getNotifications()
  const blockedUserIds = getBlockedUserIds()

  // Filter blocked users out of posts and visible students
  const visiblePosts = posts.filter((p) => !blockedUserIds.includes(p.authorId))
  const visibleStudents = allUsers.filter((u) => !blockedUserIds.includes(u.id))

  // Unread counts for badges
  const unreadMessagesCount = conversations.reduce(
    (acc, c) => acc + (c.unreadCount || 0),
    0,
  )
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length
  const pendingRequestsCount = visibleStudents.filter(
    (s) => s.connectionStatus === "pending_received",
  ).length

  // Handlers
  const handleLogin = (enteredName: string, studentId?: string) => {
    sessionStorage.setItem(SESSION_KEY, enteredName)
    setSessionName(enteredName)
    if (studentId) {
      setCurrentUserId(studentId)
    } else {
      // Find matching user or update current user name
      const found = allUsers.find(
        (u) => u.name.toLowerCase() === enteredName.toLowerCase(),
      )
      if (found) {
        setCurrentUserId(found.id)
      } else {
        updateCurrentUserProfile({ name: enteredName })
      }
    }
  }

  const handleRegister = (name: string, institution: string, email: string) => {
    const newStudent = registerStudent(name, institution, email)
    sessionStorage.setItem(SESSION_KEY, newStudent.name)
    setSessionName(newStudent.name)
  }

  const handleSignOut = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setSessionName("")
  }

  const handleSwitchUser = (userId: string) => {
    setCurrentUserId(userId)
    const nextUser = getUserById(userId)
    if (nextUser) {
      sessionStorage.setItem(SESSION_KEY, nextUser.name)
      setSessionName(nextUser.name)
    }
    setInspectedStudentId(null)
  }

  const handleSelectStudentProfile = (studentId: string) => {
    setInspectedStudentId(studentId)
    setCurrentTab("profile")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleStartMessageWithStudent = (studentId: string) => {
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
    ? getUserById(inspectedStudentId) || currentUser
    : currentUser

  const isViewingSelf = displayedProfile.id === currentUser.id

  if (!sessionName) {
    return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />
  }

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#242b29] flex flex-col font-sans pb-16 lg:pb-0">
      {/* Universal Responsive Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === "profile") {
            setInspectedStudentId(null) // Reset to self
          }
          setCurrentTab(tab)
          window.scrollTo({ top: 0, behavior: "smooth" })
        }}
        currentUser={currentUser}
        allUsers={allUsers}
        onSwitchUser={handleSwitchUser}
        onSignOut={handleSignOut}
        onOpenBlockedModal={() => setBlockedModalOpen(true)}
        unreadMessagesCount={unreadMessagesCount}
        unreadNotificationsCount={unreadNotificationsCount}
        pendingRequestsCount={pendingRequestsCount}
        onSearchSubmit={handleGlobalSearch}
        onSelectStudentProfile={handleSelectStudentProfile}
      />

      {/* Main Tab Views */}
      <main className="flex-1">
        {currentTab === "feed" && (
          <FeedView
            currentUser={currentUser}
            posts={visiblePosts}
            students={visibleStudents}
            opportunities={opportunities}
            onToggleLike={togglePostLike}
            onAddComment={addComment}
            onAddReply={addCommentReply}
            onCreatePost={createPost}
            onSharePost={sharePost}
            onEditPost={editPost}
            onDeletePost={deletePost}
            onConnectStudent={sendConnectionRequest}
            onSelectStudentProfile={handleSelectStudentProfile}
            onSelectOpportunity={(opp) => {
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
          />
        )}

        {currentTab === "network" && (
          <NetworkView
            currentUser={currentUser}
            allStudents={visibleStudents}
            onConnect={sendConnectionRequest}
            onAcceptConnection={acceptConnectionRequest}
            onDeclineConnection={declineConnectionRequest}
            onWithdrawConnection={withdrawConnectionRequest}
            onToggleFollow={toggleFollowUser}
            onStartMessage={handleStartMessageWithStudent}
            onSelectStudentProfile={handleSelectStudentProfile}
          />
        )}

        {currentTab === "opportunities" && (
          <OpportunitiesView
            opportunities={opportunities}
            currentUser={currentUser}
            onToggleSave={toggleSaveOpportunity}
            onAddOpportunity={createOpportunity}
          />
        )}

        {currentTab === "messages" && (
          <MessagesView
            conversations={conversations}
            currentUser={currentUser}
            onSendMessage={sendMessage}
            onMarkAsRead={markConversationAsRead}
            onSelectStudentProfile={handleSelectStudentProfile}
            initialActiveConversationId={activeConversationId}
          />
        )}

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

        {currentTab === "profile" && (
          <ProfileView
            profile={displayedProfile}
            currentUser={currentUser}
            isSelf={isViewingSelf}
            onUpdateProfile={updateCurrentUserProfile}
            onAddPortfolioItem={addPortfolioItem}
            onRemovePortfolioItem={removePortfolioItem}
            onConnect={sendConnectionRequest}
            onFollow={toggleFollowUser}
            onStartMessage={handleStartMessageWithStudent}
            onReport={(type, targetId) =>
              setReportState({ isOpen: true, targetType: type, targetId })
            }
            onBlockUser={blockUser}
          />
        )}

        {currentTab === "search" && (
          <GlobalSearchView
            initialQuery={searchParams.query}
            initialCategory={searchParams.category}
            allStudents={visibleStudents}
            allOpportunities={opportunities}
            allPosts={visiblePosts}
            onSelectStudentProfile={handleSelectStudentProfile}
            onSelectOpportunity={(opp) => {
              setCurrentTab("opportunities")
            }}
            onNavigateToTab={(tab) => {
              setCurrentTab(tab)
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
          />
        )}
      </main>

      {/* Safety & Moderation Modals */}
      <BlockedUsersModal
        isOpen={blockedModalOpen}
        onClose={() => setBlockedModalOpen(false)}
        blockedUserIds={blockedUserIds}
        allStudents={allUsers}
        onUnblockUser={unblockUser}
      />

      <ReportModal
        isOpen={reportState.isOpen}
        onClose={() =>
          setReportState({ isOpen: false, targetType: "post", targetId: "" })
        }
        targetType={reportState.targetType}
        targetId={reportState.targetId}
        onSubmitReport={(reason, details) =>
          submitReport({
            targetType: reportState.targetType,
            targetId: reportState.targetId,
            reason,
            details,
          })
        }
      />

      {/* Structured WordPress-style Footer */}
      <footer className="hidden lg:block border-t border-[#cbd3ce] bg-[#f7f5ef] py-6 text-xs text-[#62736b]">
        <div className="max-w-7xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#173a35]">Credento</span>
            <span>•</span>
            <span>Student Networking & Credential Platform</span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <button
              type="button"
              onClick={() => setCurrentTab("feed")}
              className="hover:text-[#173a35]"
            >
              Academic Feed
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab("opportunities")}
              className="hover:text-[#173a35]"
            >
              Scholarships & Grants
            </button>
            <button
              type="button"
              onClick={() => setBlockedModalOpen(true)}
              className="hover:text-[#173a35]"
            >
              Safety & Moderation
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab("network")}
              className="hover:text-[#173a35]"
            >
              Collegiate Directory
            </button>
          </div>

          <div className="text-[11px] text-[#728078] font-mono">
            Clean WordPress Design • LinkedIn Functionality
          </div>
        </div>
      </footer>
    </div>
  )
}
