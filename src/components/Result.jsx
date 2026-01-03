import './Result.css'

function Result({ mode, image, result, onReset, onBack }) {
  return (
    <div className="result-container">
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

