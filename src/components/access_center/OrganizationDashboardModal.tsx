import React, { useState } from "react"
import { Modal } from "../common/Modal"
import {
  AccessCenterOrganization,
  AccessCenterService,
  ServiceRequest,
  ServiceRequestStatus,
} from "../../types"
import {
  Building,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  Save,
  MessageSquare,
  Users,
  Settings,
  Layers,
} from "lucide-react"

interface OrganizationDashboardModalProps {
  isOpen: boolean
  onClose: () => void
  center: AccessCenterOrganization
  requests: ServiceRequest[]
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
    status: ServiceRequestStatus,
    orgNotes?: string,
  ) => void
}

export function OrganizationDashboardModal({
  isOpen,
  onClose,
  center,
  requests,
  onUpdateCenter,
  onAddService,
  onUpdateService,
  onDeleteService,
  onUpdateRequestStatus,
}: OrganizationDashboardModalProps) {
  const [activeTab, setActiveTab] =
    useState<"requests" | "services" | "profile">("requests")

  // Selected request to update
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null,
  )
  const [newStatus, setNewStatus] =
    useState<ServiceRequestStatus>("under_review")
  const [statusNote, setStatusNote] = useState("")

  // New service state
  const [showAddServiceForm, setShowAddServiceForm] = useState(false)
  const [newSvcTitle, setNewSvcTitle] = useState("")
  const [newSvcDesc, setNewSvcDesc] = useState("")
  const [newSvcCategory, setNewSvcCategory] = useState<any>("digital_tech")
  const [newSvcLeadTime, setNewSvcLeadTime] = useState("3-5 business days")

  // Edit profile state
  const [desc, setDesc] = useState(center.description)
  const [mission, setMission] = useState(center.mission)
  const [phone, setPhone] = useState(center.phone)
  const [website, setWebsite] = useState(center.website)
  const [profileSaved, setProfileSaved] = useState(false)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateCenter(center.id, {
      description: desc,
      mission,
      phone,
      website,
    })
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2000)
  }

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSvcTitle.trim() || !newSvcDesc.trim()) return

    onAddService(center.id, {
      title: newSvcTitle.trim(),
      description: newSvcDesc.trim(),
      category: newSvcCategory,
      leadTime: newSvcLeadTime.trim(),
      targetBeneficiaries: ["Students", "Small Businesses", "Schools"],
      deliveryMode: "online",
      isFree: true,
      active: true,
    })

    setNewSvcTitle("")
    setNewSvcDesc("")
    setShowAddServiceForm(false)
  }

  const handleUpdateStatusSubmit = () => {
    if (!selectedRequest) return
    onUpdateRequestStatus(
      selectedRequest.id,
      newStatus,
      statusNote.trim() || undefined,
    )
    setSelectedRequest(null)
    setStatusNote("")
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${center.name} — Access Center Dashboard`}
      subtitle="Manage your community services, intake requests, and organization profile."
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] text-[#62736b]">
            Scope: Limited exclusively to {center.name}.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-3d-secondary px-5 py-2 text-xs font-semibold"
          >
            Close Dashboard
          </button>
        </div>
      }
    >
      <div className="space-y-5 text-xs max-h-[70vh] overflow-y-auto pr-1">
        {/* Navigation Tabs */}
        <div className="flex border-b border-black/[0.06] gap-2 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("requests")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === "requests"
                ? "bg-[#173a35] text-white"
                : "text-[#62736b] hover:bg-black/5"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Service Requests ({requests.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("services")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === "services"
                ? "bg-[#173a35] text-white"
                : "text-[#62736b] hover:bg-black/5"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Services Catalog ({center.services.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === "profile"
                ? "bg-[#173a35] text-white"
                : "text-[#62736b] hover:bg-black/5"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Center Information</span>
          </button>
        </div>

        {/* TAB 1: SERVICE REQUESTS */}
        {activeTab === "requests" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#173a35]">
                  Incoming Service Applications
                </h3>
                <p className="text-[#728078] text-[11px]">
                  Review student and community needs, approve applications, and
                  update status.
                </p>
              </div>
            </div>

            {requests.length === 0 ? (
              <div className="p-10 text-center text-xs text-[#62736b] bg-[#f8faf9] rounded-2xl">
                <Clock className="w-8 h-8 text-[#87978f] mx-auto mb-2" />
                <p className="font-bold text-sm text-[#173a35]">
                  No requests yet
                </p>
                <p className="mt-1">
                  When students or schools submit service requests, they will
                  appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl bg-white border border-black/[0.06] shadow-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#173a35]">
                            {req.serviceTitle}
                          </h4>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/5 text-[#4d5b54]">
                            {req.beneficiaryType}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#62736b] mt-0.5">
                          From: <strong>{req.requesterName}</strong> (
                          {req.requesterEmail}) •{" "}
                          {req.organizationOrSchool || "Independent Scholar"}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="capitalize font-mono font-bold text-[10px] px-2.5 py-1 rounded-full bg-[#eef2f0] text-[#173a35]">
                          {req.status.replace("_", " ")}
                        </span>
                        <p className="text-[10px] text-[#728078] mt-1">
                          {new Date(req.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 bg-[#f8faf9] rounded-lg text-[#3b4742] leading-relaxed">
                      {req.description}
                    </div>

                    {req.orgNotes && (
                      <div className="p-2 bg-[#edf6f0] rounded text-[11px] text-[#155738]">
                        <strong>Internal / Client Note:</strong> {req.orgNotes}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-black/[0.04]">
                      <span className="text-[10px] text-[#728078]">
                        Phone: {req.requesterPhone || "Not provided"}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRequest(req)
                          setNewStatus(req.status)
                          setStatusNote(req.orgNotes || "")
                        }}
                        className="btn-3d-secondary px-3 py-1 text-xs font-semibold"
                      >
                        Update Status & Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modal for updating request */}
            {selectedRequest && (
              <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
                  <h4 className="font-bold text-sm text-[#173a35]">
                    Update Request: {selectedRequest.serviceTitle}
                  </h4>
                  <p className="text-[11px] text-[#62736b]">
                    Requester: {selectedRequest.requesterName}
                  </p>

                  <div>
                    <label className="block font-bold text-[#173a35] mb-1">
                      Status *
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as any)}
                      className="w-full p-2.5 bg-white border border-black/10 rounded-xl"
                    >
                      <option value="submitted">Submitted</option>
                      <option value="under_review">Under Review</option>
                      <option value="accepted">Accepted</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected / Declined</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#173a35] mb-1">
                      Organization Message / Status Note for Student
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Your project has been accepted! Our engineering volunteers will begin setup on Monday..."
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      className="w-full p-2.5 bg-white border border-black/10 rounded-xl"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(null)}
                      className="px-4 py-2 text-xs font-semibold text-[#62736b]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleUpdateStatusSubmit}
                      className="btn-3d-primary px-5 py-2 text-xs font-semibold"
                    >
                      Save Status
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MANAGE SERVICES */}
        {activeTab === "services" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#173a35]">
                  Active Community Services
                </h3>
                <p className="text-[#728078] text-[11px]">
                  All services here are presented free of charge to Credento
                  beneficiaries.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddServiceForm(!showAddServiceForm)}
                className="btn-3d-primary flex items-center gap-1 px-3 py-1.5 text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Free Service</span>
              </button>
            </div>

            {showAddServiceForm && (
              <form
                onSubmit={handleCreateService}
                className="p-4 bg-[#f8faf9] rounded-2xl border border-black/[0.06] space-y-3"
              >
                <h4 className="font-bold text-xs text-[#173a35]">
                  Create New Service Offering
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Service Title (e.g. Free Cloud Deployment Assistance)"
                    value={newSvcTitle}
                    onChange={(e) => setNewSvcTitle(e.target.value)}
                    className="w-full p-2 bg-white rounded-xl border border-black/10"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Estimated Lead Time (e.g. 2-3 business days)"
                    value={newSvcLeadTime}
                    onChange={(e) => setNewSvcLeadTime(e.target.value)}
                    className="w-full p-2 bg-white rounded-xl border border-black/10"
                    required
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Detail the free deliverables and eligibility requirements..."
                  value={newSvcDesc}
                  onChange={(e) => setNewSvcDesc(e.target.value)}
                  className="w-full p-2 bg-white rounded-xl border border-black/10"
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddServiceForm(false)}
                    className="px-3 py-1 text-xs text-[#62736b]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-3d-primary px-4 py-1.5 text-xs font-semibold"
                  >
                    Publish Free Service
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {center.services.map((svc) => (
                <div
                  key={svc.id}
                  className="p-4 rounded-xl bg-white border border-black/[0.06] flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#1b6b47] bg-[#edf6f0] px-2 py-0.5 rounded">
                        100% Free
                      </span>
                      <button
                        type="button"
                        onClick={() => onDeleteService(center.id, svc.id)}
                        className="text-[#a33e32] hover:text-[#7f1d1d] p-1"
                        title="Delete service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="font-bold text-xs text-[#173a35]">
                      {svc.title}
                    </h4>
                    <p className="text-[11px] text-[#62736b] leading-relaxed">
                      {svc.description}
                    </p>
                  </div>
                  <div className="pt-2 mt-2 border-t border-black/[0.04] text-[10px] text-[#728078]">
                    Lead Time: {svc.leadTime}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CENTER PROFILE */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            {profileSaved && (
              <div className="p-3 bg-[#edf6f0] border border-[#b8dec4] rounded-xl text-xs text-[#155738]">
                ✓ Center information updated successfully.
              </div>
            )}

            <div>
              <label className="block font-bold text-[#173a35] mb-1">
                Mission Statement
              </label>
              <textarea
                rows={2}
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                className="w-full p-2.5 bg-white rounded-xl border border-black/10"
              />
            </div>

            <div>
              <label className="block font-bold text-[#173a35] mb-1">
                Overview & Description
              </label>
              <textarea
                rows={4}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full p-2.5 bg-white rounded-xl border border-black/10"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#173a35] mb-1">
                  Official Website
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full p-2.5 bg-white rounded-xl border border-black/10"
                />
              </div>
              <div>
                <label className="block font-bold text-[#173a35] mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-white rounded-xl border border-black/10"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="btn-3d-primary flex items-center gap-1.5 px-5 py-2 text-xs font-semibold"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Center Info</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}
