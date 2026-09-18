import React from 'react';
import { motion } from 'motion/react';
import { ObstacleKind } from '../types';

interface ObstacleViewProps {
  kind: ObstacleKind;
  className?: string;
  size?: number;
}

export const ObstacleView: React.FC<ObstacleViewProps> = ({
  kind,
  className = '',
  size = 54
}) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} style={{ width: size, height: size }}>
      {kind === 'rock' && (
        <motion.svg
          viewBox="0 0 80 80"
          className="w-full h-full drop-shadow-md"
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
        >
          {/* Shadow */}
          <ellipse cx="40" cy="70" rx="30" ry="8" fill="#475569" opacity="0.3" />
          {/* Giant Boulder Body */}
          <path
            d="M 16 62 Q 10 44 22 28 Q 36 12 54 18 Q 72 26 70 50 Q 68 66 48 68 Q 28 70 16 62 Z"
            fill="#64748b"
            stroke="#334155"
            strokeWidth="3.5"
          />
          {/* Boulder Highlights & Texture */}
          <path
            d="M 28 28 Q 40 18 52 24"
            stroke="#94a3b8"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* Rock Cracks */}
          <path
            d="M 38 34 L 46 44 L 42 54 L 50 60"
            stroke="#1e293b"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M 26 48 L 32 50 L 30 56"
            stroke="#1e293b"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Danger mark or moss */}
          <circle cx="28" cy="38" r="3" fill="#84cc16" opacity="0.8" />
          <circle cx="56" cy="52" r="3.5" fill="#84cc16" opacity="0.8" />
        </motion.svg>
      )}

      {kind === 'fence' && (
        <motion.svg
          viewBox="0 0 80 80"
          className="w-full h-full drop-shadow-md"
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
        >
          {/* Shadow */}
          <ellipse cx="40" cy="72" rx="32" ry="6" fill="#475569" opacity="0.25" />
          {/* Left post */}
          <rect x="16" y="24" width="8" height="46" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="2.5" />
          {/* Right post */}
          <rect x="56" y="24" width="8" height="46" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="2.5" />
          {/* Top rail with yellow-black hazard stripes */}
          <rect x="10" y="32" width="60" height="12" rx="3" fill="#facc15" stroke="#451a03" strokeWidth="2.5" />
          <line x1="20" y1="32" x2="14" y2="44" stroke="#1e293b" strokeWidth="4" />
          <line x1="36" y1="32" x2="30" y2="44" stroke="#1e293b" strokeWidth="4" />
          <line x1="52" y1="32" x2="46" y2="44" stroke="#1e293b" strokeWidth="4" />
          <line x1="66" y1="32" x2="60" y2="44" stroke="#1e293b" strokeWidth="4" />
          {/* Bottom rail */}
          <rect x="12" y="50" width="56" height="10" rx="2.5" fill="#92400e" stroke="#451a03" strokeWidth="2" />
        </motion.svg>
      )}

      {kind === 'animal' && (
        <motion.svg
          viewBox="0 0 80 80"
          className="w-full h-full drop-shadow-md"
          animate={{ x: [-4, 4, -4], y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Charging Cute Wild Boar / Puppy Obstacle */}
          <ellipse cx="40" cy="70" rx="26" ry="6" fill="#475569" opacity="0.3" />
          {/* Body */}
          <ellipse cx="42" cy="46" rx="24" ry="17" fill="#78350f" stroke="#451a03" strokeWidth="3" />
          {/* Legs */}
          <path d="M 26 56 L 24 68" stroke="#451a03" strokeWidth="5" strokeLinecap="round" />
          <path d="M 34 58 L 36 68" stroke="#451a03" strokeWidth="5" strokeLinecap="round" />
          <path d="M 52 58 L 50 68" stroke="#451a03" strokeWidth="5" strokeLinecap="round" />
          <path d="M 58 56 L 62 67" stroke="#451a03" strokeWidth="5" strokeLinecap="round" />
          {/* Snout */}
          <ellipse cx="22" cy="48" rx="8" ry="6" fill="#fca5a5" stroke="#451a03" strokeWidth="2" />
          <circle cx="19" cy="48" r="1.5" fill="#451a03" />
          <circle cx="23" cy="48" r="1.5" fill="#451a03" />
          {/* Ears */}
          <polygon points="32,32 26,20 38,26" fill="#92400e" stroke="#451a03" strokeWidth="2" />
          <polygon points="44,32 40,18 48,25" fill="#92400e" stroke="#451a03" strokeWidth="2" />
          {/* Tusks */}
          <path d="M 23 54 L 20 49" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          {/* Eyes */}
          <circle cx="32" cy="40" r="3" fill="#ffffff" />
          <circle cx="31" cy="40" r="1.8" fill="#1e293b" />
          {/* Tail */}
          <path d="M 64 42 Q 72 38 68 34" stroke="#451a03" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Dust clouds */}
          <circle cx="68" cy="62" r="4" fill="#cbd5e1" opacity="0.8" />
          <circle cx="74" cy="58" r="3" fill="#cbd5e1" opacity="0.6" />
        </motion.svg>
      )}
    </div>
  );
};
