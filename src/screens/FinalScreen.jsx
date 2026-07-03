import { useState } from 'react'
import Fireworks from '../components/Fireworks'
import WingedHeart from '../components/WingedHeart'
import { formatUzDate } from '../utils/dateUz'

const MEGA_HEARTS = Array.from({ length: 18 }, (_, i) => i)

// The final invitation card with fireworks, music and a winged heart
export default function FinalScreen({ plan }) {
  const [accepted, setAccepted] = useState(false)

  const flowers = [
    ...plan.flowerPicks.map((f) => f.slice(f.indexOf(' ') + 1).toLowerCase()),
    ...(plan.flowerText.trim() ? [plan.flowerText.trim()] : []),
  ].join(', ')

  return (
    <div className="screen final-screen">
      <Fireworks active />

      <div className="card invite-card">
        <WingedHeart />

        <p className="invite-eyebrow">— eng go’zal inson uchun —</p>
        <h2 className="script invite-title">Taklifnoma</h2>
        <div className="invite-divider">💞 ─── 💌 ─── 💞</div>

        <p className="invite-body">
          Azizam! 💖 Seni <b>{formatUzDate(plan.date)}</b> kuni soat{' '}
          <b>{plan.time}</b> da <b>«{plan.place}»</b> da uchrashuvga taklif qilaman.
        </p>

        {flowers && (
          <p className="invite-body invite-flowers">
            Va albatta, <b>{flowers}</b> ham men bilan birga keladi 💐🤞
          </p>
        )}

        <p className="invite-body invite-waiting">
          Seni intizorlik bilan kutaman... har bir daqiqani sanab! 🥺💘
        </p>

        <p className="invite-ps">P.S. Iltimos, kechikma! ⏰😉</p>

        {plan.note.trim() && (
          <p className="invite-note">Yozgan so’zlaringni yuragimga jo qildim 💌</p>
        )}

        {!accepted ? (
          <button
            type="button"
            className="btn btn-primary btn-xl pulse-glow"
            onClick={() => setAccepted(true)}
          >
            Qabul qildim 💖
          </button>
        ) : (
          <div className="accepted-msg">
            <span className="script">Ko’rishguncha, azizam! 😘</span>
            <span className="accepted-detail">
              {formatUzDate(plan.date)} • {plan.time} • {plan.place} ✨
            </span>
          </div>
        )}
      </div>

      {accepted && (
        <div className="celebrate" aria-hidden="true">
          {MEGA_HEARTS.map((i) => (
            <span
              key={i}
              className="burst-heart"
              style={{
                '--dx': `${(Math.random() - 0.5) * 460}px`,
                '--dy': `${(Math.random() - 0.5) * 460}px`,
                '--rot': `${(Math.random() - 0.5) * 300}deg`,
                animationDelay: `${Math.random() * 0.25}s`,
              }}
            >
              {['💖', '💗', '💕', '🌹', '✨', '🎉'][i % 6]}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
