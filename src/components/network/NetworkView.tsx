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
      <div className="bg-white rounded-[2px] border border-[#cbd3ce] p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#173a35] tracking-tight">
              My Student Network
            </h1>
            <p className="text-xs text-[#62736b] mt-1">
              Connect with university peers, research collaborators, and
              academic societies
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="px-3 py-1.5 bg-[#f7f5ef] border border-[#d8ddd8] rounded-[2px] text-center">
              <span className="block font-bold text-[#173a35] text-sm">
                {connectedStudents.length}
              </span>
              <span className="text-[10px] text-[#62736b] uppercase">
                Connections
              </span>
            </div>
            <div className="px-3 py-1.5 bg-[#f7f5ef] border border-[#d8ddd8] rounded-[2px] text-center">
              <span className="block font-bold text-[#c46b4b] text-sm">
                {followingStudents.length}
              </span>
              <span className="text-[10px] text-[#62736b] uppercase">
                Following
              </span>
            </div>
            <div className="px-3 py-1.5 bg-[#f7f5ef] border border-[#d8ddd8] rounded-[2px] text-center">
              <span className="block font-bold text-[#173a35] text-sm">
                {pendingReceived.length}
              </span>
              <span className="text-[10px] text-[#62736b] uppercase">
                Requests
              </span>
            </div>
          </div>
        </div>

        {/* Network Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-5 mt-4 border-t border-[#eef2ef] scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("suggestions")}
            className={`text-xs px-3.5 py-2 rounded-[2px] border font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "suggestions"
                ? "bg-[#173a35] text-white border-[#173a35]"
                : "bg-white text-[#62736b] border-[#cbd3ce] hover:bg-[#f7f5ef]"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Discover Peers ({suggestions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pending")}
            className={`text-xs px-3.5 py-2 rounded-[2px] border font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "pending"
                ? "bg-[#173a35] text-white border-[#173a35]"
                : "bg-white text-[#62736b] border-[#cbd3ce] hover:bg-[#f7f5ef]"
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
            className={`text-xs px-3.5 py-2 rounded-[2px] border font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "connections"
                ? "bg-[#173a35] text-white border-[#173a35]"
                : "bg-white text-[#62736b] border-[#cbd3ce] hover:bg-[#f7f5ef]"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>My Connections ({connectedStudents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("following")}
            className={`text-xs px-3.5 py-2 rounded-[2px] border font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "following"
                ? "bg-[#173a35] text-white border-[#173a35]"
                : "bg-white text-[#62736b] border-[#cbd3ce] hover:bg-[#f7f5ef]"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Following ({followingStudents.length})</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-[2px] border border-[#cbd3ce] p-3 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#728078] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by student name, major, skill (e.g. PyTorch), or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f7f5ef] border border-[#cbd3ce] rounded-[2px] focus:outline-none focus:border-[#173a35] focus:bg-white text-[#242b29]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#728078] shrink-0" />
          <select
            value={selectedInstitution}
            onChange={(e) => setSelectedInstitution(e.target.value)}
            className="text-xs bg-[#f7f5ef] border border-[#cbd3ce] rounded-[2px] px-2.5 py-1.5 text-[#242b29] focus:outline-none cursor-pointer w-full sm:w-auto"
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
        <div className="bg-white rounded-[2px] border border-[#cbd3ce] p-10 text-center text-[#62736b]">
          <Users className="w-8 h-8 text-[#87978f] mx-auto mb-2" />
          <p className="font-bold text-sm text-[#173a35]">
            No students found in this view.
          </p>
          <p className="text-xs mt-1">
            Try adjusting your search query or university filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentList.map((student) => {
            const isReceived = student.connectionStatus === "pending_received"
            const isSent = student.connectionStatus === "pending_sent"
            const isConn = student.connectionStatus === "connected"

            return (
              <div
                key={student.id}
                className="bg-white rounded-[2px] border border-[#cbd3ce] overflow-hidden flex flex-col justify-between"
              >
                {/* Mini header */}
                <div>
                  <div className="h-16 bg-[#e2e8e3] relative">
                    {student.coverImage && (
                      <img
                        src={student.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover opacity-60"
                      />
                    )}
                  </div>
                  <div className="px-4 pb-3 pt-0 relative">
                    <button
                      type="button"
                      onClick={() => onSelectStudentProfile(student.id)}
                      className="inline-block -mt-8 focus:outline-none"
                    >
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-16 h-16 rounded-[2px] object-cover border-2 border-white bg-white"
                      />
                    </button>

                    <div className="mt-1">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => onSelectStudentProfile(student.id)}
                          className="font-bold text-sm text-[#173a35] hover:underline truncate text-left"
                        >
                          {student.name}
                        </button>
                        {isConn && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#dce8df] text-[#173a35] rounded-[2px] font-semibold border border-[#b8c9bd]">
                            Connected
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#242b29] mt-0.5 line-clamp-2 leading-tight">
                        {student.headline}
                      </p>

                      <div className="flex items-center gap-1.5 text-[11px] text-[#62736b] mt-2">
                        <Building className="w-3 h-3 text-[#173a35] shrink-0" />
                        <span className="truncate">{student.institution}</span>
                      </div>

                      {student.location && (
                        <div className="flex items-center gap-1.5 text-[11px] text-[#728078] mt-1">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{student.location}</span>
                        </div>
                      )}

                      {/* Top skills pills */}
                      {student.skills && student.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3 pt-2.5 border-t border-[#eef2ef]">
                          {student.skills.slice(0, 3).map((sk, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-1.5 py-0.5 bg-[#f7f5ef] border border-[#d8ddd8] rounded-[2px] text-[#4d5b54]"
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
                <div className="p-3 bg-[#f0ede6] border-t border-[#cbd3ce] flex items-center justify-between gap-2">
                  {isReceived ? (
                    <div className="flex items-center gap-1.5 w-full">
                      <button
                        type="button"
                        onClick={() => onAcceptConnection(student.id)}
                        className="flex-1 py-1.5 px-2 bg-[#173a35] text-white rounded-[2px] text-xs font-semibold hover:bg-[#0e2f2a] flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeclineConnection(student.id)}
                        className="py-1.5 px-2 bg-white border border-[#cbd3ce] text-[#62736b] hover:text-[#a33e32] rounded-[2px] text-xs"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : isSent ? (
                    <button
                      type="button"
                      onClick={() => onWithdrawConnection(student.id)}
                      className="w-full py-1.5 px-3 bg-white border border-[#cbd3ce] text-[#62736b] hover:text-[#a33e32] hover:border-[#a33e32] rounded-[2px] text-xs font-medium transition-colors"
                    >
                      Withdraw Request
                    </button>
                  ) : isConn ? (
                    <div className="flex items-center gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => onStartMessage(student.id)}
                        className="flex-1 py-1.5 px-3 bg-[#173a35] text-white rounded-[2px] text-xs font-semibold hover:bg-[#0e2f2a] flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Message</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleFollow(student.id)}
                        className={`px-2.5 py-1.5 border rounded-[2px] text-xs font-medium transition-colors ${
                          student.isFollowing
                            ? "bg-[#dce8df] text-[#173a35] border-[#173a35]"
                            : "bg-white text-[#62736b] border-[#cbd3ce]"
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
                        className="flex-1 py-1.5 px-3 bg-[#173a35] text-white rounded-[2px] text-xs font-semibold hover:bg-[#0e2f2a] flex items-center justify-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Connect</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleFollow(student.id)}
                        className={`px-2.5 py-1.5 border rounded-[2px] text-xs font-medium transition-colors ${
                          student.isFollowing
                            ? "bg-[#dce8df] text-[#173a35] border-[#173a35]"
                            : "bg-white text-[#62736b] border-[#cbd3ce]"
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
