"use client";

interface LogoProps {
  inverted?: boolean;
  className?: string;
}

export default function Logo({ inverted = false, className = "" }: LogoProps) {
  const textColor = inverted ? "#FFFFFF" : "#0A0A0A";
  const goldColor = "#B8965A";

  return (
    <svg
      viewBox="0 0 220 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="M&H Assistência Eletrodoméstico Importados"
      className={className}
    >
      <text
        x="8"
        y="52"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        fontSize="56"
        letterSpacing="-2"
        fill={textColor}
      >
        H
      </text>
      <line x1="78" y1="8" x2="78" y2="60" stroke={goldColor} strokeWidth="3" />
      <text
        x="88"
        y="52"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        fontSize="56"
        letterSpacing="-2"
        fill={textColor}
      >
        M
      </text>
      <text
        x="8"
        y="72"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="400"
        fontSize="9"
        letterSpacing="2.5"
        fill={inverted ? "#B8B8B8" : "#6B6B6B"}
      >
        ASSISTÊNCIA ELETRODOMÉSTICO
      </text>
    </svg>
  );
}
