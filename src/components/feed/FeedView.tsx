import React, { useState, useMemo } from "react"
import {
  Users,
  Bookmark,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  ExternalLink,
} from "lucide-react"
import { Opportunity, Post, StudentProfile } from "../../types"
import { PostCreator } from "./PostCreator"
import { PostCard } from "./PostCard"
import { calculateProfileCompleteness } from "../../services/storage"

interface FeedViewProps {
  currentUser: StudentProfile
  posts: Post[]
  students: StudentProfile[]
  opportunities: Opportunity[]
  onToggleLike: (postId: string) => void
  onAddComment: (postId: string, content: string) => void
  onAddReply: (postId: string, commentId: string, content: string) => void
  onCreatePost: (params: {
    content: string
    imageUrl?: string
    linkPreview?: Post["linkPreview"]
  }) => void
  onSharePost: (originalPost: Post, thoughts?: string) => void
  onEditPost: (postId: string, newContent: string) => void
  onDeletePost: (postId: string) => void
  onConnectStudent: (studentId: string) => void
  onSelectStudentProfile: (studentId: string) => void
  onSelectOpportunity: (opportunity: Opportunity) => void
  onNavigateToTab: (tab: any) => void
  onReport: (type: "post", targetId: string) => void
  onBlockUser: (userId: string) => void
}

