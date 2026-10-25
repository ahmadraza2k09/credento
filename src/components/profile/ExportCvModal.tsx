import React, { useState } from "react"
import { Printer, Copy, Check, ExternalLink, Download, FileText } from "lucide-react"
import { StudentProfile } from "../../types"
import { Modal } from "../common/Modal"

interface ExportCvModalProps {
  isOpen: boolean
  onClose: () => void
  profile: StudentProfile
}

export function ExportCvModal({
  isOpen,
  onClose,
  profile,
}: ExportCvModalProps) {
  const [copied, setCopied] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const handleCopyText = () => {
    const lines = [
      `${profile.name.toUpperCase()}`,
      `${profile.headline}`,
      `${profile.institution} — ${profile.degree}`,
      `Location: ${profile.location} | Email: ${profile.email || "academic@credento.edu"}`,
      "",
      "--- ACADEMIC SUMMARY ---",
      profile.about,
      "",
      "--- EDUCATION ---",
      ...profile.education.map(
        (e) =>
          `• ${e.degree} in ${e.fieldOfStudy}\n  ${e.institution} (${e.startYear} - ${e.endYear})\n  GPA: ${e.gradeOrGpa || "N/A"}\n  Honors/Activities: ${e.activities || "N/A"}`,
      ),
      "",
      "--- SCHOLARLY PROJECTS & PUBLICATIONS ---",
      ...profile.portfolioItems.map(
        (p) =>
          `• [${p.type.toUpperCase()}] ${p.title} (${p.date})\n  ${p.organization ? p.organization + "\n  " : ""}${p.description}\n  Link: ${p.linkUrl || "N/A"}`,
      ),
      "",
      "--- CORE SKILLS & METHODOLOGIES ---",
      profile.skills.join(", "),
    ]

    navigator.clipboard.writeText(lines.join("\n"))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Academic CV & Portfolio Export"
      subtitle="Standardized university curriculum vitae formatted for grants, research positions, and applications"
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-[#62736b]">
            <span>Verified student credentials via Credento</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="btn-3d-secondary flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#1b6b47]" />
                  <span>Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Text CV</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="btn-3d-primary flex items-center gap-1.5 px-4 py-2 text-xs font-semibold"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      }
    >
      {/* Printable Sheet Preview */}
      <div className="bg-white border border-[#e2e8e3] rounded-2xl p-6 sm:p-8 shadow-inner font-sans text-[#1f2724] space-y-6 max-h-[65vh] overflow-y-auto">
        {/* CV Header */}
        <div className="border-b border-[#173a35]/20 pb-4 text-center sm:text-left sm:flex sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#173a35]">
              {profile.name}
            </h1>
            <p className="text-xs font-medium text-[#62736b] mt-0.5">
              {profile.headline}
            </p>
            <p className="text-[11px] text-[#728078] mt-1">
              {profile.institution} • {profile.location}
            </p>
          </div>

          <div className="mt-3 sm:mt-0 text-center sm:text-right text-[11px] text-[#62736b] font-mono">
            <p>{profile.email || "student@university.edu"}</p>
            <p className="text-[#173a35] font-semibold mt-0.5">
              credento.edu/{profile.id}
            </p>
          </div>
        </div>

        {/* Academic Objective / About */}
        <div>
          <h2 className="text-xs uppercase tracking-widest font-bold text-[#173a35] border-b border-[#cbd3ce] pb-1 mb-2">
            Scholarly Focus & Background
          </h2>
          <p className="text-xs text-[#35403c] leading-relaxed">
            {profile.about}
          </p>
        </div>

        {/* Education Section */}
        <div>
          <h2 className="text-xs uppercase tracking-widest font-bold text-[#173a35] border-b border-[#cbd3ce] pb-1 mb-2.5">
            Academic Background & Education
          </h2>
          <div className="space-y-3">
            {profile.education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="flex items-start justify-between">
                  <span className="font-bold text-[#173a35]">
                    {edu.institution}
                  </span>
                  <span className="font-mono text-[11px] text-[#728078]">
                    {edu.startYear} – {edu.endYear}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[#242b29] font-medium">
                    {edu.degree} in {edu.fieldOfStudy}
                  </span>
                  {edu.gradeOrGpa && (
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-[#edf6f0] text-[#173a35] rounded-full">
                      {edu.gradeOrGpa}
                    </span>
                  )}
                </div>
                {edu.activities && (
                  <p className="text-[11px] text-[#62736b] mt-1 italic">
                    Activities: {edu.activities}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio, Research & Publications */}
        {profile.portfolioItems.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-widest font-bold text-[#173a35] border-b border-[#cbd3ce] pb-1 mb-2.5">
              Research, Publications & Significant Projects
            </h2>
            <div className="space-y-3.5">
              {profile.portfolioItems.map((item) => (
                <div key={item.id} className="text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-[#173a35]">
                        {item.title}
                      </span>
                      {item.organization && (
                        <span className="text-[#62736b] ml-1.5 font-medium">
                          — {item.organization}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[10px] text-[#728078] shrink-0">
                      {item.date}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#4d5b54] mt-1 leading-relaxed">
                    {item.description}
                  </p>
                  {item.linkUrl && (
                    <span className="text-[10px] font-mono text-[#c46b4b] mt-0.5 block truncate">
                      {item.linkUrl}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills & Competencies */}
        <div>
          <h2 className="text-xs uppercase tracking-widest font-bold text-[#173a35] border-b border-[#cbd3ce] pb-1 mb-2">
            Technical & Scholarly Competencies
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {profile.skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono px-2.5 py-0.5 bg-[#f4f6f5] border border-[#d8ddd8] rounded-full text-[#173a35]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
