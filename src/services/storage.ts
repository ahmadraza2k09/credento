import {
  AccessCenterOrganization,
  AccessCenterService,
  AppNotification,
  ApplicationStatus,
  CenterStatus,
  ChatMessage,
  Comment,
  ConnectionRelationship,
  ConnectionStatus,
  Conversation,
  EducationItem,
  FollowRelationship,
  OfficialAnnouncement,
  Opportunity,
  PortfolioItem,
  Post,
  ReactionType,
  ReportItem,
  ReportStatus,
  ServiceRequest,
  ServiceRequestStatus,
  StudentProfile,
} from "../types"
import { INITIAL_ACCESS_CENTERS, INITIAL_OPPORTUNITIES } from "../data/mockData"

const STORAGE_SCHEMA_VERSION = "credento_v2_production_release"

const STORAGE_KEYS = {
  SCHEMA_VERSION: "credento_schema_version",
  CURRENT_USER_ID: "credento_current_user_id",
  USERS: "credento_users",
  CONNECTIONS: "credento_connections",
  FOLLOWS: "credento_follows",
  POSTS: "credento_posts",
  SAVED_POSTS: "credento_saved_posts",
  OPPORTUNITIES: "credento_opportunities",
  SAVED_OPPORTUNITIES: "credento_saved_opportunities",
  APPLICATIONS: "credento_applications",
  CONVERSATIONS: "credento_conversations",
  NOTIFICATIONS: "credento_notifications",
  BLOCKED_USERS: "credento_blocked_users",
  REPORTS: "credento_reports",
  ACCESS_CENTERS: "credento_access_centers",
  SERVICE_REQUESTS: "credento_service_requests",
  OFFICIAL_ANNOUNCEMENTS: "credento_official_announcements",
  ADMIN_SESSION: "credento_admin_session",
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

export function notifySubscribers() {
  listeners.forEach((l) => {
    try {
      l()
    } catch (e) {
      console.error("Error in storage subscriber", e)
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

// Reset and initialize storage for true production experience
export function initializeStorage(): void {
  try {
    if (typeof window === "undefined" || !window.localStorage) return

    const currentVersion = localStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION)

    if (currentVersion !== STORAGE_SCHEMA_VERSION) {
      // Migrate to clean production schema: Wipe out old mock students/demo model profiles
      try {
        localStorage.removeItem("credento_demo-name")
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID)
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]))
        localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify([]))
        localStorage.setItem(STORAGE_KEYS.FOLLOWS, JSON.stringify([]))
      } catch {}

      const initialPosts: Post[] = [
        {
          id: "post-welcome-team",
          authorId: "credento-admin",
          authorName: "Credento Team",
          authorHeadline: "Official Platform Administration",
          authorInstitution: "Credento Global Administration",
          authorAvatar:
            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'><rect width='128' height='128' fill='%23173a35'/><text x='50%' y='54%' text-anchor='middle' dominant-baseline='middle' font-family='sans-serif' font-weight='bold' font-size='36' fill='%23ffffff'>TEAM</text></svg>",
          content:
            "Welcome to Credento — The student-only academic and professional networking platform. Connect with fellow university scholars, build your verified profile, and access free organizational support through the Credento Access Center.",
          topic: "General",
          createdAt: "Just now",
          likes: [],
          sharesCount: 0,
          comments: [],
        },
      ]

      try {
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(initialPosts))
        localStorage.setItem(STORAGE_KEYS.SAVED_POSTS, JSON.stringify([]))
        localStorage.setItem(
          STORAGE_KEYS.OPPORTUNITIES,
          JSON.stringify(INITIAL_OPPORTUNITIES),
        )
        localStorage.setItem(STORAGE_KEYS.SAVED_OPPORTUNITIES, JSON.stringify([]))
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify({}))
        localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify([]))
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]))
        localStorage.setItem(STORAGE_KEYS.BLOCKED_USERS, JSON.stringify([]))
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify([]))
        localStorage.setItem(
          STORAGE_KEYS.ACCESS_CENTERS,
          JSON.stringify(INITIAL_ACCESS_CENTERS),
        )
        localStorage.setItem(STORAGE_KEYS.SERVICE_REQUESTS, JSON.stringify([]))
        localStorage.setItem(
          STORAGE_KEYS.OFFICIAL_ANNOUNCEMENTS,
          JSON.stringify([
            {
              id: "ann-welcome",
              title: "Welcome to Credento — The Student Academic Network",
              content:
                "Credento is officially live! Build your verified scholar profile, connect with fellow students across universities, explore verified fellowships & grants, and access free organizational services via Credento Access Center.",
              type: "announcement",
              targetType: "all",
              createdAt: "2026-02-01",
              readBy: [],
              authorTitle: "Credento Team",
            },
          ]),
        )
        localStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, STORAGE_SCHEMA_VERSION)
      } catch (err) {
        console.warn("Error saving initial seed data to storage:", err)
      }
    }
  } catch (outerErr) {
    console.warn("Storage initialization bypassed:", outerErr)
  }
}

// Call initialization safely on module load
try {
  initializeStorage()
} catch (e) {
  console.warn("Initial storage load caught:", e)
}

// ==========================================
// 1. AUTHENTICATION & USER MANAGEMENT
// ==========================================

export function getCurrentUserId(): string | null {
  return getItem<string | null>(STORAGE_KEYS.CURRENT_USER_ID, null)
}

export function setCurrentUserId(userId: string | null): void {
  if (userId === null) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID)
    sessionStorage.removeItem("credento_current_session")
  } else {
    setItem(STORAGE_KEYS.CURRENT_USER_ID, userId)
    sessionStorage.setItem("credento_current_session", userId)
  }
  notifySubscribers()
}

export function getAllUsers(): StudentProfile[] {
  return getItem<StudentProfile[]>(STORAGE_KEYS.USERS, [])
}

export function getUserById(userId: string): StudentProfile | undefined {
  const users = getAllUsers()
  return users.find((u) => u.id === userId)
}

export function getUserByUsername(
  username: string,
): StudentProfile | undefined {
  const clean = username.replace(/^@/, "").toLowerCase()
  return getAllUsers().find((u) => u.username?.toLowerCase() === clean)
}

export function getCurrentUser(): StudentProfile | null {
  const currentId = getCurrentUserId()
  if (!currentId) return null
  const user = getUserById(currentId)
  return user || null
}

