# Taklifnoma 💌

A playful, romantic date-invitation site. Frontend only — no backend, no database.

## Flow

1. **Welcome** — beating hearts and the invitation button
2. **Question** — "will you go out with me?" with two honest answers and one
   "No" button that runs away from the cursor (desktop) and dodges taps
   (mobile). If somehow pressed, it "breaks" and marks the correct answers.
3. **Planner** — place → date (custom calendar, past dates disabled) → time
   (past times disabled for today) → favourite flowers → a note
4. **Final invitation** — winged heart pierced by Cupid's arrow, canvas
   fireworks (some bursts are heart-shaped) and a ~30s romantic melody
   synthesized live with the Web Audio API — no audio files needed.

UI language: Uzbek. Design: red / pink / white, fully responsive.

## Stack

React 19 + Vite. No other runtime dependencies.

## Run

```bash
npm install
npm run dev      # dev server on http://localhost:5173 (exposed to LAN)
npm run build    # production build in dist/
npm run lint     # oxlint
```
