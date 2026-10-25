import React, { useState } from "react"
import { Heart, Reply, CornerDownRight, Send } from "lucide-react"
import { Comment, StudentProfile } from "../../types"

interface CommentSectionProps {
  postId: string
  comments: Comment[]
  currentUser: StudentProfile
  onAddComment: (postId: string, content: string) => void
  onAddReply: (postId: string, commentId: string, content: string) => void
  onSelectStudentProfile?: (studentId: string) => void
  onEditComment?: (
    postId: string,
    commentId: string,
    newContent: string,
  ) => void
  onDeleteComment?: (postId: string, commentId: string) => void
}

export function CommentSection({
  postId,
  comments,
  currentUser,
  onAddComment,
  onAddReply,
  onSelectStudentProfile,
  onEditComment,
  onDeleteComment,
}: CommentSectionProps) {
  const [commentText, setCommentText] = useState("")
  const [replyingToId, setReplyingToId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editCommentText, setEditCommentText] = useState("")

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return
    onAddComment(postId, commentText.trim())
    setCommentText("")
  }

  const handleReplySubmit = (commentId: string, e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return
    onAddReply(postId, commentId, replyText.trim())
    setReplyText("")
    setReplyingToId(null)
  }

  return (
    <div className="pt-3 border-t border-black/[0.04] space-y-3">
      {/* Add new comment */}
      <form
        onSubmit={handleCommentSubmit}
        className="flex gap-2.5 items-center"
      >
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-8 h-8 rounded-full object-cover shadow-sm ring-1 ring-black/5 shrink-0"
        />
        <div className="flex-1 flex items-center bg-[#f4f6f5] border border-black/10 rounded-full focus-within:border-[#173a35] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#173a35]/15 shadow-inner transition-all overflow-hidden pr-1.5">
          <input
            type="text"
            placeholder="Add an academic insight or question..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full text-xs py-2 px-3.5 bg-transparent text-[#242b29] placeholder-[#87978f] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="w-7 h-7 rounded-full bg-[#173a35] flex items-center justify-center text-white disabled:opacity-30 disabled:bg-[#87978f] hover:bg-[#0e2f2a] transition-all shrink-0 cursor-pointer shadow-xs"
            aria-label="Send comment"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Existing comments list */}
      {comments.length > 0 && (
        <div className="space-y-3 pt-1">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-2 text-xs">
              <div className="flex gap-2.5 items-start">
                <button
                  type="button"
                  onClick={() => onSelectStudentProfile?.(comment.authorId)}
                  className="shrink-0 cursor-pointer"
                >
                  <img
                    src={comment.authorAvatar}
                    alt={comment.authorName}
                    className="w-8 h-8 rounded-full object-cover shadow-xs ring-1 ring-black/5"
                  />
                </button>
                <div className="flex-1 bg-[#f8faf9] rounded-2xl p-3 border border-black/[0.04] shadow-xs">
                  <div className="flex items-baseline justify-between mb-1">
                    <button
                      type="button"
                      onClick={() => onSelectStudentProfile?.(comment.authorId)}
                      className="font-semibold text-[#173a35] hover:underline hover:text-[#c46b4b] text-left leading-tight cursor-pointer transition-colors"
                    >
                      {comment.authorName}
                    </button>
                    <span className="text-[10px] text-[#728078]">
                      {comment.createdAt}
                    </span>
                  </div>
                  {comment.authorHeadline && (
                    <p className="text-[10px] text-[#62736b] mb-1.5 line-clamp-1">
                      {comment.authorHeadline}
                    </p>
                  )}

                  {editingCommentId === comment.id ? (
                    <div className="space-y-2 mt-1">
                      <input
                        type="text"
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-[#cbd3ce] rounded-xl focus:outline-none focus:border-[#173a35]"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingCommentId(null)}
                          className="px-2.5 py-1 text-[11px] text-[#62736b] hover:text-[#242b29] cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (editCommentText.trim() && onEditComment) {
                              onEditComment(
                                postId,
                                comment.id,
                                editCommentText.trim(),
                              )
                            }
                            setEditingCommentId(null)
                          }}
                          className="btn-3d-primary px-3 py-1 text-[11px] font-semibold cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[#242b29] whitespace-pre-line leading-relaxed">
                      {comment.content}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-4 mt-2 pt-1.5 border-t border-black/[0.04] text-[11px] text-[#62736b]">
                    <button
                      type="button"
                      onClick={() =>
                        setReplyingToId(
                          replyingToId === comment.id ? null : comment.id,
                        )
                      }
                      className="flex items-center gap-1 hover:text-[#173a35] font-medium cursor-pointer"
                    >
                      <Reply className="w-3 h-3" />
                      <span>Reply</span>
                    </button>

                    {comment.authorId === currentUser.id && (
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCommentId(comment.id)
                            setEditCommentText(comment.content)
                          }}
                          className="hover:text-[#173a35] cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onDeleteComment &&
                            onDeleteComment(postId, comment.id)
                          }
                          className="hover:text-[#a33e32] cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Nested replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="pl-10 space-y-2">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-2 items-start">
                      <CornerDownRight className="w-3.5 h-3.5 text-[#87978f] shrink-0 mt-2" />
                      <button
                        type="button"
                        onClick={() => onSelectStudentProfile?.(reply.authorId)}
                        className="shrink-0 cursor-pointer"
                      >
                        <img
                          src={reply.authorAvatar}
                          alt={reply.authorName}
                          className="w-6 h-6 rounded-full object-cover shadow-xs ring-1 ring-black/5"
                        />
                      </button>
                      <div className="flex-1 bg-white rounded-xl p-2.5 border border-black/[0.06] shadow-xs">
                        <div className="flex items-baseline justify-between mb-0.5">
                          <button
                            type="button"
                            onClick={() =>
                              onSelectStudentProfile?.(reply.authorId)
                            }
                            className="font-semibold text-[#173a35] hover:underline text-left text-[11px] cursor-pointer"
                          >
                            {reply.authorName}
                          </button>
                          <span className="text-[10px] text-[#728078]">
                            {reply.createdAt}
                          </span>
                        </div>
                        <p className="text-[#242b29] text-xs leading-relaxed">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Inline reply form */}
              {replyingToId === comment.id && (
                <form
                  onSubmit={(e) => handleReplySubmit(comment.id, e)}
                  className="pl-10 flex gap-2 items-center"
                >
                  <input
                    type="text"
                    placeholder={`Reply to ${comment.authorName}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 text-xs py-2 px-3 bg-white border border-black/10 rounded-full focus:outline-none focus:border-[#173a35] shadow-inner"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="btn-3d-primary px-3 py-1.5 text-[11px] font-semibold disabled:opacity-40 cursor-pointer rounded-full"
                  >
                    Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplyingToId(null)}
                    className="text-[11px] text-[#62736b] hover:text-[#242b29] px-1 cursor-pointer"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
