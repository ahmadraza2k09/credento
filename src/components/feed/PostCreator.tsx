import React, { useState } from "react"
import {
  Image as ImageIcon,
  Link as LinkIcon,
  Send,
  X,
  BarChart3,
  Plus,
} from "lucide-react"
import { PostTopic, StudentProfile } from "../../types"

interface PostCreatorProps {
  currentUser: StudentProfile
  onCreatePost: (params: {
    content: string
    imageUrl?: string
    topic?: PostTopic
    linkPreview?: {
      title: string
      url: string
      domain: string
      description?: string
    }
    poll?: {
      question: string
      options: { id: string; text: string; votes: string[] }[]
    }
  }) => void
}

export function PostCreator({ currentUser, onCreatePost }: PostCreatorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [content, setContent] = useState("")
  const [selectedTopic, setSelectedTopic] = useState<PostTopic>("General")

  // Media drawers
  const [showImageInput, setShowImageInput] = useState(false)
  const [imageUrl, setImageUrl] = useState("")

  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkTitle, setLinkTitle] = useState("")

  // Poll drawer
  const [showPollInput, setShowPollInput] = useState(false)
  const [pollQuestion, setPollQuestion] = useState("")
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""])

  // Student academic research imagery options
  const sampleImages = [
    {
      label: "Lab & Research",
      url: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1000&q=80",
    },
    {
      label: "Code & Software",
      url: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1000&q=80",
    },
    {
      label: "Symposium & Talk",
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

    let poll = undefined
    if (showPollInput && pollQuestion.trim()) {
      const validOptions = pollOptions.filter((opt) => opt.trim().length > 0)
      if (validOptions.length >= 2) {
        poll = {
          question: pollQuestion.trim(),
          options: validOptions.map((opt, idx) => ({
            id: `opt-${idx + 1}`,
            text: opt.trim(),
            votes: [],
          })),
        }
      }
    }

    onCreatePost({
      content: content.trim(),
      imageUrl: imageUrl.trim() || undefined,
      topic: selectedTopic,
      linkPreview,
      poll,
    })

    // Reset
    setContent("")
    setImageUrl("")
    setLinkUrl("")
    setLinkTitle("")
    setPollQuestion("")
    setPollOptions(["", ""])
    setShowImageInput(false)
    setShowLinkInput(false)
    setShowPollInput(false)
    setIsExpanded(false)
  }

  return (
    <div className="card-linkedin p-4 sm:p-5">
      <div className="flex gap-3.5">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-10 h-10 rounded-full object-cover shadow-xs border border-black/10 shrink-0"
        />
        <div className="flex-1">
          {!isExpanded ? (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="w-full text-left py-2.5 px-4 bg-[#f4f6f5] hover:bg-[#ebf0ee] border border-black/[0.06] rounded-full text-xs text-[#62736b] hover:text-[#173a35] transition-all cursor-pointer"
            >
              Start a post, share research, or ask a question...
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Topic Selector Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {([
                  "General",
                  "Research",
                  "Projects",
                  "Career",
                  "Campus Life",
                ] as PostTopic[]).map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setSelectedTopic(topic)}
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium transition-all cursor-pointer ${
                      selectedTopic === topic
                        ? "bg-[#173a35] text-white"
                        : "bg-[#edf2ee] text-[#4d5b54] hover:bg-[#dce6df]"
                    }`}
                  >
                    #{topic}
                  </button>
                ))}
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What academic insight, project update, or collegiate opportunity would you like to share?"
                rows={3}
                className="w-full p-3 text-xs sm:text-sm text-[#242b29] placeholder-[#87978f] border border-black/10 rounded-xl focus:outline-none focus:border-[#173a35] focus:ring-1 focus:ring-[#173a35] resize-y min-h-[80px]"
                autoFocus
              />

              {/* Image Input Drawer */}
              {showImageInput && (
                <div className="p-3 bg-[#f8faf9] border border-black/[0.06] rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#173a35]">
                    <span>Attach Image URL</span>
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
                    placeholder="https://... image link"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-black/10 rounded-lg focus:outline-none focus:border-[#173a35]"
                  />
                  <div>
                    <span className="text-[10px] text-[#728078] block mb-1">
                      Quick sample imagery:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {sampleImages.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setImageUrl(s.url)}
                          className="text-[10px] px-2 py-0.5 bg-white border border-black/10 rounded-full hover:border-[#173a35] text-[#62736b]"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {imageUrl && (
                    <div className="relative mt-2 max-h-32 overflow-hidden rounded-lg border border-black/10">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-28 object-cover"
                        onError={() => setImageUrl("")}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Link Input Drawer */}
              {showLinkInput && (
                <div className="p-3 bg-[#f8faf9] border border-black/[0.06] rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#173a35]">
                    <span>Attach Link or Paper</span>
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
                    placeholder="Title (e.g. arXiv paper or GitHub repository)"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-black/10 rounded-lg focus:outline-none focus:border-[#173a35]"
                  />
                  <input
                    type="url"
                    placeholder="https://..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-black/10 rounded-lg focus:outline-none focus:border-[#173a35]"
                  />
                </div>
              )}

              {/* LinkedIn Style Poll Drawer */}
              {showPollInput && (
                <div className="p-3 bg-[#f8faf9] border border-black/[0.06] rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#173a35]">
                    <span>Create a Student Poll</span>
                    <button
                      type="button"
                      onClick={() => setShowPollInput(false)}
                      className="text-[#62736b] hover:text-[#173a35]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Ask a question (e.g. Which elective are you taking?)"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-black/10 rounded-lg focus:outline-none focus:border-[#173a35]"
                  />
                  <div className="space-y-1.5 pt-1">
                    {pollOptions.map((opt, idx) => (
                      <input
                        key={idx}
                        type="text"
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const next = [...pollOptions]
                          next[idx] = e.target.value
                          setPollOptions(next)
                        }}
                        className="w-full text-xs p-2 bg-white border border-black/10 rounded-lg focus:outline-none focus:border-[#173a35]"
                      />
                    ))}
                    {pollOptions.length < 4 && (
                      <button
                        type="button"
                        onClick={() => setPollOptions([...pollOptions, ""])}
                        className="text-[11px] text-[#173a35] font-semibold flex items-center gap-1 hover:underline pt-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Option</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-black/[0.05]">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowImageInput(!showImageInput)
                      setShowLinkInput(false)
                      setShowPollInput(false)
                    }}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      showImageInput
                        ? "bg-[#dce8df] text-[#173a35] font-semibold"
                        : "text-[#62736b] hover:bg-black/5 hover:text-[#173a35]"
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Media</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowLinkInput(!showLinkInput)
                      setShowImageInput(false)
                      setShowPollInput(false)
                    }}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      showLinkInput
                        ? "bg-[#dce8df] text-[#173a35] font-semibold"
                        : "text-[#62736b] hover:bg-black/5 hover:text-[#173a35]"
                    }`}
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>Link</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowPollInput(!showPollInput)
                      setShowImageInput(false)
                      setShowLinkInput(false)
                    }}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      showPollInput
                        ? "bg-[#dce8df] text-[#173a35] font-semibold"
                        : "text-[#62736b] hover:bg-black/5 hover:text-[#173a35]"
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Poll</span>
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
                      setPollQuestion("")
                    }}
                    className="px-3 py-1 text-xs text-[#62736b] hover:text-[#242b29] rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!content.trim()}
                    className="btn-3d-primary flex items-center gap-1 px-4 py-1 text-xs font-semibold disabled:opacity-40"
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
