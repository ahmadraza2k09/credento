import React from "react"
import { Modal } from "../common/Modal"
import { ServiceRequest, ServiceRequestStatus } from "../../types"
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Building,
  Calendar,
  ArrowRight,
} from "lucide-react"

interface UserServiceRequestsModalProps {
  isOpen: boolean
  onClose: () => void
  requests: ServiceRequest[]
}

export function UserServiceRequestsModal({
  isOpen,
  onClose,
  requests,
}: UserServiceRequestsModalProps) {
  const getStatusBadge = (status: ServiceRequestStatus) => {
    switch (status) {
      case "submitted":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e0f2fe] text-[#0369a1]">
            Submitted
          </span>
        )
      case "under_review":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fef3c7] text-[#b45309]">
            Under Review
          </span>
        )
      case "accepted":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#dcfce7] text-[#15803d]">
            Accepted
          </span>
        )
      case "in_progress":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f3e8ff] text-[#7e22ce]">
            In Progress
          </span>
        )
      case "completed":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#d1fae5] text-[#065f46]">
            ✓ Completed
          </span>
        )
      case "rejected":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fee2e2] text-[#b91c1c]">
            Declined
          </span>
        )
      default:
        return null
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="My Access Center Service Requests"
      subtitle="Track the real-time status of your free service applications"
      maxWidth="lg"
      footer={
        <div className="flex justify-end w-full">
          <button
            type="button"
            onClick={onClose}
            className="btn-3d-secondary px-5 py-2 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        {requests.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#62736b]">
            <Sparkles className="w-9 h-9 text-[#c46b4b] mx-auto mb-2" />
            <p className="font-bold text-sm text-[#173a35]">
              No service requests yet.
            </p>
            <p className="mt-1 max-w-sm mx-auto leading-relaxed">
              Explore the Access Center directory to request free website
              creation, digital setups, or academic consulting from verified
              organizations.
            </p>
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="p-4 rounded-2xl bg-white border border-black/[0.06] shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] text-[#728078] font-mono">
                    REF: {req.id}
                  </span>
                  <h4 className="font-bold text-sm text-[#173a35]">
                    {req.serviceTitle}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-[#62736b] mt-0.5">
                    <Building className="w-3.5 h-3.5 text-[#173a35]" />
                    <span>{req.centerName}</span>
                    <span>•</span>
                    <span className="text-[11px]">
                      Submitted:{" "}
                      {req.submittedAt
                        ? new Date(req.submittedAt).toLocaleDateString()
                        : "Recently"}
                    </span>
                  </div>
                </div>
                {getStatusBadge(req.status)}
              </div>

              <div className="p-3 bg-[#f8faf9] rounded-xl text-xs text-[#4d5b54] space-y-1">
                <p className="font-semibold text-[#173a35]">Request Details:</p>
                <p className="text-[#62736b] leading-relaxed">
                  {req.description}
                </p>
                {req.organizationOrSchool && (
                  <p className="text-[11px] text-[#728078]">
                    Affiliation: {req.organizationOrSchool} (
                    {req.beneficiaryType})
                  </p>
                )}
              </div>

              {req.orgNotes && (
                <div className="p-3 bg-[#edf6f0] border border-[#b8dec4] rounded-xl text-xs text-[#155738]">
                  <p className="font-bold mb-0.5">
                    Note from {req.centerName}:
                  </p>
                  <p className="text-[11px]">{req.orgNotes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Modal>
  )
}
