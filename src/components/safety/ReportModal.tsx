import React, { useState } from "react"
import { Modal } from "../common/Modal"
import { Flag, AlertTriangle, Check } from "lucide-react"

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  targetType: "user" | "post" | "comment" | "opportunity"
  targetId: string
  onSubmitReport: (reason: string, details: string) => void
}

export function ReportModal({
  isOpen,
  onClose,
  targetType,
  targetId,
  onSubmitReport,
}: ReportModalProps) {
  const [reason, setReason] = useState("Spam or commercial advertisement")
  const [details, setDetails] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const reasons = [
    "Spam or commercial advertisement",
    "Academic dishonesty or credential misrepresentation",
    "Harassment, bullying, or disrespectful communication",
    "Inappropriate or offensive content",
    "Impersonation of another student or institution",
    "Other violation of Credento Community Guidelines",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmitReport(reason, details)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setDetails("")
      onClose()
    }, 1800)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Report Content or Behavior"
      subtitle="Help maintain a trusted, professional student community"
      maxWidth="md"
      footer={
        !submitted ? (
          <>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#62736b] hover:text-[#242b29]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#a33e32] text-white rounded text-xs font-semibold hover:bg-[#882d23] transition-colors"
            >
              Submit Report
            </button>
          </>
        ) : null
      }
    >
      {submitted ? (
        <div className="py-6 text-center text-xs">
          <div className="w-10 h-10 rounded-full bg-[#1b6b47]/15 text-[#1b6b47] flex items-center justify-center mx-auto mb-3">
            <Check className="w-5 h-5" />
          </div>
          <p className="font-bold text-sm text-[#173a35]">Report Received</p>
          <p className="text-[#62736b] max-w-xs mx-auto mt-1">
            Thank you for helping keep Credento safe. Our student moderation
            council will review this within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="p-3 bg-[#fdf2f2] border border-[#f5c2c7] rounded text-[#a33e32] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Reporting a {targetType}. False reports are a violation of
              platform guidelines.
            </span>
          </div>

          <div>
            <label className="block font-semibold text-[#173a35] mb-1.5">
              Select Violation Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded focus:outline-none focus:border-[#173a35]"
            >
              {reasons.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#173a35] mb-1.5">
              Additional Context or Specifics (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Provide any details to help reviewers evaluate the issue..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded focus:outline-none focus:border-[#173a35]"
            />
          </div>
        </form>
      )}
    </Modal>
  )
}
