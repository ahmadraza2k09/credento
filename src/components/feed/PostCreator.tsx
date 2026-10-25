import React, { useState } from "react"
import {
  Image as ImageIcon,
  Link as LinkIcon,
  Send,
  X,
  Sparkles,
  FileText,
} from "lucide-react"
import { StudentProfile } from "../../types"

interface PostCreatorProps {
  currentUser: StudentProfile
  onCreatePost: (params: {
    content: string
    imageUrl?: string
    linkPreview?: {
      title: string
      url: string
      domain: string
      description?: string
    }
  }) => void
}

export function PostCreator({ currentUser, onCreatePost }: PostCreatorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [showImageInput, setShowImageInput] = useState(false)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkTitle, setLinkTitle] = useState("")

  // Curated student research imagery options
  const sampleImages = [
    {
      label: "Lab & Research",
      url: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1000&q=80",
    },
    {
      label: "Code & Benchmark",
      url: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1000&q=80",
    },
    {
      label: "Symposium / Conference",
      url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80",
    },
    {
      label: "Robotics & Hardware",
      url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80",
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    let linkPreview = undefined
    if (linkUrl.trim()) {
      try {
        const parsed = new URL(
          linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`,
        )
        linkPreview = {
          title: linkTitle.trim() || parsed.hostname,
          url: parsed.href,
          domain: parsed.hostname.replace(/^www\./, ""),
          description: "Academic publication or external project repository",
        }
      } catch (err) {
        linkPreview = {
          title: linkTitle.trim() || "External Academic Resource",
          url: linkUrl,
          domain: "credento.edu",
        }
      }
    }

    onCreatePost({
      content: content.trim(),
      imageUrl: imageUrl.trim() || undefined,
      linkPreview,
    })

    setContent("")
    setImageUrl("")
    setLinkUrl("")
    setLinkTitle("")
    setShowImageInput(false)
    setShowLinkInput(false)
    setIsExpanded(false)
  }

  return (
    <div className="card-linkedin p-4 sm:p-5">
      <div className="flex gap-3.5">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-11 h-11 rounded-full object-cover shadow-sm ring-1 ring-black/5 shrink-0"
        />
        <div className="flex-1">
          {!isExpanded ? (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="w-full text-left py-3 px-4 bg-[#f4f6f5] hover:bg-[#ebf0ee] border border-black/[0.06] rounded-full text-xs text-[#62736b] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.03)] hover:text-[#173a35] transition-all cursor-pointer"
            >
              Share an academic update, lab breakthrough, or conference
              reflection...
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What are you researching or learning today? Share with fellow students..."
                rows={4}
                className="w-full p-3.5 text-sm text-[#242b29] placeholder-[#87978f] border border-black/10 rounded-2xl focus:outline-none focus:border-[#173a35] focus:ring-2 focus:ring-[#173a35]/20 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.03)] resize-y min-h-[90px] transition-all"
                autoFocus
              />

              {/* Image Input Drawer */}
              {showImageInput && (
                <div className="p-3.5 bg-[#f8faf9] border border-black/[0.06] rounded-2xl space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#173a35]">
                    <span>Attach Supporting Image URL</span>
                    <button
                      type="button"
                      onClick={() => setShowImageInput(false)}
                      className="text-[#62736b] hover:text-[#173a35] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or paste image link"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-[#173a35] shadow-inner"
                  />
                  <div className="pt-1">
                    <span className="text-[10px] text-[#728078] block mb-1.5">
                      Or pick a sample student photo:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sampleImages.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setImageUrl(s.url)}
                          className="text-[10px] px-2.5 py-1 bg-white border border-black/10 rounded-full hover:border-[#173a35] hover:text-[#173a35] text-[#62736b] shadow-xs cursor-pointer transition-all"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {imageUrl && (
                    <div className="relative mt-2 max-h-36 overflow-hidden rounded-xl border border-black/10 shadow-sm">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-32 object-cover"
                        onError={() => setImageUrl("")}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Link Input Drawer */}
              {showLinkInput && (
                <div className="p-3.5 bg-[#f8faf9] border border-black/[0.06] rounded-2xl space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#173a35]">
                    <span>Attach Paper, Github or Opportunity Link</span>
                    <button
                      type="button"
                      onClick={() => setShowLinkInput(false)}
                      className="text-[#62736b] hover:text-[#173a35] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Link Title (e.g., SparseAttention Paper Preprint)"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-[#173a35] shadow-inner"
                  />
                  <input
                    type="url"
                    placeholder="https://..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-[#173a35] shadow-inner"
                  />
                </div>
              )}

              {/* Bottom action controls */}
              <div className="flex items-center justify-between pt-2 border-t border-black/[0.04]">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setShowImageInput(!showImageInput)
                      setShowLinkInput(false)
                    }}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                      showImageInput || imageUrl
                        ? "bg-[#dce8df] text-[#173a35] font-semibold shadow-xs"
                        : "text-[#62736b] hover:bg-black/5 hover:text-[#173a35]"
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowLinkInput(!showLinkInput)
                      setShowImageInput(false)
                    }}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                      showLinkInput || linkUrl
                        ? "bg-[#dce8df] text-[#173a35] font-semibold shadow-xs"
                        : "text-[#62736b] hover:bg-black/5 hover:text-[#173a35]"
                    }`}
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>Link</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsExpanded(false)
                      setContent("")
                      setImageUrl("")
                      setLinkUrl("")
                    }}
                    className="px-3.5 py-1.5 text-xs text-[#62736b] hover:text-[#242b29] rounded-xl hover:bg-black/5 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!content.trim()}
                    className="btn-3d-primary flex items-center gap-1.5 px-4.5 py-1.5 text-xs font-semibold disabled:opacity-40 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