export function registerStudent(params: {
  firstName?: string
  lastName?: string
  name?: string
  username?: string
  email: string
  password?: string
  institution?: string
  facultyOrDepartment?: string
  degree?: string
  graduationYear?: number | string
  headline?: string
  location?: string
}): StudentProfile {
  const users = getAllUsers()
  
  // Construct full name from firstName + lastName or name
  const fullName = (
    params.name ||
    `${params.firstName || ""} ${params.lastName || ""}`
  ).trim() || "Student Scholar"

  // Derive unique clean username
  let cleanUsername = (params.username || "")
    .replace(/^@/, "")
    .trim()
    .toLowerCase()

  if (!cleanUsername) {
    const fromName = fullName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "")
    const fromEmail = (params.email || "")
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")
    cleanUsername = fromName || fromEmail || `scholar_${Date.now().toString().slice(-4)}`
  }

  // Ensure username uniqueness
  let finalUsername = cleanUsername
  let counter = 1
  while (users.some((u) => u.username?.toLowerCase() === finalUsername.toLowerCase())) {
    finalUsername = `${cleanUsername}${counter}`
    counter++
  }

  // Generate unique ID
  const newId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`

  // Instant reliable initials SVG avatar (no external dependency)
  const initials =
    fullName
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "ST"

  const avatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" fill="%23173a35"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-weight="bold" font-size="44" fill="%23ffffff">${encodeURIComponent(initials)}</text></svg>`

  const inst = params.institution?.trim() || "Student"
  const deg = params.degree?.trim() || "Student"
  const head = params.headline?.trim() || (inst !== "Student" ? `Student @ ${inst}` : "Student Scholar")

  const newStudent: StudentProfile = {
    id: newId,
    name: fullName,
    username: finalUsername,
    email: params.email.trim().toLowerCase(),
    password: params.password || "student123",
    role: "student",
    headline: head,
    institution: inst,
    facultyOrDepartment: params.facultyOrDepartment?.trim() || "Academic Studies",
    degree: deg,
    graduationYear: params.graduationYear || 2027,
    location: params.location?.trim() || "Campus",
    avatar,
    coverImage:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    about: `Hello, I'm ${fullName}. I'm on Credento to connect with students, share research projects, and discover academic opportunities.`,
    isPublic: true,
    visibility: "public",
    skills: ["Academic Research", "Collaboration", "Critical Thinking"],
    interests: ["Higher Education", "Technology & Society"],
    education:
      inst !== "Student"
        ? [
            {
              id: `edu-${Date.now()}`,
              institution: inst,
              degree: deg,
              fieldOfStudy: params.facultyOrDepartment?.trim() || "Academic Focus",
              startYear: 2023,
              endYear: params.graduationYear || 2027,
            },
          ]
        : [],
    portfolioItems: [],
    connectionsCount: 0,
    followersCount: 0,
    createdAt: new Date().toISOString(),
  }

  const updatedUsers = [...users, newStudent]
  setItem(STORAGE_KEYS.USERS, updatedUsers)
  
  // Clear any stale admin session flag
  setAdminSession(false)
  setCurrentUserId(newId)

  // Create welcome notification
  createNotification({
    targetUserId: newId,
    type: "announcement",
    title: "Welcome to Credento!",
    description:
      "Your genuine student profile is created. Add your projects, skills, and connect with peers.",
  })

  return newStudent
}

export function getAdminUserProfile(): StudentProfile {
  const users = getAllUsers()
  let admin = users.find(
    (u) =>
      u.email?.toLowerCase() === "team@credento.world" ||
      u.username?.toLowerCase() === "team" ||
      u.id === "credento-admin",
  )

  if (!admin) {
    admin = {
      id: "credento-admin",
      name: "Credento Team",
      username: "team",
      email: "team@credento.world",
      role: "admin",
      password: "badabdcad786",
      headline: "Credento Platform Administration & Academic Standards",
      institution: "Credento Global Administration",
      facultyOrDepartment: "Platform Operations",
      degree: "Academic Governance",
      graduationYear: "Ongoing",
      location: "San Francisco, CA & Global",
      about:
        "Official platform administration and community standards verification team for Credento. Ensuring authentic student identity, safety oath adherence, and Access Center ecosystem governance.",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      coverImage:
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80",
      connectionsCount: 0,
      followersCount: 0,
      isPublic: true,
      skills: [
        "Platform Governance",
        "Academic Verification",
        "Access Center Review",
        "Student Safety",
      ],
      interests: [
        "Higher Education",
        "Collegiate Enablement",
        "Digital Access",
      ],
      portfolioItems: [],
      education: [
        {
          id: "edu-admin",
          institution: "Credento Administration",
          degree: "Platform Moderation & Security",
          fieldOfStudy: "Platform Operations",
          startYear: "2024",
          endYear: "Present",
        },
      ],
      createdAt: new Date().toISOString(),
    }
    setItem(STORAGE_KEYS.USERS, [admin, ...users])
  } else {
    // Keep credentials synchronized
    if (admin.password !== "badabdcad786" || admin.role !== "admin") {
      admin.password = "badabdcad786"
      admin.role = "admin"
      setItem(
        STORAGE_KEYS.USERS,
        users.map((u) => (u.id === admin!.id ? admin! : u)),
      )
    }
  }

  return admin!
}

export function loginStudent(
  emailOrUsername: string,
  password?: string,
): {
  success: boolean
  user?: StudentProfile
  error?: string
  isAdmin?: boolean
} {
  const users = getAllUsers()
  const q = emailOrUsername.trim().toLowerCase().replace(/^@/, "")
  const pwd = password ? password.trim() : ""

  // Direct Credento Team Admin Login Verification
  if (
    (q === "team@credento.world" || q === "team" || q === "admin") &&
    pwd === "badabdcad786"
  ) {
    const adminUser = getAdminUserProfile()
    setAdminSession(true)
    setCurrentUserId(adminUser.id)
    return { success: true, user: adminUser, isAdmin: true }
  }

  const found = users.find(
    (u) =>
      u.email?.toLowerCase() === q ||
      u.username?.toLowerCase() === q ||
      u.name.toLowerCase() === q,
  )

  if (!found) {
    return {
      success: false,
      error:
        "No student account matches that email or username. Please check your credentials or register a new account.",
    }
  }

  if (found.isSuspended) {
    return {
      success: false,
      error: `This account has been suspended by Credento Administration: ${
        found.suspendedReason || "Terms violation."
      }`,
    }
  }

  // Password check (verification for local auth)
  if (password && found.password && found.password !== password) {
    return {
      success: false,
      error: "Incorrect password. Please verify and try again.",
    }
  }

  // If user is admin profile
  if (
    found.email?.toLowerCase() === "team@credento.world" ||
    found.role === "admin"
  ) {
    setAdminSession(true)
    setCurrentUserId(found.id)
    return { success: true, user: found, isAdmin: true }
  }

  setAdminSession(false)
  setCurrentUserId(found.id)
  return { success: true, user: found, isAdmin: false }
}

export function updateCurrentUserProfile(
  updates: Partial<StudentProfile>,
): StudentProfile | null {
  const current = getCurrentUser()
  if (!current) return null

  const users = getAllUsers()
  const updatedUsers = users.map((u) => {
    if (u.id === current.id) {
      return { ...u, ...updates }
    }
    return u
  })

  setItem(STORAGE_KEYS.USERS, updatedUsers)
  return getUserById(current.id) || null
}

export function suspendUser(userId: string, reason: string): void {
  const users = getAllUsers()
  const updatedUsers = users.map((u) => {
    if (u.id === userId) {
      return {
        ...u,
        isSuspended: true,
        suspendedReason: reason,
      }
    }
    return u
  })
  setItem(STORAGE_KEYS.USERS, updatedUsers)
}

