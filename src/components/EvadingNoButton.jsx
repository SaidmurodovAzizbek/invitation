import { useRef, useState } from 'react'

const TAUNTS = [
  'Ushlab ko’r-chi! 😜',
  'Juda sekinsan! 🏃‍♀️💨',
  'Bu tugma sendan qochyapti 🙈',
  'Baribir foydasi yo’q 😝',
  'Yuqoridagilar yaxshiroq-ku! 😌',
  'Taslim bo’lmayman! 💪😆',
  'Yo’q, yo’q, yo’q! 🙅‍♀️',
  'Meni ushlashga urinma 😆',
  'Xa-xa, o’tkazolmaysan! 😹',
  'Charchamadingmi? 😏',
  'Boshqasini bossang-chi 👆💕',
]

// Shown in order over the final attempts, building up to the "give up".
const FINALE = [
  'Rostdan bosmoqchimisan? 🤔',
  'Aniqmisan? Yaxshilab o’yla 😯',
  'So’nggi imkoniyat... 🥺',
]
const GIVE_UP = 'Mayli, mayli... bosaqol 😮‍💨'

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

// "No" button that runs away from the cursor (desktop) and dodges taps (mobile).
// It stays in its layout slot and only shifts via transform: translate(), so
// ancestor transforms (e.g. the screen-entrance animation) never throw it off.
// Hops are short — a gentle glide, not a screen-wide teleport.
// After enough attempts it dares the user to press — and then "breaks".
export default function EvadingNoButton({ onRefused, broken }) {
  const btnRef = useRef(null)
  const lastEvade = useRef(0)
  const [attempts, setAttempts] = useState(0)
  const [offset, setOffset] = useState(null) // translate from the natural position

  // touch shrinks the button a little on every dodge; taps are counted once
  // (see handleClick) so the finale messages appear in order on both devices.
  const isCoarse =
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  const maxEvades = isCoarse ? 7 : 15 // fewer taps on mobile, more dodges on desktop
  const givenUp = attempts >= maxEvades

  // force=true bypasses the throttle for deliberate taps/clicks
  const evade = (e, force = false) => {
    const btn = btnRef.current
    if (!btn) return
    const now = performance.now()
    if (!force && now - lastEvade.current < 170) return // keep hops calm, not frantic
    lastEvade.current = now

    const rect = btn.getBoundingClientRect() // already includes the current translate
    const { width: w, height: h } = rect
    const curCx = rect.left + w / 2
    const curCy = rect.top + h / 2
    const prev = offset || { x: 0, y: 0 }
    const natCx = curCx - prev.x // where the button sits with no translate
    const natCy = curCy - prev.y

    const px = e && typeof e.clientX === 'number' ? e.clientX : curCx
    const py = e && typeof e.clientY === 'number' ? e.clientY : curCy

    // unit vector pointing away from the pointer (random if no pointer info)
    let ax = curCx - px
    let ay = curCy - py
    let len = Math.hypot(ax, ay)
    if (len < 1) {
      const a = Math.random() * Math.PI * 2
      ax = Math.cos(a)
      ay = Math.sin(a)
      len = 1
    }
    ax /= len
    ay /= len

    const pad = 14
    const minCx = pad + w / 2
    const maxCx = Math.max(window.innerWidth - pad - w / 2, minCx)
    const minCy = pad + h / 2
    const maxCy = Math.max(window.innerHeight - pad - h / 2, minCy)
    const hop = 70 + Math.random() * 50 // short, gentle leap (70–120px)

    // try a few directions so it never gets pinned under the cursor near an edge
    let targetCx = curCx
    let targetCy = curCy
    for (let i = 0; i < 6; i++) {
      const jitter = i === 0 ? 0 : (Math.random() - 0.5) * Math.PI
      const cos = Math.cos(jitter)
      const sin = Math.sin(jitter)
      const dx = ax * cos - ay * sin
      const dy = ax * sin + ay * cos
      targetCx = clamp(curCx + dx * hop, minCx, maxCx)
      targetCy = clamp(curCy + dy * hop, minCy, maxCy)
      if (Math.hypot(targetCx - px, targetCy - py) > Math.min(hop * 0.7, 60)) break
    }

    setOffset({ x: targetCx - natCx, y: targetCy - natCy })
    setAttempts((a) => a + 1)
  }

  const handlePointerDown = (e) => {
    if (broken) return
    if (givenUp) {
      // touch: the first tap after giving up actually presses it.
      // desktop: let the click event handle the press instead.
      if (isCoarse) onRefused()
      return
    }
    evade(e, true)
  }

  const handleClick = (e) => {
    // touch is fully handled in pointerdown so a tap isn't counted twice
    if (broken || isCoarse) return
    if (givenUp) {
      onRefused()
      return
    }
    evade(e, true) // desktop: a click that landed mid-flight — dodge again
  }

  const scale = isCoarse ? Math.max(1 - attempts * 0.06, 0.66) : 1
  const fleeing = offset && !broken // once broken it returns to its slot in the card

  // early attempts cycle the playful taunts; the last few switch to the
  // "are you sure?" finale that builds up to the button giving in.
  const remaining = maxEvades - attempts
  let label
  if (broken) label = '❌ Bu tugma ishlamaydi!'
  else if (attempts === 0) label = 'Yo’q, rozi emasman 🙅‍♀️'
  else if (givenUp) label = GIVE_UP
  else if (remaining <= FINALE.length) label = FINALE[FINALE.length - remaining]
  else label = TAUNTS[(attempts - 1) % TAUNTS.length]

  return (
    <button
      ref={btnRef}
      type="button"
      className={`btn btn-no ${fleeing ? 'is-fleeing' : ''} ${broken ? 'is-broken' : ''}`}
      style={
        fleeing
          ? {
              position: 'relative',
              zIndex: 60,
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            }
          : undefined
      }
      onPointerEnter={(e) => !isCoarse && !givenUp && !broken && evade(e)}
      onPointerMove={(e) => !isCoarse && !givenUp && !broken && evade(e)}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      {label}
    </button>
  )
}
