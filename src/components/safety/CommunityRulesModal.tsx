import React from "react"
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Lock,
  UserX,
  Award,
} from "lucide-react"
import { Modal } from "../common/Modal"

interface CommunityRulesModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept?: () => void
  showAcceptButton?: boolean
}

export function CommunityRulesModal({
  isOpen,
  onClose,
  onAccept,
  showAcceptButton = false,
}: CommunityRulesModalProps) {
  const rules = [
    {
      title: "1. Respectful Academic Discourse",
      description:
        "Credento is an academic and professional network for university scholars. Maintain collegiate integrity, civil dialogue, and constructive feedback across all discussions, messages, and project collaborations.",
      icon: Scale,
    },
    {
      title: "2. Zero Tolerance for Harassment & Hate Speech",
      description:
        "Harassment, intimidation, hate speech, bullying, defamation, or discriminatory language targeting identity, background, gender, or beliefs results in immediate, permanent account termination.",
      icon: AlertTriangle,
    },
    {
      title: "3. Genuine Identity & Academic Truthfulness",
      description:
        "Profiles must represent genuine registered students. Impersonation of other students, faculty, or professionals, and fraudulent academic or credential claims are strictly prohibited.",
      icon: ShieldCheck,
    },
    {
      title: "4. Authentic Organizational Verification",
      description:
        "Access Center organizations must provide legitimate, non-misleading documentation. Services listed must be genuine and delivered free or at zero cost to students and community beneficiaries.",
      icon: Award,
    },
    {
      title: "5. Privacy & Data Protection",
      description:
        "Never disclose confidential research data, non-consensual contact details, or private peer communications. Respect user privacy settings and campus policies.",
      icon: Lock,
    },
    {
      title: "6. No Spam or Commercial Exploitation",
      description:
        "Spamming, automated scraping, uninvited commercial solicitation, predatory MLM promotion, or assignment outsourcing for commercial gain is prohibited.",
      icon: UserX,
    },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Credento Community Standards & Safety Oath"
      subtitle="The foundational rules governing student conduct, research integrity, and Access Center collaboration."
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <p className="text-[11px] text-[#62736b]">
            All members and organizations are bound by these principles.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#62736b] hover:text-[#242b29] rounded-xl hover:bg-black/5"
            >
              Close
            </button>
            {showAcceptButton && (
              <button
                type="button"
                onClick={() => {
                  onAccept?.()
                  onClose()
                }}
                className="btn-3d-primary px-5 py-2 text-xs font-semibold"
              >
                I Agree & Pledge
              </button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        <div className="p-3.5 bg-[#f0f4f2] border border-[#cbd3ce] rounded-2xl flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#173a35] shrink-0 mt-0.5" />
          <div className="text-xs text-[#242b29] leading-relaxed">
            <p className="font-bold text-[#173a35] mb-0.5">
              The Credento Collegiate Standard
            </p>
            Credento was founded to restore dignity, scholarly focus, and
            genuine mentorship to student professional networking. By entering
            this platform, you agree to uphold these tenets.
          </div>
        </div>

        <div className="grid gap-3">
          {rules.map((rule, idx) => {
            const Icon = rule.icon
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-black/[0.06] bg-white hover:border-[#173a35]/20 transition-all text-xs"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-[#eef2f0] text-[#173a35] flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-bold text-[#173a35]">{rule.title}</h4>
                </div>
                <p className="text-[#62736b] leading-relaxed pl-8">
                  {rule.description}
                </p>
              </div>
            )
          })}
        </div>

        <div className="p-3 bg-[#fdfbf7] border border-[#e4ded0] rounded-xl text-[11px] text-[#728078] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#1b6b47] shrink-0" />
          <span>
            Violations are investigated promptly by Credento Staff with
            proportional moderation including permanent suspension.
          </span>
        </div>
      </div>
    </Modal>
  )
}
