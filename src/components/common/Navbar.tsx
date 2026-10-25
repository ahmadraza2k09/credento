import React, { useState, useRef, useEffect } from "react"
import {
  Home,
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  Search,
  User,
  LogOut,
  Shield,
  UserCheck,
  ChevronDown,
  X,
  ExternalLink,
  BookOpen,
} from "lucide-react"
import { BrandLogo } from "./BrandLogo"
import { StudentProfile } from "../../types"

export type NavTab =
  | "feed"
  | "network"
  | "opportunities"
  | "groups"
  | "messages"
  | "notifications"
  | "profile"
  | "search"

interface NavbarProps {
  currentTab: NavTab
  onSelectTab: (tab: NavTab) => void
  currentUser: StudentProfile
  allUsers: StudentProfile[]
  onSwitchUser: (userId: string) => void
  onSignOut: () => void
  onOpenBlockedModal: () => void
  unreadMessagesCount: number
  unreadNotificationsCount: number
  pendingRequestsCount: number
  onSearchSubmit: (query: string, category: string) => void
  onSelectStudentProfile?: (studentId: string) => void
}

export function Navbar({
  currentTab,
  onSelectTab,
  currentUser,
  allUsers,
  onSwitchUser,
  onSignOut,
  onOpenBlockedModal,
  unreadMessagesCount,
  unreadNotificationsCount,
  pendingRequestsCount,
  onSearchSubmit,
}: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchCategory, setSearchCategory] =
    useState<"all" | "students" | "opportunities" | "posts">("all")
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim(), searchCategory)
      onSelectTab("search")
      setMobileSearchOpen(false)
    }
  }

  const navItems = [
    {
      id: "feed" as NavTab,
      label: "Home",
      icon: Home,
      badge: 0,
    },
    {
      id: "network" as NavTab,
      label: "My Network",
      icon: Users,
      badge: pendingRequestsCount,
    },
    {
      id: "opportunities" as NavTab,
      label: "Opportunities",
      icon: Briefcase,
      badge: 0,
    },
    {
      id: "groups" as NavTab,
      label: "Communities",
      icon: BookOpen,
      badge: 0,
    },
    {
      id: "messages" as NavTab,
      label: "Messaging",
      icon: MessageSquare,
      badge: unreadMessagesCount,
    },
    {
      id: "notifications" as NavTab,
      label: "Notifications",
      icon: Bell,
      badge: unreadNotificationsCount,
    },
  ]

  return (
    <>
      {/* DESKTOP & MOBILE TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.04)] border-b border-black/[0.04]">
        <div className="max-w-7xl mx-auto px-3 sm:px-5">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
            {/* Left: Brand & Search */}
            <div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">
              <BrandLogo
                onClick={() => onSelectTab("feed")}
                compact={false}
                className="shrink-0"
              />

              {/* Desktop Global Search Field */}
              <form
                onSubmit={handleSearchSubmit}
                className="hidden md:flex items-center flex-1 max-w-md bg-[#f4f6f5] border border-black/[0.06] rounded-full shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04)] focus-within:bg-white focus-within:border-[#173a35] focus-within:ring-2 focus-within:ring-[#173a35]/15 transition-all overflow-hidden"
              >
                <div className="pl-3.5 pr-1.5 text-[#62736b]">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search students, skills, opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 px-1 text-xs text-[#242b29] placeholder-[#87978f] focus:outline-none bg-transparent"
                />
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value as any)}
                  className="text-[11px] font-medium text-[#62736b] bg-[#eef2f0] border-l border-black/[0.06] px-3 py-2 rounded-r-full focus:outline-none hover:text-[#173a35] cursor-pointer"
                  aria-label="Search filter category"
                >
                  <option value="all">All</option>
                  <option value="students">Students</option>
                  <option value="opportunities">Opportunities</option>
                  <option value="posts">Posts</option>
                </select>
              </form>
            </div>

            {/* Desktop Center/Right Navigation links */}
            <nav
              className="hidden lg:flex items-center gap-1.5"
              aria-label="Main Navigation"
            >
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = currentTab === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectTab(item.id)}
                    className={`relative flex flex-col items-center justify-center min-w-[74px] h-14 px-2.5 text-center rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? "text-[#173a35] font-semibold bg-[#e8ece9]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.03)]"
                        : "text-[#62736b] hover:text-[#173a35] hover:bg-[#f0f4f2]"
                    }`}
                  >
                    <div className="relative">
                      <Icon
                        className="w-5 h-5"
                        strokeWidth={isActive ? 2.2 : 1.8}
                      />
                      {item.badge > 0 && (
                        <span className="absolute -top-1.5 -right-2.5 bg-[#c46b4b] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[17px] text-center shadow-sm">
                          {item.badge > 9 ? "9+" : item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] mt-1 tracking-tight leading-none">
                      {item.label}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-1 left-4 right-4 h-[2px] bg-[#173a35] rounded-full" />
                    )}
                  </button>
                )
              })}
            </nav>

            {/* Right actions: Search icon (mobile), notifications (mobile), & Profile dropdown */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Mobile search toggle */}
              <button
                type="button"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-[#242b29] hover:bg-black/5 transition-colors focus:outline-none"
                aria-label="Toggle search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Mobile Notification Shortcut */}
              <button
                type="button"
                onClick={() => onSelectTab("notifications")}
                className="lg:hidden relative w-10 h-10 rounded-full flex items-center justify-center text-[#242b29] hover:bg-black/5 transition-colors focus:outline-none"
                aria-label={`Notifications ${
                  unreadNotificationsCount > 0
                    ? `(${unreadNotificationsCount} unread)`
                    : ""
                }`}
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#c46b4b] rounded-full ring-2 ring-white" />
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#173a35]/20 cursor-pointer"
                  aria-expanded={profileDropdownOpen}
                  aria-haspopup="true"
                  aria-label="User account menu"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full border border-black/10 shadow-sm object-cover bg-[#dce8df]"
                  />
                  <div className="hidden xl:flex flex-col text-left">
                    <span className="text-xs font-semibold text-[#173a35] max-w-[90px] truncate leading-tight">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-[#62736b] truncate leading-none">
                      Me
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#62736b] shrink-0" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-76 bg-white rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.06] py-2 z-50 text-xs overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
                    {/* User summary card in dropdown */}
                    <div className="px-4 py-3 bg-[#f8faf9] border-b border-black/[0.04]">
                      <div className="flex items-center gap-3">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-11 h-11 rounded-full shadow-sm border border-black/10 object-cover"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-[#173a35] truncate">
                            {currentUser.name}
                          </p>
                          <p className="text-[11px] text-[#62736b] truncate">
                            {currentUser.institution}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab("profile")
                          setProfileDropdownOpen(false)
                        }}
                        className="btn-3d-secondary mt-3 w-full py-1.5 px-3 text-center text-xs font-semibold cursor-pointer"
                      >
                        View Full Profile
                      </button>
                    </div>

                    {/* Quick Demo Student Switcher */}
                    <div className="px-3 py-2.5 border-b border-black/[0.04]">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#4d5b54] px-1 mb-1.5 uppercase tracking-wider">
                        <span>Switch Perspective</span>
                        <UserCheck className="w-3.5 h-3.5 text-[#c46b4b]" />
                      </div>
                      <p className="text-[10px] text-[#728078] px-1 mb-2">
                        Test networking and messaging from another student:
                      </p>
                      <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                        {allUsers.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => {
                              onSwitchUser(user.id)
                              setProfileDropdownOpen(false)
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left transition-all cursor-pointer ${
                              user.id === currentUser.id
                                ? "bg-[#dce8df] text-[#173a35] font-semibold shadow-sm"
                                : "text-[#242b29] hover:bg-[#f0f4f2]"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-6 h-6 rounded-full object-cover shrink-0 shadow-xs"
                              />
                              <span className="truncate">{user.name}</span>
                            </div>
                            <span className="text-[10px] text-[#728078] shrink-0 ml-1">
                              {user.institution.split(" ")[0]}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Secondary menu items */}
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          onOpenBlockedModal()
                          setProfileDropdownOpen(false)
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-[#242b29] hover:bg-[#f0f4f2] transition-colors text-left cursor-pointer"
                      >
                        <Shield className="w-4 h-4 text-[#62736b]" />
                        <span>Safety, Blocked Accounts & Privacy</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSignOut()
                          setProfileDropdownOpen(false)
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-[#a33e32] hover:bg-[#fdf2f2] transition-colors text-left font-medium cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out of Credento</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile search expanded panel */}
          {mobileSearchOpen && (
            <div className="md:hidden py-3 border-t border-black/[0.06] animate-in slide-in-from-top-2 duration-150">
              <form
                onSubmit={handleSearchSubmit}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center bg-[#f4f6f5] border border-black/10 rounded-full px-3.5 py-2 shadow-inner">
                  <Search className="w-4 h-4 text-[#62736b] mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search students, skills, opportunities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs text-[#242b29] focus:outline-none bg-transparent"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-[#62736b] hover:text-[#173a35]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    {([
                      "all",
                      "students",
                      "opportunities",
                      "posts",
                    ] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSearchCategory(cat)}
                        className={`text-[11px] capitalize px-3 py-1 rounded-full border transition-all whitespace-nowrap ${
                          searchCategory === cat
                            ? "bg-[#173a35] text-white border-[#173a35] shadow-xs"
                            : "bg-white text-[#62736b] border-black/10 hover:bg-[#f0f4f2]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <button
                    type="submit"
                    className="btn-3d-primary px-3.5 py-1 text-xs font-semibold shrink-0 rounded-full"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR (FIXED, 48px+ touch targets, thumb-friendly) */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/[0.06] shadow-[0_-2px_12px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)]"
        aria-label="Mobile Navigation"
      >
        <div className="grid grid-cols-6 h-14">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentTab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`relative flex flex-col items-center justify-center h-full active:bg-[#f0f4f2] transition-colors focus:outline-none ${
                  isActive ? "text-[#173a35]" : "text-[#62736b]"
                }`}
              >
                <div className="relative">
                  <Icon
                    className="w-5 h-5"
                    strokeWidth={isActive ? 2.3 : 1.8}
                  />
                  {item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#c46b4b] text-white text-[9px] font-bold px-1 rounded-full min-w-[15px] h-[15px] flex items-center justify-center leading-none shadow-xs">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] mt-1 leading-none ${
                    isActive ? "font-bold text-[#173a35]" : "font-medium"
                  }`}
                >
                  {item.label === "My Network"
                    ? "Network"
                    : item.label === "Opportunities"
                      ? "Jobs"
                      : item.label === "Communities"
                        ? "Circles"
                        : item.label}
                </span>
                {isActive && (
                  <span className="absolute top-0 left-4 right-4 h-[2px] bg-[#173a35] rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
