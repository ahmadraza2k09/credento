import React, { useState } from "react"
import { Modal } from "../common/Modal"
import {
  AccessCenterOrganization,
  AccessCenterService,
  StudentProfile,
} from "../../types"
import {
  Building,
  Globe,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  HelpCircle,
  ExternalLink,
} from "lucide-react"
import { ServiceRequestModal } from "./ServiceRequestModal"

interface AccessCenterDetailModalProps {
  isOpen: boolean
  onClose: () => void
  center: AccessCenterOrganization | null
  currentUser: StudentProfile | null
  onSubmitRequest: (params: any) => void
}

export function AccessCenterDetailModal({
  isOpen,
  onClose,
  center,
  currentUser,
  onSubmitRequest,
}: AccessCenterDetailModalProps) {
  const [selectedServiceToRequest, setSelectedServiceToRequest] =
    useState<AccessCenterService | null>(null)

  if (!center) return null

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={center.name}
        subtitle={center.tagline}
        maxWidth="xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1.5 text-xs text-[#1b6b47] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#1b6b47]" />
              <span>Verified Credento Access Partner</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-[#62736b] hover:text-[#242b29] rounded-xl hover:bg-black/5"
            >
              Close Center
            </button>
          </div>
        }
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
          {/* Header Banner */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#173a35] to-[#255049] text-white p-6 sm:p-7 shadow-sm">
            {center.coverImage && (
              <img
                src={center.coverImage}
                alt={center.name}
                className="absolute inset-0 w-full h-full object-cover opacity-20"
              />
            )}
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img
                src={center.logo}
                alt={center.name}
                className="w-16 h-16 rounded-2xl object-cover bg-white p-1 border-2 border-white/20 shadow-md shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                    {center.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-semibold uppercase tracking-wider text-white">
                    {center.type.replace("_", " ")}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-white/90 mt-1 leading-snug">
                  {center.tagline}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/75 mt-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{center.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    <a
                      href={center.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-white font-medium"
                    >
                      Official Website
                    </a>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{center.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Organization Background */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="md:col-span-2 p-5 bg-[#f8faf9] rounded-2xl border border-black/[0.04] space-y-3">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#c46b4b] mb-1">
                  Our Mission
                </h3>
                <p className="text-[#242b29] text-xs sm:text-sm leading-relaxed font-serif font-medium">
                  "{center.mission}"
                </p>
              </div>

              <div>
                <h3 className="font-bold text-xs text-[#173a35] mb-1">
                  About This Access Center
                </h3>
                <p className="text-[#4d5b54] leading-relaxed">
                  {center.description}
                </p>
              </div>
            </div>

            <div className="p-5 bg-[#f8faf9] rounded-2xl border border-black/[0.04] space-y-3">
              <h3 className="font-bold text-xs text-[#173a35] flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#c46b4b]" />
                <span>Who Can Use This Center?</span>
              </h3>
              <p className="text-[11px] text-[#62736b]">
                Services from this Access Center are completely free for
                qualifying beneficiaries:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {center.targetBeneficiaries.map((b, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-white border border-black/5 rounded-lg text-[11px] text-[#173a35] font-semibold"
                  >
                    ✓ {b}
                  </span>
                ))}
              </div>
              <div className="pt-2 border-t border-black/[0.04] text-[11px] text-[#728078]">
                <strong>Delivery Mode:</strong>{" "}
                <span className="capitalize">{center.serviceDeliveryMode}</span>
              </div>
            </div>
          </div>

          {/* Available Free Services List */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h3 className="font-serif font-bold text-base text-[#173a35]">
                  Free Services Offered
                </h3>
                <p className="text-xs text-[#62736b]">
                  All services are 100% subsidized by {center.name} through
                  Credento.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#1b6b47] bg-[#edf6f0] px-3 py-1 rounded-full border border-[#b8dec4]">
                {center.services.length} Active Services
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {center.services.map((svc) => (
                <div
                  key={svc.id}
                  className="p-5 rounded-2xl bg-white border border-black/[0.06] hover:border-[#173a35]/30 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1b6b47] bg-[#edf6f0] px-2.5 py-0.5 rounded-full">
                        100% Free
                      </span>
                      <span className="text-[11px] font-mono text-[#728078]">
                        Lead: {svc.leadTime}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-[#173a35]">
                      {svc.title}
                    </h4>

                    <p className="text-xs text-[#4d5b54] leading-relaxed">
                      {svc.description}
                    </p>

                    {svc.eligibilityCriteria && (
                      <div className="p-2.5 bg-[#f8faf9] rounded-xl border border-black/[0.04] text-[11px] text-[#62736b]">
                        <strong className="text-[#173a35]">Eligibility:</strong>{" "}
                        {svc.eligibilityCriteria}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 pt-1">
                      {svc.targetBeneficiaries.map((b, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-[#f0f4f2] text-[#173a35] px-2 py-0.5 rounded"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-black/[0.04]">
                    <button
                      type="button"
                      onClick={() => setSelectedServiceToRequest(svc)}
                      className="btn-3d-primary w-full py-2 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Request This Free Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Service Request Modal */}
      {selectedServiceToRequest && (
        <ServiceRequestModal
          isOpen={!!selectedServiceToRequest}
          onClose={() => setSelectedServiceToRequest(null)}
          center={center}
          service={selectedServiceToRequest}
          currentUser={currentUser}
          onSubmit={(params) => {
            onSubmitRequest(params)
          }}
        />
      )}
    </>
  )
}
