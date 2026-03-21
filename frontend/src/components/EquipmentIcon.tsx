// Custom farm equipment icons — hand-drawn SVG style matching Figma
import type { SVGProps } from "react";

export function TractorIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="12" y="20" width="24" height="12" rx="2" fill="currentColor" opacity="0.85" />
      <rect x="24" y="14" width="10" height="10" rx="1.5" fill="currentColor" opacity="0.9" />
      <rect x="26" y="16" width="3" height="3" rx="0.5" fill="#FDF6E3" opacity="0.7" />
      <rect x="30" y="16" width="3" height="3" rx="0.5" fill="#FDF6E3" opacity="0.7" />
      <circle cx="18" cy="32" r="7" fill="currentColor" opacity="0.75" />
      <circle cx="18" cy="32" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.95" />
      <circle cx="18" cy="32" r="1.5" fill="currentColor" />
      <circle cx="30" cy="32" r="5" fill="currentColor" opacity="0.75" />
      <circle cx="30" cy="32" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.95" />
      <circle cx="30" cy="32" r="1" fill="currentColor" />
      <rect x="34" y="10" width="2" height="6" rx="1" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function HalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10 32 L16 18 L26 16 L38 22 L36 30 L24 34 Z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 32 Q18 28 26 28 Q32 28 36 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
      <rect x="21" y="10" width="5" height="12" rx="2.5" fill="currentColor" opacity="0.85" />
      <path d="M16 34 Q24 36 32 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
    </svg>
  );
}

export function RotavatorIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="10" y="17" width="28" height="7" rx="2" fill="currentColor" opacity="0.85" />
      <rect x="22" y="10" width="4" height="9" rx="2" fill="currentColor" opacity="0.7" />
      {([14, 22, 30] as number[]).map((cx, i) => (
        <g key={i}>
          <circle cx={cx} cy={31} r={5} fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" />
          <line x1={cx - 3} y1={28} x2={cx + 3} y2={34} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
          <line x1={cx + 3} y1={28} x2={cx - 3} y2={34} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
        </g>
      ))}
    </svg>
  );
}

export function CultivatorIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="10" y="15" width="28" height="5" rx="2" fill="currentColor" opacity="0.85" />
      <rect x="22" y="8" width="4" height="9" rx="2" fill="currentColor" opacity="0.8" />
      {([13, 22, 31] as number[]).map((x, i) => (
        <g key={i}>
          <rect x={x} y={20} width={3} height={14} rx="1.5" fill="currentColor" opacity="0.75" />
          <path d={`M${x} 34 L${x + 1.5} 38 L${x + 3} 34`} fill="currentColor" opacity="0.85" />
        </g>
      ))}
    </svg>
  );
}

export function SeedDrillIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M15 14 L11 22 L37 22 L33 14 Z" fill="currentColor" opacity="0.8" />
      <rect x="9" y="22" width="30" height="6" rx="2" fill="currentColor" opacity="0.9" />
      {([13, 23, 33] as number[]).map((x, i) => (
        <g key={i}>
          <rect x={x} y={28} width={2.5} height={8} rx="1.25" fill="currentColor" opacity="0.65" />
          <circle cx={x + 1.25} cy={37.5} r={1.2} fill="currentColor" opacity="0.9" />
        </g>
      ))}
    </svg>
  );
}

export function TrolleyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="8" y="15" width="32" height="13" rx="2" fill="currentColor" opacity="0.8" />
      <rect x="8" y="13" width="2.5" height="15" fill="currentColor" opacity="0.9" />
      <rect x="37.5" y="13" width="2.5" height="15" fill="currentColor" opacity="0.9" />
      <line x1="8" y1="15" x2="5" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <circle cx="17" cy="33" r="4.5" fill="currentColor" opacity="0.75" />
      <circle cx="31" cy="33" r="4.5" fill="currentColor" opacity="0.75" />
      <circle cx="17" cy="33" r="2" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.9" />
      <circle cx="31" cy="33" r="2" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.9" />
    </svg>
  );
}

export function ThresherIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="10" y="16" width="28" height="16" rx="3" fill="currentColor" opacity="0.8" />
      <rect x="14" y="20" width="20" height="8" rx="3" fill="currentColor" opacity="0.9" />
      {([18, 23, 28] as number[]).map((x, i) => (
        <line key={i} x1={x} y1={20} x2={x} y2={28} stroke="#FDF6E3" strokeWidth="1.2" opacity="0.55" />
      ))}
      <path d="M10 30 L6 36 L10 38 L14 32" fill="currentColor" opacity="0.6" />
      <circle cx="8" cy="37" r="1.2" fill="currentColor" opacity="0.8" />
      <rect x="36" y="12" width="3" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function SprayerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="17" y="10" width="14" height="18" rx="7" fill="currentColor" opacity="0.8" />
      <rect x="24" y="24" width="2" height="5" fill="currentColor" opacity="0.7" />
      <rect x="9" y="29" width="30" height="3.5" rx="1.75" fill="currentColor" opacity="0.9" />
      {([13, 23, 33] as number[]).map((x, i) => (
        <g key={i}>
          <line x1={x} y1={32.5} x2={x} y2={37} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.65" />
          <circle cx={x} cy={38.5} r={1.2} fill="currentColor" opacity="0.5" />
        </g>
      ))}
    </svg>
  );
}

export function HarvesterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="16" y="15" width="22" height="14" rx="2" fill="currentColor" opacity="0.8" />
      <rect x="24" y="10" width="10" height="9" rx="1.5" fill="currentColor" opacity="0.9" />
      <rect x="26" y="12" width="2.5" height="2.5" rx="0.5" fill="#FDF6E3" opacity="0.7" />
      <rect x="30" y="12" width="2.5" height="2.5" rx="0.5" fill="#FDF6E3" opacity="0.7" />
      <rect x="8" y="20" width="10" height="5" rx="1" fill="currentColor" opacity="0.75" />
      <path d="M8 25 L10 28 L13 25 L16 28 L18 25" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.85" />
      <circle cx="30" cy="34" r="5" fill="currentColor" opacity="0.75" />
      <circle cx="30" cy="34" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.95" />
      <circle cx="20" cy="34" r="3" fill="currentColor" opacity="0.65" />
      <circle cx="20" cy="34" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.85" />
    </svg>
  );
}

export const equipmentIcons: Record<string, (props: SVGProps<SVGSVGElement>) => JSX.Element> = {
  tractor:   TractorIcon,
  hal:       HalIcon,
  rotavator: RotavatorIcon,
  cultivator: CultivatorIcon,
  seedDrill: SeedDrillIcon,
  trolley:   TrolleyIcon,
  thresher:  ThresherIcon,
  sprayer:   SprayerIcon,
  harvester: HarvesterIcon,
};