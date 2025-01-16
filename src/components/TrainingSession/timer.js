import { useEffect, useState } from 'react'

export default function Timer({ duration, isRunning, isRecovery, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const recoveryTime = 15 // 15 seconds recovery time

  useEffect(() => {
    setTimeLeft(isRecovery ? recoveryTime : duration)
  }, [duration, isRecovery])

  useEffect(() => {
    let interval

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      onComplete()
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft, onComplete])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center">
      <div className={`text-4xl font-bold ${isRecovery ? 'text-green-400' : 'text-white'}`}>
        {formatTime(timeLeft)}
      </div>
      {!isRecovery && (
        <div className="text-lg ml-2 text-white">+15s recovery</div>
      )}
    </div>
  )
}
