import React from "react"

export function LogoMark({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      {/* Outer credential badge */}
      <path d="M7 7h25.5L41 15.5v23L33.5 42H7V7Z" fill="#173a35" />
      {/* Folded corner seal in warm copper */}
      <path d="M32.5 7v8.5H41" fill="#c46b4b" />
      {/* Clean C mark with sharp editorial serif touch */}
      <path
        d="M30.5 18.5c-1.72-1.48-3.82-2.25-6.2-2.25-5.08 0-9.05 3.42-9.05 8.1 0 4.74 3.9 8.15 9.05 8.15 2.38 0 4.52-.76 6.2-2.25"
        stroke="#f7f5ef"
        strokeWidth="4"
        strokeLinecap="square"
      />
      <rect x="30" y="22" width="5" height="5" fill="#c46b4b" />
    </svg>
  )
}

interface BrandLogoProps {
  inverse?: boolean
  compact?: boolean
  className?: string
  onClick?: () => void
}

export function BrandLogo({
  inverse = false,
  compact = false,
  className = "",
  onClick,
}: BrandLogoProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c46b4b] rounded-xl transition-all hover:opacity-90 cursor-pointer ${className}`}
      aria-label="Credento Home"
    >
      <LogoMark className={compact ? "w-8 h-8" : "w-9 h-9"} />
      {!compact && (
        <div className="flex flex-col">
          <span
            className={`font-bold tracking-tight text-xl leading-none ${
              inverse ? "text-[#f7f5ef]" : "text-[#173a35]"
            }`}
          >
            Credento
          </span>
          <span
            className={`text-[10px] font-medium ${
              inverse ? "text-[#aebcb4]" : "text-[#62736b]"
            }`}
          >
            Student Network
          </span>
        </div>
      )}
    </button>
  )
}
