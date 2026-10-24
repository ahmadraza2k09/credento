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
} from "lucide-react"
import { BrandLogo } from "./BrandLogo"
import { StudentProfile } from "../../types"

export type NavTab = "feed" | "network" | "opportunities" | "messages" | "notifications" | "profile" | "search"

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
      <header className="sticky top-0 z-40 bg-[#f7f5ef] border-b border-[#cbd3ce] shadow-[0_1px_3px_rgba(23,58,53,0.05)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-5">
          <div className="flex items-center justify-between h-15 gap-2 sm:gap-4">
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
                className="hidden md:flex items-center flex-1 max-w-md bg-white border border-[#cbd3ce] rounded-md focus-within:border-[#173a35] focus-within:ring-1 focus-within:ring-[#173a35] transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]"
              >
                <div className="pl-3 pr-1 text-[#62736b]">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search students, skills, opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-1.5 px-1 text-xs text-[#242b29] placeholder-[#87978f] focus:outline-none bg-transparent"
                />
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value as any)}
                  className="text-[11px] font-medium text-[#62736b] bg-[#f7f5ef] border-l border-[#d8ddd8] px-2 py-1.5 rounded-r-md focus:outline-none hover:text-[#173a35] cursor-pointer"
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
              className="hidden lg:flex items-center gap-1 sm:gap-1.5"
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
                    className={`relative flex flex-col items-center justify-center min-w-[72px] h-14 px-2 text-center rounded-sm transition-colors ${
                      isActive
                        ? "text-[#173a35] font-semibold"
                        : "text-[#62736b] hover:text-[#173a35] hover:bg-[#e8ece9]/50"
                    }`}
                  >
                    <div className="relative">
                      <Icon
                        className="w-5 h-5"
                        strokeWidth={isActive ? 2.2 : 1.8}
                      />
                      {item.badge > 0 && (
                        <span className="absolute -top-1.5 -right-2.5 bg-[#c46b4b] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[17px] text-center shadow-xs">
                          {item.badge > 9 ? "9+" : item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] mt-1 tracking-tight leading-none">
                      {item.label}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#173a35] rounded-t-sm" />
                    )}
                  </button>
                )
              })}
            </nav>

            {/* Right actions: Search icon (mobile), notifications (mobile), & Profile dropdown */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Mobile search toggle */}
              <button
                type="button"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="md:hidden w-10 h-10 rounded flex items-center justify-center text-[#242b29] hover:bg-[#e2e8e3] transition-colors focus:outline-none"
                aria-label="Toggle search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Mobile Notification Shortcut */}
              <button
                type="button"
                onClick={() => onSelectTab("notifications")}
                className="lg:hidden relative w-10 h-10 rounded flex items-center justify-center text-[#242b29] hover:bg-[#e2e8e3] transition-colors focus:outline-none"
                aria-label={`Notifications ${
                  unreadNotificationsCount > 0
                    ? `(${unreadNotificationsCount} unread)`
                    : ""
                }`}
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#c46b4b] rounded-full ring-2 ring-[#f7f5ef]" />
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-md hover:bg-[#e8ece9] transition-colors focus:outline-none focus:ring-2 focus:ring-[#173a35]"
                  aria-expanded={profileDropdownOpen}
                  aria-haspopup="true"
                  aria-label="User account menu"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded border border-[#cbd3ce] object-cover bg-[#dce8df]"
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
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-md border border-[#cbd3ce] shadow-xl py-2 z-50 text-xs animate-in fade-in-50 zoom-in-95 duration-100">
                    {/* User summary card in dropdown */}
                    <div className="px-4 py-3 border-b border-[#eef2ef] bg-[#f7f5ef]/60">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-10 h-10 rounded border border-[#cbd3ce] object-cover"
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
                        className="mt-3 w-full py-1.5 px-3 text-center font-medium text-[#173a35] bg-white border border-[#173a35] rounded hover:bg-[#173a35] hover:text-white transition-colors"
                      >
                        View Full Profile
                      </button>
                    </div>

                    {/* Quick Demo Student Switcher */}
                    <div className="px-3 py-2 border-b border-[#eef2ef]">
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
                            className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors ${
                              user.id === currentUser.id
                                ? "bg-[#dce8df] text-[#173a35] font-semibold"
                                : "text-[#242b29] hover:bg-[#f7f5ef]"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-5 h-5 rounded-full object-cover shrink-0"
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
                        className="w-full flex items-center gap-2 px-4 py-2 text-[#242b29] hover:bg-[#f7f5ef] transition-colors text-left"
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
                        className="w-full flex items-center gap-2 px-4 py-2 text-[#a33e32] hover:bg-[#fdf2f2] transition-colors text-left font-medium"
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
            <div className="md:hidden py-3 border-t border-[#cbd3ce] animate-in slide-in-from-top-2 duration-150">
              <form
                onSubmit={handleSearchSubmit}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center bg-white border border-[#cbd3ce] rounded-md px-3 py-2 shadow-xs">
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
                  <div className="flex items-center gap-1 overflow-x-auto py-1">
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
                        className={`text-[11px] capitalize px-2.5 py-1 rounded border transition-colors whitespace-nowrap ${
                          searchCategory === cat
                            ? "bg-[#173a35] text-white border-[#173a35]"
                            : "bg-white text-[#62736b] border-[#cbd3ce]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#173a35] text-white rounded text-xs font-semibold shrink-0"
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
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#cbd3ce] shadow-[0_-2px_6px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)]"
        aria-label="Mobile Navigation"
      >
        <div className="grid grid-cols-5 h-14">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentTab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`relative flex flex-col items-center justify-center h-full active:bg-[#f7f5ef] transition-colors focus:outline-none ${
                  isActive ? "text-[#173a35]" : "text-[#62736b]"
                }`}
              >
                <div className="relative">
                  <Icon
                    className="w-5 h-5"
                    strokeWidth={isActive ? 2.3 : 1.8}
                  />
                  {item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#c46b4b] text-white text-[9px] font-bold px-1 rounded-full min-w-[15px] h-[15px] flex items-center justify-center leading-none">
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
                      : item.label}
                </span>
                {isActive && (
                  <span className="absolute top-0 left-4 right-4 h-[2px] bg-[#c46b4b]" />
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
