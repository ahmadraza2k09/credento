import React, { useState, useEffect } from "react"
import { Modal } from "../common/Modal"
import { EducationItem } from "../../types"

interface EducationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (edu: Omit<EducationItem, "id">, editId?: string) => void
  onDelete?: (eduId: string) => void
  initialData?: EducationItem | null
}

export function EducationModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
}: EducationModalProps) {
  const [institution, setInstitution] = useState("")
  const [degree, setDegree] = useState("")
  const [fieldOfStudy, setFieldOfStudy] = useState("")
  const [startYear, setStartYear] = useState(2022)
  const [endYear, setEndYear] = useState<string>("2026")
  const [gradeOrGpa, setGradeOrGpa] = useState("")
  const [activities, setActivities] = useState("")

  useEffect(() => {
    if (initialData) {
      setInstitution(initialData.institution || "")
      setDegree(initialData.degree || "")
      setFieldOfStudy(initialData.fieldOfStudy || "")
      setStartYear(initialData.startYear || 2022)
      setEndYear(String(initialData.endYear || "2026"))
      setGradeOrGpa(initialData.gradeOrGpa || "")
      setActivities(initialData.activities || "")
    } else {
      setInstitution("")
      setDegree("")
      setFieldOfStudy("")
      setStartYear(2022)
      setEndYear("2026")
      setGradeOrGpa("")
      setActivities("")
    }
  }, [initialData, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!institution.trim() || !degree.trim()) return

    onSave(
      {
        institution: institution.trim(),
        degree: degree.trim(),
        fieldOfStudy: fieldOfStudy.trim(),
        startYear: Number(startYear),
        endYear:
          endYear.trim() === "Present" ? "Present" : Number(endYear) || 2026,
        gradeOrGpa: gradeOrGpa.trim() || undefined,
        activities: activities.trim() || undefined,
      },
      initialData?.id,
    )
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Education" : "Add Education"}
      subtitle="Record your academic milestones, degrees, and collegiate achievements"
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between w-full">
          {initialData && onDelete ? (
            <button
              type="button"
              onClick={() => {
                onDelete(initialData.id)
                onClose()
              }}
              className="text-xs text-[#a33e32] hover:underline font-semibold cursor-pointer"
            >
              Delete this education
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
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
              Save Education
            </button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div>
          <label className="block font-semibold text-[#173a35] mb-1">
            College or University *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Massachusetts Institute of Technology"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded-xl focus:outline-none focus:border-[#173a35]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-[#173a35] mb-1">
              Degree *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bachelor of Science (B.S.)"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded-xl focus:outline-none focus:border-[#173a35]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#173a35] mb-1">
              Field of Study / Major
            </label>
            <input
              type="text"
              placeholder="e.g. Computer Science & AI"
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded-xl focus:outline-none focus:border-[#173a35]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-[#173a35] mb-1">
              Start Year
            </label>
            <input
              type="number"
              value={startYear}
              onChange={(e) => setStartYear(Number(e.target.value))}
              className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded-xl focus:outline-none focus:border-[#173a35]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#173a35] mb-1">
              End Year (or Present)
            </label>
            <input
              type="text"
              placeholder="2026 or Present"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded-xl focus:outline-none focus:border-[#173a35]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#173a35] mb-1">
              Grade / GPA (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 3.92 / 4.00"
              value={gradeOrGpa}
              onChange={(e) => setGradeOrGpa(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded-xl focus:outline-none focus:border-[#173a35]"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-[#173a35] mb-1">
            Activities, Societies, and Honors
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Robotics Team Lead, Dean's List, Research Assistant..."
            value={activities}
            onChange={(e) => setActivities(e.target.value)}
            className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded-xl focus:outline-none focus:border-[#173a35]"
          />
        </div>
      </form>
    </Modal>
  )
}
