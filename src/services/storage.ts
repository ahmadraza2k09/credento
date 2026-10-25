import {
  AppNotification,
  ApplicationStatus,
  Comment,
  Conversation,
  EducationItem,
  Opportunity,
  OpportunityCategory,
  PortfolioItem,
  Post,
  ReactionType,
  ReportItem,
  StudentProfile,
  StudyGroup,
} from "../types"
import {
  INITIAL_CONVERSATIONS,
  INITIAL_GROUPS,
  INITIAL_NOTIFICATIONS,
  INITIAL_OPPORTUNITIES,
  INITIAL_POSTS,
  INITIAL_STUDENTS,
} from "../data/mockData"

const STORAGE_KEYS = {
  CURRENT_USER_ID: "credento_current_user_id",
  USERS: "credento_users",
  POSTS: "credento_posts",
  OPPORTUNITIES: "credento_opportunities",
  SAVED_OPPORTUNITIES: "credento_saved_opportunities",
  SAVED_POSTS: "credento_saved_posts",
  APPLICATIONS: "credento_applications",
  GROUPS: "credento_groups",
  CONVERSATIONS: "credento_conversations",
  NOTIFICATIONS: "credento_notifications",
  BLOCKED_USERS: "credento_blocked_users",
  REPORTS: "credento_reports",
}

// Event dispatcher for reactive state updates
type Listener = () => void
const listeners = new Set<Listener>()

export function subscribeToStore(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function notifySubscribers() {
  listeners.forEach((l) => {
    try {
      l()
    } catch (e) {
      console.error("Error in subscriber", e)
    }
  })
}

// Helpers for localStorage with safe JSON parsing
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const val = localStorage.getItem(key)
    if (!val) return defaultValue
    return JSON.parse(val) as T
  } catch (err) {
    console.error(`Failed to load ${key} from localStorage`, err)
    return defaultValue
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    notifySubscribers()
  } catch (err) {
    console.error(`Failed to save ${key} to localStorage`, err)
  }
}

