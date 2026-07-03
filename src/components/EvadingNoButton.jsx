import { useRef, useState } from 'react'

const TAUNTS = [
  'Ushlab ko’r-chi! 😜',
  'Juda sekinsan! 🏃‍♀️💨',
  'Bu tugma sendan qochyapti 🙈',
  'Baribir foydasi yo’q 😝',
  'Yuqoridagilar yaxshiroq-ku! 😌',
  'Taslim bo’lmayman! 💪😆',
]

// "No" button that runs away from the cursor (desktop) and dodges taps (mobile).
// After enough attempts it dares the user to press — and then "breaks".
export default function EvadingNoButton({ onRefused, broken }) {
  const btnRef = useRef(null)
  const [attempts, setAttempts] = useState(0)
  const [pos, setPos] = useState(null)

  // on touch, one tap fires pointerdown AND click (target captured at touchstart),
  // so each tap counts as ~2 attempts; the button also shrinks with every dodge
  const isCoarse =
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  const maxEvades = 6
  const givenUp = attempts >= maxEvades

  const evade = () => {
    const btn = btnRef.current
    if (!btn) return
    const { width: w, height: h } = btn.getBoundingClientRect()
    const pad = 14
    const x = pad + Math.random() * Math.max(window.innerWidth - w - pad * 2, 1)
    const y = pad + Math.random() * Math.max(window.innerHeight - h - pad * 2, 1)
    setPos({ x, y })
    setAttempts((a) => a + 1)
  }

  const handleClick = () => {
    if (broken) return
    if (!givenUp) {
      evade() // a click somehow landed mid-flight — dodge again
      return
    }
    onRefused()
  }

  const scale = isCoarse ? Math.max(1 - attempts * 0.1, 0.62) : 1
  const label = broken
    ? '❌ Bu tugma ishlamaydi!'
    : attempts === 0
      ? 'Yo’q, rozi emasman 🙅‍♀️'
      : givenUp
        ? 'Charchadim... mayli, bos 😮‍💨'
        : TAUNTS[(attempts - 1) % TAUNTS.length]

  return (
    <button
      ref={btnRef}
      type="button"
      className={`btn btn-no ${pos ? 'is-fleeing' : ''} ${broken ? 'is-broken' : ''}`}
      style={
        pos && !broken // once broken it returns to its place in the card
          ? { position: 'fixed', left: pos.x, top: pos.y, transform: `scale(${scale})`, zIndex: 60 }
          : undefined
      }
      onPointerEnter={() => !isCoarse && !givenUp && !broken && evade()}
      onPointerDown={() => !givenUp && !broken && evade()}
      onClick={handleClick}
    >
      {label}
    </button>
  )
}
