import { useState, useEffect } from 'react'
import ModeSelection from './components/ModeSelection'
import Camera from './components/Camera'
import Result from './components/Result'
import { analyzeFace } from './utils/faceAnalysis'
import './App.css'

function App() {
  const [mode, setMode] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [capturedFileName, setCapturedFileName] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode)
    setCapturedImage(null)
    setAnalysisResult(null)
    setIsAnalyzing(false)
  }

  const handleImageCapture = (imageData, fileName = null) => {
    setCapturedImage(imageData)
    setCapturedFileName(fileName)
    setAnalysisResult(null)
    setIsAnalyzing(true)
  }

  useEffect(() => {
    if (capturedImage && mode && isAnalyzing && !analysisResult) {
      analyzeFace(capturedImage, mode, capturedFileName)
        .then(result => {
          setAnalysisResult(result)
          setIsAnalyzing(false)
        })
        .catch(err => {
          console.error('Analysis error:', err)
          setIsAnalyzing(false)
        })
    }
  }, [capturedImage, mode, isAnalyzing, analysisResult, capturedFileName])

  const handleReset = () => {
    setMode(null)
    setCapturedImage(null)
    setCapturedFileName(null)
    setAnalysisResult(null)
    setIsAnalyzing(false)
  }

  const handleBack = () => {
    setCapturedImage(null)
    setCapturedFileName(null)
    setAnalysisResult(null)
    setIsAnalyzing(false)
  }

  return (
    <div className="app">
      <div className="app-container">
        <h1 className="app-title">AI 체험 웹앱</h1>
        <p className="app-subtitle">얼굴 이미지로 재미있는 체험을 해보세요!</p>

        {!mode && (
          <ModeSelection onModeSelect={handleModeSelect} />
        )}

        {mode && !capturedImage && (
          <Camera
            mode={mode}
            onImageCapture={handleImageCapture}
            onBack={handleReset}
          />
        )}

        {mode && capturedImage && isAnalyzing && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>이미지를 분석하고 있어요...</p>
            <div className="captured-preview">
              <img src={capturedImage} alt="Captured" className="preview-image" />
            </div>
          </div>
        )}

        {mode && capturedImage && analysisResult && (
          <Result
            mode={mode}
            image={capturedImage}
            result={analysisResult}
            onReset={handleReset}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  )
}

export default App

