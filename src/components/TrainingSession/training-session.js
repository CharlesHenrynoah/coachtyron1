'use client'

import { useState, useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Camera, Eye, Trophy, Star, BarChart2 } from 'lucide-react'
import ExerciseCard from './exercise-card'
import ProgressBar from './progress-bar'
import SessionSummary from './session-summary'
import VideoFeed from './video-feed'
import Congratulations from './congratulations'
import './TrainingSession.css'

const exercises = [
  {
    phase: 1,
    name: 'Warm Up',
    repetitions: 2,
    exercises: [
      { id: 1, name: 'Jumping Jacks', duration: 45, videoUrl: '/placeholder.svg?height=720&width=405' },
      { id: 2, name: 'High Knees', duration: 45, videoUrl: '/placeholder.svg?height=720&width=405' },
      { id: 3, name: 'Mountain Climbers', duration: 45, videoUrl: '/placeholder.svg?height=720&width=405' },
    ]
  },
  {
    phase: 2,
    name: 'Strength',
    repetitions: 5,
    exercises: [
      { id: 4, name: 'Push-ups', duration: 45, videoUrl: '/placeholder.svg?height=720&width=405' },
      { id: 5, name: 'Squats', duration: 45, videoUrl: '/placeholder.svg?height=720&width=405' },
      { id: 6, name: 'Lunges', duration: 45, videoUrl: '/placeholder.svg?height=720&width=405' },
      { id: 7, name: 'Plank', duration: 45, videoUrl: '/placeholder.svg?height=720&width=405' },
    ]
  },
  {
    phase: 3,
    name: 'Core',
    repetitions: 3,
    exercises: [
      { id: 8, name: 'Russian Twists', duration: 45, videoUrl: '/placeholder.svg?height=720&width=405' },
      { id: 9, name: 'Bicycle Crunches', duration: 45, videoUrl: '/placeholder.svg?height=720&width=405' },
      { id: 10, name: 'Burpees', duration: 45, videoUrl: '/placeholder.svg?height=720&width=405' },
    ]
  }
]

const backgroundVideoUrl = '/placeholder.svg?height=720&width=405'

export default function TrainingSession() {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentCycle, setCurrentCycle] = useState(1)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isRecovery, setIsRecovery] = useState(false)
  const [isSessionStarted, setIsSessionStarted] = useState(false)
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [isSessionCompleted, setIsSessionCompleted] = useState(false)
  const [xpGained, setXpGained] = useState(0)
  const [showCamera, setShowCamera] = useState(false)

  const currentPhase = exercises[currentPhaseIndex]
  const currentExercise = currentPhase.exercises[currentExerciseIndex]

  // Gérer la fin d'un cycle
  const handleCycleComplete = useCallback(() => {
    if (currentCycle < currentPhase.repetitions) {
      setCurrentCycle(currentCycle + 1)
      setCurrentExerciseIndex(0)
    } else {
      if (currentPhaseIndex < exercises.length - 1) {
        setCurrentPhaseIndex(currentPhaseIndex + 1)
        setCurrentExerciseIndex(0)
        setCurrentCycle(1)
      }
    }
  }, [currentCycle, currentPhase.repetitions, currentPhaseIndex, exercises.length])

  const handlePrevious = useCallback(() => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1)
    } else if (currentCycle > 1) {
      setCurrentCycle(currentCycle - 1)
      setCurrentExerciseIndex(currentPhase.exercises.length - 1)
    } else if (currentPhaseIndex > 0) {
      setCurrentPhaseIndex(currentPhaseIndex - 1)
      const previousPhase = exercises[currentPhaseIndex - 1]
      setCurrentCycle(previousPhase.repetitions)
      setCurrentExerciseIndex(previousPhase.exercises.length - 1)
    }
    setIsRecovery(false)
    setIsTimerRunning(false)
  }, [currentExerciseIndex, currentCycle, currentPhaseIndex, exercises, currentPhase.exercises.length])

  const handleNext = useCallback(() => {
    if (currentExerciseIndex < currentPhase.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
    } else if (currentCycle < currentPhase.repetitions) {
      setCurrentCycle(currentCycle + 1)
      setCurrentExerciseIndex(0)
    } else if (currentPhaseIndex < exercises.length - 1) {
      setCurrentPhaseIndex(currentPhaseIndex + 1)
      setCurrentExerciseIndex(0)
      setCurrentCycle(1)
    } else {
      // Session terminée
      const totalExercises = exercises.reduce((total, phase) => 
        total + (phase.exercises.length * phase.repetitions), 0)
      setXpGained(totalExercises * 10) // 10 XP par exercice
      setIsSessionCompleted(true)
    }
    setIsRecovery(false)
    setIsTimerRunning(false)
  }, [currentExerciseIndex, currentPhase.exercises.length, currentCycle, currentPhase.repetitions, currentPhaseIndex, exercises])

  const handleTimerToggle = useCallback((action) => {
    if (action === 'complete') {
      if (!isRecovery) {
        setIsRecovery(true)
        setTimeout(() => {
          setIsTimerRunning(true)
        }, 10)
      } else {
        setIsRecovery(false)
        handleNext()
        setTimeout(() => {
          setIsTimerRunning(true)
        }, 10)
      }
    } else {
      setIsTimerRunning(action)
    }
  }, [handleNext, isRecovery])

  const startSession = () => {
    setIsSessionStarted(true)
  }

  const completeSession = () => {
    setIsSessionCompleted(true)
    setXpGained(exercises.length * 10)
  }

  const restartSession = () => {
    setCurrentPhaseIndex(0)
    setCurrentExerciseIndex(0)
    setCurrentCycle(1)
    setIsTimerRunning(false)
    setIsSessionStarted(false)
    setIsRecovery(false)
    setIsSessionCompleted(false)
    setXpGained(0)
  }

  // Calculer la progression totale
  const totalExercisesInPhase = currentPhase.exercises.length * currentPhase.repetitions
  const completedExercises = ((currentCycle - 1) * currentPhase.exercises.length) + currentExerciseIndex

  if (!isSessionStarted) {
    return (
      <div className="training-container">
        <SessionSummary exercises={exercises} onStart={startSession} />
      </div>
    )
  }

  if (isSessionCompleted) {
    return (
      <div className="completion-screen">
        <div className="completion-content">
          <div className="completion-icon">
            <Trophy size={64} />
          </div>
          <h1>Congratulations!</h1>
          <p>You've completed your workout</p>
          <div className="xp-gained">
            <Star className="xp-icon" />
            <span>+{xpGained} XP</span>
          </div>
          <button className="restart-button" onClick={restartSession}>
            <BarChart2 size={20} />
            See your stats
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="training-session">
      <ProgressBar
        exercises={exercises}
        currentPhase={currentPhaseIndex}
        currentExercise={currentExerciseIndex + 1}
        currentCycle={currentCycle}
      />
      <button className="eye-button" onClick={() => setShowCamera(true)}>
        <Eye size={24} />
      </button>
      <div className="session-content">
        {showCamera ? (
          <VideoFeed onClose={() => setShowCamera(false)} />
        ) : (
          <ExerciseCard
            exercise={currentExercise}
            isTimerRunning={isTimerRunning}
            onTimerToggle={handleTimerToggle}
            backgroundVideoUrl="/videos/workout.mp4"
            isRecovery={isRecovery}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  )
}
