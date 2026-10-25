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
          <div className="bg-white rounded-[2px] border border-[#cbd3ce] overflow-hidden">
            {/* Mini Cover & Avatar - Solid Evergreen Document Header */}
            <div className="h-16 bg-[#173a35] relative">
              {currentUser.coverImage && (
                <img
                  src={currentUser.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover opacity-60"
                />
              )}
            </div>
            <div className="px-4 pb-4 pt-0 text-center relative">
              <button
                type="button"
                onClick={() => onSelectStudentProfile(currentUser.id)}
                className="inline-block -mt-8 focus:outline-none"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-[2px] object-cover border-2 border-white mx-auto bg-white"
                />
              </button>
              <h2 className="font-bold text-[#173a35] text-sm mt-1 leading-snug">
                <button
                  type="button"
                  onClick={() => onSelectStudentProfile(currentUser.id)}
                  className="hover:underline"
                >
                  {currentUser.name}
                </button>
              </h2>
              <p className="text-[11px] text-[#62736b] mt-0.5 line-clamp-2">
                {currentUser.headline}
              </p>
              <p className="text-[10px] text-[#728078] font-medium mt-1">
                {currentUser.institution}
              </p>

              {/* Profile Completeness Meter */}
              <div className="mt-3 pt-3 border-t border-[#eef2ef] text-left">
                <div className="flex justify-between items-center text-[11px] font-semibold text-[#173a35] mb-1">
                  <span>Profile Strength</span>
                  <span className="text-[#c46b4b] font-mono">
                    {completeness.percentage}%
                  </span>
                </div>
                <div className="w-full bg-[#e8ece9] rounded-[2px] h-1.5 overflow-hidden">
                  <div
                    className="bg-[#c46b4b] h-1.5 rounded-[2px] transition-all duration-300"
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
              <div className="mt-3 pt-3 border-t border-[#eef2ef] space-y-2 text-xs text-left">
                <button
                  type="button"
                  onClick={() => onNavigateToTab("network")}
                  className="w-full flex items-center justify-between text-[#62736b] hover:text-[#173a35] group"
                >
                  <span className="group-hover:underline">Connections</span>
                  <span className="font-bold text-[#173a35] font-mono">
                    {currentUser.connectionsCount}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateToTab("opportunities")}
                  className="w-full flex items-center justify-between text-[#62736b] hover:text-[#173a35] group"
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
          <div className="hidden lg:block bg-white rounded-[2px] border border-[#cbd3ce] p-3.5 text-xs text-[#242b29] space-y-2">
            <p className="font-bold text-[11px] uppercase tracking-wider text-[#173a35]">
              Student Pathways
            </p>
            <div className="space-y-1.5 text-[#62736b]">
              <button
                type="button"
                onClick={() => onNavigateToTab("opportunities")}
                className="w-full text-left hover:text-[#173a35] flex items-center gap-1.5 py-0.5"
              >
                <span className="w-1.5 h-1.5 rounded-[2px] bg-[#c46b4b]" />
                <span>Fellowships & Grants</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateToTab("opportunities")}
                className="w-full text-left hover:text-[#173a35] flex items-center gap-1.5 py-0.5"
              >
                <span className="w-1.5 h-1.5 rounded-[2px] bg-[#173a35]" />
                <span>Summer Lab Research</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateToTab("network")}
                className="w-full text-left hover:text-[#173a35] flex items-center gap-1.5 py-0.5"
              >
                <span className="w-1.5 h-1.5 rounded-[2px] bg-[#87978f]" />
                <span>Find Peer Study Partners</span>
              </button>
            </div>
          </div>
        </aside>

        {/* CENTER COLUMN: Feed stream */}
        <main className="lg:col-span-6 space-y-3">
          {/* Post Composer */}
          <PostCreator currentUser={currentUser} onCreatePost={onCreatePost} />

          {/* Sort bar */}
          <div className="flex items-center justify-between pb-1 px-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#728078]">
                Feed Stream
              </span>
            </div>
            <div className="flex items-center gap-1 bg-[#eef2ef] p-0.5 rounded-[2px] text-xs">
              <button
                type="button"
                onClick={() => setFeedSort("latest")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-[2px] transition-colors text-[11px] font-semibold ${
                  feedSort === "latest"
                    ? "bg-white text-[#173a35] border border-[#cbd3ce]"
                    : "text-[#62736b] hover:text-[#173a35]"
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>Latest</span>
              </button>
              <button
                type="button"
                onClick={() => setFeedSort("top")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-[2px] transition-colors text-[11px] font-semibold ${
                  feedSort === "top"
                    ? "bg-white text-[#173a35] border border-[#cbd3ce]"
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
            <div className="bg-white rounded-[2px] border border-[#cbd3ce] p-8 text-center text-[#62736b]">
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
          <div className="bg-white rounded-[2px] border border-[#cbd3ce] p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#173a35]">
                Students You May Know
              </h3>
              <button
                type="button"
                onClick={() => onNavigateToTab("network")}
                className="text-[11px] text-[#c46b4b] hover:underline font-semibold"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {recommendedStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-start gap-2.5 pb-3 border-b border-[#eef2ef] last:border-0 last:pb-0"
                >
                  <button
                    type="button"
                    onClick={() => onSelectStudentProfile(student.id)}
                    className="shrink-0 focus:outline-none"
                  >
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-9 h-9 rounded-[2px] object-cover border border-[#cbd3ce]"
                    />
                  </button>
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => onSelectStudentProfile(student.id)}
                      className="font-bold text-xs text-[#173a35] hover:underline truncate block text-left"
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
                      className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 border border-[#173a35] text-[#173a35] hover:bg-[#173a35] hover:text-white rounded-[2px] text-[11px] font-semibold transition-colors"
                    >
                      <span>Connect</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Opportunities */}
          <div className="bg-white rounded-[2px] border border-[#cbd3ce] p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#173a35]">
                Upcoming Deadlines
              </h3>
              <button
                type="button"
                onClick={() => onNavigateToTab("opportunities")}
                className="text-[11px] text-[#c46b4b] hover:underline font-semibold"
              >
                Explore
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {upcomingOpps.map((opp) => (
                <div
                  key={opp.id}
                  onClick={() => onSelectOpportunity(opp)}
                  className="p-2.5 rounded-[2px] bg-[#f7f5ef] border border-[#e2e8e3] hover:border-[#173a35] cursor-pointer transition-colors"
                >
                  <p className="font-bold text-[#173a35] text-[11px] line-clamp-1">
                    {opp.title}
                  </p>
                  <p className="text-[10px] text-[#62736b] mt-0.5 truncate">
                    {opp.provider}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#e2e8e3] text-[10px]">
                    <span className="text-[#9f5138] font-medium">
                      Deadline: {opp.deadline}
                    </span>
                    <span className="font-semibold text-[#173a35] flex items-center gap-0.5">
                      <span>View</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Credento Values Footer Note */}
          <div className="p-3 bg-[#eef2ef] rounded-[2px] border border-[#d8ddd8] text-[10px] text-[#62736b] leading-relaxed">
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
