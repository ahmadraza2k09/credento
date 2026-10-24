import React, { useState, useEffect, useRef } from "react"
import {
  MessageSquare,
  Search,
  Send,
  ArrowLeft,
  User,
  ShieldCheck,
  CheckCheck,
  Check,
} from "lucide-react"
import { Conversation, StudentProfile } from "../../types"

interface MessagesViewProps {
  conversations: Conversation[]
  currentUser: StudentProfile
  onSendMessage: (conversationId: string, text: string) => void
  onMarkAsRead: (conversationId: string) => void
  onSelectStudentProfile: (userId: string) => void
  initialActiveConversationId?: string
}

export function MessagesView({
  conversations,
  currentUser,
  onSendMessage,
  onMarkAsRead,
  onSelectStudentProfile,
  initialActiveConversationId,
}: MessagesViewProps) {
  const [activeConversationId, setActiveConversationId] =
    useState<string | null>(
      initialActiveConversationId || (conversations[0]?.id ?? null),
    )
  const [searchQuery, setSearchQuery] = useState("")
  const [messageInput, setMessageInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId,
  )

  useEffect(() => {
    if (activeConversationId) {
      onMarkAsRead(activeConversationId)
    }
  }, [activeConversationId, onMarkAsRead])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeConversation?.messages])

  const filteredConversations = conversations.filter(
    (c) =>
      c.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.otherUser.institution.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !activeConversationId) return
    onSendMessage(activeConversationId, messageInput.trim())
    setMessageInput("")
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-5 py-5 sm:py-8">
      <div className="bg-white rounded-md border border-[#cbd3ce] shadow-[0_1px_3px_rgba(23,58,53,0.04)] overflow-hidden h-[75vh] min-h-[520px] flex">
        {/* LEFT COLUMN: CONVERSATION LIST */}
        <aside
          className={`w-full md:w-80 border-r border-[#cbd3ce] flex flex-col bg-[#f7f5ef]/40 ${
            activeConversationId ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Header & Search */}
          <div className="p-3.5 border-b border-[#cbd3ce] bg-white">
            <h2 className="font-bold text-sm text-[#173a35] tracking-tight mb-2.5 flex items-center justify-between">
              <span>Peer Messaging</span>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 bg-[#dce8df] text-[#173a35] rounded">
                Verified
              </span>
            </h2>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#728078] absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f7f5ef] border border-[#cbd3ce] rounded focus:outline-none focus:border-[#173a35] text-[#242b29]"
              />
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#eef2ef]">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#62736b]">
                No conversations found.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === activeConversationId
                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`w-full p-3 text-left flex items-start gap-3 transition-colors ${
                      isSelected
                        ? "bg-white border-l-3 border-[#173a35]"
                        : "hover:bg-white/80"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={conv.otherUser.avatar}
                        alt={conv.otherUser.name}
                        className="w-10 h-10 rounded object-cover border border-[#cbd3ce]"
                      />
                      {conv.otherUser.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#1b6b47] rounded-full ring-2 ring-white" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between">
                        <span
                          className={`text-xs truncate font-semibold ${
                            isSelected ? "text-[#173a35]" : "text-[#242b29]"
                          }`}
                        >
                          {conv.otherUser.name}
                        </span>
                        <span className="text-[10px] text-[#728078] shrink-0 font-mono">
                          {conv.lastMessageAt}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#62736b] truncate mt-0.5">
                        {conv.lastMessage}
                      </p>
                      <span className="text-[10px] text-[#87978f] truncate block">
                        {conv.otherUser.institution.split(" ")[0]}
                      </span>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-[#c46b4b] shrink-0 mt-2" />
                    )}
                  </button>
                )
              })
            )}
          </div>
        </aside>

        {/* RIGHT COLUMN: ACTIVE CHAT THREAD */}
        <section
          className={`flex-1 flex flex-col bg-white ${
            !activeConversationId ? "hidden md:flex" : "flex"
          }`}
        >
          {activeConversation ? (
            <>
              {/* Thread Header */}
              <div className="p-3.5 border-b border-[#cbd3ce] bg-[#f7f5ef]/50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Back button on mobile */}
                  <button
                    type="button"
                    onClick={() => setActiveConversationId(null)}
                    className="md:hidden p-1.5 rounded text-[#173a35] hover:bg-[#e8ece9]"
                    aria-label="Back to messages list"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onSelectStudentProfile(activeConversation.otherUser.id)
                    }
                    className="shrink-0"
                  >
                    <img
                      src={activeConversation.otherUser.avatar}
                      alt={activeConversation.otherUser.name}
                      className="w-9 h-9 rounded object-cover border border-[#cbd3ce]"
                    />
                  </button>
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() =>
                        onSelectStudentProfile(activeConversation.otherUser.id)
                      }
                      className="font-bold text-xs sm:text-sm text-[#173a35] hover:underline truncate block text-left"
                    >
                      {activeConversation.otherUser.name}
                    </button>
                    <p className="text-[11px] text-[#62736b] truncate">
                      {activeConversation.otherUser.institution}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onSelectStudentProfile(activeConversation.otherUser.id)
                  }
                  className="px-2.5 py-1 text-xs border border-[#cbd3ce] rounded text-[#173a35] hover:bg-white transition-colors shrink-0"
                >
                  View Profile
                </button>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f7f5ef]/20">
                {activeConversation.messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-xs text-[#62736b]">
                    <ShieldCheck className="w-8 h-8 text-[#173a35] mb-2" />
                    <p className="font-semibold text-[#173a35]">
                      Encrypted Academic Exchange
                    </p>
                    <p className="text-[11px] max-w-xs mt-1">
                      Say hello to {activeConversation.otherUser.name}. Share
                      lab ideas, review research preprints, or discuss
                      scholarship applications.
                    </p>
                  </div>
                ) : (
                  activeConversation.messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          isMe ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-md p-3 rounded-md text-xs leading-relaxed shadow-xs ${
                            isMe
                              ? "bg-[#173a35] text-white rounded-br-none"
                              : "bg-white border border-[#cbd3ce] text-[#242b29] rounded-bl-none"
                          }`}
                        >
                          <p className="whitespace-pre-line">{msg.text}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-[#728078] px-1 font-mono">
                          <span>{msg.sentAt}</span>
                          {isMe && (
                            <CheckCheck className="w-3 h-3 text-[#173a35]" />
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSend}
                className="p-3 border-t border-[#cbd3ce] bg-white flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Type an academic message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 py-2 px-3 text-xs border border-[#cbd3ce] rounded focus:outline-none focus:border-[#173a35] text-[#242b29]"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="px-4 py-2 bg-[#173a35] text-white rounded text-xs font-semibold hover:bg-[#0e2f2a] disabled:opacity-40 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-xs text-[#62736b]">
              <MessageSquare className="w-10 h-10 text-[#87978f] mb-2" />
              <p className="font-bold text-sm text-[#173a35]">
                Select a Conversation
              </p>
              <p className="max-w-xs mt-1">
                Choose a student connection on the left to review messages or
                start a new discussion.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
