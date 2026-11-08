import React, { useState } from "react"
import {
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  CheckCircle2,
} from "lucide-react"
import { BrandLogo } from "../common/BrandLogo"
import { Modal } from "../common/Modal"
import { CommunityRulesModal } from "../safety/CommunityRulesModal"
import {
  getAllUsers,
  loginStudent,
  registerStudent,
  setCurrentUserId,
} from "../../services/storage"
import { StudentProfile } from "../../types"

interface AuthScreenProps {
  onLoginSuccess: (user: StudentProfile) => void
  onAdminLoginSuccess: () => void
}

export function AuthScreen({
  onLoginSuccess,
  onAdminLoginSuccess,
}: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "register">("login")

  // Register form fields: First Name, Last Name, Email, Password only
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [showRegPassword, setShowRegPassword] = useState(false)

  // Login form fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Modals & UI states
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showRulesModal, setShowRulesModal] = useState(false)
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState("")
  const [recoverySent, setRecoverySent] = useState(false)

  // Check existing registered users in the database
  const registeredUsers = getAllUsers().filter(
    (u) => u.email !== "team@credento.world" && u.id !== "credento-admin",
  )

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    const nextErrors: { [key: string]: string } = {}

    if (!firstName.trim()) nextErrors.firstName = "Enter your first name."
    if (!lastName.trim()) nextErrors.lastName = "Enter your last name."

    if (!regEmail.trim() || !regEmail.includes("@")) {
      nextErrors.regEmail = "Enter a valid email address."
    } else if (
      registeredUsers.some(
        (u) => u.email?.toLowerCase() === regEmail.trim().toLowerCase(),
      )
    ) {
      nextErrors.regEmail = "An account with this email already exists."
    }

    if (!regPassword || regPassword.length < 4) {
      nextErrors.regPassword = "Password must be at least 4 characters."
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    try {
      const newStudent = registerStudent({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: regEmail.trim(),
        password: regPassword,
      })

      setIsSubmitting(false)
      onLoginSuccess(newStudent)
    } catch (err: any) {
      setIsSubmitting(false)
      setErrors({ form: err?.message || "Failed to register account." })
    }
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    const nextErrors: { [key: string]: string } = {}
    if (!email.trim()) nextErrors.email = "Enter your email or username."
    if (!password) nextErrors.password = "Enter your password."

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    const res = loginStudent(email.trim(), password)
    setIsSubmitting(false)

    if (res.success && res.user) {
      if (
        res.isAdmin ||
        email.trim().toLowerCase() === "team@credento.world" ||
        email.trim().toLowerCase() === "team"
      ) {
        onAdminLoginSuccess()
      } else {
        onLoginSuccess(res.user)
      }
    } else {
      setErrors({ form: res.error || "Authentication failed." })
    }
  }

  const handleQuickSwitchUser = (userId: string) => {
    setCurrentUserId(userId)
    const user = registeredUsers.find((u) => u.id === userId)
    if (user) {
      onLoginSuccess(user)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-2xl border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Formal Brand Panel */}
        <section
          className="md:col-span-5 bg-[#173a35] text-white p-7 sm:p-10 flex flex-col justify-between"
          aria-labelledby="brand-heading"
        >
          <div>
            <BrandLogo inverse />
            <div className="mt-8 sm:mt-12 space-y-4">
              <h1
                id="brand-heading"
                className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug"
              >
                Student Academic & Opportunity Network
              </h1>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
                Connect with authentic collegiate peers, build your verified
                academic profile, access free services via the Access Center,
                and discover verified opportunities.
              </p>

              <div className="pt-4 space-y-2.5 text-xs text-white/85">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#c46b4b] shrink-0" />
                  <span>Authentic registered scholars only</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#c46b4b] shrink-0" />
                  <span>Free community Access Center services</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#c46b4b] shrink-0" />
                  <span>Zero vanity algorithms or simulated profiles</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 text-[11px] text-white/50 flex items-center justify-between">
            <span>© 2026 Credento</span>
            <span>Student Academic Network</span>
          </div>
        </section>

        {/* Right Authentication Form */}
        <section
          className="md:col-span-7 p-6 sm:p-9 flex flex-col justify-center bg-white"
          aria-labelledby="login-heading"
        >
          <div className="w-full max-w-md mx-auto">
            {/* Header with minimal toggle */}
            <div className="mb-6">
              <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
                <h2
                  id="login-heading"
                  className="text-lg sm:text-xl font-bold text-[#173a35] tracking-tight"
                >
                  {mode === "login"
                    ? "Sign In to Credento"
                    : "Create Student Account"}
                </h2>
                <div className="flex items-center gap-1 bg-[#f0f4f2] p-1 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login")
                      setErrors({})
                    }}
                    className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                      mode === "login"
                        ? "bg-white text-[#173a35] shadow-xs"
                        : "text-[#62736b] hover:text-[#173a35]"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register")
                      setErrors({})
                    }}
                    className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                      mode === "register"
                        ? "bg-white text-[#173a35] shadow-xs"
                        : "text-[#62736b] hover:text-[#173a35]"
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>

            {errors.form && (
              <div className="mb-4 p-3 bg-[#fdf3f2] border border-[#f1c5c0] rounded-xl text-xs text-[#a33e32]">
                {errors.form}
              </div>
            )}

            {/* REGISTER FORM: First Name, Last Name, Email, Password only */}
            {mode === "register" ? (
              <form
                onSubmit={handleRegisterSubmit}
                noValidate
                className="space-y-3.5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#242b29] mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Maya"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value)
                        if (errors.firstName)
                          setErrors({ ...errors, firstName: "" })
                      }}
                      className={`w-full h-11 px-3 text-xs bg-white rounded-lg focus:outline-none focus:border-[#173a35] focus:ring-2 focus:ring-[#173a35]/15 border transition-all ${
                        errors.firstName
                          ? "border-[#a33e32]"
                          : "border-black/15"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-[11px] text-[#a33e32] mt-0.5">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#242b29] mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lin"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value)
                        if (errors.lastName)
                          setErrors({ ...errors, lastName: "" })
                      }}
                      className={`w-full h-11 px-3 text-xs bg-white rounded-lg focus:outline-none focus:border-[#173a35] focus:ring-2 focus:ring-[#173a35]/15 border transition-all ${
                        errors.lastName
                          ? "border-[#a33e32]"
                          : "border-black/15"
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-[11px] text-[#a33e32] mt-0.5">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#242b29] mb-1">
                    Student Email *
                  </label>
                  <input
                    type="email"
                    placeholder="name@university.edu"
                    value={regEmail}
                    onChange={(e) => {
                      setRegEmail(e.target.value)
                      if (errors.regEmail)
                        setErrors({ ...errors, regEmail: "" })
                    }}
                    className={`w-full h-11 px-3 text-xs bg-white rounded-lg focus:outline-none focus:border-[#173a35] focus:ring-2 focus:ring-[#173a35]/15 border transition-all ${
                      errors.regEmail
                        ? "border-[#a33e32]"
                        : "border-black/15"
                    }`}
                  />
                  {errors.regEmail && (
                    <p className="text-[11px] text-[#a33e32] mt-0.5">
                      {errors.regEmail}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#242b29] mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? "text" : "password"}
                      placeholder="At least 4 characters"
                      value={regPassword}
                      onChange={(e) => {
                        setRegPassword(e.target.value)
                        if (errors.regPassword)
                          setErrors({ ...errors, regPassword: "" })
                      }}
                      className={`w-full h-11 pl-3 pr-10 text-xs bg-white rounded-lg focus:outline-none focus:border-[#173a35] focus:ring-2 focus:ring-[#173a35]/15 border transition-all ${
                        errors.regPassword
                          ? "border-[#a33e32]"
                          : "border-black/15"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-3 text-[#62736b] hover:text-[#173a35]"
                    >
                      {showRegPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.regPassword && (
                    <p className="text-[11px] text-[#a33e32] mt-0.5">
                      {errors.regPassword}
                    </p>
                  )}
                </div>

                <p className="text-[11px] text-[#62736b] pt-0.5">
                  Institution, degree, projects, and skills can be added or updated anytime from your profile.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-3d-primary w-full h-11 mt-1 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* LOGIN FORM */
              <form
                onSubmit={handleLoginSubmit}
                noValidate
                className="space-y-3.5"
              >
                <div>
                  <label className="block text-xs font-semibold text-[#242b29] mb-1">
                    Student Email or Username
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. name@university.edu or @username"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors({ ...errors, email: "" })
                    }}
                    className={`w-full h-11 px-3 text-xs bg-white rounded-lg focus:outline-none focus:border-[#173a35] focus:ring-2 focus:ring-[#173a35]/15 border transition-all ${
                      errors.email ? "border-[#a33e32]" : "border-black/15"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-[#a33e32] mt-0.5">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#242b29]">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] text-[#c46b4b] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (errors.password)
                          setErrors({ ...errors, password: "" })
                      }}
                      className={`w-full h-11 pl-3 pr-10 text-xs bg-white rounded-lg focus:outline-none focus:border-[#173a35] focus:ring-2 focus:ring-[#173a35]/15 border transition-all ${
                        errors.password ? "border-[#a33e32]" : "border-black/15"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-[#62736b] hover:text-[#173a35]"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-[#a33e32] mt-0.5">
                      {errors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-3d-primary w-full h-11 mt-2 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Registered user switcher if accounts exist in database */}
            {registeredUsers.length > 0 && mode === "login" && (
              <div className="mt-5 pt-4 border-t border-black/[0.06]">
                <p className="text-[11px] font-semibold text-[#173a35] mb-2 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#173a35]" />
                  <span>Switch Registered Scholar Profile:</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {registeredUsers.slice(0, 4).map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleQuickSwitchUser(user.id)}
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-[#f8faf9] hover:bg-[#eef2f0] border border-black/[0.05] text-left transition-all text-xs cursor-pointer"
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-[#173a35] truncate leading-tight">
                          {user.name}
                        </p>
                        <p className="text-[10px] text-[#728078] truncate leading-none">
                          {(user.institution || "Student").split(" ")[0]}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 pt-3 border-t border-black/[0.06] text-center text-[11px] text-[#728078]">
              <button
                type="button"
                onClick={() => setShowRulesModal(true)}
                className="hover:text-[#173a35] underline"
              >
                Community Standards & Safety Oath
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Community Rules Modal */}
      <CommunityRulesModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
        onAccept={() => setShowRulesModal(false)}
        showAcceptButton={false}
      />

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Reset Password"
        subtitle="Enter your student email to receive recovery instructions."
        maxWidth="sm"
        footer={
          !recoverySent ? (
            <button
              type="button"
              onClick={() => {
                if (!recoveryEmail.trim()) return
                setRecoverySent(true)
                setTimeout(() => {
                  setRecoverySent(false)
                  setShowForgotModal(false)
                  setRecoveryEmail("")
                }, 2000)
              }}
              disabled={!recoveryEmail.trim()}
              className="btn-3d-primary px-4 py-2 text-xs font-semibold rounded-lg disabled:opacity-40"
            >
              Send Recovery Token
            </button>
          ) : null
        }
      >
        {recoverySent ? (
          <div className="py-4 text-center text-xs">
            <ShieldCheck className="w-8 h-8 text-[#173a35] mx-auto mb-2" />
            <p className="font-bold text-sm text-[#173a35]">
              Recovery Link Dispatched
            </p>
            <p className="text-[#62736b] mt-1">
              Instructions have been sent to {recoveryEmail}.
            </p>
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-[#173a35] mb-1">
                Student Email Address
              </label>
              <input
                type="email"
                placeholder="name@university.edu"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                className="w-full p-2.5 bg-white rounded-lg focus:outline-none focus:border-[#173a35] focus:ring-2 focus:ring-[#173a35]/15 border border-black/15 text-xs"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-[#728078]">
              Password reset links are valid for 60 minutes.
            </p>
          </div>
        )}
      </Modal>
    </main>
  )
}