export function FeedView({
  currentUser,
  posts,
  students,
  opportunities,
  onToggleLike,
  onAddComment,
  onAddReply,
  onCreatePost,
  onSharePost,
  onEditPost,
  onDeletePost,
  onConnectStudent,
  onSelectStudentProfile,
  onSelectOpportunity,
  onNavigateToTab,
  onReport,
  onBlockUser,
}: FeedViewProps) {
  const [feedSort, setFeedSort] = useState<"latest" | "top">("latest")

  // Calculate completeness for current user
  const completeness = useMemo(
    () => calculateProfileCompleteness(currentUser),
    [currentUser],
  )

  // Students recommended to connect (excluding self & already connected)
  const recommendedStudents = useMemo(() => {
    return students
      .filter(
        (s) =>
          s.id !== currentUser.id &&
          s.connectionStatus !== "connected" &&
          s.connectionStatus !== "pending_sent",
      )
      .slice(0, 3)
  }, [students, currentUser])

  // Upcoming opportunities
  const upcomingOpps = useMemo(() => {
    return opportunities.slice(0, 3)
  }, [opportunities])

  // Sorted posts
  const sortedPosts = useMemo(() => {
    const list = [...posts]
    if (feedSort === "top") {
      return list.sort((a, b) => b.likes.length - a.likes.length)
    }
    return list // already newest first
  }, [posts, feedSort])

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-5 py-5 sm:py-7">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: Student Identity Summary & Quick Access */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="card-linkedin overflow-hidden">
            {/* Mini Cover & Avatar - Solid Evergreen Document Header */}
            <div className="h-18 bg-gradient-to-r from-[#173a35] to-[#102d29] relative">
              {currentUser.coverImage && (
                <img
                  src={currentUser.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover opacity-60"
                />
              )}
            </div>
            <div className="px-5 pb-5 pt-0 text-center relative">
              <button
                type="button"
                onClick={() => onSelectStudentProfile(currentUser.id)}
                className="inline-block -mt-10 focus:outline-none cursor-pointer"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-18 h-18 rounded-full object-cover border-3 border-white shadow-md mx-auto bg-white"
                />
              </button>
              <h2 className="font-bold text-[#173a35] text-base mt-2 leading-snug">
                <button
                  type="button"
                  onClick={() => onSelectStudentProfile(currentUser.id)}
                  className="hover:underline hover:text-[#c46b4b] transition-colors cursor-pointer"
                >
                  {currentUser.name}
                </button>
              </h2>
              <p className="text-xs text-[#62736b] mt-0.5 line-clamp-2">
                {currentUser.headline}
              </p>
              <p className="text-[11px] text-[#728078] font-medium mt-1">
                {currentUser.institution}
              </p>

              {/* Profile Completeness Meter */}
              <div className="mt-4 pt-4 border-t border-black/[0.05] text-left">
                <div className="flex justify-between items-center text-[11px] font-semibold text-[#173a35] mb-1.5">
                  <span>Profile Strength</span>
                  <span className="text-[#c46b4b] font-mono font-bold">
                    {completeness.percentage}%
                  </span>
                </div>
                <div className="w-full bg-[#e8ece9] rounded-full h-2 overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-[#c46b4b] to-[#df805e] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completeness.percentage}%` }}
                  />
                </div>
                {completeness.missingFields.length > 0 && (
                  <p className="text-[10px] text-[#728078] mt-1.5 line-clamp-1">
                    Tip: Add {completeness.missingFields[0]}
                  </p>
                )}
              </div>

              {/* Stats overview */}
              <div className="mt-4 pt-4 border-t border-black/[0.05] space-y-2 text-xs text-left">
                <button
                  type="button"
                  onClick={() => onNavigateToTab("network")}
                  className="w-full flex items-center justify-between text-[#62736b] hover:text-[#173a35] p-1.5 rounded-xl hover:bg-black/[0.03] transition-all cursor-pointer group"
                >
                  <span className="group-hover:underline">Connections</span>
                  <span className="font-bold text-[#173a35] font-mono">
                    {currentUser.connectionsCount}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateToTab("opportunities")}
                  className="w-full flex items-center justify-between text-[#62736b] hover:text-[#173a35] p-1.5 rounded-xl hover:bg-black/[0.03] transition-all cursor-pointer group"
                >
                  <span className="group-hover:underline">
                    Saved Opportunities
                  </span>
                  <span className="font-bold text-[#c46b4b] font-mono">2</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Academic Hub Links */}
          <div className="hidden lg:block card-linkedin p-4 text-xs text-[#242b29] space-y-2.5">
            <p className="font-bold text-[11px] uppercase tracking-wider text-[#173a35]">
              Student Pathways
            </p>
            <div className="space-y-1.5 text-[#62736b]">
              <button
                type="button"
                onClick={() => onNavigateToTab("opportunities")}
                className="w-full text-left hover:text-[#173a35] hover:bg-black/[0.03] p-1.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#c46b4b] shadow-xs" />
                <span>Fellowships & Grants</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateToTab("opportunities")}
                className="w-full text-left hover:text-[#173a35] hover:bg-black/[0.03] p-1.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#173a35] shadow-xs" />
                <span>Summer Lab Research</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateToTab("network")}
                className="w-full text-left hover:text-[#173a35] hover:bg-black/[0.03] p-1.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#87978f] shadow-xs" />
                <span>Find Peer Study Partners</span>
              </button>
            </div>
          </div>
        </aside>

        {/* CENTER COLUMN: Feed stream */}
        <main className="lg:col-span-6 space-y-4">
          {/* Post Composer */}
          <PostCreator currentUser={currentUser} onCreatePost={onCreatePost} />

          {/* Sort bar */}
          <div className="flex items-center justify-between pb-1 px-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#728078]">
                Feed Stream
              </span>
            </div>
            <div className="flex items-center gap-1 bg-[#e8ecea] p-1 rounded-full text-xs shadow-inner">
              <button
                type="button"
                onClick={() => setFeedSort("latest")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all text-[11px] font-semibold cursor-pointer ${
                  feedSort === "latest"
                    ? "bg-white text-[#173a35] shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                    : "text-[#62736b] hover:text-[#173a35]"
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>Latest</span>
              </button>
              <button
                type="button"
                onClick={() => setFeedSort("top")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all text-[11px] font-semibold cursor-pointer ${
                  feedSort === "top"
                    ? "bg-white text-[#173a35] shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                    : "text-[#62736b] hover:text-[#173a35]"
                }`}
              >
                <TrendingUp className="w-3 h-3" />
                <span>Top Discussions</span>
              </button>
            </div>
          </div>

          {/* Post list */}
          {sortedPosts.length === 0 ? (
            <div className="card-linkedin p-8 text-center text-[#62736b]">
              <p className="font-semibold text-sm text-[#173a35]">
                No posts in your feed yet.
              </p>
              <p className="text-xs mt-1">
                Share your first research note or project update above!
              </p>
            </div>
          ) : (
            sortedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onToggleLike={onToggleLike}
                onAddComment={onAddComment}
                onAddReply={onAddReply}
                onSharePost={onSharePost}
                onEditPost={onEditPost}
                onDeletePost={onDeletePost}
                onReport={onReport}
                onBlockUser={onBlockUser}
                onSelectStudentProfile={onSelectStudentProfile}
              />
            ))
          )}
        </main>

        {/* RIGHT COLUMN: Network Suggestions & Upcoming Deadlines */}
        <aside className="lg:col-span-3 space-y-4">
          {/* Recommended Students */}
          <div className="card-linkedin p-5">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#173a35]">
                Students You May Know
              </h3>
              <button
                type="button"
                onClick={() => onNavigateToTab("network")}
                className="text-[11px] text-[#c46b4b] hover:underline font-semibold cursor-pointer"
              >
                View all
              </button>
            </div>

            <div className="space-y-3.5">
              {recommendedStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-start gap-3 pb-3.5 border-b border-black/[0.04] last:border-0 last:pb-0"
                >
                  <button
                    type="button"
                    onClick={() => onSelectStudentProfile(student.id)}
                    className="shrink-0 focus:outline-none cursor-pointer"
                  >
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover shadow-sm ring-1 ring-black/5"
                    />
                  </button>
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => onSelectStudentProfile(student.id)}
                      className="font-bold text-xs text-[#173a35] hover:underline truncate block text-left cursor-pointer"
                    >
                      {student.name}
                    </button>
                    <p className="text-[10px] text-[#62736b] truncate">
                      {student.institution.split(" ")[0]} •{" "}
                      {student.degree.split("in ")[1] || student.degree}
                    </p>
                    <button
                      type="button"
                      onClick={() => onConnectStudent(student.id)}
                      className="btn-3d-secondary mt-2 inline-flex items-center gap-1 px-3 py-1 text-[11px] font-semibold cursor-pointer"
                    >
                      <span>Connect</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Opportunities */}
          <div className="card-linkedin p-5">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#173a35]">
                Upcoming Deadlines
              </h3>
              <button
                type="button"
                onClick={() => onNavigateToTab("opportunities")}
                className="text-[11px] text-[#c46b4b] hover:underline font-semibold cursor-pointer"
              >
                Explore
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {upcomingOpps.map((opp) => (
                <div
                  key={opp.id}
                  onClick={() => onSelectOpportunity(opp)}
                  className="p-3 rounded-xl bg-[#f8faf9] hover:bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 cursor-pointer transition-all border border-black/[0.04]"
                >
                  <p className="font-bold text-[#173a35] text-[11px] line-clamp-1">
                    {opp.title}
                  </p>
                  <p className="text-[10px] text-[#62736b] mt-0.5 truncate">
                    {opp.provider}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/[0.04] text-[10px]">
                    <span className="text-[#9f5138] font-semibold">
                      Deadline: {opp.deadline}
                    </span>
                    <ArrowRight className="w-3 h-3 text-[#62736b]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Credento Values Footer Note */}
          <div className="p-3.5 bg-[#f7f5ef] rounded-2xl border border-[#d8ddd8]/60 text-[10px] text-[#62736b] leading-relaxed shadow-2xs">
            <p className="font-bold text-[#173a35] mb-0.5">
              Credento Academic Oath
            </p>
            Authentic peer networking for university students. No vanity metrics
            or spam algorithms. Focus on verified scholarly merit.
          </div>
        </aside>
      </div>
    </div>
  )
}
