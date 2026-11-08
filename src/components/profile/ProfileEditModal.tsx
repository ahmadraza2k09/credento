import React, { useState } from "react"
import { Modal } from "../common/Modal"
import { ProfileVisibility, StudentProfile } from "../../types"
import {
  Globe,
  Lock,
  Users,
  Sparkles,
  Image,
  Link as LinkIcon,
} from "lucide-react"

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
  const [name, setName] = useState(profile.name || "")
  const [username, setUsername] = useState(profile.username || "")
  const [headline, setHeadline] = useState(profile.headline || "")
  const [about, setAbout] = useState(profile.about || "")
  const [institution, setInstitution] = useState(profile.institution || "")
  const [facultyOrDepartment, setFacultyOrDepartment] = useState(
    profile.facultyOrDepartment || "",
  )
  const [degree, setDegree] = useState(profile.degree || "")
  const [graduationYear, setGraduationYear] = useState(
    String(profile.graduationYear || "2027"),
  )
  const [location, setLocation] = useState(profile.location || "")
  const [skillsString, setSkillsString] = useState(
    profile.skills ? profile.skills.join(", ") : "",
  )
  const [interestsString, setInterestsString] = useState(
    profile.interests ? profile.interests.join(", ") : "",
  )
  const [visibility, setVisibility] = useState<ProfileVisibility>(
    profile.visibility || (profile.isPublic ? "public" : "network"),
  )
  const [coverImage, setCoverImage] = useState(profile.coverImage || "")
  const [avatar, setAvatar] = useState(profile.avatar || "")

  // Social Links
  const [website, setWebsite] = useState(profile.socialLinks?.website || "")
  const [github, setGithub] = useState(profile.socialLinks?.github || "")
  const [linkedin, setLinkedin] = useState(profile.socialLinks?.linkedin || "")
  const [twitter, setTwitter] = useState(profile.socialLinks?.twitter || "")
  const [scholar, setScholar] = useState(profile.socialLinks?.scholar || "")

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
      name: name.trim() || profile.name,
      username:
        username.trim().toLowerCase().replace(/^@/, "") || profile.username,
      headline: headline.trim(),
      about: about.trim(),
      institution: institution.trim(),
      facultyOrDepartment: facultyOrDepartment.trim(),
      degree: degree.trim(),
      graduationYear: graduationYear.trim(),
      location: location.trim(),
      skills,
      interests,
      isPublic: visibility === "public",
      visibility,
      coverImage: coverImage.trim() || undefined,
      avatar: avatar.trim() || profile.avatar,
      socialLinks: {
        website: website.trim() || undefined,
        github: github.trim() || undefined,
        linkedin: linkedin.trim() || undefined,
        twitter: twitter.trim() || undefined,
        scholar: scholar.trim() || undefined,
      },
    })

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Student Profile & Visibility"
      subtitle="Keep your verified scholarly credentials and research interests accurate"
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <p className="text-[11px] text-[#62736b]">
            Changes reflect immediately across the Credento collegiate network.
          </p>
          <div className="flex gap-2">
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
              Save Profile
            </button>
          </div>
        </div>
      }
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4 text-xs max-h-[65vh] overflow-y-auto pr-1"
      >
        {/* Basic Identity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-[#173a35] mb-1">
              Full Name *
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
              Username Handle (@) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-[#728078]">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                  )
                }
                className="w-full p-2.5 pl-7 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35]"
                required
              />
            </div>
          </div>
        </div>

        {/* Headline */}
        <div>
          <label className="block font-bold text-[#173a35] mb-1">
            Professional & Academic Headline *
          </label>
          <input
            type="text"
            placeholder="e.g. Undergraduate Researcher in Computational Biology @ Harvard"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full p-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35]"
            required
          />
        </div>

        {/* Academic Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-[#173a35] mb-1">
              Current Institution *
            </label>
            <input
              type="text"
              placeholder="e.g. Oxford University"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full p-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35]"
              required
            />
          </div>
          <div>
            <label className="block font-bold text-[#173a35] mb-1">
              Faculty / Department
            </label>
            <input
              type="text"
              placeholder="e.g. Department of Computer Science"
              value={facultyOrDepartment}
              onChange={(e) => setFacultyOrDepartment(e.target.value)}
              className="w-full p-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block font-bold text-[#173a35] mb-1">
              Degree & Major *
            </label>
            <input
              type="text"
              placeholder="e.g. B.S. in Computer Science"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full p-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35]"
              required
            />
          </div>
          <div>
            <label className="block font-bold text-[#173a35] mb-1">
              Graduation Year
            </label>
            <input
              type="text"
              placeholder="e.g. 2027"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              className="w-full p-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35]"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block font-bold text-[#173a35] mb-1">
            Location
          </label>
          <input
            type="text"
            placeholder="e.g. Cambridge, MA or Oxford, UK"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35]"
          />
        </div>

        {/* Bio / About */}
        <div>
          <label className="block font-bold text-[#173a35] mb-1">
            About You (Bio & Academic Aspirations)
          </label>
          <textarea
            rows={4}
            placeholder="Share your academic background, research interests, and what you are looking to collaborate on..."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full p-3 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35] leading-relaxed"
          />
        </div>

        {/* Skills & Interests */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-[#173a35] mb-1">
              Skills (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. PyTorch, Technical Writing, Data Analysis"
              value={skillsString}
              onChange={(e) => setSkillsString(e.target.value)}
              className="w-full p-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35]"
            />
          </div>
          <div>
            <label className="block font-bold text-[#173a35] mb-1">
              Academic Interests (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Machine Learning, Open Science, Bioethics"
              value={interestsString}
              onChange={(e) => setInterestsString(e.target.value)}
              className="w-full p-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35]"
            />
          </div>
        </div>

        {/* Social / Professional Links */}
        <div className="pt-2 border-t border-black/[0.06]">
          <h4 className="font-bold text-[#173a35] mb-2 flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-[#c46b4b]" />
            <span>Social & Professional Portfolio Links</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-[#62736b] mb-0.5">
                Personal Website / Portfolio
              </label>
              <input
                type="url"
                placeholder="https://yourportfolio.edu"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full p-2 bg-white rounded-lg border border-black/10 focus:outline-none focus:border-[#173a35] text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#62736b] mb-0.5">
                GitHub URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/username"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="w-full p-2 bg-white rounded-lg border border-black/10 focus:outline-none focus:border-[#173a35] text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#62736b] mb-0.5">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full p-2 bg-white rounded-lg border border-black/10 focus:outline-none focus:border-[#173a35] text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#62736b] mb-0.5">
                Google Scholar / ResearchGate
              </label>
              <input
                type="url"
                placeholder="https://scholar.google.com/citations?user=..."
                value={scholar}
                onChange={(e) => setScholar(e.target.value)}
                className="w-full p-2 bg-white rounded-lg border border-black/10 focus:outline-none focus:border-[#173a35] text-xs"
              />
            </div>
          </div>
        </div>

        {/* Media & Custom Avatars */}
        <div className="pt-2 border-t border-black/[0.06]">
          <h4 className="font-bold text-[#173a35] mb-2 flex items-center gap-1.5">
            <Image className="w-3.5 h-3.5 text-[#c46b4b]" />
            <span>Profile Photo & Cover Banner</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#62736b] mb-0.5">
                Profile Photo Image URL
              </label>
              <input
                type="url"
                placeholder="https://... image URL"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full p-2 bg-white rounded-lg border border-black/10 focus:outline-none focus:border-[#173a35] text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#62736b] mb-0.5">
                Cover Banner Image URL
              </label>
              <input
                type="url"
                placeholder="https://... banner URL"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full p-2 bg-white rounded-lg border border-black/10 focus:outline-none focus:border-[#173a35] text-xs"
              />
            </div>
          </div>
        </div>

        {/* Privacy & Visibility Settings */}
        <div className="pt-2 border-t border-black/[0.06]">
          <h4 className="font-bold text-[#173a35] mb-2 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#173a35]" />
            <span>Profile Privacy Controls</span>
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setVisibility("public")}
              className={`p-3 rounded-xl border text-left transition-all ${
                visibility === "public"
                  ? "bg-[#eef2f0] border-[#173a35] text-[#173a35]"
                  : "bg-white border-black/10 text-[#62736b] hover:border-black/20"
              }`}
            >
              <Globe className="w-4 h-4 mb-1 text-[#173a35]" />
              <p className="font-bold text-xs">Public</p>
              <p className="text-[10px] text-[#728078] leading-tight">
                Visible to all students & opportunities
              </p>
            </button>

            <button
              type="button"
              onClick={() => setVisibility("network")}
              className={`p-3 rounded-xl border text-left transition-all ${
                visibility === "network"
                  ? "bg-[#eef2f0] border-[#173a35] text-[#173a35]"
                  : "bg-white border-black/10 text-[#62736b] hover:border-black/20"
              }`}
            >
              <Users className="w-4 h-4 mb-1 text-[#173a35]" />
              <p className="font-bold text-xs">Network Only</p>
              <p className="text-[10px] text-[#728078] leading-tight">
                Full details only visible to connections
              </p>
            </button>

            <button
              type="button"
              onClick={() => setVisibility("private")}
              className={`p-3 rounded-xl border text-left transition-all ${
                visibility === "private"
                  ? "bg-[#eef2f0] border-[#173a35] text-[#173a35]"
                  : "bg-white border-black/10 text-[#62736b] hover:border-black/20"
              }`}
            >
              <Lock className="w-4 h-4 mb-1 text-[#173a35]" />
              <p className="font-bold text-xs">Private</p>
              <p className="text-[10px] text-[#728078] leading-tight">
                Restricted scholar view
              </p>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
