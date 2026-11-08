import React, { useState, useMemo } from "react"
import {
  AccessCenterOrganization,
  AccessCenterService,
  ServiceRequest,
  StudentProfile,
} from "../../types"
import {
  Building,
  Globe,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Plus,
  Clock,
  HeartHandshake,
  Layers,
  HelpCircle,
  Briefcase,
  GraduationCap,
} from "lucide-react"
import { AccessCenterDetailModal } from "./AccessCenterDetailModal"
import { OrganizationApplicationModal } from "./OrganizationApplicationModal"
import { UserServiceRequestsModal } from "./UserServiceRequestsModal"
import { OrganizationDashboardModal } from "./OrganizationDashboardModal"

interface AccessCenterViewProps {
  currentUser: StudentProfile | null
  centers: AccessCenterOrganization[]
  userRequests: ServiceRequest[]
  onSubmitApplication: (params: any) => void
  onSubmitServiceRequest: (params: any) => void
  onUpdateCenter: (
    centerId: string,
    updates: Partial<AccessCenterOrganization>,
  ) => void
  onAddService: (
    centerId: string,
    service: Omit<AccessCenterService, "id" | "centerId">,
  ) => void
  onUpdateService: (
    centerId: string,
    serviceId: string,
    updates: Partial<AccessCenterService>,
  ) => void
  onDeleteService: (centerId: string, serviceId: string) => void
  onUpdateRequestStatus: (
    requestId: string,
    status: any,
    orgNotes?: string,
  ) => void
}

