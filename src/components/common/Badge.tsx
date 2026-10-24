import React from "react"
import { OpportunityCategory } from "../../types"

interface BadgeProps {
  children: React.ReactNode
  variant?: "evergreen" | "copper" | "neutral" | "success" | "warning" | "info"
  size?: "sm" | "md"
  className?: string
}

export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  className = "",
}: BadgeProps) {
  const variantStyles = {
    evergreen: "bg-[#173a35]/10 text-[#173a35] border-[#173a35]/20",
    copper: "bg-[#c46b4b]/12 text-[#9f5138] border-[#c46b4b]/25",
    neutral: "bg-[#eef2ef] text-[#4d5b54] border-[#d8ddd8]",
    success: "bg-[#1b6b47]/10 text-[#155738] border-[#1b6b47]/20",
    warning: "bg-[#b45309]/10 text-[#92400e] border-[#b45309]/20",
    info: "bg-[#0369a1]/10 text-[#075985] border-[#0369a1]/20",
  }[variant]

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 font-medium",
    md: "text-xs px-2.5 py-1 font-medium",
  }[size]

  return (
    <span
      className={`inline-flex items-center gap-1 border rounded font-mono ${variantStyles} ${sizeStyles} ${className}`}
    >
      {children}
    </span>
  )
}

export function OpportunityCategoryBadge({
  category,
}: {
  category: OpportunityCategory
}) {
  const meta: Record<OpportunityCategory, {
    label: string
    variant: BadgeProps["variant"]
  }> = {
    scholarship: { label: "Scholarship", variant: "copper" },
    internship: { label: "Internship", variant: "evergreen" },
    fellowship: { label: "Fellowship", variant: "copper" },
    competition: { label: "Competition", variant: "warning" },
    course: { label: "Course", variant: "info" },
    volunteer: { label: "Volunteering", variant: "success" },
  }

  const { label, variant } = meta[category] || {
    label: category,
    variant: "neutral",
  }

  return (
    <Badge variant={variant} size="sm">
      {label}
    </Badge>
  )
}