// Initialize default data if not present
export function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_STUDENTS))
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
    localStorage.setItem(
      STORAGE_KEYS.CURRENT_USER_ID,
      JSON.stringify("user-marcus"),
    )
  }
  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_POSTS))
  }
  if (!localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES)) {
    localStorage.setItem(
      STORAGE_KEYS.OPPORTUNITIES,
      JSON.stringify(INITIAL_OPPORTUNITIES),
    )
  }
  if (!localStorage.getItem(STORAGE_KEYS.SAVED_OPPORTUNITIES)) {
    localStorage.setItem(
      STORAGE_KEYS.SAVED_OPPORTUNITIES,
      JSON.stringify(["opp-1", "opp-2"]),
    )
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)) {
    localStorage.setItem(
      STORAGE_KEYS.CONVERSATIONS,
      JSON.stringify(INITIAL_CONVERSATIONS),
    )
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(
      STORAGE_KEYS.NOTIFICATIONS,
      JSON.stringify(INITIAL_NOTIFICATIONS),
    )
  }
  if (!localStorage.getItem(STORAGE_KEYS.BLOCKED_USERS)) {
    localStorage.setItem(STORAGE_KEYS.BLOCKED_USERS, JSON.stringify([]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify([]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.GROUPS)) {
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(INITIAL_GROUPS))
  }
  if (!localStorage.getItem(STORAGE_KEYS.SAVED_POSTS)) {
    localStorage.setItem(STORAGE_KEYS.SAVED_POSTS, JSON.stringify(["post-1"]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
    localStorage.setItem(
      STORAGE_KEYS.APPLICATIONS,
      JSON.stringify({
        "opp-4": {
          status: "interviewing",
          appliedDate: "2026-02-14",
          notes: "Round 2 technical coding interview scheduled for next week",
        },
      }),
    )
  }
}

// --- USER & PROFILE API ---

export function getCurrentUserId(): string {
  initializeStorage()
  return getItem<string>(STORAGE_KEYS.CURRENT_USER_ID, "user-marcus")
}

export function setCurrentUserId(userId: string): void {
  setItem(STORAGE_KEYS.CURRENT_USER_ID, userId)
}

export function getAllUsers(): StudentProfile[] {
  initializeStorage()
  return getItem<StudentProfile[]>(STORAGE_KEYS.USERS, INITIAL_STUDENTS)
}

export function getCurrentUser(): StudentProfile {
  const currentId = getCurrentUserId()
  const users = getAllUsers()
  const found = users.find((u) => u.id === currentId)
  if (found) return found
  return users[0] || INITIAL_STUDENTS[0]
}

export function getUserById(userId: string): StudentProfile | undefined {
  const users = getAllUsers()
  return users.find((u) => u.id === userId)
}

export function updateCurrentUserProfile(
  updates: Partial<StudentProfile>,
): StudentProfile {
  const users = getAllUsers()
  const currentId = getCurrentUserId()
  const updatedUsers = users.map((u) => {
    if (u.id === currentId) {
      return { ...u, ...updates }
    }
    return u
  })
  setItem(STORAGE_KEYS.USERS, updatedUsers)
  return getUserById(currentId)!
}

export function addPortfolioItem(
  item: Omit<PortfolioItem, "id">,
): PortfolioItem {
  const newItem: PortfolioItem = {
    ...item,
    id: `port-${Date.now()}`,
  }
  const current = getCurrentUser()
  const updatedItems = [newItem, ...(current.portfolioItems || [])]
  updateCurrentUserProfile({ portfolioItems: updatedItems })
  return newItem
}

export function removePortfolioItem(itemId: string): void {
  const current = getCurrentUser()
  const updatedItems = (current.portfolioItems || []).filter(
    (item) => item.id !== itemId,
  )
  updateCurrentUserProfile({ portfolioItems: updatedItems })
}

export function updatePortfolioItem(
  itemId: string,
  updates: Partial<PortfolioItem>,
): void {
  const current = getCurrentUser()
  const updatedItems = (current.portfolioItems || []).map((item) =>
    item.id === itemId ? { ...item, ...updates } : item,
  )
  updateCurrentUserProfile({ portfolioItems: updatedItems })
}

export function addEducation(edu: Omit<EducationItem, "id">): EducationItem {
  const current = getCurrentUser()
  const newEdu: EducationItem = {
    ...edu,
    id: `edu-${Date.now()}`,
  }
  const updatedEdu = [newEdu, ...(current.education || [])]
  updateCurrentUserProfile({ education: updatedEdu })
  return newEdu
}

export function updateEducation(
  eduId: string,
  updates: Partial<EducationItem>,
): void {
  const current = getCurrentUser()
  const updatedEdu = (current.education || []).map((e) =>
    e.id === eduId ? { ...e, ...updates } : e,
  )
  updateCurrentUserProfile({ education: updatedEdu })
}

export function deleteEducation(eduId: string): void {
  const current = getCurrentUser()
  const updatedEdu = (current.education || []).filter((e) => e.id !== eduId)
  updateCurrentUserProfile({ education: updatedEdu })
}

export function addSkill(skill: string): void {
  const current = getCurrentUser()
  const trimmed = skill.trim()
  if (!trimmed || current.skills?.includes(trimmed)) return
  updateCurrentUserProfile({ skills: [...(current.skills || []), trimmed] })
}

export function removeSkill(skill: string): void {
  const current = getCurrentUser()
  updateCurrentUserProfile({
    skills: (current.skills || []).filter((s) => s !== skill),
  })
}

export function addInterest(interest: string): void {
  const current = getCurrentUser()
  const trimmed = interest.trim()
  if (!trimmed || current.interests?.includes(trimmed)) return
  updateCurrentUserProfile({
    interests: [...(current.interests || []), trimmed],
  })
}

export function removeInterest(interest: string): void {
  const current = getCurrentUser()
  updateCurrentUserProfile({
    interests: (current.interests || []).filter((i) => i !== interest),
  })
}

export function calculateProfileCompleteness(
  profile: StudentProfile,
): {
  percentage: number
  missingFields: string[]
} {
  let score = 0
  const missing: string[] = []

  if (profile.name?.trim()) score += 15
  else missing.push("Full name")

  if (profile.headline?.trim()) score += 15
  else missing.push("Professional headline")

  if (profile.about?.trim() && profile.about.length > 30) score += 15
  else missing.push("Detailed about section (30+ characters)")

  if (profile.avatar?.trim()) score += 15
  else missing.push("Profile photo")

  if (profile.institution?.trim() && profile.degree?.trim()) score += 15
  else missing.push("Education details")

  if (profile.skills && profile.skills.length >= 3) score += 15
  else missing.push("At least 3 core skills")

  if (profile.portfolioItems && profile.portfolioItems.length >= 1) score += 10
  else missing.push("At least 1 project, publication, or award")

  return { percentage: Math.min(score, 100), missingFields: missing }
}

export function endorseSkill(targetUserId: string, skillName: string): void {
  const current = getCurrentUser()
  const users = getAllUsers()
  const updatedUsers = users.map((u) => {
    if (u.id !== targetUserId) return u
    const endorsements = u.skillEndorsements ? { ...u.skillEndorsements } : {}
    const existingVotes = endorsements[skillName] || []
    if (existingVotes.includes(current.id)) {
      endorsements[skillName] = existingVotes.filter((id) => id !== current.id)
    } else {
      endorsements[skillName] = [...existingVotes, current.id]
    }
    return { ...u, skillEndorsements: endorsements }
  })
  setItem(STORAGE_KEYS.USERS, updatedUsers)
}

// --- NETWORKING & CONNECTIONS API ---

export function getBlockedUserIds(): string[] {
  return getItem<string[]>(STORAGE_KEYS.BLOCKED_USERS, [])
}

export function blockUser(targetUserId: string): void {
  const blocked = getBlockedUserIds()
  if (!blocked.includes(targetUserId)) {
    const updated = [...blocked, targetUserId]
    setItem(STORAGE_KEYS.BLOCKED_USERS, updated)
  }
}

export function unblockUser(targetUserId: string): void {
  const blocked = getBlockedUserIds()
  const updated = blocked.filter((id) => id !== targetUserId)
  setItem(STORAGE_KEYS.BLOCKED_USERS, updated)
}

export function sendConnectionRequest(targetUserId: string): void {
  const users = getAllUsers()
  const current = getCurrentUser()

  const updatedUsers = users.map((u) => {
    if (u.id === targetUserId) {
      return {
        ...u,
        connectionStatus: "pending_received" as const,
      }
    }
    return u
  })
  setItem(STORAGE_KEYS.USERS, updatedUsers)

  // Add notification to target user
  const notifs = getNotifications()
  const newNotif: AppNotification = {
    id: `notif-${Date.now()}`,
    type: "connection_request",
    actorId: current.id,
    actorName: current.name,
    actorAvatar: current.avatar,
    title: "New Connection Request",
    description: `${current.name} (${current.institution}) sent you a connection request.`,
    createdAt: "Just now",
    isRead: false,
    requestId: `req-${Date.now()}`,
  }
  setItem(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...notifs])
}

export function acceptConnectionRequest(targetUserId: string): void {
  const users = getAllUsers()
  const current = getCurrentUser()

  const updatedUsers = users.map((u) => {
    if (u.id === targetUserId) {
      return {
        ...u,
        connectionStatus: "connected" as const,
        connectionsCount: u.connectionsCount + 1,
      }
    }
    if (u.id === current.id) {
      return {
        ...u,
        connectionsCount: u.connectionsCount + 1,
      }
    }
    return u
  })
  setItem(STORAGE_KEYS.USERS, updatedUsers)

  // Add notification
  const notifs = getNotifications()
  const targetUser = users.find((u) => u.id === targetUserId)
  const newNotif: AppNotification = {
    id: `notif-${Date.now()}`,
    type: "connection_accepted",
    actorId: targetUserId,
    actorName: targetUser?.name || "A student",
    actorAvatar: targetUser?.avatar,
    title: "Connection Accepted",
    description: `You and ${targetUser?.name || "student"} are now connected on Credento.`,
    createdAt: "Just now",
    isRead: false,
  }
  setItem(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...notifs])
}

