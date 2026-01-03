// Result Component
import { useRef } from 'react'
import html2canvas from 'html2canvas'
import './Result.css'

function Result({ mode, image, result, onReset, onBack }) {
  const resultRef = useRef(null)

  const handleSaveResult = async () => {
    if (!resultRef.current) return

    try {
      // 결과 영역 캡처
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // 고해상도
        useCORS: true,
        logging: false,
        windowWidth: resultRef.current.scrollWidth,
        windowHeight: resultRef.current.scrollHeight,
      })

      // Canvas를 Blob으로 변환
      canvas.toBlob((blob) => {
        if (!blob) return

        // 다운로드 링크 생성
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        
        // 파일명 생성 (날짜/시간 포함)
        const now = new Date()
        const dateStr = now.toISOString().slice(0, 19).replace(/[:-]/g, '').replace('T', '_')
        const modeStr = mode === 'celebrity' ? '연예인' : '직업'
        link.download = `AI분석결과_${modeStr}_${dateStr}.png`
        
        // 다운로드 실행
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // URL 정리
        setTimeout(() => URL.revokeObjectURL(url), 100)
      }, 'image/png')
    } catch (error) {
      console.error('결과 저장 중 오류 발생:', error)
      alert('결과 저장 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div className="result-container" ref={resultRef}>
      <div className="result-header">
        <button onClick={onBack} className="btn btn-back">
          ← 다시 촬영
        </button>
        <h2>
          {mode === 'celebrity' ? '닮은 연예인 찾기 결과' : '미래 직업 추천 결과'}
        </h2>
      </div>

      <div className="result-image-container">
        <img src={image} alt="Analyzed" className="result-image" />
      </div>

      <div className="result-content">
        {mode === 'celebrity' ? (
          <CelebrityResult result={result} />
        ) : (
          <CareerResult result={result} />
        )}
      </div>

      <div className="ai-limitation-notice">
        <h3>⚠️ AI 한계 및 윤리 안내</h3>
        <ul>
          <li>AI는 얼굴만 보고 적성이나 능력을 알 수 없습니다.</li>
          <li>데이터에 따라 결과가 달라질 수 있습니다.</li>
          <li>이 결과는 참고용 체험이며 정답이 아닙니다.</li>
        </ul>
      </div>

      <div className="result-actions">
        <button onClick={handleSaveResult} className="btn btn-save">
          💾 결과 저장
        </button>
        <button onClick={onReset} className="btn btn-primary">
          처음으로 돌아가기
        </button>
      </div>
    </div>
  )
}

function CelebrityResult({ result }) {
  return (
    <div className="celebrity-result">
      <h3>이미지 분위기 유사 연예인</h3>
      <p className="result-disclaimer">
        * 아래 결과는 이미지 분위기 유사도 예시이며, 정확도가 아닌 시각적 유사도 참고용입니다.
      </p>
      <div className="celebrity-list">
        {result.celebrities.map((celebrity, index) => (
          <div key={index} className="celebrity-item">
            <div className="celebrity-name">{celebrity.name}</div>
            <div className="celebrity-similarity">유사도 {celebrity.similarity}%</div>
            <div className="celebrity-description">{celebrity.description}</div>
          </div>
        ))}
      </div>
      <p className="result-note">
        💡 이 결과는 얼굴형과 표정 분위기의 유사도를 보여주는 것이며, 
        외모 평가나 비교가 아닙니다.
      </p>
    </div>
  )
}

function CareerResult({ result }) {
  return (
    <div className="career-result">
      <h3>이 이미지에서 자주 보이는 직업 분야 예시</h3>
      <p className="result-disclaimer">
        * 아래 결과는 이미지 분위기 기반 참고용 예시입니다.
      </p>
      <div className="career-list">
        {result.careers.map((career, index) => (
          <div key={index} className="career-item">
            <div className="career-field">{career.field}</div>
            <div className="career-description">{career.description}</div>
          </div>
        ))}
      </div>
      <p className="career-important-note">
        ⭐ 직업 선택은 얼굴이 아니라 관심과 노력에 따라 달라집니다.
      </p>
    </div>
  )
}

export default Result

