import React, { useState } from "react"
import {
  Heart,
  MessageSquare,
  Share2,
  MoreHorizontal,
  ExternalLink,
  Edit2,
  Trash2,
  Flag,
  UserX,
  Repeat,
  Check,
  Bookmark,
  ThumbsUp,
} from "lucide-react"
import { Post, ReactionType, StudentProfile } from "../../types"
import { CommentSection } from "./CommentSection"

const LINKEDIN_REACTIONS: {
  type: ReactionType
  label: string
  emoji: string
  color: string
}[] = [
  { type: "like", label: "Like", emoji: "👍", color: "text-[#173a35]" },
  {
    type: "celebrate",
    label: "Celebrate",
    emoji: "👏",
    color: "text-[#1b6b47]",
  },
  { type: "support", label: "Support", emoji: "🤝", color: "text-[#4f46e5]" },
  {
    type: "insightful",
    label: "Insightful",
    emoji: "💡",
    color: "text-[#b45309]",
  },
  { type: "curious", label: "Curious", emoji: "🤔", color: "text-[#c46b4b]" },
]

interface PostCardProps {
  post: Post
  currentUser: StudentProfile
  onToggleLike: (postId: string) => void
  onSetReaction?: (postId: string, reaction: ReactionType) => void
  onAddComment: (postId: string, content: string) => void
  onAddReply: (postId: string, commentId: string, content: string) => void
  onSharePost: (originalPost: Post, thoughts?: string) => void
  onEditPost: (postId: string, newContent: string) => void
  onDeletePost: (postId: string) => void
  onReport: (type: "post", targetId: string) => void
  onBlockUser: (userId: string) => void
  onSelectStudentProfile?: (studentId: string) => void
  onVotePoll?: (postId: string, optionId: string) => void
  onToggleSavePost?: (postId: string) => void
  onEditComment?: (
    postId: string,
    commentId: string,
    newContent: string,
  ) => void
  onDeleteComment?: (postId: string, commentId: string) => void
}

