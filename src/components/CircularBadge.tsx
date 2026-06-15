import { Compass } from "lucide-react";

interface CircularBadgeProps {
  /** Text repeated around the ring. A trailing separator is recommended. */
  text?: string;
  /** Rendered diameter in pixels. */
  size?: number;
  className?: string;
}

/**
 * Circular badge with text rotating around its circumference and a static
 * compass icon in the centre. Rotation is handled by the `.wayve-rotate`
 * CSS class, which is disabled under `prefers-reduced-motion`.
 */
export function CircularBadge({
  text = "DISCOVER • INDIA • EXPLORE • EASYDUD • ",
  size = 120,
  className = "",
}: CircularBadgeProps) {
  const pathId = "wayve-badge-circle";

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" width={size} height={size}>
        <defs>
          <path
            id={pathId}
            d="M 100,100 m -74,0 a 74,74 0 1,1 148,0 a 74,74 0 1,1 -148,0"
            fill="none"
          />
        </defs>
        {/* Decorative rings */}
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="none"
          stroke="rgba(201,169,110,0.6)"
          strokeWidth="1"
        />
        <circle
          cx="100"
          cy="100"
          r="60"
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1"
        />
        <g className="wayve-rotate">
          <text
            fill="#FFFFFF"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
            }}
          >
            <textPath href={`#${pathId}`} startOffset="0%">
              {text}
            </textPath>
          </text>
        </g>
      </svg>

      {/* Static centre icon */}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C9A96E]/60 bg-black/30 backdrop-blur-sm">
          <Compass className="h-5 w-5 text-[#C9A96E]" strokeWidth={1.75} />
        </span>
      </span>
    </div>
  );
}
