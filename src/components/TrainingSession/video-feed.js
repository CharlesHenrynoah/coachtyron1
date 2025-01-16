'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import './video-feed.css'

export default function VideoFeed({ onClose }) {
  const videoRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let stream = null

    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          } 
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setError(null)
        }
      } catch (err) {
        console.error('Error accessing camera:', err)
        setError('Unable to access camera. Please check your permissions.')
      }
    }

    setupCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <div className="video-feed-overlay">
      <div className="video-feed-container">
        <div className="video-feed-header">
          <div className="video-feed-title">
            <span>Coach Tyron</span>
          </div>
          <button className="video-feed-close" onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="video-feed-wrapper">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="video-feed"
          />
          {error && (
            <div className="video-feed-error visible">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