export function PostCard({
  post,
  currentUser,
  onToggleLike,
  onSetReaction,
  onAddComment,
  onAddReply,
  onSharePost,
  onEditPost,
  onDeletePost,
  onReport,
  onBlockUser,
  onSelectStudentProfile,
  onVotePoll,
  onToggleSavePost,
  onEditComment,
  onDeleteComment,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content)
  const [copiedLink, setCopiedLink] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareThoughts, setShareThoughts] = useState("")
  const [showReactionsMenu, setShowReactionsMenu] = useState(false)

  const isAuthor = post.authorId === currentUser.id
  const hasLiked = post.likes.includes(currentUser.id)

  const currentReactionType: ReactionType | undefined =
    post.reactions?.[currentUser.id] || (hasLiked ? "like" : undefined)

  const activeReactionMeta = currentReactionType
    ? LINKEDIN_REACTIONS.find((r) => r.type === currentReactionType)
    : null

  // Collect distinct emojis used on this post
  const displayedEmojis = React.useMemo(() => {
    const list: string[] = []
    if (post.reactions) {
      Object.values(post.reactions).forEach((rType) => {
        const found = LINKEDIN_REACTIONS.find((r) => r.type === rType)
        if (found && !list.includes(found.emoji)) {
          list.push(found.emoji)
        }
      })
    }
    if (list.length === 0 && post.likes.length > 0) {
      list.push("👍")
    }
    return list.slice(0, 3)
  }, [post.reactions, post.likes])
  const totalComments =
    post.comments.length +
    post.comments.reduce(
      (acc, c) => acc + (c.replies ? c.replies.length : 0),
      0,
    )

  const handleSaveEdit = () => {
    if (editContent.trim()) {
      onEditPost(post.id, editContent.trim())
      setIsEditing(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
    setShowMenu(false)
  }

  const handleShareSubmit = () => {
    onSharePost(post, shareThoughts)
    setShowShareModal(false)
    setShareThoughts("")
  }

  return (
    <article className="card-linkedin mb-4 overflow-hidden">
      {/* Header: Author & Options */}
      <div className="p-4 sm:p-5 pb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <button
            type="button"
            onClick={() => onSelectStudentProfile?.(post.authorId)}
            className="shrink-0 focus:outline-none cursor-pointer"
          >
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="w-11 h-11 rounded-full object-cover shadow-sm ring-1 ring-black/5"
            />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => onSelectStudentProfile?.(post.authorId)}
                className="font-bold text-sm text-[#173a35] hover:underline hover:text-[#c46b4b] truncate cursor-pointer transition-colors"
              >
                {post.authorName}
              </button>
            </div>
            <p className="text-xs text-[#62736b] truncate leading-tight mt-0.5">
              {post.authorHeadline}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#728078] mt-1">
              <span>{post.authorInstitution}</span>
              <span>•</span>
              <span>{post.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Options Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#62736b] hover:text-[#173a35] hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="Post options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.04)] border border-black/[0.06] py-1.5 z-30 text-xs overflow-hidden">
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full text-left px-3.5 py-2 text-[#242b29] hover:bg-[#f0f4f2] flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                {copiedLink ? (
                  <Check className="w-4 h-4 text-[#173a35]" />
                ) : (
                  <ExternalLink className="w-4 h-4" />
                )}
                <span>{copiedLink ? "Copied link!" : "Copy post link"}</span>
              </button>

              {isAuthor ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(true)
                      setShowMenu(false)
                    }}
                    className="w-full text-left px-3.5 py-2 text-[#242b29] hover:bg-[#f0f4f2] flex items-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit post</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onDeletePost(post.id)
                      setShowMenu(false)
                    }}
                    className="w-full text-left px-3.5 py-2 text-[#a33e32] hover:bg-[#fdf2f2] flex items-center gap-2.5 font-medium cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete post</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onReport("post", post.id)
                      setShowMenu(false)
                    }}
                    className="w-full text-left px-3.5 py-2 text-[#a33e32] hover:bg-[#fdf2f2] flex items-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <Flag className="w-4 h-4" />
                    <span>Report post</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onBlockUser(post.authorId)
                      setShowMenu(false)
                    }}
                    className="w-full text-left px-3.5 py-2 text-[#62736b] hover:bg-[#f0f4f2] flex items-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <UserX className="w-4 h-4" />
                    <span>Block author</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 sm:px-5 py-2">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              className="w-full p-3 text-sm border border-black/10 rounded-xl focus:outline-none focus:border-[#173a35] shadow-inner"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs text-[#62736b] hover:text-[#242b29] rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="btn-3d-primary px-3.5 py-1.5 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-[#242b29] text-sm leading-relaxed whitespace-pre-line">
            {post.content}
          </p>
        )}
      </div>

      {/* Interactive Poll */}
      {post.poll && (
        <div className="mx-4 sm:mx-5 my-3 p-4 bg-[#f8faf9] border border-black/[0.06] rounded-2xl text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#173a35] text-xs sm:text-sm">
              {post.poll.question}
            </span>
            <span className="text-xs text-[#62736b] font-medium">
              Academic Poll
            </span>
          </div>

          {(() => {
            const totalVotes = post.poll.options.reduce(
              (acc, opt) => acc + opt.votes.length,
              0,
            )
            const hasVotedAny = post.poll.options.some((opt) =>
              opt.votes.includes(currentUser.id),
            )

            return (
              <div className="space-y-2">
                {post.poll.options.map((opt) => {
                  const hasVotedThis = opt.votes.includes(currentUser.id)
                  const percentage =
                    totalVotes > 0
                      ? Math.round((opt.votes.length / totalVotes) * 100)
                      : 0

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onVotePoll?.(post.id, opt.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all relative overflow-hidden cursor-pointer ${
                        hasVotedThis
                          ? "border-[#173a35] bg-[#edf6f0]/40 font-semibold"
                          : "border-black/10 bg-white hover:border-[#173a35]/40"
                      }`}
                    >
                      {/* Vote percentage bar fill */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 opacity-15 transition-all duration-500 ${
                          hasVotedThis ? "bg-[#173a35]" : "bg-black/20"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />

                      <div className="relative flex items-center justify-between text-xs z-10">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                              hasVotedThis
                                ? "border-[#173a35] bg-[#173a35] text-white"
                                : "border-[#87978f]"
                            }`}
                          >
                            {hasVotedThis && (
                              <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </span>
                          <span className="text-[#242b29]">{opt.text}</span>
                        </div>
                        {hasVotedAny && (
                          <span className="font-mono text-[11px] text-[#62736b]">
                            {percentage}%
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}

                <div className="text-[10px] text-[#728078] font-mono flex items-center justify-between pt-1">
                  <span>{totalVotes} total votes</span>
                  <span>
                    {hasVotedAny ? "Vote recorded" : "Click option to vote"}
                  </span>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* Shared Post Quote if this is a repost */}
      {post.sharedPost && (
        <div className="mx-4 sm:mx-5 my-2.5 p-3.5 bg-[#f8faf9] border border-black/[0.06] rounded-2xl text-xs shadow-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <img
              src={post.sharedPost.authorAvatar}
              alt={post.sharedPost.authorName}
              className="w-6 h-6 rounded-full object-cover shadow-xs"
            />
            <span className="font-semibold text-[#173a35]">
              {post.sharedPost.authorName}
            </span>
            <span className="text-[10px] text-[#728078]">
              • {post.sharedPost.createdAt}
            </span>
          </div>
          <p className="text-[#3b4541] italic line-clamp-3">
            "{post.sharedPost.content}"
          </p>
        </div>
      )}

      {/* Attached Image */}
      {post.imageUrl && (
        <div className="mt-3 bg-[#f8faf9] overflow-hidden">
          <img
            src={post.imageUrl}
            alt="Post media"
            className="w-full max-h-[480px] object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Link Preview Card */}
      {post.linkPreview && (
        <a
          href={post.linkPreview.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-4 sm:mx-5 my-3 block border border-black/[0.06] rounded-2xl bg-[#f8faf9] p-3.5 hover:bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-[#c46b4b]">
              {post.linkPreview.domain}
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-[#62736b] group-hover:text-[#173a35]" />
          </div>
          <p className="text-xs font-bold text-[#173a35] mt-1 group-hover:underline">
            {post.linkPreview.title}
          </p>
          {post.linkPreview.description && (
            <p className="text-[11px] text-[#62736b] mt-0.5 line-clamp-1">
              {post.linkPreview.description}
            </p>
          )}
        </a>
      )}

      {/* Engagement Stats Bar */}
      <div className="px-4 sm:px-5 py-2.5 border-b border-black/[0.04] flex items-center justify-between text-xs text-[#62736b]">
        <div className="flex items-center gap-1.5">
          {displayedEmojis.length > 0 && (
            <div className="flex items-center -space-x-1">
              {displayedEmojis.map((emoji, idx) => (
                <span
                  key={idx}
                  className="w-5 h-5 rounded-full bg-white border border-black/10 flex items-center justify-center text-[11px] shadow-2xs"
                >
                  {emoji}
                </span>
              ))}
            </div>
          )}
          <span className="font-medium text-[11px] ml-0.5">
            {post.likes.length}{" "}
            {post.likes.length === 1 ? "reaction" : "reactions"}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className="hover:underline hover:text-[#173a35] cursor-pointer"
          >
            {totalComments} {totalComments === 1 ? "comment" : "comments"}
          </button>
          <span>•</span>
          <span>{post.sharesCount} shares</span>
        </div>
      </div>

      {/* Interaction Buttons - Simple & Clean */}
      <div className="px-3 py-1.5 grid grid-cols-4 gap-1 relative">
        {/* LinkedIn Reaction Picker Popover */}
        {showReactionsMenu && (
          <div
            onMouseEnter={() => setShowReactionsMenu(true)}
            onMouseLeave={() => setShowReactionsMenu(false)}
            className="absolute -top-12 left-2 z-30 bg-white rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-black/[0.08] px-2.5 py-1.5 flex items-center gap-2"
          >
            {LINKEDIN_REACTIONS.map((r) => (
              <button
                key={r.type}
                type="button"
                onClick={() => {
                  if (onSetReaction) {
                    onSetReaction(post.id, r.type)
                  } else {
                    onToggleLike(post.id)
                  }
                  setShowReactionsMenu(false)
                }}
                className="hover:scale-125 transition-transform text-lg leading-none p-1 cursor-pointer"
                title={r.label}
              >
                {r.emoji}
              </button>
            ))}
          </div>
        )}

        <div
          className="relative"
          onMouseEnter={() => setShowReactionsMenu(true)}
          onMouseLeave={() => setShowReactionsMenu(false)}
        >
          <button
            type="button"
            onClick={() => {
              if (onSetReaction) {
                onSetReaction(
                  post.id,
                  currentReactionType ? currentReactionType : "like",
                )
              } else {
                onToggleLike(post.id)
              }
            }}
            className={`w-full flex items-center justify-center gap-1.5 h-10 rounded-xl transition-colors text-xs focus:outline-none cursor-pointer ${
              activeReactionMeta
                ? activeReactionMeta.color + " font-semibold bg-[#edf2ee]/60"
                : "text-[#62736b] hover:bg-black/5 hover:text-[#173a35]"
            }`}
          >
            {activeReactionMeta ? (
              <>
                <span className="text-base leading-none">
                  {activeReactionMeta.emoji}
                </span>
                <span className="hidden sm:inline">
                  {activeReactionMeta.label}
                </span>
              </>
            ) : (
              <>
                <ThumbsUp className="w-4 h-4" />
                <span className="hidden sm:inline">Like</span>
              </>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className="flex items-center justify-center gap-1.5 h-10 rounded-xl text-[#62736b] hover:bg-black/5 hover:text-[#173a35] transition-colors text-xs font-semibold focus:outline-none cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">Comment</span>
        </button>

        <button
          type="button"
          onClick={() => setShowShareModal(true)}
          className="flex items-center justify-center gap-1.5 h-10 rounded-xl text-[#62736b] hover:bg-black/5 hover:text-[#173a35] transition-colors text-xs font-semibold focus:outline-none cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </button>

        <button
          type="button"
          onClick={() => onToggleSavePost?.(post.id)}
          className={`flex items-center justify-center gap-1.5 h-10 rounded-xl transition-colors text-xs font-semibold focus:outline-none cursor-pointer ${
            post.isSaved
              ? "text-[#c46b4b] bg-[#faf0eb]"
              : "text-[#62736b] hover:bg-black/5 hover:text-[#173a35]"
          }`}
          title={post.isSaved ? "Saved to Bookmarks" : "Save post"}
        >
          <Bookmark
            className={`w-4 h-4 ${
              post.isSaved ? "fill-current text-[#c46b4b]" : ""
            }`}
          />
          <span className="hidden sm:inline">
            {post.isSaved ? "Saved" : "Save"}
          </span>
        </button>
      </div>

      {/* Comment Section Drawer */}
      {showComments && (
        <div className="px-4 sm:px-5 pb-5">
          <CommentSection
            postId={post.id}
            comments={post.comments}
            currentUser={currentUser}
            onAddComment={onAddComment}
            onAddReply={onAddReply}
            onSelectStudentProfile={onSelectStudentProfile}
            onEditComment={onEditComment}
            onDeleteComment={onDeleteComment}
          />
        </div>
      )}

      {/* Share / Repost Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102d29]/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-black/10 p-6 max-w-md w-full">
            <h4 className="font-bold text-base text-[#173a35] mb-2">
              Share to your Credento Network
            </h4>
            <textarea
              placeholder="Add your thoughts or citation on this student research..."
              value={shareThoughts}
              onChange={(e) => setShareThoughts(e.target.value)}
              rows={3}
              className="w-full text-xs p-3 border border-black/10 rounded-xl focus:outline-none focus:border-[#173a35] shadow-inner mb-3"
            />
            <div className="p-3 bg-[#f8faf9] rounded-xl border border-black/[0.04] text-xs text-[#62736b] mb-4">
              <strong className="text-[#173a35]">{post.authorName}</strong>: "
              {post.content.slice(0, 110)}
              ..."
            </div>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-xs font-medium text-[#62736b] hover:text-[#242b29] rounded-xl hover:bg-black/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleShareSubmit}
                className="btn-3d-primary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>Repost with Attribution</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