export function AccessCenterView({
  currentUser,
  centers,
  userRequests,
  onSubmitApplication,
  onSubmitServiceRequest,
  onUpdateCenter,
  onAddService,
  onUpdateService,
  onDeleteService,
  onUpdateRequestStatus,
}: AccessCenterViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<string>("all")

  // Modals
  const [selectedCenterForDetail, setSelectedCenterForDetail] =
    useState<AccessCenterOrganization | null>(null)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [isMyRequestsModalOpen, setIsMyRequestsModalOpen] = useState(false)
  const [selectedCenterForOrgDashboard, setSelectedCenterForOrgDashboard] =
    useState<AccessCenterOrganization | null>(null)

  // Filter approved centers
  const approvedCenters = useMemo(() => {
    return centers.filter((c) => c.status === "approved")
  }, [centers])

  // Filtered centers
  const filteredCenters = useMemo(() => {
    return approvedCenters.filter((center) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesName = center.name.toLowerCase().includes(q)
        const matchesTagline = center.tagline.toLowerCase().includes(q)
        const matchesDesc = center.description.toLowerCase().includes(q)
        const matchesSvc = center.services.some(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q),
        )
        if (!matchesName && !matchesTagline && !matchesDesc && !matchesSvc) {
          return false
        }
      }

      // Category filter
      if (selectedCategory !== "all") {
        const hasCategory = center.services.some(
          (s) => s.category === selectedCategory,
        )
        if (!hasCategory) return false
      }

      // Beneficiary filter
      if (selectedBeneficiary !== "all") {
        const hasBeneficiary = center.targetBeneficiaries.some((b) =>
          b.toLowerCase().includes(selectedBeneficiary.toLowerCase()),
        )
        if (!hasBeneficiary) return false
      }

      return true
    })
  }, [approvedCenters, searchQuery, selectedCategory, selectedBeneficiary])

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-5 py-5 sm:py-8 space-y-6">
      {/* 1. HERO ECOSYSTEM BANNER */}
      <div className="rounded-2xl bg-[#173a35] text-white p-6 sm:p-8 border border-black/10">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] font-medium text-[#f7f5ef] tracking-wide uppercase border border-white/15">
            <HeartHandshake className="w-3.5 h-3.5 text-[#c46b4b]" />
            <span>Credento Free Access Ecosystem</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Credento Access Center
          </h1>

          <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-normal">
            Organizations provide free services → Credento makes those services
            discoverable and accessible. Verified NGOs, institutions, and
            coalitions offering free website creation, digital assistance, and
            consulting.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {currentUser && (
              <button
                type="button"
                onClick={() => setIsMyRequestsModalOpen(true)}
                className="btn-3d-secondary bg-white text-[#173a35] px-4 py-2 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm hover:bg-[#f8faf9]"
              >
                <Clock className="w-4 h-4 text-[#173a35]" />
                <span>My Service Requests</span>
                {userRequests.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#173a35] text-white text-[10px] font-mono font-bold">
                    {userRequests.length}
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsApplyModalOpen(true)}
              className="btn-3d-primary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Apply to Create an Access Center</span>
            </button>

            {/* Quick switcher for organization managers to open their center dashboard */}
            {approvedCenters.length > 0 && (
              <div className="relative inline-block">
                <select
                  onChange={(e) => {
                    const c = approvedCenters.find(
                      (item) => item.id === e.target.value,
                    )
                    if (c) setSelectedCenterForOrgDashboard(c)
                  }}
                  value=""
                  className="bg-white/15 hover:bg-white/20 text-white text-xs px-3 py-2 rounded-xl border border-white/20 cursor-pointer focus:outline-none"
                >
                  <option value="" disabled className="text-black">
                    Organization Portals ▾
                  </option>
                  {approvedCenters.map((c) => (
                    <option key={c.id} value={c.id} className="text-black">
                      Manage {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Decorative corner seal */}
        <div className="hidden lg:block absolute right-8 bottom-8 text-right text-xs text-white/50 space-y-1">
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 rounded-full text-white/80 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1b6b47]" />
            <span>100% Free Public Services</span>
          </div>
          <p className="text-[10px]">No hidden commercial charges</p>
        </div>
      </div>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <div className="card-linkedin p-4 sm:p-5 space-y-3.5">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#62736b] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search free services, website creation, consulting, organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#f8faf9] rounded-xl text-xs text-[#242b29] border border-black/[0.06] focus:outline-none focus:border-[#173a35] focus:bg-white transition-all shadow-inner"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-auto px-3 py-2.5 bg-white border border-black/10 rounded-xl text-xs text-[#242b29] focus:outline-none focus:border-[#173a35]"
            >
              <option value="all">All Service Categories</option>
              <option value="digital_tech">Digital Setup & Technology</option>
              <option value="consulting_guidance">
                Consulting & Awareness
              </option>
              <option value="education">Education & Workshops</option>
              <option value="health_wellbeing">Healthcare & Clinics</option>
              <option value="community_support">Community & Non-profit</option>
            </select>

            {/* Beneficiary Filter */}
            <select
              value={selectedBeneficiary}
              onChange={(e) => setSelectedBeneficiary(e.target.value)}
              className="w-full md:w-auto px-3 py-2.5 bg-white border border-black/10 rounded-xl text-xs text-[#242b29] focus:outline-none focus:border-[#173a35]"
            >
              <option value="all">All Beneficiaries</option>
              <option value="Students">Students Only</option>
              <option value="Small Businesses">Small Businesses</option>
              <option value="Schools">Schools & Educators</option>
              <option value="Hospitals">Hospitals & Clinics</option>
              <option value="Community">Community Initiatives</option>
            </select>
          </div>
        </div>

        {/* Quick category pills */}
        <div className="flex flex-wrap gap-1.5 pt-1 text-xs">
          <span className="text-[11px] font-bold text-[#173a35] py-1 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#c46b4b]" />
            Focus Areas:
          </span>
          {[
            { id: "all", label: "All Access Centers" },
            { id: "digital_tech", label: "Digitizing For All" },
            {
              id: "consulting_guidance",
              label: "Free Consulting & Mentorship",
            },
            { id: "education", label: "Educational Guidance" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#173a35] text-white"
                  : "bg-[#f4f6f5] text-[#62736b] hover:bg-[#eef2f0] hover:text-[#173a35]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. ACCESS CENTERS DIRECTORY */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#173a35]">
              Approved Access Centers
            </h2>
            <p className="text-xs text-[#62736b]">
              Discover organizations offering verified free services to empower
              your student or community journey.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#173a35]">
            {filteredCenters.length} Centers Active
          </span>
        </div>

        {filteredCenters.length === 0 ? (
          <div className="card-linkedin p-12 text-center text-[#62736b]">
            <Building className="w-10 h-10 text-[#87978f] mx-auto mb-2.5" />
            <p className="font-bold text-base text-[#173a35]">
              No Access Centers match your filter.
            </p>
            <p className="text-xs mt-1 max-w-sm mx-auto">
              Try switching back to "All Service Categories" or apply to create
              an Access Center for your organization.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all")
                setSelectedBeneficiary("all")
                setSearchQuery("")
              }}
              className="btn-3d-secondary mt-3 px-4 py-1.5 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCenters.map((center) => (
              <div
                key={center.id}
                className="card-linkedin card-linkedin-hover overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Banner & Logo */}
                  <div className="h-28 bg-gradient-to-r from-[#173a35] to-[#255049] relative p-4 flex items-end">
                    {center.coverImage && (
                      <img
                        src={center.coverImage}
                        alt={center.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                      />
                    )}
                    <span className="relative z-10 px-2.5 py-0.5 rounded-full bg-white/95 text-[10px] font-bold text-[#173a35] shadow-xs uppercase tracking-wider">
                      {center.type.replace("_", " ")}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6 pb-4">
                    <div className="flex items-start gap-3.5 mb-3">
                      <img
                        src={center.logo}
                        alt={center.name}
                        className="w-14 h-14 rounded-2xl object-cover p-1 bg-white border border-black/10 shadow-sm shrink-0 -mt-10 relative z-10"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-bold text-base text-[#173a35] leading-snug">
                            {center.name}
                          </h3>
                          <span
                            className="inline-flex items-center gap-0.5 text-[#1b6b47] text-[10px] font-bold"
                            title="Verified Credento Organization"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Verified</span>
                          </span>
                        </div>
                        <p className="text-xs text-[#c46b4b] font-medium mt-0.5 line-clamp-1">
                          {center.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Mission Quote */}
                    <p className="text-xs text-[#4d5b54] italic leading-relaxed bg-[#f8faf9] p-3 rounded-xl border border-black/[0.04] mb-3.5">
                      "{center.mission}"
                    </p>

                    {/* Services Offered preview */}
                    <div className="space-y-1.5 mb-4">
                      <p className="text-[11px] font-bold text-[#173a35] uppercase tracking-wider">
                        Available Free Services ({center.services.length}):
                      </p>
                      <div className="space-y-1">
                        {center.services.slice(0, 3).map((svc) => (
                          <div
                            key={svc.id}
                            className="flex items-center justify-between text-xs p-2 bg-[#f4f6f5] rounded-lg border border-black/[0.03]"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#1b6b47] shrink-0" />
                              <span className="font-semibold text-[#173a35] truncate">
                                {svc.title}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#1b6b47] font-bold font-mono shrink-0">
                              Free • {svc.leadTime}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Target Beneficiaries */}
                    <div className="flex flex-wrap gap-1">
                      {center.targetBeneficiaries.map((b, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-white border border-black/5 text-[#62736b] px-2 py-0.5 rounded font-medium"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 bg-[#f8faf9] border-t border-black/[0.04] flex items-center justify-between gap-3">
                  <div className="text-[11px] text-[#728078]">
                    <span>Mode: </span>
                    <strong className="capitalize text-[#173a35]">
                      {center.serviceDeliveryMode}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedCenterForDetail(center)}
                    className="btn-3d-primary flex items-center gap-1.5 px-4 py-2 text-xs font-semibold cursor-pointer"
                  >
                    <span>Explore Center & Request Services</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. MODALS */}
      {/* Center Detail & Request Services Modal */}
      {selectedCenterForDetail && (
        <AccessCenterDetailModal
          isOpen={!!selectedCenterForDetail}
          onClose={() => setSelectedCenterForDetail(null)}
          center={selectedCenterForDetail}
          currentUser={currentUser}
          onSubmitRequest={(params) => {
            onSubmitServiceRequest(params)
          }}
        />
      )}

      {/* Organization Application Modal */}
      <OrganizationApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmitApplication={onSubmitApplication}
      />

      {/* User Service Requests Tracker Modal */}
      <UserServiceRequestsModal
        isOpen={isMyRequestsModalOpen}
        onClose={() => setIsMyRequestsModalOpen(false)}
        requests={userRequests}
      />

      {/* Organization Dashboard Modal for Center Managers */}
      {selectedCenterForOrgDashboard && (
        <OrganizationDashboardModal
          isOpen={!!selectedCenterForOrgDashboard}
          onClose={() => setSelectedCenterForOrgDashboard(null)}
          center={selectedCenterForOrgDashboard}
          requests={userRequests.filter(
            (r) => r.centerId === selectedCenterForOrgDashboard.id,
          )}
          onUpdateCenter={onUpdateCenter}
          onAddService={onAddService}
          onUpdateService={onUpdateService}
          onDeleteService={onDeleteService}
          onUpdateRequestStatus={onUpdateRequestStatus}
        />
      )}
    </div>
  )
}
