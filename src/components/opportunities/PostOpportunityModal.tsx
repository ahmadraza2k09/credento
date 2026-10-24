import React, { useState } from "react"
import { Modal } from "../common/Modal"
import { Opportunity, OpportunityCategory } from "../../types"

interface PostOpportunityModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (opp: Omit<Opportunity, "id" | "createdAt">) => void
  userName: string
}

export function PostOpportunityModal({
  isOpen,
  onClose,
  onAdd,
  userName,
}: PostOpportunityModalProps) {
  const [title, setTitle] = useState("")
  const [provider, setProvider] = useState("")
  const [category, setCategory] = useState<OpportunityCategory>("scholarship")
  const [description, setDescription] = useState("")
  const [eligibilityString, setEligibilityString] = useState("")
  const [location, setLocation] = useState("")
  const [mode, setMode] = useState<"Remote" | "Hybrid" | "On-site">("Remote")
  const [deadline, setDeadline] = useState("")
  const [applicationUrl, setApplicationUrl] = useState("")
  const [compensation, setCompensation] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !provider.trim() || !applicationUrl.trim()) return

    const eligibility = eligibilityString
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)

    onAdd({
      title: title.trim(),
      provider: provider.trim(),
      category,
      description: description.trim(),
      eligibility:
        eligibility.length > 0
          ? eligibility
          : ["Enrolled undergraduate or graduate student"],
      location: location.trim() || "Global / Virtual",
      mode,
      deadline: deadline || "2026-12-31",
      applicationUrl: applicationUrl.trim().startsWith("http")
        ? applicationUrl.trim()
        : `https://${applicationUrl.trim()}`,
      compensation: compensation.trim() || undefined,
      postedBy: userName,
    })

    // Reset
    setTitle("")
    setProvider("")
    setDescription("")
    setEligibilityString("")
    setLocation("")
    setApplicationUrl("")
    setCompensation("")
    onClose()
  }

  interface CategoryOptionItem {
    value: OpportunityCategory
    label: string
  }

  const categoryOptions: CategoryOptionItem[] = [
    { value: "scholarship", label: "Scholarship & Financial Aid" },
    { value: "internship", label: "Internship & Job" },
    { value: "fellowship", label: "Fellowship & Exchange Program" },
    { value: "competition", label: "Competition & Hackathon" },
    { value: "course", label: "Course & Training Program" },
    { value: "volunteer", label: "Volunteering & Student Conference" },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Post Verified Opportunity"
      subtitle="Publish a scholarship, fellowship, or lab position for university students"
      maxWidth="lg"
      footer={
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
            disabled={
              !title.trim() || !provider.trim() || !applicationUrl.trim()
            }
            className="px-5 py-2 bg-[#173a35] text-white rounded text-xs font-semibold hover:bg-[#0e2f2a] disabled:opacity-40"
          >
            Publish Opportunity
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-[#173a35] mb-1">
            Opportunity Title
          </label>
          <input
            type="text"
            placeholder="e.g. Knight-Hennessy Scholars Program 2027"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded focus:outline-none focus:border-[#173a35]"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-[#173a35] mb-1">
              Organization / Provider
            </label>
            <input
              type="text"
              placeholder="e.g. Stanford University or NSF"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded focus:outline-none focus:border-[#173a35]"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-[#173a35] mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as OpportunityCategory)
              }
              className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded focus:outline-none focus:border-[#173a35]"
            >
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-[#173a35] mb-1">
            Program Description
          </label>
          <textarea
            rows={3}
            placeholder="Overview of the program, mission, and scope..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded focus:outline-none focus:border-[#173a35]"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-[#173a35] mb-1">
            Eligibility Criteria (one per line)
          </label>
          <textarea
            rows={3}
            placeholder="Must be enrolled undergraduate&#10;GPA 3.5 or above&#10;Open to all international applicants"
            value={eligibilityString}
            onChange={(e) => setEligibilityString(e.target.value)}
            className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded focus:outline-none focus:border-[#173a35]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-[#173a35] mb-1">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g. Remote or Boston, MA"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded focus:outline-none focus:border-[#173a35]"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#173a35] mb-1">
              Delivery Mode
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded focus:outline-none focus:border-[#173a35]"
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-[#173a35] mb-1">
              Application Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded focus:outline-none focus:border-[#173a35]"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-[#173a35] mb-1">
              Official Application Portal URL
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={applicationUrl}
              onChange={(e) => setApplicationUrl(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded focus:outline-none focus:border-[#173a35]"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-[#173a35] mb-1">
              Stipend / Award Amount (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. $10,000 Grant or Fully Funded"
              value={compensation}
              onChange={(e) => setCompensation(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded focus:outline-none focus:border-[#173a35]"
            />
          </div>
        </div>
      </form>
    </Modal>
  )
}
