import React, { useState } from "react"
import { Modal } from "../common/Modal"
import { StudentProfile } from "../../types"

interface ProfileEditModalProps {
  isOpen: boolean
  onClose: () => void
  profile: StudentProfile
  onSave: (updates: Partial<StudentProfile>) => void
}

export function ProfileEditModal({
  isOpen,
  onClose,
  profile,
  onSave,
}: ProfileEditModalProps) {
  const [headline, setHeadline] = useState(profile.headline || "")
  const [about, setAbout] = useState(profile.about || "")
  const [institution, setInstitution] = useState(profile.institution || "")
  const [facultyOrDepartment, setFacultyOrDepartment] = useState(
    profile.facultyOrDepartment || "",
  )
  const [degree, setDegree] = useState(profile.degree || "")
  const [graduationYear, setGraduationYear] = useState(
    String(profile.graduationYear || "2026"),
  )
  const [location, setLocation] = useState(profile.location || "")
  const [skillsString, setSkillsString] = useState(
    profile.skills ? profile.skills.join(", ") : "",
  )
  const [interestsString, setInterestsString] = useState(
    profile.interests ? profile.interests.join(", ") : "",
  )
  const [openToBadges, setOpenToBadges] = useState<string[]>(
    profile.openToBadges || ["research"],
  )
  const [isPublic, setIsPublic] = useState(profile.isPublic ?? true)
  const [coverImage, setCoverImage] = useState(profile.coverImage || "")
  const [avatar, setAvatar] = useState(profile.avatar || "")

  const toggleBadge = (badge: string) => {
    setOpenToBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge],
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const skills = skillsString
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    const interests = interestsString
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    onSave({
      headline: headline.trim(),
      about: about.trim(),
      institution: institution.trim(),
      facultyOrDepartment: facultyOrDepartment.trim(),
      degree: degree.trim(),
      graduationYear: graduationYear.trim(),
      location: location.trim(),
      skills,
      interests,
      openToBadges,
      isPublic,
      coverImage: coverImage.trim() || undefined,
      avatar: avatar.trim() || profile.avatar,
    })

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Student Profile & Visibility"
      subtitle="Keep your academic credentials and research focus up to date"
      maxWidth="lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-[#62736b] hover:text-[#242b29] font-medium rounded-xl hover:bg-black/5 cursor-pointer"
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
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Headline */}
        <div>
          <label className="block font-semibold text-[#173a35] mb-1">
            Professional Headline
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="e.g. Undergraduate Researcher in AI Systems @ MIT CSAIL"
            className="w-full p-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-[#173a35] shadow-inner"
            required
          />
        </div>

        {/* Institution & Faculty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-[#173a35] mb-1">
              Educational Institution
            </label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g. Stanford University"
              className="w-full p-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-[#173a35] shadow-inner"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-[#173a35] mb-1">
              Faculty / Department
            </label>
            <input
              type="text"
              value={facultyOrDepartment}
              onChange={(e) => setFacultyOrDepartment(e.target.value)}
              placeholder="e.g. Department of Bioengineering"
              className="w-full p-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-[#173a35] shadow-inner"
            />
          </div>
        </div>

        {/* Degree & Grad Year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-[#173a35] mb-1">
              Degree & Major
            </label>
            <input
              type="text"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              placeholder="e.g. B.S. in Computer Science"
              className="w-full p-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-[#173a35] shadow-inner"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#173a35] mb-1">
              Expected Graduation Year
            </label>
            <input
              type="text"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              placeholder="e.g. 2026"
              className="w-full p-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-[#173a35] shadow-inner"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block font-semibold text-[#173a35] mb-1">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Cambridge, MA"
            className="w-full p-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-[#173a35] shadow-inner"
          />
        </div>

        {/* About */}
        <div>
          <label className="block font-semibold text-[#173a35] mb-1">
            About & Personal Introduction
          </label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={4}
            placeholder="Describe your academic focus, research questions, and long-term career aspirations..."
            className="w-full p-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-[#173a35] shadow-inner"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block font-semibold text-[#173a35] mb-1">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            value={skillsString}
            onChange={(e) => setSkillsString(e.target.value)}
            placeholder="e.g. PyTorch, CUDA, Algorithms, Technical Writing"
            className="w-full p-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-[#173a35] shadow-inner"
          />
        </div>

        {/* Academic Interests */}
        <div>
          <label className="block font-semibold text-[#173a35] mb-1">
            Research & Academic Interests (comma-separated)
          </label>
          <input
            type="text"
            value={interestsString}
            onChange={(e) => setInterestsString(e.target.value)}
            placeholder="e.g. AI Ethics, Clean Tech, Synthetic Biology"
            className="w-full p-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:border-[#173a35] shadow-inner"
          />
        </div>

        {/* Open To Status Badges */}
        <div className="p-3.5 bg-[#f8faf9] border border-black/[0.04] rounded-2xl space-y-2">
          <label className="block font-semibold text-[#173a35]">
            Opportunities & Collaboration Status
          </label>
          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-[#242b29]">
              <input
                type="checkbox"
                checked={openToBadges.includes("research")}
                onChange={() => toggleBadge("research")}
                className="rounded text-[#173a35] focus:ring-[#173a35]"
              />
              <span>Open to Research Collaboration & Lab Projects</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-[#242b29]">
              <input
                type="checkbox"
                checked={openToBadges.includes("internships")}
                onChange={() => toggleBadge("internships")}
                className="rounded text-[#173a35] focus:ring-[#173a35]"
              />
              <span>Seeking Summer / Fall Internships & Fellowships</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-[#242b29]">
              <input
                type="checkbox"
                checked={openToBadges.includes("tutoring")}
                onChange={() => toggleBadge("tutoring")}
                className="rounded text-[#173a35] focus:ring-[#173a35]"
              />
              <span>Available for Peer Tutoring & Course Mentorship</span>
            </label>
          </div>
        </div>

        {/* Visibility Controls */}
        <div className="p-3.5 bg-[#f8faf9] border border-black/[0.04] rounded-2xl">
          <label className="flex items-center gap-2.5 cursor-pointer font-semibold text-[#173a35]">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded-md text-[#173a35] focus:ring-[#173a35]"
            />
            <span>Public Profile Visibility</span>
          </label>
          <p className="text-[11px] text-[#62736b] mt-1.5 ml-6">
            When enabled, your profile can be viewed by all verified student
            peers. When unchecked, only confirmed connections can view your full
            portfolio.
          </p>
        </div>
      </form>
    </Modal>
  )
}
