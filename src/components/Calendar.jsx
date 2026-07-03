import { useState } from 'react'
import { MONTHS_UZ, WEEK_HEAD_UZ, startOfDay, isSameDay } from '../utils/dateUz'

// Custom month calendar. Past dates are disabled — the future only! 😉
export default function Calendar({ value, onChange }) {
  const today = startOfDay(new Date())
  const [view, setView] = useState(
    () => new Date((value || today).getFullYear(), (value || today).getMonth(), 1),
  )

  const canGoPrev =
    view.getFullYear() > today.getFullYear() ||
    (view.getFullYear() === today.getFullYear() && view.getMonth() > today.getMonth())

  const shiftMonth = (delta) =>
    setView(new Date(view.getFullYear(), view.getMonth() + delta, 1))

  // Monday-first offset for the 1st of the month
  const leading = (view.getDay() + 6) % 7
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < leading; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(view.getFullYear(), view.getMonth(), d))
  }

  return (
    <div className="calendar">
      <div className="calendar-head">
        <button
          type="button"
          className="cal-nav"
          onClick={() => shiftMonth(-1)}
          disabled={!canGoPrev}
          aria-label="Oldingi oy"
        >
          ‹
        </button>
        <span className="cal-title">
          {MONTHS_UZ[view.getMonth()]} {view.getFullYear()}
        </span>
        <button type="button" className="cal-nav" onClick={() => shiftMonth(1)} aria-label="Keyingi oy">
          ›
        </button>
      </div>

      <div className="calendar-grid">
        {WEEK_HEAD_UZ.map((d) => (
          <span key={d} className="cal-weekday">{d}</span>
        ))}
        {cells.map((date, i) => {
          if (!date) return <span key={`empty-${i}`} />
          const disabled = date < today
          const selected = isSameDay(date, value)
          const isToday = isSameDay(date, today)
          return (
            <button
              key={date.getTime()}
              type="button"
              className={`cal-day ${selected ? 'is-selected' : ''} ${isToday ? 'is-today' : ''}`}
              disabled={disabled}
              onClick={() => onChange(date)}
            >
              {selected ? '💗' : date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
