import React from 'react';
import { motion } from 'motion/react';
import { CharacterCostume } from '../types';
import { DEFAULT_COSTUME } from '../data/costumeData';

interface RunningCharacterProps {
  state?: 'running' | 'correct' | 'wrong' | 'idle';
  className?: string;
  size?: number; // size in px
  costume?: CharacterCostume;
}

export const RunningCharacter: React.FC<RunningCharacterProps> = ({
  state = 'running',
  className = '',
  size = 72,
  costume = DEFAULT_COSTUME
}) => {
  const topType = costume.top || 'default';
  const bottomType = costume.bottom || 'default';
  const accessoryType = costume.accessory || 'default';

  // Determine colors based on equipped costume
  const topGradId = `shirtGrad_${topType}`;
  const shoeGradId = `shoeGrad_${bottomType}`;

  const shortsColor =
    bottomType === 'white' ? '#f1f5f9' : bottomType === 'black' ? '#0f172a' : '#1e293b';
  const shortsStripeColor = bottomType === 'white' ? '#0284c7' : '#ffffff';

  return (
    <div
      className={`relative select-none flex items-center justify-center ${className}`}
      style={{ width: size, height: size * 1.18 }}
    >
      <motion.svg
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
        animate={
          state === 'running'
            ? {
                y: [0, -7, 0],
                rotate: [0, 2, -2, 0],
                transition: { repeat: Infinity, duration: 0.42, ease: 'easeInOut' }
              }
            : state === 'correct'
            ? {
                y: [0, -22, 0, -10, 0],
                scale: [1, 1.15, 1],
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.7, ease: 'easeOut' }
              }
            : state === 'wrong'
            ? {
                x: [-5, 5, -5, 5, 0],
                rotate: [0, -6, 6, 0],
                transition: { duration: 0.45 }
              }
            : {
                y: [0, -3, 0],
                transition: { repeat: Infinity, duration: 1.8, ease: 'easeInOut' }
              }
        }
      >
        <defs>
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5c2e17" />
            <stop offset="100%" stopColor="#381a0b" />
          </linearGradient>

          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff1e6" />
            <stop offset="100%" stopColor="#fed7aa" />
          </linearGradient>

          {/* Top Gradients */}
          <linearGradient id="shirtGrad_default" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="shirtGrad_red" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <linearGradient id="shirtGrad_mint" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="shirtGrad_gold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="shirtGrad_neon" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#7e22ce" />
          </linearGradient>

          {/* Shoe Gradients */}
          <linearGradient id="shoeGrad_default" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
          <linearGradient id="shoeGrad_white" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="shoeGrad_black" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>

        {/* Speed wind puffs when running */}
        {state === 'running' && (
          <g opacity="0.75">
            <path d="M 6 56 Q 16 54 22 56" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 2 74 Q 14 72 20 74" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 8 92 Q 18 90 24 92" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {/* Celebration sparkle stars when correct */}
        {state === 'correct' && (
          <g>
            <motion.path
              animate={{ scale: [0.8, 1.25, 0.8], rotate: [0, 90, 180] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              d="M 18 18 L 21 24 L 27 25 L 22 29 L 24 35 L 18 31 L 12 35 L 14 29 L 9 25 L 15 24 Z"
              fill="#fbbf24"
            />
            <motion.path
              animate={{ scale: [1, 1.3, 1], rotate: [0, -90, -180] }}
              transition={{ repeat: Infinity, duration: 0.9, delay: 0.2 }}
              d="M 82 16 L 84 21 L 89 22 L 85 25 L 86 30 L 82 27 L 78 30 L 79 25 L 75 22 L 80 21 Z"
              fill="#f472b6"
            />
          </g>
        )}

        {/* Sweat drop when wrong */}
        {state === 'wrong' && (
          <motion.path
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            d="M 74 22 C 74 18 78 17 78 21 C 78 24 74 24 74 22 Z"
            fill="#38bdf8"
            stroke="#0284c7"
            strokeWidth="1"
          />
        )}

        {/* ================= BACK LIMBS ================= */}
        {state === 'running' ? (
          <>
            <path d="M 44 76 Q 34 86 28 96" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
            <path d="M 30 94 L 26 100" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
            <ellipse
              cx="23"
              cy="102"
              rx="7"
              ry="4.5"
              fill={`url(#${shoeGradId})`}
              transform="rotate(-20 23 102)"
            />
            <path d="M 17 104 Q 23 106 29 102" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <path d="M 42 54 Q 30 60 24 54" stroke="#fed7aa" strokeWidth="5.5" strokeLinecap="round" />
            <circle cx="23" cy="53" r="3.8" fill="#fed7aa" />
          </>
        ) : state === 'correct' ? (
          <>
            <path d="M 44 76 Q 38 92 36 102" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
            <path d="M 37 98 L 35 104" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="32" cy="108" rx="8" ry="4.5" fill={`url(#${shoeGradId})`} />
            <rect x="25" y="110" width="14" height="2.5" rx="1.2" fill="#ffffff" />
          </>
        ) : (
          <>
            <path d="M 44 76 L 38 98" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
            <path d="M 39 94 L 37 100" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="34" cy="104" rx="7.5" ry="4.5" fill={`url(#${shoeGradId})`} />
          </>
        )}

        {/* ================= TORSO & CLOTHES ================= */}
        {/* Shorts */}
        <path
          d="M 40 70 L 60 70 L 63 83 L 53 83 L 50 78 L 47 83 L 37 83 Z"
          fill={shortsColor}
        />
        <path d="M 38 72 L 36 82" stroke={shortsStripeColor} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 62 72 L 64 82" stroke={shortsStripeColor} strokeWidth="1.5" strokeLinecap="round" />

        {/* Shirt */}
        <path
          d="M 38 50 C 38 46 62 46 62 50 L 60 72 L 40 72 Z"
          fill={`url(#${topGradId})`}
        />
        {/* Collar */}
        <path
          d="M 44 48 Q 50 53 56 48"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Badge on chest depending on top */}
        {topType === 'red' ? (
          // Fire flame
          <path d="M 50 56 Q 53 60 50 64 Q 47 60 50 56 Z" fill="#fef08a" />
        ) : topType === 'mint' ? (
          // Ace leaf
          <path d="M 50 56 C 53 58 53 63 50 65 C 47 63 47 58 50 56 Z" fill="#ffffff" />
        ) : topType === 'gold' ? (
          // Crown
          <path d="M 46 63 L 47 58 L 50 60 L 53 58 L 54 63 Z" fill="#78350f" />
        ) : topType === 'neon' ? (
          // Diamond
          <path d="M 50 56 L 53 60 L 50 64 L 47 60 Z" fill="#f0abfc" />
        ) : (
          // Default star
          <path
            d="M 50 56 L 51.5 59.5 L 55 60 L 52.5 62 L 53 65.5 L 50 63.8 L 47 65.5 L 47.5 62 L 45 60 L 48.5 59.5 Z"
            fill="#fde047"
          />
        )}

        {/* ================= FRONT LIMBS ================= */}
        {state === 'running' ? (
          <>
            <path d="M 56 76 Q 66 86 64 100" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
            <path d="M 64 96 L 63 103" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="67" cy="106" rx="8.5" ry="4.8" fill={`url(#${shoeGradId})`} />
            <rect x="60" y="108.5" width="15" height="2.5" rx="1.2" fill="#ffffff" />
            <path d="M 64 103 Q 68 102 71 104" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

            <path d="M 58 52 Q 68 56 74 48" stroke="#fed7aa" strokeWidth="5.5" strokeLinecap="round" />
            <circle cx="75" cy="47" r="4" fill="#fed7aa" />
          </>
        ) : state === 'correct' ? (
          <>
            <path d="M 56 76 Q 66 84 72 96" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
            <path d="M 70 92 L 75 98" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
            <ellipse
              cx="79"
              cy="101"
              rx="8"
              ry="4.5"
              fill={`url(#${shoeGradId})`}
              transform="rotate(15 79 101)"
            />
            <path d="M 73 103 L 85 101" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

            <path d="M 40 50 Q 28 36 24 20" stroke="#fed7aa" strokeWidth="5.5" strokeLinecap="round" />
            <circle cx="23" cy="18" r="4.2" fill="#fed7aa" />

            <path d="M 60 50 Q 72 36 76 20" stroke="#fed7aa" strokeWidth="5.5" strokeLinecap="round" />
            <circle cx="77" cy="18" r="4.2" fill="#fed7aa" />
          </>
        ) : state === 'wrong' ? (
          <>
            <path d="M 56 76 L 64 98" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
            <path d="M 63 94 L 64 100" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="68" cy="104" rx="7.5" ry="4.5" fill={`url(#${shoeGradId})`} />

            <path d="M 40 52 Q 32 46 36 38" stroke="#fed7aa" strokeWidth="5.5" strokeLinecap="round" />
            <circle cx="36" cy="36" r="3.8" fill="#fed7aa" />
            <path d="M 60 52 Q 68 46 64 38" stroke="#fed7aa" strokeWidth="5.5" strokeLinecap="round" />
            <circle cx="64" cy="36" r="3.8" fill="#fed7aa" />
          </>
        ) : (
          <>
            <path d="M 56 76 L 60 98" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
            <path d="M 59 94 L 60 100" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="64" cy="104" rx="7.5" ry="4.5" fill={`url(#${shoeGradId})`} />

            <path d="M 60 52 Q 72 44 72 32" stroke="#fed7aa" strokeWidth="5.5" strokeLinecap="round" />
            <circle cx="72" cy="30" r="4" fill="#fed7aa" />
          </>
        )}

        {/* ================= HEAD & FACE ================= */}
        <circle cx="33" cy="35" r="4.5" fill="#fed7aa" />
        <circle cx="67" cy="35" r="4.5" fill="#fed7aa" />

        <circle cx="50" cy="34" r="18.5" fill="url(#skinGrad)" />

        <ellipse cx="38" cy="38" rx="4.5" ry="2.5" fill="#fb7185" opacity="0.45" />
        <ellipse cx="62" cy="38" rx="4.5" ry="2.5" fill="#fb7185" opacity="0.45" />

        {state === 'correct' ? (
          <>
            <path d="M 40 33 Q 44 28 48 33" stroke="#381a0b" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M 52 33 Q 56 28 60 33" stroke="#381a0b" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M 44 40 Q 50 49 56 40 Z" fill="#e11d48" />
            <path d="M 46 43 Q 50 48 54 43" fill="#fda4af" />
          </>
        ) : state === 'wrong' ? (
          <>
            <path d="M 41 31 L 46 34 L 41 37" stroke="#381a0b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 59 31 L 54 34 L 59 37" stroke="#381a0b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 45 42 Q 48 40 50 42 Q 52 44 55 42" stroke="#381a0b" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <path d="M 40 27 Q 44 25 47 27" stroke="#5c2e17" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 53 27 Q 56 25 60 27" stroke="#5c2e17" strokeWidth="2" strokeLinecap="round" fill="none" />

            <ellipse cx="44" cy="33" rx="3.5" ry="4.5" fill="#1e293b" />
            <circle cx="45.5" cy="31.5" r="1.5" fill="#ffffff" />
            <circle cx="43" cy="35" r="0.8" fill="#ffffff" />

            <ellipse cx="56" cy="33" rx="3.5" ry="4.5" fill="#1e293b" />
            <circle cx="57.5" cy="31.5" r="1.5" fill="#ffffff" />
            <circle cx="55" cy="35" r="0.8" fill="#ffffff" />

            <circle cx="50" cy="36" r="1" fill="#f97316" />
            <path d="M 46 40 Q 50 44 54 40" stroke="#381a0b" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Glasses Accessory (if equipped) */}
        {accessoryType === 'glasses' && (
          <g>
            <circle cx="44" cy="33" r="6" stroke="#0284c7" strokeWidth="2" fill="#e0f2fe" fillOpacity="0.3" />
            <circle cx="56" cy="33" r="6" stroke="#0284c7" strokeWidth="2" fill="#e0f2fe" fillOpacity="0.3" />
            <line x1="50" y1="33" x2="50" y2="33" stroke="#0284c7" strokeWidth="2" />
            <path d="M 38 33 L 34 32" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 62 33 L 66 32" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        )}

        {/* ================= BOY HAIR & HEADWEAR ================= */}
        {/* Base hair behind or beneath headwear */}
        <path
          d="M 32 26 C 30 18 36 12 50 11 C 64 12 70 18 68 26 C 66 22 62 18 56 18 C 53 18 51 22 47 18 C 42 18 36 21 32 26 Z"
          fill="url(#hairGrad)"
        />

        {/* Headband / Visor / Crown Accessory */}
        {accessoryType === 'none' || accessoryType === 'glasses' ? null : accessoryType === 'visor' ? (
          // Pink Sun Visor
          <g>
            <path d="M 31 26 C 31 22 69 22 69 26 L 68 30 C 68 26 32 26 32 30 Z" fill="#ec4899" />
            <path d="M 28 26 Q 50 20 72 26 Q 50 16 28 26 Z" fill="#f43f5e" />
          </g>
        ) : accessoryType === 'lightning' ? (
          // Purple Lightning Band
          <g>
            <path d="M 32 26 C 32 23 68 23 68 26 L 67 29 C 67 26 33 26 33 29 Z" fill="#8b5cf6" />
            <path d="M 49 24 L 51 26 L 49 28 L 52 28 L 48 31 L 50 27 L 48 27 Z" fill="#fde047" />
          </g>
        ) : accessoryType === 'crown' ? (
          // Gold Laurel Wreath / Crown
          <g>
            <path d="M 32 26 C 32 23 68 23 68 26 L 67 29 C 67 26 33 26 33 29 Z" fill="#eab308" />
            <path d="M 42 22 Q 44 19 46 22" stroke="#facc15" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 48 20 Q 50 16 52 20" stroke="#facc15" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M 54 22 Q 56 19 58 22" stroke="#facc15" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
        ) : accessoryType === 'default' ? (
          // Default Yellow Headband
          <g>
            <path d="M 32 26 C 32 23 68 23 68 26 L 67 29 C 67 26 33 26 33 29 Z" fill="#f59e0b" />
            <line x1="34" y1="27.5" x2="66" y2="27.5" stroke="#ffffff" strokeWidth="1.5" />
          </g>
        ) : null}

        {/* Forehead Bangs */}
        <path
          d="M 34 24 Q 40 28 43 23 Q 48 30 52 23 Q 56 29 62 23 Q 66 26 67 24 C 68 18 64 12 50 11 C 36 12 33 18 34 24 Z"
          fill="url(#hairGrad)"
        />
        <path d="M 47 12 Q 51 7 54 11" stroke="#7c3f1d" strokeWidth="2" strokeLinecap="round" fill="none" />
      </motion.svg>
    </div>
  );
};
