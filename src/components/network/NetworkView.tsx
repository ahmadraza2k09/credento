import React, { useState, useMemo } from "react"
import {
  Users,
  UserPlus,
  UserCheck,
  Clock,
  Search,
  Filter,
  MessageSquare,
  Building,
  MapPin,
  Check,
  X,
  ExternalLink,
} from "lucide-react"
import { StudentProfile } from "../../types"

interface NetworkViewProps {
  currentUser: StudentProfile
  allStudents: StudentProfile[]
  onConnect: (userId: string) => void
  onAcceptConnection: (userId: string) => void
  onDeclineConnection: (userId: string) => void
  onWithdrawConnection: (userId: string) => void
  onToggleFollow: (userId: string) => void
  onStartMessage: (userId: string) => void
  onSelectStudentProfile: (userId: string) => void
}

export function NetworkView({
  currentUser,
  allStudents,
  onConnect,
  onAcceptConnection,
  onDeclineConnection,
  onWithdrawConnection,
  onToggleFollow,
  onStartMessage,
  onSelectStudentProfile,
}: NetworkViewProps) {
  const [activeTab, setActiveTab] =
    useState<"suggestions" | "pending" | "connections" | "following">(
      "suggestions",
    )
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInstitution, setSelectedInstitution] = useState("all")

  // Other students excluding current user
  const otherStudents = useMemo(() => {
    return allStudents.filter((s) => s.id !== currentUser.id)
  }, [allStudents, currentUser.id])

  // Unique institutions for filtering
  const institutions = useMemo(() => {
    const list = Array.from(new Set(allStudents.map((s) => s.institution)))
    return list
  }, [allStudents])

  // Filtered lists
  const pendingReceived = useMemo(() => {
    return otherStudents.filter(
      (s) => s.connectionStatus === "pending_received",
    )
  }, [otherStudents])

  const pendingSent = useMemo(() => {
    return otherStudents.filter((s) => s.connectionStatus === "pending_sent")
  }, [otherStudents])

  const connectedStudents = useMemo(() => {
    return otherStudents.filter((s) => s.connectionStatus === "connected")
  }, [otherStudents])

  const followingStudents = useMemo(() => {
    return otherStudents.filter((s) => s.isFollowing)
  }, [otherStudents])

  const suggestions = useMemo(() => {
    return otherStudents.filter(
      (s) => s.connectionStatus === "none" || s.connectionStatus === undefined,
    )
  }, [otherStudents])

  // Apply search & institution filter to the active tab list
  const currentList = useMemo(() => {
    let baseList: StudentProfile[] = []
    if (activeTab === "suggestions") baseList = suggestions
    else if (activeTab === "pending")
      baseList = [...pendingReceived, ...pendingSent]
    else if (activeTab === "connections") baseList = connectedStudents
    else if (activeTab === "following") baseList = followingStudents

    return baseList.filter((student) => {
      const matchesSearch =
        searchQuery === "" ||
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.skills?.some((sk) =>
          sk.toLowerCase().includes(searchQuery.toLowerCase()),
        ) ||
        student.interests?.some((int) =>
          int.toLowerCase().includes(searchQuery.toLowerCase()),
        )

      const matchesInst =
        selectedInstitution === "all" ||
        student.institution === selectedInstitution

      return matchesSearch && matchesInst
    })
  }, [
    activeTab,
    suggestions,
    pendingReceived,
    pendingSent,
    connectedStudents,
    followingStudents,
    searchQuery,
    selectedInstitution,
  ])

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-5 py-5 sm:py-8 space-y-6">
      {/* Top Banner / Summary */}
      <div className="card-linkedin p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#173a35] tracking-tight">
              My Student Network
            </h1>
            <p className="text-xs sm:text-sm text-[#62736b] mt-1">
              Connect with university peers, research collaborators, and
              academic societies
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="px-4 py-2 bg-[#f8faf9] border border-black/[0.04] rounded-2xl text-center shadow-xs">
              <span className="block font-bold text-[#173a35] text-base">
                {connectedStudents.length}
              </span>
              <span className="text-[11px] text-[#62736b] font-medium">
                Connections
              </span>
            </div>
            <div className="px-4 py-2 bg-[#f8faf9] border border-black/[0.04] rounded-2xl text-center shadow-xs">
              <span className="block font-bold text-[#c46b4b] text-base">
                {followingStudents.length}
              </span>
              <span className="text-[11px] text-[#62736b] font-medium">
                Following
              </span>
            </div>
            <div className="px-4 py-2 bg-[#f8faf9] border border-black/[0.04] rounded-2xl text-center shadow-xs">
              <span className="block font-bold text-[#173a35] text-base">
                {pendingReceived.length}
              </span>
              <span className="text-[11px] text-[#62736b] font-medium">
                Requests
              </span>
            </div>
          </div>
        </div>

        {/* Network Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-5 mt-5 border-t border-black/[0.05] scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("suggestions")}
            className={`text-xs px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "suggestions"
                ? "btn-3d-primary text-white"
                : "bg-[#f4f6f5] text-[#62736b] hover:bg-white hover:shadow-sm"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Discover Peers ({suggestions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pending")}
            className={`text-xs px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "pending"
                ? "btn-3d-primary text-white"
                : "bg-[#f4f6f5] text-[#62736b] hover:bg-white hover:shadow-sm"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>
              Pending Invitations{" "}
              {pendingReceived.length > 0 && `(${pendingReceived.length})`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("connections")}
            className={`text-xs px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "connections"
                ? "btn-3d-primary text-white"
                : "bg-[#f4f6f5] text-[#62736b] hover:bg-white hover:shadow-sm"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>My Connections ({connectedStudents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("following")}
            className={`text-xs px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "following"
                ? "btn-3d-primary text-white"
                : "bg-[#f4f6f5] text-[#62736b] hover:bg-white hover:shadow-sm"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Following ({followingStudents.length})</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="card-linkedin p-3.5 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#728078] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by student name, major, skill (e.g. PyTorch), or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#f4f6f5] border border-black/10 rounded-full focus:outline-none focus:border-[#173a35] focus:bg-white text-[#242b29] shadow-inner transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#728078] shrink-0" />
          <select
            value={selectedInstitution}
            onChange={(e) => setSelectedInstitution(e.target.value)}
            className="text-xs bg-[#f4f6f5] border border-black/10 rounded-full px-3.5 py-2 text-[#242b29] focus:outline-none cursor-pointer w-full sm:w-auto shadow-xs"
          >
            <option value="all">All Universities</option>
            {institutions.map((inst) => (
              <option key={inst} value={inst}>
                {inst}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* STUDENT CARDS GRID */}
      {currentList.length === 0 ? (
        <div className="card-linkedin p-12 text-center text-[#62736b]">
          <Users className="w-10 h-10 text-[#87978f] mx-auto mb-2.5" />
          <p className="font-bold text-base text-[#173a35]">
            No students found in this view.
          </p>
          <p className="text-xs mt-1">
            Try adjusting your search query or university filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentList.map((student) => {
            const isReceived = student.connectionStatus === "pending_received"
            const isSent = student.connectionStatus === "pending_sent"
            const isConn = student.connectionStatus === "connected"

            return (
              <div
                key={student.id}
                className="card-linkedin card-linkedin-hover overflow-hidden flex flex-col justify-between"
              >
                {/* Mini header */}
                <div>
                  <div className="h-20 bg-gradient-to-r from-[#173a35] to-[#1e4b44] relative">
                    {student.coverImage && (
                      <img
                        src={student.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover opacity-60"
                      />
                    )}
                  </div>
                  <div className="px-5 pb-4 pt-0 relative">
                    <button
                      type="button"
                      onClick={() => onSelectStudentProfile(student.id)}
                      className="inline-block -mt-10 focus:outline-none cursor-pointer"
                    >
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-18 h-18 rounded-full object-cover border-3 border-white shadow-md bg-white"
                      />
                    </button>

                    <div className="mt-2">
                      <div className="flex items-center justify-between gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectStudentProfile(student.id)}
                          className="font-bold text-sm text-[#173a35] hover:underline hover:text-[#c46b4b] truncate text-left cursor-pointer transition-colors"
                        >
                          {student.name}
                        </button>
                        {isConn && (
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-[#dce8df] text-[#173a35] rounded-full font-semibold shadow-2xs">
                            Connected
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#242b29] mt-0.5 line-clamp-2 leading-tight">
                        {student.headline}
                      </p>

                      <div className="flex items-center gap-1.5 text-[11px] text-[#62736b] mt-2.5">
                        <Building className="w-3.5 h-3.5 text-[#173a35] shrink-0" />
                        <span className="truncate">{student.institution}</span>
                      </div>

                      {student.location && (
                        <div className="flex items-center gap-1.5 text-[11px] text-[#728078] mt-1">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{student.location}</span>
                        </div>
                      )}

                      {/* Top skills pills */}
                      {student.skills && student.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3.5 pt-3 border-t border-black/[0.04]">
                          {student.skills.slice(0, 3).map((sk, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 bg-[#f4f6f5] rounded-full text-[#4d5b54] font-medium shadow-2xs"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-3.5 bg-[#f8faf9] border-t border-black/[0.04] flex items-center justify-between gap-2">
                  {isReceived ? (
                    <div className="flex items-center gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => onAcceptConnection(student.id)}
                        className="btn-3d-primary flex-1 py-1.5 px-3 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeclineConnection(student.id)}
                        className="btn-3d-secondary py-1.5 px-3 text-[#62736b] hover:text-[#a33e32] text-xs cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : isSent ? (
                    <button
                      type="button"
                      onClick={() => onWithdrawConnection(student.id)}
                      className="btn-3d-secondary w-full py-1.5 px-3 text-[#62736b] hover:text-[#a33e32] text-xs font-medium cursor-pointer"
                    >
                      Withdraw Request
                    </button>
                  ) : isConn ? (
                    <div className="flex items-center gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => onStartMessage(student.id)}
                        className="btn-3d-primary flex-1 py-1.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Message</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleFollow(student.id)}
                        className={`btn-3d-secondary px-3 py-1.5 text-xs font-medium cursor-pointer ${
                          student.isFollowing ? "text-[#173a35] font-bold" : ""
                        }`}
                      >
                        {student.isFollowing ? "Following" : "Follow"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => onConnect(student.id)}
                        className="btn-3d-primary flex-1 py-1.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Connect</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleFollow(student.id)}
                        className={`btn-3d-secondary px-3 py-1.5 text-xs font-medium cursor-pointer ${
                          student.isFollowing ? "text-[#173a35] font-bold" : ""
                        }`}
                      >
                        {student.isFollowing ? "Following" : "Follow"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