export function declineConnectionRequest(targetUserId: string): void {
  const users = getAllUsers()
  const updatedUsers = users.map((u) => {
    if (u.id === targetUserId) {
      return {
        ...u,
        connectionStatus: "none" as const,
      }
    }
    return u
  })
  setItem(STORAGE_KEYS.USERS, updatedUsers)
}

export function withdrawConnectionRequest(targetUserId: string): void {
  const users = getAllUsers()
  const updatedUsers = users.map((u) => {
    if (u.id === targetUserId) {
      return {
        ...u,
        connectionStatus: "none" as const,
      }
    }
    return u
  })
  setItem(STORAGE_KEYS.USERS, updatedUsers)
}

export function toggleFollowUser(targetUserId: string): void {
  const users = getAllUsers()
  const updatedUsers = users.map((u) => {
    if (u.id === targetUserId) {
      const willFollow = !u.isFollowing
      return {
        ...u,
        isFollowing: willFollow,
        followersCount: willFollow
          ? u.followersCount + 1
          : Math.max(0, u.followersCount - 1),
      }
    }
    return u
  })
  setItem(STORAGE_KEYS.USERS, updatedUsers)
}

// --- POSTS & FEED API ---

export function getSavedPostIds(): string[] {
  return getItem<string[]>(STORAGE_KEYS.SAVED_POSTS, ["post-1"])
}

