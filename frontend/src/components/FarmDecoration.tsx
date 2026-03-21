// src/components/FarmDecoration.tsx

export function WheatDivider() {
  return (
    <div className="w-full py-6 flex items-center justify-center overflow-hidden">
      <svg
        width="100%"
        height="44"
        viewBox="0 0 1200 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        className="opacity-40"
      >
        {Array.from({ length: 40 }).map((_, i) => {
          const x = i * 30 + 5;
          const offset = i % 2 === 0 ? 0 : 4;
          return (
            <g key={i} transform={`translate(${x}, ${offset})`}>
              <line x1="0" y1="38" x2="0" y2="6" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="0" y1="8"  x2="-4" y2="13" stroke="#C9A96E" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="0" y1="8"  x2="4"  y2="13" stroke="#C9A96E" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="0" y1="16" x2="-4" y2="21" stroke="#C9A96E" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="0" y1="16" x2="4"  y2="21" stroke="#C9A96E" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="0" y1="24" x2="-4" y2="29" stroke="#C9A96E" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="0" y1="24" x2="4"  y2="29" stroke="#C9A96E" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="-1" y1="5" x2="1"  y2="2"  stroke="#C9A96E" strokeWidth="1"   strokeLinecap="round" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// SVG tractor matching the Figma illustration:
// blocky brown body, yellow cabin with window, big dark wheels, sun floating above
function TractorIllustration() {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="96" height="80">
      {/* Sun */}
      <circle cx="72" cy="14" r="7" fill="#E6A817" opacity="0.9" />
      {/* Sun rays */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={72 + Math.cos(angle) * 10}
            y1={14 + Math.sin(angle) * 10}
            x2={72 + Math.cos(angle) * 14}
            y2={14 + Math.sin(angle) * 14}
            stroke="#E6A817"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        );
      })}

      {/* Exhaust pipe */}
      <rect x="84" y="28" width="3" height="10" rx="1.5" fill="#4A2E15" opacity="0.7" />

      {/* Cabin (yellow) */}
      <rect x="58" y="32" width="28" height="22" rx="3" fill="#C9A055" opacity="0.95" />
      {/* Cabin window */}
      <rect x="63" y="36" width="8" height="7" rx="1.5" fill="#FDF6E3" opacity="0.7" />
      <rect x="73" y="36" width="8" height="7" rx="1.5" fill="#FDF6E3" opacity="0.7" />

      {/* Body (dark brown) */}
      <rect x="28" y="48" width="58" height="20" rx="3" fill="#4A2E15" opacity="0.9" />

      {/* Ground platform (light sage — matches the Figma hill strip) */}
      <rect x="20" y="66" width="80" height="6" rx="2" fill="#B5C9A8" opacity="0.6" />

      {/* Big rear wheel */}
      <circle cx="46" cy="68" r="18" fill="#2C1A0E" opacity="0.85" />
      <circle cx="46" cy="68" r="14" fill="none" stroke="#5C3D1E" strokeWidth="2.5" opacity="0.7" />
      <circle cx="46" cy="68" r="5"  fill="#4A2E15" opacity="0.9" />
      {/* Wheel spokes */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i * 60 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={46 + Math.cos(a) * 5}
            y1={68 + Math.sin(a) * 5}
            x2={46 + Math.cos(a) * 13}
            y2={68 + Math.sin(a) * 13}
            stroke="#5C3D1E"
            strokeWidth="1.5"
            opacity="0.5"
          />
        );
      })}

      {/* Small front wheel */}
      <circle cx="80" cy="68" r="12" fill="#2C1A0E" opacity="0.85" />
      <circle cx="80" cy="68" r="9"  fill="none" stroke="#5C3D1E" strokeWidth="2" opacity="0.7" />
      <circle cx="80" cy="68" r="3.5" fill="#4A2E15" opacity="0.9" />
    </svg>
  );
}

export function FarmSceneBanner() {
  return (
    <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-[#F5EDD8]">

      {/* Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FDF6E3] to-[#EEE8D5]" />

      {/* Background hills — layered soft sage ellipses matching Figma */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1200 140"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Far hill */}
        <ellipse cx="350" cy="160" rx="420" ry="100" fill="#C8D5BE" opacity="0.4" />
        {/* Mid hill */}
        <ellipse cx="650" cy="155" rx="380" ry="90"  fill="#B8C9AC" opacity="0.45" />
        {/* Near hill (ground strip) */}
        <rect x="0" y="120" width="1200" height="40" fill="#B5C9A8" opacity="0.35" rx="0" />
      </svg>

      {/* Crop tick marks along the ground (matches Figma ruler-like lines) */}
      <svg
        className="absolute bottom-6 left-0 w-full"
        viewBox="0 0 1200 18"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        opacity="0.4"
      >
        {Array.from({ length: 80 }).map((_, i) => (
          <line
            key={i}
            x1={i * 15 + 5}
            y1="18"
            x2={i * 15 + 5}
            y2={i % 4 === 0 ? 8 : 12}
            stroke="#7A9A6A"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* Tractor illustration — bottom right, sitting on the ground platform */}
      <div className="absolute right-6 bottom-2">
        <TractorIllustration />
      </div>

    </div>
  );
}