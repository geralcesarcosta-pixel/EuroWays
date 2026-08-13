import React from 'react';

interface FastwingsLogoProps {
  theme?: 'orange' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const FastwingsLogo: React.FC<FastwingsLogoProps> = ({
  theme = 'orange',
  size = 'md',
  showTagline = true,
  className = '',
  onClick,
}) => {
  const isWhite = theme === 'white';
  const primaryColor = isWhite ? '#FFFFFF' : '#EA580C'; // Professional Polish vibrant orange-600
  const secondaryColor = isWhite ? '#FFFFFF' : '#EA580C';

  const sizeClasses = {
    sm: 'h-7',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-start select-none cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] ${className}`}
      id="fastwings-brand-logo"
    >
      <svg
        viewBox="0 0 450 140"
        className={`${sizeClasses[size]} w-auto fill-current overflow-visible`}
        style={{ color: primaryColor }}
      >
        <g id="fastwings-letters">
          {/* 'fast' */}
          <text
            x="20"
            y="92"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Montserrat', sans-serif"
            fontWeight="900"
            fontSize="88"
            letterSpacing="-2px"
            fill={primaryColor}
          >
            fastwi
          </text>
          
          {/* 'n' */}
          <text
            x="280"
            y="92"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Montserrat', sans-serif"
            fontWeight="900"
            fontSize="88"
            letterSpacing="-2px"
            fill={primaryColor}
          >
            n
          </text>

          {/* Smiling winking face icon on the 'g' spot */}
          <g transform="translate(352, 60)">
            {/* Base head / circular glow outline */}
            <circle cx="20" cy="8" r="28" fill="none" stroke={primaryColor} strokeWidth="7" />
            
            {/* Winking Left Eye (curved arc) */}
            <path
              d="M 6 4 Q 12 10 18 4"
              fill="none"
              stroke={primaryColor}
              strokeWidth="5"
              strokeLinecap="round"
            />
            
            {/* Open Right Eye (circle with pupil) */}
            <circle cx="28" cy="4" r="5" fill="none" stroke={primaryColor} strokeWidth="4" />
            <circle cx="28" cy="4" r="2.2" fill={primaryColor} />
            
            {/* Warm Smiling Mouth under the eyes */}
            <path
              d="M 10 18 Q 20 30 30 18"
              fill="none"
              stroke={primaryColor}
              strokeWidth="5.5"
              strokeLinecap="round"
            />
          </g>

          {/* 's' */}
          <text
            x="400"
            y="92"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Montserrat', sans-serif"
            fontWeight="900"
            fontSize="88"
            letterSpacing="-2px"
            fill={primaryColor}
          >
            s
          </text>
        </g>

        {/* Tagline: "s u n n y   l o w   f a r e s" */}
        {showTagline && (
          <text
            x="22"
            y="126"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontWeight="700"
            fontSize="19"
            letterSpacing="8px"
            fill={secondaryColor}
            opacity={isWhite ? 0.95 : 0.9}
          >
            SUNNY LOW FARES
          </text>
        )}
      </svg>
    </div>
  );
};
