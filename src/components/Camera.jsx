import { useRef, useEffect, useState } from 'react'
import './Camera.css'

function Camera({ mode, onImageCapture, onBack }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    startCamera()

    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setError(null)
    } catch (err) {
      console.error('Camera access error:', err)
      setError('카메라에 접근할 수 없습니다. 카메라 권한을 확인해주세요.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0)

      const imageData = canvas.toDataURL('image/png')
      onImageCapture(imageData)
      stopCamera()
    }
  }

  if (error) {
    return (
      <div className="camera-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={onBack} className="btn btn-secondary">
            돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="camera-container">
      <div className="camera-header">
        <button onClick={onBack} className="btn btn-back">
          ← 돌아가기
        </button>
        <h2>
          {mode === 'celebrity' ? '닮은 연예인 찾기' : '미래 직업 추천'}
        </h2>
      </div>

      <div className="camera-view">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="camera-video"
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <div className="camera-overlay">
          <div className="face-guide"></div>
        </div>
        <div className="camera-instructions">
          <p>얼굴을 가이드 안에 맞춰주세요</p>
          <p>준비되면 촬영 버튼을 눌러주세요</p>
        </div>
      </div>

      <div className="camera-controls">
        <button onClick={capturePhoto} className="btn btn-capture">
          📷 촬영하기
        </button>
      </div>
    </div>
  )
}

export default Camera

