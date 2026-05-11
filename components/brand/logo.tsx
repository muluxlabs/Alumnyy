"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  animated?: boolean
  showText?: boolean
}

export function Logo({
  className,
  size = "md",
  animated = true,
  showText = true,
}: LogoProps) {
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setIsAnimated(true), 100)
      return () => clearTimeout(timer)
    }
  }, [animated])

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-4xl",
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Three converging paths representing global connection */}
          {/* Path 1 - Indigo (top-left origin) */}
          <path
            d="M 15 20 Q 35 35 50 50 Q 65 65 85 80"
            fill="none"
            stroke="url(#gradient1)"
            strokeWidth="6"
            strokeLinecap="round"
            className={cn(
              "transition-all duration-1000 ease-out",
              isAnimated
                ? "stroke-dasharray-[150] stroke-dashoffset-0"
                : "stroke-dasharray-[150] stroke-dashoffset-[150]"
            )}
            style={{
              strokeDasharray: 150,
              strokeDashoffset: isAnimated ? 0 : 150,
              transition: "stroke-dashoffset 1s ease-out",
            }}
          />
          {/* Path 2 - Teal (top-right origin) */}
          <path
            d="M 85 20 Q 65 35 50 50 Q 35 65 15 80"
            fill="none"
            stroke="url(#gradient2)"
            strokeWidth="6"
            strokeLinecap="round"
            style={{
              strokeDasharray: 150,
              strokeDashoffset: isAnimated ? 0 : 150,
              transition: "stroke-dashoffset 1s ease-out 0.2s",
            }}
          />
          {/* Path 3 - Amber (bottom center origin) */}
          <path
            d="M 50 90 Q 50 70 50 50"
            fill="none"
            stroke="url(#gradient3)"
            strokeWidth="6"
            strokeLinecap="round"
            style={{
              strokeDasharray: 60,
              strokeDashoffset: isAnimated ? 0 : 60,
              transition: "stroke-dashoffset 0.8s ease-out 0.4s",
            }}
          />
          {/* Center node - connection point */}
          <circle
            cx="50"
            cy="50"
            r="8"
            fill="url(#centerGradient)"
            className={cn(
              "transition-all duration-500",
              isAnimated ? "opacity-100 scale-100" : "opacity-0 scale-0"
            )}
            style={{
              transformOrigin: "50px 50px",
              opacity: isAnimated ? 1 : 0,
              transform: isAnimated ? "scale(1)" : "scale(0)",
              transition: "all 0.5s ease-out 0.8s",
            }}
          />
          {/* Outer nodes */}
          <circle
            cx="15"
            cy="20"
            r="5"
            fill="#6366f1"
            style={{
              opacity: isAnimated ? 1 : 0,
              transition: "opacity 0.3s ease-out",
            }}
          />
          <circle
            cx="85"
            cy="20"
            r="5"
            fill="#14b8a6"
            style={{
              opacity: isAnimated ? 1 : 0,
              transition: "opacity 0.3s ease-out 0.2s",
            }}
          />
          <circle
            cx="50"
            cy="90"
            r="5"
            fill="#f59e0b"
            style={{
              opacity: isAnimated ? 1 : 0,
              transition: "opacity 0.3s ease-out 0.4s",
            }}
          />
          <circle
            cx="85"
            cy="80"
            r="5"
            fill="#6366f1"
            style={{
              opacity: isAnimated ? 1 : 0,
              transition: "opacity 0.3s ease-out 0.6s",
            }}
          />
          <circle
            cx="15"
            cy="80"
            r="5"
            fill="#14b8a6"
            style={{
              opacity: isAnimated ? 1 : 0,
              transition: "opacity 0.3s ease-out 0.6s",
            }}
          />
          {/* Gradients */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="gradient3" x1="50%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e0e7ff" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-bold tracking-tight text-foreground",
              textSizeClasses[size]
            )}
          >
            Beyond Borders
          </span>
          <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
            Collective
          </span>
        </div>
      )}
    </div>
  )
}

export function LogoIcon({ className, size = "md" }: Omit<LogoProps, "showText">) {
  return <Logo className={className} size={size} showText={false} />
}