export function toggleSavePost(postId: string): boolean {
  const saved = getSavedPostIds()
  const exists = saved.includes(postId)
  const updated = exists
    ? saved.filter((id) => id !== postId)
    : [...saved, postId]
  setItem(STORAGE_KEYS.SAVED_POSTS, updated)
  return !exists
}

export function votePostPoll(postId: string, optionId: string): void {
  const current = getCurrentUser()
  const posts = getItem<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS)
  const updated = posts.map((post) => {
    if (post.id !== postId || !post.poll) return post
    const updatedOptions = post.poll.options.map((opt) => {
      const cleanVotes = opt.votes.filter((id) => id !== current.id)
      if (opt.id === optionId) {
        return { ...opt, votes: [...cleanVotes, current.id] }
      }
      return { ...opt, votes: cleanVotes }
    })
    return { ...post, poll: { ...post.poll, options: updatedOptions } }
  })
  setItem(STORAGE_KEYS.POSTS, updated)
}

export function getPosts(): Post[] {
  initializeStorage()
  const posts = getItem<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS)
  const savedIds = getSavedPostIds()
  return posts.map((p) => ({
    ...p,
    isSaved: savedIds.includes(p.id),
  }))
}

export function createPost(params: {
  content: string
  imageUrl?: string
  linkPreview?: Post["linkPreview"]
}): Post {
  const current = getCurrentUser()
  const posts = getPosts()

  const newPost: Post = {
    id: `post-${Date.now()}`,
    authorId: current.id,
    authorName: current.name,
    authorHeadline: current.headline,
    authorInstitution: current.institution,
    authorAvatar: current.avatar,
    content: params.content,
    imageUrl: params.imageUrl,
    linkPreview: params.linkPreview,
    createdAt: "Just now",
    likes: [],
    sharesCount: 0,
    comments: [],
  }

  const updatedPosts = [newPost, ...posts]
  setItem(STORAGE_KEYS.POSTS, updatedPosts)
  return newPost
}

export function sharePost(originalPost: Post, thoughts?: string): Post {
  const current = getCurrentUser()
  const posts = getPosts()

  const newPost: Post = {
    id: `post-${Date.now()}`,
    authorId: current.id,
    authorName: current.name,
    authorHeadline: current.headline,
    authorInstitution: current.institution,
    authorAvatar: current.avatar,
    content: thoughts || `Reposted from ${originalPost.authorName}`,
    createdAt: "Just now",
    likes: [],
    sharesCount: 0,
    comments: [],
    sharedPost: {
      id: originalPost.id,
      authorName: originalPost.authorName,
      authorHeadline: originalPost.authorHeadline,
      authorAvatar: originalPost.authorAvatar,
      content: originalPost.content,
      createdAt: originalPost.createdAt,
    },
  }

  // Increment original post share count
  const updatedPosts = [
    newPost,
    ...posts.map((p) => {
      if (p.id === originalPost.id) {
        return { ...p, sharesCount: p.sharesCount + 1 }
      }
      return p
    }),
  ]

  setItem(STORAGE_KEYS.POSTS, updatedPosts)
  return newPost
}

