import { useState } from 'react'
import FloatingHearts from './components/FloatingHearts'
import WelcomeScreen from './screens/WelcomeScreen'
import QuestionScreen from './screens/QuestionScreen'
import PlanScreen from './screens/PlanScreen'
import FinalScreen from './screens/FinalScreen'
import { playRomanticSong } from './audio/song'

export default function App() {
  const [stage, setStage] = useState('welcome')
  const [plan, setPlan] = useState({
    place: '',
    date: null,
    time: '',
    flowerPicks: [],
    flowerText: '',
    note: '',
  })

  // music must start inside the click's call stack (browser autoplay policy)
  const finish = () => {
    playRomanticSong()
    setStage('final')
  }

  return (
    <div className="app">
      <FloatingHearts count={stage === 'final' ? 26 : 14} />
      {stage === 'welcome' && <WelcomeScreen onOpen={() => setStage('question')} />}
      {stage === 'question' && <QuestionScreen onYes={() => setStage('plan')} />}
      {stage === 'plan' && <PlanScreen plan={plan} setPlan={setPlan} onDone={finish} />}
      {stage === 'final' && <FinalScreen plan={plan} />}
    </div>
  )
}
