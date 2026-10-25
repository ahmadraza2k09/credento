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
    evergreen: "bg-[#edf4f1] text-[#173a35] border-[#c0d4c6]",
    copper: "bg-[#faf0eb] text-[#9f5138] border-[#e8cdc2]",
    neutral: "bg-[#f0ede6] text-[#242b29] border-[#cbd3ce]",
    success: "bg-[#edf6f0] text-[#155738] border-[#b8dec4]",
    warning: "bg-[#fef8ee] text-[#92400e] border-[#f5dfb8]",
    info: "bg-[#f0f7fb] text-[#075985] border-[#bee0f2]",
  }[variant]

  const sizeStyles = {
    sm: "text-[11px] px-2.5 py-0.5 font-medium",
    md: "text-xs px-3 py-1 font-medium",
  }[size]

  return (
    <span
      className={`inline-flex items-center gap-1.5 border rounded-full ${variantStyles} ${sizeStyles} ${className} shadow-2xs`}
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