export function editPost(postId: string, newContent: string): void {
  const posts = getPosts()
  const updatedPosts = posts.map((p) => {
    if (p.id === postId) {
      return { ...p, content: newContent }
    }
    return p
  })
  setItem(STORAGE_KEYS.POSTS, updatedPosts)
}

export function deletePost(postId: string): void {
  const posts = getPosts()
  const updatedPosts = posts.filter((p) => p.id !== postId)
  setItem(STORAGE_KEYS.POSTS, updatedPosts)
}

export function setPostReaction(postId: string, reaction: ReactionType): void {
  const currentId = getCurrentUserId()
  const posts = getPosts()

  const updatedPosts = posts.map((p) => {
    if (p.id === postId) {
      const reactions = p.reactions ? { ...p.reactions } : {}
      let nextLikes = [...p.likes]

      if (reactions[currentId] === reaction) {
        delete reactions[currentId]
        nextLikes = nextLikes.filter((id) => id !== currentId)
      } else {
        reactions[currentId] = reaction
        if (!nextLikes.includes(currentId)) {
          nextLikes.push(currentId)
        }
      }

      return { ...p, reactions, likes: nextLikes }
    }
    return p
  })
  setItem(STORAGE_KEYS.POSTS, updatedPosts)
}

export function togglePostLike(postId: string): void {
  setPostReaction(postId, "like")
}

export function editComment(
  postId: string,
  commentId: string,
  newContent: string,
): void {
  const posts = getPosts()
  const updatedPosts = posts.map((p) => {
    if (p.id === postId) {
      const updatedComments = p.comments.map((c) =>
        c.id === commentId ? { ...c, content: newContent } : c,
      )
      return { ...p, comments: updatedComments }
    }
    return p
  })
  setItem(STORAGE_KEYS.POSTS, updatedPosts)
}

export function deleteComment(postId: string, commentId: string): void {
  const posts = getPosts()
  const updatedPosts = posts.map((p) => {
    if (p.id === postId) {
      const filtered = p.comments.filter((c) => c.id !== commentId)
      return { ...p, comments: filtered }
    }
    return p
  })
  setItem(STORAGE_KEYS.POSTS, updatedPosts)
}

export function addComment(postId: string, content: string): Comment {
  const current = getCurrentUser()
  const posts = getPosts()

  const newComment: Comment = {
    id: `comm-${Date.now()}`,
    postId,
    authorId: current.id,
    authorName: current.name,
    authorHeadline: current.headline,
    authorAvatar: current.avatar,
    content,
    createdAt: "Just now",
    likes: [],
    replies: [],
  }

  const updatedPosts = posts.map((p) => {
    if (p.id === postId) {
      return { ...p, comments: [...p.comments, newComment] }
    }
    return p
  })
  setItem(STORAGE_KEYS.POSTS, updatedPosts)
  return newComment
}

export function addCommentReply(
  postId: string,
  commentId: string,
  content: string,
): void {
  const current = getCurrentUser()
  const posts = getPosts()

  const newReply = {
    id: `reply-${Date.now()}`,
    authorId: current.id,
    authorName: current.name,
    authorAvatar: current.avatar,
    content,
    createdAt: "Just now",
    likes: [],
  }

  const updatedPosts = posts.map((p) => {
    if (p.id === postId) {
      const updatedComments = p.comments.map((c) => {
        if (c.id === commentId) {
          return { ...c, replies: [...c.replies, newReply] }
        }
        return c
      })
      return { ...p, comments: updatedComments }
    }
    return p
  })
  setItem(STORAGE_KEYS.POSTS, updatedPosts)
}

// --- OPPORTUNITIES & APPLICATION TRACKING API ---

export function getAllApplications(): {
  [oppId: string]: {
    status: ApplicationStatus
    notes?: string
    appliedDate?: string
  }
} {
  return getItem(STORAGE_KEYS.APPLICATIONS, {})
}