export function reactivateUser(userId: string): void {
  const users = getAllUsers()
  const updatedUsers = users.map((u) => {
    if (u.id === userId) {
      return {
        ...u,
        isSuspended: false,
        suspendedReason: undefined,
      }
    }
    return u
  })
  setItem(STORAGE_KEYS.USERS, updatedUsers)
}

export function deleteUserAccount(userId: string): void {
  // Remove user from users
  const users = getAllUsers().filter((u) => u.id !== userId)
  setItem(STORAGE_KEYS.USERS, users)

  // Clean up connections
  const connections = getConnections().filter(
    (c) => c.requesterId !== userId && c.receiverId !== userId,
  )
  setItem(STORAGE_KEYS.CONNECTIONS, connections)

  // Clean up follows
  const follows = getFollows().filter(
    (f) => f.followerId !== userId && f.followedId !== userId,
  )
  setItem(STORAGE_KEYS.FOLLOWS, follows)

  // Clean up posts by user
  const posts = getPosts().filter((p) => p.authorId !== userId)
  setItem(STORAGE_KEYS.POSTS, posts)

  // Clean up conversations
  const conversations = getConversations().filter(
    (c) => !c.participantIds.includes(userId),
  )
  setItem(STORAGE_KEYS.CONVERSATIONS, conversations)

  // Clean up notifications
  const notifs = getNotifications().filter(
    (n) => n.actorId !== userId && n.targetId !== userId,
  )
  setItem(STORAGE_KEYS.NOTIFICATIONS, notifs)

  // If deleted user was current user, sign out
  if (getCurrentUserId() === userId) {
    setCurrentUserId(null)
  }
}

// ==========================================
// 2. PROFILE COMPLETENESS GUIDANCE
// ==========================================

export function calculateProfileCompleteness(
  profile: StudentProfile,
): {
  percentage: number
  missingFields: string[]
  completedFields: string[]
} {
  let score = 0
  const missing: string[] = []
  const completed: string[] = []

  if (profile.name?.trim()) {
    score += 15
    completed.push("Full Name")
  } else missing.push("Full Name")

  if (profile.headline?.trim()) {
    score += 15
    completed.push("Headline")
  } else missing.push("Professional headline")

  if (profile.about?.trim() && profile.about.length >= 30) {
    score += 15
    completed.push("About & Biography")
  } else missing.push("About section (30+ characters)")

  if (profile.avatar?.trim()) {
    score += 10
    completed.push("Profile Photo")
  } else missing.push("Profile photo")

  if (profile.institution?.trim() && profile.degree?.trim()) {
    score += 15
    completed.push("Current Education")
  } else missing.push("Current university & degree")

  if (profile.skills && profile.skills.length >= 3) {
    score += 15
    completed.push("3+ Academic Skills")
  } else missing.push("Add at least 3 skills")

  if (profile.portfolioItems && profile.portfolioItems.length >= 1) {
    score += 15
    completed.push("Project or Achievement")
  } else missing.push("Add at least 1 project, publication, or award")

  return {
    percentage: Math.min(score, 100),
    missingFields: missing,
    completedFields: completed,
  }
}

// ==========================================
// 3. PROFILE SUB-ITEMS (EDUCATION, PORTFOLIO, SKILLS)
// ==========================================

