import { useRef, useEffect, useState } from 'react'
import './Camera.css'

function Camera({ mode, onImageCapture, onBack }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)
  const [inputMode, setInputMode] = useState('camera')
  const [previewImage, setPreviewImage] = useState(null)
  const [fileName, setFileName] = useState(null)

  useEffect(() => {
    if (inputMode === 'camera') {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [inputMode])

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
      setPreviewImage(null)
    } catch (err) {
      console.error('Camera access error:', err)
      // 에러 메시지 표시하지 않음, 검은 화면만 표시
      setError(null)
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
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
      onImageCapture(imageData, null) // 카메라 촬영은 파일명 없음
      stopCamera()
    }
  }

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0] || event.dataTransfer?.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('이미지 파일만 업로드할 수 있습니다.')
        return
      }

      // 파일명 저장
      setFileName(file.name)

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target.result
        setPreviewImage(imageData)
        setError(null)
      }
      reader.onerror = () => {
        setError('파일을 읽는 중 오류가 발생했습니다.')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    handleFileSelect(e)
  }

  const handleUploadConfirm = () => {
    if (previewImage) {
      // 이미지 데이터와 파일명을 함께 전달
      onImageCapture(previewImage, fileName)
      setPreviewImage(null)
      setFileName(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
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

      <div className="mode-toggle-container">
        <button
          onClick={() => setInputMode('camera')}
          className={`mode-toggle-btn ${inputMode === 'camera' ? 'active' : ''}`}
        >
          📷 카메라
        </button>
        <button
          onClick={() => setInputMode('upload')}
          className={`mode-toggle-btn ${inputMode === 'upload' ? 'active' : ''}`}
        >
          📁 사진 업로드
        </button>
      </div>

      {inputMode === 'camera' ? (
        <>
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
        </>
      ) : (
        <>
          <div className="upload-view">
            {previewImage ? (
              <div className="upload-preview">
                <img src={previewImage} alt="Preview" className="preview-image" />
                <button
                  onClick={() => {
                    setPreviewImage(null)
                    setFileName(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                  }}
                  className="btn btn-secondary btn-change-image"
                >
                  다른 사진 선택
                </button>
              </div>
            ) : (
              <div 
                className="upload-area"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  id="file-input"
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-input" className="upload-label">
                  <div className="upload-icon">📁</div>
                  <p className="upload-text">사진을 선택하거나 드래그하세요</p>
                  <p className="upload-hint">JPG, PNG 등 이미지 파일</p>
                </label>
              </div>
            )}
            {error && inputMode === 'upload' && (
              <div className="upload-error">
                <p>{error}</p>
              </div>
            )}
          </div>

          <div className="camera-controls">
            {previewImage ? (
              <button onClick={handleUploadConfirm} className="btn btn-capture">
                ✅ 이 사진으로 분석하기
              </button>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-capture"
              >
                📁 사진 선택하기
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Camera
