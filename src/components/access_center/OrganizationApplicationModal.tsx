import React, { useState } from "react"
import { Modal } from "../common/Modal"
import { AccessCenterOrganization, OrganizationType } from "../../types"
import {
  Building,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Trash2,
  Send,
} from "lucide-react"

interface OrganizationApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitApplication: (params: any) => void
}

export function OrganizationApplicationModal({
  isOpen,
  onClose,
  onSubmitApplication,
}: OrganizationApplicationModalProps) {
  const [name, setName] = useState("")
  const [tagline, setTagline] = useState("")
  const [type, setType] = useState<OrganizationType>("ngo")
  const [description, setDescription] = useState("")
  const [mission, setMission] = useState("")
  const [website, setWebsite] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [applicantName, setApplicantName] = useState("")
  const [applicantEmail, setApplicantEmail] = useState("")
  const [supportingInfo, setSupportingInfo] = useState("")
  const [serviceDeliveryMode, setServiceDeliveryMode] =
    useState<"online" | "in_person" | "hybrid">("online")

  // Selected beneficiaries
  const [beneficiaries, setBeneficiaries] = useState<string[]>([
    "Students",
    "Schools & Educators",
  ])

  // Services offered
  const [services, setServices] = useState<Array<{
    title: string
    category: any
    description: string
    targetBeneficiaries: string[]
    deliveryMode: any
    isFree: boolean
    leadTime: string
    eligibilityCriteria?: string
  }>>([
    {
      title: "",
      category: "digital_tech",
      description: "",
      targetBeneficiaries: ["Students"],
      deliveryMode: "online",
      isFree: true,
      leadTime: "3-5 business days",
    },
  ])

  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const toggleBeneficiary = (b: string) => {
    setBeneficiaries((prev) =>
      prev.includes(b) ? prev.filter((item) => item !== b) : [...prev, b],
    )
  }

  const handleAddService = () => {
    setServices([
      ...services,
      {
        title: "",
        category: "consulting_guidance",
        description: "",
        targetBeneficiaries: ["Students"],
        deliveryMode: "online",
        isFree: true,
        leadTime: "3-5 business days",
      },
    ])
  }

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, idx) => idx !== index))
  }

  const handleServiceChange = (index: number, field: string, val: any) => {
    const updated = [...services]
    updated[index] = { ...updated[index], [field]: val }
    setServices(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !name.trim() ||
      !description.trim() ||
      !mission.trim() ||
      !email.trim() ||
      !applicantName.trim()
    ) {
      setError("Please fill out all required organization details.")
      return
    }

    const validServices = services.filter((s) => s.title.trim())
    if (validServices.length === 0) {
      setError(
        "Please specify at least one free service your organization will provide.",
      )
      return
    }

    onSubmitApplication({
      name: name.trim(),
      tagline: tagline.trim() || "Free Community Services & Enablement",
      type,
      description: description.trim(),
      mission: mission.trim(),
      website: website.trim() || "https://example.org",
      email: email.trim(),
      phone: phone.trim() || "+1 (555) 000-0000",
      location: location.trim() || "Global Remote",
      targetBeneficiaries: beneficiaries,
      serviceDeliveryMode,
      applicantName: applicantName.trim(),
      applicantEmail: applicantEmail.trim() || email.trim(),
      supportingInfo: supportingInfo.trim(),
      services: validServices,
    })

    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      onClose()
    }, 2500)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply to Create a Credento Access Center"
      subtitle="Eligible NGOs, youth organizations, schools, clinics, and technology groups provide free services to students and communities."
      maxWidth="lg"
      footer={
        !submitted ? (
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] text-[#62736b]">
              All applications undergo Credento Staff review prior to public
              activation.
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
                <span>Submit Application for Review</span>
              </button>
            </div>
          </div>
        ) : null
      }
    >
      {submitted ? (
        <div className="py-8 text-center text-xs space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#edf6f0] text-[#155738] flex items-center justify-center mx-auto mb-3 shadow-sm border border-[#b8dec4]">
            <CheckCircle2 className="w-7 h-7 text-[#1b6b47]" />
          </div>
          <h3 className="font-bold text-base text-[#173a35]">
            Access Center Application Submitted!
          </h3>
          <p className="text-[#62736b] max-w-sm mx-auto leading-relaxed">
            Your application for <strong>{name}</strong> is now under Credento
            Admin review. Approved centers receive a dedicated public page and
            organization management dashboard.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 text-xs max-h-[65vh] overflow-y-auto pr-1"
        >
          {error && (
            <div className="p-3 bg-[#fdf3f2] border border-[#f1c5c0] rounded-xl text-xs text-[#a33e32]">
              {error}
            </div>
          )}

          <div className="p-3 bg-[#f0f4f2] border border-[#cbd3ce] rounded-xl text-xs text-[#242b29] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#173a35] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Credento Access Center Policy:</strong> Organizations must
              provide legitimate free services (website setup, digital
              assistance, educational guidance, or community support) at zero
              cost to students, clinics, or schools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#173a35] mb-1">
                Organization Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Youth Digital Alliance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35]"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-[#173a35] mb-1">
                Organization Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as OrganizationType)}
                className="w-full p-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35]"
              >
                <option value="ngo">Non-Governmental Organization (NGO)</option>
                <option value="youth_org">Youth Organization</option>
                <option value="educational">
                  Educational / Academic Institution
                </option>
                <option value="technology">
                  Technology & Digital Organization
                </option>
                <option value="consulting">Consulting Organization</option>
                <option value="hospital_clinic">
                  Hospital / Community Clinic
                </option>
                <option value="school">Primary / Secondary School</option>
                <option value="social_enterprise">Social Enterprise</option>
                <option value="other">Other Community Organization</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#173a35] mb-1">
              Center Tagline & Purpose
            </label>
            <input
              type="text"
              placeholder="e.g. Free Digital Infrastructure & Technical Setup for All"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full p-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#173a35] mb-1">
                Official Website *
              </label>
              <input
                type="url"
                placeholder="https://yourorganization.org"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full p-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35]"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-[#173a35] mb-1">
                Organization Email *
              </label>
              <input
                type="email"
                placeholder="contact@yourorganization.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#173a35] mb-1">
              Mission Statement *
            </label>
            <textarea
              rows={2}
              placeholder="What is your organization's core mission for students and the community?"
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              className="w-full p-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35]"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-[#173a35] mb-1">
              Organization Background & Overview *
            </label>
            <textarea
              rows={3}
              placeholder="Describe your history, team capacity, and existing initiatives..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35]"
              required
            />
          </div>

          {/* Target Beneficiaries Checkboxes */}
          <div>
            <label className="block font-bold text-[#173a35] mb-1.5">
              Target Beneficiaries (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                "Students",
                "Small Businesses",
                "Schools & Educators",
                "Hospitals & Clinics",
                "Community Initiatives",
                "Student Non-Profits",
              ].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleBeneficiary(b)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    beneficiaries.includes(b)
                      ? "bg-[#173a35] text-white"
                      : "bg-[#f4f6f5] text-[#62736b] hover:bg-[#eef2f0]"
                  }`}
                >
                  {beneficiaries.includes(b) ? "✓ " : "+ "} {b}
                </button>
              ))}
            </div>
          </div>

          {/* Services to be offered */}
          <div className="pt-2 border-t border-black/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-[#173a35]">
                  Proposed Free Services *
                </h4>
                <p className="text-[11px] text-[#728078]">
                  Detail the free services your Access Center will deliver to
                  students and institutions.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddService}
                className="btn-3d-secondary flex items-center gap-1 px-3 py-1 text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Service</span>
              </button>
            </div>

            {services.map((svc, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-[#f8faf9] rounded-xl border border-black/[0.04] space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#173a35]">
                    Service #{idx + 1}
                  </span>
                  {services.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveService(idx)}
                      className="text-[#a33e32] hover:text-[#7f1d1d] p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Service Title (e.g. Free Website Creation)"
                    value={svc.title}
                    onChange={(e) =>
                      handleServiceChange(idx, "title", e.target.value)
                    }
                    className="w-full p-2 bg-white rounded-lg border border-black/10 focus:outline-none text-xs"
                    required
                  />
                  <select
                    value={svc.category}
                    onChange={(e) =>
                      handleServiceChange(idx, "category", e.target.value)
                    }
                    className="w-full p-2 bg-white rounded-lg border border-black/10 focus:outline-none text-xs"
                  >
                    <option value="digital_tech">
                      Digital Setup & Technology
                    </option>
                    <option value="consulting_guidance">
                      Consulting & Awareness
                    </option>
                    <option value="education">Education & Workshops</option>
                    <option value="health_wellbeing">
                      Healthcare & Wellbeing
                    </option>
                    <option value="community_support">
                      Community Non-Profit Support
                    </option>
                  </select>
                </div>

                <textarea
                  rows={2}
                  placeholder="Describe what is provided, deliverables, and who can request it..."
                  value={svc.description}
                  onChange={(e) =>
                    handleServiceChange(idx, "description", e.target.value)
                  }
                  className="w-full p-2 bg-white rounded-lg border border-black/10 focus:outline-none text-xs"
                  required
                />
              </div>
            ))}
          </div>

          {/* Applicant Contact */}
          <div className="pt-2 border-t border-black/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#173a35] mb-1">
                Authorized Representative Name *
              </label>
              <input
                type="text"
                placeholder="Full name"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full p-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35]"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-[#173a35] mb-1">
                Representative Email *
              </label>
              <input
                type="email"
                placeholder="representative@organization.org"
                value={applicantEmail}
                onChange={(e) => setApplicantEmail(e.target.value)}
                className="w-full p-2.5 bg-white rounded-xl border border-black/10 focus:outline-none focus:border-[#173a35]"
                required
              />
            </div>
          </div>
        </form>
      )}
    </Modal>
  )
}
