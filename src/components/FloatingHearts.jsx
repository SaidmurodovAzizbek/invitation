import { useMemo } from 'react'

const EMOJIS = ['💗', '💖', '💕', '❤️', '🩷', '💘', '🌸', '💞']

// ambient hearts drifting up the screen (pure CSS animation)
export default function FloatingHearts({ count = 14 }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        emoji: EMOJIS[i % EMOJIS.length],
        left: `${Math.random() * 100}%`,
        size: `${0.9 + Math.random() * 1.6}rem`,
        duration: `${9 + Math.random() * 10}s`,
        delay: `${-Math.random() * 18}s`,
        sway: `${(Math.random() - 0.5) * 120}px`,
      })),
    [count],
  )

  return (
    <div className="floating-hearts" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="floating-heart"
          style={{
            left: h.left,
            fontSize: h.size,
            animationDuration: h.duration,
            animationDelay: h.delay,
            '--sway': h.sway,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  )
}
