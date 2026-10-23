import { FormEvent, useEffect, useId, useState } from "react"

const SESSION_KEY = "credento-demo-name"

type IconProps = {
  className?: string
}

function EyeIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M2.75 12s3.2-5.25 9.25-5.25S21.25 12 21.25 12 18.05 17.25 12 17.25 2.75 12 2.75 12Z" />
      <circle cx="12" cy="12" r="2.35" />
    </svg>
  )
}

function EyeOffIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="m4 4 16 16M10.35 6.9A9.4 9.4 0 0 1 12 6.75c6.05 0 9.25 5.25 9.25 5.25a13.6 13.6 0 0 1-2.18 2.78M14.48 14.48A3.5 3.5 0 0 1 9.52 9.52M6.18 8.2A14.3 14.3 0 0 0 2.75 12s3.2 5.25 9.25 5.25c1.1 0 2.1-.17 3-.45" />
    </svg>
  )
}

function SignOutIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M14.5 8V5.5A1.5 1.5 0 0 0 13 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H13a1.5 1.5 0 0 0 1.5-1.5V16M10 12h10m-3.25-3.25L20 12l-3.25 3.25" />
    </svg>
  )
}

function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <path d="M7 7h25.5L41 15.5v23L33.5 42H7V7Z" fill="currentColor" />
      <path d="M32.5 7v8.5H41" fill="#C46B4B" />
      <path
        d="M30.5 18.5c-1.72-1.48-3.82-2.25-6.2-2.25-5.08 0-9.05 3.42-9.05 8.1 0 4.74 3.9 8.15 9.05 8.15 2.38 0 4.52-.76 6.2-2.25"
        stroke="#F7F5EF"
        strokeWidth="4.2"
        strokeLinecap="square"
      />
      <rect x="30" y="22" width="5" height="5" fill="#C46B4B" />
    </svg>
  )
}