export function updateApplicationStatus(
  oppId: string,
  status: ApplicationStatus,
  notes?: string,
): void {
  const apps = getAllApplications()
  apps[oppId] = {
    status,
    notes: notes !== undefined ? notes : (apps[oppId]?.notes ?? ""),
    appliedDate:
      apps[oppId]?.appliedDate ?? new Date().toISOString().split("T")[0],
  }
  setItem(STORAGE_KEYS.APPLICATIONS, apps)
}

export function removeApplication(oppId: string): void {
  const apps = getAllApplications()
  delete apps[oppId]
  setItem(STORAGE_KEYS.APPLICATIONS, apps)
}

export function getOpportunities(): Opportunity[] {
  initializeStorage()
  const opps = getItem<Opportunity[]>(
    STORAGE_KEYS.OPPORTUNITIES,
    INITIAL_OPPORTUNITIES,
  )
  const savedIds = getSavedOpportunityIds()
  const applications = getAllApplications()
  return opps.map((o) => ({
    ...o,
    isSaved: savedIds.includes(o.id),
    applicationStatus: applications[o.id]?.status,
    applicationNotes: applications[o.id]?.notes,
    appliedDate: applications[o.id]?.appliedDate,
  }))
}

export function getSavedOpportunityIds(): string[] {
  return getItem<string[]>(STORAGE_KEYS.SAVED_OPPORTUNITIES, ["opp-1", "opp-2"])
}

export function toggleSaveOpportunity(oppId: string): boolean {
  const saved = getSavedOpportunityIds()
  const exists = saved.includes(oppId)
  const updated = exists
    ? saved.filter((id) => id !== oppId)
    : [...saved, oppId]
  setItem(STORAGE_KEYS.SAVED_OPPORTUNITIES, updated)
  return !exists
}

