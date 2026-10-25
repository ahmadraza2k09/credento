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
} from "lucide-react"
import { Opportunity } from "../../types"
import { Modal } from "../common/Modal"
import { OpportunityCategoryBadge } from "../common/Badge"

interface OpportunityDetailModalProps {
  isOpen: boolean
  onClose: () => void
  opportunity: Opportunity | null
  isSaved: boolean
  onToggleSave: (oppId: string) => void
}

export function OpportunityDetailModal({
  isOpen,
  onClose,
  opportunity,
  isSaved,
  onToggleSave,
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
              className={`flex items-center gap-1.5 px-3 py-2 border rounded-[2px] text-xs font-semibold transition-colors ${
                isSaved
                  ? "bg-[#faf0eb] text-[#9f5138] border-[#e8cdc2]"
                  : "bg-white text-[#242b29] border-[#cbd3ce] hover:bg-[#f7f5ef]"
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
              />
              <span>{isSaved ? "Saved to Bookmarks" : "Save for Later"}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="p-2 border border-[#cbd3ce] rounded-[2px] text-[#62736b] hover:text-[#173a35] hover:bg-[#f7f5ef] transition-colors"
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
            className="flex items-center gap-2 px-5 py-2 bg-[#173a35] text-white rounded-[2px] text-xs font-semibold hover:bg-[#0e2f2a] transition-colors"
          >
            <span>Apply via Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      }
    >
      <div className="space-y-5 text-xs text-[#242b29]">
        {/* Meta badges row */}
        <div className="flex flex-wrap items-center gap-2.5 pb-3 border-b border-[#eef2ef]">
          <OpportunityCategoryBadge category={opportunity.category} />
          <span className="text-[11px] font-mono px-2 py-0.5 bg-[#f7f5ef] border border-[#d8ddd8] rounded-[2px] text-[#4d5b54]">
            {opportunity.mode}
          </span>
          {opportunity.compensation && (
            <span className="text-[11px] font-semibold px-2 py-0.5 bg-[#edf6f0] text-[#155738] border border-[#b8dec4] rounded-[2px]">
              {opportunity.compensation}
            </span>
          )}
          <span className="text-[11px] font-mono font-bold text-[#a33e32] ml-auto">
            Deadline: {opportunity.deadline}
          </span>
        </div>

        {/* Overview attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#f7f5ef] rounded-[2px] border border-[#d8ddd8]">
          <div className="flex items-center gap-2">
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
          <div className="flex items-center gap-2">
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

        {/* Academic integrity disclaimer */}
        <div className="p-3 bg-[#f0ede6] rounded-[2px] border border-[#cbd3ce] text-[11px] text-[#62736b]">
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
