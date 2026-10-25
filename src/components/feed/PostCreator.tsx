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
    <div className="bg-white rounded-[2px] border border-[#cbd3ce] p-4 mb-4">
      <div className="flex gap-3">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-10 h-10 rounded-[2px] object-cover border border-[#cbd3ce] shrink-0"
        />
        <div className="flex-1">
          {!isExpanded ? (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="w-full text-left py-2.5 px-3.5 bg-[#f7f5ef] hover:bg-[#eef2ef] border border-[#d8ddd8] rounded-[2px] text-xs text-[#62736b] transition-colors"
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
                className="w-full p-3 text-sm text-[#242b29] placeholder-[#87978f] border border-[#cbd3ce] rounded-[2px] focus:outline-none focus:border-[#173a35] focus:ring-1 focus:ring-[#173a35] resize-y min-h-[90px]"
                autoFocus
              />

              {/* Image Input Drawer */}
              {showImageInput && (
                <div className="p-3 bg-[#f7f5ef] border border-[#d8ddd8] rounded-[2px] space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#173a35]">
                    <span>Attach Supporting Image URL</span>
                    <button
                      type="button"
                      onClick={() => setShowImageInput(false)}
                      className="text-[#62736b] hover:text-[#173a35]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or paste image link"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-[#cbd3ce] rounded-[2px] focus:outline-none focus:border-[#173a35]"
                  />
                  <div className="pt-1">
                    <span className="text-[10px] text-[#728078] block mb-1">
                      Or pick a sample student photo:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sampleImages.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setImageUrl(s.url)}
                          className="text-[10px] px-2 py-0.5 bg-white border border-[#cbd3ce] rounded-[2px] hover:border-[#173a35] text-[#173a35]"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {imageUrl && (
                    <div className="relative mt-2 max-h-36 overflow-hidden rounded-[2px] border border-[#cbd3ce]">
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
                <div className="p-3 bg-[#f7f5ef] border border-[#d8ddd8] rounded-[2px] space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#173a35]">
                    <span>Attach Paper, Github or Opportunity Link</span>
                    <button
                      type="button"
                      onClick={() => setShowLinkInput(false)}
                      className="text-[#62736b] hover:text-[#173a35]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Link Title (e.g., SparseAttention Paper Preprint)"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-[#cbd3ce] rounded-[2px] focus:outline-none"
                  />
                  <input
                    type="url"
                    placeholder="https://..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-[#cbd3ce] rounded-[2px] focus:outline-none"
                  />
                </div>
              )}

              {/* Bottom action controls */}
              <div className="flex items-center justify-between pt-2 border-t border-[#eef2ef]">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setShowImageInput(!showImageInput)
                      setShowLinkInput(false)
                    }}
                    className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-[2px] transition-colors ${
                      showImageInput || imageUrl
                        ? "bg-[#dce8df] text-[#173a35] font-semibold border border-[#b8c9bd]"
                        : "text-[#62736b] hover:bg-[#f7f5ef] hover:text-[#173a35]"
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
                    className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-[2px] transition-colors ${
                      showLinkInput || linkUrl
                        ? "bg-[#dce8df] text-[#173a35] font-semibold border border-[#b8c9bd]"
                        : "text-[#62736b] hover:bg-[#f7f5ef] hover:text-[#173a35]"
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
                    className="px-3 py-1.5 text-xs text-[#62736b] hover:text-[#242b29] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!content.trim()}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-[#173a35] text-white rounded-[2px] text-xs font-semibold hover:bg-[#0e2f2a] disabled:opacity-40 transition-colors"
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
