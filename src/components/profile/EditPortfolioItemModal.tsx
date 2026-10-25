import React, { useState, useEffect } from "react"
import { Modal } from "../common/Modal"
import { PortfolioItem, PortfolioType } from "../../types"

interface EditPortfolioItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (itemId: string, updates: Partial<PortfolioItem>) => void
  item: PortfolioItem | null
}

export function EditPortfolioItemModal({
  isOpen,
  onClose,
  onSave,
  item,
}: EditPortfolioItemModalProps) {
  const [type, setType] = useState<PortfolioType>("project")
  const [title, setTitle] = useState("")
  const [organization, setOrganization] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [skillsString, setSkillsString] = useState("")

  useEffect(() => {
    if (item) {
      setType(item.type)
      setTitle(item.title)
      setOrganization(item.organization || "")
      setDate(item.date)
      setDescription(item.description)
      setLinkUrl(item.linkUrl || "")
      setSkillsString(item.skills ? item.skills.join(", ") : "")
    }
  }, [item, isOpen])

  if (!item) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    const skills = skillsString
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    onSave(item.id, {
      type,
      title: title.trim(),
      organization: organization.trim() || undefined,
      date: date.trim() || "Recent",
      description: description.trim(),
      linkUrl: linkUrl.trim() || undefined,
      skills: skills.length > 0 ? skills : undefined,
    })

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Portfolio Work"
      subtitle="Update the details of your project, research, or award"
      maxWidth="md"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-[#62736b] hover:text-[#242b29] font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn-3d-primary px-5 py-2 text-xs font-semibold cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div>
          <label className="block font-semibold text-[#173a35] mb-1">
            Work Category *
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as PortfolioType)}
            className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded-xl focus:outline-none focus:border-[#173a35]"
          >
            <option value="project">Project / Build</option>
            <option value="publication">Academic Publication</option>
            <option value="award">Honor or Award</option>
            <option value="leadership">Leadership & Campus Service</option>
            <option value="certificate">Verified Certificate</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-[#173a35] mb-1">
            Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded-xl focus:outline-none focus:border-[#173a35]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-[#173a35] mb-1">
              Organization or Lab
            </label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded-xl focus:outline-none focus:border-[#173a35]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#173a35] mb-1">
              Date / Term
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded-xl focus:outline-none focus:border-[#173a35]"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-[#173a35] mb-1">
            Description & Impact *
          </label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded-xl focus:outline-none focus:border-[#173a35]"
          />
        </div>

        <div>
          <label className="block font-semibold text-[#173a35] mb-1">
            Repository or Publication Link
          </label>
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded-xl focus:outline-none focus:border-[#173a35]"
          />
        </div>

        <div>
          <label className="block font-semibold text-[#173a35] mb-1">
            Skills / Methodologies Used (comma-separated)
          </label>
          <input
            type="text"
            value={skillsString}
            onChange={(e) => setSkillsString(e.target.value)}
            className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded-xl focus:outline-none focus:border-[#173a35]"
          />
        </div>
      </form>
    </Modal>
  )
}
