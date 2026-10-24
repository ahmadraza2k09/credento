export type OpportunityCategory = "scholarship" | "internship" | "competition" | "fellowship" | "course" | "volunteer"

export type PortfolioType = "project" | "publication" | "certificate" | "award" | "leadership" | "volunteer"

export interface EducationItem {
  id: string
  institution: string
  degree: string
  fieldOfStudy: string
  startYear: number
  endYear: number | "Present"
  gradeOrGpa?: string
  activities?: string
}

export interface PortfolioItem {
  id: string
  type: PortfolioType
  title: string
  organization?: string
  date: string
  description: string
  linkUrl?: string
  imageUrl?: string
  credentialId?: string
  skills?: string[]
}

export type ConnectionStatus = "self" | "connected" | "pending_sent" | "pending_received" | "none"

export interface StudentProfile {
  id: string
  name: string
  email?: string
  headline: string
  institution: string
  facultyOrDepartment: string
  degree: string
  graduationYear: number | string
  location: string
  avatar: string
  coverImage: string
  about: string
  isPublic: boolean // visibility control
  skills: string[]
  interests: string[]
  education: EducationItem[]
  portfolioItems: PortfolioItem[]
  connectionsCount: number
  followersCount: number
  connectionStatus?: ConnectionStatus
  isFollowing?: boolean
  isBlocked?: boolean
}

export interface CommentReply {
  id: string
  authorId: string
  authorName: string
  authorHeadline: string
  authorAvatar: string
  content: string
  createdAt: string
  likes: string[]
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  authorName: string
  authorHeadline: string
  authorAvatar: string
  content: string
  createdAt: string
  likes: string[]
  replies: CommentReply[]
}

export interface Post {
  id: string
  authorId: string
  authorName: string
  authorHeadline: string
  authorInstitution: string
  authorAvatar: string
  content: string
  imageUrl?: string
  linkPreview?: {
    title: string
    url: string
    domain: string
    description?: string
  }
  createdAt: string
  likes: string[] // list of userIds
  sharesCount: number
  comments: Comment[]
  sharedPost?: {
    id: string
    authorName: string
    authorHeadline: string
    authorAvatar: string
    content: string
    createdAt: string
  }
}

export interface Opportunity {
  id: string
  title: string
  provider: string
  providerLogo?: string
  category: OpportunityCategory
  description: string
  eligibility: string[]
  location: string
  mode: "Remote" | "Hybrid" | "On-site"
  deadline: string // YYYY-MM-DD
  applicationUrl: string
  compensation?: string
  postedBy: string
  isSaved?: boolean
  createdAt: string
}

export interface ChatMessage {
  id: string
  senderId: string
  text: string
  sentAt: string
}

export interface Conversation {
  id: string
  participantIds: string[]
  otherUser: {
    id: string
    name: string
    headline: string
    avatar: string
    institution: string
    isOnline?: boolean
  }
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  messages: ChatMessage[]
}

export type NotificationType = "connection_request" | "connection_accepted" | "like" | "comment" | "reply" | "message" | "announcement" | "opportunity_alert"

export interface AppNotification {
  id: string
  type: NotificationType
  actorId?: string
  actorName?: string
  actorAvatar?: string
  title: string
  description: string
  targetUrl?: string
  targetId?: string
  createdAt: string
  isRead: boolean
  requestId?: string
}

export interface ReportItem {
  id: string
  reporterId: string
  targetType: "user" | "post" | "comment" | "opportunity"
  targetId: string
  reason: string
  details: string
  createdAt: string
}
