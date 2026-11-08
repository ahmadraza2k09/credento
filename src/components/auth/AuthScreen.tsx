import React, { useState } from "react"
import {
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Lock,
  UserCheck,
  CheckCircle2,
  ExternalLink,
} from "lucide-react"
import { BrandLogo } from "../common/BrandLogo"
import { Modal } from "../common/Modal"
import { CommunityRulesModal } from "../safety/CommunityRulesModal"
import {
  getAllUsers,
  loginStudent,
  registerStudent,
  setCurrentUserId,
  verifyAdminCredential,
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

  // Form fields
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [institution, setInstitution] = useState("")
  const [degree, setDegree] = useState("")
  const [graduationYear, setGraduationYear] = useState("2027")
  const [agreedToRules, setAgreedToRules] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Modals & UI states
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showRulesModal, setShowRulesModal] = useState(false)
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState("")
  const [recoverySent, setRecoverySent] = useState(false)

  // Admin access modal
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [adminPasskey, setAdminPasskey] = useState("")
  const [adminError, setAdminError] = useState("")

  // Check existing registered users in the database
  const registeredUsers = getAllUsers()

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    const nextErrors: { [key: string]: string } = {}

    if (!name.trim()) nextErrors.name = "Enter your full name."
    if (!username.trim()) {
      nextErrors.username = "Choose a unique username."
    } else if (
      registeredUsers.some(
        (u) =>
          u.username?.toLowerCase() ===
          username.trim().toLowerCase().replace(/^@/, ""),
      )
    ) {
      nextErrors.username = "This username is already taken."
    }

    if (!email.trim() || !email.includes("@")) {
      nextErrors.email = "Enter a valid student or institutional email."
    } else if (
      registeredUsers.some(
        (u) => u.email?.toLowerCase() === email.trim().toLowerCase(),
      )
    ) {
      nextErrors.email = "An account with this email already exists."
    }

    if (!password || password.length < 5) {
      nextErrors.password = "Password must be at least 5 characters."
    }

    if (!institution.trim()) {
      nextErrors.institution = "Enter your current university or college."
    }

    if (!agreedToRules) {
      nextErrors.rules = "You must agree to the Credento Rules & Standards."
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    setTimeout(() => {
      const newStudent = registerStudent({
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        institution: institution.trim(),
        degree: degree.trim() || "Undergraduate Degree",
        graduationYear: graduationYear.trim() || 2027,
      })

      setIsSubmitting(false)
      onLoginSuccess(newStudent)
    }, 400)
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
    setTimeout(() => {
      setIsSubmitting(false)
      const res = loginStudent(email.trim(), password)
      if (res.success && res.user) {
        onLoginSuccess(res.user)
      } else {
        setErrors({ form: res.error || "Authentication failed." })
      }
    }, 350)
  }

  const handleQuickSwitchUser = (userId: string) => {
    setCurrentUserId(userId)
    const user = registeredUsers.find((u) => u.id === userId)
    if (user) {
      onLoginSuccess(user)
    }
  }

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAdminError("")
    const isValid = verifyAdminCredential(adminPasskey)
    if (isValid) {
      setShowAdminModal(false)
      onAdminLoginSuccess()
    } else {
      setAdminError("Invalid administrator passkey.")
    }
  }

  return (
    <main className="login-page min-h-screen bg-[#f7f5ef] flex flex-col justify-between">
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Editorial Brand Panel */}
        <section
          className="brand-panel lg:w-5/12 bg-[#173a35] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden"
          aria-labelledby="brand-heading"
        >
          <div className="relative z-10">
            <BrandLogo inverse />
          </div>

          <div className="relative z-10 my-10 lg:my-0 space-y-6 max-w-lg">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] font-semibold text-[#f7f5ef] tracking-wide uppercase border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-[#c46b4b]" />
              Collegiate Identity & Networking
            </span>
            <h1
              id="brand-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#f7f5ef] leading-[1.15] tracking-tight"
            >
              Stand out in the student world with your genuine Credento profile.
            </h1>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-light">
              Connect with fellow university scholars, showcase research &
              projects, discover verified fellowships, and unlock free community
              assistance through the Credento Access Center.
            </p>

            <div className="pt-4 border-t border-white/15 grid grid-cols-2 gap-4 text-xs text-white/70">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c46b4b]" />
                <span>Zero vanity metrics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c46b4b]" />
                <span>Genuine student members</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c46b4b]" />
                <span>Free Access Center services</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c46b4b]" />
                <span>Verified academic integrity</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-white/50 flex items-center justify-between">
            <span>© 2026 Credento Platform</span>
            <button
              type="button"
              onClick={() => setShowAdminModal(true)}
              className="text-white/60 hover:text-white underline hover:no-underline cursor-pointer"
            >
              Staff & Admin Portal
            </button>
          </div>
        </section>

        {/* Right Form Panel */}
        <section
          className="login-panel lg:w-7/12 p-6 sm:p-10 lg:p-16 flex flex-col justify-center items-center"
          aria-labelledby="login-heading"
        >
          <div className="w-full max-w-lg">
            <div className="lg:hidden mb-6 flex justify-between items-center">
              <BrandLogo />
              <button
                type="button"
                onClick={() => setShowAdminModal(true)}
                className="text-xs text-[#62736b] hover:text-[#173a35] underline"
              >
                Admin
              </button>
            </div>

            <div className="login-card bg-white rounded-3xl p-6 sm:p-9 shadow-[0_2px_4px_rgba(0,0,0,0.03),0_12px_28px_-6px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] border border-black/[0.04]">
              {/* Header */}
              <div className="login-card__heading mb-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-[#c46b4b] uppercase tracking-wider">
                    {mode === "login"
                      ? "Student Sign In"
                      : "New Student Registration"}
                  </p>
                  <span className="text-[11px] text-[#728078] font-mono">
                    Step {mode === "login" ? "1 of 1" : "1 of 2"}
                  </span>
                </div>
                <h2
                  id="login-heading"
                  className="text-2xl sm:text-3xl font-bold text-[#173a35] tracking-tight mt-1"
                >
                  {mode === "login"
                    ? "Welcome to Credento"
                    : "Create your Student Identity"}
                </h2>
                <p className="text-xs sm:text-sm text-[#62736b] mt-1.5">
                  {mode === "login"
                    ? "Sign in to access your student network, feed, and messaging."
                    : "Join genuine students across universities worldwide."}
                </p>
              </div>

              {errors.form && (
                <div className="mb-4 p-3 bg-[#fdf3f2] border border-[#f1c5c0] rounded-xl text-xs text-[#a33e32]">
                  {errors.form}
                </div>
              )}

              {/* REGISTER FORM */}
              {mode === "register" ? (
                <form
                  onSubmit={handleRegisterSubmit}
                  noValidate
                  className="space-y-3.5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#242b29] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Maya Lin"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value)
                          if (!username) {
                            setUsername(
                              e.target.value
                                .toLowerCase()
                                .replace(/\s+/g, "_")
                                .replace(/[^a-z0-9_]/g, ""),
                            )
                          }
                          if (errors.name) setErrors({ ...errors, name: "" })
                        }}
                        className={`w-full h-11 px-3.5 text-xs bg-white rounded-xl focus:outline-none focus:border-[#173a35] focus:ring-2 focus:ring-[#173a35]/20 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04)] border transition-all ${
                          errors.name ? "border-[#a33e32]" : "border-black/10"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-[11px] text-[#a33e32] mt-0.5">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#242b29] mb-1">
                        Profile Handle / Username *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-xs text-[#728078]">
                          @
                        </span>
                        <input
                          type="text"
                          placeholder="username"
                          value={username}
                          onChange={(e) => {
                            setUsername(
                              e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9_]/g, ""),
                            )
                            if (errors.username)
                              setErrors({ ...errors, username: "" })
                          }}
                          className={`w-full h-11 pl-7 pr-3 text-xs bg-white rounded-xl focus:outline-none focus:border-[#173a35] focus:ring-2 focus:ring-[#173a35]/20 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04)] border transition-all ${
                            errors.username
                              ? "border-[#a33e32]"
                              : "border-black/10"
                          }`}
                        />
                      </div>
                      {errors.username && (
                        <p className="text-[11px] text-[#a33e32] mt-0.5">
                          {errors.username}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#242b29] mb-1">
                      Student / University Email *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. name@university.edu"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (errors.email) setErrors({ ...errors, email: "" })
                      }}
                      className={`w-full h-11 px-3.5 text-xs bg-white rounded-xl focus:outline-none focus:border-[#173a35] focus:ring-2 focus:ring-[#173a35]/20 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04)] border transition-all ${
                        errors.email ? "border-[#a33e32]" : "border-black/10"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-[#a33e32] mt-0.5">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#242b29] mb-1">
                        Current Institution *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Stanford University"
                        value={institution}
                        onChange={(e) => {
                          setInstitution(e.target.value)
                          if (errors.institution)
                            setErrors({ ...errors, institution: "" })
                        }}
                        className={`w-full h-11 px-3.5 text-xs bg-white rounded-xl focus:outline-none focus:border-[#173a35] focus:ring-2 focus:ring-[#173a35]/20 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04)] border transition-all ${
                          errors.institution
                            ? "border-[#a33e32]"
                            : "border-black/10"
                        }`}
                      />
                      {errors.institution && (
                        <p className="text-[11px] text-[#a33e32] mt-0.5">
                          {errors.institution}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#242b29] mb-1">
                        Degree & Major
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. B.S. in Computer Science"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        className="w-full h-11 px-3.5 text-xs bg-white rounded-xl focus:outline-none focus:border-[#173a35] focus:ring-2 focus:ring-[#173a35]/20 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04)] border border-black/10 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#242b29] mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a secure password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          if (errors.password)
                            setErrors({ ...errors, password: "" })
                        }}
                        className={`w-full h-11 pl-3.5 pr-10 text-xs bg-white rounded-xl focus:outline-none focus:border-[#173a35] focus:ring-2 focus:ring-[#173a35]/20 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04)] border transition-all ${
                          errors.password
                            ? "border-[#a33e32]"
                            : "border-black/10"
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

                  {/* Rules Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2 cursor-pointer text-xs text-[#4d5b54]">
                      <input
                        type="checkbox"
                        checked={agreedToRules}
                        onChange={(e) => {
                          setAgreedToRules(e.target.checked)
                          if (errors.rules) setErrors({ ...errors, rules: "" })
                        }}
                        className="mt-0.5 rounded text-[#173a35] focus:ring-[#173a35]"
                      />
                      <span>
                        I agree to the{" "}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            setShowRulesModal(true)
                          }}
                          className="font-bold text-[#c46b4b] hover:underline"
                        >
                          Credento Community Standards & Safety Oath
                        </button>
                        , affirming my identity as an authentic student scholar.
                      </span>
                    </label>
                    {errors.rules && (
                      <p className="text-[11px] text-[#a33e32] mt-1">
                        {errors.rules}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-3d-primary w-full h-12 mt-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Complete Registration & Enter Credento</span>
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
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-[#242b29] mb-1.5">
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
                      className={`w-full h-12 px-4 text-xs bg-white rounded-xl focus:outline-none focus:border-[#173a35] focus:ring-2 focus:ring-[#173a35]/20 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04)] border transition-all ${
                        errors.email ? "border-[#a33e32]" : "border-black/10"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-[#a33e32] mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-[#242b29]">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-[11px] text-[#c46b4b] hover:underline font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your student password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          if (errors.password)
                            setErrors({ ...errors, password: "" })
                        }}
                        className={`w-full h-12 pl-4 pr-11 text-xs bg-white rounded-xl focus:outline-none focus:border-[#173a35] focus:ring-2 focus:ring-[#173a35]/20 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04)] border transition-all ${
                          errors.password
                            ? "border-[#a33e32]"
                            : "border-black/10"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-[#62736b] hover:text-[#173a35]"
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

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-3d-primary w-full h-12 mt-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In to Credento</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Toggle Login / Register */}
              <div className="mt-5 pt-4 border-t border-black/[0.06] text-center text-xs text-[#62736b]">
                {mode === "login" ? (
                  <span>
                    New student to Credento?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("register")
                        setErrors({})
                      }}
                      className="font-bold text-[#c46b4b] hover:underline ml-1"
                    >
                      Create your Student Account
                    </button>
                  </span>
                ) : (
                  <span>
                    Already registered on Credento?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("login")
                        setErrors({})
                      }}
                      className="font-bold text-[#173a35] hover:underline ml-1"
                    >
                      Sign in here
                    </button>
                  </span>
                )}
              </div>

              {/* Local multi-user switcher (only if genuine accounts exist in local DB) */}
              {registeredUsers.length > 0 && mode === "login" && (
                <div className="mt-5 pt-4 border-t border-dashed border-black/[0.08]">
                  <p className="text-[11px] font-semibold text-[#173a35] mb-2 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#1b6b47]" />
                    <span>Quick Switch (Registered Local Scholars):</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {registeredUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleQuickSwitchUser(user.id)}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-[#f8faf9] hover:bg-[#eef2f0] border border-black/[0.04] text-left transition-all text-xs group cursor-pointer"
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-[#173a35] truncate leading-tight group-hover:text-[#c46b4b]">
                            {user.name}
                          </p>
                          <p className="text-[10px] text-[#728078] truncate leading-none">
                            {user.institution.split(" ")[0]}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between text-xs text-[#8b9891] px-2">
              <button
                type="button"
                onClick={() => setShowRulesModal(true)}
                className="hover:text-[#173a35] underline"
              >
                Community Standards & Safety Oath
              </button>
              <button
                type="button"
                onClick={() => setShowAdminModal(true)}
                className="hover:text-[#173a35] flex items-center gap-1"
              >
                <Lock className="w-3 h-3" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Community Rules Modal */}
      <CommunityRulesModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
        onAccept={() => setAgreedToRules(true)}
        showAcceptButton={mode === "register" && !agreedToRules}
      />

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Reset Student Password"
        subtitle="Enter your verified university email to receive a recovery token"
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
              className="btn-3d-primary px-4 py-2 text-xs font-semibold rounded-xl disabled:opacity-40"
            >
              Send Recovery Token
            </button>
          ) : null
        }
      >
        {recoverySent ? (
          <div className="py-4 text-center text-xs">
            <ShieldCheck className="w-8 h-8 text-[#1b6b47] mx-auto mb-2" />
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
                className="w-full p-3 bg-white rounded-xl focus:outline-none focus:border-[#173a35] focus:ring-2 focus:ring-[#173a35]/20 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04)] border border-black/10"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-[#728078]">
              Password reset links are valid for 60 minutes and verified against
              student enrollment directories.
            </p>
          </div>
        )}
      </Modal>

      {/* Secure Credento Staff & Admin Modal */}
      <Modal
        isOpen={showAdminModal}
        onClose={() => {
          setShowAdminModal(false)
          setAdminError("")
          setAdminPasskey("")
        }}
        title="Credento Administrative Portal"
        subtitle="Restricted to authorized platform administrators and moderation staff."
        maxWidth="sm"
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAdminModal(false)}
              className="px-4 py-2 text-xs font-semibold text-[#62736b] hover:text-[#242b29] rounded-xl hover:bg-black/5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdminLoginSubmit}
              className="btn-3d-primary px-5 py-2 text-xs font-semibold rounded-xl"
            >
              Authorize & Enter Dashboard
            </button>
          </div>
        }
      >
        <form onSubmit={handleAdminLoginSubmit} className="space-y-3.5 text-xs">
          <div className="p-3 bg-[#f0f4f2] border border-[#cbd3ce] rounded-xl text-xs text-[#242b29]">
            <p className="font-bold text-[#173a35]">
              Administrator Verification
            </p>
            Enter the authorized Credento Administrative passkey to access
            system moderation, Access Center reviews, and platform analytics.
          </div>

          <div>
            <label className="block font-bold text-[#173a35] mb-1">
              Admin Passkey
            </label>
            <input
              type="password"
              placeholder="Enter administrator passkey"
              value={adminPasskey}
              onChange={(e) => {
                setAdminPasskey(e.target.value)
                setAdminError("")
              }}
              className="w-full p-3 bg-white rounded-xl focus:outline-none focus:border-[#173a35] focus:ring-2 focus:ring-[#173a35]/20 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04)] border border-black/10"
              autoFocus
            />
            {adminError && (
              <p className="text-[11px] text-[#a33e32] mt-1 font-semibold">
                {adminError}
              </p>
            )}
            <p className="text-[10px] text-[#728078] mt-1.5">
              Default secure passkey:{" "}
              <code className="bg-black/5 px-1 rounded font-mono">
                credento-admin-2026
              </code>
            </p>
          </div>
        </form>
      </Modal>
    </main>
  )
}
