'use client'

import React from 'react'
import './TrainingSession.css'

export default function ProgressBar({ 
  exercises,
  currentPhase,
  currentExercise,
  currentCycle
}) {
  // Obtenir la phase actuelle
  const phase = exercises[currentPhase]
  
  // Calculer le nombre total d'exercices dans la phase actuelle
  const totalExercisesInPhase = phase.exercises.length
  const totalCycles = phase.repetitions

  // Générer les bâtons de progression pour le cycle actuel
  const progressBars = Array(totalExercisesInPhase).fill(0).map((_, index) => {
    const isCompleted = index < currentExercise - 1
    const isCurrent = index === currentExercise - 1
    
    return (
      <div 
        key={index}
        className={`progress-bar-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
      />
    )
  })

  return (
    <div className="progress-container">
      <div className="progress-info">
        {phase.name} • Exercice {currentExercise}/{totalExercisesInPhase} • Cycle {currentCycle}/{totalCycles}
      </div>
      <div className="progress-bars">
        {progressBars}
      </div>
    </div>
  )
}
