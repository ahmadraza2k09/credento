import React, { useState } from "react"
import {
  ExternalLink,
  Bookmark,
  Calendar,
  MapPin,
  Building,
  CheckCircle,
  Share2,
  Check,
  ClipboardCheck,
} from "lucide-react"
import { ApplicationStatus, Opportunity } from "../../types"
import { Modal } from "../common/Modal"
import { OpportunityCategoryBadge } from "../common/Badge"

interface OpportunityDetailModalProps {
  isOpen: boolean
  onClose: () => void
  opportunity: Opportunity | null
  isSaved: boolean
  onToggleSave: (oppId: string) => void
  onUpdateStatus?: (
    oppId: string,
    status: ApplicationStatus,
    notes?: string,
  ) => void
}

export function OpportunityDetailModal({
  isOpen,
  onClose,
  opportunity,
  isSaved,
  onToggleSave,
  onUpdateStatus,
}: OpportunityDetailModalProps) {
  const [copiedLink, setCopiedLink] = useState(false)

  if (!opportunity) return null

  const handleCopy = () => {
    navigator.clipboard?.writeText(opportunity.applicationUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={opportunity.title}
      subtitle={`Offered by ${opportunity.provider}`}
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleSave(opportunity.id)}
              className={`btn-3d-secondary flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold cursor-pointer ${
                isSaved ? "text-[#c46b4b] font-bold" : ""
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${isSaved ? "fill-current text-[#c46b4b]" : ""}`}
              />
              <span>{isSaved ? "Saved to Bookmarks" : "Save for Later"}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="btn-3d-secondary p-2 text-xs cursor-pointer"
              title="Copy official link"
            >
              {copiedLink ? (
                <Check className="w-4 h-4 text-[#173a35]" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
          </div>

          <a
            href={opportunity.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d-primary flex items-center gap-2 px-5 py-2 text-xs font-semibold cursor-pointer"
          >
            <span>Apply via Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      }
    >
      <div className="space-y-5 text-xs text-[#242b29]">
        {/* Meta badges row */}
        <div className="flex flex-wrap items-center gap-2.5 pb-3.5 border-b border-black/[0.04]">
          <OpportunityCategoryBadge category={opportunity.category} />
          <span className="text-[11px] font-mono px-2.5 py-0.5 bg-[#f4f6f5] rounded-full text-[#4d5b54] shadow-2xs">
            {opportunity.mode}
          </span>
          {opportunity.compensation && (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-[#edf6f0] text-[#155738] rounded-full shadow-2xs">
              {opportunity.compensation}
            </span>
          )}
          <span className="text-[11px] font-mono font-bold text-[#a33e32] ml-auto">
            Deadline: {opportunity.deadline}
          </span>
        </div>

        {/* Overview attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#f8faf9] rounded-2xl border border-black/[0.04]">
          <div className="flex items-center gap-2.5">
            <Building className="w-4 h-4 text-[#173a35] shrink-0" />
            <div>
              <span className="text-[10px] text-[#728078] block">
                Organization
              </span>
              <span className="font-semibold text-[#173a35]">
                {opportunity.provider}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-[#173a35] shrink-0" />
            <div>
              <span className="text-[10px] text-[#728078] block">
                Location / Delivery
              </span>
              <span className="font-semibold text-[#173a35]">
                {opportunity.location}
              </span>
            </div>
          </div>
        </div>

        {/* Full description */}
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#173a35] mb-2">
            Description & Program Scope
          </h4>
          <p className="text-sm text-[#242b29] leading-relaxed whitespace-pre-line">
            {opportunity.description}
          </p>
        </div>

        {/* Eligibility criteria list */}
        {opportunity.eligibility && opportunity.eligibility.length > 0 && (
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#173a35] mb-2">
              Eligibility & Candidate Requirements
            </h4>
            <ul className="space-y-1.5 pl-1">
              {opportunity.eligibility.map((crit, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#1b6b47] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#242b29] leading-relaxed">
                    {crit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Application Tracker Section */}
        <div className="p-4 bg-[#f4f6f5] rounded-2xl border border-black/[0.06] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-[#173a35]" />
              <span className="font-bold text-xs text-[#173a35]">
                My Application Tracking Status
              </span>
            </div>
            {opportunity.applicationStatus && (
              <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-white text-[#173a35] shadow-2xs capitalize">
                {opportunity.applicationStatus.replace("_", " ")}
              </span>
            )}
          </div>

          <p className="text-[11px] text-[#62736b]">
            Track your candidate status privately across your semester deadlines:
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                "submitted",
                "under_review",
                "interviewing",
                "offered",
                "withdrawn",
              ] as ApplicationStatus[]
            ).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => onUpdateStatus?.(opportunity.id, st)}
                className={`text-[11px] px-3 py-1 rounded-full font-medium capitalize transition-colors cursor-pointer ${
                  opportunity.applicationStatus === st
                    ? "bg-[#173a35] text-white font-semibold"
                    : "bg-white text-[#62736b] hover:text-[#173a35] hover:bg-[#edf2ee]"
                }`}
              >
                {st.replace("_", " ")}
              </button>
            ))}
          </div>

          {opportunity.appliedDate && (
            <p className="text-[10px] text-[#728078] font-mono pt-1">
              Recorded on: {opportunity.appliedDate}
              {opportunity.applicationNotes &&
                ` • Notes: ${opportunity.applicationNotes}`}
            </p>
          )}
        </div>

        {/* Academic integrity disclaimer */}
        <div className="p-3.5 bg-[#f8faf9] rounded-2xl border border-black/[0.04] text-[11px] text-[#62736b]">
          <strong className="text-[#173a35]">
            Credento Verification Note:
          </strong>{" "}
          Applications must be submitted through the official institution
          website above. Credento does not collect application fees or handle
          internal scholarship selection.
        </div>
      </div>
    </Modal>
  )
}
