// A ~32s romantic melody synthesized with Web Audio API (no audio files needed).
// Style: soft music-box lead over warm broken-chord accompaniment. Key: C major.

const SEMITONES = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 }

function freq(note) {
  const m = /^([A-G]#?)(\d)$/.exec(note)
  const midi = 12 * (Number(m[2]) + 1) + SEMITONES[m[1]]
  return 440 * Math.pow(2, (midi - 69) / 12)
}

const BEAT = 0.72 // ~83 bpm

// [note, startBeat, durationBeats]
const MELODY = [
  ['E5', 0, 1], ['G5', 1, 1], ['C6', 2, 2],
  ['A5', 4, 1], ['G5', 5, 1], ['E5', 6, 2],
  ['F5', 8, 1], ['A5', 9, 1], ['C6', 10, 1.5], ['D6', 11.5, 0.5],
  ['B5', 12, 1], ['G5', 13, 1], ['D5', 14, 2],
  ['E5', 16, 0.5], ['G5', 16.5, 0.5], ['C6', 17, 1], ['B5', 18, 1], ['A5', 19, 1],
  ['A5', 20, 1], ['C6', 21, 1], ['E6', 22, 2],
  ['D6', 24, 1], ['C6', 25, 1], ['A5', 26, 2],
  ['G5', 28, 1], ['A5', 29, 1], ['B5', 30, 2],
  ['A5', 32, 1], ['C6', 33, 1], ['F6', 34, 2],
  ['E6', 36, 1], ['D6', 37, 1], ['B5', 38, 2],
  // final: long tonic with a gentle upward sparkle
  ['C6', 40, 3], ['E5', 40.5, 0.4], ['G5', 41, 0.4], ['E6', 42, 2],
]

// one chord per bar: [bass, arpeggio pattern (4 beats), pad triad]
const CHORDS = {
  C: { bass: 'C2', arp: ['C3', 'G3', 'E4', 'G3'], pad: ['C4', 'E4', 'G4'] },
  Am: { bass: 'A2', arp: ['A2', 'E3', 'C4', 'E3'], pad: ['A3', 'C4', 'E4'] },
  F: { bass: 'F2', arp: ['F2', 'C3', 'A3', 'C4'], pad: ['F3', 'A3', 'C4'] },
  G: { bass: 'G2', arp: ['G2', 'D3', 'B3', 'D3'], pad: ['G3', 'B3', 'D4'] },
}
const PROGRESSION = ['C', 'Am', 'F', 'G', 'C', 'Am', 'F', 'G', 'F', 'G', 'C']

// music-box pluck: sine + soft octave overtone with fast attack, long decay
function pluck(ctx, out, note, when, dur, peak) {
  const f = freq(note)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, when)
  g.gain.exponentialRampToValueAtTime(peak, when + 0.025)
  g.gain.exponentialRampToValueAtTime(0.0008, when + Math.max(dur * 1.35, 0.9))
  g.connect(out)

  const o1 = ctx.createOscillator()
  o1.type = 'sine'
  o1.frequency.value = f
  o1.connect(g)

  const o2 = ctx.createOscillator()
  o2.type = 'sine'
  o2.frequency.value = f * 2
  const g2 = ctx.createGain()
  g2.gain.value = 0.16
  o2.connect(g2)
  g2.connect(g)

  const end = when + Math.max(dur * 1.4, 1)
  o1.start(when); o2.start(when)
  o1.stop(end); o2.stop(end)
}

// warm sustained pad note through a lowpass filter
function pad(ctx, out, note, when, dur, peak) {
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, when)
  g.gain.linearRampToValueAtTime(peak, when + 0.4)
  g.gain.linearRampToValueAtTime(0.0001, when + dur)
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 750
  const o = ctx.createOscillator()
  o.type = 'triangle'
  o.frequency.value = freq(note)
  o.connect(lp); lp.connect(g); g.connect(out)
  o.start(when)
  o.stop(when + dur + 0.1)
}

// Starts playback immediately (must be called from a user gesture).
// Returns a stop() function.
export function playRomanticSong() {
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return () => {}
  const ctx = new Ctx()
  if (ctx.state === 'suspended') ctx.resume()

  const master = ctx.createGain()
  master.gain.value = 0.85
  master.connect(ctx.destination)

  const t0 = ctx.currentTime + 0.15
  const at = (beat) => t0 + beat * BEAT

  MELODY.forEach(([note, start, dur]) => pluck(ctx, master, note, at(start), dur * BEAT, 0.2))

  PROGRESSION.forEach((name, bar) => {
    const { bass, arp, pad: triad } = CHORDS[name]
    const barStart = bar * 4
    pluck(ctx, master, bass, at(barStart), 3 * BEAT, 0.1)
    arp.forEach((n, i) => pluck(ctx, master, n, at(barStart + i), 1.2 * BEAT, 0.07))
    triad.forEach((n) => pad(ctx, master, n, at(barStart), 4 * BEAT, 0.028))
  })

  // gentle fade-out at the end
  const TOTAL_BEATS = 45
  master.gain.setValueAtTime(0.85, at(41))
  master.gain.linearRampToValueAtTime(0.0001, at(TOTAL_BEATS))

  const closeTimer = setTimeout(() => ctx.close().catch(() => {}), (TOTAL_BEATS * BEAT + 1.5) * 1000)

  return function stop() {
    clearTimeout(closeTimer)
    try {
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
      master.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.4)
    } catch { /* context may already be closed */ }
    setTimeout(() => ctx.close().catch(() => {}), 500)
  }
}
