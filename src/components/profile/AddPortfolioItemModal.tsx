import React, { useState } from "react"
import { Modal } from "../common/Modal"
import { PortfolioItem, PortfolioType } from "../../types"

interface AddPortfolioItemModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (item: Omit<PortfolioItem, "id">) => void
}

export function AddPortfolioItemModal({
  isOpen,
  onClose,
  onAdd,
}: AddPortfolioItemModalProps) {
  const [type, setType] = useState<PortfolioType>("project")
  const [title, setTitle] = useState("")
  const [organization, setOrganization] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [credentialId, setCredentialId] = useState("")
  const [skillsString, setSkillsString] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    const skills = skillsString
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    onAdd({
      type,
      title: title.trim(),
      organization: organization.trim() || undefined,
      date: date.trim() || "2026",
      description: description.trim(),
      linkUrl: linkUrl.trim() || undefined,
      credentialId: credentialId.trim() || undefined,
      skills: skills.length > 0 ? skills : undefined,
    })

    // Reset
    setTitle("")
    setOrganization("")
    setDate("")
    setDescription("")
    setLinkUrl("")
    setCredentialId("")
    setSkillsString("")
    onClose()
  }

  interface PortfolioTypeOption {
    value: PortfolioType
    label: string
  }

  const typeOptions: PortfolioTypeOption[] = [
    { value: "project", label: "Academic / Technical Project" },
    { value: "publication", label: "Publication / Research Preprint" },
    { value: "certificate", label: "Verified Certificate / Course" },
    { value: "award", label: "Honors, Award & Hackathon Prize" },
    { value: "leadership", label: "Student Leadership & Society Role" },
    { value: "volunteer", label: "Volunteering & Community Impact" },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Accomplishment to Student Portfolio"
      subtitle="Showcase verified work, research papers, and awards"
      maxWidth="lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-[#62736b] hover:text-[#242b29] rounded-xl hover:bg-black/5 cursor-pointer font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim() || !description.trim()}
            className="btn-3d-primary px-5 py-2 text-xs font-semibold disabled:opacity-40 cursor-pointer"
          >
            Add to Portfolio
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-[#173a35] mb-1">
            Category Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as PortfolioType)}
            className="w-full p-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-[#173a35] shadow-xs cursor-pointer"
          >
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-[#173a35] mb-1">
            Title / Name of Achievement
          </label>
          <input
            type="text"
            placeholder="e.g. SparseAttention CUDA Kernel or 1st Place MIT Climate Hack"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-[#173a35] shadow-inner"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-[#173a35] mb-1">
              Associated Lab, Organization, or Sponsor
            </label>
            <input
              type="text"
              placeholder="e.g. MIT CSAIL or IEEE Student Chapter"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full p-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-[#173a35] shadow-inner"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#173a35] mb-1">
              Date / Academic Term
            </label>
            <input
              type="text"
              placeholder="e.g. Fall 2025 or June 2024"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-[#173a35] shadow-inner"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-[#173a35] mb-1">
            Description & Impact
          </label>
          <textarea
            rows={4}
            placeholder="Summarize your methodology, outcomes, key responsibilities, or quantitative metrics..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-[#173a35] shadow-inner"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-[#173a35] mb-1">
              External Link URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://github.com/... or doi link"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full p-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-[#173a35] shadow-inner"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#173a35] mb-1">
              Credential ID / Paper DOI (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. IEEE-2025-0123"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              className="w-full p-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-[#173a35] shadow-inner"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-[#173a35] mb-1">
            Relevant Tools or Skills (comma-separated)
          </label>
          <input
            type="text"
            placeholder="e.g. Python, PyTorch, Econometrics"
            value={skillsString}
            onChange={(e) => setSkillsString(e.target.value)}
            className="w-full p-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-[#173a35] shadow-inner"
          />
        </div>
      </form>
    </Modal>
  )
}
