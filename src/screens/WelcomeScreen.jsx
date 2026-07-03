// Landing: big beating hearts + the invitation button
export default function WelcomeScreen({ onOpen }) {
  return (
    <div className="screen welcome">
      <div className="hero" aria-hidden="true">
        <span className="hero-sparkle sp1">✨</span>
        <span className="hero-sparkle sp2">💫</span>
        <span className="hero-sparkle sp3">⭐</span>
        <span className="hero-sparkle sp4">✨</span>
        <div className="hero-heart hh-side hh-left"><div className="css-heart" /></div>
        <div className="hero-heart hh-main"><div className="css-heart" /></div>
        <div className="hero-heart hh-side hh-right"><div className="css-heart" /></div>
      </div>

      <h1 className="script welcome-title">Salom!</h1>
      <p className="welcome-sub">
        Sen uchun atalgan maxsus taklifim bor... 🤫💌
      </p>

      <button type="button" className="btn btn-primary btn-xl pulse-glow" onClick={onOpen}>
        Taklifnoma 💌
      </button>

      <p className="welcome-hint">👆 Bosishga jur’at et 😉</p>
    </div>
  )
}
