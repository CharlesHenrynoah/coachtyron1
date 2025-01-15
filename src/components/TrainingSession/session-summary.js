'use client'

import { CheckCircle } from 'lucide-react'
import './TrainingSession.css'

export default function SessionSummary({ exercises, onStart }) {
  const totalDuration = exercises.reduce((total, phase) => 
    total + phase.repetitions * phase.exercises.reduce((phaseTotal, exercise) => 
      phaseTotal + exercise.duration + 15, 0
    ), 0
  )
  const totalMinutes = Math.floor(totalDuration / 60)
  const totalSeconds = totalDuration % 60

  return (
    <div className="session-card">
      <h2>Session Summary</h2>
      {exercises.map((phase, phaseIndex) => (
        <div key={`phase-${phase.phase}-${phaseIndex}`} className="phase-section">
          <h3 className="phase-title">
            Phase {phase.phase}: {phase.name}
            <span className="phase-repetitions">
              {phase.repetitions > 1 ? ` (x${phase.repetitions})` : ''}
            </span>
          </h3>
          <div className="exercise-list">
            {phase.exercises.map((exercise, exerciseIndex) => (
              <div 
                key={`exercise-${exercise.id}-${phaseIndex}-${exerciseIndex}`} 
                className="exercise-item"
              >
                <CheckCircle className="exercise-icon" />
                <span className="exercise-name">{exercise.name}</span>
                <span className="exercise-duration">{exercise.duration}s + 15s</span>
              </div>
            ))}
          </div>
          <div className="phase-duration">
            Phase Duration: {Math.floor(phase.repetitions * (phase.exercises.reduce((total, exercise) => total + exercise.duration + 15, 0)) / 60)}min
          </div>
        </div>
      ))}
      <div className="summary-footer">
        <p>Total Duration: {totalMinutes}min {totalSeconds}s</p>
        <button className="button-primary" onClick={onStart}>
          Start Session
        </button>
      </div>
    </div>
  )
}
