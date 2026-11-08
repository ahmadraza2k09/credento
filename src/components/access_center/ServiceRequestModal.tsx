import React, { useState } from "react"
import { Modal } from "../common/Modal"
import {
  AccessCenterOrganization,
  AccessCenterService,
  StudentProfile,
} from "../../types"
import { HeartHandshake, CheckCircle2, Building, Send } from "lucide-react"

interface ServiceRequestModalProps {
  isOpen: boolean
  onClose: () => void
  center: AccessCenterOrganization
  service: AccessCenterService
  currentUser: StudentProfile | null
  onSubmit: (params: {
    serviceId: string
    serviceTitle: string
    centerId: string
    centerName: string
    requesterName: string
    requesterEmail: string
    requesterPhone: string
    organizationOrSchool?: string
    beneficiaryType: string
    description: string
    supportingLinks?: string
  }) => void
}

export function ServiceRequestModal({
  isOpen,
  onClose,
  center,
  service,
  currentUser,
  onSubmit,
}: ServiceRequestModalProps) {
  const [name, setName] = useState(currentUser?.name || "")
  const [email, setEmail] = useState(currentUser?.email || "")
  const [phone, setPhone] = useState(currentUser?.phone || "")
  const [orgOrSchool, setOrgOrSchool] = useState(currentUser?.institution || "")
  const [beneficiaryType, setBeneficiaryType] = useState<string>("Student")
  const [description, setDescription] = useState("")
  const [supportingLinks, setSupportingLinks] = useState("")
  const [submittedSuccess, setSubmittedSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !description.trim()) {
      setError("Please complete all required fields.")
      return
    }

    onSubmit({
      serviceId: service.id,
      serviceTitle: service.title,
      centerId: center.id,
      centerName: center.name,
      requesterName: name.trim(),
      requesterEmail: email.trim(),
      requesterPhone: phone.trim(),
      organizationOrSchool: orgOrSchool.trim() || undefined,
      beneficiaryType,
      description: description.trim(),
      supportingLinks: supportingLinks.trim() || undefined,
    })

    setSubmittedSuccess(true)
    setTimeout(() => {
      setSubmittedSuccess(false)
      setDescription("")
      setSupportingLinks("")
      onClose()
    }, 2000)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Free Community Service"
      subtitle={`${service.title} provided by ${center.name}`}
      maxWidth="md"
      footer={
        !submittedSuccess ? (
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] text-[#1b6b47] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% Free • No Commercial Fees
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#62736b] hover:text-[#242b29] rounded-xl hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="btn-3d-primary px-5 py-2 text-xs font-semibold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Service Request</span>
              </button>
            </div>
          </div>
        ) : null
      }
    >
      {submittedSuccess ? (
        <div className="py-8 text-center text-xs space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#edf6f0] text-[#155738] flex items-center justify-center mx-auto mb-3 shadow-sm border border-[#b8dec4]">
            <CheckCircle2 className="w-7 h-7 text-[#1b6b47]" />
          </div>
          <h3 className="font-bold text-base text-[#173a35]">
            Service Request Dispatched!
          </h3>
          <p className="text-[#62736b] max-w-sm mx-auto leading-relaxed">
            Your request has been received by <strong>{center.name}</strong>.
            Their staff will review your request and provide updates via your
            Credento notifications.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {error && (
            <div className="p-3 bg-[#fdf3f2] border border-[#f1c5c0] rounded-xl text-xs text-[#a33e32]">
              {error}
            </div>
          )}

          <div className="p-3 bg-[#f0f4f2] border border-[#cbd3ce] rounded-xl text-xs text-[#242b29] space-y-1">
            <div className="flex items-center justify-between font-bold text-[#173a35]">
              <span>{service.title}</span>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded font-mono text-[#1b6b47]">
                Free Access Service
              </span>
            </div>
            <p className="text-[11px] text-[#62736b]">{service.description}</p>
            <p className="text-[10px] text-[#728078]">
              Estimated Response / Lead Time: {service.leadTime}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#173a35] mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35]"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-[#173a35] mb-1">
                Contact Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#173a35] mb-1">
                Phone Number (optional)
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#173a35] mb-1">
                Beneficiary Category *
              </label>
              <select
                value={beneficiaryType}
                onChange={(e) => setBeneficiaryType(e.target.value)}
                className="w-full p-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35]"
              >
                <option value="Student">Student Scholar</option>
                <option value="Small Business">Local Small Business</option>
                <option value="School / Educator">
                  School / Educational Program
                </option>
                <option value="Hospital / Clinic">
                  Hospital / Healthcare Clinic
                </option>
                <option value="Community Initiative">
                  Community Non-Profit / Initiative
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#173a35] mb-1">
              Affiliated School / Organization (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Lincoln High School or Community Food Bank"
              value={orgOrSchool}
              onChange={(e) => setOrgOrSchool(e.target.value)}
              className="w-full p-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#173a35] mb-1">
              Describe Your Project or Request *
            </label>
            <textarea
              rows={4}
              placeholder="Detail what help you need (e.g. domain setup, non-profit website, advisory questions, or community guidance)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35] leading-relaxed"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-[#173a35] mb-1">
              Supporting URLs or Material Links (optional)
            </label>
            <input
              type="url"
              placeholder="https://drive.google.com/... or project link"
              value={supportingLinks}
              onChange={(e) => setSupportingLinks(e.target.value)}
              className="w-full p-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35]"
            />
          </div>
        </form>
      )}
    </Modal>
  )
}
