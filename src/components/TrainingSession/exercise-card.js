'use client'

import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react'
import ProgressBar from './progress-bar'
import './TrainingSession.css'

export default function ExerciseCard({
  exercise,
  isTimerRunning,
  onTimerToggle,
  backgroundVideoUrl,
  isRecovery,
  onPrevious,
  onNext
}) {
  const [timeLeft, setTimeLeft] = useState((isRecovery ? 15 : exercise.duration) * 100)

  const handleTimerComplete = useCallback(() => {
    onTimerToggle('complete')
  }, [onTimerToggle])

  useEffect(() => {
    let interval
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          const newTime = time - 1
          if (newTime <= 0) {
            clearInterval(interval)
            handleTimerComplete()
            return 0
          }
          return newTime
        })
      }, 10)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, handleTimerComplete])

  useEffect(() => {
    setTimeLeft((isRecovery ? 15 : exercise.duration) * 100)
  }, [isRecovery, exercise])

  const formatTime = (centiseconds) => {
    const seconds = Math.floor(centiseconds / 100)
    const remainingCentiseconds = centiseconds % 100
    const tenths = Math.floor(remainingCentiseconds / 10)
    const hundredths = remainingCentiseconds % 10
    return `${seconds.toString().padStart(2, '0')}.${tenths}${hundredths}`
  }

  return (
    <div className="exercise-card">
      <video
        className="video-element"
        src={backgroundVideoUrl}
        autoPlay
        muted
        loop
      />
      <button className="nav-arrow prev" onClick={onPrevious}>
        <ChevronLeft />
      </button>
      <button className="nav-arrow next" onClick={onNext}>
        <ChevronRight />
      </button>
      <div className="exercise-content">
        <h1 className={`exercise-title ${isRecovery ? 'recovery' : ''}`}>
          {isRecovery ? 'Recovery' : exercise.name}
        </h1>
        <div className="exercise-timer">
          <div className={`timer ${isRecovery ? 'recovery' : ''}`}>
            {formatTime(timeLeft)}
          </div>
          {!isRecovery && (
            <div className="recovery-text">+15s recovery</div>
          )}
        </div>
        <button
          className="timer-button"
          onClick={() => onTimerToggle(isTimerRunning ? false : true)}
          aria-label={isTimerRunning ? 'Pause' : 'Start'}
        >
          {isTimerRunning ? <Pause /> : <Play />}
          <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
        </button>
      </div>
    </div>
  )
}
