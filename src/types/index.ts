export type OpportunityCategory = "scholarship" | "internship" | "competition" | "fellowship" | "course" | "volunteer" | "job" | "conference" | "exchange" | "training"

export type PortfolioType = "project" | "publication" | "certificate" | "award" | "leadership" | "volunteer" | "work"

export interface EducationItem {
  id: string
  institution: string
  degree: string
  fieldOfStudy: string
  startYear: number | string
  endYear: number | string | "Present"
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

export type GroupCategory = "Research Lab" | "Study Circle" | "Student Chapter" | "Competition Team" | "Special Interest"

export interface StudyGroup {
  id: string
  name: string
  description: string
  category: GroupCategory
  memberCount: number
  isJoined?: boolean
  tags: string[]
  meetingTime?: string
  meetingSchedule?: string
  leaderName?: string
  leadName?: string
  recentDiscussion?: string
  institution?: string
  avatar?: string
  coverImage?: string
}

export type ProfileVisibility = "public" | "network" | "private"

export interface SocialLinks {
  website?: string
  github?: string
  linkedin?: string
  twitter?: string
  scholar?: string
}

export interface StudentProfile {
  id: string
  name: string
  username?: string // e.g. @alexchen
  email?: string
  password?: string
  role?: "student" | "admin" | "org_manager"
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
  visibility?: ProfileVisibility
  phone?: string
  socialLinks?: SocialLinks
  skills: string[]
  interests: string[]
  education: EducationItem[]
  portfolioItems: PortfolioItem[]
  connectionsCount: number
  followersCount: number
  connectionStatus?: ConnectionStatus
  isFollowing?: boolean
  isBlocked?: boolean
  isSuspended?: boolean
  suspendedReason?: string
  createdAt?: string
  openToBadges?: string[]
  skillEndorsements?: { [skillName: string]: string[] }
}

export interface ConnectionRelationship {
  id: string
  requesterId: string
  receiverId: string
  status: "pending" | "connected" | "declined"
  createdAt: string
}

export interface FollowRelationship {
  followerId: string
  followedId: string
}

export type PostTopic = "Academic" | "Research" | "Career" | "Projects" | "Campus Life" | "General"

export interface PollOption {
  id: string
  text: string
  votes: string[]
}

export interface PostPoll {
  question: string
  options: PollOption[]
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

export type ReactionType = "like" | "celebrate" | "support" | "insightful" | "curious"

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
  reactions?: { [userId: string]: ReactionType }
  sharesCount: number
  comments: Comment[]
  topic?: PostTopic
  isSaved?: boolean
  isEdited?: boolean
  poll?: PostPoll
  sharedPost?: {
    id: string
    authorName: string
    authorHeadline: string
    authorAvatar: string
    content: string
    createdAt: string
  }
}

export type ApplicationStatus = "submitted" | "under_review" | "interviewing" | "offered" | "withdrawn"

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
  applicationStatus?: ApplicationStatus
  applicationNotes?: string
  appliedDate?: string
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

export type NotificationType = "connection_request" | "connection_accepted" | "like" | "comment" | "reply" | "message" | "announcement" | "opportunity_alert" | "service_request_update"

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
  targetTab?: string
  createdAt: string
  isRead: boolean
  requestId?: string
}

export type ReportTargetType = "user" | "post" | "comment" | "opportunity" | "access_center" | "organization"

export type ReportStatus = "pending" | "under_review" | "resolved" | "dismissed"

export interface ReportItem {
  id: string
  reporterId: string
  reporterName?: string
  targetType: ReportTargetType
  targetId: string
  targetName?: string
  reason: string
  details: string
  status: ReportStatus
  resolutionNotes?: string
  createdAt: string
}

// ==========================================
// CREDENTO ACCESS CENTER & ORGANIZATION TYPES
// ==========================================

export type OrganizationType = "ngo" | "youth_org" | "educational" | "technology" | "consulting" | "hospital_clinic" | "school" | "social_enterprise" | "other"

export type CenterStatus = "pending" | "approved" | "rejected" | "suspended"

export type ServiceCategory = "digital_tech" | "consulting_guidance" | "education" | "health_wellbeing" | "community_support"

export interface AccessCenterService {
  id: string
  centerId: string
  title: string
  category: ServiceCategory
  description: string
  targetBeneficiaries: string[] // e.g. ["Students", "Small Businesses", "Schools", "Clinics", "Community Initiatives"]
  deliveryMode: "online" | "in_person" | "hybrid"
  isFree: boolean // Always true in Access Center
  leadTime: string // e.g. "2-4 business days"
  eligibilityCriteria?: string
  active: boolean
}

export interface AccessCenterOrganization {
  id: string
  name: string
  tagline: string
  logo: string
  coverImage?: string
  type: OrganizationType
  description: string
  mission: string
  website: string
  email: string
  phone: string
  location: string
  services: AccessCenterService[]
  targetBeneficiaries: string[]
  serviceDeliveryMode: "online" | "in_person" | "hybrid"
  supportingInfo?: string
  status: CenterStatus
  rejectionReason?: string
  adminNotes?: string
  applicantName?: string
  applicantEmail?: string
  managerEmail?: string // email of org representative to log in
  createdAt: string
  verified: boolean
}

export type ServiceRequestStatus = "submitted" | "under_review" | "accepted" | "in_progress" | "completed" | "rejected"

export interface ServiceRequest {
  id: string
  serviceId: string
  serviceTitle: string
  centerId: string
  centerName: string
  requesterId: string
  requesterName: string
  requesterEmail: string
  requesterPhone: string
  organizationOrSchool?: string
  beneficiaryType: string // "Student", "Small Business", "School / Educator", "Hospital / Clinic", "Community Initiative"
  description: string
  supportingLinks?: string
  status: ServiceRequestStatus
  orgNotes?: string
  submittedAt: string
  updatedAt: string
}

// ==========================================
// OFFICIAL CREDENTO TEAM COMMUNICATIONS
// ==========================================

export type OfficialMessageType = "announcement" | "community_guidelines" | "safety_notice" | "account_notice" | "access_center_announcement" | "platform_update" | "important_reminder"

export interface OfficialAnnouncement {
  id: string
  title: string
  content: string
  type: OfficialMessageType
  targetType: "all" | "user"
  targetUserId?: string
  createdAt: string
  readBy: string[]
  authorTitle: "Credento Team"
}