export function createOpportunity(
  opp: Omit<Opportunity, "id" | "createdAt">,
): Opportunity {
  const opps = getOpportunities()
  const newOpp: Opportunity = {
    ...opp,
    id: `opp-${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
  }
  const updated = [newOpp, ...opps]
  setItem(STORAGE_KEYS.OPPORTUNITIES, updated)
  return newOpp
}

// --- MESSAGING API ---

export function getConversations(): Conversation[] {
  initializeStorage()
  return getItem<Conversation[]>(
    STORAGE_KEYS.CONVERSATIONS,
    INITIAL_CONVERSATIONS,
  )
}

export function getOrCreateConversation(targetUserId: string): Conversation {
  const currentId = getCurrentUserId()
  const conversations = getConversations()
  const existing = conversations.find(
    (c) =>
      c.participantIds.includes(targetUserId) &&
      c.participantIds.includes(currentId),
  )

  if (existing) return existing

  const targetUser = getUserById(targetUserId)
  const newConv: Conversation = {
    id: `conv-${Date.now()}`,
    participantIds: [currentId, targetUserId],
    otherUser: {
      id: targetUserId,
      name: targetUser?.name || "Student",
      headline: targetUser?.headline || "Credento Member",
      avatar: targetUser?.avatar || "",
      institution: targetUser?.institution || "University",
      isOnline: false,
    },
    lastMessage: "Started a new conversation",
    lastMessageAt: "Just now",
    unreadCount: 0,
    messages: [],
  }

  const updated = [newConv, ...conversations]
  setItem(STORAGE_KEYS.CONVERSATIONS, updated)
  return newConv
}

export function sendMessage(conversationId: string, text: string): void {
  const currentId = getCurrentUserId()
  const conversations = getConversations()

  const updated = conversations.map((conv) => {
    if (conv.id === conversationId) {
      const newMsg = {
        id: `msg-${Date.now()}`,
        senderId: currentId,
        text,
        sentAt: "Just now",
      }
      return {
        ...conv,
        lastMessage: text,
        lastMessageAt: "Just now",
        messages: [...conv.messages, newMsg],
      }
    }
    return conv
  })
  setItem(STORAGE_KEYS.CONVERSATIONS, updated)
}

export function markConversationAsRead(conversationId: string): void {
  const conversations = getConversations()
  const updated = conversations.map((conv) => {
    if (conv.id === conversationId) {
      return { ...conv, unreadCount: 0 }
    }
    return conv
  })
  setItem(STORAGE_KEYS.CONVERSATIONS, updated)
}

// --- NOTIFICATIONS API ---

export function getNotifications(): AppNotification[] {
  initializeStorage()
  return getItem<AppNotification[]>(
    STORAGE_KEYS.NOTIFICATIONS,
    INITIAL_NOTIFICATIONS,
  )
}

export function markNotificationAsRead(notifId: string): void {
  const notifs = getNotifications()
  const updated = notifs.map((n) =>
    n.id === notifId ? { ...n, isRead: true } : n,
  )
  setItem(STORAGE_KEYS.NOTIFICATIONS, updated)
}

export function markAllNotificationsAsRead(): void {
  const notifs = getNotifications()
  const updated = notifs.map((n) => ({ ...n, isRead: true }))
  setItem(STORAGE_KEYS.NOTIFICATIONS, updated)
}

// --- REPORTING API ---

export function submitReport(
  report: Omit<ReportItem, "id" | "createdAt" | "reporterId">,
): void {
  const currentId = getCurrentUserId()
  const reports = getItem<ReportItem[]>(STORAGE_KEYS.REPORTS, [])
  const newReport: ReportItem = {
    ...report,
    id: `rep-${Date.now()}`,
    reporterId: currentId,
    createdAt: new Date().toISOString(),
  }
  setItem(STORAGE_KEYS.REPORTS, [newReport, ...reports])
}

// --- ACCOUNT REGISTRATION / AUTH HELPERS ---

export function registerStudent(
  name: string,
  institution: string,
  email: string,
): StudentProfile {
  const users = getAllUsers()
  const newId = `user-${Date.now()}`
  const newStudent: StudentProfile = {
    id: newId,
    name,
    email,
    institution,
    facultyOrDepartment: "General Studies",
    degree: "Undergraduate Degree",
    graduationYear: 2027,
    headline: `Student @ ${institution}`,
    location: "Campus",
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=173a35`,
    coverImage:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    about: `Hello! I am a student at ${institution} exploring opportunities and connecting with peers across different academic disciplines on Credento.`,
    isPublic: true,
    skills: ["Critical Thinking", "Academic Research", "Team Collaboration"],
    interests: ["Higher Education", "Student Leadership"],
    education: [
      {
        id: `edu-${Date.now()}`,
        institution,
        degree: "Bachelor of Science / Arts",
        fieldOfStudy: "Academic Major",
        startYear: 2023,
        endYear: 2027,
      },
    ],
    portfolioItems: [],
    connectionsCount: 0,
    followersCount: 0,
    connectionStatus: "self",
    isFollowing: false,
  }

  const updatedUsers = [...users, newStudent]
  setItem(STORAGE_KEYS.USERS, updatedUsers)
  setCurrentUserId(newId)
  return newStudent
}

// --- STUDY GROUPS & COMMUNITIES API ---

export function getGroups(): StudyGroup[] {
  initializeStorage()
  return getItem<StudyGroup[]>(STORAGE_KEYS.GROUPS, INITIAL_GROUPS)
}

export function toggleJoinGroup(groupId: string): void {
  const groups = getGroups()
  const updated = groups.map((g) => {
    if (g.id === groupId) {
      const isNowJoined = !g.isJoined
      return {
        ...g,
        isJoined: isNowJoined,
        memberCount: isNowJoined
          ? g.memberCount + 1
          : Math.max(1, g.memberCount - 1),
      }
    }
    return g
  })
  setItem(STORAGE_KEYS.GROUPS, updated)
}

export function createGroup(
  group: Omit<StudyGroup, "id" | "memberCount" | "isJoined">,
): StudyGroup {
  const groups = getGroups()
  const newGroup: StudyGroup = {
    ...group,
    id: `grp-${Date.now()}`,
    memberCount: 1,
    isJoined: true,
  }
  const updated = [newGroup, ...groups]
  setItem(STORAGE_KEYS.GROUPS, updated)
  return newGroup
}
