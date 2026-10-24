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
} from "lucide-react"
import { Post, StudentProfile } from "../../types"
import { CommentSection } from "./CommentSection"

interface PostCardProps {
  post: Post
  currentUser: StudentProfile
  onToggleLike: (postId: string) => void
  onAddComment: (postId: string, content: string) => void
  onAddReply: (postId: string, commentId: string, content: string) => void
  onSharePost: (originalPost: Post, thoughts?: string) => void
  onEditPost: (postId: string, newContent: string) => void
  onDeletePost: (postId: string) => void
  onReport: (type: "post", targetId: string) => void
  onBlockUser: (userId: string) => void
  onSelectStudentProfile?: (studentId: string) => void
}

export function PostCard({
  post,
  currentUser,
  onToggleLike,
  onAddComment,
  onAddReply,
  onSharePost,
  onEditPost,
  onDeletePost,
  onReport,
  onBlockUser,
  onSelectStudentProfile,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content)
  const [copiedLink, setCopiedLink] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareThoughts, setShareThoughts] = useState("")

  const isAuthor = post.authorId === currentUser.id
  const hasLiked = post.likes.includes(currentUser.id)
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
    <article className="bg-white rounded-md border border-[#cbd3ce] shadow-[0_1px_3px_rgba(23,58,53,0.04)] mb-4 overflow-hidden transition-all">
      {/* Header: Author & Options */}
      <div className="p-4 pb-2.5 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <button
            type="button"
            onClick={() => onSelectStudentProfile?.(post.authorId)}
            className="shrink-0 focus:outline-none"
          >
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="w-11 h-11 rounded object-cover border border-[#cbd3ce]"
            />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => onSelectStudentProfile?.(post.authorId)}
                className="font-bold text-sm text-[#173a35] hover:underline truncate"
              >
                {post.authorName}
              </button>
              {isAuthor && (
                <span className="text-[10px] bg-[#dce8df] text-[#173a35] px-1.5 py-0.2 rounded font-mono font-medium">
                  Author
                </span>
              )}
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
            className="w-8 h-8 rounded flex items-center justify-center text-[#62736b] hover:text-[#173a35] hover:bg-[#f7f5ef] transition-colors"
            aria-label="Post options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-44 bg-white border border-[#cbd3ce] rounded shadow-lg py-1 z-30 text-xs">
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full text-left px-3 py-2 text-[#242b29] hover:bg-[#f7f5ef] flex items-center gap-2"
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
                    className="w-full text-left px-3 py-2 text-[#242b29] hover:bg-[#f7f5ef] flex items-center gap-2"
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
                    className="w-full text-left px-3 py-2 text-[#a33e32] hover:bg-[#fdf2f2] flex items-center gap-2 font-medium"
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
                    className="w-full text-left px-3 py-2 text-[#a33e32] hover:bg-[#fdf2f2] flex items-center gap-2"
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
                    className="w-full text-left px-3 py-2 text-[#62736b] hover:bg-[#f7f5ef] flex items-center gap-2"
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
      <div className="px-4 py-2">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              className="w-full p-2.5 text-sm border border-[#cbd3ce] rounded focus:outline-none focus:border-[#173a35]"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 text-xs text-[#62736b] hover:text-[#242b29]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-3 py-1 bg-[#173a35] text-white rounded text-xs font-semibold"
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

      {/* Shared Post Quote if this is a repost */}
      {post.sharedPost && (
        <div className="mx-4 my-2 p-3 bg-[#f7f5ef] border border-[#d8ddd8] rounded text-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <img
              src={post.sharedPost.authorAvatar}
              alt={post.sharedPost.authorName}
              className="w-5 h-5 rounded object-cover"
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
        <div className="mt-2 border-y border-[#eef2ef] bg-[#f7f5ef] overflow-hidden">
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
          className="mx-4 my-2.5 block border border-[#cbd3ce] rounded bg-[#f7f5ef] p-3 hover:bg-[#eef2ef] transition-colors group"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#c46b4b]">
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
      <div className="px-4 py-2 border-b border-[#eef2ef] flex items-center justify-between text-xs text-[#62736b]">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-[#173a35] flex items-center justify-center text-white text-[9px]">
            👍
          </div>
          <span>
            {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className="hover:underline"
          >
            {totalComments} {totalComments === 1 ? "comment" : "comments"}
          </button>
          <span>•</span>
          <span>{post.sharesCount} shares</span>
        </div>
      </div>

      {/* Interaction Buttons - Min 44px touch targets */}
      <div className="px-2 py-1 grid grid-cols-3 gap-1">
        <button
          type="button"
          onClick={() => onToggleLike(post.id)}
          className={`flex items-center justify-center gap-2 h-11 rounded transition-colors text-xs font-semibold focus:outline-none ${
            hasLiked
              ? "text-[#c46b4b] bg-[#c46b4b]/8 font-bold"
              : "text-[#62736b] hover:bg-[#f7f5ef] hover:text-[#173a35]"
          }`}
        >
          <Heart className={`w-4 h-4 ${hasLiked ? "fill-current" : ""}`} />
          <span>{hasLiked ? "Liked" : "Like"}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className="flex items-center justify-center gap-2 h-11 rounded text-[#62736b] hover:bg-[#f7f5ef] hover:text-[#173a35] transition-colors text-xs font-semibold focus:outline-none"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Comment</span>
        </button>

        <button
          type="button"
          onClick={() => setShowShareModal(true)}
          className="flex items-center justify-center gap-2 h-11 rounded text-[#62736b] hover:bg-[#f7f5ef] hover:text-[#173a35] transition-colors text-xs font-semibold focus:outline-none"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Comment Section Drawer */}
      {showComments && (
        <div className="px-4 pb-4">
          <CommentSection
            postId={post.id}
            comments={post.comments}
            currentUser={currentUser}
            onAddComment={onAddComment}
            onAddReply={onAddReply}
            onSelectStudentProfile={onSelectStudentProfile}
          />
        </div>
      )}

      {/* Share / Repost Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102d29]/60 backdrop-blur-[1px]">
          <div className="bg-white rounded-md border border-[#cbd3ce] p-5 max-w-md w-full shadow-xl">
            <h4 className="font-bold text-sm text-[#173a35] mb-2">
              Share to your Credento Network
            </h4>
            <textarea
              placeholder="Add your thoughts or citation on this student research..."
              value={shareThoughts}
              onChange={(e) => setShareThoughts(e.target.value)}
              rows={3}
              className="w-full text-xs p-2.5 border border-[#cbd3ce] rounded focus:outline-none focus:border-[#173a35] mb-3"
            />
            <div className="p-2.5 bg-[#f7f5ef] rounded border border-[#d8ddd8] text-xs text-[#62736b] mb-4">
              <strong>{post.authorName}</strong>: "{post.content.slice(0, 110)}
              ..."
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="px-3 py-1.5 text-xs text-[#62736b]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleShareSubmit}
                className="px-4 py-1.5 bg-[#173a35] text-white rounded text-xs font-semibold flex items-center gap-1.5"
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
