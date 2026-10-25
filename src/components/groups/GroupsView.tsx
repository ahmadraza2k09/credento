import React, { useState, useMemo } from "react"
import {
  Users,
  Search,
  Plus,
  BookOpen,
  Calendar,
  Sparkles,
  Check,
  Tag,
  Building,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
} from "lucide-react"
import { GroupCategory, StudentProfile, StudyGroup } from "../../types"
import { Modal } from "../common/Modal"

interface GroupsViewProps {
  groups: StudyGroup[]
  currentUser: StudentProfile
  onToggleJoinGroup: (groupId: string) => void
  onCreateGroup: (
    group: Omit<StudyGroup, "id" | "memberCount" | "isJoined">,
  ) => void
}

export function GroupsView({
  groups,
  currentUser,
  onToggleJoinGroup,
  onCreateGroup,
}: GroupsViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null)

  // Form state for creating a new group
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupCategory, setNewGroupCategory] =
    useState<GroupCategory>("Study Circle")
  const [newGroupInstitution, setNewGroupInstitution] = useState(
    currentUser.institution,
  )
  const [newGroupDescription, setNewGroupDescription] = useState("")
  const [newGroupTags, setNewGroupTags] = useState("")
  const [newGroupMeeting, setNewGroupMeeting] = useState("")

  const categories: { id: string; label: string }[] = [
    { id: "all", label: "All Communities" },
    { id: "my-groups", label: "My Communities" },
    { id: "Research Lab", label: "Research Labs" },
    { id: "Study Circle", label: "Study Circles" },
    { id: "Student Chapter", label: "Student Chapters" },
    { id: "Competition Team", label: "Competition Teams" },
  ]

  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      const matchesSearch =
        !searchQuery ||
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory =
        selectedCategory === "all"
          ? true
          : selectedCategory === "my-groups"
            ? g.isJoined
            : g.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [groups, searchQuery, selectedCategory])

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGroupName.trim() || !newGroupDescription.trim()) return

    const tagsArray = newGroupTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    onCreateGroup({
      name: newGroupName.trim(),
      category: newGroupCategory,
      institution: newGroupInstitution.trim() || currentUser.institution,
      description: newGroupDescription.trim(),
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
        newGroupName,
      )}&backgroundColor=173a35`,
      coverImage:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
      tags: tagsArray.length > 0 ? tagsArray : ["Academics", "Student Research"],
      meetingSchedule: newGroupMeeting.trim() || "Weekly (Schedule TBD)",
      leadName: currentUser.name,
      recentDiscussion: "Welcoming founding members to the circle!",
    })

    setNewGroupName("")
    setNewGroupDescription("")
    setNewGroupTags("")
    setNewGroupMeeting("")
    setIsCreateModalOpen(false)
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-5 py-5 sm:py-8 space-y-6">
      {/* Banner & Action Header */}
      <div className="card-linkedin p-6 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf6f0] text-[#173a35] text-xs font-semibold mb-2.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Campus Academic Communities</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#173a35] tracking-tight">
              Collegiate Circles & Research Labs
            </h1>
            <p className="text-xs sm:text-sm text-[#62736b] mt-1.5 max-w-2xl leading-relaxed">
              Connect with peer-led study groups, campus competition teams, and
              inter-university research labs to collaborate beyond the classroom.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-3d-primary flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Start a Community</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-6 pt-5 border-t border-black/[0.05] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#87978f] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by topic, lab name, or skill tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#f4f6f5] rounded-full focus:outline-none focus:bg-white border border-black/10 text-[#242b29] shadow-inner transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? "btn-3d-primary text-white"
                    : "bg-[#f4f6f5] text-[#62736b] hover:bg-[#e8eee9] hover:text-[#173a35]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Communities Grid */}
      {filteredGroups.length === 0 ? (
        <div className="card-linkedin p-12 text-center text-[#62736b]">
          <BookOpen className="w-10 h-10 text-[#87978f] mx-auto mb-3 opacity-40" />
          <p className="font-bold text-base text-[#173a35]">
            No communities found
          </p>
          <p className="text-xs mt-1 max-w-sm mx-auto">
            Try adjusting your search filters or be the first to start a new
            academic circle for your university!
          </p>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-3d-primary mt-4 px-4 py-2 text-xs font-semibold"
          >
            Start a Community
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className="card-linkedin card-linkedin-hover flex flex-col justify-between overflow-hidden group border-0"
            >
              <div>
                {/* Cover Image */}
                <div className="h-28 w-full bg-[#173a35]/10 relative overflow-hidden">
                  {group.coverImage ? (
                    <img
                      src={group.coverImage}
                      alt={group.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#173a35] opacity-20" />
                  )}
                  <div className="absolute top-2.5 right-2.5">
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white/95 text-[#173a35] shadow-xs">
                      {group.category}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 pt-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={group.avatar}
                      alt={group.name}
                      className="w-11 h-11 rounded-xl object-cover -mt-7 bg-white shadow-md border-2 border-white shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3
                        onClick={() => setSelectedGroup(group)}
                        className="font-bold text-sm sm:text-base text-[#173a35] hover:underline cursor-pointer leading-tight truncate"
                      >
                        {group.name}
                      </h3>
                      <p className="text-[11px] text-[#62736b] flex items-center gap-1 mt-0.5 truncate">
                        <Building className="w-3 h-3 shrink-0" />
                        <span>{group.institution}</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[#242b29] mt-3 line-clamp-2 leading-relaxed">
                    {group.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {group.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 bg-[#f4f6f5] text-[#52635b] rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                    {group.tags.length > 3 && (
                      <span className="text-[10px] text-[#87978f] self-center">
                        +{group.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Schedule or Lead info */}
                  {group.meetingSchedule && (
                    <div className="mt-3.5 p-2.5 bg-[#f8faf9] rounded-xl text-[11px] text-[#62736b] flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#173a35] shrink-0" />
                      <span className="truncate">{group.meetingSchedule}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Members & Join Action */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-black/[0.05] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#62736b] font-medium">
                    <Users className="w-3.5 h-3.5" />
                    <span>{group.memberCount} members</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleJoinGroup(group.id)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                      group.isJoined
                        ? "btn-3d-secondary flex items-center gap-1 text-[#173a35]"
                        : "btn-3d-primary flex items-center gap-1 text-white"
                    }`}
                  >
                    {group.isJoined ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Joined</span>
                      </>
                    ) : (
                      <span>Join</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Community Detail Modal */}
      {selectedGroup && (
        <Modal
          isOpen={Boolean(selectedGroup)}
          onClose={() => setSelectedGroup(null)}
          title={selectedGroup.name}
          subtitle={`${selectedGroup.category} • ${selectedGroup.institution}`}
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5 text-xs text-[#62736b]">
                <Users className="w-4 h-4 text-[#173a35]" />
                <span className="font-semibold text-[#173a35]">
                  {selectedGroup.memberCount} active collegiate members
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGroup(null)}
                  className="px-4 py-2 text-xs text-[#62736b] hover:text-[#242b29] font-medium"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onToggleJoinGroup(selectedGroup.id)
                    setSelectedGroup((prev) =>
                      prev
                        ? {
                            ...prev,
                            isJoined: !prev.isJoined,
                            memberCount: !prev.isJoined
                              ? prev.memberCount + 1
                              : Math.max(1, prev.memberCount - 1),
                          }
                        : null,
                    )
                  }}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    selectedGroup.isJoined ? "btn-3d-secondary" : "btn-3d-primary"
                  }`}
                >
                  {selectedGroup.isJoined ? "Leave Community" : "Join Community"}
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-xs text-[#242b29]">
            {/* Overview */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#173a35] mb-1.5">
                About this Academic Circle
              </h4>
              <p className="leading-relaxed text-[#4d5b54] bg-[#f8faf9] p-3.5 rounded-xl border border-black/[0.04]">
                {selectedGroup.description}
              </p>
            </div>

            {/* Meeting Schedule & Leadership */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-[#f8faf9] rounded-xl border border-black/[0.04]">
                <span className="font-bold text-[#173a35] block mb-1">
                  Meeting Schedule
                </span>
                <p className="text-[#62736b]">
                  {selectedGroup.meetingSchedule || "Weekly session"}
                </p>
              </div>
              <div className="p-3 bg-[#f8faf9] rounded-xl border border-black/[0.04]">
                <span className="font-bold text-[#173a35] block mb-1">
                  Circle Lead / Organizer
                </span>
                <p className="text-[#62736b]">
                  {selectedGroup.leadName || "Academic Coordinator"}
                </p>
              </div>
            </div>

            {/* Recent Discussion */}
            {selectedGroup.recentDiscussion && (
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#173a35] mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Current Research Discussion</span>
                </h4>
                <div className="p-3 bg-[#edf6f0] border border-[#d2e8d9] rounded-xl text-[#173a35] font-medium">
                  "{selectedGroup.recentDiscussion}"
                </div>
              </div>
            )}

            {/* Community Values */}
            <div className="flex items-center gap-2 p-3 bg-[#f7f5ef] rounded-xl text-[#62736b] text-[11px]">
              <ShieldCheck className="w-4 h-4 text-[#173a35] shrink-0" />
              <span>
                Verified university members only. All discussions adhere to
                Credento Academic Integrity and Collaborative Research oaths.
              </span>
            </div>
          </div>
        </Modal>
      )}

      {/* Start Community Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Start a Collegiate Community"
        subtitle="Establish a new study group, research lab circle, or student society"
        maxWidth="lg"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-xs text-[#62736b] hover:text-[#242b29] font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateGroupSubmit}
              className="btn-3d-primary px-5 py-2 text-xs font-semibold"
            >
              Launch Community
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateGroupSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#173a35] mb-1.5">
              Community / Circle Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Berkeley Quantum Hardware Working Group"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173a35]/20 focus:border-[#173a35]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold text-[#173a35] mb-1.5">
                Category *
              </label>
              <select
                value={newGroupCategory}
                onChange={(e) =>
                  setNewGroupCategory(e.target.value as GroupCategory)
                }
                className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173a35]/20 focus:border-[#173a35]"
              >
                <option value="Study Circle">Study Circle</option>
                <option value="Research Lab">Research Lab</option>
                <option value="Student Chapter">Student Chapter</option>
                <option value="Competition Team">Competition Team</option>
                <option value="Club">Academic Club</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#173a35] mb-1.5">
                Institution / Chapter Affiliation
              </label>
              <input
                type="text"
                placeholder="e.g. MIT / Inter-University"
                value={newGroupInstitution}
                onChange={(e) => setNewGroupInstitution(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173a35]/20 focus:border-[#173a35]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#173a35] mb-1.5">
              Mission & Collaboration Scope *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe what your group works on, project objectives, and who should join..."
              value={newGroupDescription}
              onChange={(e) => setNewGroupDescription(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173a35]/20 focus:border-[#173a35]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold text-[#173a35] mb-1.5">
                Key Topics / Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Machine Learning, Hardware, Paper Reading"
                value={newGroupTags}
                onChange={(e) => setNewGroupTags(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173a35]/20 focus:border-[#173a35]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#173a35] mb-1.5">
                Meeting / Sync Schedule
              </label>
              <input
                type="text"
                placeholder="e.g. Thursdays @ 6 PM (Hybrid / Room 204)"
                value={newGroupMeeting}
                onChange={(e) => setNewGroupMeeting(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173a35]/20 focus:border-[#173a35]"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}
