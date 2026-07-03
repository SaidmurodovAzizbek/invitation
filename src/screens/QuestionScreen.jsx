import { useEffect, useRef, useState } from 'react'
import EvadingNoButton from '../components/EvadingNoButton'

const BURST_HEARTS = Array.from({ length: 14 }, (_, i) => i)

// The big question with two honest answers and one impossible one
export default function QuestionScreen({ onYes }) {
  const [refused, setRefused] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [toast, setToast] = useState('')
  const [celebrating, setCelebrating] = useState(false)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const handleYes = () => {
    if (celebrating) return
    setCelebrating(true)
    timers.current.push(setTimeout(onYes, 1100))
  }

  const handleRefused = () => {
    setRefused(true)
    setShaking(true)
    setToast('❌ Xatolik! Bu javob qabul qilinmaydi 😅')
    timers.current.push(setTimeout(() => setShaking(false), 650))
    timers.current.push(setTimeout(() => setToast(''), 3200))
  }

  return (
    <div className="screen">
      {toast && <div className="toast">{toast}</div>}

      <div className={`card question-card ${shaking ? 'shake' : ''}`}>
        <div className="q-emoji">🥺👉👈</div>
        <h2 className="script q-title">Seni uchrashuvga taklif qilmoqchiman!</h2>
        <p className="q-text">
          Men bilan uchrashuvga chiqishga <b>rozimisan</b>? 💘
        </p>

        {refused && (
          <div className="correct-hint">To’g’ri javoblar shu yerda 👇💖</div>
        )}

        <div className="answers">
          <button
            type="button"
            className={`btn btn-primary ${refused ? 'correct-glow' : ''}`}
            onClick={handleYes}
          >
            Ha! O’ylab ham o’tirmay roziman 😍
          </button>
          <button
            type="button"
            className={`btn btn-primary btn-soft ${refused ? 'correct-glow' : ''}`}
            onClick={handleYes}
          >
            O’ylab ko’rdim va baribir roziman 🥰
          </button>
          <EvadingNoButton onRefused={handleRefused} broken={refused} />
        </div>
      </div>

      {celebrating && (
        <div className="celebrate" aria-hidden="true">
          <div className="celebrate-text script">To’g’ri qaror! 🎉</div>
          {BURST_HEARTS.map((i) => (
            <span
              key={i}
              className="burst-heart"
              style={{
                '--dx': `${(Math.random() - 0.5) * 340}px`,
                '--dy': `${(Math.random() - 0.5) * 340}px`,
                '--rot': `${(Math.random() - 0.5) * 240}deg`,
                animationDelay: `${Math.random() * 0.18}s`,
              }}
            >
              {['💖', '💗', '💕', '🎉', '✨'][i % 5]}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
