'use client'

import { Trophy } from 'lucide-react'
import './TrainingSession.css'

export default function Congratulations({ xpGained, onRestart }) {
  return (
    <div className="congratulations-card">
      <Trophy size={64} className="trophy-icon" />
      <h2>Congratulations!</h2>
      <p>You've completed your training session</p>
      <div className="xp-text">+{xpGained} XP</div>
      <button className="button-primary" onClick={onRestart}>
        Start New Session
      </button>
    </div>
  )
}
