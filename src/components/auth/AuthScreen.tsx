import React, { useState } from "react"
import {
  Eye,
  EyeOff,
  UserCheck,
  ShieldCheck,
  ArrowRight,
} from "lucide-react"
import { BrandLogo } from "../common/BrandLogo"
import { INITIAL_STUDENTS } from "../../data/mockData"
import { Modal } from "../common/Modal"

interface AuthScreenProps {
  onLogin: (name: string, userId?: string) => void
  onRegister: (name: string, institution: string, email: string) => void
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
      {/* Brand panel with clean, focused messaging */}
      <section className="brand-panel" aria-labelledby="brand-heading">
        <div className="brand-panel__top">
          <BrandLogo inverse />
        </div>
        <div className="brand-panel__content">
          <h1 id="brand-heading">
            Stand out in the student world with your credento profile.
          </h1>
        </div>
      </section>

      {/* Login / Registration form panel */}
      <section className="login-panel" aria-labelledby="login-heading">
        <div className="login-panel__mobile-logo mb-6">
          <BrandLogo />
        </div>

        <div className="login-card bg-white rounded-3xl p-6 sm:p-9 shadow-[0_2px_4px_rgba(0,0,0,0.03),0_12px_28px_-6px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] border border-black/[0.04]">
          <div className="login-card__heading mb-6">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#c46b4b] mb-1.5">
              {mode === "login" ? "Student access" : "New scholar enrollment"}
            </p>
            <h2 id="login-heading" className="text-2xl sm:text-3xl font-bold text-[#173a35] tracking-tight">
              {mode === "login"
                ? "Welcome to Credento"
                : "Create your Student Identity"}
            </h2>
            <p className="text-xs sm:text-sm text-[#62736b] mt-1.5">
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
                className={`w-full h-12 px-4 text-sm bg-white rounded-xl focus:outline-none focus:border-[#173a35] focus:ring-2 focus:ring-[#173a35]/20 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04)] border transition-all ${
                  errors.name ? "border-[#a33e32]" : "border-black/10"
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
                    className={`w-full h-12 px-4 text-sm bg-white rounded-xl focus:outline-none focus:border-[#173a35] focus:ring-2 focus:ring-[#173a35]/20 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04)] border transition-all ${
                      errors.institution
                        ? "border-[#a33e32]"
                        : "border-black/10"
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
                    className={`w-full h-12 px-4 text-sm bg-white rounded-xl focus:outline-none focus:border-[#173a35] focus:ring-2 focus:ring-[#173a35]/20 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04)] border transition-all ${
                      errors.email ? "border-[#a33e32]" : "border-black/10"
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
                    className="text-[11px] text-[#c46b4b] hover:underline font-medium"
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
                  className={`w-full h-12 pl-4 pr-11 text-sm bg-white rounded-xl focus:outline-none focus:border-[#173a35] focus:ring-2 focus:ring-[#173a35]/20 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04)] border transition-all ${
                    errors.password ? "border-[#a33e32]" : "border-black/10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#62736b] hover:text-[#173a35] transition-colors"
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
              className="btn-3d-primary w-full h-12 mt-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
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
          <div className="mt-6 pt-5 border-t border-black/[0.06]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#173a35] mb-2.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#c46b4b]" />
              <span>Or sign in instantly as a demo scholar:</span>
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {INITIAL_STUDENTS.slice(0, 4).map((student) => (
                <button
                  key={student.id}
                  type="button"
                  onClick={() =>
                    handleSelectQuickStudent(student.id, student.name)
                  }
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#f8faf9] hover:bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 border border-black/[0.04] text-left transition-all text-xs group cursor-pointer"
                >
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-8 h-8 rounded-full object-cover shadow-sm shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="font-semibold text-[#173a35] block truncate group-hover:text-[#c46b4b] transition-colors">
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

        <p className="login-panel__footer mt-6 text-center text-xs text-[#8b9891]">
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
              className="btn-3d-primary px-4 py-2 text-xs font-semibold rounded-xl disabled:opacity-40"
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
                className="w-full p-3 bg-white rounded-xl focus:outline-none focus:border-[#173a35] focus:ring-2 focus:ring-[#173a35]/20 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04)] border border-black/10"
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

