// Winged heart pierced by Cupid's arrow (animated SVG)
export default function WingedHeart() {
  return (
    <div className="winged-heart" aria-hidden="true">
      <svg viewBox="0 0 260 170" width="100%" height="100%">
        <defs>
          <linearGradient id="wh-heart" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff2e63" />
            <stop offset="1" stopColor="#ff6b9d" />
          </linearGradient>
          <linearGradient id="wh-wing" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#ffe3ec" />
          </linearGradient>
        </defs>

        {/* wings */}
        <g className="wh-wing wh-wing-l">
          <path
            d="M82 66 Q 36 22 8 44 Q 34 48 48 60 Q 20 60 10 80 Q 36 80 50 86 Q 32 94 30 110 Q 60 102 78 84 Q 86 74 82 66 Z"
            fill="url(#wh-wing)" stroke="#ffb3c6" strokeWidth="2.5" strokeLinejoin="round"
          />
        </g>
        <g className="wh-wing wh-wing-r">
          <path
            d="M178 66 Q 224 22 252 44 Q 226 48 212 60 Q 240 60 250 80 Q 224 80 210 86 Q 228 94 230 110 Q 200 102 182 84 Q 174 74 178 66 Z"
            fill="url(#wh-wing)" stroke="#ffb3c6" strokeWidth="2.5" strokeLinejoin="round"
          />
        </g>

        <g className="wh-arrow" transform="rotate(-16 130 88)">
          {/* arrow tail — drawn behind the heart */}
          <line x1="34" y1="88" x2="100" y2="88" stroke="#e8b64c" strokeWidth="5" strokeLinecap="round" />
          <path d="M34 88 L20 76 M34 88 L20 88 M34 88 L20 100" stroke="#d81b4a" strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>

        {/* heart */}
        <g className="wh-heart">
          <path
            d="M130 132 C 92 106, 64 82, 64 54 C 64 32, 84 20, 104 28 C 118 34, 126 46, 130 58 C 134 46, 142 34, 156 28 C 176 20, 196 32, 196 54 C 196 82, 168 106, 130 132 Z"
            fill="url(#wh-heart)" stroke="#d81b4a" strokeWidth="3"
          />
          <ellipse cx="103" cy="47" rx="13" ry="9" fill="#ffffff" opacity="0.45" transform="rotate(-24 103 47)" />
        </g>

        {/* arrow head — drawn in front of the heart */}
        <g className="wh-arrow" transform="rotate(-16 130 88)">
          <line x1="162" y1="88" x2="226" y2="88" stroke="#e8b64c" strokeWidth="5" strokeLinecap="round" />
          <path d="M226 78 L246 88 L226 98 Z" fill="#e8b64c" stroke="#d99a1f" strokeWidth="1.5" strokeLinejoin="round" />
        </g>
      </svg>
      <span className="wh-sparkle s1">✨</span>
      <span className="wh-sparkle s2">💫</span>
      <span className="wh-sparkle s3">✨</span>
    </div>
  )
}
