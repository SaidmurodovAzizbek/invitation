import { useState } from 'react'
import Calendar from '../components/Calendar'
import { formatUzDate, isSameDay, nowHHMM, startOfDay } from '../utils/dateUz'

const PLACE_IDEAS = ['☕ Kafe', '🌳 Park', '🎬 Kino', '🍽 Restoran', '🎡 Attraksion']
const TIME_SLOTS = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
const FLOWER_IDEAS = ['🌹 Atirgul', '🌷 Lola', '🌼 Romashka', '🌸 Sakura', '🌻 Kungaboqar', '💐 Aralash guldasta']

const STEPS = ['place', 'date', 'time', 'flowers', 'note']

// Multi-step planner: place → date → time → flowers → note
export default function PlanScreen({ plan, setPlan, onDone }) {
  const [idx, setIdx] = useState(0)
  const [timeWarn, setTimeWarn] = useState('')
  const step = STEPS[idx]

  const patch = (p) => setPlan((prev) => ({ ...prev, ...p }))

  const todaySelected = isSameDay(plan.date, startOfDay(new Date()))
  const isPastTime = (t) => todaySelected && t <= nowHHMM()

  const canNext =
    step === 'place' ? plan.place.trim().length > 0
    : step === 'date' ? Boolean(plan.date)
    : step === 'time' ? Boolean(plan.time)
    : true // flowers & note are optional

  const next = () => {
    if (!canNext) return
    if (idx === STEPS.length - 1) onDone()
    else setIdx(idx + 1)
  }

  const pickTime = (t) => {
    if (isPastTime(t)) {
      setTimeWarn('O’tgan vaqtni tanlab bo’lmaydi! Vaqt mashinam yo’q 😄⏰')
      return
    }
    setTimeWarn('')
    patch({ time: t })
  }

  const toggleFlower = (f) =>
    patch({
      flowerPicks: plan.flowerPicks.includes(f)
        ? plan.flowerPicks.filter((x) => x !== f)
        : [...plan.flowerPicks, f],
    })

  return (
    <div className="screen">
      <div className="card plan-card" key={step}>
        <div className="plan-top">
          {idx > 0 ? (
            <button type="button" className="back-btn" onClick={() => setIdx(idx - 1)} aria-label="Orqaga">
              ←
            </button>
          ) : (
            <span />
          )}
          <div className="progress-hearts" aria-label={`Bosqich ${idx + 1} / ${STEPS.length}`}>
            {STEPS.map((s, i) => (
              <span key={s} className={i === idx ? 'ph-current' : ''}>
                {i < idx ? '💖' : i === idx ? '💗' : '🤍'}
              </span>
            ))}
          </div>
          <span />
        </div>

        {step === 'place' && (
          <>
            <h2 className="script step-title">To’g’ri qaror qabul qilding! 🎉</h2>
            <p className="step-sub">Xo’sh, qayerni tanlaymiz? 📍</p>
            <input
              type="text"
              className="input"
              placeholder="Masalan: Anhor bo’yidagi kafe..."
              value={plan.place}
              onChange={(e) => patch({ place: e.target.value })}
              autoFocus
            />
            <div className="chips">
              {PLACE_IDEAS.map((p) => (
                <button
                  key={p}
                  type="button"
                  className="chip"
                  onClick={() => patch({ place: p.slice(p.indexOf(' ') + 1) })}
                >
                  {p}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'date' && (
          <>
            <h2 className="script step-title">Qaysi kuni uchrashamiz? 🗓️</h2>
            <p className="step-sub">O’tmishni tanlab bo’lmaydi — faqat kelajak! 😉</p>
            <Calendar value={plan.date} onChange={(d) => patch({ date: d })} />
            {plan.date && (
              <p className="picked-label">Tanlandi: <b>{formatUzDate(plan.date)}</b> 💕</p>
            )}
          </>
        )}

        {step === 'time' && (
          <>
            <h2 className="script step-title">Soat nechada? ⏰</h2>
            <p className="step-sub">Senga eng qulay vaqtni tanla</p>
            <div className="time-grid">
              {TIME_SLOTS.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`chip time-chip ${plan.time === t ? 'is-active' : ''}`}
                  disabled={isPastTime(t)}
                  onClick={() => pickTime(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <label className="custom-time">
              Yoki aniq vaqt:
              <input
                type="time"
                className="input input-time"
                value={plan.time}
                onChange={(e) => pickTime(e.target.value)}
              />
            </label>
            {timeWarn && <p className="warn">{timeWarn}</p>}
            {plan.time && !timeWarn && (
              <p className="picked-label">Tanlandi: <b>{plan.time}</b> ⏰💕</p>
            )}
          </>
        )}

        {step === 'flowers' && (
          <>
            <h2 className="script step-title">Qanday gullar yoqadi? 💐</h2>
            <p className="step-sub">Bilishim kerak... sababini keyin bilasan 😏</p>
            <div className="chips">
              {FLOWER_IDEAS.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`chip ${plan.flowerPicks.includes(f) ? 'is-active' : ''}`}
                  onClick={() => toggleFlower(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <textarea
              className="input textarea"
              rows={2}
              placeholder="Yoki o’zing yozib qo’y... 🌺"
              value={plan.flowerText}
              onChange={(e) => patch({ flowerText: e.target.value })}
            />
          </>
        )}

        {step === 'note' && (
          <>
            <h2 className="script step-title">Menga aytadigan gaping bormi? 💌</h2>
            <p className="step-sub">Ko’nglingdagi istalgan fikrni yozishing mumkin (ixtiyoriy)</p>
            <textarea
              className="input textarea"
              rows={4}
              placeholder="Sening so’zlaring... ✍️💕"
              value={plan.note}
              onChange={(e) => patch({ note: e.target.value })}
            />
          </>
        )}

        <button
          type="button"
          className={`btn btn-primary btn-next ${!canNext ? 'is-disabled' : ''}`}
          onClick={next}
          disabled={!canNext}
        >
          {idx === STEPS.length - 1 ? 'Tayyor ✨' : 'Davom etamiz 💕'}
        </button>
      </div>
    </div>
  )
}