function BrandLogo({
  inverse = false,
  compact = false,
}: {
  inverse?: boolean
  compact?: boolean
}) {
  return (
    <div className={`brand-logo ${inverse ? "brand-logo--inverse" : ""}`}>
      <LogoMark
        className={
          compact
            ? "brand-logo__mark brand-logo__mark--compact"
            : "brand-logo__mark"
        }
      />
      {!compact && <span className="brand-logo__word">Credento</span>}
    </div>
  )
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
          <LogoMark />
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

type FormFieldProps = {
  id: string
  label: string
  placeholder: string
  value: string
  type?: "text" | "password"
  autoComplete?: string
  error?: string
  onChange: (value: string) => void
  trailingControl?: React.ReactNode
}

function FormField({
  id,
  label,
  placeholder,
  value,
  type = "text",
  autoComplete,
  error,
  onChange,
  trailingControl,
}: FormFieldProps) {
  const errorId = `${id}-error`

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className={`field__control ${error ? "field__control--error" : ""}`}>
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        {trailingControl}
      </div>
      {error && (
        <p className="field__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function PrimaryButton({
  loading,
  children,
}: {
  loading: boolean
  children: React.ReactNode
}) {
  return (
    <button className="primary-button" type="submit" disabled={loading}>
      {loading && (
        <span className="primary-button__spinner" aria-hidden="true" />
      )}
      <span>{loading ? "Entering Credento…" : children}</span>
    </button>
  )
}

function LoginScreen({ onLogin }: { onLogin: (name: string) => void }) {
  const nameId = useId()
  const passwordId = useId()
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ name?: string password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    const nextErrors = {
      ...(!name.trim() && { name: "Enter your name to continue." }),
      ...(!password && { password: "Enter a password to continue." }),
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    window.setTimeout(() => onLogin(name.trim()), 550)
  }

  return (
    <main className="login-page">
      <section className="brand-panel" aria-labelledby="brand-heading">
        <div className="brand-panel__top">
          <BrandLogo inverse />
        </div>
        <div className="brand-panel__content">
          <p className="eyebrow">The student credential network</p>
          <h1 id="brand-heading">Stand Out in the Student World.</h1>
          <p className="brand-panel__support">
            Your achievements. Your journey. Your identity.
          </p>
        </div>
        <CredentialArtwork />
        <p className="brand-panel__footnote">
          A space shaped around what makes you distinct.
        </p>
      </section>

      <section className="login-panel" aria-labelledby="login-heading">
        <div className="login-panel__mobile-logo">
          <BrandLogo />
        </div>
        <div className="login-card">
          <div className="login-card__heading">
            <p className="eyebrow eyebrow--copper">Student access</p>
            <h2 id="login-heading">Welcome to Credento</h2>
            <p>Enter your details to continue.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <FormField
              id={nameId}
              label="Your name"
              placeholder="Enter your name"
              value={name}
              autoComplete="name"
              error={errors.name}
              onChange={(value) => {
                setName(value)
                if (errors.name)
                  setErrors((current) => ({ ...current, name: undefined }))
              }}
            />
            <FormField
              id={passwordId}
              label="Password"
              placeholder="Enter any password"
              value={password}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              error={errors.password}
              onChange={(value) => {
                setPassword(value)
                if (errors.password)
                  setErrors((current) => ({ ...current, password: undefined }))
              }}
              trailingControl={
                <button
                  className="password-toggle"
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            />
            <PrimaryButton loading={isSubmitting}>Enter Credento</PrimaryButton>
          </form>

          <div className="demo-note">
            <span aria-hidden="true">i</span>
            <p>Demo access: use any name and password.</p>
          </div>
        </div>
        <p className="login-panel__footer">
          Credento · Built for the student journey
        </p>
      </section>
    </main>
  )
}

function ApplicationShell({
  name,
  onSignOut,
}: {
  name: string
  onSignOut: () => void
}) {
  const initial = name.charAt(0).toUpperCase()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__desktop-brand">
          <BrandLogo inverse />
        </div>
        <div className="sidebar__compact-brand">
          <BrandLogo inverse compact />
        </div>
        <div className="sidebar__account">
          <div className="avatar" aria-hidden="true">
            {initial}
          </div>
          <div className="sidebar__account-copy">
            <span>Signed in as</span>
            <strong>{name}</strong>
          </div>
        </div>
        <button className="sign-out" type="button" onClick={onSignOut}>
          <SignOutIcon />
          <span>Sign out</span>
        </button>
      </aside>

      <main className="app-main">
        <header className="mobile-header">
          <BrandLogo />
          <button
            className="mobile-sign-out"
            type="button"
            onClick={onSignOut}
            aria-label="Sign out"
          >
            <SignOutIcon />
          </button>
        </header>
        <div className="app-main__content">
          <p className="eyebrow eyebrow--copper">Your Credento</p>
          <h1>Welcome to Credento, {name}.</h1>
          <p className="app-main__tagline">Stand Out in the Student World.</p>
          <p className="app-main__intro">
            Your student journey deserves a place of its own.
          </p>

          <section
            className="preparing-panel"
            aria-labelledby="preparing-title"
          >
            <div className="preparing-panel__mark">
              <LogoMark />
            </div>
            <div>
              <p className="preparing-panel__label">Your space</p>
              <h2 id="preparing-title">
                Your student space is being prepared.
              </h2>
              <p>
                A focused home for your academic story, achievements, and future
                opportunities.
              </p>
            </div>
            <div className="preparing-panel__detail" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </section>
        </div>
        <footer className="app-footer">
          <span>Credento</span>
          <span>Stand out with purpose.</span>
        </footer>
      </main>
    </div>
  )
}

export default function App() {
  const [name, setName] = useState(
    () => sessionStorage.getItem(SESSION_KEY) ?? "",
  )

  useEffect(() => {
    document.title = "Credento — Student Networking"
  }, [])

  const handleLogin = (enteredName: string) => {
    sessionStorage.setItem(SESSION_KEY, enteredName)
    setName(enteredName)
  }

  const handleSignOut = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setName("")
  }

  return name ? (
    <ApplicationShell name={name} onSignOut={handleSignOut} />
  ) : (
    <LoginScreen onLogin={handleLogin} />
  )
}
