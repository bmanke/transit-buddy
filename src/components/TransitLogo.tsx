type Props = { className?: string; showText?: boolean }

export default function TransitLogo({ className = '', showText = true }: Props) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 64 64"
        className="w-16 h-16 text-primary"
        role="img"
        aria-label="Transit Buddy logo"
        fill="none"
      >
        <rect x="8" y="10" width="48" height="38" rx="9" fill="currentColor" />
        <rect x="14" y="16" width="16" height="14" rx="3" className="fill-base-100" />
        <rect x="34" y="16" width="16" height="14" rx="3" className="fill-base-100" />
        <rect x="14" y="35" width="36" height="4" rx="2" className="fill-base-100" opacity="0.6" />
        <circle cx="19" cy="43" r="2.5" className="fill-base-100" />
        <circle cx="45" cy="43" r="2.5" className="fill-base-100" />
        <circle cx="19" cy="52" r="5" fill="currentColor" />
        <circle cx="45" cy="52" r="5" fill="currentColor" />
        <circle cx="19" cy="52" r="2" className="fill-base-100" />
        <circle cx="45" cy="52" r="2" className="fill-base-100" />
      </svg>

      {showText && (
        <span className="text-2xl font-extrabold tracking-tight">
          Transit <span className="text-primary">Buddy</span>
        </span>
      )}
    </div>
  )
}