export function addPortfolioItem(
  item: Omit<PortfolioItem, "id">,
): PortfolioItem | null {
  const current = getCurrentUser()
  if (!current) return null

  const newItem: PortfolioItem = {
    ...item,
    id: `port-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  }

  const updatedItems = [newItem, ...(current.portfolioItems || [])]
  updateCurrentUserProfile({ portfolioItems: updatedItems })
  return newItem
}

export function updatePortfolioItem(
  itemId: string,
  updates: Partial<PortfolioItem>,
): void {
  const current = getCurrentUser()
  if (!current) return

  const updatedItems = (current.portfolioItems || []).map((item) =>
    item.id === itemId ? { ...item, ...updates } : item,
  )
  updateCurrentUserProfile({ portfolioItems: updatedItems })
}

export function removePortfolioItem(itemId: string): void {
  const current = getCurrentUser()
  if (!current) return

  const updatedItems = (current.portfolioItems || []).filter(
    (item) => item.id !== itemId,
  )
  updateCurrentUserProfile({ portfolioItems: updatedItems })
}

export function addEducation(
  edu: Omit<EducationItem, "id">,
): EducationItem | null {
  const current = getCurrentUser()
  if (!current) return null

  const newEdu: EducationItem = {
    ...edu,
    id: `edu-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
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
  if (!current) return

  const updatedEdu = (current.education || []).map((e) =>
    e.id === eduId ? { ...e, ...updates } : e,
  )
  updateCurrentUserProfile({ education: updatedEdu })
}

export function deleteEducation(eduId: string): void {
  const current = getCurrentUser()
  if (!current) return

  const updatedEdu = (current.education || []).filter((e) => e.id !== eduId)
  updateCurrentUserProfile({ education: updatedEdu })
}

export function addSkill(skill: string): void {
  const current = getCurrentUser()
  if (!current) return
  const trimmed = skill.trim()
  if (!trimmed || current.skills?.includes(trimmed)) return

  updateCurrentUserProfile({ skills: [...(current.skills || []), trimmed] })
}

export function removeSkill(skill: string): void {
  const current = getCurrentUser()
  if (!current) return

  updateCurrentUserProfile({
    skills: (current.skills || []).filter((s) => s !== skill),
  })
}

export function endorseSkill(targetUserId: string, skillName: string): void {
  const current = getCurrentUser()
  if (!current || current.id === targetUserId) return

  const users = getAllUsers()
  const updatedUsers = users.map((u) => {
    if (u.id !== targetUserId) return u
    const endorsements = u.skillEndorsements ? { ...u.skillEndorsements } : {}
    const existing = endorsements[skillName] || []
    if (existing.includes(current.id)) {
      endorsements[skillName] = existing.filter((id) => id !== current.id)
    } else {
      endorsements[skillName] = [...existing, current.id]
    }
    return { ...u, skillEndorsements: endorsements }
  })
  setItem(STORAGE_KEYS.USERS, updatedUsers)
}

export function addInterest(interest: string): void {
  const current = getCurrentUser()
  if (!current) return
  const trimmed = interest.trim()
  if (!trimmed || current.interests?.includes(trimmed)) return

  updateCurrentUserProfile({
    interests: [...(current.interests || []), trimmed],
  })
}

export function removeInterest(interest: string): void {
  const current = getCurrentUser()
  if (!current) return

  updateCurrentUserProfile({
    interests: (current.interests || []).filter((i) => i !== interest),
  })
}

// ==========================================
// 4. REAL RELATIONAL NETWORKING & CONNECTIONS
// ==========================================

export function getConnections(): ConnectionRelationship[] {
  return getItem<ConnectionRelationship[]>(STORAGE_KEYS.CONNECTIONS, [])
}

export function getFollows(): FollowRelationship[] {
  return getItem<FollowRelationship[]>(STORAGE_KEYS.FOLLOWS, [])
}

export function getConnectionStatus(
  viewerId: string,
  targetUserId: string,
): ConnectionStatus {
  if (viewerId === targetUserId) return "self"

  const connections = getConnections()
  const rel = connections.find(
    (c) =>
      (c.requesterId === viewerId && c.receiverId === targetUserId) ||
      (c.requesterId === targetUserId && c.receiverId === viewerId),
  )

  if (!rel) return "none"
  if (rel.status === "connected") return "connected"
  if (rel.status === "pending") {
    return rel.requesterId === viewerId ? "pending_sent" : "pending_received"
  }
  return "none"
}

export function isFollowingUser(
  viewerId: string,
  targetUserId: string,
): boolean {
  if (viewerId === targetUserId) return false
  const follows = getFollows()
  return follows.some(
    (f) => f.followerId === viewerId && f.followedId === targetUserId,
  )
}

export function getStudentWithNetworkStatus(
  student: StudentProfile,
  viewerId?: string,
): StudentProfile {
  const activeViewerId = viewerId || getCurrentUserId()
  if (!activeViewerId) {
    return {
      ...student,
      connectionStatus: "none",
      isFollowing: false,
    }
  }

  const connStatus = getConnectionStatus(activeViewerId, student.id)
  const isFollowing = isFollowingUser(activeViewerId, student.id)

  // Calculate actual connections count from database
  const connections = getConnections()
  const mutualCount = connections.filter(
    (c) =>
      c.status === "connected" &&
      (c.requesterId === student.id || c.receiverId === student.id),
  ).length

  // Calculate actual followers count
  const follows = getFollows()
  const followersCount = follows.filter(
    (f) => f.followedId === student.id,
  ).length

  return {
    ...student,
    connectionStatus: connStatus,
    isFollowing,
    connectionsCount: mutualCount,
    followersCount,
  }
}

export function sendConnectionRequest(targetUserId: string): void {
  const current = getCurrentUser()
  if (!current || current.id === targetUserId) return

  const connections = getConnections()
  // Check if relation already exists
  const existing = connections.find(
    (c) =>
      (c.requesterId === current.id && c.receiverId === targetUserId) ||
      (c.requesterId === targetUserId && c.receiverId === current.id),
  )

  if (existing) {
    if (existing.status === "declined") {
      // Re-open
      const updated = connections.map((c) =>
        c.id === existing.id
          ? {
              ...c,
              requesterId: current.id,
              receiverId: targetUserId,
              status: "pending" as const,
            }
          : c,
      )
      setItem(STORAGE_KEYS.CONNECTIONS, updated)
    }
    return
  }

  const newRel: ConnectionRelationship = {
    id: `conn-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    requesterId: current.id,
    receiverId: targetUserId,
    status: "pending",
    createdAt: new Date().toISOString(),
  }

  setItem(STORAGE_KEYS.CONNECTIONS, [...connections, newRel])

  // Create notification for target user
  createNotification({
    targetUserId,
    actorId: current.id,
    actorName: current.name,
    actorAvatar: current.avatar,
    type: "connection_request",
    title: "New Connection Request",
    description: `${current.name} (${current.institution}) sent you a connection request.`,
    targetTab: "network",
  })
}

export function acceptConnectionRequest(targetUserId: string): void {
  const current = getCurrentUser()
  if (!current) return

  const connections = getConnections()
  const rel = connections.find(
    (c) =>
      (c.requesterId === targetUserId && c.receiverId === current.id) ||
      (c.requesterId === current.id && c.receiverId === targetUserId),
  )

  if (!rel) return

  const updated = connections.map((c) =>
    c.id === rel.id ? { ...c, status: "connected" as const } : c,
  )
  setItem(STORAGE_KEYS.CONNECTIONS, updated)

  // Notify requester
  const targetUser = getUserById(targetUserId)
  createNotification({
    targetUserId: targetUserId,
    actorId: current.id,
    actorName: current.name,
    actorAvatar: current.avatar,
    type: "connection_accepted",
    title: "Connection Accepted",
    description: `You and ${current.name} are now connected on Credento.`,
    targetTab: "network",
  })
}

export function declineConnectionRequest(targetUserId: string): void {
  const current = getCurrentUser()
  if (!current) return

  const connections = getConnections()
  const updated = connections.filter(
    (c) =>
      !(
        (c.requesterId === targetUserId && c.receiverId === current.id) ||
        (c.requesterId === current.id && c.receiverId === targetUserId)
      ),
  )
  setItem(STORAGE_KEYS.CONNECTIONS, updated)
}

export function withdrawConnectionRequest(targetUserId: string): void {
  const current = getCurrentUser()
  if (!current) return

  const connections = getConnections()
  const updated = connections.filter(
    (c) =>
      !(
        c.requesterId === current.id &&
        c.receiverId === targetUserId &&
        c.status === "pending"
      ),
  )
  setItem(STORAGE_KEYS.CONNECTIONS, updated)
}

export function removeConnection(targetUserId: string): void {
  const current = getCurrentUser()
  if (!current) return

  const connections = getConnections()
  const updated = connections.filter(
    (c) =>
      !(
        (c.requesterId === current.id && c.receiverId === targetUserId) ||
        (c.requesterId === targetUserId && c.receiverId === current.id)
      ),
  )
  setItem(STORAGE_KEYS.CONNECTIONS, updated)
}

export function toggleFollowUser(targetUserId: string): void {
  const current = getCurrentUser()
  if (!current || current.id === targetUserId) return

  const follows = getFollows()
  const exists = follows.some(
    (f) => f.followerId === current.id && f.followedId === targetUserId,
  )

  if (exists) {
    const updated = follows.filter(
      (f) => !(f.followerId === current.id && f.followedId === targetUserId),
    )
    setItem(STORAGE_KEYS.FOLLOWS, updated)
  } else {
    const newFollow: FollowRelationship = {
      followerId: current.id,
      followedId: targetUserId,
    }
    setItem(STORAGE_KEYS.FOLLOWS, [...follows, newFollow])
  }
}

export function getBlockedUserIds(): string[] {
  return getItem<string[]>(STORAGE_KEYS.BLOCKED_USERS, [])
}

export function blockUser(targetUserId: string): void {
  const blocked = getBlockedUserIds()
  if (!blocked.includes(targetUserId)) {
    setItem(STORAGE_KEYS.BLOCKED_USERS, [...blocked, targetUserId])
    // Also sever any connection
    removeConnection(targetUserId)
  }
}

export function unblockUser(targetUserId: string): void {
  const blocked = getBlockedUserIds()
  setItem(
    STORAGE_KEYS.BLOCKED_USERS,
    blocked.filter((id) => id !== targetUserId),
  )
}

// ==========================================
// 5. POSTS & FEED
// ==========================================

export function getPosts(): Post[] {
  let posts = getItem<Post[]>(STORAGE_KEYS.POSTS, [])
  if (posts.length === 0) {
    posts = [
      {
        id: "post-welcome-team",
        authorId: "credento-admin",
        authorName: "Credento Team",
        authorHeadline: "Official Platform Administration",
        authorInstitution: "Credento Global Administration",
        authorAvatar:
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'><rect width='128' height='128' fill='%23173a35'/><text x='50%' y='54%' text-anchor='middle' dominant-baseline='middle' font-family='sans-serif' font-weight='bold' font-size='36' fill='%23ffffff'>TEAM</text></svg>",
        content:
          "Welcome to Credento — The student-only academic and professional networking platform. Connect with fellow university scholars, build your verified profile, and access free organizational support through the Credento Access Center.",
        topic: "General",
        createdAt: "Just now",
        likes: [],
        sharesCount: 0,
        comments: [],
      },
    ]
    setItem(STORAGE_KEYS.POSTS, posts)
  }
  const savedIds = getSavedPostIds()
  return posts.map((p) => ({
    ...p,
    isSaved: savedIds.includes(p.id),
  }))
}

export function getSavedPostIds(): string[] {
  return getItem<string[]>(STORAGE_KEYS.SAVED_POSTS, [])
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

export function createPost(params: {
  content: string
  imageUrl?: string
  linkPreview?: Post["linkPreview"]
  topic?: Post["topic"]
  poll?: Post["poll"]
}): Post | null {
  const current = getCurrentUser()
  if (!current) return null

  const posts = getPosts()
  const newPost: Post = {
    id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    authorId: current.id,
    authorName: current.name,
    authorHeadline: current.headline,
    authorInstitution: current.institution,
    authorAvatar: current.avatar,
    content: params.content.trim(),
    imageUrl: params.imageUrl,
    linkPreview: params.linkPreview,
    topic: params.topic || "General",
    poll: params.poll,
    createdAt: "Just now",
    likes: [],
    sharesCount: 0,
    comments: [],
  }

  setItem(STORAGE_KEYS.POSTS, [newPost, ...posts])
  return newPost
}

export function sharePost(originalPost: Post, thoughts?: string): Post | null {
  const current = getCurrentUser()
  if (!current) return null

  const posts = getPosts()
  const newPost: Post = {
    id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    authorId: current.id,
    authorName: current.name,
    authorHeadline: current.headline,
    authorInstitution: current.institution,
    authorAvatar: current.avatar,
    content: thoughts?.trim() || `Reposted from ${originalPost.authorName}`,
    createdAt: "Just now",
    likes: [],
    sharesCount: 0,
    comments: [],
    topic: originalPost.topic || "General",
    sharedPost: {
      id: originalPost.id,
      authorName: originalPost.authorName,
      authorHeadline: originalPost.authorHeadline,
      authorAvatar: originalPost.authorAvatar,
      content: originalPost.content,
      createdAt: originalPost.createdAt,
    },
  }

  const updatedPosts = [
    newPost,
    ...posts.map((p) =>
      p.id === originalPost.id
        ? { ...p, sharesCount: (p.sharesCount || 0) + 1 }
        : p,
    ),
  ]

  setItem(STORAGE_KEYS.POSTS, updatedPosts)
  return newPost
}

export function editPost(postId: string, newContent: string): void {
  const posts = getPosts()
  const updated = posts.map((p) =>
    p.id === postId ? { ...p, content: newContent.trim(), isEdited: true } : p,
  )
  setItem(STORAGE_KEYS.POSTS, updated)
}

export function deletePost(postId: string): void {
  const posts = getPosts().filter((p) => p.id !== postId)
  setItem(STORAGE_KEYS.POSTS, posts)
}

export function setPostReaction(postId: string, reaction: ReactionType): void {
  const current = getCurrentUser()
  if (!current) return

  const posts = getPosts()
  const updated = posts.map((p) => {
    if (p.id !== postId) return p
    const reactions = p.reactions ? { ...p.reactions } : {}
    let nextLikes = [...p.likes]

    if (reactions[current.id] === reaction) {
      delete reactions[current.id]
      nextLikes = nextLikes.filter((id) => id !== current.id)
    } else {
      reactions[current.id] = reaction
      if (!nextLikes.includes(current.id)) {
        nextLikes.push(current.id)
      }
    }

    return { ...p, reactions, likes: nextLikes }
  })

  setItem(STORAGE_KEYS.POSTS, updated)

  // Notify post author if not self
  const post = posts.find((p) => p.id === postId)
  if (
    post &&
    post.authorId !== current.id &&
    !post.likes.includes(current.id)
  ) {
    createNotification({
      targetUserId: post.authorId,
      actorId: current.id,
      actorName: current.name,
      actorAvatar: current.avatar,
      type: "like",
      title: "Post Interaction",
      description: `${current.name} reacted to your post: "${post.content.slice(0, 40)}..."`,
      targetTab: "feed",
    })
  }
}

export function togglePostLike(postId: string): void {
  setPostReaction(postId, "like")
}

export function addComment(postId: string, content: string): Comment | null {
  const current = getCurrentUser()
  if (!current || !content.trim()) return null

  const posts = getPosts()
  const newComment: Comment = {
    id: `comm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    postId,
    authorId: current.id,
    authorName: current.name,
    authorHeadline: current.headline,
    authorAvatar: current.avatar,
    content: content.trim(),
    createdAt: "Just now",
    likes: [],
    replies: [],
  }

  const updatedPosts = posts.map((p) =>
    p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p,
  )
  setItem(STORAGE_KEYS.POSTS, updatedPosts)

  // Notify post author
  const post = posts.find((p) => p.id === postId)
  if (post && post.authorId !== current.id) {
    createNotification({
      targetUserId: post.authorId,
      actorId: current.id,
      actorName: current.name,
      actorAvatar: current.avatar,
      type: "comment",
      title: "New Comment",
      description: `${current.name} commented on your post: "${content.trim().slice(0, 40)}..."`,
      targetTab: "feed",
    })
  }

  return newComment
}

export function addCommentReply(
  postId: string,
  commentId: string,
  content: string,
): void {
  const current = getCurrentUser()
  if (!current || !content.trim()) return

  const posts = getPosts()
  const newReply = {
    id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    authorId: current.id,
    authorName: current.name,
    authorHeadline: current.headline,
    authorAvatar: current.avatar,
    content: content.trim(),
    createdAt: "Just now",
    likes: [],
  }

  const updatedPosts = posts.map((p) => {
    if (p.id !== postId) return p
    const updatedComments = p.comments.map((c) => {
      if (c.id === commentId) {
        return { ...c, replies: [...c.replies, newReply] }
      }
      return c
    })
    return { ...p, comments: updatedComments }
  })

  setItem(STORAGE_KEYS.POSTS, updatedPosts)
}

export function editComment(
  postId: string,
  commentId: string,
  newContent: string,
): void {
  const posts = getPosts()
  const updatedPosts = posts.map((p) => {
    if (p.id !== postId) return p
    const updatedComments = p.comments.map((c) =>
      c.id === commentId ? { ...c, content: newContent.trim() } : c,
    )
    return { ...p, comments: updatedComments }
  })
  setItem(STORAGE_KEYS.POSTS, updatedPosts)
}

export function deleteComment(postId: string, commentId: string): void {
  const posts = getPosts()
  const updatedPosts = posts.map((p) => {
    if (p.id !== postId) return p
    return {
      ...p,
      comments: p.comments.filter((c) => c.id !== commentId),
    }
  })
  setItem(STORAGE_KEYS.POSTS, updatedPosts)
}

export function votePostPoll(postId: string, optionId: string): void {
  const current = getCurrentUser()
  if (!current) return

  const posts = getPosts()
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

// ==========================================
// 6. MESSAGING
// ==========================================

export function getConversations(): Conversation[] {
  const currentId = getCurrentUserId()
  const allConversations = getItem<Conversation[]>(
    STORAGE_KEYS.CONVERSATIONS,
    [],
  )
  if (!currentId) return []

  // Only return conversations where current user is a participant
  return allConversations.filter((c) => c.participantIds.includes(currentId))
}

export function getOrCreateConversation(targetUserId: string): Conversation {
  const current = getCurrentUser()
  if (!current) throw new Error("Must be logged in to message")

  const allConversations = getItem<Conversation[]>(
    STORAGE_KEYS.CONVERSATIONS,
    [],
  )
  const existing = allConversations.find(
    (c) =>
      c.participantIds.includes(targetUserId) &&
      c.participantIds.includes(current.id),
  )

  if (existing) return existing

  const targetUser = getUserById(targetUserId)
  const newConv: Conversation = {
    id: `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    participantIds: [current.id, targetUserId],
    otherUser: {
      id: targetUserId,
      name: targetUser?.name || "Student",
      headline: targetUser?.headline || "Credento Scholar",
      avatar: targetUser?.avatar || "",
      institution: targetUser?.institution || "University",
      isOnline: false,
    },
    lastMessage: "Conversation initiated",
    lastMessageAt: "Just now",
    unreadCount: 0,
    messages: [],
  }

  setItem(STORAGE_KEYS.CONVERSATIONS, [newConv, ...allConversations])
  return newConv
}

export function sendMessage(conversationId: string, text: string): void {
  const current = getCurrentUser()
  if (!current || !text.trim()) return

  const allConversations = getItem<Conversation[]>(
    STORAGE_KEYS.CONVERSATIONS,
    [],
  )

  const updated = allConversations.map((conv) => {
    if (conv.id === conversationId) {
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        senderId: current.id,
        text: text.trim(),
        sentAt: "Just now",
      }

      // Find recipient
      const recipientId = conv.participantIds.find((id) => id !== current.id)
      if (recipientId) {
        createNotification({
          targetUserId: recipientId,
          actorId: current.id,
          actorName: current.name,
          actorAvatar: current.avatar,
          type: "message",
          title: "New Message",
          description: `${current.name}: ${text.trim().slice(0, 45)}...`,
          targetTab: "messages",
        })
      }

      return {
        ...conv,
        lastMessage: text.trim(),
        lastMessageAt: "Just now",
        messages: [...conv.messages, newMsg],
      }
    }
    return conv
  })

  setItem(STORAGE_KEYS.CONVERSATIONS, updated)
}

export function markConversationAsRead(conversationId: string): void {
  const allConversations = getItem<Conversation[]>(
    STORAGE_KEYS.CONVERSATIONS,
    [],
  )
  const updated = allConversations.map((c) =>
    c.id === conversationId ? { ...c, unreadCount: 0 } : c,
  )
  setItem(STORAGE_KEYS.CONVERSATIONS, updated)
}

export function deleteConversation(conversationId: string): void {
  const allConversations = getItem<Conversation[]>(
    STORAGE_KEYS.CONVERSATIONS,
    [],
  )
  const updated = allConversations.filter((c) => c.id !== conversationId)
  setItem(STORAGE_KEYS.CONVERSATIONS, updated)
}

// ==========================================
// 7. NOTIFICATIONS
// ==========================================

export function getNotifications(): AppNotification[] {
  const currentId = getCurrentUserId()
  const allNotifs = getItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, [])
  if (!currentId) return []

  // Only return notifications targeted to current user (or broadcast 'all')
  return allNotifs.filter(
    (n) => n.targetId === currentId || n.targetId === undefined,
  )
}

export function createNotification(params: {
  targetUserId?: string
  actorId?: string
  actorName?: string
  actorAvatar?: string
  type: AppNotification["type"]
  title: string
  description: string
  targetTab?: string
}): AppNotification {
  const allNotifs = getItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, [])

  const newNotif: AppNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    type: params.type,
    actorId: params.actorId,
    actorName: params.actorName,
    actorAvatar: params.actorAvatar,
    targetId: params.targetUserId,
    title: params.title,
    description: params.description,
    targetTab: params.targetTab,
    createdAt: "Just now",
    isRead: false,
  }

  setItem(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...allNotifs])
  return newNotif
}

export function markNotificationAsRead(notifId: string): void {
  const allNotifs = getItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, [])
  const updated = allNotifs.map((n) =>
    n.id === notifId ? { ...n, isRead: true } : n,
  )
  setItem(STORAGE_KEYS.NOTIFICATIONS, updated)
}

export function markAllNotificationsAsRead(): void {
  const allNotifs = getItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, [])
  const currentId = getCurrentUserId()
  const updated = allNotifs.map((n) => {
    if (n.targetId === currentId || n.targetId === undefined) {
      return { ...n, isRead: true }
    }
    return n
  })
  setItem(STORAGE_KEYS.NOTIFICATIONS, updated)
}

// ==========================================
// 8. OPPORTUNITIES & APPLICATION TRACKER
// ==========================================

export function getOpportunities(): Opportunity[] {
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
  return getItem<string[]>(STORAGE_KEYS.SAVED_OPPORTUNITIES, [])
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

export function createOpportunity(
  opp: Omit<Opportunity, "id" | "createdAt">,
): Opportunity {
  const opps = getItem<Opportunity[]>(
    STORAGE_KEYS.OPPORTUNITIES,
    INITIAL_OPPORTUNITIES,
  )
  const newOpp: Opportunity = {
    ...opp,
    id: `opp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString().split("T")[0],
  }
  setItem(STORAGE_KEYS.OPPORTUNITIES, [newOpp, ...opps])
  return newOpp
}

export function deleteOpportunity(oppId: string): void {
  const opps = getItem<Opportunity[]>(
    STORAGE_KEYS.OPPORTUNITIES,
    INITIAL_OPPORTUNITIES,
  ).filter((o) => o.id !== oppId)
  setItem(STORAGE_KEYS.OPPORTUNITIES, opps)
}

// ==========================================
// 9. CREDENTO ACCESS CENTER (CORE ECOSYSTEM)
// ==========================================

export function getAllAccessCenters(): AccessCenterOrganization[] {
  return getItem<AccessCenterOrganization[]>(
    STORAGE_KEYS.ACCESS_CENTERS,
    INITIAL_ACCESS_CENTERS,
  )
}

export function getApprovedAccessCenters(): AccessCenterOrganization[] {
  return getAllAccessCenters().filter((c) => c.status === "approved")
}

export function getAccessCenterById(
  centerId: string,
): AccessCenterOrganization | undefined {
  return getAllAccessCenters().find((c) => c.id === centerId)
}

export function submitOrganizationApplication(params: {
  name: string
  tagline: string
  logo?: string
  type: AccessCenterOrganization["type"]
  description: string
  mission: string
  website: string
  email: string
  phone: string
  location: string
  targetBeneficiaries: string[]
  serviceDeliveryMode: "online" | "in_person" | "hybrid"
  applicantName: string
  applicantEmail: string
  supportingInfo?: string
  services: Array<Omit<AccessCenterService, "id" | "centerId">>
}): AccessCenterOrganization {
  const centers = getAllAccessCenters()
  const centerId = `center-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`

  const formattedServices: AccessCenterService[] = params.services.map(
    (svc, idx) => ({
      ...svc,
      id: `svc-${centerId}-${idx + 1}`,
      centerId,
      active: true,
    }),
  )

  const newCenter: AccessCenterOrganization = {
    id: centerId,
    name: params.name.trim(),
    tagline: params.tagline.trim(),
    logo:
      params.logo?.trim() ||
      `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
        params.name,
      )}&backgroundColor=173a35`,
    coverImage:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    type: params.type,
    description: params.description.trim(),
    mission: params.mission.trim(),
    website: params.website.trim(),
    email: params.email.trim(),
    phone: params.phone.trim(),
    location: params.location.trim(),
    targetBeneficiaries: params.targetBeneficiaries,
    serviceDeliveryMode: params.serviceDeliveryMode,
    applicantName: params.applicantName.trim(),
    applicantEmail: params.applicantEmail.trim(),
    managerEmail: params.applicantEmail.trim().toLowerCase(),
    supportingInfo: params.supportingInfo?.trim(),
    status: "pending", // Enters Credento Admin review
    verified: false,
    createdAt: new Date().toISOString().split("T")[0],
    services: formattedServices,
  }

  setItem(STORAGE_KEYS.ACCESS_CENTERS, [newCenter, ...centers])
  return newCenter
}

export function approveAccessCenter(
  centerId: string,
  adminNotes?: string,
): void {
  const centers = getAllAccessCenters()
  const updated = centers.map((c) =>
    c.id === centerId
      ? {
          ...c,
          status: "approved" as CenterStatus,
          verified: true,
          adminNotes: adminNotes || c.adminNotes,
        }
      : c,
  )
  setItem(STORAGE_KEYS.ACCESS_CENTERS, updated)
}

export function rejectAccessCenter(centerId: string, reason: string): void {
  const centers = getAllAccessCenters()
  const updated = centers.map((c) =>
    c.id === centerId
      ? {
          ...c,
          status: "rejected" as CenterStatus,
          rejectionReason: reason,
        }
      : c,
  )
  setItem(STORAGE_KEYS.ACCESS_CENTERS, updated)
}

export function suspendAccessCenter(centerId: string, reason?: string): void {
  const centers = getAllAccessCenters()
  const updated = centers.map((c) =>
    c.id === centerId
      ? {
          ...c,
          status: "suspended" as CenterStatus,
          adminNotes: reason || c.adminNotes,
        }
      : c,
  )
  setItem(STORAGE_KEYS.ACCESS_CENTERS, updated)
}

export function reactivateAccessCenter(centerId: string): void {
  const centers = getAllAccessCenters()
  const updated = centers.map((c) =>
    c.id === centerId
      ? {
          ...c,
          status: "approved" as CenterStatus,
        }
      : c,
  )
  setItem(STORAGE_KEYS.ACCESS_CENTERS, updated)
}

export function deleteAccessCenter(centerId: string): void {
  const centers = getAllAccessCenters().filter((c) => c.id !== centerId)
  setItem(STORAGE_KEYS.ACCESS_CENTERS, centers)

  // Remove corresponding service requests
  const requests = getAllServiceRequests().filter(
    (r) => r.centerId !== centerId,
  )
  setItem(STORAGE_KEYS.SERVICE_REQUESTS, requests)
}

export function updateCenterProfile(
  centerId: string,
  updates: Partial<AccessCenterOrganization>,
): void {
  const centers = getAllAccessCenters()
  const updated = centers.map((c) =>
    c.id === centerId ? { ...c, ...updates } : c,
  )
  setItem(STORAGE_KEYS.ACCESS_CENTERS, updated)
}

export function addCenterService(
  centerId: string,
  service: Omit<AccessCenterService, "id" | "centerId">,
): AccessCenterService {
  const centers = getAllAccessCenters()
  const newService: AccessCenterService = {
    ...service,
    id: `svc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    centerId,
    active: true,
  }

  const updated = centers.map((c) => {
    if (c.id === centerId) {
      return {
        ...c,
        services: [...(c.services || []), newService],
      }
    }
    return c
  })

  setItem(STORAGE_KEYS.ACCESS_CENTERS, updated)
  return newService
}

export function updateCenterService(
  centerId: string,
  serviceId: string,
  updates: Partial<AccessCenterService>,
): void {
  const centers = getAllAccessCenters()
  const updated = centers.map((c) => {
    if (c.id === centerId) {
      const updatedServices = (c.services || []).map((s) =>
        s.id === serviceId ? { ...s, ...updates } : s,
      )
      return { ...c, services: updatedServices }
    }
    return c
  })
  setItem(STORAGE_KEYS.ACCESS_CENTERS, updated)
}

export function deleteCenterService(centerId: string, serviceId: string): void {
  const centers = getAllAccessCenters()
  const updated = centers.map((c) => {
    if (c.id === centerId) {
      return {
        ...c,
        services: (c.services || []).filter((s) => s.id !== serviceId),
      }
    }
    return c
  })
  setItem(STORAGE_KEYS.ACCESS_CENTERS, updated)
}

// ==========================================
// 10. ACCESS CENTER SERVICE REQUEST SYSTEM
// ==========================================

export function getAllServiceRequests(): ServiceRequest[] {
  return getItem<ServiceRequest[]>(STORAGE_KEYS.SERVICE_REQUESTS, [])
}

export function getUserServiceRequests(userId: string): ServiceRequest[] {
  return getAllServiceRequests().filter((r) => r.requesterId === userId)
}

export function getCenterServiceRequests(centerId: string): ServiceRequest[] {
  return getAllServiceRequests().filter((r) => r.centerId === centerId)
}

export function submitServiceRequest(params: {
  serviceId: string
  serviceTitle: string
  centerId: string
  centerName: string
  requesterName: string
  requesterEmail: string
  requesterPhone: string
  organizationOrSchool?: string
  beneficiaryType: string
  description: string
  supportingLinks?: string
}): ServiceRequest | null {
  const current = getCurrentUser()
  const requests = getAllServiceRequests()

  const newRequest: ServiceRequest = {
    id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    serviceId: params.serviceId,
    serviceTitle: params.serviceTitle,
    centerId: params.centerId,
    centerName: params.centerName,
    requesterId: current ? current.id : `guest-${Date.now()}`,
    requesterName: params.requesterName.trim(),
    requesterEmail: params.requesterEmail.trim(),
    requesterPhone: params.requesterPhone.trim(),
    organizationOrSchool: params.organizationOrSchool?.trim(),
    beneficiaryType: params.beneficiaryType,
    description: params.description.trim(),
    supportingLinks: params.supportingLinks?.trim(),
    status: "submitted",
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  setItem(STORAGE_KEYS.SERVICE_REQUESTS, [newRequest, ...requests])

  // If user is registered, create notification
  if (current) {
    createNotification({
      targetUserId: current.id,
      type: "service_request_update",
      title: "Service Request Submitted",
      description: `Your request for "${params.serviceTitle}" from ${params.centerName} is now under review.`,
      targetTab: "access_center",
    })
  }

  return newRequest
}

export function updateServiceRequestStatus(
  requestId: string,
  status: ServiceRequestStatus,
  orgNotes?: string,
): void {
  const requests = getAllServiceRequests()
  const updated = requests.map((r) => {
    if (r.id === requestId) {
      // Notify requester
      if (r.requesterId && !r.requesterId.startsWith("guest-")) {
        createNotification({
          targetUserId: r.requesterId,
          type: "service_request_update",
          title: `Service Request: ${status.replace("_", " ").toUpperCase()}`,
          description: `${r.centerName} updated your request for "${r.serviceTitle}" to ${status.replace("_", " ")}.`,
          targetTab: "access_center",
        })
      }

      return {
        ...r,
        status,
        orgNotes: orgNotes !== undefined ? orgNotes : r.orgNotes,
        updatedAt: new Date().toISOString(),
      }
    }
    return r
  })

  setItem(STORAGE_KEYS.SERVICE_REQUESTS, updated)
}

// ==========================================
// 11. CREDENTO ADMIN & MODERATION SYSTEM
// ==========================================

export function isUserAdmin(): boolean {
  const current = getCurrentUser()
  if (current) {
    return (
      current.email?.toLowerCase() === "team@credento.world" ||
      current.username?.toLowerCase() === "team" ||
      current.role === "admin"
    )
  }
  return sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === "active"
}

export function setAdminSession(active: boolean): void {
  if (active) {
    sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, "active")
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION)
  }
  notifySubscribers()
}

export function verifyAdminCredential(passkey: string): boolean {
  // Passkey verification supporting the designated credential and backup
  const cleaned = passkey.trim()
  const isCorrect =
    cleaned === "badabdcad786" || cleaned === "credento-admin-2026"
  if (isCorrect) {
    setAdminSession(true)
  }
  return isCorrect
}

export function getAdminPlatformStats() {
  const users = getAllUsers()
  const connections = getConnections().filter((c) => c.status === "connected")
  const posts = getPosts()
  const opps = getOpportunities()
  const centers = getAllAccessCenters()
  const reports = getReports()
  const requests = getAllServiceRequests()

  const completedProfiles = users.filter(
    (u) => calculateProfileCompleteness(u).percentage >= 70,
  ).length

  return {
    totalRegisteredUsers: users.length,
    totalCompletedProfiles: completedProfiles,
    activeUsers: users.filter((u) => !u.isSuspended).length,
    suspendedUsers: users.filter((u) => u.isSuspended).length,
    totalConnections: connections.length,
    totalPosts: posts.length,
    totalOpportunities: opps.length,
    totalAccessCenters: centers.filter((c) => c.status === "approved").length,
    pendingAccessCenters: centers.filter((c) => c.status === "pending").length,
    pendingReports: reports.filter((r) => r.status === "pending").length,
    totalServiceRequests: requests.length,
  }
}

// Reports
export function getReports(): ReportItem[] {
  return getItem<ReportItem[]>(STORAGE_KEYS.REPORTS, [])
}

export function submitReport(report: {
  targetType: ReportItem["targetType"]
  targetId: string
  targetName?: string
  reason: string
  details: string
}): ReportItem {
  const current = getCurrentUser()
  const reports = getReports()
  const newReport: ReportItem = {
    id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    reporterId: current ? current.id : "anonymous",
    reporterName: current ? current.name : "Anonymous Student",
    targetType: report.targetType,
    targetId: report.targetId,
    targetName: report.targetName,
    reason: report.reason,
    details: report.details,
    status: "pending",
    createdAt: new Date().toISOString(),
  }

  setItem(STORAGE_KEYS.REPORTS, [newReport, ...reports])
  return newReport
}

export function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  resolutionNotes?: string,
): void {
  const reports = getReports()
  const updated = reports.map((r) =>
    r.id === reportId
      ? {
          ...r,
          status,
          resolutionNotes: resolutionNotes || r.resolutionNotes,
        }
      : r,
  )
  setItem(STORAGE_KEYS.REPORTS, updated)
}

// Official Credento Team Messages
export function getOfficialAnnouncements(): OfficialAnnouncement[] {
  return getItem<OfficialAnnouncement[]>(
    STORAGE_KEYS.OFFICIAL_ANNOUNCEMENTS,
    [],
  )
}

export function broadcastOfficialAnnouncement(params: {
  title: string
  content: string
  type: OfficialAnnouncement["type"]
  targetType: "all" | "user"
  targetUserId?: string
}): OfficialAnnouncement {
  const list = getOfficialAnnouncements()
  const newAnnouncement: OfficialAnnouncement = {
    id: `ann-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: params.title.trim(),
    content: params.content.trim(),
    type: params.type,
    targetType: params.targetType,
    targetUserId: params.targetUserId,
    createdAt: new Date().toISOString().split("T")[0],
    readBy: [],
    authorTitle: "Credento Team",
  }

  setItem(STORAGE_KEYS.OFFICIAL_ANNOUNCEMENTS, [newAnnouncement, ...list])

  // Generate notifications for targeted users
  if (params.targetType === "all") {
    const allUsers = getAllUsers()
    allUsers.forEach((u) => {
      createNotification({
        targetUserId: u.id,
        type: "announcement",
        title: `Official Credento Notice: ${params.title}`,
        description: params.content.slice(0, 70) + "...",
        targetTab: "notifications",
      })
    })
  } else if (params.targetUserId) {
    createNotification({
      targetUserId: params.targetUserId,
      type: "announcement",
      title: `Notice from Credento Team: ${params.title}`,
      description: params.content.slice(0, 70) + "...",
      targetTab: "notifications",
    })
  }

  return newAnnouncement
}

// Study Groups compatibility
export interface StudyGroup {
  id: string
  name: string
  category: string
  description: string
  institution: string
  memberCount: number
  avatar: string
  coverImage?: string
  tags: string[]
  isJoined?: boolean
}

export function getGroups(): StudyGroup[] {
  return getItem<StudyGroup[]>("credento_groups", [])
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
  setItem("credento_groups", updated)
}

export function createGroup(group: any): any {
  const groups = getGroups()
  const newGroup = {
    ...group,
    id: `grp-${Date.now()}`,
    memberCount: 1,
    isJoined: true,
  }
  setItem("credento_groups", [newGroup, ...groups])
  return newGroup
}
