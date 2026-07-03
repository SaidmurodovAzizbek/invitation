import { useEffect, useRef } from 'react'

const COLORS = ['#ff2e63', '#ff6b9d', '#ffd166', '#ffffff', '#ff8fab', '#ffb3c6']

function drawHeart(ctx, x, y, s, color, alpha) {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.fillStyle = color
  ctx.translate(x, y)
  ctx.beginPath()
  ctx.moveTo(0, 0.4 * s)
  ctx.bezierCurveTo(-0.65 * s, 0.1 * s, -0.5 * s, -0.55 * s, 0, -0.15 * s)
  ctx.bezierCurveTo(0.5 * s, -0.55 * s, 0.65 * s, 0.1 * s, 0, 0.4 * s)
  ctx.fill()
  ctx.restore()
}

// Canvas fireworks: rockets rise and burst into sparks — some bursts are heart-shaped 💖
export default function Fireworks({ active = true }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const DPR = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0
    let H = 0

    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W * DPR
      canvas.height = H * DPR
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const rockets = []
    const sparks = []
    const pick = () => COLORS[(Math.random() * COLORS.length) | 0]

    const launch = () => {
      rockets.push({
        x: W * (0.15 + Math.random() * 0.7),
        y: H + 10,
        vx: (Math.random() - 0.5) * 1.4,
        vy: -(H * 0.012 + Math.random() * H * 0.004),
        color: pick(),
        heartBurst: Math.random() < 0.4,
      })
    }

    const explode = (r) => {
      const n = 46 + ((Math.random() * 20) | 0)
      for (let i = 0; i < n; i++) {
        let vx, vy
        if (r.heartBurst) {
          // velocities along a parametric heart curve
          const t = (i / n) * Math.PI * 2
          const k = 0.16 + Math.random() * 0.04
          vx = 16 * Math.pow(Math.sin(t), 3) * k
          vy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * k
        } else {
          const ang = Math.random() * Math.PI * 2
          const sp = 1 + Math.random() * 3.4
          vx = Math.cos(ang) * sp
          vy = Math.sin(ang) * sp
        }
        sparks.push({
          x: r.x, y: r.y, vx, vy,
          life: 1,
          decay: 0.008 + Math.random() * 0.009,
          size: 2 + Math.random() * 2.5,
          color: r.heartBurst ? (Math.random() < 0.7 ? '#ff4d79' : '#ffffff') : pick(),
          heart: !r.heartBurst && Math.random() < 0.22,
        })
      }
    }

    let raf
    const tick = () => {
      ctx.clearRect(0, 0, W, H)

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i]
        r.x += r.vx
        r.y += r.vy
        r.vy += 0.11
        ctx.globalAlpha = 0.9
        ctx.fillStyle = r.color
        ctx.beginPath()
        ctx.arc(r.x, r.y, 2.4, 0, Math.PI * 2)
        ctx.fill()
        if (r.vy >= -1.5) {
          explode(r)
          rockets.splice(i, 1)
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.035
        p.vx *= 0.985
        p.vy *= 0.985
        p.life -= p.decay
        if (p.life <= 0) {
          sparks.splice(i, 1)
          continue
        }
        if (p.heart) {
          drawHeart(ctx, p.x, p.y, p.size * 2.4, p.color, p.life)
        } else {
          ctx.globalAlpha = p.life
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }

    launch()
    const kickoff = setTimeout(launch, 350)
    const interval = setInterval(() => {
      if (sparks.length < 420) launch()
    }, 900)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(interval)
      clearTimeout(kickoff)
      window.removeEventListener('resize', resize)
    }
  }, [active])

  return <canvas ref={canvasRef} className="fx-canvas" aria-hidden="true" />
}
