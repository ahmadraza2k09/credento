import React, { useState, useId } from "react"
import {
  Eye,
  EyeOff,
  KeyRound,
  UserCheck,
  ShieldCheck,
  ArrowRight,
} from "lucide-react"
import { BrandLogo, LogoMark } from "../common/BrandLogo"
import { INITIAL_STUDENTS } from "../../data/mockData"
import { Modal } from "../common/Modal"

interface AuthScreenProps {
  onLogin: (name: string, userId?: string) => void
  onRegister: (name: string, institution: string, email: string) => void
}

function CredentialArtwork() {
  return (
    <div className="credential-art" aria-hidden="true">
      <div className="credential-art__orbit credential-art__orbit--one" />
      <div className="credential-art__orbit credential-art__orbit--two" />
      <div className="credential-card credential-card--back">
        <span />
        <span />
      </div>
      <div className="credential-card credential-card--front">
        <div className="credential-card__seal">
          <LogoMark className="w-8 h-8" />
        </div>
        <div className="credential-card__lines">
          <span />
          <span />
          <span />
        </div>
        <div className="credential-card__notch" />
      </div>
    </div>
  )
}

export function AuthScreen({ onLogin, onRegister }: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [institution, setInstitution] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState("")
  const [recoverySent, setRecoverySent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    const nextErrors: { [key: string]: string } = {}

    if (!name.trim()) nextErrors.name = "Enter your name to continue."
    if (!password) nextErrors.password = "Enter a password to continue."

    if (mode === "register") {
      if (!institution.trim())
        nextErrors.institution = "Enter your university or college."
      if (!email.trim() || !email.includes("@"))
        nextErrors.email = "Enter a valid student email."
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      if (mode === "register") {
        onRegister(name.trim(), institution.trim(), email.trim())
      } else {
        onLogin(name.trim())
      }
    }, 450)
  }

  const handleSelectQuickStudent = (studentId: string, studentName: string) => {
    setIsSubmitting(true)
    setTimeout(() => {
      onLogin(studentName, studentId)
    }, 300)
  }

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!recoveryEmail.trim()) return
    setRecoverySent(true)
    setTimeout(() => {
      setRecoverySent(false)
      setShowForgotModal(false)
      setRecoveryEmail("")
    }, 2000)
  }

  return (
    <main className="login-page">
      {/* Brand panel with rich visual styling */}
      <section className="brand-panel" aria-labelledby="brand-heading">
        <div className="brand-panel__top">
          <BrandLogo inverse />
        </div>
        <div className="brand-panel__content">
          <p className="eyebrow">
            The Student Credential & Networking Platform
          </p>
          <h1 id="brand-heading">Stand Out in the Student World.</h1>
          <p className="brand-panel__support">
            Build your scholarly identity, share verified lab research, connect
            with peers, and discover premier opportunities.
          </p>

          <div className="mt-8 flex items-center gap-3 text-xs text-[#b9c9c0]">
            <div className="flex -space-x-2">
              {INITIAL_STUDENTS.slice(0, 4).map((s) => (
                <img
                  key={s.id}
                  src={s.avatar}
                  alt={s.name}
                  className="w-7 h-7 rounded-[2px] border-2 border-[#173a35] object-cover"
                />
              ))}
            </div>
            <span>Connecting 500+ university scholars worldwide</span>
          </div>
        </div>

        <CredentialArtwork />
        <p className="brand-panel__footnote">
          WordPress editorial clarity meets LinkedIn functional depth.
        </p>
      </section>

      {/* Login / Registration form panel */}
      <section className="login-panel" aria-labelledby="login-heading">
        <div className="login-panel__mobile-logo">
          <BrandLogo />
        </div>

        <div className="login-card">
          <div className="login-card__heading">
            <p className="eyebrow eyebrow--copper">
              {mode === "login" ? "Student access" : "New scholar enrollment"}
            </p>
            <h2 id="login-heading">
              {mode === "login"
                ? "Welcome to Credento"
                : "Create your Student Identity"}
            </h2>
            <p>
              {mode === "login"
                ? "Enter your credentials or choose a sample student below."
                : "Join peers from top universities on Credento."}
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-[#242b29] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Marcus Vance"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) setErrors({ ...errors, name: "" })
                }}
                className={`w-full h-12 px-3.5 text-sm bg-white border rounded-[2px] focus:outline-none focus:border-[#173a35] transition-colors ${
                  errors.name ? "border-[#a33e32]" : "border-[#cbd3ce]"
                }`}
              />
              {errors.name && (
                <p className="text-[11px] text-[#a33e32] mt-1">{errors.name}</p>
              )}
            </div>

            {/* University & Email (only for registration) */}
            {mode === "register" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-[#242b29] mb-1.5">
                    University or College
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Stanford University or MIT"
                    value={institution}
                    onChange={(e) => {
                      setInstitution(e.target.value)
                      if (errors.institution)
                        setErrors({ ...errors, institution: "" })
                    }}
                    className={`w-full h-12 px-3.5 text-sm bg-white border rounded-[2px] focus:outline-none focus:border-[#173a35] transition-colors ${
                      errors.institution
                        ? "border-[#a33e32]"
                        : "border-[#cbd3ce]"
                    }`}
                  />
                  {errors.institution && (
                    <p className="text-[11px] text-[#a33e32] mt-1">
                      {errors.institution}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#242b29] mb-1.5">
                    Academic Email (.edu or university domain)
                  </label>
                  <input
                    type="email"
                    placeholder="name@university.edu"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors({ ...errors, email: "" })
                    }}
                    className={`w-full h-12 px-3.5 text-sm bg-white border rounded-[2px] focus:outline-none focus:border-[#173a35] transition-colors ${
                      errors.email ? "border-[#a33e32]" : "border-[#cbd3ce]"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-[#a33e32] mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#242b29]">
                  Password
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] text-[#c46b4b] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter any password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors({ ...errors, password: "" })
                  }}
                  className={`w-full h-12 pl-3.5 pr-11 text-sm bg-white border rounded-[2px] focus:outline-none focus:border-[#173a35] transition-colors ${
                    errors.password ? "border-[#a33e32]" : "border-[#cbd3ce]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#62736b] hover:text-[#173a35]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-[#a33e32] mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 mt-2 bg-[#173a35] text-white rounded-[2px] text-sm font-semibold hover:bg-[#0e2f2a] transition-all flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {isSubmitting ? (
                <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === "login"
                      ? "Enter Credento"
                      : "Create Student Account"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="mt-4 text-center text-xs text-[#62736b]">
            {mode === "login" ? (
              <span>
                New student to Credento?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register")
                    setErrors({})
                  }}
                  className="font-bold text-[#c46b4b] hover:underline"
                >
                  Join the Network
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login")
                    setErrors({})
                  }}
                  className="font-bold text-[#173a35] hover:underline"
                >
                  Sign in here
                </button>
              </span>
            )}
          </div>

          {/* Instant Student Profile Switcher Pills */}
          <div className="mt-6 pt-5 border-t border-[#d8ddd8]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#173a35] mb-2 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-[#c46b4b]" />
              <span>Or sign in instantly as a demo scholar:</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {INITIAL_STUDENTS.slice(0, 4).map((student) => (
                <button
                  key={student.id}
                  type="button"
                  onClick={() =>
                    handleSelectQuickStudent(student.id, student.name)
                  }
                  className="flex items-center gap-2 p-2 rounded-[2px] bg-white border border-[#cbd3ce] hover:border-[#173a35] text-left transition-colors text-xs group"
                >
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-7 h-7 rounded-[2px] object-cover"
                  />
                  <div className="min-w-0">
                    <span className="font-semibold text-[#173a35] block truncate group-hover:underline">
                      {student.name.split(" ")[0]}
                    </span>
                    <span className="text-[10px] text-[#728078] block truncate">
                      {student.institution.split(" ")[0]}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="login-panel__footer">
          Credento · The Scholarly Network for University Students
        </p>
      </section>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Reset Student Password"
        subtitle="Enter your verified university email to receive a recovery link"
        maxWidth="sm"
        footer={
          !recoverySent ? (
            <button
              type="button"
              onClick={handleForgotSubmit}
              disabled={!recoveryEmail.trim()}
              className="px-4 py-2 bg-[#173a35] text-white rounded-[2px] text-xs font-semibold disabled:opacity-40"
            >
              Send Recovery Link
            </button>
          ) : null
        }
      >
        {recoverySent ? (
          <div className="py-4 text-center text-xs">
            <ShieldCheck className="w-8 h-8 text-[#1b6b47] mx-auto mb-2" />
            <p className="font-bold text-sm text-[#173a35]">Link Sent</p>
            <p className="text-[#62736b] mt-1">
              Check {recoveryEmail} for your single-use sign in token.
            </p>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-[#173a35] mb-1">
                University Email Address
              </label>
              <input
                type="email"
                placeholder="name@university.edu"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#cbd3ce] rounded-[2px] focus:outline-none focus:border-[#173a35]"
                required
                autoFocus
              />
            </div>
            <p className="text-[11px] text-[#728078]">
              Password reset links are valid for 60 minutes and verified against
              student enrollment directories.
            </p>
          </form>
        )}
      </Modal>
    </main>
  )
}
